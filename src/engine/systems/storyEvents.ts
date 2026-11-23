// EVT-01: story events — data-driven events with options for every country (owner 2026-11-23: "events for every
// country, like Victoria 3, the more the better"). Schema: docs/spec/STORY_EVENTS_SCHEMA_VI.md; data:
// historical_data/events/story/*.json (flattened into db.story_events by tools/build-data.ts).
//
// Each month, every event whose mode, window, chain and conditions hold fires with probability 1/mtth (or on its
// fire_date). Generic events use roles ($self, $owner, $colony, $nation, $subject, $overlord, $supporter) bound to a
// matching situation. The player chooses through the journal (pending story events); the AI picks by weight
// (×4 for the historical option in Historical Mode, times its modifiers). Each (event, binding) fires once.
import { clamp, addRel, dateStr, log, rand } from '../core';
import { data } from '../data/db';
import { evalCondition } from '../historical';
import type { StoryEvent, StoryEventOption, StoryJournal, LawGroup } from '../data/dbTypes';
import { MOD_KEYS } from '../mods';
import type { Country, GameState } from '../types';
import { setLaw } from './politics';
import { declareWar, greatPowers } from './diplomacy';
import { createIndependentState, eraWave, setEmbargo, supportMovement } from './independence';
import { changeAutonomy, pactOf, SUBJECT } from './subjects';
import { blocOf } from './powerBlocs';
import { campOfCountry } from './blocs';
import { makeSubject, transferRegion } from '../world';

/** Design parameters (EVT-01). */
export const STORY = { historicalWeight: 4, playerMonths: 12, maxPerCountryPerMonth: 1 } as const;

/** A timed modifier from an event (V3-style buff/debuff): `effects` are keys of mods.MOD_KEYS. */
export interface Modifier { id: string; name_vi: string; name_en?: string; start: number; until: number; decaying?: boolean; effects: Record<string, number>; source?: string }
/** A running story journal (V3-style journal entry with progress and complete/fail conditions). */
export interface StoryJournalState { id: string; country: string; started: number; progress: number; bindings: Record<string, string | string[]> }
export interface PendingStory { id: string; event: string; country: string; bindings: Record<string, string | string[]>; firedAt: number; expires: number }
type Bindings = Record<string, string | string[]>;

const events = (): StoryEvent[] => data().db.story_events ?? [];
const C = (st: GameState, id: unknown) => st.countries[String(id)];

/** Replace $roles in a condition/effect tree with their bound values (a region-list role is flattened). */
function bind<T>(x: T, b: Bindings): T {
  if (typeof x === 'string') return (x.startsWith('$') && b[x.slice(1)] !== undefined ? b[x.slice(1)] : x) as T;
  if (Array.isArray(x)) return x.flatMap((v) => { const r = bind(v, b); return Array.isArray(r) && typeof v === 'string' ? r : [r]; }) as T;
  if (x && typeof x === 'object') return Object.fromEntries(Object.entries(x).map(([k, v]) => [k, bind(v, b)])) as T;
  return x;
}

/** Story conditions (new types), falling back to the shared historical conditions. */
export function storyCondition(st: GameState, c: Record<string, any>): boolean {
  const n = (v: unknown) => Number(v);
  switch (c.type) {
    case 'year_between': return st.date.y >= n(c.from ?? -1e9) && st.date.y <= n(c.to ?? 1e9);
    case 'is_player': return c.entity === st.player;
    case 'is_ai': return !!C(st, c.entity)?.alive && c.entity !== st.player;
    case 'movement_strength_above': return Object.values(st.movements ?? {}).some((m) => m.owner === c.owner && (!c.nation || m.nation === c.nation) && (!c.regions || (c.regions as string[]).some((r) => m.regions.includes(r))) && m.strength > n(c.value));
    case 'wave_above': return eraWave(st.date.y) > n(c.value);
    case 'subject_of': return C(st, c.a)?.overlord === c.b;
    case 'liberty_above': { const s = C(st, c.subject); return !!s?.overlord && pactOf(st, s).liberty > n(c.value); }
    case 'at_war': return st.wars.some((w) => w.attackers.members.includes(c.entity) || w.defenders.members.includes(c.entity));
    case 'war_exhaustion_above': return (C(st, c.entity)?.warExhaustion ?? 0) > n(c.value);
    case 'embargoed': return (st.embargoes ?? []).filter((e) => e.target === c.entity).length >= n(c.min ?? 1);
    case 'relation_above': return (st.relations[[c.a, c.b].sort().join('|')] ?? 0) > n(c.value);
    case 'relation_below': return (st.relations[[c.a, c.b].sort().join('|')] ?? 0) < n(c.value);
    case 'bloc_camp': return campOfCountry(st, c.entity) === c.camp;
    case 'in_power_bloc': return !!blocOf(st, c.entity);
    case 'treasury_months_above': { const x = C(st, c.entity); return !!x && x.treasury / Math.max(1, x.income) > n(c.value); }
    case 'event_fired': return (st.storyFired ?? []).some((k) => k === c.id || k.startsWith(`${c.id}|`));
    case 'event_not_fired': return !(st.storyFired ?? []).some((k) => k === c.id || k.startsWith(`${c.id}|`));
    case 'flag': return (st.flags ?? []).includes(c.flag);
    case 'not_flag': return !(st.flags ?? []).includes(c.flag);
    case 'colonies_count_above': return Object.values(st.movements ?? {}).filter((m) => m.owner === c.entity).reduce((s, m) => s + m.regions.length, 0) > n(c.value);
    case 'any': return (c.of as Record<string, any>[]).some((x) => storyCondition(st, x));
    case 'all': return (c.of as Record<string, any>[]).every((x) => storyCondition(st, x));
    case 'journal_active': return (st.storyJournals ?? []).some((j) => j.id === c.id);
    case 'progress_at_least': return false; // only meaningful inside a story journal (see journalCond)
    default: return evalCondition(st, c as Parameters<typeof evalCondition>[1]);
  }
}

/** Candidate bindings of an event for one country ($self) — one per matching movement/subject when used. */
function candidateBindings(st: GameState, e: StoryEvent, self: Country): Bindings[] {
  const text = JSON.stringify([e.trigger, e.options]);
  const base: Bindings = { self: self.id, ...(self.overlord ? { overlord: self.overlord } : {}) };
  if (/\$(colony|nation|supporter)/.test(text) || (/\$owner/.test(text) && !/\$subject/.test(text))) {
    // a movement in $self's colonies, or (for a colony's own events) a movement of which $self is the people
    return Object.values(st.movements ?? {}).filter((m) => m.owner === self.id).map((m) => ({ ...base, owner: m.owner, colony: m.regions, nation: m.nation, ...(m.supporters[0] ? { supporter: m.supporters[0] } : {}) }));
  }
  if (/\$subject/.test(text)) return Object.values(st.countries).filter((x) => x.alive && x.overlord === self.id).map((x) => ({ ...base, subject: x.id }));
  return [base];
}
const bindKey = (b: Bindings) => [b.self, b.nation, b.subject].filter(Boolean).join('|');

function available(st: GameState, e: StoryEvent): boolean {
  if (e.mode === 'historical' && st.mode !== 'historical') return false;
  if (e.mode === 'sandbox' && st.mode !== 'sandbox') return false;
  const today = dateStr(st.date);
  if (e.window && (today < e.window[0] || today > e.window[1])) return false;
  if (e.chain?.after?.some((id) => !(st.storyFired ?? []).some((k) => k === id || k.startsWith(`${id}|`)))) return false;
  return true;
}

/** Monthly: timed modifiers, story journals, then events. */
export function storyEventsMonth(st: GameState): void {
  modifiersMonth(st);
  journalsMonth(st);
  const all = events(); if (!all.length) { expirePlayer(st); return; }
  st.storyFired ??= [];
  const fired = new Set(st.storyFired);
  const firedThisMonth = new Set<string>();
  const today = dateStr(st.date);
  for (const e of all) {
    if (!available(st, e)) continue;
    const countries = e.country.startsWith('$') ? Object.values(st.countries).filter((x) => x.alive && !x.decentralized) : [st.countries[e.country]].filter((x) => x?.alive);
    for (const self of countries) {
      if (firedThisMonth.has(self.id) && STORY.maxPerCountryPerMonth <= 1) continue;
      for (const b of candidateBindings(st, e, self)) {
        const key = `${e.id}|${bindKey(b)}`;
        if (fired.has(key) || fired.has(e.id)) continue;
        const conds = bind(e.trigger?.conditions ?? [], b);
        if (!conds.every((c) => storyCondition(st, c))) continue;
        const due = e.trigger?.fire_date ? today >= e.trigger.fire_date : rand(st) < 1 / Math.max(1, e.trigger?.mtth_months ?? 1);
        if (!due) continue;
        fire(st, e, b, key);
        fired.add(key); firedThisMonth.add(self.id);
        break;
      }
    }
  }
  expirePlayer(st);
}

function fire(st: GameState, e: StoryEvent, b: Bindings, key: string): void {
  (st.storyFired ??= []).push(key);
  if (e.chain?.flag && !(st.flags ??= []).includes(e.chain.flag)) st.flags.push(e.chain.flag);
  const who = String(b.self);
  if (who === st.player) {
    (st.pendingStory ??= []).push({ id: `ps_${st.tick}_${(st.pendingStory?.length ?? 0)}`, event: e.id, country: who, bindings: b, firedAt: st.tick, expires: st.tick + STORY.playerMonths });
    log(st, { type: 'decision', text: e.title_en ?? e.title_vi, textVi: e.title_vi, actors: [who] });
    return;
  }
  const opt = aiOption(st, e, b);
  applyOption(st, e, opt, b);
}

/** The AI's pick: weights × historical bonus × modifiers, drawn with the seeded RNG. */
export function aiOption(st: GameState, e: StoryEvent, b: Bindings): StoryEventOption {
  const w = e.options.map((o) => {
    let x = Math.max(0.01, o.ai_weight ?? 1);
    if (o.historical && st.mode === 'historical') x *= STORY.historicalWeight;
    for (const m of o.ai_modifiers ?? []) if (storyCondition(st, bind(m.if, b))) x *= m.factor;
    return x;
  });
  let r = rand(st) * w.reduce((a, x) => a + x, 0);
  for (let i = 0; i < w.length; i++) { r -= w[i]; if (r <= 0) return e.options[i]; }
  return e.options[e.options.length - 1];
}

/** Player command: answer a pending story event. */
export function answerStory(st: GameState, pendingId: string, optionId: string): { ok: boolean; reason?: string } {
  const i = (st.pendingStory ?? []).findIndex((p) => p.id === pendingId);
  if (i < 0) return { ok: false, reason: 'No such pending event' };
  const p = st.pendingStory![i]; const e = events().find((x) => x.id === p.event);
  const opt = e?.options.find((o) => o.id === optionId);
  if (!e || !opt) return { ok: false, reason: 'Unknown option' };
  st.pendingStory!.splice(i, 1);
  applyOption(st, e, opt, p.bindings);
  return { ok: true };
}

/** Unanswered player events resolve with the AI's pick when they expire. */
function expirePlayer(st: GameState): void {
  for (const p of [...(st.pendingStory ?? [])]) {
    if (st.tick < p.expires) continue;
    const e = events().find((x) => x.id === p.event);
    st.pendingStory = st.pendingStory!.filter((x) => x !== p);
    if (e) applyOption(st, e, aiOption(st, e, p.bindings), p.bindings);
  }
}

function applyOption(st: GameState, e: StoryEvent, o: StoryEventOption, b: Bindings): void {
  for (const raw of o.effects) { try { applyEffect(st, bind(raw, b) as Record<string, any>, e.id); } catch { /* a stale target (e.g. a state that no longer exists) skips that effect */ } }
  const actor = String(b.self);
  log(st, { type: 'decision', text: `${C(st, actor)?.name ?? actor}: ${e.title_en ?? e.title_vi} — ${o.label_en ?? o.label_vi}.`, textVi: `${C(st, actor)?.nameVi ?? actor}: ${e.title_vi} — ${o.label_vi}.`, actors: [actor], historical: o.historical, divergence: st.mode === 'historical' && e.mode === 'historical' && !o.historical });
}

/** One effect. Unknown types are ignored (the build reports schema problems). */
export function applyEffect(st: GameState, e: Record<string, any>, source: string): void {
  const d = data(); const n = (v: unknown) => Number(v);
  const regionsOf = (x: Record<string, any>) => (x.regions as string[] | undefined) ?? (x.region ? [x.region] : []);
  switch (e.type) {
    // shared with decision windows
    case 'set_law': setLaw(st, C(st, e.entity), e.group as LawGroup, e.value, `event: ${source}`); break;
    case 'legitimacy': { const c = C(st, e.entity); if (c) c.legitimacy = clamp(c.legitimacy + n(e.delta), 0, 100); break; }
    case 'legitimacy_crisis': { const c = C(st, e.entity); if (c) c.crisis = { until: st.tick + n(e.months), delta: n(e.delta), source }; break; }
    case 'relation': addRel(st, e.a, e.b, n(e.delta)); break;
    case 'drop_claims': { const c = C(st, e.entity); if (c) c.claims = c.claims.filter((r) => st.regions[d.regionIndex.get(r)!]?.owner !== e.against); break; }
    case 'transfer_region': if (C(st, e.to)?.alive) transferRegion(st, e.region, e.to, source); break;
    case 'regime_change': { const c = C(st, e.entity); if (c) { for (const [g, v] of Object.entries(e.laws ?? {})) setLaw(st, c, g as LawGroup, v as string, `event: ${source}`); c.regimeChangedAt = st.tick; } break; }
    case 'ig_approval': { const c = C(st, e.entity); const ig = c?.igs[e.ig as keyof Country['igs']]; if (ig) ig.approval = clamp(ig.approval + n(e.delta), -10, 10); break; }
    // EVT-01
    case 'movement': for (const m of Object.values(st.movements ?? {})) if (m.owner === e.owner && (!e.nation || m.nation === e.nation) && (!e.regions || regionsOf(e).some((r) => m.regions.includes(r)))) m.strength = clamp(m.strength + n(e.delta), 0, 100); break;
    case 'grant_independence': createIndependentState(st, e.owner, regionsOf(e), e.nation ?? 'independent', e.mode ?? 'full', e.name_en ? { en: e.name_en, vi: e.name_vi ?? e.name_en } : undefined); break;
    case 'make_subject': if (C(st, e.subject)?.alive && C(st, e.overlord)?.alive) makeSubject(st, e.subject, e.overlord, e.subject_type ?? 'protectorate'); break;
    case 'subject_type': { const s = C(st, e.subject); if (s?.overlord) { s.subjectType = e.to; pactOf(st, s).lastAutonomy = st.tick; } break; }
    case 'subject_liberty': { const s = C(st, e.subject); if (s?.overlord) { const p = pactOf(st, s); p.liberty = clamp(p.liberty + n(e.delta), 0, 100); } break; }
    case 'subject_payment': { const s = C(st, e.subject); if (s?.overlord) { const p = pactOf(st, s); p.payAdj = clamp(p.payAdj + n(e.delta), SUBJECT.payAdjMin, SUBJECT.payAdjMax); } break; }
    case 'subject_autonomy': { const s = C(st, e.subject); if (s?.overlord) changeAutonomy(st, s, n(e.dir) >= 0 ? 1 : -1); break; }
    case 'treasury': { const c = C(st, e.entity); if (c) c.treasury = Math.max(0, c.treasury + Math.max(0, c.income) * n(e.months_income)); break; }
    case 'war_exhaustion': { const c = C(st, e.entity); if (c) c.warExhaustion = clamp(c.warExhaustion + n(e.delta), 0, 100); break; }
    case 'prestige': { const c = C(st, e.entity); if (c) c.prestige += n(e.delta); break; }
    case 'infamy': { const c = C(st, e.entity); if (c) c.infamy = Math.max(0, c.infamy + n(e.delta)); break; }
    case 'radicalism': case 'nationalism': {
      const key = e.type === 'radicalism' ? 'radical' : 'nationalism';
      const regs = e.regions ? regionsOf(e) : st.regions.filter((r) => r.owner === e.entity).map((r) => r.id);
      for (const id of regs) { const r = st.regions[d.regionIndex.get(id) ?? -1]; if (r) r[key] = clamp(r[key] + n(e.delta), 0, 0.95); }
      break;
    }
    case 'embargo': setEmbargo(st, e.by, e.target, e.on !== false); break;
    case 'support_movement': { const m = Object.entries(st.movements ?? {}).find(([, x]) => x.owner === e.owner && (!e.nation || x.nation === e.nation)); if (m) supportMovement(st, e.by, m[0], e.on !== false); break; }
    case 'alliance': if (!st.treaties.some((t) => t.type === 'alliance' && t.members.length === 2 && t.members.includes(e.a) && t.members.includes(e.b))) st.treaties.push({ id: `evt_${e.a}_${e.b}_${st.tick}`, type: 'alliance', members: [e.a, e.b], leader: e.a, start: st.tick, source: 'event' }); break;
    case 'base_rights': addRel(st, e.host, e.user, 15); if (!st.treaties.some((t) => t.source === 'base' && t.members.includes(e.host) && t.members.includes(e.user))) st.treaties.push({ id: `base_${e.user}_${e.host}_${st.tick}`, type: 'guarantee', members: [e.user, e.host], start: st.tick, source: 'base' }); break;
    case 'customs_union_join': { const c = C(st, e.entity), w = C(st, e.with); const u = w?.customsUnion ? st.treaties.find((t) => t.id === w.customsUnion) : undefined; if (c && u && !u.members.includes(c.id)) { u.members.push(c.id); c.customsUnion = u.id; } break; }
    case 'declare_war': if (C(st, e.attacker)?.alive && C(st, e.defender)?.alive) declareWar(st, e.attacker, e.defender, [{ by: e.attacker, type: e.goal ?? 'conquer', target: e.defender, regions: regionsOf(e) }], undefined, e.goal === 'independence' ? 'independence' : 'conquest'); break;
    case 'set_flag': if (!(st.flags ??= []).includes(e.flag)) st.flags.push(e.flag); break;
    case 'clear_flag': st.flags = (st.flags ?? []).filter((f) => f !== e.flag); break;
    case 'army': { const c = C(st, e.entity); if (c) c.army.manpower = Math.max(0, Math.round(c.army.manpower * (1 + n(e.delta_share)))); break; }
    case 'trade': { const c = C(st, e.entity); if (c) c.embargoed = clamp((c.embargoed ?? 0) - n(e.delta), 0, 0.5); break; }
    case 'modifier': addModifier(st, e.entity, { id: e.id, name_vi: e.name_vi, name_en: e.name_en, months: n(e.months), decaying: !!e.decaying, effects: e.effects ?? {}, source }); break;
    case 'start_journal': startJournal(st, e.id, { self: e.entity }); break;
    case 'trigger_event': { const ev = events().find((x) => x.id === e.id); if (ev) { const b: Bindings = { self: e.entity ?? ev.country }; const key = `${ev.id}|${bindKey(b)}`; if (!(st.storyFired ?? []).includes(key)) fire(st, ev, b, key); } break; }
  }
  void greatPowers;
}

// ------------------------------------------------------------------ timed modifiers
/** Aggregate each country's timed modifiers (a decaying one fades linearly to zero) and apply per-month ones. */
function modifiersMonth(st: GameState): void {
  for (const c of Object.values(st.countries)) {
    if (!c.modifiers?.length) { if (c.eventMods) delete c.eventMods; continue; }
    c.modifiers = c.modifiers.filter((m) => m.until > st.tick && c.alive);
    if (!c.modifiers.length) { delete c.modifiers; delete c.eventMods; continue; }
    const agg: Record<string, number> = {};
    for (const m of c.modifiers) {
      const f = m.decaying ? Math.max(0, (m.until - st.tick) / Math.max(1, m.until - m.start)) : 1;
      for (const [k, v] of Object.entries(m.effects)) agg[k] = (agg[k] ?? 0) + v * f;
    }
    c.eventMods = agg;
    // per-month effects applied directly
    if (agg.prestige) c.prestige += agg.prestige;
    if (agg.war_exhaustion) c.warExhaustion = clamp(c.warExhaustion + agg.war_exhaustion, 0, 100);
  }
}
export function addModifier(st: GameState, entity: string, m: Omit<Modifier, 'start' | 'until'> & { months: number }): void {
  const c = st.countries[entity]; if (!c?.alive) return;
  const effects = Object.fromEntries(Object.entries(m.effects).filter(([k, v]) => (MOD_KEYS as readonly string[]).includes(k) && Number.isFinite(v)));
  c.modifiers = (c.modifiers ?? []).filter((x) => x.id !== m.id);
  c.modifiers.push({ id: m.id, name_vi: m.name_vi, ...(m.name_en ? { name_en: m.name_en } : {}), start: st.tick, until: st.tick + Math.max(1, m.months), ...(m.decaying ? { decaying: true } : {}), effects, ...(m.source ? { source: m.source } : {}) });
}

// ------------------------------------------------------------------ story journals
const journals = (): StoryJournal[] => data().db.story_journals ?? [];
export const journalDef = (id: string) => journals().find((j) => j.id === id);
function journalCond(st: GameState, j: StoryJournalState, c: Record<string, any>): boolean {
  if (c.type === 'progress_at_least') return j.progress >= Number(c.value);
  if (c.type === 'months_elapsed') return st.tick - j.started >= Number(c.value);
  return storyCondition(st, bind(c, j.bindings));
}
export function journalChecks(st: GameState, j: StoryJournalState): { complete: boolean[]; fail: boolean[] } {
  const def = journalDef(j.id);
  return { complete: (def?.complete ?? []).map((c) => journalCond(st, j, c)), fail: (def?.fail ?? []).map((c) => journalCond(st, j, c)) };
}
export function startJournal(st: GameState, id: string, b: Bindings): void {
  const def = journalDef(id); if (!def) return;
  const country = String(b.self ?? def.country);
  if ((st.storyJournals ?? []).some((j) => j.id === id && j.country === country)) return;
  (st.storyJournals ??= []).push({ id, country, started: st.tick, progress: def.progress?.start ?? 0, bindings: { ...b, self: country } });
  log(st, { type: 'decision', text: `New journal entry: ${def.title_en ?? def.title_vi}.`, textVi: `Mục nhật ký mới: ${def.title_vi}.`, actors: [country] });
}
function journalsMonth(st: GameState): void {
  // auto-start journals whose trigger holds
  for (const def of journals()) {
    if (!def.trigger || !available(st, def as unknown as StoryEvent)) continue;
    const countries = def.country.startsWith('$') ? Object.values(st.countries).filter((x) => x.alive && !x.decentralized) : [st.countries[def.country]].filter((x) => x?.alive);
    for (const self of countries) {
      const key = `J:${def.id}|${self.id}`;
      if ((st.storyFired ?? []).includes(key)) continue;
      const b: Bindings = { self: self.id };
      if ((def.trigger.conditions ?? []).every((c) => storyCondition(st, bind(c, b)))) { (st.storyFired ??= []).push(key); startJournal(st, def.id, b); }
    }
  }
  for (const j of [...(st.storyJournals ?? [])]) {
    const def = journalDef(j.id); const c = st.countries[j.country];
    if (!def || !c?.alive) { st.storyJournals = st.storyJournals!.filter((x) => x !== j); continue; }
    for (const step of def.progress?.monthly ?? []) if (!step.if || storyCondition(st, bind(step.if, j.bindings))) j.progress = clamp(j.progress + step.add, 0, def.progress?.max ?? 100);
    const { complete, fail } = journalChecks(st, j);
    const timedOut = def.timeout_months !== undefined && st.tick - j.started >= def.timeout_months;
    const done = (complete.length > 0 && complete.every(Boolean)) || (timedOut && def.on_timeout === 'complete');
    const failed = !done && ((fail.length > 0 && fail.some(Boolean)) || timedOut);
    if (!done && !failed) continue;
    st.storyJournals = st.storyJournals!.filter((x) => x !== j);
    for (const e of (done ? def.on_complete : def.on_fail) ?? []) { try { applyEffect(st, bind(e, j.bindings) as Record<string, any>, def.id); } catch { /* stale target */ } }
    log(st, { type: 'decision', text: `${def.title_en ?? def.title_vi}: ${done ? 'completed' : 'failed'}.`, textVi: `${def.title_vi}: ${done ? 'hoàn thành' : 'thất bại'}.`, actors: [j.country] });
  }
}
