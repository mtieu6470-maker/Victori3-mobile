// PB-01a: power blocs (khối quyền lực) — owner 2026-11-23: "the player founds their own bloc, as complete as
// Victoria 3". Victoria 3's power blocs are the mechanical reference; code, names and numbers are original.
// Design: docs/design/POWER_BLOCS_VI.md.
//
// A great power founds a bloc with an identity and principles. Members join when the leader's leverage over
// them beats every other leader's; cohesion (0–100) rises with the members' attitude and the identity's own
// condition and falls with size; it decides how many principles work and at which level. Principle effects
// reach the economy, research, politics and the military through `Country.blocMods`, recomputed monthly.
import { clamp, getRel, log, rand } from '../core';
import { data } from '../data/db';
import { allied, greatPowers, powerScore, rivals } from './diplomacy';
import { atWar } from './military';
import { sharesBorder } from './politics';
import { regionsOf } from '../cache';
import { makeSubject } from '../world';
import type { Country, GameState, JournalEntry } from '../types';

export type BlocIdentity = 'trade_league' | 'sovereign_empire' | 'ideological_union' | 'military_treaty' | 'religious_convocation';
export const BLOC_IDENTITIES: BlocIdentity[] = ['trade_league', 'sovereign_empire', 'ideological_union', 'military_treaty', 'religious_convocation'];

/** PB-02: each identity's core principle — always in force at the level cohesion allows, using no slot. */
export const CORE_PRINCIPLE: Record<BlocIdentity, string> = {
  trade_league: 'market_unification', sovereign_empire: 'exploit_members', ideological_union: 'ideological_alignment',
  military_treaty: 'defensive_cooperation', religious_convocation: 'sacred_civics',
};

/** PB-02: what a would-be leader needs for each identity (null = allowed). */
export function identityRequirement(st: GameState, c: Country, identity: BlocIdentity): string | null {
  switch (identity) {
    case 'trade_league': return c.laws.trade === 'isolationism' ? 'A trade league needs an open trade law (not isolationism)' : null;
    case 'sovereign_empire': return Object.values(st.countries).some((x) => x.alive && x.overlord === c.id) ? null : 'A sovereign empire needs at least one subject';
    case 'ideological_union': return null;
    case 'military_treaty': return st.rivalries.some((k) => k.split('|').includes(c.id)) || st.treaties.some((t) => t.type === 'alliance' && t.members.includes(c.id)) ? null : 'A military treaty needs a rival or an ally';
    case 'religious_convocation': return c.laws.church === 'state_religion' || c.laws.power === 'theocracy' || c.laws.governance === 'theocracy' ? null : 'A religious convocation needs a state religion';
  }
}

/** PB-02: the ideology an ideological union stands for, read from its leader's laws. */
export function blocIdeology(c: Country): 'socialist' | 'single_party' | 'democratic' | 'monarchist' | 'constitutional' {
  if (c.laws.power === 'one_party_state') return c.laws.economy === 'command_economy' ? 'socialist' : 'single_party';
  if (c.laws.power === 'universal_suffrage' || c.laws.power === 'universal_male_suffrage') return 'democratic';
  if (c.laws.governance === 'monarchy' && c.laws.power === 'autocracy') return 'monarchist';
  return 'constitutional';
}

/**
 * PB-02 effect keys. `who` says who receives the effect: every country in the bloc, only the members (not the
 * leader) or only the leader. Levels stack like Victoria 3's tiers: each level's list is the full effect at
 * that level (not an increment).
 *  trade: trade capacity (fraction) · research: tech import from abroad (fraction) · reform: law reform
 *  progress per month · police: radicalism reduction (fraction) · army: army quality (fraction) ·
 *  ideology: AI reform utility toward the leader's law · clergy: clergy approval · construction: construction
 *  speed (fraction) · migration: extra pull of emigrants between bloc countries (fraction) · legitimacy:
 *  legitimacy target · defend: readiness to defend a bloc partner (join-war interest) · attack: readiness to
 *  join the leader's offensive wars · tribute: share of income paid to the leader · alliance: one
 *  mutual-defence alliance · market: one bloc customs union · subjugate: the leader may make weak members
 *  protectorates · pushLaw: the leader may press a law on an AI member · openTrade: AI members drop
 *  isolationism.
 */
export type EffectKey = 'trade' | 'research' | 'reform' | 'police' | 'army' | 'ideology' | 'clergy' | 'construction' | 'migration' | 'legitimacy' | 'defend' | 'attack' | 'tribute' | 'alliance' | 'market' | 'subjugate' | 'pushLaw' | 'openTrade';
export interface Effect { who: 'all' | 'members' | 'leader'; key: EffectKey; value: number }
const E = (who: Effect['who'], key: EffectKey, value: number): Effect => ({ who, key, value });

/** Principle groups: the identities that may choose a group (null = any) and its effects per level 1–3. */
export const PRINCIPLES: Record<string, { identity: BlocIdentity[] | null; levels: [Effect[], Effect[], Effect[]] }> = {
  // identity cores (always in force, no slot)
  market_unification: { identity: ['trade_league'], levels: [
    [E('all', 'market', 1), E('members', 'openTrade', 1)],
    [E('all', 'market', 1), E('members', 'openTrade', 1), E('all', 'trade', 0.05)],
    [E('all', 'market', 1), E('members', 'openTrade', 1), E('all', 'trade', 0.10), E('all', 'construction', 0.05)]] },
  exploit_members: { identity: ['sovereign_empire'], levels: [
    [E('members', 'tribute', 0.02), E('leader', 'subjugate', 1), E('leader', 'defend', 2)],
    [E('members', 'tribute', 0.04), E('leader', 'subjugate', 1), E('leader', 'defend', 2), E('members', 'army', 0.03)],
    [E('members', 'tribute', 0.06), E('leader', 'subjugate', 1), E('leader', 'defend', 2), E('members', 'army', 0.05), E('leader', 'legitimacy', 5)]] },
  ideological_alignment: { identity: ['ideological_union'], levels: [
    [E('members', 'ideology', 0.5)],
    [E('members', 'ideology', 1.0), E('all', 'police', 0.05)],
    [E('members', 'ideology', 1.5), E('all', 'police', 0.10), E('leader', 'pushLaw', 1)]] },
  defensive_cooperation: { identity: null, levels: [
    [E('all', 'defend', 1.5)],
    [E('all', 'defend', 1.5), E('all', 'alliance', 1)],
    [E('all', 'defend', 2), E('all', 'alliance', 1), E('all', 'army', 0.05)]] },
  sacred_civics: { identity: ['religious_convocation'], levels: [
    [E('all', 'clergy', 1), E('all', 'legitimacy', 2)],
    [E('all', 'clergy', 2), E('all', 'legitimacy', 4)],
    [E('all', 'clergy', 3), E('all', 'legitimacy', 6), E('all', 'police', 0.05)]] },
  // choosable
  internal_trade: { identity: null, levels: [
    [E('all', 'trade', 0.05)], [E('all', 'trade', 0.10)], [E('all', 'trade', 0.15), E('all', 'research', 0.05)]] },
  advanced_research: { identity: null, levels: [
    [E('all', 'research', 0.10)], [E('all', 'research', 0.20)], [E('all', 'research', 0.30), E('all', 'reform', 0.005)]] },
  creative_legislature: { identity: null, levels: [
    [E('all', 'reform', 0.01)], [E('all', 'reform', 0.02)], [E('all', 'reform', 0.03), E('all', 'legitimacy', 2)]] },
  police_coordination: { identity: null, levels: [
    [E('all', 'police', 0.05)], [E('all', 'police', 0.10)], [E('all', 'police', 0.15)]] },
  shared_construction: { identity: null, levels: [
    [E('all', 'construction', 0.05)], [E('all', 'construction', 0.10)], [E('all', 'construction', 0.15)]] },
  freedom_of_movement: { identity: ['trade_league', 'ideological_union', 'religious_convocation', 'military_treaty'], levels: [
    [E('all', 'migration', 0.5)], [E('all', 'migration', 1.0)], [E('all', 'migration', 1.5), E('all', 'trade', 0.03)]] },
  aggressive_coordination: { identity: ['military_treaty', 'sovereign_empire', 'ideological_union'], levels: [
    [E('members', 'attack', 1)], [E('members', 'attack', 1.5)], [E('members', 'attack', 2), E('all', 'army', 0.03)]] },
  colonial_partnership: { identity: ['sovereign_empire', 'trade_league'], levels: [
    [E('leader', 'trade', 0.05), E('members', 'construction', 0.05)],
    [E('leader', 'trade', 0.08), E('members', 'construction', 0.10)],
    [E('leader', 'trade', 0.10), E('members', 'construction', 0.15), E('members', 'research', 0.10)]] },
  holy_alliance: { identity: ['religious_convocation'], levels: [
    [E('all', 'defend', 1)], [E('all', 'defend', 1.5), E('members', 'attack', 1)], [E('all', 'defend', 2), E('members', 'attack', 1.5), E('all', 'army', 0.03)]] },
};
const allowedFor = (group: string, identity: BlocIdentity) => { const p = PRINCIPLES[group]; return !!p && (!p.identity || p.identity.includes(identity)); };
export { allowedFor as principleAllowed };

/** Design parameters (PB-01a, PB-02). */
export const BLOC = {
  foundRank: 8, joinMargin: 20, cohesionStep: 2, sizeStrainFrom: 6, sizeStrain: 3, lowCohesion: 25,
  slotCohesion: [40, 70], levelCohesion: [0, 40, 70], inviteMonths: 6,
  // mandates: progress per month = rate × cohesion/100 × (1 + other members/10, at most 2); 100 = one mandate
  mandateRate: 5, mandateMax: 3,
  subjugateCohesion: 60, subjugatePowerShare: 0.25, subjugateLeverage: 50, pushLawCohesion: 60,
  aiFoundChance: 0.05, aiInviteMinCohesion: 50, aiMaxMembers: 12, leaveChance: 0.2,
} as const;

export interface PowerBloc {
  id: string; name: string; leader: string; members: string[]; identity: BlocIdentity;
  principles: Record<string, number>; cohesion: number; founded: number; lastPrincipleChange: number;
  /** PB-02: unspent mandates (each buys one principle change) and progress toward the next (0–100). */
  mandates?: number; mandateProgress?: number;
}
export type BlocMods = Partial<Record<EffectKey, number>>;

export const blocOf = (st: GameState, id: string): PowerBloc | undefined => { const b = st.countries[id]?.bloc; return b ? st.powerBlocs?.[b] : undefined; };
const capitalRegion = (st: GameState, c: Country) => st.regions[data().regionIndex.get(c.capital) ?? -1];

/** Principle slots: 1, +1 at each cohesion step, +1 with 5+ members (max 4). */
export function principleSlots(b: PowerBloc): number {
  return Math.min(4, 1 + BLOC.slotCohesion.filter((x) => b.cohesion >= x).length + (b.members.length >= 5 ? 1 : 0));
}
/** Highest level a principle can work at with this cohesion. */
export const maxPrincipleLevel = (b: PowerBloc) => BLOC.levelCohesion.filter((x) => b.cohesion >= x).length;
/** Working level of a group (0 if not chosen, beyond the slots or above what cohesion allows). */
export function principleLevel(b: PowerBloc, group: string): number {
  if (CORE_PRINCIPLE[b.identity] === group) return Math.max(1, maxPrincipleLevel(b)); // the core principle
  const chosen = Object.keys(b.principles).filter((g) => g !== CORE_PRINCIPLE[b.identity]).slice(0, principleSlots(b));
  return chosen.includes(group) ? Math.min(b.principles[group], maxPrincipleLevel(b)) : 0;
}

/** PB-02: the sources of a leader's hold over a country (computed, not stored), shown in the UI. */
export interface LeverageParts { power: number; relations: number; market: number; subject: number; alliance: number; border: number; culture: number; religion: number; companies: number; rivalry: number }
export function leverageParts(st: GameState, leaderId: string, targetId: string): LeverageParts | null {
  const L = st.countries[leaderId], T = st.countries[targetId];
  if (!L?.alive || !T?.alive || leaderId === targetId) return null;
  const lc = capitalRegion(st, L), tc = capitalRegion(st, T);
  const theirRegions = new Set(regionsOf(st, targetId).map((r) => r.id));
  let sites = 0; for (const co of Object.values(st.companies ?? {})) if (co.home === leaderId) for (const x of co.sites) if (theirRegions.has(x.split('|')[0])) sites++;
  return {
    power: clamp(Math.log2(Math.max(0.01, powerScore(st, L) / Math.max(1, powerScore(st, T)))) * 10, -20, 30),
    relations: clamp(getRel(st, leaderId, targetId) / 5, -20, 20),
    market: (L.customsUnion ?? L.id) === (T.customsUnion ?? T.id) ? 15 : 0,
    subject: T.overlord === leaderId ? 30 : 0,
    alliance: allied(st, leaderId, targetId) ? 10 : 0,
    border: sharesBorder(st, leaderId, targetId) ? 5 : 0,
    culture: lc && tc && lc.culture === tc.culture ? 10 : 0,
    religion: lc && tc && lc.religion === tc.religion ? 5 : 0,
    companies: Math.min(20, sites * 4),
    rivalry: rivals(st, leaderId, targetId) ? -30 : 0,
  };
}
/** A leader's hold over a country: the sum of its sources. */
export function leverage(st: GameState, leaderId: string, targetId: string): number {
  const p = leverageParts(st, leaderId, targetId);
  return p ? Object.values(p).reduce((a, b) => a + b, 0) : 0;
}

/** How well a country fits the bloc's identity (adds to joining and to cohesion). */
function identityFit(st: GameState, b: PowerBloc, id: string): number {
  const L = st.countries[b.leader], c = st.countries[id];
  switch (b.identity) {
    case 'trade_league': return (L.customsUnion ?? L.id) === (c.customsUnion ?? c.id) ? 1 : 0;
    case 'sovereign_empire': return c.overlord === b.leader ? 1 : 0;
    case 'ideological_union': return ((c.laws.power === L.laws.power ? 1 : 0) + (c.laws.economy === L.laws.economy ? 1 : 0)) / 2;
    case 'religious_convocation': return capitalRegion(st, c)?.religion === capitalRegion(st, L)?.religion ? 1 : 0;
    case 'military_treaty': return st.rivalries.some((k) => { const [x, y] = k.split('|'); const o = x === b.leader ? y : y === b.leader ? x : null; return !!o && rivals(st, id, o); }) ? 1 : 0.5;
  }
}

/** Would an AI country accept an invitation? (the leader's leverage must beat every other leader's) */
export function wouldJoin(st: GameState, b: PowerBloc, id: string): boolean {
  const c = st.countries[id];
  if (!c?.alive || c.decentralized || c.id === b.leader || b.members.includes(id)) return false;
  if (getRel(st, id, b.leader) < 0 || rivals(st, id, b.leader) || atWar(st, id) && st.wars.some((w) => (w.attackers.members.includes(id) && w.defenders.members.includes(b.leader)) || (w.defenders.members.includes(id) && w.attackers.members.includes(b.leader)))) return false;
  // PB-02: a religious convocation admits only states of its faith
  if (b.identity === 'religious_convocation' && capitalRegion(st, c)?.religion !== capitalRegion(st, st.countries[b.leader])?.religion) return false;
  const mine = leverage(st, b.leader, id);
  const others = Object.values(st.powerBlocs ?? {}).filter((x) => x.id !== b.id).map((x) => leverage(st, x.leader, id));
  return mine + identityFit(st, b, id) * 15 - Math.max(0, ...others) >= BLOC.joinMargin;
}

export function canFound(st: GameState, id: string, identity?: BlocIdentity): string | null {
  const c = st.countries[id];
  if (!c?.alive || c.decentralized || c.overlord) return 'Only a sovereign state can found a bloc';
  if (c.bloc) return 'Already in a bloc';
  if (!greatPowers(st).slice(0, BLOC.foundRank).includes(id)) return 'Only a great power can found a bloc';
  return identity ? identityRequirement(st, c, identity) : null;
}

export function foundBloc(st: GameState, leader: string, name: string, identity: BlocIdentity, principle: string | null): PowerBloc | null {
  if (!BLOC_IDENTITIES.includes(identity) || canFound(st, leader, identity)) return null;
  const id = `pb_${leader}_${st.tick}`;
  const b: PowerBloc = { id, name: name.trim().slice(0, 48) || `Khối ${st.countries[leader].nameVi}`, leader, members: [leader], identity, principles: {}, cohesion: 50, founded: st.tick, lastPrincipleChange: st.tick, mandates: 0, mandateProgress: 0 };
  if (principle && principle !== CORE_PRINCIPLE[identity] && allowedFor(principle, identity)) b.principles[principle] = 1;
  (st.powerBlocs ??= {})[id] = b;
  st.countries[leader].bloc = id;
  log(st, { type: 'diplomacy', text: `${st.countries[leader].name} founds the power bloc "${b.name}".`, textVi: `${st.countries[leader].nameVi} lập khối quyền lực "${b.name}".`, actors: [leader] });
  return b;
}

export function joinBloc(st: GameState, b: PowerBloc, id: string): void {
  const c = st.countries[id]; if (!c || b.members.includes(id)) return;
  if (c.bloc) leaveBloc(st, id, true);
  b.members.push(id); c.bloc = b.id;
  log(st, { type: 'diplomacy', text: `${c.name} joins ${b.name}.`, textVi: `${c.nameVi} gia nhập ${b.name}.`, actors: [id, b.leader] });
}

export function leaveBloc(st: GameState, id: string, quiet = false): void {
  const b = blocOf(st, id); const c = st.countries[id]; if (!b || !c) return;
  b.members = b.members.filter((m) => m !== id); delete c.bloc; delete c.blocMods;
  if (!quiet) log(st, { type: 'diplomacy', text: `${c.name} leaves ${b.name}.`, textVi: `${c.nameVi} rời ${b.name}.`, actors: [id, b.leader] });
  if (id === b.leader || !st.countries[b.leader]?.alive) dissolveBloc(st, b);
}

function dissolveBloc(st: GameState, b: PowerBloc): void {
  for (const m of b.members) { const c = st.countries[m]; if (c) { delete c.bloc; delete c.blocMods; } }
  st.treaties = st.treaties.filter((t) => t.source !== `pbloc:${b.id}`);
  for (const id of [...(st.countries[b.leader]?.customsUnion === `cu_${b.id}` ? [b.leader] : []), ...b.members]) { const c = st.countries[id]; if (c?.customsUnion === `cu_${b.id}`) c.customsUnion = null; }
  delete st.powerBlocs![b.id];
  log(st, { type: 'diplomacy', text: `${b.name} is dissolved.`, textVi: `${b.name} giải thể.`, actors: [b.leader] });
}

/** Choose a principle at a level (0 removes); one change per cooldown period; identity and slots permitting. */
export function setPrinciple(st: GameState, b: PowerBloc, group: string, level: number): string | null {
  const p = PRINCIPLES[group]; if (!p) return 'Unknown principle';
  if (CORE_PRINCIPLE[b.identity] === group) return 'This is the bloc\'s core principle; it is always in force';
  if (!allowedFor(group, b.identity)) return 'This principle needs another identity';
  if (level < 0 || level > 3) return 'Invalid level';
  if (level === 0) delete b.principles[group]; // dropping a principle is free
  else {
    if (!(group in b.principles) && Object.keys(b.principles).filter((g) => g !== CORE_PRINCIPLE[b.identity]).length >= principleSlots(b)) return 'No free principle slot';
    if (level > maxPrincipleLevel(b)) return 'Cohesion is too low for this level';
    if (b.principles[group] === level) return null;
    if ((b.mandates ?? 0) < 1) return 'No mandate: the bloc earns mandates over time from cohesion and members';
    b.mandates = (b.mandates ?? 0) - 1;
    b.principles[group] = level;
  }
  b.lastPrincipleChange = st.tick;
  return null;
}

/** PB-02: the sources of a bloc's cohesion target, shown in the UI. */
export interface CohesionParts { base: number; attitude: number; identity: number; leverage: number; size: number }
export function cohesionParts(st: GameState, b: PowerBloc): CohesionParts {
  const others = b.members.filter((m) => m !== b.leader && st.countries[m]?.alive);
  if (!others.length) return { base: 50, attitude: 0, identity: 0, leverage: 0, size: 0 };
  return {
    base: 50,
    attitude: others.reduce((s, m) => s + clamp(getRel(st, m, b.leader) / 4, -20, 20), 0) / others.length,
    // a military treaty holds together through its leader's share of the bloc's power (V3 reference)
    identity: b.identity === 'military_treaty'
      ? powerScore(st, st.countries[b.leader]) / Math.max(1, b.members.reduce((s, m) => s + powerScore(st, st.countries[m]), 0)) * 30 - 10
      : others.reduce((s, m) => s + identityFit(st, b, m), 0) / others.length * 25 - 10,
    leverage: others.reduce((s, m) => s + clamp(leverage(st, b.leader, m) / 5, 0, 10), 0) / others.length,
    size: -Math.max(0, b.members.length - BLOC.sizeStrainFrom) * BLOC.sizeStrain,
  };
}
function cohesionTarget(st: GameState, b: PowerBloc): number {
  const p = cohesionParts(st, b);
  return clamp(p.base + p.attitude + p.identity + p.leverage + p.size, 0, 100);
}

/** PB-02: the effects a country receives (or would receive) in this bloc, from every principle in force. */
export function blocModsFor(st: GameState, b: PowerBloc, id: string): BlocMods {
  const role = id === b.leader ? 'leader' : 'members';
  const mods: BlocMods = {};
  const groups = new Set([CORE_PRINCIPLE[b.identity], ...Object.keys(b.principles)]);
  for (const g of groups) {
    const lvl = principleLevel(b, g); if (!lvl) continue;
    for (const e of PRINCIPLES[g].levels[lvl - 1]) if (e.who === 'all' || e.who === role) mods[e.key] = (mods[e.key] ?? 0) + e.value;
  }
  // identity rules (not principles)
  const c = st.countries[id], L = st.countries[b.leader];
  if (b.identity === 'trade_league') mods.trade = (mods.trade ?? 0) * 1.5; // a trade league trades harder
  if (b.identity === 'ideological_union' && role === 'members' && c && L && c.laws.power === L.laws.power && c.laws.economy === L.laws.economy) mods.police = (mods.police ?? 0) + 0.10;
  if (b.identity === 'religious_convocation') mods.legitimacy = (mods.legitimacy ?? 0) + 2;
  if (b.identity === 'military_treaty') mods.alliance = 1; // mutual defence is the treaty itself
  return mods;
}

function applyEffects(st: GameState, b: PowerBloc): void {
  for (const m of b.members) if (st.countries[m]) st.countries[m].blocMods = blocModsFor(st, b, m);
  // tribute: a share of each member's monthly income goes to the leader
  for (const m of b.members) if (m !== b.leader) {
    const c = st.countries[m]; const ex = c.blocMods?.tribute ?? 0;
    if (ex > 0) { const amt = Math.max(0, c.income) * ex; c.treasury -= amt; st.countries[b.leader].treasury += amt; }
  }
  const L = st.countries[b.leader].blocMods ?? {};
  // one mutual-defence alliance of all members
  const tid = `pbloc_${b.id}`; let t = st.treaties.find((x) => x.id === tid);
  if ((L.alliance ?? 0) >= 1 && b.members.length >= 2) {
    if (!t) { t = { id: tid, type: 'alliance', members: [], leader: b.leader, start: st.tick, source: `pbloc:${b.id}` }; st.treaties.push(t); }
    t.members = [...b.members];
  } else if (t) st.treaties = st.treaties.filter((x) => x.id !== tid);
  // one bloc customs union
  const cu = `cu_${b.id}`; let u = st.treaties.find((x) => x.id === cu);
  if ((L.market ?? 0) >= 1 && b.members.length >= 2) {
    if (!u) { u = { id: cu, type: 'customs_union', members: [], leader: b.leader, start: st.tick, source: `pbloc:${b.id}` }; st.treaties.push(u); }
    for (const m of b.members) { const c = st.countries[m]; if (c.customsUnion && c.customsUnion !== cu) { const old = st.treaties.find((x) => x.id === c.customsUnion); if (old) old.members = old.members.filter((x) => x !== m); } c.customsUnion = cu; }
    u.members = [...b.members];
  } else if (u) { for (const m of u.members) if (st.countries[m]?.customsUnion === cu) st.countries[m].customsUnion = null; st.treaties = st.treaties.filter((x) => x.id !== cu); }
}

/** PB-02 mandates: earned monthly from cohesion and the number of members; each buys one principle change. */
function earnMandates(b: PowerBloc): void {
  if ((b.mandates ?? 0) >= BLOC.mandateMax) { b.mandateProgress = 0; return; }
  b.mandateProgress = (b.mandateProgress ?? 0) + BLOC.mandateRate * b.cohesion / 100 * Math.min(2, 1 + (b.members.length - 1) / 10);
  if (b.mandateProgress >= 100) { b.mandateProgress -= 100; b.mandates = (b.mandates ?? 0) + 1; }
}
/** Months until the next mandate at the current pace (Infinity if none is coming). */
export function monthsToMandate(b: PowerBloc): number {
  if ((b.mandates ?? 0) >= BLOC.mandateMax) return Infinity;
  const rate = BLOC.mandateRate * b.cohesion / 100 * Math.min(2, 1 + (b.members.length - 1) / 10);
  return rate > 0 ? Math.ceil((100 - (b.mandateProgress ?? 0)) / rate) : Infinity;
}

/** The player's pending invitations (journal entries of kind bloc_invite, event = bloc id). */
export function invite(st: GameState, b: PowerBloc, target: string): { ok: boolean; reason?: string } {
  const c = st.countries[target];
  if (!c?.alive || c.decentralized) return { ok: false, reason: 'Unknown target' };
  if (b.members.includes(target)) return { ok: false, reason: 'Already a member' };
  if (target === st.player) {
    if ((st.journal ?? []).some((j) => j.kind === 'bloc_invite' && j.event === b.id && j.status === 'active')) return { ok: false, reason: 'Already invited' };
    const j: JournalEntry = { id: `jb_${b.id}_${st.tick}`, kind: 'bloc_invite', event: b.id, country: target, started: st.tick, expires: st.tick + BLOC.inviteMonths, status: 'active' };
    (st.journal ??= []).push(j);
    log(st, { type: 'decision', text: `${st.countries[b.leader].name} invites you to join ${b.name}.`, textVi: `${st.countries[b.leader].nameVi} mời bạn gia nhập ${b.name}.`, actors: [target, b.leader] });
    return { ok: true };
  }
  if (!wouldJoin(st, b, target)) return { ok: false, reason: 'They decline: your leverage over them is not strong enough' };
  joinBloc(st, b, target);
  return { ok: true };
}

/** AI: choose an identity from the founder's situation. */
function aiIdentity(st: GameState, c: Country): BlocIdentity {
  const subjects = Object.values(st.countries).filter((x) => x.alive && x.overlord === c.id).length;
  if (subjects >= 2) return 'sovereign_empire';
  if (c.laws.power === 'one_party_state' || c.laws.economy === 'command_economy') return 'ideological_union';
  if (c.laws.power === 'theocracy' || c.laws.governance === 'theocracy') return 'religious_convocation';
  if (st.rivalries.filter((k) => k.split('|').includes(c.id)).length >= 2) return 'military_treaty';
  return 'trade_league';
}
const AI_PRINCIPLES: Record<BlocIdentity, string[]> = {
  trade_league: ['internal_trade', 'advanced_research', 'creative_legislature', 'defensive_cooperation'],
  sovereign_empire: ['police_coordination', 'defensive_cooperation', 'internal_trade', 'advanced_research'],
  ideological_union: ['police_coordination', 'defensive_cooperation', 'advanced_research', 'creative_legislature'],
  military_treaty: ['advanced_research', 'internal_trade', 'police_coordination', 'creative_legislature'],
  religious_convocation: ['defensive_cooperation', 'internal_trade', 'creative_legislature', 'police_coordination'],
};

function aiBlocs(st: GameState): void {
  // founding (Sandbox only: Historical Mode has history's own blocs; the player may still found one)
  if (st.mode === 'sandbox' && st.date.m === 1) for (const id of greatPowers(st).slice(0, BLOC.foundRank)) {
    if (id === st.player || canFound(st, id) || rand(st) > BLOC.aiFoundChance) continue;
    const c = st.countries[id]; let identity = aiIdentity(st, c);
    if (identityRequirement(st, c, identity)) identity = 'ideological_union'; // always allowed
    foundBloc(st, id, `Khối ${c.nameVi}`, identity, AI_PRINCIPLES[identity][0]);
  }
  for (const b of Object.values(st.powerBlocs ?? {})) {
    if (b.leader === st.player) continue;
    // principles: fill free slots at the highest level cohesion allows
    if ((b.mandates ?? 0) >= 1) {
      const free = AI_PRINCIPLES[b.identity].find((g) => !(g in b.principles) && Object.keys(b.principles).filter((x) => x !== CORE_PRINCIPLE[b.identity]).length < principleSlots(b));
      const up = Object.keys(b.principles).find((g) => b.principles[g] < maxPrincipleLevel(b));
      if (free) setPrinciple(st, b, free, Math.max(1, Math.min(maxPrincipleLevel(b), 3)));
      else if (up) setPrinciple(st, b, up, b.principles[up] + 1);
    }
    // ideological union L3: the leader presses a law on a member that differs (once a year)
    if (st.date.m === 7) for (const m of b.members) pushLaw(st, b, m);
    // invitations twice a year: the best candidate among neighbours, allies and subjects
    if (st.date.m % 6 === 0 && b.cohesion >= BLOC.aiInviteMinCohesion && b.members.length < BLOC.aiMaxMembers) {
      const cands = Object.values(st.countries).filter((c) => c.alive && !c.decentralized && !b.members.includes(c.id) && c.id !== st.player && (sharesBorder(st, b.leader, c.id) || allied(st, b.leader, c.id) || c.overlord === b.leader));
      const best = cands.filter((c) => wouldJoin(st, b, c.id)).sort((x, y) => leverage(st, b.leader, y.id) - leverage(st, b.leader, x.id))[0];
      if (best) joinBloc(st, b, best.id);
    }
  }
}

export function powerBlocsMonth(st: GameState): void {
  if (!st.powerBlocs && st.mode !== 'sandbox') return;
  for (const b of Object.values(st.powerBlocs ?? {})) {
    if (!st.countries[b.leader]?.alive) { dissolveBloc(st, b); continue; }
    b.members = b.members.filter((m) => st.countries[m]?.alive);
    // sovereign empire: the leader's subjects belong to its bloc (unless the subject is the player)
    if (b.identity === 'sovereign_empire') for (const c of Object.values(st.countries)) if (c.alive && c.overlord === b.leader && c.id !== st.player && !b.members.includes(c.id) && !c.bloc) joinBloc(st, b, c.id);
    b.cohesion = clamp(b.cohesion + clamp(cohesionTarget(st, b) - b.cohesion, -BLOC.cohesionStep, BLOC.cohesionStep), 0, 100);
    // low cohesion: unhappy AI members leave (switching to a leader with more leverage, if any)
    if (b.cohesion < BLOC.lowCohesion) for (const m of [...b.members]) {
      if (m === b.leader || m === st.player) continue;
      // members the leader no longer holds (weak leverage or hostile) drift away
      if ((getRel(st, m, b.leader) < 0 || leverage(st, b.leader, m) < BLOC.joinMargin) && rand(st) < BLOC.leaveChance) leaveBloc(st, m);
    }
    earnMandates(b);
    applyEffects(st, b);
  }
  aiBlocs(st);
}

/** Player journal: accept or decline a bloc invitation. */
export function answerBlocInvite(st: GameState, j: JournalEntry, accept: boolean): { ok: boolean; reason?: string } {
  const b = st.powerBlocs?.[j.event];
  if (!b) return { ok: false, reason: 'The bloc no longer exists' };
  if (accept) joinBloc(st, b, j.country);
  return { ok: true };
}

/** PB-02 sovereign empire: the leader turns a weak, long-held member into a protectorate. */
export function subjugateMember(st: GameState, b: PowerBloc, target: string): string | null {
  const c = st.countries[target], L = st.countries[b.leader];
  if (b.identity !== 'sovereign_empire') return 'Only a sovereign empire can do this';
  if (!b.members.includes(target) || target === b.leader) return 'Not a member';
  if (target === st.player) return 'The player decides its own status';
  if (c.overlord) return 'Already a subject';
  if (b.cohesion < BLOC.subjugateCohesion) return 'Cohesion is too low';
  if (powerScore(st, c) > powerScore(st, L) * BLOC.subjugatePowerShare) return 'The member is too strong';
  if (leverage(st, b.leader, target) < BLOC.subjugateLeverage) return 'Not enough leverage';
  makeSubject(st, target, b.leader, 'protectorate');
  return null;
}

/** PB-02 ideological union: the leader starts a reform in an AI member toward one of its own power/economy laws. */
export function pushLaw(st: GameState, b: PowerBloc, target: string): string | null {
  const c = st.countries[target], L = st.countries[b.leader];
  if (!(L?.blocMods?.pushLaw)) return 'Needs the ideological union\'s core principle at level 3';
  if (!b.members.includes(target) || target === b.leader) return 'Not a member';
  if (target === st.player) return 'The player decides its own laws';
  if (b.cohesion < BLOC.pushLawCohesion) return 'Cohesion is too low';
  if (c.reform) return 'A reform is already under way';
  const g = (['power', 'economy'] as const).find((x) => c.laws[x] !== L.laws[x]);
  if (!g) return 'Its laws already match';
  c.reform = { group: g, value: L.laws[g], progress: 0, startedTick: st.tick };
  log(st, { type: 'politics', text: `${L.name} presses ${c.name} to adopt its ${g} law.`, textVi: `${L.nameVi} ép ${c.nameVi} theo luật ${g} của mình.`, actors: [target, b.leader] });
  return null;
}
