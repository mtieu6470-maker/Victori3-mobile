// Autonomous World AI — ONE implementation for both modes. Each module scores options with a shared utility
// function built from the country's state and personality; in Historical Mode the historical layer adds a bias
// term (historicalBias) to some utilities. Anti-stagnation safeguards: cooldowns, anti-oscillation of laws,
// war duration caps (military.ts) and minimum activity guarantees.
import { data } from '../data/db';
import { LAW_GROUPS, type LawGroup } from '../data/dbTypes';
import { BUILDINGS, type Building, type Country, type GameState, type Good, type WarGoal } from '../types';
import { clamp, count, getRel, rand, chance, relKey } from '../core';
import { historicalBias } from '../historical';
import { enqueueConstruction, constructionQueueLength, constructionQueueCap, withInvestmentCache, buildingReturn, canBuild, hasTech, marketOf, queuedFactorySupply, privateInvestment, SHIP_COST } from '../systems/economy';
import { reformSupport, startReform, sharesBorder } from '../systems/politics';
import { techCost } from '../systems/technology';
import { allied, allianceAcceptance, declareRivalry, declareWar, formAlliance, greatPowers, guarantee, improveRelations, joinCustomsUnion, powerScore, rivals } from '../systems/diplomacy';
import { armyStrength, atWar, enemiesOf, navalStrength } from '../systems/military';
import { coreNationOf } from '../systems/population';
import { regionsOf, bordersOf } from '../cache';

const LAW_ALTERNATIVES: Record<LawGroup, string[]> = Object.fromEntries(LAW_GROUPS.map((g) => [g, []])) as any;
LAW_ALTERNATIVES.power = ['autocracy', 'oligarchy', 'census_suffrage', 'universal_male_suffrage'];
LAW_ALTERNATIVES.economy = ['traditionalism', 'mercantilism', 'interventionism', 'laissez_faire'];
LAW_ALTERNATIVES.trade = ['isolationism', 'protectionism', 'free_trade'];
LAW_ALTERNATIVES.labor = ['slavery', 'serfdom', 'traditional_tenancy', 'free_labor'];
LAW_ALTERNATIVES.church = ['state_religion', 'freedom_of_conscience', 'secularism'];
LAW_ALTERNATIVES.press = ['censorship', 'limited_press', 'free_press'];
LAW_ALTERNATIVES.education = ['no_schools', 'religious_schools', 'public_schools'];
LAW_ALTERNATIVES.army = ['feudal_levies', 'professional_army', 'mass_conscription'];
LAW_ALTERNATIVES.governance = [];

function stagger(st: GameState, c: Country, period: number) { let h = 0; for (const ch of c.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return (st.tick + h) % period === 0; }

export function aiMonth(st: GameState) {
  withInvestmentCache(st, () => aiMonthInner(st));
}

function aiMonthInner(st: GameState) {
  for (const c of Object.values(st.countries)) {
    if (!c.alive || c.id === st.player) continue;
    budgetAI(st, c);
    privateInvestment(st, c);
    if (!c.decentralized) constructionAI(st, c);
    if (stagger(st, c, 3) && !c.decentralized) diplomacyAI(st, c);
    if (stagger(st, c, 4)) warAI(st, c);
    if (stagger(st, c, 12) && !c.decentralized) reformAI(st, c);
  }
  // the player's private sector still invests on its own
  if (st.player && st.countries[st.player]?.alive) privateInvestment(st, st.countries[st.player]);
}

// ---------------------------------------------------------------- budget
function threatLevel(st: GameState, c: Country): number {
  let t = 0; const mine = armyStrength(st, c) + 1;
  const enemies = enemiesOf(st, c.id);
  for (const oid of bordersOf(st, c.id)) {
    const o = st.countries[oid]; if (!o?.alive || o.decentralized) continue;
    const hostile = rivals(st, c.id, o.id) || getRel(st, c.id, o.id) < -40 || enemies.includes(o.id);
    if (hostile) t += armyStrength(st, o) / mine;
  }
  return clamp(t, 0, 3);
}
/** Fiscal share available for new state construction, bounded to protect essential spending. */
export function constructionBudgetShare(c: Country, war: boolean, industrializationBias: number): number {
  const monthlyIncome = Math.max(1, c.income);
  const operatingMargin = clamp((c.income - c.expense) / monthlyIncome, -1, 1);
  const debtBurden = clamp(c.debt / (monthlyIncome * 24), 0, 1);
  const faminePressure = clamp(c.famine, 0, 1);
  return clamp(
    0.16 + operatingMargin * 0.06 - debtBurden * 0.07
      - faminePressure * 0.06 - (war ? 0.04 : 0)
      + industrializationBias * 0.08,
    0.02,
    0.32,
  );
}

function budgetAI(st: GameState, c: Country) {
  const war = atWar(st, c.id);
  const threat = c.decentralized ? 0 : threatLevel(st, c);
  const milShare = clamp(0.18 + c.personality.aggression * 0.2 + threat * 0.12 + (war ? 0.2 : 0), 0.1, 0.75);
  const gdpPc = c.gdp / Math.max(1, c.stats.pop);
  c.army.target = (c.income * 12 * milShare) / (0.35 * gdpPc + 20);
  if (c.decentralized) c.army.target = c.stats.pop * 0.015;
  const navalBias = c.personality.naval + historicalBias(st, c, 'naval') * 0.3;
  c.navy.target = c.decentralized ? 0 : (c.income * 12 * clamp(navalBias * 0.3, 0, 0.4)) / SHIP_COST;
  c.budget.education = clamp(0.02 + c.personality.reformism * 0.08 + (c.laws.education === 'public_schools' ? 0.04 : 0), 0, 0.15);
  c.budget.health = clamp(0.02 + (c.famine > 0.05 ? 0.08 : 0), 0, 0.12);
  c.budget.admin = 0.15;
  const balance = c.income - c.expense;
  c.budget.construction = constructionBudgetShare(c, war, historicalBias(st, c, 'industrialize'));
  if (balance < -0.05 * c.income) c.taxRate = clamp(c.taxRate + 0.002, 0.02, 0.25);
  else if (balance > 0.15 * c.income && c.radicalism > 0.15) c.taxRate = clamp(c.taxRate - 0.002, 0.02, 0.25);
  count(st, 'budget', c.id);
}

// ---------------------------------------------------------------- research choice (also used for the player's auto-research)
export function chooseResearch(st: GameState, c: Country, options: string[]): string | null {
  const d = data(); let best: string | null = null; let bv = -Infinity;
  for (const id of options) {
    const t = d.tech.get(id)!; const cost = techCost(st, c, id);
    let w = t.tree === 'military' ? 0.6 + c.personality.aggression : t.tree === 'production' ? 0.8 + c.personality.commerce * 0.6 : 0.6 + c.personality.reformism;
    w += historicalBias(st, c, 'industrialize') * (t.tree === 'production' ? 0.5 : 0);
    if (atWar(st, c.id) && t.tree === 'military') w += 0.5;
    const v = w / Math.sqrt(cost) + rand(st) * 0.0005;
    if (v > bv) { bv = v; best = id; }
  }
  if (best) count(st, 'research', c.id);
  return best;
}

/** How strongly the current market needs the output of a candidate building (0..1). */
export function investmentDemandPriority(st: GameState, c: Country, r: GameState['regions'][number], b: Building): number {
  let goods: Good[] = [];
  if (b === 'textile_mill') goods = ['textiles'];
  else if (b === 'ironworks') goods = ['steel'];
  else if (b === 'tool_works') goods = ['tools'];
  else if (b === 'arms_works') goods = ['arms'];
  else if (b === 'luxury_workshop') goods = ['luxury'];
  else if (b === 'logging') goods = ['timber'];
  else if (b === 'mine') {
    if (r.res.includes('coal')) goods.push('coal');
    if (r.res.includes('iron')) goods.push('iron');
    if (r.res.includes('gold') || r.res.includes('silv')) goods.push('luxury');
    if (!goods.length) goods = ['iron'];
  } else if (b === 'plantation') {
    if (r.res.includes('cott')) goods.push('cotton');
    if (r.res.includes('opium')) goods.push('opium');
    if (r.res.includes('cash')) goods.push('cash_crops');
    if (!goods.length) goods = ['cash_crops'];
  }
  if (!goods.length) return 0;
  const stats = st.marketStats?.[marketOf(st, c)];
  const queuedSupply = queuedFactorySupply(st, c, goods);
  const shortages = goods.map((good) => {
    const entry = stats?.[good];
    if (!entry || !Number.isFinite(entry.short) || !Number.isFinite(entry.demand)) return 0;
    const demand = Math.max(0, entry.demand);
    if (demand <= 0) return 0;
    const unmetDemand = demand * clamp(entry.short, 0, 1);
    const remainingNeed = Math.max(0, unmetDemand - (queuedSupply[good] ?? 0));
    return clamp(remainingNeed / demand, 0, 1);
  });
  return shortages.reduce((sum, value) => sum + value, 0) / shortages.length;
}

// ---------------------------------------------------------------- construction (state investment)
function constructionAI(st: GameState, c: Country) {
  if (constructionQueueLength(st, c.id, 'state') >= constructionQueueCap(st, c, 'state') || c.statePool <= 0) return;
  const threat = threatLevel(st, c);
  let best: { r: number; b: Building; v: number } | null = null;
  for (const r of regionsOf(st, c.id)) {
    const i = data().regionIndex.get(r.id)!;
    for (const b of BUILDINGS) {
      if (b === 'university' && r.id !== c.capital) continue;
      if (!canBuild(st, c, r, b)) continue;
      let v = buildingReturn(st, c, r, b);
      // State investment may accept a modestly lower direct return when the market is short
      // of the candidate output; this helps resolve bottlenecks without rewarding surplus goods.
      v += investmentDemandPriority(st, c, r, b) * 0.06;
      if (b === 'arms_works') v += threat * 0.05;
      if (b === 'railway') v += 0.03 + historicalBias(st, c, 'industrialize') * 0.05;
      if (b === 'university') v = 0.02 + c.personality.reformism * 0.05 - r.buildings.university * 0.03;
      if (!best || v > best.v) best = { r: i, b, v };
    }
  }
  if (best && best.v > 0.025 && enqueueConstruction(st, c, st.regions[best.r], best.b, 'state')) count(st, 'construction', c.id);
}

// ---------------------------------------------------------------- reforms (with anti-oscillation)
/**
 * HIST-JAP-01: in Historical Mode, a law group that a still-pending historical decision window of this
 * country governs (an option sets that law or changes regime laws) is reserved for that window until
 * the window closes or fires. Otherwise ordinary AI reform pre-empted documented turning points (e.g.
 * Tokugawa Japan voluntarily ending seclusion in 1841, so the 1854 opening and the Meiji Restoration
 * could never happen). Sandbox Mode is unaffected.
 */
export function lawReservedByHistory(st: GameState, c: Country, group: LawGroup): boolean {
  if (st.mode !== 'historical') return false;
  const now = `${st.date.y}-${String(st.date.m).padStart(2, '0')}-01`;
  for (const w of data().db.decision_windows) {
    if (w.entity !== c.id || st.firedEvents.includes(w.id) || now > w.window[1]) continue;
    for (const o of w.options) for (const raw of o.effects) {
      const e = raw as { type?: string; entity?: string; group?: string; laws?: Record<string, string> };
      if (e.entity !== c.id) continue;
      if ((e.type === 'set_law' && e.group === group) || (e.type === 'regime_change' && e.laws && group in e.laws)) return true;
    }
  }
  return false;
}

/**
 * Explicit modernisation rank of each law value (CATCHUP-01 review round 2: no array-order inference).
 * Used only for the personality-driven reformism preference: a change to a higher rank is "progressive".
 * Groups without a clear modernisation direction (trade, economy, army) are ranked by the period's
 * liberal-reform agenda, documented here so the meaning is reviewable rather than implied by order.
 */
export const LAW_MODERNISATION_RANK: Record<LawGroup, Record<string, number>> = {
  power: { autocracy: 0, oligarchy: 1, census_suffrage: 2, universal_male_suffrage: 3 },
  economy: { traditionalism: 0, mercantilism: 1, interventionism: 2, laissez_faire: 3 },
  trade: { isolationism: 0, protectionism: 1, free_trade: 2 },
  labor: { slavery: 0, serfdom: 1, traditional_tenancy: 2, free_labor: 3 },
  church: { state_religion: 0, freedom_of_conscience: 1, secularism: 2 },
  press: { censorship: 0, limited_press: 1, free_press: 2 },
  education: { no_schools: 0, religious_schools: 1, public_schools: 2 },
  army: { feudal_levies: 0, professional_army: 1, mass_conscription: 2 },
  governance: {},
} as Record<LawGroup, Record<string, number>>;

export function isProgressiveStep(group: LawGroup, from: string, to: string): boolean {
  const rank = LAW_MODERNISATION_RANK[group] ?? {};
  return (rank[to] ?? 0) > (rank[from] ?? 0);
}

/** CATCHUP-01: maximum utility a reform gains from international emulation (design parameter). */
export const LAW_EMULATION = 0.3;

/**
 * Explicit modernisation transitions eligible for emulation (CG review: no array-order inference).
 * Only single steps listed here count; other changes (army, church, trade, economy) get no emulation.
 */
export const EMULATION_STEPS: Partial<Record<LawGroup, Record<string, string>>> = {
  education: { no_schools: 'religious_schools', religious_schools: 'public_schools' },
  labor: { slavery: 'traditional_tenancy', serfdom: 'traditional_tenancy', traditional_tenancy: 'free_labor' },
  press: { censorship: 'limited_press', limited_press: 'free_press' },
  power: { autocracy: 'oligarchy', oligarchy: 'census_suffrage', census_suffrage: 'universal_male_suffrage' },
};

/** Emulation pull for `group: current → v`: world adoption beyond 30% × the country's trade exposure. */
export function lawEmulation(st: GameState, c: Country, group: LawGroup, v: string): number {
  if (EMULATION_STEPS[group]?.[c.laws[group]] !== v) return 0;
  const exposure = Math.min(1, ({ isolationism: 0.03, protectionism: 0.3, free_trade: 0.7 } as Record<string, number>)[c.laws.trade] ?? 0.3) / 0.7;
  return LAW_EMULATION * Math.max(0, lawShare(st, group, v) - 0.3) / 0.7 * Math.min(1, exposure);
}

let lawShareCache: { st: GameState; tick: number; map: Map<string, number> } | null = null;
/** Share of sovereign, centralised living states that hold `group = value` (cached per month). */
export function lawShare(st: GameState, group: LawGroup, value: string): number {
  if (!lawShareCache || lawShareCache.st !== st || lawShareCache.tick !== st.tick) {
    const states = Object.values(st.countries).filter((x) => x.alive && !x.decentralized && !x.overlord);
    const map = new Map<string, number>();
    for (const x of states) for (const [g2, v2] of Object.entries(x.laws)) map.set(`${g2}:${v2}`, (map.get(`${g2}:${v2}`) ?? 0) + 1);
    for (const [k, n] of map) map.set(k, n / Math.max(1, states.length));
    lawShareCache = { st, tick: st.tick, map };
  }
  return lawShareCache.map.get(`${group}:${value}`) ?? 0;
}

/**
 * Utility of reforming `group` to `v` for the AI (both modes). Exported for tests: domestic support
 * (interest-group approval weighted by clout) dominates; international emulation is a bounded pull.
 */
export function reformUtility(st: GameState, c: Country, g: LawGroup, v: string): number {
  const sup = reformSupport(c, g, v);
  const progressive = isProgressiveStep(g, c.laws[g], v);
  // status-quo inertia; direction set by the country's reformism (both modes)
  let u = sup * 2 + (progressive ? (c.personality.reformism - 0.45) : (0.25 - c.personality.reformism)) * 0.8 - 0.75;
  if (c.radicalism > 0.2 && ['power', 'press', 'labor'].includes(g)) u += 0.3;
  u += historicalBias(st, c, 'law_to', `${g}:${v}`);
  u -= historicalBias(st, c, 'law_keep', `${g}:${c.laws[g]}`);
  if (g === 'trade' && v === 'free_trade' && c.personality.commerce > 0.7) u += 0.2;
  if (g === 'trade' && c.laws.trade === 'isolationism' && c.foreignPressure > 0.8) u += 0.4;
  // CATCHUP-01 emulation (revised): a small, conditional foreign influence on an explicit
  // modernisation step; it never replaces domestic support (sup above) and grows with exposure.
  u += lawEmulation(st, c, g, v);
  return u;
}

function reformAI(st: GameState, c: Country) {
  if (c.reform) return;
  let best: { g: LawGroup; v: string; u: number } | null = null;
  for (const g of LAW_GROUPS) {
    if ((c.ai.cooldowns[`reform:${g}`] ?? 0) > st.tick) continue;
    if (lawReservedByHistory(st, c, g)) continue;
    for (const v of LAW_ALTERNATIVES[g]) {
      if (v === c.laws[g]) continue;
      // anti-oscillation: never return to a value abandoned in the last 15 years
      if (c.ai.lawHistory.some((h) => h.group === g && st.tick - h.tick < 180)) continue;
      if (g === 'labor' && v === 'slavery') continue;
      if (g === 'labor' && v === 'serfdom' && c.laws.labor !== 'serfdom') continue;
      const u = reformUtility(st, c, g, v);
      if (!best || u > best.u) best = { g, v, u };
    }
  }
  if (best && best.u > 0.15 && chance(st, 0.5) && startReform(st, c, best.g, best.v)) count(st, 'reform', c.id);
}

// ---------------------------------------------------------------- diplomacy
function diplomacyAI(st: GameState, c: Country) {
  const gps = greatPowers(st);
  const isGP = gps.includes(c.id);
  // rivalries: great powers pick the closest competing great power if they have none
  if (isGP && !st.rivalries.some((k) => k.split('|').includes(c.id))) {
    let best: string | null = null; let bv = -1;
    for (const o of gps) if (o !== c.id && !allied(st, c.id, o)) { const v = (sharesBorder(st, c.id, o) ? 1 : 0.4) * (1 - Math.abs(powerScore(st, c) - powerScore(st, st.countries[o])) / Math.max(1, powerScore(st, c))) - getRel(st, c.id, o) / 100 + historicalBias(st, c, 'contain', o); if (v > bv) { bv = v; best = o; } }
    if (best && bv > 0.3) { declareRivalry(st, c.id, best); count(st, 'rivalry', c.id); }
  }
  // alliances: seek partners sharing a rival or threatened by the same neighbour
  if (st.treaties.filter((t) => t.type === 'alliance' && t.members.includes(c.id)).length < 3) {
    let best: string | null = null; let bv = 0;
    const pool = new Set<string>([...bordersOf(st, c.id), ...gps]);
    for (const k of Object.keys(st.relations)) if (st.relations[k] > 30 && k.includes(c.id)) for (const x of k.split('|')) pool.add(x);
    for (const oid of pool) {
      const o = st.countries[oid];
      if (!o?.alive || o.id === c.id || o.decentralized || allied(st, c.id, o.id) || o.overlord) continue;
      if ((c.ai.cooldowns[`ally:${o.id}`] ?? 0) > st.tick) continue;
      const v = allianceAcceptance(st, c.id, o.id) + historicalBias(st, c, 'ally', o.id) * 3;
      if (v > bv) { bv = v; best = o.id; }
    }
    if (best) {
      const theirs = allianceAcceptance(st, best, c.id) + (st.countries[best].id !== st.player ? historicalBias(st, st.countries[best], 'ally', c.id) * 3 : -99);
      if (theirs > 0 && formAlliance(st, c.id, best)) count(st, 'alliance', c.id);
      else c.ai.cooldowns[`ally:${best}`] = st.tick + 36;
    }
  }
  // guarantees: protect small neighbours of a rival, or as a historical 'support' priority
  if (isGP && chance(st, 0.1)) for (const o of Object.values(st.countries)) {
    if (!o.alive || o.decentralized || o.overlord || powerScore(st, o) > powerScore(st, c) * 0.3) continue;
    const support = historicalBias(st, c, 'support', o.id);
    if (support > 0.3 || (getRel(st, c.id, o.id) > 40 && st.rivalries.some((k) => k.split('|').includes(c.id) && sharesBorder(st, k.replace(c.id, '').replace('|', ''), o.id)))) { guarantee(st, c.id, o.id); count(st, 'guarantee', c.id); break; }
  }
  // customs union accession (shared utility; historical windows add more in Historical Mode)
  for (const t of st.treaties) if (t.type === 'customs_union' && !c.customsUnion && t.leader && t.leader !== c.id && st.countries[t.leader]?.alive) {
    const leader = st.countries[t.leader];
    const sameNation = coreNationOf(st, c) === coreNationOf(st, leader);
    const u = (sameNation ? 0.4 : -0.5) + getRel(st, c.id, leader.id) / 100 + (sharesBorder(st, c.id, leader.id) ? 0.3 : 0) - (c.personality.isolationism * 0.5) + historicalBias(st, c, 'customs_union') * 0.2;
    if (u > 0.6 && chance(st, 0.05)) { joinCustomsUnion(st, c, t.id); count(st, 'customs_union', c.id); }
  }
  // improve relations with the most useful partner
  let target: string | null = null; let tv = -Infinity;
  for (const oid of bordersOf(st, c.id)) { const o = st.countries[oid]; if (!o?.alive || o.decentralized) continue; const v = -Math.abs(getRel(st, c.id, o.id) - 30) + historicalBias(st, c, 'ally', o.id) * 50; if (v > tv) { tv = v; target = o.id; } }
  if (target) { improveRelations(st, c.id, target); count(st, 'improve_relations', c.id); }
}

// ---------------------------------------------------------------- war (targets, expected value, restraint)
function neighboursOf(st: GameState, c: Country): Set<string> {
  const d = data(); const out = new Set<string>(bordersOf(st, c.id));
  if (navalStrength(c) > 5) for (const r of regionsOf(st, c.id)) { const i = d.regionIndex.get(r.id)!; for (const s of d.seaNeighbors[i]) if (s.km < 600) { const o = st.regions[d.regionIndex.get(s.r)!].owner; if (o !== c.id) out.add(o); } }
  return out;
}

/** Spread of the seeded misjudgement added to each war option's utility in Sandbox Mode (design parameter). */
export const SANDBOX_WAR_JUDGEMENT_NOISE = 0.5;

function warAI(st: GameState, c: Country) {
  if (atWar(st, c.id) || c.warExhaustion > 20 || (c.ai.cooldowns.war ?? 0) > st.tick) return;
  if (c.overlord && c.subjectType !== 'tributary' && c.subjectType !== 'autonomous_vassal') return;
  const d = data();
  const mine = armyStrength(st, c);
  let best: { target: string; goals: WarGoal[]; u: number; kind: 'conquest' | 'colonial' } | null = null;
  const cands = neighboursOf(st, c);
  // expeditions: great powers with strong navies may target distant coasts named in claims or priorities
  for (const r of c.claims) { const o = st.regions[d.regionIndex.get(r)!].owner; if (o !== c.id) cands.add(o); }
  for (const tid of cands) {
    const t = st.countries[tid]; if (!t?.alive || tid === c.overlord || t.overlord === c.id || allied(st, c.id, tid)) continue;
    if (c.decentralized && t.decentralized) continue; // placeholder polities do not conquer each other
    if (st.player === tid && st.tick < 24) continue; // grace period for the player
    const tRegions = regionsOf(st, tid);
    const reachable = tRegions.filter((r) => { const i = d.regionIndex.get(r.id)!; return d.landNeighbors[i].some((n) => st.regions[d.regionIndex.get(n)!].owner === c.id) || (navalStrength(c) > 5 && d.seaNeighbors[i].some((s) => st.regions[d.regionIndex.get(s.r)!].owner === c.id)) || c.claims.includes(r.id); });
    if (!reachable.length) continue;
    // goal regions: claimed, same nation, historically prioritised, or (vs decentralized) adjacent land
    const myNation = coreNationOf(st, c);
    const goalRegs = reachable.filter((r) => c.claims.includes(r.id) || d.cultureNation.get(r.culture) === myNation || historicalBias(st, c, 'war_region', r.id) > 0 || t.decentralized).slice(0, 3);
    let goals: WarGoal[] = goalRegs.length ? [{ by: c.id, type: t.decentralized ? 'colonize' : 'conquer', target: tid, regions: goalRegs.map((r) => r.id) }] : [];
    let value = goalRegs.reduce((s, r) => s + Math.sqrt(r.pop / 1e5) * 0.3 + (c.claims.includes(r.id) ? 0.6 : 0) + (d.cultureNation.get(r.culture) === myNation ? 0.8 : 0) + historicalBias(st, c, 'war_region', r.id) * 1.5 + (r.res.length * 0.05), 0);
    const om = historicalBias(st, c, 'war_open_market', tid);
    if (om > 0 && t.laws.trade === 'isolationism') { goals.push({ by: c.id, type: 'force_open_market', target: tid }); value += om * 2.2; }
    const sj = historicalBias(st, c, 'war_subjugate', tid);
    if (sj > 0) { goals.push({ by: c.id, type: 'subjugate', target: tid }); value += sj * 1.6; }
    if (!goals.length) continue;
    // expected strength including likely defenders
    let enemy = armyStrength(st, t) + (t.overlord ? armyStrength(st, st.countries[t.overlord]) * 0.7 : 0);
    for (const tr of st.treaties) if (tr.type === 'alliance' && tr.members.includes(tid)) for (const m of tr.members) if (m !== tid && m !== c.id) enemy += armyStrength(st, st.countries[m]) * 0.5;
    for (const gp of greatPowers(st)) if (gp !== c.id && rivals(st, gp, c.id) && getRel(st, gp, tid) > 10) enemy += armyStrength(st, st.countries[gp]) * 0.35;
    const ratio = mine / Math.max(1, enemy);
    const pWin = clamp((ratio - 0.6) / 1.4, 0, 0.95);
    const cost = 0.55 + c.warExhaustion / 50 + (t.decentralized ? 0.2 + (['ju', 'sa'].includes(goalRegs[0]?.terrain ?? '') && !c.techs.includes('quinine_prophylaxis') ? 0.6 : 0) : 0.5) + c.infamy / 25 + historicalBias(st, c, 'avoid_war', tid) * 3 - historicalBias(st, c, 'contain', tid) * 0.6;
    let u = pWin * value - (1 - pWin) * 0.8 - cost + (c.personality.aggression - 0.4) * 0.8 + (c.personality.expansionism - 0.4) * 0.6;
    // Sandbox: leaders misjudge odds and opportunities. Seeded noise makes different seeds diverge;
    // without it every sandbox seed fought the same wars (only battle rolls were random).
    if (st.mode === 'sandbox') u += (rand(st) - 0.5) * SANDBOX_WAR_JUDGEMENT_NOISE;
    if (!best || u > best.u) best = { target: tid, goals, u, kind: t.decentralized ? 'colonial' : 'conquest' };
  }
  const threshold = 0.2 + (1 - c.personality.risk) * 0.35;
  if (best && best.u > threshold) {
    if (declareWar(st, c.id, best.target, best.goals, undefined, best.kind)) { count(st, 'declare_war', c.id); c.ai.cooldowns.war = st.tick + 24; }
  } else c.ai.cooldowns.war = st.tick + 6;
  // foreign naval pressure on secluded states (used by opening conditions in both modes)
  if (c.navy.strength * c.navy.quality > 15) for (const tid of cands) { const t = st.countries[tid]; if (t?.laws.trade === 'isolationism') t.foreignPressure = Math.min(2, t.foreignPressure + (c.navy.strength * c.navy.quality) / 200); }
  void hasTech; void relKey;
}

/** Decision-window choice for AI countries: utility of each option plus the historical weight on the historical option. */
export function decideWindow(st: GameState, c: Country, _id: string, options: { id: string; historical: boolean }[], historicalWeight: number): string | null {
  if (c.id === st.player) {
    if (!st.pendingPlayerDecisions.some((p) => p.windowId === _id)) st.pendingPlayerDecisions.push({ id: `pd_${st.tick}_${_id}`, windowId: _id, options });
    return null;
  }
  const scores = options.map((o) => ({ o, s: rand(st) + (o.historical ? historicalWeight : 0) }));
  scores.sort((a, b) => b.s - a.s);
  count(st, 'decision_window', c.id);
  return scores[0].o.id;
}
