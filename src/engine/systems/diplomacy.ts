// Diplomacy Engine (shared): relation drift, rivalries, alliances, guarantees, customs unions, war declaration with
// calls to arms and great-power intervention, AI acceptance of proposals.
import { data } from '../data/db';
import type { Country, DiplomaticPlay, DiplomaticPlaySide, GameState, Treaty, War, WarGoal } from '../types';
import { clamp, getRel, addRel, relKey, log, newId, rand } from '../core';
import { armyStrength, atWar } from './military';
import { sharesBorder } from './politics';
import { coreNationOf } from './population';
import { treatyIsActive } from './treaties';

export const allied = (st: GameState, a: string, b: string) => st.treaties.some((t) => t.type === 'alliance' && t.members.includes(a) && t.members.includes(b) && treatyIsActive(st, t));
export const rivals = (st: GameState, a: string, b: string) => st.rivalries.includes(relKey(a, b));

/** True only when these two countries are opposing belligerents in the same active war. */
export function countriesAtWar(st: GameState, a: string, b: string): boolean {
  return st.wars.some((war) =>
    (war.attackers.members.includes(a) && war.defenders.members.includes(b))
    || (war.defenders.members.includes(a) && war.attackers.members.includes(b)),
  );
}

export function powerScore(st: GameState, c: Country): number {
  return Math.sqrt(Math.max(0, c.gdp) / 1e9) * 10 + armyStrength(st, c) / 20000 + c.navy.strength * c.navy.quality * 0.6 + c.prestige * 0.2;
}
let gpCache: { st: GameState; tick: number; list: string[] } | null = null;
export function greatPowers(st: GameState): string[] {
  if (gpCache && gpCache.st === st && gpCache.tick === st.tick) return gpCache.list;
  const list = Object.values(st.countries).filter((c) => c.alive && !c.decentralized && !c.overlord).map((c) => ({ id: c.id, p: powerScore(st, c) })).sort((a, b) => b.p - a.p).slice(0, 8).map((x) => x.id);
  gpCache = { st, tick: st.tick, list };
  return list;
}

export function diplomacyMonth(st: GameState) {
  if (st.tick % 3 !== 0) return;
  const d = data();
  const ids = Object.keys(st.countries).filter((id) => st.countries[id].alive);
  const enemies = new Set<string>(); for (const w of st.wars) for (const a of w.attackers.members) for (const b of w.defenders.members) enemies.add(relKey(a, b));
  for (const k of Object.keys(st.relations)) {
    const [a, b] = k.split('|'); const ca = st.countries[a], cb = st.countries[b];
    if (!ca?.alive || !cb?.alive) { delete st.relations[k]; continue; }
    let base = 0;
    if (allied(st, a, b)) base += 35;
    if (rivals(st, a, b)) base -= 45;
    if (enemies.has(k)) base -= 80;
    if (ca.overlord === b || cb.overlord === a) base += 25;
    if (coreNationOf(st, ca) === coreNationOf(st, cb)) base += 15;
    base -= (ca.infamy + cb.infamy) * 0.3;
    st.relations[k] += (base - st.relations[k]) * 0.04;
  }
  for (const id of ids) { const c = st.countries[id]; c.infamy = Math.max(0, c.infamy - 0.25); }
  void d; void sharesBorder;
}

// ---------------------------------------------------------------- actions (used by AI and player alike)
export function improveRelations(st: GameState, a: string, b: string) { addRel(st, a, b, 3); }

export function allianceAcceptance(st: GameState, from: string, to: string): number {
  const a = st.countries[from], b = st.countries[to];
  let s = getRel(st, from, to) / 10 - 3;
  const sharedRival = st.rivalries.some((k) => { const [x, y] = k.split('|'); const other = x === from ? y : y === from ? x : null; return other && (rivals(st, to, other)); });
  if (sharedRival) s += 4;
  s += clamp(powerScore(st, a) / Math.max(1, powerScore(st, b)), 0, 3) - 1;
  if (rivals(st, from, to)) s -= 20;
  if (atWar(st, from)) s -= 2;
  return s;
}
/** Subjects other than tributaries have no independent foreign policy (same rule for AI and player). */
export const boundSubject = (c: Country | undefined) => !!c?.overlord && c.subjectType !== 'tributary';
export function formAlliance(st: GameState, a: string, b: string): boolean {
  if (boundSubject(st.countries[a]) || boundSubject(st.countries[b])) return false;
  if (allied(st, a, b) || allianceAcceptance(st, a, b) < 0) return false;
  st.treaties.push({ id: newId(st, 'ally'), type: 'alliance', members: [a, b], start: st.tick, startStep: st.calendar.stepIndex, status: 'active', clauses: [{ id: newId(st, 'clause'), kind: 'mutual_defense' }] });
  addRel(st, a, b, 15);
  log(st, { type: 'diplomacy', text: `${st.countries[a].name} and ${st.countries[b].name} form an alliance.`, textVi: `${st.countries[a].nameVi} và ${st.countries[b].nameVi} lập liên minh.`, actors: [a, b] });
  return true;
}
export function breakAlliance(st: GameState, a: string, b: string) {
  for (const treaty of st.treaties) {
    if (treaty.type === 'alliance' && treaty.members.length === 2 && treaty.members.includes(a) && treaty.members.includes(b) && treatyIsActive(st, treaty)) {
      treaty.status = 'terminated';
      treaty.terminatedStep = st.calendar.stepIndex;
    }
  }
  addRel(st, a, b, -20);
}
export function declareRivalry(st: GameState, a: string, b: string) {
  const k = relKey(a, b); if (st.rivalries.includes(k)) return;
  st.rivalries.push(k); addRel(st, a, b, -20);
  log(st, { type: 'diplomacy', text: `${st.countries[a].name} declares ${st.countries[b].name} a rival.`, textVi: `${st.countries[a].nameVi} tuyên bố ${st.countries[b].nameVi} là đối thủ.`, actors: [a, b] });
}
export function guarantee(st: GameState, a: string, b: string) {
  if (st.treaties.some((t) => t.type === 'guarantee' && t.members[0] === a && t.members[1] === b && treatyIsActive(st, t))) return;
  st.treaties.push({ id: newId(st, 'guar'), type: 'guarantee', members: [a, b], start: st.tick, startStep: st.calendar.stepIndex, status: 'active', clauses: [{ id: newId(st, 'clause'), kind: 'mutual_defense', from: a, to: b }] }); addRel(st, a, b, 10);
}
export function joinCustomsUnion(st: GameState, c: Country, unionId: string): boolean {
  const u = st.treaties.find((t) => t.id === unionId && t.type === 'customs_union' && treatyIsActive(st, t)); if (!u || u.members.includes(c.id)) return false;
  u.members.push(c.id); c.customsUnion = unionId;
  log(st, { type: 'economy', text: `${c.name} joins the customs union led by ${st.countries[u.leader!]?.name}.`, textVi: `${c.nameVi} gia nhập liên minh thuế quan do ${st.countries[u.leader!]?.nameVi} đứng đầu.`, actors: [c.id] });
  return true;
}

/** Declares war with goals; resolves calls to arms and possible intervention by rival great powers. */
/**
 * Who would fight on each side if `attacker` declared war on `defender` now, and the infamy cost.
 * Pure (no state change): used by declareWar itself and by the UI DecisionSheet, so the preview cannot drift from the rule.
 */
export function warSides(st: GameState, attacker: string, defender: string, goals: WarGoal[]) {
  const a = st.countries[attacker], dC = st.countries[defender];
  const defLeader = dC.overlord && st.countries[dC.overlord]?.alive && dC.subjectType !== 'tributary' ? dC.overlord : defender;
  const attackers = [attacker];
  const defenders = [...new Set([defender, defLeader])];
  const joined: { id: string; reason: 'subject' | 'alliance' | 'guarantee' | 'great_power' | 'diplomatic_play' }[] = [];
  // subjects follow overlords
  for (const c of Object.values(st.countries)) if (c.alive && c.overlord === attacker && c.subjectType !== 'tributary' && c.subjectType !== 'personal_union') { attackers.push(c.id); joined.push({ id: c.id, reason: 'subject' }); }
  // defensive alliances and guarantees (a country already fighting for the attacker, e.g. its subject, cannot also defend)
  for (const t of st.treaties) {
    if (t.type === 'alliance' && treatyIsActive(st, t) && t.members.includes(defender)) for (const m of t.members) if (m !== defender && !attackers.includes(m) && !defenders.includes(m) && st.countries[m]?.alive && !t.members.includes(attacker) && joinWillingness(st, m, attacker, defender) > 0) { defenders.push(m); joined.push({ id: m, reason: 'alliance' }); }
    if (t.type === 'guarantee' && treatyIsActive(st, t) && t.members[1] === defender && !attackers.includes(t.members[0]) && !defenders.includes(t.members[0])) { defenders.push(t.members[0]); joined.push({ id: t.members[0], reason: 'guarantee' }); }
  }
  // great-power intervention against an aggressive rival
  for (const gp of greatPowers(st)) {
    if (attackers.includes(gp) || defenders.includes(gp)) continue;
    if ((rivals(st, gp, attacker) && getRel(st, gp, defender) > 10) || (st.countries[gp].ai.planTarget === `support:${defender}`)) {
      if (joinWillingness(st, gp, attacker, defender) > 1.5) { defenders.push(gp); joined.push({ id: gp, reason: 'great_power' }); }
    }
  }
  // Countries that backed either side during the active diplomatic play join the war.
  for (const play of st.diplomaticPlays ?? []) {
    if (play.phase !== 'escalation' || play.initiator !== attacker || play.target !== defender) continue;
    for (const participant of play.participants) {
      const id = participant.country;
      if (!st.countries[id]?.alive || attackers.includes(id) || defenders.includes(id)) continue;
      if (participant.side === 'initiator') attackers.push(id);
      else defenders.push(id);
      joined.push({ id, reason: 'diplomatic_play' });
    }
  }
  const infamy = goals.reduce((s, g) => s + (g.regions?.length ?? 1) * (g.type === 'colonize' ? 1 : 3), 0);
  return { attackerLeader: attacker, defenderLeader: defLeader, attackers, defenders, joined, infamy, attackerName: a.name };
}

export function declareWar(st: GameState, attacker: string, defender: string, goals: WarGoal[], name?: string, kind: War['kind'] = 'conquest'): War | null {
  const a = st.countries[attacker], dC = st.countries[defender];
  if (!a?.alive || !dC?.alive || attacker === defender) return null;
  if (st.wars.some((w) => (w.attackers.members.includes(attacker) && w.defenders.members.includes(defender)) || (w.attackers.members.includes(defender) && w.defenders.members.includes(attacker)))) return null;
  const sides = warSides(st, attacker, defender, goals);
  const w: War = { id: newId(st, 'war'), name: name ?? `${a.name}–${dC.name} War`, kind, attackers: { leader: attacker, members: sides.attackers }, defenders: { leader: sides.defenderLeader, members: sides.defenders }, goals, start: st.tick, score: 0, occupied: [], battles: 0, exhaustion: { a: 0, d: 0 } };
  a.infamy += sides.infamy;
  for (const x of w.attackers.members) for (const y of w.defenders.members) st.relations[relKey(x, y)] = Math.min(st.relations[relKey(x, y)] ?? 0, -60);
  st.wars.push(w);
  if (!dC.decentralized || a.tier === 'A' || st.player === attacker || st.player === defender)
    log(st, { type: 'war', text: `${a.name} declares war on ${dC.name} (${goals.map((g) => g.type).join(', ')}).`, textVi: `${a.nameVi} tuyên chiến với ${dC.nameVi} (${goals.map((g) => g.type).join(', ')}).`, actors: [attacker, defender, ...w.defenders.members.filter((m) => m !== defender)] });
  return w;
}

export function joinWillingness(st: GameState, who: string, attacker: string, defender: string): number {
  const c = st.countries[who]; if (!c || c.decentralized) return -1;
  let s = getRel(st, who, defender) / 20 - getRel(st, who, attacker) / 25 + (rivals(st, who, attacker) ? 2 : 0) + (allied(st, who, defender) ? 2 : 0);
  s += (armyStrength(st, c) / Math.max(1, armyStrength(st, st.countries[attacker]))) - 0.6;
  if (atWar(st, who)) s -= 2;
  s -= c.warExhaustion / 30;
  s += (rand(st) - 0.5);
  return s;
}


// ---------------------------------------------------------------- staged diplomatic plays and treaty lifecycle

const MANEUVER_STEPS = 14 * 4;
const ESCALATION_STEPS = 7 * 4;

/** Initiates a two-stage crisis. War is not declared until maneuver and escalation deadlines expire. */
export function startDiplomaticPlay(st: GameState, initiator: string, target: string, goals: WarGoal[]): DiplomaticPlay | null {
  const a = st.countries[initiator], b = st.countries[target];
  if (!a?.alive || !b?.alive || initiator === target || !goals.length) return null;
  if (boundSubject(a) || countriesAtWar(st, initiator, target)) return null;
  if ((st.diplomaticPlays ?? []).some((p) => (p.phase === 'maneuver' || p.phase === 'escalation')
    && [p.initiator, p.target].some((id) => id === initiator || id === target))) return null;
  if (goals.some((g) => g.by !== initiator || g.target !== target)) return null;

  const play: DiplomaticPlay = {
    id: newId(st, 'play'),
    initiator,
    target,
    goals: goals.map((goal) => ({ ...goal, regions: goal.regions ? [...goal.regions] : undefined })),
    phase: 'maneuver',
    startedStep: st.calendar.stepIndex,
    deadlineStep: st.calendar.stepIndex + MANEUVER_STEPS,
    participants: [
      { country: initiator, side: 'initiator', influence: 1 },
      { country: target, side: 'target', influence: 1 },
    ],
    escalation: 0,
  };
  (st.diplomaticPlays ??= []).push(play);
  log(st, {
    type: 'diplomacy',
    text: `${a.name} opens a diplomatic play against ${b.name}.`,
    textVi: `${a.nameVi} mở cuộc khủng hoảng ngoại giao với ${b.nameVi}.`,
    actors: [initiator, target],
  });
  return play;
}

/** Allows a third country to back one side during maneuver or escalation. */
export function joinDiplomaticPlay(st: GameState, playId: string, countryId: string, side: DiplomaticPlaySide): boolean {
  const play = (st.diplomaticPlays ?? []).find((p) => p.id === playId);
  const country = st.countries[countryId];
  if (!play || (play.phase !== 'maneuver' && play.phase !== 'escalation') || !country?.alive) return false;
  if (countryId === play.initiator || countryId === play.target || boundSubject(country)) return false;
  if (play.participants.some((p) => p.country === countryId)) return false;
  if (countriesAtWar(st, countryId, play.initiator) || countriesAtWar(st, countryId, play.target)) return false;
  if ((st.diplomaticPlays ?? []).some((p) => p.id !== playId && (p.phase === 'maneuver' || p.phase === 'escalation')
    && p.participants.some((x) => x.country === countryId))) return false;
  play.participants.push({ country: countryId, side, influence: 1 });
  play.escalation = Math.min(100, play.escalation + 10);
  const sideLabel = side === 'initiator' ? st.countries[play.initiator].nameVi : st.countries[play.target].nameVi;
  log(st, {
    type: 'diplomacy',
    text: `${country.name} backs ${side === 'initiator' ? play.initiator : play.target} in the diplomatic play.`,
    textVi: `${country.nameVi} đứng về phía ${sideLabel} trong khủng hoảng ngoại giao.`,
    actors: [countryId, play.initiator, play.target],
  });
  return true;
}

/** Called once at each daily boundary. Deadlines are integer six-hour steps, never wall-clock timers. */
export function advanceDiplomacyDaily(st: GameState): void {
  const step = st.calendar.stepIndex;
  for (const treaty of st.treaties) {
    if ((treaty.status ?? 'active') !== 'active' || treaty.endStep == null || step < treaty.endStep) continue;
    treaty.status = 'expired';
    for (const member of treaty.members) {
      const country = st.countries[member];
      if (country?.customsUnion === treaty.id) country.customsUnion = null;
    }
    log(st, {
      type: 'diplomacy',
      text: `${treaty.type} treaty ${treaty.id} expires.`,
      textVi: `Hiệp ước ${treaty.id} (${treaty.type}) hết hạn.`,
      actors: treaty.members,
    });
  }

  const due = (st.diplomaticPlays ?? [])
    .filter((play) => (play.phase === 'maneuver' || play.phase === 'escalation') && step >= play.deadlineStep)
    .sort((a, b) => a.deadlineStep - b.deadlineStep || a.id.localeCompare(b.id));
  for (const play of due) {
    if (!st.countries[play.initiator]?.alive || !st.countries[play.target]?.alive) {
      play.phase = 'withdrawn';
      play.resolvedStep = step;
      continue;
    }
    if (play.phase === 'maneuver') {
      play.phase = 'escalation';
      play.deadlineStep = step + ESCALATION_STEPS;
      log(st, {
        type: 'diplomacy',
        text: `The diplomatic play between ${st.countries[play.initiator].name} and ${st.countries[play.target].name} enters escalation.`,
        textVi: `Khủng hoảng giữa ${st.countries[play.initiator].nameVi} và ${st.countries[play.target].nameVi} bước vào giai đoạn leo thang.`,
        actors: [play.initiator, play.target, ...play.participants.map((p) => p.country)],
      });
      continue;
    }
    const war = declareWar(st, play.initiator, play.target, play.goals, undefined, 'great');
    play.phase = war ? 'resolved' : 'withdrawn';
    play.warId = war?.id;
    play.resolvedStep = step;
    if (!war) {
      log(st, {
        type: 'diplomacy',
        text: `The diplomatic play between ${st.countries[play.initiator].name} and ${st.countries[play.target].name} ends without a war.`,
        textVi: `Khủng hoảng giữa ${st.countries[play.initiator].nameVi} và ${st.countries[play.target].nameVi} kết thúc mà không nổ ra chiến tranh.`,
        actors: [play.initiator, play.target],
      });
    }
  }
}

/** A five-year bilateral trade agreement reduces each signatory's tariff rate on import value. */
export function formTradeAgreement(st: GameState, aId: string, bId: string): boolean {
  const a = st.countries[aId], b = st.countries[bId];
  if (!a?.alive || !b?.alive || aId === bId || boundSubject(a) || boundSubject(b)) return false;
  if (getRel(st, aId, bId) < -20 || countriesAtWar(st, aId, bId)) return false;
  if (st.treaties.some((t) => t.type === 'trade_agreement' && t.members.includes(aId) && t.members.includes(bId) && treatyIsActive(st, t))) return false;
  const relationship = clamp((getRel(st, aId, bId) + 20) / 120, 0, 1);
  const reduction = 0.1 + relationship * 0.1;
  const startStep = st.calendar.stepIndex;
  const durationSteps = Math.round(5 * 365.2425 * 4);
  const treaty: Treaty = {
    id: newId(st, 'trade'),
    type: 'trade_agreement',
    members: [aId, bId],
    start: st.tick,
    startStep,
    endStep: startStep + durationSteps,
    status: 'active',
    clauses: [{ id: newId(st, 'clause'), kind: 'tariff_reduction', value: reduction, from: aId, to: bId }],
  };
  st.treaties.push(treaty);
  log(st, {
    type: 'diplomacy',
    text: `${a.name} and ${b.name} sign a five-year trade agreement.`,
    textVi: `${a.nameVi} và ${b.nameVi} ký hiệp định thương mại có thời hạn 5 năm.`,
    actors: [aId, bId],
  });
  return true;
}
