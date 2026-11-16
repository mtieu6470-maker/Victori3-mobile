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

export interface Region {
  id: string; owner: string; controller: string;
  pop: number; strata: number[]; culture: string; culture2: string | null; c2: number; religion: string;
  literacy: number; sol: number; unrest: number; radical: number; nationalism: number;
  buildings: Record<Building, number>;
  /** Player-selected production methods by building; absent values use the best method unlocked by technology. */
  productionMethods?: Partial<Record<Building, string>>;
  res: string[]; terrain: string; coastal: boolean; area: number;
  devastation: number; blight: { until: number; severity: number } | null; epidemic: { until: number; rate: number } | null;
  output: number; // value added last month (GBP-equivalent units)
  hiddenGold?: boolean;
}

/** supply/demand/imports in engine physical units; short = unmet share of demand (0..1). */
export interface MarketGoodStats { supply: number; demand: number; imports: number; short: number }

export interface WarSide { leader: string; members: string[] }
export interface WarGoal { by: string; type: string; target: string; regions?: string[] }
export interface War {
  id: string; name: string; kind: 'conquest' | 'civil' | 'colonial' | 'independence' | 'great';
  attackers: WarSide; defenders: WarSide; goals: WarGoal[];
  start: number; score: number; // +100 attackers win, -100 defenders win
  occupied: string[]; battles: number; exhaustion: { a: number; d: number }; historicalSeed?: boolean;
}

export interface Treaty { id: string; type: 'alliance' | 'guarantee' | 'customs_union'; members: string[]; leader?: string; start: number; source?: string }

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
