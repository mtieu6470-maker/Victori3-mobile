// Types of the compiled Historical Database (src/generated/db.json), produced by tools/build-data.ts
// from the independent datasets in historical_data/. The simulation engine only reads this structure.

export type Quality = 'verified' | 'supported' | 'estimated' | 'uncertain' | 'missing';
export const QUALITY_ORDER: Quality[] = ['verified', 'supported', 'estimated', 'uncertain', 'missing'];

export interface SourceRef { id: string; locator?: string; upstream?: string | null }

export interface Fact<T> {
  value: T;
  quality: Quality;
  sources: SourceRef[];
  range?: [number, number];
  method?: string;
  note?: string;
  alternatives?: { value: unknown; source: string; note?: string }[];
  needs_source?: boolean;
  /** Set by the builder when the value is a gameplay fallback for missing data. */
  fallback?: boolean;
}

export type LawGroup = 'power' | 'governance' | 'economy' | 'trade' | 'labor' | 'church' | 'press' | 'education' | 'army';
export type Laws = Record<LawGroup, string>;
export const LAW_GROUPS: LawGroup[] = ['power', 'governance', 'economy', 'trade', 'labor', 'church', 'press', 'education', 'army'];

export interface Personality {
  aggression: number; expansionism: number; reformism: number; commerce: number;
  naval: number; isolationism: number; risk: number; rationale?: string;
}

export interface Condition { type: string; [k: string]: unknown }

export interface StrategicPriority {
  id: string; goal: string; target?: unknown; weight: number; window: [string, string];
  conditions?: Condition[]; rationale?: string; sources?: (string | SourceRef)[];
}

export interface LeaderRecord {
  name: string; title?: string; born?: string; died?: string; from: string; to: string;
  end: string; governance: string; after_regime_change?: boolean; note?: string; quality?: Quality;
}

export interface SectionStatus { section: string; status: 'complete' | 'partial' | 'missing'; facts: number; worst_quality: Quality | null; notes?: string }

export interface EntityRecord {
  id: string; en: string; vi: string; kind: string; tier: string; model: string;
  overlord?: string; subject_type?: string; cow?: number; capital?: string; color: string;
  hist_from?: string | null; hist_to?: string | null; note?: string;
  group?: string; // for decentralized polities: registry group
  government?: string;
  head_of_state?: Fact<{ name: string; title?: string; born?: string; since?: string } | null>;
  heir?: { name: string; born?: string } | null;
  laws?: Fact<Laws>;
  personality: Personality;
  personality_source: 'profile' | 'derived';
  priorities: StrategicPriority[];
  relations: { with: string; value: number }[];
  claims: string[];
  population: Fact<number>;
  army?: Fact<number>;
  literacy?: Fact<number>;
  industrialization?: string;
  tech_level: string;
  profile_sections: SectionStatus[];
  research_completeness: number; // 0..1
  profile: Record<string, unknown> | null; // full authored profile for UI display
}

export interface RegionRecord {
  id: string; name: string; lat: number; lon: number; owner: string; controller: string | null;
  culture: string; culture2: string | null; c2: number; religion: string; religion2: string | null; r2: number;
  terrain: string; pop: number; pop_quality: Quality; pop_group: string | null; res: string[]; note?: string;
}

export interface WarSeed {
  id: string; name: string; attackers: string[]; defenders: string[]; start: string; kind: string;
  war_goals: { by: string; type: string; target: string; regions?: string[] }[]; supporters?: Record<string, string[]>;
}

export interface AllianceSeed { id: string; type: string; members: string[]; start: string; end: string | null; defense: boolean; entente: boolean }

export interface DecisionWindow {
  id: string; entity: string; window: [string, string]; conditions: Condition[];
  options: { id: string; historical: boolean; effects: Record<string, unknown>[] }[];
  historical_weight: number; date_historical: string;
}

export interface ExogenousEvent {
  id: string; name: string; date: string; duration_months?: number; type: string; regions: string[];
  mortality?: number; yield_loss?: number; severity_by_region?: Record<string, number>; resource?: string; sandbox_analogue?: string;
}

export interface Milestone { id: string; check_date: string; tolerance_years: number; weight: number; label: string; test: Condition }

export interface TechRecord { id: string; tree: string; cost: number; historical_year: number; prereqs: string[]; effects: Record<string, number | string>; source?: string; note?: string }

/** CO-1b: a company kind unlocked by technology (CG-32). `buildings` empty = dormant until its goods exist. */
export interface CompanyKindRecord {
  id: string; sector: string; unlocked_by: string[]; buildings: string[];
  rights: { id: string; right_class: 'CHARTER' | 'LICENSE' | 'CONTRACT' | 'CAPABILITY'; active: boolean }[];
  source_ids: string[];
}

export interface HistoricalDB {
  meta: { start_date: string; built_at: string; counts: Record<string, number>; version: string };
  sources: { id: string; type: string; access: string; citation: string; url?: string }[];
  cultures: { id: string; nation: string; family: string; note?: string }[];
  religions: { id: string; family: string }[];
  entities: EntityRecord[];
  regions: RegionRecord[];
  alliances: AllianceSeed[];
  wars: WarSeed[];
  exogenous: ExogenousEvent[];
  decision_windows: DecisionWindow[];
  structural_rules: Record<string, unknown>[];
  zollverein: { union_leader: string; members_at_start: string[]; historical_accessions: { entity: string; date: string }[] };
  leaders: Record<string, LeaderRecord[]>;
  technologies: TechRecord[];
  company_kinds: CompanyKindRecord[];
  start_techs: Record<string, string[]>;
  historical_changes: { date: string; regions: string[]; to: string; event: string; partial?: boolean }[];
  equivalence: string[][];
  milestones: Milestone[];
  territorial_checkpoints: string[];
  european_powers: string[];
  benchmarks: { entity: string; field: string; date: string; value: number; quality: Quality }[];
  gdp_pc_1836: Record<string, Fact<number>>;
  coverage: {
    entities_total: number; by_tier: Record<string, number>; by_model: Record<string, number>;
    facts_by_quality: Record<Quality, number>; needs_source: string[]; gaps: { entity: string; section: string; note: string }[];
  };
}
