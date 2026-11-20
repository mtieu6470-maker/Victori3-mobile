// Diplomacy Engine (shared): relation drift, rivalries, alliances, guarantees, customs unions, war declaration with
// calls to arms and great-power intervention, AI acceptance of proposals.
import { data } from '../data/db';
import type { Country, GameState, War, WarGoal } from '../types';
import { clamp, getRel, addRel, relKey, log, newId, rand } from '../core';
import { armyStrength, atWar } from './military';
import { sharesBorder } from './politics';
import { coreNationOf } from './population';
import { setCustomsUnionMembership } from './customsUnion';
import { hasTech } from './economy';

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

/** Number of distinct active Alliance treaty records; a historical multi-party record is still one alliance. */
export function allianceTreatyCount(st: GameState, countryId: string): number {
  return st.treaties.filter(
    (treaty) => treaty.type === 'alliance'
      && treaty.members.includes(countryId)
      && treaty.members.some((memberId) => memberId !== countryId && st.countries[memberId]?.alive),
  ).length;
}

/** One Alliance treaty is available with International Relations; additional treaties require Multilateral Alliances. */
export function allianceCapacityAvailable(st: GameState, countryId: string): boolean {
  const country = st.countries[countryId];
  if (!country?.alive || !hasTech(country, 'international_relations')) return false;
  return allianceTreatyCount(st, countryId) === 0 || hasTech(country, 'multilateral_alliances');
}

export function canFormAlliance(st: GameState, a: string, b: string): boolean {
  const from = st.countries[a], to = st.countries[b];
  if (!from?.alive || !to?.alive || a === b) return false;
  if (boundSubject(from) || boundSubject(to)) return false;
  if (!allianceCapacityAvailable(st, a) || !allianceCapacityAvailable(st, b)) return false;
  if (allied(st, a, b)) return false;

  // Alliance and Guarantee Independence cannot coexist for the same pair, in either direction.
  if (st.treaties.some(
    (treaty) => treaty.type === 'guarantee'
      && treaty.members.length >= 2
      && ((treaty.members[0] === a && treaty.members[1] === b)
        || (treaty.members[0] === b && treaty.members[1] === a)),
  )) return false;

  return allianceAcceptance(st, a, b) >= 0;
}

export function formAlliance(st: GameState, a: string, b: string): boolean {
  if (!canFormAlliance(st, a, b)) return false;
  st.treaties.push({ id: newId(st, 'ally'), type: 'alliance', members: [a, b], start: st.tick });
  addRel(st, a, b, 15);
  log(st, { type: 'diplomacy', text: `${st.countries[a].name} and ${st.countries[b].name} form an alliance.`, textVi: `${st.countries[a].nameVi} và ${st.countries[b].nameVi} lập liên minh.`, actors: [a, b] });
  return true;
}
export function breakAlliance(st: GameState, a: string, b: string) {
  st.treaties = st.treaties.filter((t) => !(t.type === 'alliance' && t.members.length === 2 && t.members.includes(a) && t.members.includes(b)));
  addRel(st, a, b, -20);
}
export function declareRivalry(st: GameState, a: string, b: string) {
  const k = relKey(a, b); if (st.rivalries.includes(k)) return;
  st.rivalries.push(k); addRel(st, a, b, -20);
  log(st, { type: 'diplomacy', text: `${st.countries[a].name} declares ${st.countries[b].name} a rival.`, textVi: `${st.countries[a].nameVi} tuyên bố ${st.countries[b].nameVi} là đối thủ.`, actors: [a, b] });
}
export function guarantee(st: GameState, a: string, b: string) {
  if (allied(st, a, b)) return;
  if (st.treaties.some((t) => t.type === 'guarantee' && t.members[0] === a && t.members[1] === b)) return;
  st.treaties.push({ id: newId(st, 'guar'), type: 'guarantee', members: [a, b], start: st.tick }); addRel(st, a, b, 10);
}
export function joinCustomsUnion(st: GameState, c: Country, unionId: string): boolean {
  const u = st.treaties.find((t) => t.id === unionId && t.type === 'customs_union');
  if (!c.alive || !u || (c.customsUnion === unionId && u.members.includes(c.id))) return false;

  // Membership is exclusive: transfer out of any previous union, repair its
  // leadership, and point this country at the new treaty in one operation.
  const leader = setCustomsUnionMembership(st, c.id, unionId);
  if (!leader) return false;

  log(st, {
    type: 'economy',
    text: `${c.name} joins the customs union led by ${leader.name}.`,
    textVi: `${c.nameVi} gia nhập liên minh thuế quan do ${leader.nameVi} đứng đầu.`,
    actors: [c.id, leader.id],
  });
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
  // subjects follow overlords
  for (const c of Object.values(st.countries)) if (c.alive && c.overlord === attacker && c.subjectType !== 'tributary' && c.subjectType !== 'personal_union') { attackers.push(c.id); joined.push({ id: c.id, reason: 'subject' }); }
  // defensive alliances and guarantees (a country already fighting for the attacker, e.g. its subject, cannot also defend)
  for (const t of st.treaties) {
    if (t.type === 'alliance' && t.members.includes(defender)) for (const m of t.members) if (m !== defender && !attackers.includes(m) && !defenders.includes(m) && st.countries[m]?.alive && !t.members.includes(attacker) && joinWillingness(st, m, attacker, defender) > 0) { defenders.push(m); joined.push({ id: m, reason: 'alliance' }); }
    if (t.type === 'guarantee' && t.members[1] === defender && !attackers.includes(t.members[0]) && !defenders.includes(t.members[0])) { defenders.push(t.members[0]); joined.push({ id: t.members[0], reason: 'guarantee' }); }
  }
  // great-power intervention against an aggressive rival
  for (const gp of greatPowers(st)) {
    if (attackers.includes(gp) || defenders.includes(gp)) continue;
    if ((rivals(st, gp, attacker) && getRel(st, gp, defender) > 10) || (st.countries[gp].ai.planTarget === `support:${defender}`)) {
      if (joinWillingness(st, gp, attacker, defender) > 1.5) { defenders.push(gp); joined.push({ id: gp, reason: 'great_power' }); }
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
