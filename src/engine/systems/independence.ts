// DECOL-03: independence movements, the colonial powers' calculus, and international pressure (embargoes, foreign
// support). Owner 2026-11-23: "after 1950 independence movements were strong everywhere, so Britain granted
// independence to many countries" — "but countries do not want to grant independence unless their position stays
// strong, or there are other levers: embargoes, an exchange of interests, isolation, as the NATO/Warsaw Pact blocs did".
//
// A movement is the colonial regions of one nation held by one owner. Its strength (0–100) follows the regions'
// nationalism and radicalism, an era-wide wave of anti-colonialism (rising after 1885, 1919, peaking 1955–65),
// foreign supporters and the owner's weakness. At 55 it demands independence; held at 85 for a year it rises.
// The owner (AI by interest, the player by choice) represses, grants independence with ties (customs union,
// alliance, bloc — or as a dominion), grants it outright, or ignores it. Keeping a colony gets costlier with the
// movement's strength, embargoes by great powers, foreign support for the movement, allies' pressure and war
// exhaustion; a strong, unpressed owner keeps its colonies longer.
//
// Historical Mode: colonies covered by the decolonisation register (CG-37) follow their dates when an AI owns them;
// the player's colonies, and colonies outside the register, follow these rules.
import { clamp, getRel, addRel, log, rand } from '../core';
import { data } from '../data/db';
import { allied, declareWar, greatPowers, joinWillingness, rivals } from './diplomacy';
import { isColonialRegion } from './growth';
import { coreNationOf } from './population';
import { createNation, makeSubject } from '../world';
import { blocOf, joinBloc } from './powerBlocs';
import { campOfCountry } from './blocs';
import type { Country, GameState, JournalEntry } from '../types';

/** The anti-colonial wave by year (design parameter; shapes, not dates, of the 20th-century decolonisation waves). */
export const WAVE_STEPS: [number, number][] = [[1885, 0.1], [1919, 0.25], [1945, 0.6], [1955, 1.0], [1966, 0.8], [1976, 0.4]];
export function eraWave(year: number): number { let w = 0; for (const [y, v] of WAVE_STEPS) if (year >= y) w = v; return w; }

/** Design parameters (DECOL-03). */
export const INDEP = {
  demand: 55, rising: 85, risingMonths: 12, step: 0.05, demandWave: 0.25, demandAnyway: 75, minPop: 50_000, valueFloor: 20,
  repressBelow: 1.5, tiesBelow: 3, costBase: 0.2,
  natWeight: 60, radWeight: 60, waveWeight: 30, supporter: 10, supporterMax: 30, lostWar: 15, exhausted: 10, repression: 35,
  repressMonths: 36, repressCost: 0.5, repressExhaustion: 5, repressRadical: 0.05,
  decisionCooldown: 60, journalMonths: 24,
  // owner calculus: cost of keeping vs value of the colony
  valueScale: 100, valueMax: 80, costStrength: 0.6, costEmbargo: 12, costSupporter: 8, costAlly: 6, costExhaustion: 0.3, costLostWar: 15, strongDiscount: 0.7,
  tiesRelation: 60, dominionRelation: 40, fullRelation: 20, supporterRelation: 40,
  // international pressure
  supportChance: 0.3, supportMinStrength: 40, supportMinWave: 0.25, embargoMinStrength: 60, embargoYear: 1945, embargoMonths: 120,
  embargoGreat: 0.08, embargoMinor: 0.03, embargoMax: 0.35, embargoRelation: -30,
  // nationalism and radicalism pushed by the wave in colonial regions
  waveNationalism: 0.6, waveRadical: 0.25,
} as const;

export interface MovementState {
  nation: string; owner: string; strength: number; supporters: string[];
  regions: string[]; pop: number;
  repressedUntil?: number; decidedAt?: number; highMonths?: number;
}
export interface Embargo { by: string; target: string; since: number }

const mkey = (nation: string, owner: string) => `${nation}|${owner}`;
let recordRegions: Set<string> | null = null;
/** Regions covered by the historical decolonisation register. */
export function inRegister(regionId: string): boolean {
  if (!recordRegions) { recordRegions = new Set(); for (const r of data().db.decolonisation ?? []) for (const id of r.regions) recordRegions.add(id); }
  return recordRegions.has(regionId);
}

/**
 * Overseas colonies only (the UN's "salt-water" criterion, GA res. 1541 of 1960): a colonial region that is not
 * land-connected to the owner's home through the owner's own territory. Contiguous empires (Russia's Asia, the
 * American West, Ottoman Arab lands) keep the nationalist secession rules instead.
 */
let contig: { tick: number; st: GameState | null; by: Map<string, Set<string>> } = { tick: -1, st: null, by: new Map() };
function homeConnected(st: GameState, owner: string): Set<string> {
  if (contig.tick !== st.tick || contig.st !== st) contig = { tick: st.tick, st, by: new Map() };
  const hit = contig.by.get(owner); if (hit) return hit;
  const d = data(); const seen = new Set<string>(); const queue: string[] = [];
  for (const r of st.regions) if (r.owner === owner && !isColonialRegion(st, r)) { seen.add(r.id); queue.push(r.id); }
  while (queue.length) {
    const id = queue.pop()!;
    for (const n of d.landNeighbors[d.regionIndex.get(id)!] ?? []) {
      if (seen.has(n)) continue;
      const r = st.regions[d.regionIndex.get(n) ?? -1];
      if (r && r.owner === owner) { seen.add(n); queue.push(n); }
    }
  }
  contig.by.set(owner, seen);
  return seen;
}
export function overseasColonial(st: GameState, r: GameState['regions'][number]): boolean {
  return isColonialRegion(st, r) && !homeConnected(st, r.owner).has(r.id);
}

/**
 * Peoples who in this period were incorporated into settler states rather than decolonised into states of their
 * own (indigenous peoples of the Americas, Siberia and Australia; the Inuit got home rule, not statehood).
 */
export const NO_STATEHOOD_FAMILIES = ['various', 'australian', 'uto_aztecan', 'athabaskan', 'eskimo_aleut'];
let familyOf: Map<string, string> | null = null;
export function statehoodCandidate(culture: string): boolean {
  if (!familyOf) familyOf = new Map(data().db.cultures.map((c) => [c.id, c.family]));
  return !NO_STATEHOOD_FAMILIES.includes(familyOf.get(culture) ?? '');
}

/** The owner's weakness and the wave it faces. */
export function independenceWave(st: GameState, owner?: Country): number {
  let w = eraWave(st.date.y);
  if (owner && owner.lastWarLost !== null && st.tick - owner.lastWarLost < 120) w += 0.1;
  return w;
}

/** Colonial regions of a foreign nation, grouped by (nation, owner). */
function movementGroups(st: GameState): Map<string, { nation: string; owner: string; regs: GameState['regions'] }> {
  const d = data(); const out = new Map<string, { nation: string; owner: string; regs: GameState['regions'] }>();
  for (const r of st.regions) {
    const c = st.countries[r.owner]; if (!c?.alive || c.decentralized || !overseasColonial(st, r)) continue;
    const nation = d.cultureNation.get(r.culture); if (!nation || nation === coreNationOf(st, c) || !statehoodCandidate(r.culture)) continue;
    const k = mkey(nation, r.owner);
    (out.get(k) ?? out.set(k, { nation, owner: r.owner, regs: [] }).get(k)!).regs.push(r);
  }
  return out;
}

export interface MovementParts { nationalism: number; radicalism: number; wave: number; supporters: number; weakness: number; repression: number }
export function movementParts(st: GameState, m: MovementState): MovementParts {
  const d = data(); const owner = st.countries[m.owner];
  const regs = m.regions.map((id) => st.regions[d.regionIndex.get(id) ?? -1]).filter(Boolean);
  const pop = Math.max(1, regs.reduce((s, r) => s + r.pop, 0));
  const nat = regs.reduce((s, r) => s + r.nationalism * r.pop, 0) / pop;
  const rad = regs.reduce((s, r) => s + r.radical * r.pop, 0) / pop;
  return {
    nationalism: nat * INDEP.natWeight, radicalism: rad * INDEP.radWeight,
    wave: independenceWave(st, owner) * INDEP.waveWeight,
    supporters: Math.min(INDEP.supporterMax, m.supporters.length * INDEP.supporter),
    weakness: (owner?.lastWarLost !== null && owner && st.tick - owner.lastWarLost! < 120 ? INDEP.lostWar : 0) + ((owner?.warExhaustion ?? 0) > 40 ? INDEP.exhausted : 0),
    repression: (m.repressedUntil ?? -1) > st.tick ? -INDEP.repression : 0,
  };
}

/** The owner's calculus: value of keeping the colony and the cost of doing so (both in the same scale). */
export interface OwnerCalculus { value: number; cost: number; parts: Record<string, number>; strong: boolean }
export function ownerCalculus(st: GameState, m: MovementState): OwnerCalculus {
  const o = st.countries[m.owner];
  // every colony carries prestige and strategic value (the floor); large ones are worth much more
  const value = Math.max(INDEP.valueFloor, Math.min(INDEP.valueMax, INDEP.valueScale * m.pop / Math.max(1, o.stats.pop)));
  const embargoes = (st.embargoes ?? []).filter((e) => e.target === m.owner && greatPowers(st).includes(e.by)).length;
  const allies = st.date.y >= INDEP.embargoYear ? greatPowers(st).filter((g) => g !== m.owner && allied(st, g, m.owner) && !hasColonialMovement(st, g)).length : 0;
  const parts = {
    movement: m.strength * INDEP.costStrength, embargoes: embargoes * INDEP.costEmbargo, supporters: m.supporters.length * INDEP.costSupporter,
    allies: allies * INDEP.costAlly, exhaustion: o.warExhaustion * INDEP.costExhaustion,
    lostWar: o.lastWarLost !== null && st.tick - o.lastWarLost < 120 ? INDEP.costLostWar : 0,
  };
  const strong = greatPowers(st).slice(0, 3).includes(o.id) && o.warExhaustion < 20;
  // before the anti-colonial era the world shrugs: keeping a colony is cheap (×0.2 at no wave, ×1.2 at the peak)
  const raw = Object.values(parts).reduce((a, b) => a + b, 0) * (INDEP.costBase + independenceWave(st, o));
  return { value, cost: strong ? raw * INDEP.strongDiscount : raw, parts, strong };
}
function hasColonialMovement(st: GameState, id: string): boolean { return Object.values(st.movements ?? {}).some((m) => m.owner === id && m.strength >= INDEP.demand); }

export type MovementAction = 'repress' | 'grant_ties' | 'grant_dominion' | 'grant' | 'refuse';

/** Monthly: movements, decisions, risings, foreign support and embargoes. */
export function independenceMonth(st: GameState): void {
  const groups = movementGroups(st);
  st.movements ??= {};
  for (const k of Object.keys(st.movements)) if (!groups.has(k)) delete st.movements[k];
  for (const [k, g] of groups) {
    const m = st.movements[k] ??= { nation: g.nation, owner: g.owner, strength: 0, supporters: [], regions: [], pop: 0 };
    m.regions = g.regs.map((r) => r.id); m.pop = g.regs.reduce((s, r) => s + r.pop, 0);
    m.supporters = m.supporters.filter((s) => st.countries[s]?.alive && s !== m.owner);
    const target = clamp(Object.values(movementParts(st, m)).reduce((a, b) => a + b, 0), 0, 100);
    m.strength = clamp(m.strength + (target - m.strength) * INDEP.step, 0, 100);
    m.highMonths = m.strength >= INDEP.rising ? (m.highMonths ?? 0) + 1 : 0;
    if (followsRegister(st, m)) continue;
    // demand: the player decides through the journal; an AI owner weighs its interests (yearly)
    const ripe = m.pop >= INDEP.minPop && (independenceWave(st, st.countries[m.owner]) >= INDEP.demandWave || m.strength >= INDEP.demandAnyway);
    if (ripe && m.strength >= INDEP.demand && st.tick - (m.decidedAt ?? -999) >= INDEP.decisionCooldown) {
      if (m.owner === st.player) {
        if (!(st.journal ?? []).some((j) => j.kind === 'independence_movement' && j.event === k && j.status === 'active')) {
          const j: JournalEntry = { id: `jm_${k.replace('|', '_')}_${st.tick}`, kind: 'independence_movement', event: k, country: m.owner, started: st.tick, expires: st.tick + INDEP.journalMonths, status: 'active' };
          (st.journal ??= []).push(j);
          log(st, { type: 'decision', text: `An independence movement demands statehood for the ${m.nation} people.`, textVi: `Phong trào độc lập của người ${m.nation} đòi lập quốc. Bạn quyết định.`, actors: [m.owner, ...m.supporters] });
        }
      } else if (st.date.m === 1) movementAction(st, k, aiChoice(st, m));
    }
    if (!st.movements[k]) continue; // granted this month
    // rising: held at the top for a year and not being repressed
    if (m.pop >= INDEP.minPop && (m.highMonths ?? 0) >= INDEP.risingMonths && (m.repressedUntil ?? -1) <= st.tick && (st.mode === 'sandbox' || m.owner === st.player || !m.regions.some(inRegister))) rise(st, k);
  }
  if (st.date.m === 1) { aiSupport(st); aiEmbargoes(st); }
  applyEmbargoes(st);
}

/** Historical Mode: an AI owner's colonies in the decolonisation register follow their dates. */
const followsRegister = (st: GameState, m: MovementState) => st.mode === 'historical' && m.owner !== st.player && m.regions.some(inRegister);

/** The concrete reasons an owner might let a colony go (owner 2026-11-23: "granting needs a benefit or a cause"). */
export function grantCauses(st: GameState, m: MovementState): string[] {
  const { parts } = ownerCalculus(st, m); const out: string[] = [];
  if (parts.embargoes) out.push('embargo'); if (parts.allies) out.push('allies');
  if (parts.lostWar) out.push('lost_war'); if (st.countries[m.owner].warExhaustion >= 40) out.push('exhaustion');
  if (m.strength >= INDEP.rising) out.push('insurgency');
  return out;
}
const CAUSE_VI: Record<string, string> = { embargo: 'bị các cường quốc cấm vận', allies: 'đồng minh gây sức ép', lost_war: 'vừa thua trận', exhaustion: 'kiệt quệ vì chiến tranh', insurgency: 'phong trào sắp nổi dậy' };
const CAUSE_EN: Record<string, string> = { embargo: 'great-power embargoes', allies: 'pressure from allies', lost_war: 'a lost war', exhaustion: 'war exhaustion', insurgency: 'an imminent rising' };

/** AI owner: without a concrete cause it keeps the colony (represses if it can pay); with causes it weighs value
 * against cost — trading independence for ties while that is enough, letting go only when keeping is hopeless. */
function aiChoice(st: GameState, m: MovementState): MovementAction {
  const { value, cost } = ownerCalculus(st, m);
  const o = st.countries[m.owner];
  const canRepress = o.treasury > o.income * INDEP.repressCost;
  if (!grantCauses(st, m).length) return canRepress ? 'repress' : 'refuse';
  const ratio = cost / Math.max(5, value);
  if (ratio < INDEP.repressBelow && canRepress) return 'repress';
  if (ratio < INDEP.tiesBelow) return greatPowers(st).slice(0, 5).includes(m.owner) && rand(st) < 0.5 ? 'grant_dominion' : 'grant_ties';
  return 'grant';
}

/** Carry out an owner's choice on a movement (player command or AI). */
export function movementAction(st: GameState, key: string, a: MovementAction): string | null {
  const m = st.movements?.[key]; if (!m) return 'No such movement';
  const o = st.countries[m.owner];
  m.decidedAt = st.tick;
  switch (a) {
    case 'repress': {
      const cost = Math.max(0, o.income) * INDEP.repressCost;
      if (o.treasury < cost) return 'Not enough money to repress';
      o.treasury -= cost; o.warExhaustion = clamp(o.warExhaustion + INDEP.repressExhaustion, 0, 100);
      m.repressedUntil = st.tick + INDEP.repressMonths;
      for (const id of m.regions) { const r = st.regions[data().regionIndex.get(id) ?? -1]; if (r) r.radical = Math.min(0.9, r.radical + INDEP.repressRadical); }
      log(st, { type: 'politics', text: `${o.name} represses the ${m.nation} independence movement.`, textVi: `${o.nameVi} đàn áp phong trào độc lập của người ${m.nation}.`, actors: [o.id] });
      return null;
    }
    case 'refuse': for (const id of m.regions) { const r = st.regions[data().regionIndex.get(id) ?? -1]; if (r) r.radical = Math.min(0.9, r.radical + 0.1); } return null;
    case 'grant_ties': case 'grant_dominion': case 'grant': return grant(st, key, a);
  }
}

/** A new state from an owner's colonial regions: independence with ties, as a dominion, or outright (also used by
 * story events). Returns the new state's id. */
export function createIndependentState(st: GameState, owner: string, regionIds: string[], nation: string, mode: 'ties' | 'dominion' | 'full', names?: { en: string; vi: string }): string | null {
  const d = data(); const o = st.countries[owner]; if (!o) return null;
  const regs = regionIds.map((id) => st.regions[d.regionIndex.get(id) ?? -1]).filter((r) => r && r.owner === owner).sort((a, b) => b.pop - a.pop);
  if (!regs.length) return null;
  const id = createNation(st, nation, regs.map((r) => r.id), owner, 'independence', undefined, names);
  const nc = st.countries[id];
  nc.army.manpower = nc.army.target = Math.max(1000, Math.round(regs.reduce((s, r) => s + r.pop, 0) * 0.003));
  o.claims = o.claims.filter((x) => !regionIds.includes(x));
  nc.truce = { with: owner, until: st.tick + 24 };
  if (mode === 'dominion') { makeSubject(st, id, owner, 'dominion'); addRel(st, id, owner, INDEP.dominionRelation); }
  else if (mode === 'ties') {
    // independence in exchange for ties: the former owner's market, an alliance and its power bloc
    addRel(st, id, owner, INDEP.tiesRelation);
    if (o.customsUnion) { const u = st.treaties.find((t) => t.id === o.customsUnion); if (u && !u.members.includes(id)) { u.members.push(id); nc.customsUnion = u.id; } }
    st.treaties.push({ id: `ties_${owner}_${id}`, type: 'alliance', members: [owner, id], leader: owner, start: st.tick, source: 'ties' });
    const b = blocOf(st, owner); if (b) joinBloc(st, b, id);
  } else addRel(st, id, owner, INDEP.fullRelation);
  return id;
}

function grant(st: GameState, key: string, a: 'grant_ties' | 'grant_dominion' | 'grant'): string | null {
  const m = st.movements![key]; const o = st.countries[m.owner];
  const id = createIndependentState(st, m.owner, m.regions, m.nation, a === 'grant_ties' ? 'ties' : a === 'grant_dominion' ? 'dominion' : 'full');
  if (!id) return 'No regions left to grant';
  const nc = st.countries[id];
  for (const s of m.supporters) addRel(st, id, s, INDEP.supporterRelation);
  const how = a === 'grant_dominion' ? 'as a dominion' : a === 'grant_ties' ? 'with close ties' : 'outright';
  const howVi = a === 'grant_dominion' ? 'thành lãnh thổ tự trị' : a === 'grant_ties' ? 'kèm ràng buộc (thị trường, liên minh)' : 'hoàn toàn';
  const causes = o.id === st.player ? [] : grantCauses(st, m);
  const why = causes.length ? ` (${causes.map((c) => CAUSE_EN[c]).join(', ')})` : '', whyVi = causes.length ? ` (${causes.map((c) => CAUSE_VI[c]).join(', ')})` : '';
  log(st, { type: 'state', text: `${o.name} grants independence to ${nc.name} ${how}${why}.`, textVi: `${o.nameVi} trao độc lập cho ${nc.nameVi} ${howVi}${whyVi}.`, actors: [o.id, id] });
  delete st.movements![key];
  return null;
}

/** A rising: a rebel state takes the field in the movement's regions; its supporters may join it. */
function rise(st: GameState, key: string): void {
  const m = st.movements?.[key]; if (!m) return; const o = st.countries[m.owner];
  if (st.wars.some((w) => w.kind === 'independence' && w.defenders.members.includes(o.id))) return;
  const d = data();
  const regs = m.regions.map((id) => st.regions[d.regionIndex.get(id) ?? -1]).filter((r) => r && r.owner === o.id).sort((a, b) => b.pop - a.pop);
  if (!regs.length) return;
  const id = createNation(st, m.nation, [], o.id, 'rising'); const rebel = st.countries[id];
  rebel.kind = 'rebel'; rebel.capital = regs[0].id;
  rebel.army.manpower = rebel.army.target = Math.max(1000, Math.round(regs.reduce((s, r) => s + r.pop, 0) * 0.004 * (1 + m.supporters.length * 0.25)));
  const w = declareWar(st, id, o.id, [{ by: id, type: 'independence', target: o.id, regions: regs.map((r) => r.id) }], `${rebel.name} War of Independence`, 'independence');
  for (const r of regs) r.controller = id;
  if (w) for (const s of m.supporters) if (!w.attackers.members.includes(s) && !w.defenders.members.includes(s) && s !== st.player && joinWillingness(st, s, o.id, id) > 0) w.attackers.members.push(s);
  for (const s of m.supporters) addRel(st, id, s, INDEP.supporterRelation);
  log(st, { type: 'war', text: `The ${m.nation} independence movement rises against ${o.name}.`, textVi: `Phong trào độc lập của người ${m.nation} nổi dậy chống ${o.nameVi}.`, actors: [id, o.id, ...m.supporters] });
  delete st.movements![key];
}

/** Support a movement (money, arms, diplomatic backing): it grows; the owner resents it. */
export function supportMovement(st: GameState, supporter: string, key: string, on = true): string | null {
  const m = st.movements?.[key]; if (!m) return 'No such movement';
  if (supporter === m.owner) return 'You cannot support a movement against yourself';
  if (on) { if (!m.supporters.includes(supporter)) { m.supporters.push(supporter); addRel(st, supporter, m.owner, -20); } }
  else m.supporters = m.supporters.filter((s) => s !== supporter);
  return null;
}

/** AI great powers back movements against rivals or the other camp (yearly). */
function aiSupport(st: GameState): void {
  const gps = greatPowers(st).slice(0, 8);
  for (const m of Object.values(st.movements ?? {})) {
    if (followsRegister(st, m) || m.pop < INDEP.minPop || m.strength < INDEP.supportMinStrength || independenceWave(st, st.countries[m.owner]) < INDEP.supportMinWave) continue;
    for (const g of gps) {
      if (g === m.owner || g === st.player || m.supporters.includes(g) || allied(st, g, m.owner)) continue;
      const otherCamp = (() => { const a = campOfCountry(st, g), b = campOfCountry(st, m.owner); return !!a && !!b && a !== b; })();
      const anticolonial = st.date.y >= INDEP.embargoYear && !hasColonialMovement(st, g);
      if ((rivals(st, g, m.owner) || otherCamp || (anticolonial && getRel(st, g, m.owner) < 20)) && rand(st) < INDEP.supportChance) supportMovement(st, g, mkey(m.nation, m.owner));
    }
  }
}

/** Embargo: the target's trade shrinks; relations sour. */
export function setEmbargo(st: GameState, by: string, target: string, on: boolean): string | null {
  if (by === target || !st.countries[target]?.alive) return 'Invalid target';
  st.embargoes ??= [];
  const has = st.embargoes.some((e) => e.by === by && e.target === target);
  if (on && !has) { st.embargoes.push({ by, target, since: st.tick }); addRel(st, by, target, INDEP.embargoRelation); log(st, { type: 'diplomacy', text: `${st.countries[by].name} imposes an embargo on ${st.countries[target].name}.`, textVi: `${st.countries[by].nameVi} cấm vận ${st.countries[target].nameVi}.`, actors: [by, target] }); }
  if (!on && has) { st.embargoes = st.embargoes.filter((e) => !(e.by === by && e.target === target)); log(st, { type: 'diplomacy', text: `${st.countries[by].name} lifts its embargo on ${st.countries[target].name}.`, textVi: `${st.countries[by].nameVi} dỡ bỏ cấm vận ${st.countries[target].nameVi}.`, actors: [by, target] }); }
  return null;
}

/** AI: supporters of a strong movement embargo its owner (after 1945, or in a Sandbox wave); lifted when it is over. */
function aiEmbargoes(st: GameState): void {
  const strong = Object.values(st.movements ?? {}).filter((m) => !followsRegister(st, m) && m.pop >= INDEP.minPop && m.strength >= INDEP.embargoMinStrength);
  if (st.date.y >= INDEP.embargoYear || st.mode === 'sandbox') for (const m of strong) for (const s of m.supporters) {
    if (s === st.player || !greatPowers(st).slice(0, 8).includes(s) || allied(st, s, m.owner)) continue;
    if (getRel(st, s, m.owner) < 0 && rand(st) < 0.5) setEmbargo(st, s, m.owner, true);
  }
  for (const e of [...(st.embargoes ?? [])]) {
    if (e.by === st.player) continue;
    const still = strong.some((m) => m.owner === e.target && m.supporters.includes(e.by));
    if (!still || st.tick - e.since > INDEP.embargoMonths) setEmbargo(st, e.by, e.target, false);
  }
}

/** The trade penalty each country suffers from embargoes (used by economy.openness). */
function applyEmbargoes(st: GameState): void {
  for (const c of Object.values(st.countries)) delete c.embargoed;
  const gps = new Set(greatPowers(st).slice(0, 8));
  for (const e of st.embargoes ?? []) {
    const t = st.countries[e.target]; if (!t?.alive || !st.countries[e.by]?.alive) continue;
    t.embargoed = Math.min(INDEP.embargoMax, (t.embargoed ?? 0) + (gps.has(e.by) ? INDEP.embargoGreat : INDEP.embargoMinor));
  }
  st.embargoes = (st.embargoes ?? []).filter((e) => st.countries[e.by]?.alive && st.countries[e.target]?.alive);
}

/** Journal: the player's choice on a movement's demand. */
export function answerMovement(st: GameState, j: JournalEntry, a: MovementAction): { ok: boolean; reason?: string } {
  const why = movementAction(st, j.event, a);
  return why ? { ok: false, reason: why } : { ok: true };
}
