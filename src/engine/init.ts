// Builds the starting GameState (1836-01-01) from the Historical Database. Identical for both modes,
// except for the stored mode flag: Sandbox starts from the same historical world.
import { data } from './data/db';
import type { EntityRecord } from './data/dbTypes';
import { GOODS, IGS, STRATA, S, type Country, type GameMode, type GameState, type Region, type Good, type Building, BUILDINGS } from './types';
import { seedRng, relKey, clamp, dateToTick, dateStr } from './core';
import { computeEconomy } from './systems/economy';
import { updatePolitics } from './systems/politics';
import { sampleYear } from './metrics';
import { emptyInventoryLedger } from './systems/inventory';

export interface NewGameOptions { mode: GameMode; seed: number; player: string | null }

export const BASE_PRICES: Record<Good, number> = { grain: 1, cash_crops: 1, cotton: 1, timber: 1, coal: 1, iron: 1, steel: 1, textiles: 1, tools: 1, arms: 1, luxury: 1, opium: 1 };

const TAX_BY_ECONOMY: Record<string, number> = { traditionalism: 0.06, mercantilism: 0.08, interventionism: 0.09, laissez_faire: 0.07 };

function strataFor(stage: string, decentral: boolean): number[] {
  const s = new Array(STRATA.length).fill(0);
  const set = (o: Partial<Record<(typeof STRATA)[number], number>>) => { for (const [k, v] of Object.entries(o)) s[S[k as keyof typeof S]] = v!; };
  if (decentral) set({ peasants: 0.9, laborers: 0.03, artisans: 0.04, clergy: 0.01, aristocrats: 0.02 });
  else if (stage === 'industrial') set({ peasants: 0.26, laborers: 0.15, artisans: 0.13, workers: 0.2, middle: 0.18, clergy: 0.01, aristocrats: 0.015, capitalists: 0.025 });
  else if (stage === 'early_industrial') set({ peasants: 0.62, laborers: 0.09, artisans: 0.1, workers: 0.05, middle: 0.1, clergy: 0.012, aristocrats: 0.012, capitalists: 0.008 });
  else set({ peasants: 0.8, laborers: 0.05, artisans: 0.08, workers: 0.0, middle: 0.04, clergy: 0.012, aristocrats: 0.013, capitalists: 0.005 });
  return s;
}

function stageOf(e: EntityRecord): string {
  if (e.industrialization) return e.industrialization;
  if (e.tech_level === 'frontier') return 'industrial';
  if (e.tech_level === 'advanced') return 'early_industrial';
  return 'pre_industrial';
}

function initialLiteracy(e: EntityRecord): number {
  if (e.literacy) return e.literacy.value;
  const ed = e.laws?.value.education;
  return ed === 'public_schools' ? 0.4 : ed === 'religious_schools' ? 0.15 : 0.03; // fallback: flagged as missing in the coverage report
}

export function createGame(opts: NewGameOptions): GameState {
  const d = data();
  const db = d.db;
  const st: GameState = {
    version: 1, seed: opts.seed, rng: seedRng(opts.seed), mode: opts.mode, player: opts.player,
    date: { y: 1836, m: 1 }, tick: 0, countries: {}, regions: [], wars: [], treaties: [], relations: {}, rivalries: [],
    worldPrices: { ...BASE_PRICES }, marketPrices: {}, marketStats: {}, inventoryLedger: emptyInventoryLedger(), log: [], territoryLog: [], history: {},
    divergence: { milestones: {}, entries: [], similarity: [] },
    counters: { systemRuns: {}, aiActions: {}, aiActionsByCountry: {}, decisionWindowsFired: 0, historicalBiasApplied: 0 },
    firedEvents: [], pendingPlayerDecisions: [], nextId: 0,
  };

  // ---- regions
  const owners = new Set<string>();
  for (const r of db.regions) {
    const topo = d.map.regions[d.regionIndex.get(r.id)!];
    const owner = db.entities.find((e) => e.id === r.owner)!;
    const stage = stageOf(owner);
    const strata = strataFor(stage, owner.kind === 'decentralized');
    // slavery: enslaved share approximated from the African-diaspora culture share where slavery is legal
    const slaveLegal = owner.laws?.value.labor === 'slavery';
    const diaspora = (c: string | null) => !!c && (c.startsWith('afro_') || c === 'afro_caribbean');
    let slaveShare = 0;
    if (slaveLegal) { if (diaspora(r.culture)) slaveShare = (1 - r.c2) * 0.85; else if (diaspora(r.culture2)) slaveShare = r.c2 * 0.85; }
    if (slaveShare > 0) { strata[S.slaves] = slaveShare; strata[S.peasants] = Math.max(0.05, strata[S.peasants] - slaveShare); }
    const sum = strata.reduce((a, b) => a + b, 0); for (let i = 0; i < strata.length; i++) strata[i] /= sum;
    const buildings = Object.fromEntries(BUILDINGS.map((b) => [b, 0])) as Record<Building, number>;
    const ownerLit = initialLiteracy(owner);
    const region: Region = {
      id: r.id, owner: r.owner, controller: r.controller ?? r.owner, pop: r.pop, strata,
      culture: r.culture, culture2: r.culture2, c2: r.c2, religion: r.religion,
      literacy: ownerLit, sol: 0.5, unrest: 0, radical: 0.03, nationalism: 0.05,
      buildings, res: [...r.res], terrain: r.terrain, coastal: topo.coastal, area: topo.area_km2,
      devastation: 0, blight: null, epidemic: null, output: 0,
    };
    // initial industry: workers employed in mills; mines/plantations where resources exist
    const workers = r.pop * strata[S.workers] * 0.45;
    if (workers > 0) {
      const lv = workers / 2000;
      if (r.res.includes('coal') || r.res.includes('iron')) { buildings.ironworks = Math.round(lv * 0.35); buildings.textile_mill = Math.round(lv * 0.45); buildings.tool_works = Math.round(lv * 0.15); buildings.arms_works = Math.round(lv * 0.05); }
      else { buildings.textile_mill = Math.round(lv * 0.7); buildings.tool_works = Math.round(lv * 0.2); buildings.luxury_workshop = Math.round(lv * 0.1); }
    }
    const lab = r.pop * (strata[S.laborers] + strata[S.slaves]) * 0.45;
    const extractive = r.res.filter((x) => ['coal', 'iron', 'gold', 'silv'].includes(x)).length;
    const plant = r.res.filter((x) => ['cash', 'cott', 'opium'].includes(x)).length;
    if (extractive) buildings.mine = Math.round((lab * 0.35) / 2000);
    if (plant) buildings.plantation = Math.round((lab * (slaveShare > 0 ? 0.9 : 0.4)) / 2000);
    if (r.res.includes('timb')) buildings.logging = Math.round((lab * 0.15) / 2000);
    if (stage === 'industrial' && (r.res.includes('coal') || topo.coastal)) buildings.railway = 1;
    if (r.id === 'BEL_BRU' || r.id === 'GBR_LAN' || r.id === 'GBR_LON') buildings.railway = Math.max(buildings.railway, 1);
    region.hiddenGold = db.exogenous.some((x) => x.type === 'resource_discovery' && x.regions.includes(r.id));
    if (region.hiddenGold) region.res = region.res.filter((x) => x !== 'gold');
    st.regions.push(region);
    owners.add(r.owner); if (r.controller) owners.add(r.controller);
  }

  // ---- countries
  for (const e of db.entities) {
    if (!owners.has(e.id)) continue;
    st.countries[e.id] = makeCountry(st, e);
  }
  // nationalism: regions whose culture's nation differs from the owner's core nation
  for (const reg of st.regions) {
    const c = st.countries[reg.owner];
    const core = coreNation(st, c.id);
    if (d.cultureNation.get(reg.culture) !== core) reg.nationalism = 0.15;
  }

  // ---- relations
  const ids = Object.keys(st.countries);
  for (const e of db.entities) for (const r of e.relations) if (st.countries[e.id] && st.countries[r.with]) {
    const k = relKey(e.id, r.with); st.relations[k] = st.relations[k] === undefined ? r.value : Math.round((st.relations[k] + r.value) / 2);
  }
  for (const id of ids) {
    const c = st.countries[id];
    if (c.overlord && st.countries[c.overlord]) { const k = relKey(id, c.overlord); if (st.relations[k] === undefined) st.relations[k] = 40; }
  }
  // rivalries from detailed profiles
  for (const e of db.entities) {
    const rivals = ((e.profile as any)?.diplomacy?.rivals ?? []) as { entity: string }[];
    for (const r of rivals) if (st.countries[e.id] && st.countries[r.entity]) { const k = relKey(e.id, r.entity); if (!st.rivalries.includes(k)) st.rivalries.push(k); }
  }

  // ---- treaties: CoW alliances active on the start date; Zollverein
  for (const a of db.alliances) {
    const members = a.members.filter((m) => st.countries[m]);
    if (members.length >= 2) st.treaties.push({ id: a.id, type: 'alliance', members, start: 0, source: a.id });
    for (let i = 0; i < members.length; i++) for (let j = i + 1; j < members.length; j++) {
      const k = relKey(members[i], members[j]); st.relations[k] = Math.max(st.relations[k] ?? 0, 30);
    }
  }
  const zv = db.zollverein.members_at_start.filter((m) => st.countries[m]);
  st.treaties.push({ id: 'zollverein', type: 'customs_union', members: zv, leader: db.zollverein.union_leader, start: 0, source: 'zollverein_accessions' });
  for (const m of zv) st.countries[m].customsUnion = 'zollverein';

  // ---- initial wars (both modes)
  for (const w of db.wars) {
    const att = w.attackers.filter((x) => st.countries[x]); const def = w.defenders.filter((x) => st.countries[x]);
    if (!att.length || !def.length) continue;
    const supporters = Object.values(w.supporters ?? {}).flat().filter((x) => st.countries[x]);
    st.wars.push({
      id: w.id, name: w.name, kind: (w.kind as any) === 'civil' ? 'civil' : (w.kind as any) === 'colonial' ? 'colonial' : 'conquest',
      attackers: { leader: att[0], members: att }, defenders: { leader: def[0], members: [...def, ...supporters.filter((s) => !def.includes(s))] },
      goals: w.war_goals, start: dateToTick(w.start) < 0 ? -1 : 0, score: 0, occupied: [], battles: 0, exhaustion: { a: 10, d: 10 }, historicalSeed: true,
    });
    for (const a of att) for (const dd of def) st.relations[relKey(a, dd)] = -80;
  }

  computeEconomy(st, true);
  calibrateDemography(st);
  for (const id of Object.keys(st.countries)) updatePolitics(st, st.countries[id], true);
  sampleYear(st);
  return st;
}

export function coreNation(st: GameState, countryId: string): string | undefined {
  const c = st.countries[countryId];
  const cap = st.regions[data().regionIndex.get(c.capital) ?? -1];
  return cap ? data().cultureNation.get(cap.culture) : undefined;
}

function femaleName(n: string) { return /\b(Princess|Queen|Maria|Isabella|Victoria|Ranavalona|Pōmare)\b/.test(n); }

function makeCountry(st: GameState, e: EntityRecord, capitalFallback?: string): Country {
  const d = data();
  const laws = { ...(e.laws?.value ?? d.db.entities.find((x) => x.kind === 'decentralized')!.laws!.value) };
  const hos = e.head_of_state?.value;
  const bornY = hos?.born ? Number(hos.born.slice(0, 4)) : null;
  const decentral = e.kind === 'decentralized';
  const pop = st.regions.filter((r) => r.owner === e.id).reduce((s, r) => s + r.pop, 0);
  const armyFact = e.army?.value;
  const manpower = armyFact ?? Math.round(pop * (decentral ? 0.015 : 0.007));
  const stage = stageOf(e);
  const navalP = e.personality.naval;
  const gdpPc = d.db.gdp_pc_1836[e.id]?.value ?? 450;
  const navyShips = decentral ? 0 : Math.round(Math.pow(navalP, 1.2) * ((pop * gdpPc) / 1e9) * 2 * 10) / 10;
  const crisis = st.regions.some((r) => r.owner === e.id && r.controller !== e.id) || ['MEX', 'PEU', 'SPA', 'BRA'].includes(e.id);
  const heir = e.heir ? { name: e.heir.name, born: e.heir.born ? Number(e.heir.born.slice(0, 4)) : null, female: femaleName(e.heir.name) } : null;
  return {
    id: e.id, name: e.en, nameVi: e.vi, color: e.color, kind: e.kind, tier: e.tier, alive: true, group: e.group, decentralized: decentral,
    overlord: e.overlord ?? null, subjectType: e.subject_type ?? null, capital: e.capital && st.regions.some((r) => r.id === e.capital) ? e.capital : capitalFallback ?? st.regions.find((r) => r.owner === e.id || r.controller === e.id)?.id ?? '',
    laws, reform: null, regimeChangedAt: null, govLabel: e.government ?? laws.governance,
    leader: { name: hos?.name ?? (decentral ? 'Council of chiefs' : 'Unknown (missing data)'), born: bornY, since: hos?.since ? Number(hos.since.slice(0, 4)) : 1836, historical: !!hos, female: hos ? femaleName(hos.name) : false, termEnds: termEndFor(e.id, hos?.name) },
    heir,
    legitimacy: crisis ? 45 : 60, radicalism: 0.03,
    igs: Object.fromEntries(IGS.map((g) => [g, { clout: 0, approval: 0 }])) as Country['igs'],
    treasury: 0, debt: 0, taxRate: decentral ? 0.03 : TAX_BY_ECONOMY[laws.economy] ?? 0.07,
    constructionQueue: [],
    budget: { military: 0.4, navy: navalP * 0.25, admin: 0.2, education: laws.education === 'public_schools' ? 0.08 : 0.03, health: 0.03, construction: 0.1 },
    gdp: 0, income: 0, expense: 0, tariffIncome: 0, productivity: 1,
    techs: [...(d.db.start_techs[e.id] ?? [])], research: { current: null, progress: 0 },
    army: { manpower, target: manpower, quality: 1, morale: 0.8, supply: 1 },
    navy: { strength: navyShips, target: navyShips, quality: stage === 'industrial' ? 1 : stage === 'early_industrial' ? 0.8 : 0.4 },
    prestige: e.tier === 'A' ? 50 : e.tier === 'B' ? 20 : 5, infamy: 0, warExhaustion: 0, lastWarLost: null,
    personality: { ...e.personality },
    ai: { cooldowns: {}, lawHistory: [], recent: [], planTarget: null },
    claims: [...e.claims], customsUnion: null,
    priorities: e.priorities.map((p) => p.id), foreignPressure: 0, famine: 0,
    stats: { pop, literacy: 0, sol: 0.5, industry: 0 },
  };
}

/** Create a researched country that first appears after the 1836 start date. */
export function makeHistoricalCountry(st: GameState, id: string, capitalRegion: string): Country | null {
  const d = data();
  const entity = d.entity.get(id);
  if (!entity) return null;

  const country = makeCountry(st, entity, capitalRegion);
  const iso = dateStr(st.date);
  const activeLeaders = d.leadersOf(id).filter((leader) => leader.from <= iso && leader.to >= iso);
  const leader = activeLeaders.find((candidate) => candidate.governance === country.laws.governance) ?? activeLeaders[0];
  if (leader) {
    country.leader = {
      name: leader.name,
      born: leader.born ? Number(leader.born.slice(0, 4)) : null,
      since: Number(leader.from.slice(0, 4)),
      historical: true,
      diesOn: leader.died ?? null,
      female: femaleName(leader.name),
      termEnds: leader.end === 'term' ? leader.to : null,
    };
  } else {
    country.leader = {
      name: 'Chưa có hồ sơ nguyên thủ cho thời kỳ này',
      born: null,
      since: st.date.y,
      historical: false,
    };
  }
  country.capital = capitalRegion;
  country.formedAt = st.tick;
  country.regimeChangedAt = st.tick;
  country.reform = null;
  country.constructionQueue = [];
  country.claims = [];
  country.customsUnion = null;
  country.ai = { cooldowns: {}, lawHistory: [], recent: [], planTarget: null };
  return country;
}

function termEndFor(id: string, name?: string): string | null {
  if (!name) return null;
  const rec = data().leadersOf(id).find((l) => l.name === name || name.startsWith(l.name));
  return rec && rec.end === 'term' ? rec.to : null;
}

/** Initial fertility regime: calibrated so that the model's natural growth at start equals the documented
 * 1820-1836 growth of the CoW population series (pre-start data only: no information after 1836 is used). */
function calibrateDemography(st: GameState) {
  const d = data();
  const series = new Map<string, Record<string, number>>();
  for (const b of d.db.benchmarks) if (b.field === 'population.total' && Number(b.date) <= 1836) (series.get(b.entity) ?? series.set(b.entity, {}).get(b.entity)!)[b.date] = b.value;
  for (const [id, s] of series) {
    const c = st.countries[id]; if (!c || !s['1836']) continue;
    const y0 = s['1820'] ? 1820 : s['1830'] ? 1830 : null; if (!y0) continue;
    const r = Math.pow(s['1836'] / s[String(y0)], 1 / (1836 - y0)) - 1;
    if (!(r > -0.01 && r < 0.04)) continue;
    const regs = st.regions.filter((x) => x.owner === id);
    let model = 0, pop = 0;
    for (const x of regs) {
      const urban = x.strata[S.workers] + x.strata[S.middle] + x.strata[S.capitalists] * 0.5;
      const frontier = clamp(1 - x.pop / Math.max(50, x.area) / 30, 0, 1);
      const b = 0.037 - 0.008 * x.literacy - 0.006 * urban + 0.012 * frontier;
      const dd = Math.max(0.011, 0.033 - 0.02 * (x.sol - 0.5));
      model += (b - dd) * x.pop; pop += x.pop;
    }
    (c as any).fertilityAdj = clamp(r - model / Math.max(1, pop), -0.012, 0.012);
  }
}
