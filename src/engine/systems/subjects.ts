// PB-03a: subjects (chư hầu) — owner 2026-11-23: "a sovereign empire's tribute is too small; make subjects like
// Victoria 3". Victoria 3's subject relationships are the mechanical reference (CG-48 research); code, names and
// numbers are original.
//
// Every subject type has an autonomy tier, a base payment (share of the subject's government income paid to the
// overlord each month), diplomatic freedom and an annexation rule. A subject's **liberty desire** (0–100) moves
// every month from named, visible factors; at 75+ an AI subject asks for more autonomy, and a subject kept at 90+
// may fight for independence. Overlords act on subjects through pacts (raise/reduce payments, knowledge sharing,
// exemption from service, regime support) and autonomy changes, annexation or release.
import { clamp, getRel, log } from '../core';
import { data } from '../data/db';
import { declareWar, infamyTier, powerScore } from './diplomacy';
import { annexCountry } from '../world';
import type { Country, GameState, JournalEntry } from '../types';

export interface SubjectTypeDef {
  /** 0 = low, 1 = medium, 2 = high autonomy. */
  autonomy: 0 | 1 | 2;
  /** Base share of the subject's government income paid to the overlord each month. */
  pay: number;
  /** May the subject conduct its own diplomacy (alliances, its own subjects)? */
  diplomacy: boolean;
  /** May the overlord annex it once liberty desire is low? */
  annexable: boolean;
  /** One step more / less autonomous (null = none). */
  more: string | null; less: string | null;
}
export const SUBJECT_TYPES: Record<string, SubjectTypeDef> = {
  puppet: { autonomy: 0, pay: 0.25, diplomacy: false, annexable: true, more: 'dominion', less: null },
  vassal: { autonomy: 0, pay: 0.25, diplomacy: false, annexable: true, more: 'autonomous_vassal', less: null },
  colony: { autonomy: 0, pay: 0.25, diplomacy: false, annexable: true, more: 'dominion', less: null },
  princely_state: { autonomy: 0, pay: 0.15, diplomacy: false, annexable: true, more: 'dominion', less: null },
  chartered_company: { autonomy: 1, pay: 0.15, diplomacy: true, annexable: false, more: 'dominion', less: 'colony' },
  dominion: { autonomy: 1, pay: 0.20, diplomacy: true, annexable: false, more: 'protectorate', less: 'puppet' },
  autonomous_vassal: { autonomy: 1, pay: 0.15, diplomacy: true, annexable: false, more: 'tributary', less: 'vassal' },
  personal_union: { autonomy: 1, pay: 0, diplomacy: false, annexable: false, more: null, less: null },
  protectorate: { autonomy: 2, pay: 0.05, diplomacy: true, annexable: false, more: null, less: 'dominion' },
  tributary: { autonomy: 2, pay: 0.10, diplomacy: true, annexable: false, more: null, less: 'autonomous_vassal' },
};
const def = (t: string | null) => SUBJECT_TYPES[t ?? ''] ?? SUBJECT_TYPES.protectorate;

/** Design parameters (PB-03a). Liberty desire moves monthly. */
export const SUBJECT = {
  payStep: 0.10, payAdjMin: -0.10, payAdjMax: 0.10, payCap: 0.40,
  base: 0.6, relationScale: 150, raisedPay: 4, reducedPay: 2, powerPivot: 0.5, powerScale: 2, powerMin: -0.3, powerMax: 0.6,
  sameCulture: -0.2, foreignCulture: 0.2, crushed: 35, notorious: 0.3, pariah: 1.0, sharedMarket: -0.2,
  knowledge: -0.3, exempt: -0.3, support: -0.4, supportCost: 0.05, postwar: 0.5, postwarYear: 1945,
  requestAt: 75, independenceAt: 90, independenceMonths: 12, annexBelow: 25, reduceBelow: 25,
  autonomyCooldown: 60, refusalWindow: 60, annexOthers: 10, requestMonths: 6,
  knowledgeResearch: 0.10,
} as const;

export interface SubjectPact {
  liberty: number; payAdj: number; knowledge?: boolean; exempt?: boolean; support?: boolean;
  lastAutonomy?: number; refusedAt?: number; highMonths?: number;
  /** An independence war is under way (cleared when it ends). */
  rising?: boolean;
  /** Last month's payment (subject → overlord) and liberty change, for the UI. */
  paid?: number; change?: number;
}

/** The subject's pact, created on first use (liberty starts from relations and autonomy). */
export function pactOf(st: GameState, c: Country): SubjectPact {
  if (!c.subjectPact) c.subjectPact = { liberty: clamp(35 - getRel(st, c.id, c.overlord!) / 4, 5, 60), payAdj: 0 };
  return c.subjectPact;
}

/** Share of the subject's income paid this month, after pacts and the overlord's bloc. */
export function paymentRate(st: GameState, c: Country): number {
  if (!c.overlord) return 0;
  const p = pactOf(st, c); const o = st.countries[c.overlord];
  const base = def(c.subjectType).pay;
  if (base <= 0) return 0;
  return clamp((base + p.payAdj) * (1 + (o?.blocMods?.subjectPay ?? 0)), 0, SUBJECT.payCap);
}

export interface LibertyParts { base: number; relations: number; payments: number; power: number; culture: number; infamy: number; market: number; pacts: number; bloc: number; era: number }
/** The named factors of a subject's monthly liberty-desire change (before saturation). */
export function libertyParts(st: GameState, c: Country): LibertyParts | null {
  const o = c.overlord ? st.countries[c.overlord] : undefined; if (!o) return null;
  const p = pactOf(st, c);
  const cap = (x: Country) => st.regions[data().regionIndex.get(x.capital) ?? -1];
  const sc = cap(c), oc = cap(o);
  const tier = infamyTier(o);
  const sharedMarket = (c.customsUnion && c.customsUnion === o.customsUnion) || c.subjectType === 'chartered_company';
  return {
    base: SUBJECT.base,
    relations: clamp(-getRel(st, c.id, o.id) / SUBJECT.relationScale, -0.5, 0.5),
    payments: p.payAdj > 0 ? p.payAdj * SUBJECT.raisedPay : p.payAdj * SUBJECT.reducedPay,
    // a subject far weaker than its overlord feels protected; one approaching its strength wants out
    power: clamp((powerScore(st, c) / Math.max(1, powerScore(st, o)) - SUBJECT.powerPivot) * SUBJECT.powerScale, SUBJECT.powerMin, SUBJECT.powerMax),
    culture: sc && oc && sc.culture === oc.culture ? SUBJECT.sameCulture : SUBJECT.foreignCulture,
    infamy: tier === 'pariah' ? SUBJECT.pariah : tier === 'notorious' ? SUBJECT.notorious : 0,
    market: sharedMarket ? SUBJECT.sharedMarket : 0,
    pacts: (p.knowledge ? SUBJECT.knowledge : 0) + (p.exempt ? SUBJECT.exempt : 0) + (p.support ? SUBJECT.support : 0),
    bloc: o.blocMods?.liberty ?? 0,
    era: st.date.y >= SUBJECT.postwarYear ? SUBJECT.postwar : 0,
  };
}
/** Monthly change after saturation: pressure slows near the ends of the scale. */
export function libertyChange(st: GameState, c: Country): number {
  const parts = libertyParts(st, c); if (!parts) return 0;
  const raw = Object.values(parts).reduce((a, b) => a + b, 0);
  const L = pactOf(st, c).liberty;
  // a sovereign empire's hold: positive pressure on its subjects is damped
  const damp = st.countries[c.overlord!]?.blocMods?.libertyDamp ?? 0;
  return raw > 0 ? raw * (1 - damp) * (1 - L / 120) : raw * (0.5 + L / 200);
}

/** Monthly: payments, liberty desire, requests and independence. Runs after the economy. */
export function subjectsMonth(st: GameState): void {
  for (const c of Object.values(st.countries)) {
    if (!c.alive) continue;
    if (!c.overlord || !st.countries[c.overlord]?.alive) { if (c.subjectPact) delete c.subjectPact; continue; }
    const o = st.countries[c.overlord]; const p = pactOf(st, c);
    // a rising that ended with the subject still bound was crushed: liberty desire falls back
    if (p.rising && !atWarWith(st, c.id, o.id)) { p.rising = false; p.liberty = Math.min(p.liberty, SUBJECT.crushed); }
    // payment: a share of this month's government income
    const amt = atWarWith(st, c.id, o.id) ? 0 : Math.max(0, c.income) * paymentRate(st, c);
    if (amt > 0) { c.treasury -= amt; if (c.treasury < 0) { c.debt += -c.treasury; c.treasury = 0; } o.treasury += amt; }
    p.paid = amt;
    // regime support costs the overlord a share of the subject's income
    if (p.support) { const cost = Math.max(0, c.income) * SUBJECT.supportCost; o.treasury -= cost; c.treasury += cost; }
    // liberty desire
    p.change = libertyChange(st, c);
    p.liberty = clamp(p.liberty + p.change, 0, 100);
    p.highMonths = p.liberty >= SUBJECT.independenceAt ? (p.highMonths ?? 0) + 1 : Math.min(0, p.highMonths ?? 0) + (p.highMonths && p.highMonths < 0 ? 1 : 0);
    if (c.id === st.player) continue; // the player decides for itself (requests and independence are its actions)
    // 75+: ask for more autonomy (an AI overlord decides; the player overlord gets a journal entry)
    const t = def(c.subjectType);
    if (p.liberty >= SUBJECT.requestAt && t.more && st.tick - (p.lastAutonomy ?? -999) >= SUBJECT.autonomyCooldown && st.tick - (p.refusedAt ?? -999) >= SUBJECT.refusalWindow) {
      if (o.id === st.player) {
        if (!(st.journal ?? []).some((j) => j.kind === 'subject_request' && j.event === c.id && j.status === 'active')) {
          const j: JournalEntry = { id: `js_${c.id}_${st.tick}`, kind: 'subject_request', event: c.id, country: o.id, started: st.tick, expires: st.tick + SUBJECT.requestMonths, status: 'active' };
          (st.journal ??= []).push(j);
          log(st, { type: 'decision', text: `${c.name} asks for more autonomy.`, textVi: `${c.nameVi} đòi được tự trị hơn.`, actors: [c.id, o.id] });
        }
        p.lastAutonomy = st.tick; // one request per cooldown
      } else if (st.mode === 'historical') { /* AI–AI relations in Historical Mode keep their recorded form */ }
      else if (powerScore(st, c) >= powerScore(st, o) * 0.25 || p.liberty >= 85) changeAutonomy(st, c, +1);
      else { p.refusedAt = st.tick; p.lastAutonomy = st.tick; }
    }
    // 90+ for a year with no autonomy left to gain, or after a refusal: an independence war. In Historical Mode
    // an AI overlord's subjects follow history (decolonisation records); against the player they may rise.
    const cornered = !t.more || st.tick - (p.refusedAt ?? -999) < SUBJECT.refusalWindow;
    if ((p.highMonths ?? 0) >= SUBJECT.independenceMonths && cornered && (st.mode === 'sandbox' || o.id === st.player)) demandIndependence(st, c);
  }
  if (st.date.m === 1) aiOverlords(st);
}

/** One step more (+1) or less (−1) autonomous. */
export function changeAutonomy(st: GameState, c: Country, dir: 1 | -1): boolean {
  const t = def(c.subjectType); const next = dir > 0 ? t.more : t.less; if (!next || !c.overlord) return false;
  const p = pactOf(st, c);
  const from = c.subjectType; c.subjectType = next; p.lastAutonomy = st.tick;
  p.liberty = clamp(p.liberty + (dir > 0 ? -30 : 15), 0, 100);
  log(st, { type: 'diplomacy', text: `${c.name} becomes a ${next} of ${st.countries[c.overlord].name} (was ${from}).`, textVi: `${c.nameVi} chuyển từ ${from} sang ${next} của ${st.countries[c.overlord].nameVi}.`, actors: [c.id, c.overlord] });
  return true;
}

const atWarWith = (st: GameState, a: string, b: string) => st.wars.some((w) => (w.attackers.members.includes(a) && w.defenders.members.includes(b)) || (w.attackers.members.includes(b) && w.defenders.members.includes(a)));

/** The subject fights for independence. */
export function demandIndependence(st: GameState, c: Country): boolean {
  const o = c.overlord; if (!o) return false;
  if (atWarWith(st, c.id, o)) return false;
  // the bond holds until the war is won (military.applyGoal frees the subject); a lost war leaves it a subject
  const p = pactOf(st, c); p.highMonths = -60; p.rising = true; // no second rising for five years
  const w = declareWar(st, c.id, o, [{ by: c.id, type: 'independence', target: o, regions: [] }], `${c.name} War of Independence`, 'independence');
  log(st, { type: 'war', text: `${c.name} rises for independence from ${st.countries[o].name}.`, textVi: `${c.nameVi} nổi dậy giành độc lập khỏi ${st.countries[o].nameVi}.`, actors: [c.id, o] });
  return !!w;
}

export type SubjectAction = 'raise_pay' | 'reduce_pay' | 'knowledge' | 'exempt' | 'support' | 'more_autonomy' | 'less_autonomy' | 'annex' | 'release';
/** Why an overlord action is not available (null = available). */
export function subjectActionBlocker(st: GameState, overlord: string, target: string, a: SubjectAction): string | null {
  const c = st.countries[target];
  if (!c?.alive || c.overlord !== overlord) return 'Not your subject';
  const p = pactOf(st, c); const t = def(c.subjectType);
  switch (a) {
    case 'raise_pay': return t.pay <= 0 ? 'This subject pays nothing' : p.payAdj >= SUBJECT.payAdjMax ? 'Payments are already raised' : p.liberty >= SUBJECT.requestAt ? 'Liberty desire is too high' : null;
    case 'reduce_pay': return t.pay <= 0 ? 'This subject pays nothing' : p.payAdj <= SUBJECT.payAdjMin ? 'Payments are already reduced' : null;
    case 'knowledge': case 'exempt': case 'support': return null; // toggles
    case 'more_autonomy': return t.more ? null : 'Already the most autonomous form';
    case 'less_autonomy': return !t.less ? 'No less autonomous form' : p.liberty >= SUBJECT.reduceBelow ? `Liberty desire must be below ${SUBJECT.reduceBelow}` : st.tick - (p.lastAutonomy ?? -999) < SUBJECT.autonomyCooldown ? 'Autonomy changed recently' : null;
    case 'annex': return !t.annexable ? 'This form of subject cannot be annexed' : p.liberty >= (st.countries[overlord].blocMods?.annexBelow ?? SUBJECT.annexBelow) ? 'Liberty desire is too high' : null;
    case 'release': return null;
  }
}
export function subjectAction(st: GameState, overlord: string, target: string, a: SubjectAction): string | null {
  const why = subjectActionBlocker(st, overlord, target, a); if (why) return why;
  const c = st.countries[target]; const p = pactOf(st, c);
  switch (a) {
    case 'raise_pay': p.payAdj = clamp(p.payAdj + SUBJECT.payStep, SUBJECT.payAdjMin, SUBJECT.payAdjMax); break;
    case 'reduce_pay': p.payAdj = clamp(p.payAdj - SUBJECT.payStep, SUBJECT.payAdjMin, SUBJECT.payAdjMax); break;
    case 'knowledge': p.knowledge = !p.knowledge; break;
    case 'exempt': p.exempt = !p.exempt; break;
    case 'support': p.support = !p.support; break;
    case 'more_autonomy': changeAutonomy(st, c, +1); break;
    case 'less_autonomy': changeAutonomy(st, c, -1); break;
    case 'annex': {
      annexCountry(st, target, overlord, 'annexation');
      for (const s of Object.values(st.countries)) if (s.alive && s.overlord === overlord && s.subjectPact) s.subjectPact.liberty = clamp(s.subjectPact.liberty + SUBJECT.annexOthers, 0, 100);
      log(st, { type: 'diplomacy', text: `${st.countries[overlord].name} annexes ${c.name}.`, textVi: `${st.countries[overlord].nameVi} sáp nhập ${c.nameVi}.`, actors: [overlord, target] });
      break;
    }
    case 'release': c.overlord = null; c.subjectType = null; delete c.subjectPact; log(st, { type: 'diplomacy', text: `${c.name} is granted independence.`, textVi: `${c.nameVi} được trao độc lập.`, actors: [target, overlord] }); break;
  }
  return null;
}

/** Journal: the player overlord answers a subject's request for autonomy. */
export function answerSubjectRequest(st: GameState, j: JournalEntry, accept: boolean): { ok: boolean; reason?: string } {
  const c = st.countries[j.event];
  if (!c?.alive || c.overlord !== j.country) return { ok: false, reason: 'No longer your subject' };
  if (accept) changeAutonomy(st, c, +1);
  else { const p = pactOf(st, c); p.refusedAt = st.tick; p.liberty = clamp(p.liberty + 10, 0, 100); }
  return { ok: true };
}

/** AI overlords (yearly): squeeze contented subjects, relieve restless ones; Sandbox only annexes. */
function aiOverlords(st: GameState): void {
  for (const c of Object.values(st.countries)) {
    if (!c.alive || !c.overlord || c.overlord === st.player || !st.countries[c.overlord]?.alive) continue;
    const p = pactOf(st, c); const o = c.overlord;
    if (p.liberty < 30 && !subjectActionBlocker(st, o, c.id, 'raise_pay')) subjectAction(st, o, c.id, 'raise_pay');
    else if (p.liberty > 60 && p.payAdj > SUBJECT.payAdjMin) subjectAction(st, o, c.id, 'reduce_pay');
    if (p.liberty > 55 && !p.knowledge) p.knowledge = true;
    if (p.liberty > 75 && !p.support) p.support = true;
    if (p.liberty < 35) { p.support = false; }
    if (st.mode === 'sandbox' && p.liberty < 15 && !subjectActionBlocker(st, o, c.id, 'annex') && powerScore(st, c) < powerScore(st, st.countries[o]) * 0.1) subjectAction(st, o, c.id, 'annex');
  }
}
