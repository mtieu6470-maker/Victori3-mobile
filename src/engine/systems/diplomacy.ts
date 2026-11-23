// Diplomacy Engine (shared): relation drift, rivalries, alliances, guarantees, customs unions, war declaration with
// calls to arms and great-power intervention, AI acceptance of proposals.
import { data } from '../data/db';
import type { Country, GameState, War, WarGoal } from '../types';
import { clamp, getRel, addRel, relKey, log, newId, rand } from '../core';
import { armyStrength, atWar, navalStrength } from './military';
import { sharesBorder } from './politics';
import { coreNationOf } from './population';

export const allied = (st: GameState, a: string, b: string) => st.treaties.some((t) => t.type === 'alliance' && t.members.includes(a) && t.members.includes(b));
export const rivals = (st: GameState, a: string, b: string) => st.rivalries.includes(relKey(a, b));

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
  const aggressors = new Set(st.wars.flatMap((w) => (w.kind === 'conquest' || w.kind === 'colonial' ? w.attackers.members : [])));
  for (const id of ids) { const c = st.countries[id]; if (!aggressors.has(id)) c.infamy = Math.max(0, c.infamy - INFAMY_DECAY_PER_MONTH); }
  void d; void sharesBorder;
}

/**
 * DIPLO-NORM-01 (owner 2026-11-23): after the United Nations Charter (1945) aggression became an
 * international norm violation. In Historical Mode from 1945, conquest war goals cost
 * POST_1945_NORM.infamy times the usual infamy, a defender attracts great powers more readily, and the
 * aggressor's war exhaustion rises faster. Nothing is forbidden: a state willing to pay can still attack
 * (some did). Before 1945 there is no such norm. Sandbox Mode: pending an in-game founding event.
 */
export const POST_1945_NORM = { year: 1945, infamy: 4, exhaustion: 1.5, interventionThreshold: 0.5 } as const;
export const postwarNorm = (st: GameState) => st.mode === 'historical' && st.date.y >= POST_1945_NORM.year;
/**
 * Collective security (owner 2026-11-23): fighting a country that is itself waging a war of conquest, or
 * that carries infamy of at least CONTAIN_AGGRESSOR.infamy, is "containing aggression" and costs only
 * CONTAIN_AGGRESSOR.factor of the usual infamy (no post-1945 multiplier).
 */
export const CONTAIN_AGGRESSOR = { infamy: 25, factor: 0.25 } as const;
export function isAggressor(st: GameState, id: string): boolean {
  const c = st.countries[id];
  if (!c) return false;
  return c.infamy >= CONTAIN_AGGRESSOR.infamy || st.wars.some((w) => (w.kind === 'conquest' || w.kind === 'colonial') && w.attackers.members.includes(id));
}

/**
 * INFAMY-01 (owner 2026-11-23: infamy "as in Victoria 3"): named tiers with diplomatic consequences.
 * Thresholds are project design values in the spirit of the reference game's tiers.
 * - infamous (>= 25): treated as an aggressor (others fight it at reduced infamy);
 * - notorious (>= 50): alliance offers to it are heavily penalised; third parties join wars against it
 *   more willingly;
 * - pariah (>= 80): no new alliances or customs-union membership; every third party is more willing to
 *   join against it.
 */
export const INFAMY_TIERS = { infamous: 25, notorious: 50, pariah: 80 } as const;
export type InfamyTier = 'none' | 'infamous' | 'notorious' | 'pariah';
export function infamyTier(c: Pick<Country, 'infamy'>): InfamyTier {
  return c.infamy >= INFAMY_TIERS.pariah ? 'pariah' : c.infamy >= INFAMY_TIERS.notorious ? 'notorious' : c.infamy >= INFAMY_TIERS.infamous ? 'infamous' : 'none';
}

/** Infamy a war with these goals adds to the attacker (pure; no random draws). */
export function warInfamy(st: GameState, goals: WarGoal[], defender?: string): number {
  const containing = defender !== undefined && isAggressor(st, defender);
  const norm = containing ? CONTAIN_AGGRESSOR.factor : postwarNorm(st) ? POST_1945_NORM.infamy : 1;
  return goals.reduce((s, g) => s + (g.type === 'independence' ? 0 : (g.regions?.length ?? 1) * (g.type === 'colonize' ? 1 : 3) * norm), 0);
}
/** Infamy decays only in months a country is not waging an offensive war (Victoria 3-like). */
export const INFAMY_DECAY_PER_MONTH = 0.25;

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
  // INFAMY-01: nobody wants to be tied to a notorious state; a pariah cannot gain allies at all.
  for (const x of [a, b]) { const t = infamyTier(x); if (t === 'notorious') s -= 6; if (t === 'pariah') s -= 100; }
  return s;
}
/** Subjects other than tributaries have no independent foreign policy (same rule for AI and player). */
export const boundSubject = (c: Country | undefined) => !!c?.overlord && c.subjectType !== 'tributary';
export function formAlliance(st: GameState, a: string, b: string): boolean {
  if (boundSubject(st.countries[a]) || boundSubject(st.countries[b])) return false;
  if (allied(st, a, b) || allianceAcceptance(st, a, b) < 0) return false;
  st.treaties.push({ id: newId(st, 'ally'), type: 'alliance', members: [a, b], start: st.tick });
  addRel(st, a, b, 15);
  log(st, { type: 'diplomacy', text: `${st.countries[a].name} and ${st.countries[b].name} form an alliance.`, textVi: `${st.countries[a].nameVi} và ${st.countries[b].nameVi} lập liên minh.`, actors: [a, b] });
  return true;
}
export function breakAlliance(st: GameState, a: string, b: string) {
  // bloc treaties (Historical Mode, incl. bilateral ones such as US–ROK) end only on their dates
  st.treaties = st.treaties.filter((t) => !(t.type === 'alliance' && !t.source?.startsWith('bloc:') && !t.source?.startsWith('pbloc:') && t.members.length === 2 && t.members.includes(a) && t.members.includes(b)));
  addRel(st, a, b, -20);
}
export function declareRivalry(st: GameState, a: string, b: string) {
  const k = relKey(a, b); if (st.rivalries.includes(k)) return;
  st.rivalries.push(k); addRel(st, a, b, -20);
  log(st, { type: 'diplomacy', text: `${st.countries[a].name} declares ${st.countries[b].name} a rival.`, textVi: `${st.countries[a].nameVi} tuyên bố ${st.countries[b].nameVi} là đối thủ.`, actors: [a, b] });
}
export function guarantee(st: GameState, a: string, b: string) {
  if (st.treaties.some((t) => t.type === 'guarantee' && t.members[0] === a && t.members[1] === b)) return;
  st.treaties.push({ id: newId(st, 'guar'), type: 'guarantee', members: [a, b], start: st.tick }); addRel(st, a, b, 10);
}
export function joinCustomsUnion(st: GameState, c: Country, unionId: string): boolean {
  const u = st.treaties.find((t) => t.id === unionId && t.type === 'customs_union'); if (!u || u.members.includes(c.id)) return false;
  if (infamyTier(c) === 'pariah') return false; // INFAMY-01: a pariah is not admitted
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
  const joined: { id: string; reason: 'subject' | 'alliance' | 'guarantee' | 'great_power' }[] = [];
  const refused: string[] = []; // allies of the defender who decline the call to arms
  const called: string[] = []; // CTA-01: the player, if an ally of the defender, decides for itself
  // subjects follow overlords
  for (const c of Object.values(st.countries)) if (c.alive && c.overlord === attacker && c.subjectType !== 'tributary' && c.subjectType !== 'personal_union' && !c.subjectPact?.exempt /* PB-03a: exempt from service */) { attackers.push(c.id); joined.push({ id: c.id, reason: 'subject' }); }
  // defensive alliances and guarantees (a country already fighting for the attacker, e.g. its subject, cannot also defend)
  for (const t of st.treaties) {
    if (t.type === 'alliance' && t.members.includes(defender)) for (const m of t.members) if (m !== defender && !attackers.includes(m) && !defenders.includes(m) && st.countries[m]?.alive && !t.members.includes(attacker)) {
      if (m === st.player) { if (!called.includes(m)) called.push(m); continue; }
      // PB-03b defensive cooperation III: bloc members are obliged to stand by a partner
      const obliged = t.source?.startsWith('pbloc:') && !!st.countries[m].blocMods?.obliged;
      if (obliged || joinWillingness(st, m, attacker, defender) > 0) { defenders.push(m); joined.push({ id: m, reason: 'alliance' }); } else if (!refused.includes(m)) refused.push(m);
    }
    if (t.type === 'guarantee' && t.members[1] === defender && !attackers.includes(t.members[0]) && !defenders.includes(t.members[0])) { defenders.push(t.members[0]); joined.push({ id: t.members[0], reason: 'guarantee' }); }
  }
  // PB-02: members of the attacker's power bloc with offensive coordination may join its war (AI only)
  const ab = a.bloc ? st.powerBlocs?.[a.bloc] : undefined;
  if (ab?.leader === attacker) for (const m of ab.members) {
    const mc = st.countries[m];
    if (m === attacker || m === st.player || !mc?.alive || attackers.includes(m) || defenders.includes(m) || !(mc.blocMods?.attack)) continue;
    if (joinWillingness(st, m, defender, attacker) + mc.blocMods.attack > 1) { attackers.push(m); joined.push({ id: m, reason: 'alliance' }); }
  }
  // great-power intervention against an aggressive rival
  for (const gp of greatPowers(st)) {
    if (attackers.includes(gp) || defenders.includes(gp) || gp === st.player) continue; // the player is never drafted
    const conquest = goals.some((g) => g.type !== 'independence');
    if (postwarNorm(st) && conquest && getRel(st, gp, defender) >= 0 && joinWillingness(st, gp, attacker, defender) > POST_1945_NORM.interventionThreshold) { defenders.push(gp); joined.push({ id: gp, reason: 'great_power' }); continue; }
    if ((rivals(st, gp, attacker) && getRel(st, gp, defender) > 10) || (st.countries[gp].ai.planTarget === `support:${defender}`)) {
      if (joinWillingness(st, gp, attacker, defender) > 1.5) { defenders.push(gp); joined.push({ id: gp, reason: 'great_power' }); }
    }
  }
  const infamy = warInfamy(st, goals, defender);
  return { attackerLeader: attacker, defenderLeader: defLeader, attackers, defenders, joined, refused: refused.filter((m) => !defenders.includes(m)), called: called.filter((m) => !defenders.includes(m) && !attackers.includes(m)), infamy, attackerName: a.name };
}

/** AI-INT-01 design parameter: relations lost with the defender when an ally declines its call to arms. */
export const REFUSED_CALL = { relation: 25 } as const;
/** PB-02: refusing to defend a partner in a bloc whose principles make it a mutual-defence pact costs cohesion. */
export const BLOC_REFUSAL = { cohesion: 10 } as const;
function blocRefusal(st: GameState, who: string, defender: string): void {
  const c = st.countries[who]; const b = c?.bloc ? st.powerBlocs?.[c.bloc] : undefined;
  if (b && b.members.includes(defender) && (c.blocMods?.alliance ?? 0) >= 1) b.cohesion = clamp(b.cohesion - BLOC_REFUSAL.cohesion, 0, 100);
}
/** CTA-01 design parameter: months the player has to answer an ally's call to arms. */
export const CALL_TO_ARMS = { months: 3 } as const;

/** CTA-01: the player answers the call — joins the defending side of the war. */
export function answerCallToArms(st: GameState, who: string, warId: string): boolean {
  const w = st.wars.find((x) => x.id === warId);
  if (!w || w.attackers.members.includes(who) || w.defenders.members.includes(who) || !st.countries[who]?.alive) return false;
  w.defenders.members.push(who);
  for (const y of w.attackers.members) st.relations[relKey(who, y)] = Math.min(st.relations[relKey(who, y)] ?? 0, -60);
  log(st, { type: 'war', text: `${st.countries[who].name} answers the call to arms and joins ${w.name}.`, textVi: `${st.countries[who].nameVi} đáp lời kêu gọi và tham gia ${w.name}.`, actors: [who, w.defenders.leader, w.attackers.leader] });
  return true;
}

/** CTA-01: the player declines — trust falls and a bilateral (non-bloc) alliance ends, as for the AI. */
export function refuseCallToArms(st: GameState, who: string, warId: string): void {
  const w = st.wars.find((x) => x.id === warId);
  const defender = w?.defenders.leader; if (!defender) return;
  addRel(st, who, defender, -REFUSED_CALL.relation);
  blocRefusal(st, who, defender);
  if (st.treaties.some((t) => t.type === 'alliance' && !t.source?.startsWith('bloc:') && t.members.length === 2 && t.members.includes(who) && t.members.includes(defender))) {
    breakAlliance(st, who, defender);
    log(st, { type: 'diplomacy', text: `${st.countries[who].name} refuses ${st.countries[defender].name}'s call to arms; their alliance ends.`, textVi: `${st.countries[who].nameVi} từ chối lời kêu gọi tham chiến của ${st.countries[defender].nameVi}; liên minh tan vỡ.`, actors: [who, defender] });
  }
}

export function declareWar(st: GameState, attacker: string, defender: string, goals: WarGoal[], name?: string, kind: War['kind'] = 'conquest'): War | null {
  const a = st.countries[attacker], dC = st.countries[defender];
  if (!a?.alive || !dC?.alive || attacker === defender) return null;
  if (st.wars.some((w) => (w.attackers.members.includes(attacker) && w.defenders.members.includes(defender)) || (w.attackers.members.includes(defender) && w.defenders.members.includes(attacker)))) return null;
  // DECOL-01: an independence settlement carries a truce (at most 2 years) between the two treaty parties.
  for (const [x, y] of [[a, dC], [dC, a]] as const) if (x.truce && x.truce.with === y.id && x.truce.until > st.tick) return null;
  // PB-03b defensive cooperation: members of one bloc cannot attack each other
  if (a.bloc && a.bloc === dC.bloc && a.blocMods?.noInternalWar) return null;
  const sides = warSides(st, attacker, defender, goals);
  const w: War = { id: newId(st, 'war'), name: name ?? `${a.name}–${dC.name} War`, kind, attackers: { leader: attacker, members: sides.attackers }, defenders: { leader: sides.defenderLeader, members: sides.defenders }, goals, start: st.tick, score: 0, occupied: [], battles: 0, exhaustion: { a: 0, d: 0 } };
  a.infamy += sides.infamy * (1 - (a.blocMods?.infamy ?? 0)); // PB-03b aggressive coordination
  for (const x of w.attackers.members) for (const y of w.defenders.members) st.relations[relKey(x, y)] = Math.min(st.relations[relKey(x, y)] ?? 0, -60);
  st.wars.push(w);
  // CTA-01 (owner 2026-11-23): the player's ally is attacked — a journal entry asks the player to answer the call
  for (const m of sides.called) {
    (st.journal ??= []).push({ id: `jc_${w.id}`, kind: 'call_to_arms', event: w.id, country: m, started: st.tick, expires: st.tick + CALL_TO_ARMS.months, status: 'active' });
    log(st, { type: 'decision', text: `${dC.name}, your ally, is attacked by ${a.name}. Will you answer the call to arms?`, textVi: `${dC.nameVi}, đồng minh của bạn, bị ${a.nameVi} tấn công. Bạn có đáp lời kêu gọi tham chiến?`, actors: [m, defender, attacker] });
  }
  // AI-INT-01: an ally that declines the call to arms pays for it: trust falls and a bilateral alliance ends
  // (a bloc treaty survives). The player is not judged for a choice the AI made on its behalf.
  for (const m of sides.refused) {
    if (m === st.player) continue;
    addRel(st, m, defender, -REFUSED_CALL.relation);
    blocRefusal(st, m, defender);
    if (st.treaties.some((t) => t.type === 'alliance' && !t.source?.startsWith('bloc:') && t.members.length === 2 && t.members.includes(m) && t.members.includes(defender))) {
      breakAlliance(st, m, defender);
      log(st, { type: 'diplomacy', text: `${st.countries[m].name} refuses ${dC.name}'s call to arms; their alliance ends.`, textVi: `${st.countries[m].nameVi} từ chối lời kêu gọi tham chiến của ${dC.nameVi}; liên minh tan vỡ.`, actors: [m, defender] });
    }
  }
  if (!dC.decentralized || a.tier === 'A' || st.player === attacker || st.player === defender)
    log(st, { type: 'war', text: `${a.name} declares war on ${dC.name} (${goals.map((g) => g.type).join(', ')}).`, textVi: `${a.nameVi} tuyên chiến với ${dC.nameVi} (${goals.map((g) => g.type).join(', ')}).`, actors: [attacker, defender, ...w.defenders.members.filter((m) => m !== defender)] });
  return w;
}

/**
 * AI-INT-01 design parameters (owner 2026-11-23: allies and enemies alike weigh their own interests before
 * acting). threat: a stronger neighbour attacking someone is a danger to contain; market: a shared customs union
 * is a stake worth defending; subject: an overlord protects its subject (and a subject will not fight its
 * overlord); conflicted: allied to both sides; distance: no border with either side and no navy to get there.
 */
export const JOIN_INTEREST = { threat: 0.8, market: 0.5, subject: 3, conflicted: 2, distance: 1, threatPowerShare: 0.7 } as const;

/** Deterministic willingness of `who` to fight for `defender` against `attacker` (no dice). */
export function joinInterest(st: GameState, who: string, attacker: string, defender: string): number {
  const c = st.countries[who]; if (!c || c.decentralized) return -1;
  const att = st.countries[attacker]; const def = st.countries[defender];
  let s = getRel(st, who, defender) / 20 - getRel(st, who, attacker) / 25 + (rivals(st, who, attacker) ? 2 : 0) + (allied(st, who, defender) ? 2 : 0);
  s += (armyStrength(st, c) / Math.max(1, armyStrength(st, att))) - 0.6;
  if (atWar(st, who)) s -= 2;
  s -= c.warExhaustion / 30;
  // INFAMY-01: third parties join wars against notorious states and pariahs more willingly.
  const at = infamyTier(att ?? { infamy: 0 });
  if (at === 'notorious') s += 1; else if (at === 'pariah') s += 2;
  // AI-INT-01: its own interests
  if (att && sharesBorder(st, who, attacker) && powerScore(st, att) > powerScore(st, c) * JOIN_INTEREST.threatPowerShare) s += JOIN_INTEREST.threat;
  if (c.customsUnion && def && c.customsUnion === def.customsUnion) s += JOIN_INTEREST.market;
  if (def?.overlord === who) s += JOIN_INTEREST.subject;
  if (c.overlord === attacker) s -= JOIN_INTEREST.subject;
  if (allied(st, who, attacker)) s -= JOIN_INTEREST.conflicted;
  if (!sharesBorder(st, who, defender) && !sharesBorder(st, who, attacker) && navalStrength(c) <= 5) s -= JOIN_INTEREST.distance;
  // PB-01: members of one power bloc with defensive cooperation stand by each other
  // (PB-02: the strength comes from the bloc's principles in force — Country.blocMods.defend)
  if (c.bloc && c.bloc === def?.bloc) s += c.blocMods?.defend ?? 0;
  return s;
}

/** The decision itself: interests plus a measure of judgement (seeded noise). */
export function joinWillingness(st: GameState, who: string, attacker: string, defender: string): number {
  const c = st.countries[who]; if (!c || c.decentralized) return -1;
  return joinInterest(st, who, attacker, defender) + (rand(st) - 0.5);
}

/** AI-INT-01: an attacker's estimate of the chance that `who` really comes to the defender's aid. */
export function joinProbability(st: GameState, who: string, attacker: string, defender: string): number {
  return 1 / (1 + Math.exp(-1.5 * joinInterest(st, who, attacker, defender)));
}
