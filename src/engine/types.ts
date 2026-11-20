import type { Laws, LawGroup, Personality, Quality } from './data/dbTypes';

export type GameMode = 'historical' | 'sandbox';

export const GOODS = ['grain', 'cash_crops', 'cotton', 'timber', 'coal', 'iron', 'steel', 'textiles', 'tools', 'arms', 'luxury', 'opium'] as const;
export type Good = (typeof GOODS)[number];

export const BUILDINGS = ['plantation', 'mine', 'logging', 'textile_mill', 'ironworks', 'tool_works', 'arms_works', 'luxury_workshop', 'railway', 'university'] as const;
export type Building = (typeof BUILDINGS)[number];

/** Population strata (shares of a region's population). */
export const STRATA = ['peasants', 'slaves', 'laborers', 'artisans', 'workers', 'middle', 'clergy', 'aristocrats', 'capitalists'] as const;
export type Stratum = (typeof STRATA)[number];
export const S = Object.fromEntries(STRATA.map((s, i) => [s, i])) as Record<Stratum, number>;

export const IGS = ['landowners', 'industrialists', 'intelligentsia', 'petty_bourgeoisie', 'clergy', 'armed_forces', 'rural_folk', 'trade_unions'] as const;
export type IG = (typeof IGS)[number];

export interface GameDate { y: number; m: number } // m: 1..12

export interface Leader {
  name: string; born: number | null; since: number; historical: boolean; diesOn?: string | null; female?: boolean; termEnds?: string | null;
}

export interface Army { manpower: number; target: number; quality: number; morale: number; supply: number }
export interface Navy { strength: number; target: number; quality: number }

export interface Budget { military: number; navy: number; admin: number; education: number; health: number; construction: number }

export interface AIMemory {
  cooldowns: Record<string, number>; // key -> tick until which the action is blocked
  lawHistory: { group: LawGroup; value: string; tick: number }[];
  recent: string[]; // last actions (for oscillation detection)
  planTarget?: string | null;
}

export interface Reform { group: LawGroup; value: string; progress: number; startedTick: number }

export interface ConstructionProject {
  id: string; region: string; building: Building; cost: number; progress: number; queuedAt: number;
}

export interface Country {
  id: string; name: string; nameVi: string; color: string; kind: string; tier: string;
  alive: boolean; formedAt?: number; group?: string; decentralized: boolean;
  overlord: string | null; subjectType: string | null;
  capital: string;
  laws: Laws; reform: Reform | null; regimeChangedAt: number | null; govLabel: string;
  leader: Leader; heir: { name: string; born: number | null; female: boolean } | null;
  legitimacy: number; radicalism: number; // 0..1 share of population radical
  igs: Record<IG, { clout: number; approval: number }>;
  treasury: number; debt: number; taxRate: number; budget: Budget;
  constructionQueue: ConstructionProject[];
  gdp: number; gdpHistory?: number; income: number; expense: number; tariffIncome: number; productivity: number;
  /** Last month's budget lines (same figures that make up income and expense); absent before the first month. */
  finance?: { tax: number; tariff: number; army: number; navy: number; admin: number; education: number; health: number; construction: number; interest: number };
  techs: string[]; research: { current: string | null; progress: number };
  army: Army; navy: Navy;
  prestige: number; infamy: number; warExhaustion: number; lastWarLost: number | null;
  personality: Personality;
  ai: AIMemory;
  claims: string[];
  customsUnion: string | null;
  priorities: string[]; // ids of historical priorities (Historical Mode only uses them)
  foreignPressure: number;
  famine: number; // 0..1 food shortage share last month
  stats: { pop: number; literacy: number; sol: number; industry: number };
}

/** Population-cohort economy. Arrays follow STRATA order; values are annual GBP-equivalent units. */
export interface PopulationEconomy {
  employed: number[]; // employed people by stratum
  incomePerCapita: number[]; // household income per person, including dependents and ownership income
  wagePerWorker: number[]; // average annual wage per employed worker; zero for pure owner strata
  sol: number[]; // class standard of living, 0..1
  /** Actual staffed workers by productive building; absent in saves predating the staffing ledger. */
  employedByBuilding?: Partial<Record<Building, number>>;
  /** Last realized operating margin after estimated material and wage costs, in [-1, 1]. */
  profitabilityByBuilding?: Partial<Record<Building, number>>;
  /** Smoothed target utilization for the next hiring cycle, in [0.1, 1]. */
  employmentTargetByBuilding?: Partial<Record<Building, number>>;
  /** Smoothed firm wage offer relative to the regional base wage, in [0.75, 1.5]. */
  wageOfferByBuilding?: Partial<Record<Building, number>>;
  /** Estimated annual wage bill by staffed productive building, drawn from the fixed regional wage pool. */
  wageBillByBuilding?: Partial<Record<Building, number>>;
}

export interface Region {
  id: string; owner: string; controller: string;
  pop: number; strata: number[]; culture: string; culture2: string | null; c2: number; religion: string;
  literacy: number; sol: number; unrest: number; radical: number; nationalism: number;
  buildings: Record<Building, number>;
  /** Player-selected production methods by building; absent values use the best method unlocked by technology. */
  productionMethods?: Partial<Record<Building, string>>;
  /** Rebuilt by the monthly economy engine; absent in legacy saves until the next simulation tick. */
  popEconomy?: PopulationEconomy;
  res: string[]; terrain: string; coastal: boolean; area: number;
  devastation: number; blight: { until: number; severity: number } | null; epidemic: { until: number; rate: number } | null;
  output: number; // value added last month (GBP-equivalent units)
  hiddenGold?: boolean;
}

/** supply/demand/imports in engine physical units; short = unmet share of demand (0..1). */
export interface MarketGoodStats { supply: number; demand: number; imports: number; short: number }

/** Last deterministic market/factory clearing result; diagnostic only, not an economic input. */
export interface MarketClearingDiagnostics {
  tick: number;
  factoryCount: number;
  iterations: number;
  maxIterations: number;
  converged: boolean;
  residual: number;
  appliedFallback: 'none' | 'zero-recipe-production';
}

/** Provenance of the opening physical-stock balances in the current inventory model. */
export type InventoryOpeningBasis = 'unseeded' | 'simulated' | 'sourced';

/** Monthly physical quantities use the same canonical good units as production and demand. */
export interface InventoryMonthEntry {
  openingStock: number;
  production: number;
  imports: number;
  exports: number;
  demand: number;
  consumed: number;
  unmetDemand: number;
  closingStock: number;
}

/** One deterministic monthly ledger snapshot; markets and goods are stored by stable IDs. */
export interface InventoryLedgerMonth {
  tick: number;
  date: GameDate;
  openingBasis: InventoryOpeningBasis;
  markets: Record<string, Partial<Record<Good, InventoryMonthEntry>>>;
}

/** Current market stock balances plus a bounded recent monthly accounting journal. */
export interface InventoryLedger {
  balances: Record<string, Partial<Record<Good, number>>>;
  history: InventoryLedgerMonth[];
  openingBasis: InventoryOpeningBasis;
}

export interface WarSide { leader: string; members: string[] }
export interface WarGoal { by: string; type: string; target: string; regions?: string[] }
export interface War {
  id: string; name: string; kind: 'conquest' | 'civil' | 'colonial' | 'independence' | 'great';
  attackers: WarSide; defenders: WarSide; goals: WarGoal[];
  start: number; score: number; // +100 attackers win, -100 defenders win
  occupied: string[]; battles: number; exhaustion: { a: number; d: number }; historicalSeed?: boolean;
}

export type TreatyType =
  | 'alliance'
  | 'defensive_pact'
  | 'entente'
  | 'neutrality_pact'
  | 'non_aggression_pact'
  | 'historical_pact'
  | 'guarantee'
  | 'customs_union';

export interface TreatyTerms {
  defense?: boolean;
  entente?: boolean;
  neutrality?: boolean;
  nonaggression?: boolean;
  sourceType?: string;
}

export interface Treaty {
  id: string;
  type: TreatyType;
  members: string[];
  leader?: string;
  start: number;
  /** Absolute simulation tick when a sourced historical agreement expires. */
  end?: number | null;
  source?: string;
  terms?: TreatyTerms;
}

export interface LogEntry { tick: number; date: string; type: string; text: string; textVi?: string; actors: string[]; historical?: boolean; divergence?: boolean }

export interface TerritoryChange { tick: number; date: string; region: string; from: string; to: string; cause: string; historicalMatch: boolean | null }

export interface DivergenceState {
  milestones: Record<string, { status: 'pending' | 'achieved' | 'missed'; date?: string; credit?: number }>;
  entries: { tick: number; date: string; kind: string; text: string; actors: string[] }[];
  similarity: { date: string; territorial: number; milestones: number; combined: number }[];
}

export interface YearStat { y: number; pop: number; gdp: number; army: number; navy: number; literacy: number; power: number; regions: number; legitimacy: number }

export interface Counters { systemRuns: Record<string, number>; aiActions: Record<string, number>; aiActionsByCountry: Record<string, number>; decisionWindowsFired: number; historicalBiasApplied: number }

export interface GameState {
  version: number;
  seed: number; rng: [number, number, number, number];
  mode: GameMode;
  player: string | null;
  date: GameDate; tick: number;
  countries: Record<string, Country>;
  regions: Region[];
  wars: War[];
  treaties: Treaty[];
  relations: Record<string, number>;
  rivalries: string[]; // "A|B"
  worldPrices: Record<Good, number>;
  marketPrices: Record<string, Record<Good, number>>;
  /** Last month's market clearing per market and good (engine units; prices are indices, 1 = base price). */
  marketStats: Record<string, Record<Good, MarketGoodStats>>;
  /** Last monthly factory/market solver convergence record, added without breaking legacy saves. */
  marketClearing?: MarketClearingDiagnostics;
  /** Physical market stocks and bounded monthly inventory accounting journal. */
  inventoryLedger: InventoryLedger;
  log: LogEntry[];
  territoryLog: TerritoryChange[];
  history: Record<string, YearStat[]>;
  divergence: DivergenceState;
  counters: Counters;
  firedEvents: string[];
  pendingPlayerDecisions: { id: string; windowId: string; options: { id: string; historical: boolean }[] }[];
  nextId: number;
}

export interface Quality_ { q: Quality }
