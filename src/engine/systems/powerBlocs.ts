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
import type { Country, GameState, JournalEntry } from '../types';

export type BlocIdentity = 'trade_league' | 'sovereign_empire' | 'ideological_union' | 'military_treaty' | 'religious_convocation';
export const BLOC_IDENTITIES: BlocIdentity[] = ['trade_league', 'sovereign_empire', 'ideological_union', 'military_treaty', 'religious_convocation'];

/** Principle groups: the identity a group needs (null = any). Levels 1–3. */
export const PRINCIPLES: Record<string, { identity: BlocIdentity | null }> = {
  market_unification: { identity: 'trade_league' },
  internal_trade: { identity: null },
  advanced_research: { identity: null },
  defensive_cooperation: { identity: null },
  creative_legislature: { identity: null },
  police_coordination: { identity: null },
  exploit_members: { identity: 'sovereign_empire' },
  ideological_alignment: { identity: 'ideological_union' },
  sacred_civics: { identity: 'religious_convocation' },
};

/** Design parameters (PB-01a). */
export const BLOC = {
  foundRank: 8, joinMargin: 20, cohesionStep: 2, sizeStrainFrom: 6, sizeStrain: 3, lowCohesion: 25,
  slotCohesion: [40, 70], levelCohesion: [0, 40, 70], principleCooldownMonths: 12, inviteMonths: 6,
  trade: 0.05, research: 0.1, reform: 0.01, police: 0.05, army: 0.05, exploit: 0.02, ideology: 0.5, clergy: 1,
  aiFoundChance: 0.05, aiInviteMinCohesion: 50, aiMaxMembers: 12, leaveChance: 0.2,
} as const;

export interface PowerBloc {
  id: string; name: string; leader: string; members: string[]; identity: BlocIdentity;
  principles: Record<string, number>; cohesion: number; founded: number; lastPrincipleChange: number;
}
export interface BlocMods { trade: number; research: number; reform: number; police: number; army: number; ideology: number; clergy: number }

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
  const chosen = Object.keys(b.principles).slice(0, principleSlots(b));
  return chosen.includes(group) ? Math.min(b.principles[group], maxPrincipleLevel(b)) : 0;
}

/** A leader's hold over a country (computed, not stored): power, ties, market, subjects, culture, companies. */
export function leverage(st: GameState, leaderId: string, targetId: string): number {
  const L = st.countries[leaderId], T = st.countries[targetId];
  if (!L?.alive || !T?.alive || leaderId === targetId) return 0;
  let v = clamp(Math.log2(Math.max(0.01, powerScore(st, L) / Math.max(1, powerScore(st, T)))) * 10, -20, 30);
  v += clamp(getRel(st, leaderId, targetId) / 5, -20, 20);
  if ((L.customsUnion ?? L.id) === (T.customsUnion ?? T.id)) v += 15;
  if (T.overlord === leaderId) v += 30;
  if (allied(st, leaderId, targetId)) v += 10;
  if (sharesBorder(st, leaderId, targetId)) v += 5;
  const lc = capitalRegion(st, L), tc = capitalRegion(st, T);
  if (lc && tc && lc.culture === tc.culture) v += 10;
  if (lc && tc && lc.religion === tc.religion) v += 5;
  const theirRegions = new Set(regionsOf(st, targetId).map((r) => r.id));
  let sites = 0; for (const co of Object.values(st.companies ?? {})) if (co.home === leaderId) for (const s of co.sites) if (theirRegions.has(s.split('|')[0])) sites++;
  v += Math.min(20, sites * 4);
  if (rivals(st, leaderId, targetId)) v -= 30;
  return v;
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
  const mine = leverage(st, b.leader, id);
  const others = Object.values(st.powerBlocs ?? {}).filter((x) => x.id !== b.id).map((x) => leverage(st, x.leader, id));
  return mine + identityFit(st, b, id) * 15 - Math.max(0, ...others) >= BLOC.joinMargin;
}

export function canFound(st: GameState, id: string): string | null {
  const c = st.countries[id];
  if (!c?.alive || c.decentralized || c.overlord) return 'Only a sovereign state can found a bloc';
  if (c.bloc) return 'Already in a bloc';
  if (!greatPowers(st).slice(0, BLOC.foundRank).includes(id)) return 'Only a great power can found a bloc';
  return null;
}

export function foundBloc(st: GameState, leader: string, name: string, identity: BlocIdentity, principle: string | null): PowerBloc | null {
  if (canFound(st, leader) || !BLOC_IDENTITIES.includes(identity)) return null;
  const id = `pb_${leader}_${st.tick}`;
  const b: PowerBloc = { id, name: name.trim().slice(0, 48) || `Khối ${st.countries[leader].nameVi}`, leader, members: [leader], identity, principles: {}, cohesion: 50, founded: st.tick, lastPrincipleChange: -999 };
  if (principle && PRINCIPLES[principle] && (!PRINCIPLES[principle].identity || PRINCIPLES[principle].identity === identity)) b.principles[principle] = 1;
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
  if (p.identity && p.identity !== b.identity) return 'This principle needs another identity';
  if (level < 0 || level > 3) return 'Invalid level';
  if (st.tick - b.lastPrincipleChange < BLOC.principleCooldownMonths) return 'Principles were changed recently';
  if (level === 0) delete b.principles[group];
  else {
    if (!(group in b.principles) && Object.keys(b.principles).length >= principleSlots(b)) return 'No free principle slot';
    if (level > maxPrincipleLevel(b)) return 'Cohesion is too low for this level';
    b.principles[group] = level;
  }
  b.lastPrincipleChange = st.tick;
  return null;
}

function cohesionTarget(st: GameState, b: PowerBloc): number {
  const others = b.members.filter((m) => m !== b.leader && st.countries[m]?.alive);
  if (!others.length) return 50;
  const att = others.reduce((s, m) => s + clamp(getRel(st, m, b.leader) / 4, -20, 20), 0) / others.length;
  const fit = others.reduce((s, m) => s + identityFit(st, b, m), 0) / others.length;
  const lev = others.reduce((s, m) => s + clamp(leverage(st, b.leader, m) / 5, 0, 10), 0) / others.length;
  return clamp(50 + att + (fit * 25 - 10) + lev - Math.max(0, b.members.length - BLOC.sizeStrainFrom) * BLOC.sizeStrain, 0, 100);
}

function applyEffects(st: GameState, b: PowerBloc): void {
  const lvl = (g: string) => principleLevel(b, g);
  const mods: BlocMods = {
    trade: lvl('internal_trade') * BLOC.trade, research: lvl('advanced_research') * BLOC.research, reform: lvl('creative_legislature') * BLOC.reform,
    police: lvl('police_coordination') * BLOC.police, army: lvl('defensive_cooperation') >= 3 ? BLOC.army : 0, ideology: lvl('ideological_alignment') * BLOC.ideology, clergy: lvl('sacred_civics') * BLOC.clergy,
  };
  for (const m of b.members) if (st.countries[m]) st.countries[m].blocMods = mods;
  // exploit members: a share of each member's monthly income goes to the leader
  const ex = lvl('exploit_members') * BLOC.exploit;
  if (ex > 0) for (const m of b.members) if (m !== b.leader) { const c = st.countries[m]; const amt = Math.max(0, c.income) * ex; c.treasury -= amt; st.countries[b.leader].treasury += amt; }
  // defensive cooperation L2+: one mutual-defence alliance of all members
  const tid = `pbloc_${b.id}`; let t = st.treaties.find((x) => x.id === tid);
  if (lvl('defensive_cooperation') >= 2 && b.members.length >= 2) {
    if (!t) { t = { id: tid, type: 'alliance', members: [], leader: b.leader, start: st.tick, source: `pbloc:${b.id}` }; st.treaties.push(t); }
    t.members = [...b.members];
  } else if (t) st.treaties = st.treaties.filter((x) => x.id !== tid);
  // market unification L3: every member in the bloc's customs union (L2: members may be invited — the UI/AI)
  const cu = `cu_${b.id}`; let u = st.treaties.find((x) => x.id === cu);
  if (lvl('market_unification') >= 3 && b.members.length >= 2) {
    if (!u) { u = { id: cu, type: 'customs_union', members: [], leader: b.leader, start: st.tick, source: `pbloc:${b.id}` }; st.treaties.push(u); }
    for (const m of b.members) { const c = st.countries[m]; if (c.customsUnion && c.customsUnion !== cu) { const old = st.treaties.find((x) => x.id === c.customsUnion); if (old) old.members = old.members.filter((x) => x !== m); } c.customsUnion = cu; }
    u.members = [...b.members];
  } else if (u) { for (const m of u.members) if (st.countries[m]?.customsUnion === cu) st.countries[m].customsUnion = null; st.treaties = st.treaties.filter((x) => x.id !== cu); }
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
  trade_league: ['market_unification', 'internal_trade', 'advanced_research', 'creative_legislature'],
  sovereign_empire: ['exploit_members', 'police_coordination', 'defensive_cooperation', 'internal_trade'],
  ideological_union: ['ideological_alignment', 'police_coordination', 'defensive_cooperation', 'advanced_research'],
  military_treaty: ['defensive_cooperation', 'advanced_research', 'internal_trade', 'police_coordination'],
  religious_convocation: ['sacred_civics', 'defensive_cooperation', 'internal_trade', 'creative_legislature'],
};

function aiBlocs(st: GameState): void {
  // founding (Sandbox only: Historical Mode has history's own blocs; the player may still found one)
  if (st.mode === 'sandbox' && st.date.m === 1) for (const id of greatPowers(st).slice(0, BLOC.foundRank)) {
    if (id === st.player || canFound(st, id) || rand(st) > BLOC.aiFoundChance) continue;
    const c = st.countries[id]; const identity = aiIdentity(st, c);
    foundBloc(st, id, `Khối ${c.nameVi}`, identity, AI_PRINCIPLES[identity][0]);
  }
  for (const b of Object.values(st.powerBlocs ?? {})) {
    if (b.leader === st.player) continue;
    // principles: fill free slots at the highest level cohesion allows
    if (st.tick - b.lastPrincipleChange >= BLOC.principleCooldownMonths) {
      const free = AI_PRINCIPLES[b.identity].find((g) => !(g in b.principles) && Object.keys(b.principles).length < principleSlots(b));
      const up = Object.keys(b.principles).find((g) => b.principles[g] < maxPrincipleLevel(b));
      if (free) setPrinciple(st, b, free, Math.max(1, Math.min(maxPrincipleLevel(b), 3)));
      else if (up) setPrinciple(st, b, up, b.principles[up] + 1);
    }
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
    b.cohesion = clamp(b.cohesion + clamp(cohesionTarget(st, b) - b.cohesion, -BLOC.cohesionStep, BLOC.cohesionStep), 0, 100);
    // low cohesion: unhappy AI members leave (switching to a leader with more leverage, if any)
    if (b.cohesion < BLOC.lowCohesion) for (const m of [...b.members]) {
      if (m === b.leader || m === st.player) continue;
      // members the leader no longer holds (weak leverage or hostile) drift away
      if ((getRel(st, m, b.leader) < 0 || leverage(st, b.leader, m) < BLOC.joinMargin) && rand(st) < BLOC.leaveChance) leaveBloc(st, m);
    }
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
