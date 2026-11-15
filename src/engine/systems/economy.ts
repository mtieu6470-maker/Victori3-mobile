// Economy Engine (shared by both modes): production by sector, national/customs-union markets blended with a
// world market, prices, food security, standard of living, state finance and private investment.
import { data } from '../data/db';
import { GOODS, S, type Country, type GameState, type Good, type Region, type Building, type MarketGoodStats } from '../types';
import { clamp, log } from '../core';
import { regionsOf } from '../cache';

export const OPENNESS: Record<string, number> = { isolationism: 0.03, protectionism: 0.3, free_trade: 0.7 };
const TARIFF: Record<string, number> = { isolationism: 0.35, protectionism: 0.2, free_trade: 0.04 };
const TERRAIN_AGRI: Record<string, number> = { pl: 1.15, hi: 0.95, mo: 0.65, fo: 0.8, de: 0.45, st: 0.75, ju: 0.75, tu: 0.35, ma: 0.85, sa: 0.8 };
export const LEVEL_WORKERS = 2000;
export const BUILD_COST: Record<Building, number> = {
  plantation: 4e6, mine: 6e6, logging: 3e6, textile_mill: 10e6, ironworks: 14e6, tool_works: 11e6, arms_works: 12e6, luxury_workshop: 8e6, railway: 25e6, university: 6e6,
};
/** Factory recipes: annual output per worker and inputs per unit of output. */
export const RECIPES: Partial<Record<Building, { out: Good; perWorker: number; inputs: Partial<Record<Good, number>> }>> = {
  textile_mill: { out: 'textiles', perWorker: 1800, inputs: { cotton: 0.45, coal: 0.08 } },
  ironworks: { out: 'steel', perWorker: 1500, inputs: { iron: 0.5, coal: 0.4 } },
  tool_works: { out: 'tools', perWorker: 1700, inputs: { steel: 0.4, timber: 0.15 } },
  arms_works: { out: 'arms', perWorker: 1600, inputs: { steel: 0.35, tools: 0.15 } },
  luxury_workshop: { out: 'luxury', perWorker: 1500, inputs: { cash_crops: 0.3 } },
};

export function techEffect(c: Country, key: string): number {
  const d = data(); let s = 0;
  for (const t of c.techs) { const v = d.tech.get(t)?.effects[key]; if (typeof v === 'number') s += v; }
  return s;
}
export function hasTech(c: Country, id: string) { return c.techs.includes(id); }

export function marketOf(st: GameState, c: Country): string { return c.customsUnion ?? (c.overlord && st.countries[c.overlord]?.subjectType !== 'personal_union' && c.subjectType === 'chartered_company' ? c.overlord : c.id); }

export function openness(c: Country, coastal: boolean): number {
  let o = OPENNESS[c.laws.trade] ?? 0.3;
  o *= 1 + 0.3 * techEffect(c, 'trade_capacity') + 0.2 * (hasTech(c, 'railways') ? 1 : 0);
  if (!coastal) o *= 0.6;
  return clamp(o, 0.01, 0.92);
}

interface RegionCalc { supply: Record<Good, number>; demand: Record<Good, number>; services: number; inputsNeed: Record<Good, number>; factoryOut: Record<Good, number>; grainLocal: number; grainNeed: number }

const zero = () => Object.fromEntries(GOODS.map((g) => [g, 0])) as Record<Good, number>;

export function computeEconomy(st: GameState, calibrate = false, iter = 0): void {
  const d = data();
  const regionsBy: Record<string, Region[]> = {};
  for (const r of st.regions) (regionsBy[r.owner] ??= []).push(r);
  const calc: RegionCalc[] = new Array(st.regions.length);
  const markets: Record<string, { s: Record<Good, number>; dm: Record<Good, number>; open: number; members: string[] }> = {};

  // ---- 1. physical production and demand per region
  for (let i = 0; i < st.regions.length; i++) {
    const r = st.regions[i]; const c = st.countries[r.owner]; if (!c) continue;
    const A = Math.pow(c.productivity, 0.6); const Am = Math.pow(c.productivity, 0.5);
    const LF = r.pop * 0.45;
    const sh = r.strata;
    const rail = Math.min(5, r.buildings.railway);
    const infra = 1 + 0.05 * rail;
    const occupied = r.controller !== r.owner ? 0.7 : 1;
    const dev = 1 - r.devastation;
    const blight = r.blight && r.blight.until > st.tick ? 1 - r.blight.severity : 1;
    const supply = zero(), demand = zero(), inputsNeed = zero(), factoryOut = zero();
    // agriculture
    const terr = TERRAIN_AGRI[r.terrain] ?? 0.8;
    const agriWorkers = LF * (sh[S.peasants] + 0.3 * sh[S.laborers]);
    const grain = agriWorkers * 650 * terr * (1 + (r.res.includes('grain') ? 0.15 : 0) + (r.res.includes('live') ? 0.05 : 0)) * (1 + techEffect(c, 'farm_efficiency')) * infra * A * dev * blight * occupied;
    supply.grain += grain;
    // plantations
    const plantCap = r.buildings.plantation * LEVEL_WORKERS;
    const plantWorkers = Math.min(plantCap, LF * (sh[S.slaves] + 0.25 * sh[S.laborers]));
    if (plantWorkers > 0) {
      const kinds: Good[] = []; if (r.res.includes('cott')) kinds.push('cotton'); if (r.res.includes('opium')) kinds.push('opium'); if (r.res.includes('cash')) kinds.push('cash_crops');
      if (!kinds.length) kinds.push('cash_crops');
      for (const k of kinds) supply[k] += (plantWorkers * 900 * A * infra * dev * occupied) / kinds.length;
    }
    // slaves outside plantations work the fields
    supply.grain += Math.max(0, LF * sh[S.slaves] - plantWorkers) * 500 * terr * A * dev;
    // mines and logging
    const mineWorkers = Math.min(r.buildings.mine * LEVEL_WORKERS, LF * sh[S.laborers] * 0.6);
    if (mineWorkers > 0) {
      const kinds: Good[] = []; if (r.res.includes('coal')) kinds.push('coal'); if (r.res.includes('iron')) kinds.push('iron'); if (r.res.includes('gold') || r.res.includes('silv')) kinds.push('luxury');
      if (!kinds.length) kinds.push('iron');
      for (const k of kinds) supply[k] += (mineWorkers * 900 * (1 + techEffect(c, 'mine_efficiency')) * A * infra * dev * occupied) / kinds.length;
    }
    const logWorkers = Math.min(r.buildings.logging * LEVEL_WORKERS, LF * sh[S.laborers] * 0.4);
    supply.timber += logWorkers * 900 * A * dev * occupied + LF * sh[S.peasants] * 15 * A; // farm-side timber
    // factories (input availability applied after market clearing)
    let factoryWorkersLeft = LF * sh[S.workers];
    const facEff = 1 + techEffect(c, 'factory_efficiency');
    for (const b of Object.keys(RECIPES) as Building[]) {
      const rec = RECIPES[b]!; const w = Math.min(r.buildings[b] * LEVEL_WORKERS, factoryWorkersLeft); factoryWorkersLeft -= w;
      if (w <= 0) continue;
      const eff = facEff * (1 + (b === 'textile_mill' ? techEffect(c, 'textile_efficiency') : b === 'ironworks' ? techEffect(c, 'iron_efficiency') + techEffect(c, 'steel_efficiency') : b === 'arms_works' ? techEffect(c, 'arms_efficiency') : 0));
      const out = w * rec.perWorker * eff * Am * infra * dev * occupied;
      factoryOut[rec.out] += out;
      for (const [g, q] of Object.entries(rec.inputs)) inputsNeed[g as Good] += out * (q as number);
    }
    // artisans (cottage industry)
    const art = LF * sh[S.artisans] * 700 * Am * dev * occupied;
    supply.textiles += art * 0.55; supply.tools += art * 0.25; supply.luxury += art * 0.2;
    // services
    const svc = LF * (sh[S.middle] + sh[S.capitalists] + sh[S.aristocrats] + sh[S.clergy]) * 1600 * Am * infra * occupied;
    // demand
    const wealth = Math.max(0.3, (r.output > 0 ? (r.output * 12) / Math.max(1, r.pop) : 600 * c.productivity) / 600);
    const grainNeed = r.pop * 200 * (1 + 0.25 * Math.log(wealth));
    demand.grain += grainNeed;
    demand.textiles += r.pop * 12 * Math.pow(wealth, 0.8);
    demand.cash_crops += r.pop * 6 * wealth;
    demand.luxury += r.pop * (sh[S.aristocrats] + sh[S.capitalists] + sh[S.middle] * 0.4) * 160 * wealth;
    demand.tools += agriWorkers * 2 + (LF * sh[S.workers]) * 8 + mineWorkers * 6;
    demand.coal += r.pop * 1.5 * wealth;
    demand.opium += r.pop * (c.id === 'QNG' ? 0.6 : 0.03);
    for (const g of GOODS) { supply[g] += factoryOut[g]; demand[g] += inputsNeed[g]; }
    calc[i] = { supply, demand, services: svc, inputsNeed, factoryOut, grainLocal: grain, grainNeed };
    const mk = marketOf(st, c);
    const m = (markets[mk] ??= { s: zero(), dm: zero(), open: 0, members: [] });
    for (const g of GOODS) { m.s[g] += supply[g]; m.dm[g] += demand[g]; }
    if (!m.members.includes(c.id)) m.members.push(c.id);
  }
  // military demand
  for (const c of Object.values(st.countries)) {
    if (!c.alive) continue;
    const m = markets[marketOf(st, c)]; if (!m) continue;
    const atWar = st.wars.some((w) => w.attackers.members.includes(c.id) || w.defenders.members.includes(c.id));
    m.dm.arms += c.army.manpower * 15 * (atWar ? 3 : 1);
    m.dm.steel += c.navy.strength * 1500;
  }
  // ---- 2. markets: local clearing blended with a world market
  const mIds = Object.keys(markets);
  for (const id of mIds) {
    const m = markets[id];
    const leader = st.countries[id] ?? st.countries[m.members[0]];
    const coastal = st.regions.some((r) => m.members.includes(r.owner) && r.coastal);
    m.open = openness(leader, coastal);
  }
  const world: Record<Good, { surplus: number; deficit: number }> = Object.fromEntries(GOODS.map((g) => [g, { surplus: 0, deficit: 0 }])) as any;
  for (const id of mIds) { const m = markets[id]; for (const g of GOODS) { const diff = m.s[g] - m.dm[g]; if (diff > 0) world[g].surplus += diff * m.open; else world[g].deficit += -diff * m.open; } }
  for (const g of GOODS) {
    const ws = world[g];
    const target = clamp(Math.pow((ws.deficit + 1) / (ws.surplus + 1), 0.25), 0.6, 2.2);
    st.worldPrices[g] = st.worldPrices[g] * 0.8 + target * 0.2;
  }
  const marketShort: Record<string, Record<Good, number>> = {};
  const marketImports: Record<string, number> = {};
  for (const id of mIds) {
    const m = markets[id]; const prices = (st.marketPrices[id] ??= { ...st.worldPrices });
    const short = zero(); let importsValue = 0;
    const stats = ((st.marketStats ??= {})[id] = {} as Record<Good, MarketGoodStats>);
    for (const g of GOODS) {
      const ws = world[g];
      const availRatio = ws.deficit > 0 ? clamp(ws.surplus / ws.deficit, 0, 1) : 1;
      const deficit = Math.max(0, m.dm[g] - m.s[g]);
      const imports = deficit * m.open * availRatio;
      importsValue += imports * st.worldPrices[g];
      const avail = m.s[g] + imports;
      short[g] = m.dm[g] > 0 ? clamp(1 - avail / m.dm[g], 0, 1) : 0;
      const local = clamp(Math.pow((m.dm[g] + 1) / (avail + 1), 0.5), 0.45, 3);
      const target = (1 - m.open) * local + m.open * st.worldPrices[g];
      prices[g] = calibrate ? target : prices[g] * 0.7 + target * 0.3;
      // persisted for the UI (Market screen): the same quantities the clearing above used, in engine units
      stats[g] = { supply: m.s[g], demand: m.dm[g], imports, short: short[g] };
    }
    marketShort[id] = short; marketImports[id] = importsValue;
  }

  // ---- 3. value added, food security, SoL per region; country GDP
  const gdp: Record<string, number> = {};
  for (let i = 0; i < st.regions.length; i++) {
    const r = st.regions[i]; const c = st.countries[r.owner]; const k = calc[i]; if (!c || !k) continue;
    const mk = marketOf(st, c); const p = st.marketPrices[mk]; const short = marketShort[mk];
    const Av = Math.pow(c.productivity, 0.45);
    let value = k.services * Math.pow(c.productivity, 0.5);
    for (const g of GOODS) {
      let out = k.supply[g] - k.factoryOut[g];
      // factory output scaled by the availability of inputs in the market
      if (k.factoryOut[g] > 0) {
        let avail = 1; for (const [ig] of Object.entries(k.inputsNeed)) if (k.inputsNeed[ig as Good] > 0) avail = Math.min(avail, 1 - short[ig as Good]);
        out += k.factoryOut[g] * avail;
      }
      value += out * p[g] * Av;
    }
    for (const g of GOODS) value -= k.inputsNeed[g] * p[g] * (1 - short[g]) * Av;
    r.output = Math.max(0, value) / 12;
    gdp[r.owner] = (gdp[r.owner] ?? 0) + value;
    // food security: market shortage plus local deficit where transport access is poor
    const access = clamp(0.25 + 0.12 * Math.min(5, r.buildings.railway) + (r.coastal ? 0.35 : 0) + 0.3 * openness(c, r.coastal), 0, 1);
    const localDef = Math.max(0, 1 - k.grainLocal / Math.max(1, k.grainNeed));
    const famine = clamp(short.grain + localDef * (1 - access) * 0.9 - (c.budget.health * 0.5), 0, 1);
    const gdpPc = (value / Math.max(1, r.pop));
    const basket = 200 * p.grain + 12 * p.textiles;
    const laborShare = r.strata[S.slaves] > 0.3 ? 0.45 : 0.72;
    const raw = 0.5 + 0.33 * Math.log(Math.max(1e-3, (gdpPc * (1 - c.taxRate) * laborShare) / (basket * 2)));
    const target = clamp(raw - famine * 0.6 - (c.laws.labor === 'serfdom' ? 0.05 : 0), 0, 1);
    r.sol = calibrate ? target : r.sol * 0.85 + target * 0.15;
    (r as Region & { famine?: number }).famine = famine;
  }
  // ---- 4. calibration: productivity so that GDP matches the Maddison-based starting value
  if (calibrate) {
    for (const c of Object.values(st.countries)) {
      const pop = (regionsBy[c.id] ?? []).reduce((s, r) => s + r.pop, 0);
      const target = pop * (d.db.gdp_pc_1836[c.id]?.value ?? 450);
      const got = gdp[c.id] ?? 0;
      if (got > 0 && target > 0) c.productivity *= target / got;
    }
    if (iter < 4) return computeEconomy(st, true, iter + 1);
    (st as any).calibratedPrices = JSON.parse(JSON.stringify(st.marketPrices));
    return computeEconomy(st, false);
  }
  // ---- 5. state finance and investment
  for (const c of Object.values(st.countries)) {
    if (!c.alive) continue;
    const g = gdp[c.id] ?? 0;
    c.gdp = c.gdp ? c.gdp * 0.9 + g * 0.1 : g;
    const pop = (regionsBy[c.id] ?? []).reduce((s, r) => s + r.pop, 0);
    const famine = (regionsBy[c.id] ?? []).reduce((s, r) => s + ((r as any).famine ?? 0) * r.pop, 0) / Math.max(1, pop);
    c.famine = famine;
    financeMonth(st, c, g, pop, (marketImports[marketOf(st, c)] ?? 0) * (marketOf(st, c) === c.id ? 1 : 0.2));
  }
}

const SOLDIER_COST = (gdpPc: number) => 0.35 * gdpPc + 20;
export const SHIP_COST = 150000;

function financeMonth(st: GameState, c: Country, gdpYear: number, pop: number, importsValue: number) {
  const gdpPc = pop > 0 ? gdpYear / pop : 0;
  const taxEff = clamp(0.45 + 1.4 * c.budget.admin + 0.1 * (c.laws.power === 'autocracy' ? 0 : 1) + techEffect(c, 'admin_efficiency'), 0.25, 1.05);
  const tax = (c.taxRate * gdpYear * taxEff) / 12;
  const tariff = (importsValue * (TARIFF[c.laws.trade] ?? 0.2)) / 12;
  c.tariffIncome = tariff;
  const income = tax + tariff;
  const armyCost = (c.army.manpower * SOLDIER_COST(gdpPc)) / 12;
  const navyCost = (c.navy.strength * SHIP_COST) / 12;
  const civil = income * (c.budget.admin + c.budget.education + c.budget.health);
  const construction = income * c.budget.construction;
  const interest = (c.debt * 0.05) / 12;
  const expense = armyCost + navyCost + civil + construction + interest;
  c.income = income; c.expense = expense;
  c.treasury += income - expense + construction; // construction money is held in the treasury for projects
  (c as any).statePool = ((c as any).statePool ?? 0) + construction;
  if (c.treasury < 0) { c.debt += -c.treasury; c.treasury = 0; }
  if (c.debt > 0 && c.treasury > income * 6) { const pay = Math.min(c.debt, c.treasury - income * 6); c.debt -= pay; c.treasury -= pay; }
  // private investment from the savings of property-owning strata
  const lawF = { laissez_faire: 1, interventionism: 0.75, mercantilism: 0.5, traditionalism: 0.25 }[c.laws.economy] ?? 0.4;
  (c as any).privatePool = ((c as any).privatePool ?? 0) + (gdpYear * 0.012 * lawF * (1 + techEffect(c, 'investment'))) / 12;
  // default
  if (income > 0 && c.debt > income * 12 * 4) {
    c.debt *= 0.5; c.legitimacy = clamp(c.legitimacy - 15, 0, 100); c.prestige -= 10;
    log(st, { type: 'economy', text: `${c.name} defaults on its public debt.`, textVi: `${c.nameVi} vỡ nợ công.`, actors: [c.id] });
  }
}

/** Builds one level of a building if affordable and allowed. Shared by AI, player and the private sector. */
export function canBuild(st: GameState, c: Country, r: Region, b: Building): boolean {
  if (r.owner !== c.id || r.controller !== c.id) return false;
  if (b === 'railway') return hasTech(c, 'railways') && r.buildings.railway < 5;
  if (b === 'mine') return r.res.some((x) => ['coal', 'iron', 'gold', 'silv'].includes(x));
  if (b === 'plantation') return r.res.some((x) => ['cash', 'cott', 'opium'].includes(x));
  if (b === 'logging') return r.res.includes('timb');
  if (b === 'ironworks') return hasTech(c, 'puddling_iron') || hasTech(c, 'steam_engines');
  if (b === 'textile_mill') return hasTech(c, 'mechanized_spinning');
  if (b === 'arms_works' || b === 'tool_works') return hasTech(c, 'steam_engines');
  return true;
}
export function buildCost(c: Country, b: Building, st: GameState): number {
  const p = st.marketPrices[marketOf(st, c)] ?? st.worldPrices;
  return BUILD_COST[b] * (0.5 + 0.3 * p.tools + 0.2 * p.steel) * Math.sqrt(Math.max(0.3, c.productivity));
}
export function build(st: GameState, c: Country, r: Region, b: Building, pool: 'statePool' | 'privatePool'): boolean {
  const cost = buildCost(c, b, st);
  if (!canBuild(st, c, r, b) || ((c as any)[pool] ?? 0) < cost) return false;
  (c as any)[pool] -= cost;
  if (pool === 'statePool') c.treasury = Math.max(0, c.treasury - cost);
  r.buildings[b] += 1;
  return true;
}

/** Expected annual return of one more level of a building in a region (used by private investors and the AI). */
export function buildingReturn(st: GameState, c: Country, r: Region, b: Building): number {
  const p = st.marketPrices[marketOf(st, c)] ?? st.worldPrices;
  const A = c.productivity;
  const labour = r.pop * 0.45 * (b === 'mine' || b === 'logging' || b === 'plantation' ? r.strata[S.laborers] + r.strata[S.peasants] * 0.3 + r.strata[S.slaves] : r.strata[S.workers] + r.strata[S.peasants] * 0.2 + r.strata[S.artisans] * 0.5);
  const used = LEVEL_WORKERS * (b === 'mine' ? r.buildings.mine : b === 'plantation' ? r.buildings.plantation : b === 'logging' ? r.buildings.logging : r.buildings.textile_mill + r.buildings.ironworks + r.buildings.tool_works + r.buildings.arms_works + r.buildings.luxury_workshop);
  if (b !== 'railway' && b !== 'university' && labour - used < LEVEL_WORKERS * 0.5) return 0;
  let value = 0;
  if (b === 'railway') value = (r.output * 12) * 0.05 + 2e5;
  else if (b === 'university') value = 0;
  else if (RECIPES[b]) { const rec = RECIPES[b]!; const out = LEVEL_WORKERS * rec.perWorker * A; value = out * p[rec.out] - Object.entries(rec.inputs).reduce((s, [g, q]) => s + out * (q as number) * p[g as Good], 0) - LEVEL_WORKERS * 650 * A * p.grain * 0.5; }
  else { const good: Good = b === 'mine' ? (r.res.includes('coal') ? 'coal' : r.res.includes('iron') ? 'iron' : 'luxury') : b === 'logging' ? 'timber' : r.res.includes('cott') ? 'cotton' : r.res.includes('opium') ? 'opium' : 'cash_crops'; value = LEVEL_WORKERS * 900 * A * p[good] - LEVEL_WORKERS * 650 * A * p.grain * 0.6; }
  return value / buildCost(c, b, st);
}

export function privateInvestment(st: GameState, c: Country) {
  let tries = 0;
  while (((c as any).privatePool ?? 0) > 0 && tries++ < 3) {
    let best: { r: Region; b: Building; v: number } | null = null;
    for (const r of regionsOf(st, c.id)) {
      for (const b of ['textile_mill', 'ironworks', 'tool_works', 'mine', 'plantation', 'logging', 'luxury_workshop', 'railway'] as Building[]) {
        if (!canBuild(st, c, r, b)) continue;
        if (b === 'plantation' && c.laws.labor !== 'slavery' && r.strata[S.laborers] < 0.05) continue;
        const v = buildingReturn(st, c, r, b);
        if (v > 0.08 && (!best || v > best.v)) best = { r, b, v };
      }
    }
    if (!best || !build(st, c, best.r, best.b, 'privatePool')) break;
  }
}
