// Economy Engine (shared by both modes): production by sector, national/customs-union markets blended with a
// world market, prices, food security, standard of living, state finance and private investment.
import { data } from '../data/db';
import { GOODS, STRATA, S, type Country, type GameState, type Good, type Region, type Building, type MarketGoodStats, type PopulationEconomy } from '../types';
import { clamp, log } from '../core';
import { regionsOf } from '../cache';
import { appendInventoryLedgerMonth, emptyInventoryLedger, inventoryPeriod, settleInventoryFlow } from './inventory';

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

export interface ProductionMethod {
  id: string; name: string; description: string; requiresTech?: string;
  outputMultiplier: number; additionalInputs?: Partial<Record<Good, number>>;
}

/** Regional factory methods: multipliers change output and additionalInputs change physical market demand. */
export const PRODUCTION_METHODS: Partial<Record<Building, ProductionMethod[]>> = {
  textile_mill: [
    { id: 'hand_looms', name: 'Khung cửi thủ công', description: 'Sản xuất thủ công, không cần nhiên liệu bổ sung.', outputMultiplier: 1 },
    { id: 'power_looms', name: 'Khung cửi cơ giới', description: 'Tăng sản lượng dệt, tiêu thụ thêm than.', requiresTech: 'mechanized_spinning', outputMultiplier: 1.2, additionalInputs: { coal: 0.08 } },
  ],
  ironworks: [
    { id: 'charcoal_furnace', name: 'Lò luyện truyền thống', description: 'Lò luyện cơ bản với mức tiêu hao đầu vào hiện hành.', outputMultiplier: 1 },
    { id: 'puddling_furnace', name: 'Lò luyện puddling', description: 'Cải thiện luyện sắt và tăng nhu cầu nhiên liệu.', requiresTech: 'puddling_iron', outputMultiplier: 1.12, additionalInputs: { coal: 0.1 } },
    { id: 'coke_blast_furnace', name: 'Lò cao coke', description: 'Sản lượng thép cao hơn, đổi lại tiêu thụ nhiều than.', requiresTech: 'coke_smelting', outputMultiplier: 1.25, additionalInputs: { coal: 0.18 } },
  ],
  tool_works: [
    { id: 'craft_tools', name: 'Chế tác dụng cụ', description: 'Dụng cụ được sản xuất theo phương pháp thủ công.', outputMultiplier: 1 },
    { id: 'machine_tools', name: 'Máy công cụ chính xác', description: 'Tăng năng suất xưởng dụng cụ và tiêu thụ thêm thép.', requiresTech: 'interchangeable_parts', outputMultiplier: 1.2, additionalInputs: { steel: 0.08 } },
  ],
  arms_works: [
    { id: 'artisan_armaments', name: 'Vũ khí thủ công', description: 'Vũ khí được lắp ráp thủ công.', outputMultiplier: 1 },
    { id: 'rifle_assembly', name: 'Dây chuyền súng trường', description: 'Chuẩn hóa lắp ráp, tăng sản lượng nhưng cần thêm thép và dụng cụ.', requiresTech: 'breech_loading_rifles', outputMultiplier: 1.25, additionalInputs: { steel: 0.12, tools: 0.04 } },
  ],
};

export function availableProductionMethods(c: Country, building: Building): ProductionMethod[] {
  return (PRODUCTION_METHODS[building] ?? []).filter((m) => !m.requiresTech || hasTech(c, m.requiresTech));
}

/** Without an explicit choice, a region adopts its strongest currently researched method. */
export function productionMethodFor(c: Country, r: Region, building: Building): ProductionMethod | null {
  const methods = availableProductionMethods(c, building);
  if (!methods.length) return null;
  const selected = r.productionMethods?.[building];
  return methods.find((m) => m.id === selected) ?? methods[methods.length - 1];
}

export function setProductionMethod(c: Country, r: Region, building: Building, methodId: string): boolean {
  if (r.owner !== c.id || r.buildings[building] <= 0) return false;
  if (!availableProductionMethods(c, building).some((m) => m.id === methodId)) return false;
  r.productionMethods = { ...(r.productionMethods ?? {}), [building]: methodId };
  return true;
}

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

interface BuildingFlow {
  outputs: Partial<Record<Good, number>>;
  inputs: Partial<Record<Good, number>>;
  workerMix: Partial<Record<number, number>>;
}
interface RegionCalc { supply: Record<Good, number>; demand: Record<Good, number>; services: number; inputsNeed: Record<Good, number>; factoryOut: Record<Good, number>; factoryInputs: Partial<Record<Good, Partial<Record<Good, number>>>>; employment: number[]; employedByBuilding: Partial<Record<Building, number>>; buildingFlows: Partial<Record<Building, BuildingFlow>>; grainLocal: number; grainNeed: number }

const zero = () => Object.fromEntries(GOODS.map((g) => [g, 0])) as Record<Good, number>;

const PRODUCTIVE_BUILDINGS: Building[] = [
  'plantation', 'mine', 'logging', 'textile_mill', 'ironworks',
  'tool_works', 'arms_works', 'luxury_workshop',
];

export interface LaborMarketJob {
  building: Building;
  workersWanted: number;
  attractiveness?: number;
}

/**
 * Allocate one finite occupational labor pool across competing employers.
 * Higher profitability improves a building's share, but no job can exceed its demand.
 */
export function allocateCompetingWorkers(
  availableWorkers: number,
  jobs: LaborMarketJob[],
): Partial<Record<Building, number>> {
  const result: Partial<Record<Building, number>> = {};
  const candidates = jobs.map((job) => {
    const demand = Number.isFinite(job.workersWanted) ? Math.max(0, job.workersWanted) : 0;
    result[job.building] = 0;
    return {
      building: job.building,
      remaining: demand,
      attractiveness: clamp(Number.isFinite(job.attractiveness ?? 1) ? (job.attractiveness ?? 1) : 1, 0.25, 2),
      allocated: 0,
    };
  }).filter((job) => job.remaining > 1e-6);
  let remainingWorkers = Number.isFinite(availableWorkers) ? Math.max(0, availableWorkers) : 0;

  // Each pass redistributes labor that a capped employer could not absorb.
  for (let pass = 0; pass <= candidates.length && remainingWorkers > 1e-6; pass++) {
    const active = candidates.filter((job) => job.remaining > 1e-6);
    if (!active.length) break;
    const totalWeight = active.reduce((sum, job) => sum + job.remaining * job.attractiveness, 0);
    if (totalWeight <= 1e-9) break;
    const roundBudget = remainingWorkers;
    let assignedThisPass = 0;
    for (const job of active) {
      const share = roundBudget * (job.remaining * job.attractiveness) / totalWeight;
      const assigned = Math.min(job.remaining, Math.max(0, share));
      job.remaining -= assigned;
      job.allocated += assigned;
      assignedThisPass += assigned;
    }
    remainingWorkers = Math.max(0, remainingWorkers - assignedThisPass);
    if (assignedThisPass <= 1e-6) break;
  }

  for (const job of candidates) result[job.building] = job.allocated;
  return result;
}

/** Smooth monthly adjustment toward a profitability-dependent partial-employment equilibrium. */
export function nextEmploymentTarget(previousUtilization: number | undefined, profitMargin: number): number {
  const previous = Number.isFinite(previousUtilization) ? clamp(previousUtilization as number, 0.1, 1) : 1;
  const margin = Number.isFinite(profitMargin) ? clamp(profitMargin, -1, 1) : 0;
  const desired = clamp(0.62 + margin * 0.72, 0.1, 1);
  return clamp(previous + (desired - previous) * 0.16, 0.1, 1);
}

function employmentTarget(r: Region, building: Building): number {
  const value = Number(r.popEconomy?.employmentTargetByBuilding?.[building]);
  return Number.isFinite(value) ? clamp(value, 0.1, 1) : 1;
}

function wageOffer(r: Region, building: Building): number {
  const value = Number(r.popEconomy?.wageOfferByBuilding?.[building]);
  return Number.isFinite(value) ? clamp(value, 0.75, 1.5) : 1;
}

/**
 * Firms with healthy margins can bid up wages when vacancies are hard to fill.
 * Loss-making firms gradually lower offers; the smoothed, bounded index is relative
 * to the region's base wage, not a second source of household income.
 */
export function nextWageOffer(
  previousOffer: number | undefined,
  profitMargin: number,
  staffingGap: number,
): number {
  const previous = Number.isFinite(previousOffer) ? clamp(previousOffer as number, 0.75, 1.5) : 1;
  const margin = Number.isFinite(profitMargin) ? clamp(profitMargin, -1, 1) : 0;
  const gap = Number.isFinite(staffingGap) ? clamp(staffingGap, 0, 1) : 0;
  const desired = clamp(1 + margin * 0.45 + Math.max(0, margin) * gap * 0.35, 0.75, 1.5);
  return clamp(previous + (desired - previous) * 0.12, 0.75, 1.5);
}

function laborAttractiveness(r: Region, building: Building): number {
  const margin = Number(r.popEconomy?.profitabilityByBuilding?.[building]);
  const profitFactor = Number.isFinite(margin) ? clamp(1 + margin * 1.2, 0.25, 2) : 1;
  return clamp(profitFactor * wageOffer(r, building), 0.25, 2);
}

function addFlowAmount(flow: Partial<Record<Good, number>>, good: Good, amount: number): void {
  if (!Number.isFinite(amount) || amount <= 0) return;
  flow[good] = (flow[good] ?? 0) + amount;
}

/** Returns the share of planned factory output supported by that product's own input recipe. */
export function factoryInputFulfillment(
  inputs: Partial<Record<Good, number>>,
  shortages: Partial<Record<Good, number>>,
): number {
  let fulfilled = 1;
  for (const good of GOODS) {
    if ((inputs[good] ?? 0) <= 0) continue;
    fulfilled = Math.min(fulfilled, 1 - clamp(shortages[good] ?? 0, 0, 1));
  }
  return clamp(fulfilled, 0, 1);
}

const POP_WAGE_MULTIPLIER = [0.72, 0.2, 0.86, 0.94, 1.08, 1.32, 1.02, 0, 0];
const POP_OWNER_MULTIPLIER = [0, 0, 0, 0, 0, 0, 0, 1.15, 1.8];
const POP_NEEDS_MULTIPLIER = [0.86, 1.3, 0.96, 1.02, 1, 1.22, 1.08, 1.42, 1.62];

/**
 * Distributes a region's value added to worker households and property-owning strata.
 * This is an aggregate cohort model (not individual Pops): wages depend on staffed jobs,
 * while aristocrats/capitalists receive the residual ownership income.
 */
/** Shift cohort SoL levels together so the population-weighted mean stays on the established macro calibration. */
export function calibrateCohortLivingStandards(
  economy: PopulationEconomy,
  strata: number[],
  targetMean: number,
): PopulationEconomy {
  const weights = STRATA.map((_, i) => Math.max(0, Number(strata[i] ?? 0)));
  const weightTotal = weights.reduce((sum, value) => sum + value, 0);
  if (weightTotal <= 0) return { ...economy, sol: economy.sol.map(() => clamp(targetMean, 0, 1)) };

  const target = clamp(targetMean, 0, 1);
  let low = -1, high = 1;
  // Binary search an additive shift under the [0,1] bounds. This preserves cohort
  // differences while preventing a new class model from silently changing the
  // previously calibrated national/regional demographic trajectory.
  for (let i = 0; i < 24; i++) {
    const shift = (low + high) / 2;
    const mean = economy.sol.reduce((sum, value, index) => sum + clamp(value + shift, 0, 1) * weights[index], 0) / weightTotal;
    if (mean < target) low = shift;
    else high = shift;
  }
  const shift = (low + high) / 2;
  return { ...economy, sol: economy.sol.map((value) => clamp(value + shift, 0, 1)) };
}

const POP_LUXURY_PROPENSITY = [0, 0, 0, 0, 0, 0.4, 0, 1, 1];

/**
 * Monthly household buy orders. Equal cohort incomes reproduce the established regional
 * demand curves; unequal incomes redistribute discretionary spending toward richer strata.
 * This is still a national/regional aggregate market, not a fully simulated individual-Pop
 * buy-order book.
 */
export function populationConsumptionDemand(
  population: number,
  strata: number[],
  incomePerCapita?: number[],
  countryId = '',
  fallbackWealth = 1,
): Record<Good, number> {
  const demand = zero();
  const pop = Math.max(0, Number.isFinite(population) ? population : 0);
  const defaultIncome = 600 * clamp(Number.isFinite(fallbackWealth) ? fallbackWealth : 1, 0.3, 5);
  for (let i = 0; i < STRATA.length; i++) {
    const cohortPop = pop * clamp(Number(strata[i] ?? 0), 0, 1);
    if (cohortPop <= 0) continue;
    const rawIncome = Number(incomePerCapita?.[i]);
    const income = Number.isFinite(rawIncome) && rawIncome >= 0 ? rawIncome : defaultIncome;
    const wealth = clamp(income / 600, 0.3, 5);

    demand.grain += cohortPop * 200 * (1 + 0.25 * Math.log(wealth));
    demand.textiles += cohortPop * 12 * Math.pow(wealth, 0.8);
    demand.cash_crops += cohortPop * 6 * wealth;
    demand.luxury += cohortPop * POP_LUXURY_PROPENSITY[i] * 160 * wealth;
    demand.coal += cohortPop * 1.5 * wealth;
    demand.opium += cohortPop * (countryId === 'QNG' ? 0.6 : 0.03);
  }
  return demand;
}

export function calculatePopulationEconomy(
  population: number,
  strata: number[],
  employment: number[],
  annualValueAdded: number,
  prices: Record<Good, number>,
  taxRate: number,
  famine: number,
  laborLaw: string,
  buildingWorkerMix: Partial<Record<Building, Partial<Record<number, number>>>> = {},
  wageOffers: Partial<Record<Building, number>> = {},
): PopulationEconomy {
  const pop = Math.max(0, Number.isFinite(population) ? population : 0);
  const classPopulation = STRATA.map((_, i) => pop * clamp(Number(strata[i] ?? 0), 0, 1));
  const employed = STRATA.map((_, i) => Math.min(classPopulation[i] * 0.45, Math.max(0, Number(employment[i] ?? 0))));
  const wageWeights = STRATA.map((_, i) => employed[i] * POP_WAGE_MULTIPLIER[i]);
  const buildingWageUnits: Partial<Record<Building, number>> = {};
  const remainingEmployment = employed.slice();

  // Each building can only bid for workers actually present in its staffing ledger.
  // Wage offers redistribute the existing wage pool; they never increase that pool.
  for (const [building, mix] of Object.entries(buildingWorkerMix) as [Building, Partial<Record<number, number>>][]) {
    const rawOffer = Number(wageOffers[building]);
    const offer = Number.isFinite(rawOffer) ? clamp(rawOffer, 0.75, 1.5) : 1;
    let wageUnits = 0;
    let mappedWorkers = 0;
    for (const [stratumKey, rawWorkers] of Object.entries(mix ?? {})) {
      const stratum = Number(stratumKey);
      if (!Number.isInteger(stratum) || stratum < 0 || stratum >= STRATA.length) continue;
      const requested = Number(rawWorkers);
      const workers = Math.min(remainingEmployment[stratum], Number.isFinite(requested) ? Math.max(0, requested) : 0);
      remainingEmployment[stratum] -= workers;
      mappedWorkers += workers;
      const multiplier = POP_WAGE_MULTIPLIER[stratum];
      wageWeights[stratum] += workers * multiplier * (offer - 1);
      wageUnits += workers * multiplier * offer;
    }
    if (mappedWorkers > 0) buildingWageUnits[building] = wageUnits;
  }
  const ownerWeights = STRATA.map((_, i) => classPopulation[i] * POP_OWNER_MULTIPLIER[i]);
  let wageWeightTotal = wageWeights.reduce((sum, n) => sum + n, 0);
  let ownerWeightTotal = ownerWeights.reduce((sum, n) => sum + n, 0);
  const value = Math.max(0, Number.isFinite(annualValueAdded) ? annualValueAdded : 0);

  if (wageWeightTotal <= 0 && ownerWeightTotal <= 0) {
    const fallback = classPopulation.findIndex((n) => n > 0);
    if (fallback >= 0) { wageWeights[fallback] = classPopulation[fallback]; wageWeightTotal = wageWeights[fallback]; }
  }
  let wagePool = value * 0.68;
  let ownerPool = value - wagePool;
  if (wageWeightTotal <= 0) { wagePool = 0; ownerPool = value; }
  if (ownerWeightTotal <= 0) { wagePool = value; ownerPool = 0; ownerWeightTotal = 0; }

  const basket = Math.max(1, 200 * Math.max(0.01, prices.grain) + 12 * Math.max(0.01, prices.textiles));
  const incomePerCapita = new Array(STRATA.length).fill(0);
  const wagePerWorker = new Array(STRATA.length).fill(0);
  const sol = new Array(STRATA.length).fill(0);
  const wageBillByBuilding: Partial<Record<Building, number>> = {};
  for (const [building, units] of Object.entries(buildingWageUnits) as [Building, number][]) {
    wageBillByBuilding[building] = wageWeightTotal > 0 ? wagePool * units / wageWeightTotal : 0;
  }
  for (let i = 0; i < STRATA.length; i++) {
    const wageIncome = wageWeightTotal > 0 ? wagePool * wageWeights[i] / wageWeightTotal : 0;
    const ownerIncome = ownerWeightTotal > 0 ? ownerPool * ownerWeights[i] / ownerWeightTotal : 0;
    const householdIncome = wageIncome + ownerIncome;
    if (classPopulation[i] > 0) incomePerCapita[i] = householdIncome / classPopulation[i];
    if (employed[i] > 0) wagePerWorker[i] = wageIncome / employed[i];

    const labourShare = i === S.slaves ? 0.45 : 0.72;
    const needCost = basket * POP_NEEDS_MULTIPLIER[i];
    const afterTax = incomePerCapita[i] * (1 - clamp(taxRate, 0, 0.9));
    const ratio = (afterTax * labourShare) / (needCost * 2);
    const raw = 0.5 + 0.33 * Math.log(Math.max(1e-3, ratio));
    const serfPenalty = laborLaw === 'serfdom' && (i === S.peasants || i === S.laborers) ? 0.05 : 0;
    sol[i] = clamp(raw - clamp(famine, 0, 1) * 0.6 - serfPenalty, 0, 1);
  }
  return { employed, incomePerCapita, wagePerWorker, sol, wageBillByBuilding };
}

export function computeEconomy(st: GameState, calibrate = false, iter = 0): void {
  const d = data();
  const inventoryLedger = st.inventoryLedger ?? emptyInventoryLedger();
  st.inventoryLedger = inventoryLedger;
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
    const factoryInputs: Partial<Record<Good, Partial<Record<Good, number>>>> = {};
    const employment = new Array(STRATA.length).fill(0);
    const employedByBuilding: Partial<Record<Building, number>> = {};
    const buildingFlows: Partial<Record<Building, BuildingFlow>> = {};
    const flowFor = (building: Building): BuildingFlow => (
      buildingFlows[building] ??= { outputs: {}, inputs: {}, workerMix: {} }
    );
    // Every cohort has a finite labour pool. Allocate it once instead of allowing the
    // same labourers to be counted simultaneously by farms, plantations, mines and logging.
    employment[S.peasants] = LF * sh[S.peasants];
    let laborersAvailable = LF * sh[S.laborers];
    const farmLaborers = Math.min(laborersAvailable, LF * sh[S.laborers] * 0.3);
    laborersAvailable -= farmLaborers;
    employment[S.laborers] += farmLaborers;
    // agriculture
    const terr = TERRAIN_AGRI[r.terrain] ?? 0.8;
    const agriWorkers = employment[S.peasants] + farmLaborers;
    const grain = agriWorkers * 650 * terr * (1 + (r.res.includes('grain') ? 0.15 : 0) + (r.res.includes('live') ? 0.05 : 0)) * (1 + techEffect(c, 'farm_efficiency')) * infra * A * dev * blight * occupied;
    supply.grain += grain;
    // Plantation slaves cannot freely choose another employer; the remaining laborer
    // positions compete with mines and logging camps for the same finite workforce.
    const plantCap = r.buildings.plantation * LEVEL_WORKERS;
    const plantationTarget = plantCap * employmentTarget(r, 'plantation');
    const slavePool = LF * sh[S.slaves];
    const plantationSlaves = Math.min(plantationTarget, slavePool);
    const laborerJobs: LaborMarketJob[] = [
      {
        building: 'plantation',
        workersWanted: Math.min(Math.max(0, plantationTarget - plantationSlaves), LF * sh[S.laborers] * 0.25),
        attractiveness: laborAttractiveness(r, 'plantation'),
      },
      {
        building: 'mine',
        workersWanted: Math.min(r.buildings.mine * LEVEL_WORKERS * employmentTarget(r, 'mine'), LF * sh[S.laborers] * 0.6),
        attractiveness: laborAttractiveness(r, 'mine'),
      },
      {
        building: 'logging',
        workersWanted: Math.min(r.buildings.logging * LEVEL_WORKERS * employmentTarget(r, 'logging'), LF * sh[S.laborers] * 0.4),
        attractiveness: laborAttractiveness(r, 'logging'),
      },
    ];
    const laborerAllocation = allocateCompetingWorkers(laborersAvailable, laborerJobs);
    const plantationLaborers = laborerAllocation.plantation ?? 0;
    const mineWorkers = laborerAllocation.mine ?? 0;
    const logWorkers = laborerAllocation.logging ?? 0;
    const usedLaborers = plantationLaborers + mineWorkers + logWorkers;
    laborersAvailable = Math.max(0, laborersAvailable - usedLaborers);
    employment[S.laborers] += usedLaborers;

    const plantWorkers = plantationSlaves + plantationLaborers;
    employedByBuilding.plantation = plantWorkers;
    employment[S.slaves] += plantationSlaves;
    if (plantWorkers > 0) {
      const kinds: Good[] = []; if (r.res.includes('cott')) kinds.push('cotton'); if (r.res.includes('opium')) kinds.push('opium'); if (r.res.includes('cash')) kinds.push('cash_crops');
      if (!kinds.length) kinds.push('cash_crops');
      const flow = flowFor('plantation');
      flow.workerMix[S.slaves] = plantationSlaves;
      flow.workerMix[S.laborers] = plantationLaborers;
      for (const k of kinds) {
        const output = (plantWorkers * 900 * A * infra * dev * occupied) / kinds.length;
        supply[k] += output;
        addFlowAmount(flow.outputs, k, output);
      }
    }
    // Slaves outside plantations work the fields and remain in the agricultural ledger.
    const slaveFieldWorkers = Math.max(0, slavePool - plantationSlaves);
    employment[S.slaves] += slaveFieldWorkers;
    supply.grain += slaveFieldWorkers * 500 * terr * A * dev;

    // Mines and logging compete with plantations for available laborers.
    employedByBuilding.mine = mineWorkers;
    if (mineWorkers > 0) {
      const kinds: Good[] = []; if (r.res.includes('coal')) kinds.push('coal'); if (r.res.includes('iron')) kinds.push('iron'); if (r.res.includes('gold') || r.res.includes('silv')) kinds.push('luxury');
      if (!kinds.length) kinds.push('iron');
      const flow = flowFor('mine');
      flow.workerMix[S.laborers] = mineWorkers;
      for (const k of kinds) {
        const output = (mineWorkers * 900 * (1 + techEffect(c, 'mine_efficiency')) * A * infra * dev * occupied) / kinds.length;
        supply[k] += output;
        addFlowAmount(flow.outputs, k, output);
      }
    }
    employedByBuilding.logging = logWorkers;
    if (logWorkers > 0) {
      const flow = flowFor('logging');
      flow.workerMix[S.laborers] = logWorkers;
      const output = logWorkers * 900 * A * dev * occupied;
      supply.timber += output;
      addFlowAmount(flow.outputs, 'timber', output);
    }
    supply.timber += LF * sh[S.peasants] * 15 * A; // farm-side timber
    // Factories recruit from one shared worker pool. Profitability from last month
    // influences job attractiveness; the allocation still respects each building's capacity.
    const factoryJobs = (Object.keys(RECIPES) as Building[]).map((building) => ({
      building,
      workersWanted: r.buildings[building] * LEVEL_WORKERS * employmentTarget(r, building),
      attractiveness: laborAttractiveness(r, building),
    }));
    const factoryAllocation = allocateCompetingWorkers(LF * sh[S.workers], factoryJobs);
    const facEff = 1 + techEffect(c, 'factory_efficiency');
    for (const b of Object.keys(RECIPES) as Building[]) {
      const rec = RECIPES[b]!;
      const w = factoryAllocation[b] ?? 0;
      employedByBuilding[b] = w;
      employment[S.workers] += w;
      if (w <= 0) continue;
      const eff = facEff * (1 + (b === 'textile_mill' ? techEffect(c, 'textile_efficiency') : b === 'ironworks' ? techEffect(c, 'iron_efficiency') + techEffect(c, 'steel_efficiency') : b === 'arms_works' ? techEffect(c, 'arms_efficiency') : 0));
      const method = productionMethodFor(c, r, b);
      const out = w * rec.perWorker * (method?.outputMultiplier ?? 1) * eff * Am * infra * dev * occupied;
      factoryOut[rec.out] += out;
      const flow = flowFor(b);
      flow.workerMix[S.workers] = w;
      addFlowAmount(flow.outputs, rec.out, out);
      // Track inputs per building and by output good; shortages remain sector-specific.
      const outputInputs = (factoryInputs[rec.out] ??= {});
      for (const [g, q] of Object.entries(rec.inputs)) {
        const need = out * (q as number);
        inputsNeed[g as Good] += need;
        outputInputs[g as Good] = (outputInputs[g as Good] ?? 0) + need;
        addFlowAmount(flow.inputs, g as Good, need);
      }
      for (const [g, q] of Object.entries(method?.additionalInputs ?? {})) {
        const need = out * (q as number);
        inputsNeed[g as Good] += need;
        outputInputs[g as Good] = (outputInputs[g as Good] ?? 0) + need;
        addFlowAmount(flow.inputs, g as Good, need);
      }
    }
    // artisans (cottage industry)
    const artisanWorkers = LF * sh[S.artisans];
    employment[S.artisans] = artisanWorkers;
    const art = artisanWorkers * 700 * Am * dev * occupied;
    supply.textiles += art * 0.55; supply.tools += art * 0.25; supply.luxury += art * 0.2;
    // Middle strata and clergy staff the service economy; upper strata participate as owners.
    employment[S.middle] = LF * sh[S.middle];
    employment[S.clergy] = LF * sh[S.clergy];
    const svc = LF * (sh[S.middle] + sh[S.capitalists] + sh[S.aristocrats] + sh[S.clergy]) * 1600 * Am * infra * occupied;
    // demand
    const wealth = Math.max(0.3, (r.output > 0 ? (r.output * 12) / Math.max(1, r.pop) : 600 * c.productivity) / 600);
    // Use last month's cohort incomes as current buy-order power. On first load / first
    // calibration pass, fall back to the legacy regional wealth curve without a save migration.
    const householdDemand = populationConsumptionDemand(r.pop, sh, r.popEconomy?.incomePerCapita, c.id, wealth);
    const grainNeed = householdDemand.grain;
    demand.grain += householdDemand.grain;
    demand.textiles += householdDemand.textiles;
    demand.cash_crops += householdDemand.cash_crops;
    demand.luxury += householdDemand.luxury;
    demand.coal += householdDemand.coal;
    demand.opium += householdDemand.opium;
    demand.tools += agriWorkers * 2 + (LF * sh[S.workers]) * 8 + mineWorkers * 6;
    for (const g of GOODS) { supply[g] += factoryOut[g]; demand[g] += inputsNeed[g]; }
    calc[i] = { supply, demand, services: svc, inputsNeed, factoryOut, factoryInputs, employment, employedByBuilding, buildingFlows, grainLocal: grain, grainNeed };
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
  const marketExportCapacity: Record<string, Record<Good, number>> = {};
  for (const id of mIds) {
    const m = markets[id];
    const exportCapacity = zero();
    for (const g of GOODS) {
      // Legacy supply/demand are annualized flows; ledger balances are monthly physical units.
      const openingStock = inventoryLedger.balances[id]?.[g] ?? 0;
      const uncoveredDemand = Math.max(0, m.dm[g] - m.s[g] - openingStock * 12);
      const exportableFlow = Math.max(0, m.s[g] - m.dm[g]);
      world[g].surplus += exportableFlow * m.open;
      world[g].deficit += uncoveredDemand * m.open;
      exportCapacity[g] = exportableFlow * m.open;
    }
    marketExportCapacity[id] = exportCapacity;
  }
  for (const g of GOODS) {
    const ws = world[g];
    const target = clamp(Math.pow((ws.deficit + 1) / (ws.surplus + 1), 0.25), 0.6, 2.2);
    st.worldPrices[g] = st.worldPrices[g] * 0.8 + target * 0.2;
  }
  const marketShort: Record<string, Record<Good, number>> = {};
  const marketImports: Record<string, number> = {};
  const inventoryMarkets: Record<string, Partial<Record<Good, ReturnType<typeof settleInventoryFlow>>>> = {};
  for (const id of mIds) {
    const m = markets[id]; const prices = (st.marketPrices[id] ??= { ...st.worldPrices });
    const short = zero(); let importsValue = 0;
    const stats = ((st.marketStats ??= {})[id] = {} as Record<Good, MarketGoodStats>);
    const marketJournal: Partial<Record<Good, ReturnType<typeof settleInventoryFlow>>> = {};
    for (const g of GOODS) {
      const ws = world[g];
      const openingStock = inventoryLedger.balances[id]?.[g] ?? 0;
      const availRatio = ws.deficit > 0 ? clamp(ws.surplus / ws.deficit, 0, 1) : 1;
      const deficit = Math.max(0, m.dm[g] - m.s[g] - openingStock * 12);
      const imports = deficit * m.open * availRatio;
      // Imports and exports are matched globally; a market cannot receive goods without
      // an equal physical outflow from markets with exportable production surplus.
      const totalWorldImports = Math.min(ws.surplus, ws.deficit);
      const exportCapacity = marketExportCapacity[id][g];
      const exports = ws.surplus > 0 ? totalWorldImports * exportCapacity / ws.surplus : 0;
      const flow = settleInventoryFlow({
        openingStock,
        production: m.s[g] / 12,
        imports: imports / 12,
        exports: exports / 12,
        demand: m.dm[g] / 12,
      });
      importsValue += imports * st.worldPrices[g];
      short[g] = flow.demand > 0 ? clamp(flow.unmetDemand / flow.demand, 0, 1) : 0;
      const availableAnnual = Math.max(0, (openingStock + flow.production + flow.imports - flow.exports) * 12);
      const local = clamp(Math.pow((m.dm[g] + 1) / (availableAnnual + 1), 0.5), 0.45, 3);
      const target = (1 - m.open) * local + m.open * st.worldPrices[g];
      prices[g] = calibrate ? target : prices[g] * 0.7 + target * 0.3;
      // MarketStats remains annualized for existing UI compatibility; inventory journal is monthly.
      stats[g] = { supply: m.s[g], demand: m.dm[g], imports, short: short[g] };
      marketJournal[g] = flow;
    }
    inventoryMarkets[id] = marketJournal;
    marketShort[id] = short; marketImports[id] = importsValue;
  }
  // The starting 1836 calibration pass is not a simulated month. Begin recording only
  // after the first logical month has actually advanced; repeated same-tick posting is rejected.
  if (!calibrate && st.tick > 0) {
    const period = inventoryPeriod(st.tick, st.date, inventoryLedger.openingBasis, inventoryMarkets);
    st.inventoryLedger = appendInventoryLedgerMonth(inventoryLedger, period);
  }

  // ---- 3. value added, food security, SoL per region; country GDP
  const gdp: Record<string, number> = {};
  for (let i = 0; i < st.regions.length; i++) {
    const r = st.regions[i]; const c = st.countries[r.owner]; const k = calc[i]; if (!c || !k) continue;
    const mk = marketOf(st, c); const p = st.marketPrices[mk]; const short = marketShort[mk];
    const Av = Math.pow(c.productivity, 0.45);
    let value = k.services * Math.pow(c.productivity, 0.5);
    const factoryInputsUsed = zero();
    for (const g of GOODS) {
      let out = k.supply[g] - k.factoryOut[g];
      // Limit each factory output only by the goods in its own recipe.
      if (k.factoryOut[g] > 0) {
        const recipeInputs = k.factoryInputs[g] ?? {};
        const fulfilled = factoryInputFulfillment(recipeInputs, short);
        out += k.factoryOut[g] * fulfilled;
        for (const input of GOODS) {
          factoryInputsUsed[input] += (recipeInputs[input] ?? 0) * fulfilled;
        }
      }
      value += out * p[g] * Av;
    }
    // Charge factories for inputs actually consumed by the output they can produce.
    for (const g of GOODS) value -= factoryInputsUsed[g] * p[g] * Av;
    r.output = Math.max(0, value) / 12;
    gdp[r.owner] = (gdp[r.owner] ?? 0) + value;
    // food security: market shortage plus local deficit where transport access is poor
    const access = clamp(0.25 + 0.12 * Math.min(5, r.buildings.railway) + (r.coastal ? 0.35 : 0) + 0.3 * openness(c, r.coastal), 0, 1);
    const localDef = Math.max(0, 1 - k.grainLocal / Math.max(1, k.grainNeed));
    const famine = clamp(short.grain + localDef * (1 - access) * 0.9 - (c.budget.health * 0.5), 0, 1);
    // Convert value added into cohort wages and owner income. Each stratum gets its own
    // job, income and needs profile, while the weighted mean stays on the established
    // demographic calibration so this feature does not rewrite 1836–1876 population history.
    const legacyGdpPc = value / Math.max(1, r.pop);
    const legacyBasket = 200 * p.grain + 12 * p.textiles;
    const legacyLaborShare = r.strata[S.slaves] > 0.3 ? 0.45 : 0.72;
    const legacyRaw = 0.5 + 0.33 * Math.log(Math.max(1e-3, (legacyGdpPc * (1 - c.taxRate) * legacyLaborShare) / (legacyBasket * 2)));
    const legacyTarget = clamp(legacyRaw - famine * 0.6 - (c.laws.labor === 'serfdom' ? 0.05 : 0), 0, 1);
    const wageOfferByBuilding: Partial<Record<Building, number>> = {};
    const buildingWorkerMix: Partial<Record<Building, Partial<Record<number, number>>>> = {};
    for (const building of PRODUCTIVE_BUILDINGS) {
      wageOfferByBuilding[building] = wageOffer(r, building);
      buildingWorkerMix[building] = k.buildingFlows[building]?.workerMix ?? {};
    }
    const cohorts = calculatePopulationEconomy(
      r.pop, r.strata, k.employment, value, p, c.taxRate, famine, c.laws.labor,
      buildingWorkerMix, wageOfferByBuilding,
    );
    const profitabilityByBuilding: Partial<Record<Building, number>> = {
      ...(r.popEconomy?.profitabilityByBuilding ?? {}),
    };
    const employmentTargetByBuilding: Partial<Record<Building, number>> = {};
    for (const building of PRODUCTIVE_BUILDINGS) {
      const previousTarget = r.popEconomy?.employmentTargetByBuilding?.[building];
      employmentTargetByBuilding[building] = Number.isFinite(previousTarget)
        ? clamp(previousTarget as number, 0.1, 1)
        : 1;
    }

    // Evaluate each firm's annual operating margin after input costs and its workers' wages.
    // The resulting target feeds next month's labor allocation, never the current month's output.
    if (!calibrate) {
      for (const building of PRODUCTIVE_BUILDINGS) {
        const flow = k.buildingFlows[building];
        const staffed = k.employedByBuilding[building] ?? 0;
        if (!flow || staffed <= 0) continue;

        const fulfillment = RECIPES[building]
          ? factoryInputFulfillment(flow.inputs, short)
          : 1;
        let revenue = 0;
        let inputCost = 0;
        for (const [good, amount] of Object.entries(flow.outputs) as [Good, number][]) {
          revenue += amount * fulfillment * p[good] * Av;
        }
        for (const [good, amount] of Object.entries(flow.inputs) as [Good, number][]) {
          inputCost += amount * fulfillment * p[good] * Av;
        }
        const payroll = Math.max(0, cohorts.wageBillByBuilding?.[building] ?? 0);
        const margin = revenue > 0
          ? clamp((revenue - inputCost - payroll) / revenue, -1, 1)
          : -1;
        profitabilityByBuilding[building] = margin;
        employmentTargetByBuilding[building] = nextEmploymentTarget(employmentTargetByBuilding[building], margin);
        const desiredWorkers = r.buildings[building] * LEVEL_WORKERS * employmentTargetByBuilding[building];
        const staffingGap = desiredWorkers > 0
          ? clamp((desiredWorkers - staffed) / desiredWorkers, 0, 1)
          : 0;
        wageOfferByBuilding[building] = nextWageOffer(wageOfferByBuilding[building], margin, staffingGap);
      }
    }
    r.popEconomy = {
      ...calibrateCohortLivingStandards(cohorts, r.strata, legacyTarget),
      employedByBuilding: k.employedByBuilding,
      profitabilityByBuilding,
      employmentTargetByBuilding,
      wageOfferByBuilding,
      wageBillByBuilding: cohorts.wageBillByBuilding,
    };
    const target = r.strata.reduce((sum, share, index) => sum + clamp(share, 0, 1) * r.popEconomy!.sol[index], 0);
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
  for (const c of Object.values(st.countries)) if (c.alive) advanceConstruction(st, c);
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
  c.finance = { tax, tariff, army: armyCost, navy: navyCost, admin: income * c.budget.admin, education: income * c.budget.education, health: income * c.budget.health, construction, interest };
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

export const MAX_CONSTRUCTION_QUEUE = 20;

export function canQueueConstruction(st: GameState, c: Country, r: Region, b: Building): boolean {
  if (c.constructionQueue.length >= MAX_CONSTRUCTION_QUEUE || !canBuild(st, c, r, b)) return false;
  if (b === 'railway') {
    const queued = c.constructionQueue.filter((p) => p.region === r.id && p.building === 'railway').length;
    if (r.buildings.railway + queued >= 5) return false;
  }
  return true;
}

/** Queue a public project. Funds are charged gradually from the monthly construction allocation. */
export function queueConstruction(st: GameState, c: Country, r: Region, b: Building): boolean {
  if (!canQueueConstruction(st, c, r, b)) return false;
  c.constructionQueue.push({ id: `construction-${st.nextId++}`, region: r.id, building: b, cost: buildCost(c, b, st), progress: 0, queuedAt: st.tick });
  return true;
}

export function cancelConstruction(c: Country, projectId: string): boolean {
  const index = c.constructionQueue.findIndex((p) => p.id === projectId);
  if (index < 0) return false;
  const [project] = c.constructionQueue.splice(index, 1);
  (c as any).statePool = ((c as any).statePool ?? 0) + project.progress;
  return true;
}

/** Advances one project per country each month, bounded by this month's budget contribution. */
export function advanceConstruction(st: GameState, c: Country): void {
  const project = c.constructionQueue[0];
  if (!project) return;
  const region = st.regions.find((r) => r.id === project.region);
  if (!region || region.owner !== c.id) {
    (c as any).statePool = ((c as any).statePool ?? 0) + project.progress;
    c.constructionQueue.shift();
    log(st, { type: 'economy', text: `Construction in ${project.region} cancelled after territory loss.`, textVi: `Dự án tại ${project.region} bị hủy do mất lãnh thổ; phần vốn đã chi được hoàn lại.`, actors: [c.id] });
    return;
  }
  if (region.controller !== c.id || !canBuild(st, c, region, project.building)) return;
  const pool = (c as any).statePool ?? 0;
  const capacity = Math.max(0, c.finance?.construction ?? 0);
  const spend = Math.min(pool, capacity, Math.max(0, project.cost - project.progress));
  if (!(spend > 0)) return;
  (c as any).statePool = pool - spend;
  project.progress = Math.min(project.cost, project.progress + spend);
  if (project.progress + 1e-6 < project.cost) return;
  region.buildings[project.building] += 1;
  c.constructionQueue.shift();
  log(st, { type: 'economy', text: `${c.name} completes ${project.building} in ${project.region}.`, textVi: `${c.nameVi} hoàn thành ${project.building} tại ${project.region}.`, actors: [c.id] });
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
  const extractive = b === 'mine' || b === 'logging' || b === 'plantation';
  const labour = r.pop * 0.45 * (extractive ? r.strata[S.laborers] + r.strata[S.peasants] * 0.3 + r.strata[S.slaves] : r.strata[S.workers] + r.strata[S.peasants] * 0.2 + r.strata[S.artisans] * 0.5);
  const competitors: Building[] = extractive
    ? ['mine', 'plantation', 'logging']
    : (Object.keys(RECIPES) as Building[]);
  // Capacity already expected to be idle or staffed only to each firm's current hiring target.
  const used = competitors.reduce(
    (sum, building) => sum + Math.max(0, r.buildings[building]) * LEVEL_WORKERS * employmentTarget(r, building),
    0,
  );
  if (b !== 'railway' && b !== 'university' && labour - used < LEVEL_WORKERS * 0.5) return 0;

  // A candidate in a currently loss-making industry should not be valued as if it
  // could instantly fill every job. New levels inherit the regional firm's hiring outlook.
  const plannedWorkers = LEVEL_WORKERS * employmentTarget(r, b);
  let value = 0;
  if (b === 'railway') value = (r.output * 12) * 0.05 + 2e5;
  else if (b === 'university') value = 0;
  else if (RECIPES[b]) {
    const rec = RECIPES[b]!;
    const method = productionMethodFor(c, r, b);
    const out = plannedWorkers * rec.perWorker * (method?.outputMultiplier ?? 1) * A;
    value = out * p[rec.out]
      - Object.entries(rec.inputs).reduce((sum, [good, quantity]) => sum + out * (quantity as number) * p[good as Good], 0)
      - Object.entries(method?.additionalInputs ?? {}).reduce((sum, [good, quantity]) => sum + out * (quantity as number) * p[good as Good], 0)
      - plannedWorkers * 650 * A * p.grain * 0.5 * wageOffer(r, b);
  } else {
    const good: Good = b === 'mine'
      ? (r.res.includes('coal') ? 'coal' : r.res.includes('iron') ? 'iron' : 'luxury')
      : b === 'logging'
        ? 'timber'
        : r.res.includes('cott')
          ? 'cotton'
          : r.res.includes('opium')
            ? 'opium'
            : 'cash_crops';
    value = plannedWorkers * 900 * A * p[good] - plannedWorkers * 650 * A * p.grain * 0.6 * wageOffer(r, b);
  }
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
