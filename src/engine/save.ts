// Save/load compatibility. Version 1 contained regional POP aggregates only.
// Version 2 adds a deterministic, explicitly estimated cohort projection.
// Version 3 (CLOCK-01) adds the hourly-canonical clock `state.clock.hour` and an optional,
// non-simulation `clockPreference` (AUTO / fixed pace) in the envelope.
import { STRATA, type GameState } from './types';
import { createPopulationState, validatePopulationState } from './systems/populationCohorts';
import { hourToDateTime, isValidCampaignHour, monthIndexOfHour, monthStartHour, CAMPAIGN_FINAL_HOUR } from './clock/calendar';
import { parseSpeedSetting, type SpeedSetting } from './clock/pace';
import { ENGINE_VERSION } from './version';
import { data } from './data/db';

export const SAVE_FORMAT = 'currents-of-history-save';
export const SAVE_SCHEMA_VERSION = 3;

/** Optional envelope metadata that is not part of the deterministic GameState. */
export interface SaveMeta {
  clockPreference?: SpeedSetting;
  /** SAVE-01 diagnostics (absent in saves written before SAVE-01). */
  engineVersion?: string;
  dataFingerprint?: string;
  savedAtHour?: number;
}

function fnv1a(str: string, seed: number): number {
  let h = seed >>> 0;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}

let cachedFingerprint: { db: unknown; value: string } | null = null;
/**
 * Structural fingerprint of the loaded world data: the ordered region, entity and technology IDs a
 * save's indices depend on. It is not a full content hash; it detects the incompatible case where a
 * save refers to a different world layout. Returns undefined when no data is loaded.
 */
export function worldDataFingerprint(): string | undefined {
  let d;
  try { d = data(); } catch { return undefined; }
  if (cachedFingerprint?.db === d.db) return cachedFingerprint.value;
  const parts = [
    'regions:' + d.db.regions.map((r) => r.id).join(','),
    'entities:' + d.db.entities.map((e) => e.id).join(','),
    'techs:' + d.db.technologies.map((t) => t.id).join(','),
  ].join('|');
  const value = `fp1-${fnv1a(parts, 0x811c9dc5).toString(16).padStart(8, '0')}${fnv1a(parts, 0x9e3779b9).toString(16).padStart(8, '0')}-${d.db.regions.length}r`;
  cachedFingerprint = { db: d.db, value };
  return value;
}

/** IND-02a: site operating records must be finite and in range; never repaired silently. */
export function validateIndustryState(st: GameState): void {
  const ind = (st as { industry?: unknown }).industry;
  if (!ind || typeof ind !== 'object' || Array.isArray(ind)) throw new Error('Save state has an invalid industry record');
  for (const [key, ops] of Object.entries(ind as Record<string, unknown>)) {
    const o = ops as Record<string, unknown> | null;
    const okNum = (v: unknown, min = 0) => typeof v === 'number' && Number.isFinite(v) && v >= min;
    if (!o || typeof o !== 'object' || !/^[^|]+\|[a-z_]+$/.test(key) ||
        !okNum(o.util) || (o.util as number) > 1 || !okNum(o.reserves) || !okNum(o.lossStreak) || !okNum(o.gainStreak) ||
        !okNum(o.idleMonths) || !okNum(o.revenue) || !okNum(o.cost)) {
      throw new Error(`Invalid industry site record ${key}`);
    }
  }
}

/** SAVE-01 / B4-R1: the RNG state must be four uint32 words, not all zero; missing RNG fails closed. */
export function validateRngState(st: GameState): void {
  const rng = (st as { rng?: unknown }).rng;
  if (!Array.isArray(rng) || rng.length !== 4 || !rng.every((x) => Number.isInteger(x) && x >= 0 && x <= 0xffffffff)) {
    throw new Error('Save state has a missing or invalid RNG state');
  }
  if (rng.every((x) => x === 0)) throw new Error('Save state has a degenerate all-zero RNG state');
  if (!Number.isFinite(st.seed)) throw new Error('Save state has an invalid seed');
}

/** Validates the canonical clock against the month tick and date; never repairs silently. */
export function validateClockState(st: GameState): void {
  const clock = st.clock as unknown;
  if (!clock || typeof clock !== 'object' || Array.isArray(clock)) throw new Error('Save state is missing its canonical clock');
  const hour = (clock as { hour?: unknown }).hour;
  if (!isValidCampaignHour(hour)) throw new Error(`Invalid canonical clock hour ${String(hour)}`);
  if (!Number.isSafeInteger(st.tick) || monthIndexOfHour(hour) !== st.tick) throw new Error('Canonical clock hour does not match the saved month tick');
  const dt = hourToDateTime(hour);
  if (!st.date || st.date.y !== dt.y || st.date.m !== dt.m) throw new Error('Canonical clock hour does not match the saved date');
}

/**
 * CG18-02: the canonical runtime contract of a GameState. Used for every save written, every save
 * loaded (after migration) and every snapshot a simulation worker sends to the UI, so there is one
 * schema guard rather than several partial ones. Checks every required top-level field, the critical
 * nested records (date, regions, countries, log), and runs the population, clock, RNG and industry
 * validators. Never repairs: throws on the first violation.
 */
export function validateGameStateContract(value: unknown): asserts value is GameState {
  const fail = (what: string): never => { throw new Error(`Invalid game state: ${what}`); };
  const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
  const fin = (v: unknown) => typeof v === 'number' && Number.isFinite(v);
  if (!isObj(value)) fail('not an object');
  const st = value as Record<string, unknown>;
  if (st.version !== SAVE_SCHEMA_VERSION) fail(`schema version ${String(st.version)}`);
  if (!Array.isArray(st.regions)) fail('regions');
  // Domain validators first so their specific messages are reported.
  const gs = value as GameState;
  validatePopulationState(gs);
  validateClockState(gs);
  validateRngState(gs);
  validateIndustryState(gs);
  if (st.mode !== 'historical' && st.mode !== 'sandbox') fail('mode');
  if (st.player !== null && typeof st.player !== 'string') fail('player');
  if (!Number.isSafeInteger(st.nextId) || (st.nextId as number) < 0) fail('nextId');
  const date = st.date;
  if (!isObj(date) || !Number.isSafeInteger(date.y) || !Number.isInteger(date.m) || (date.m as number) < 1 || (date.m as number) > 12) fail('date');
  for (const k of ['countries', 'relations', 'worldPrices', 'marketPrices', 'marketStats', 'industry', 'history', 'divergence', 'counters'] as const) if (!isObj(st[k])) fail(k);
  for (const k of ['regions', 'wars', 'treaties', 'rivalries', 'constructionProjects', 'log', 'territoryLog', 'firedEvents', 'pendingPlayerDecisions'] as const) if (!Array.isArray(st[k])) fail(k);
  const regions = st.regions as unknown[];
  if (regions.length === 0) fail('no regions');
  for (const r of regions) {
    if (!isObj(r) || typeof r.id !== 'string' || typeof r.owner !== 'string' || typeof r.controller !== 'string' || !fin(r.pop) || (r.pop as number) < 0 ||
        !Array.isArray(r.strata) || r.strata.length !== STRATA.length || !r.strata.every(fin) || !isObj(r.buildings)) fail(`region ${isObj(r) ? String(r.id) : '?'}`);
  }
  const countries = st.countries as Record<string, unknown>;
  if (Object.keys(countries).length === 0) fail('no countries');
  for (const [id, c] of Object.entries(countries)) {
    if (!isObj(c) || c.id !== id || typeof c.alive !== 'boolean' || !isObj(c.laws) || !fin(c.treasury) || !fin(c.productivity)) fail(`country ${id}`);
  }
  for (const e of st.log as unknown[]) if (!isObj(e) || typeof e.text !== 'string') fail('log entry');
  for (const [k, v] of Object.entries(st.worldPrices as Record<string, unknown>)) if (!fin(v)) fail(`world price ${k}`);
}

export function serialize(st: GameState, meta: SaveMeta = {}): string {
  if (st.version !== SAVE_SCHEMA_VERSION) {
    throw new Error(`Cannot serialize save schema ${st.version}; expected ${SAVE_SCHEMA_VERSION}`);
  }
  validateGameStateContract(st);
  const envelope: Record<string, unknown> = {
    format: SAVE_FORMAT,
    version: SAVE_SCHEMA_VERSION,
    savedAt: `${st.date.y}-${String(st.date.m).padStart(2, '0')}`,
    savedAtHour: st.clock.hour,
    engineVersion: ENGINE_VERSION,
  };
  const fingerprint = worldDataFingerprint();
  if (fingerprint) envelope.dataFingerprint = fingerprint;
  if (meta.clockPreference) envelope.clockPreference = parseSpeedSetting(meta.clockPreference);
  envelope.state = st;
  return JSON.stringify(envelope);
}

function normalizeLegacyFields(st: GameState): void {
  st.marketStats ??= {};
  st.constructionProjects ??= [];
  // IND-02a: saves written before site operations existed start with every site fully operating.
  st.industry ??= {};
  for (const country of Object.values(st.countries ?? {})) {
    country.statePool ??= 0;
    country.privatePool ??= 0;
  }
  if (!Array.isArray(st.regions)) throw new Error('Invalid region list');
  for (const region of st.regions) {
    if (!region || typeof region !== 'object' || Array.isArray(region)) {
      throw new Error('Invalid region record');
    }
    region.employment ??= new Array(STRATA.length).fill(0);
    region.wages ??= new Array(STRATA.length).fill(0);
  }
}

/** Pure v1 → v2 migration: no RNG, clock, filesystem, network or external data access. */
function migrateV1ToV2(legacy: GameState): GameState {
  const st = legacy;
  normalizeLegacyFields(st);
  st.population = createPopulationState(st.regions);
  st.version = 2;
  validatePopulationState(st);
  return st;
}

/**
 * Pure v2 → v3 migration. Monthly saves were always taken at a monthly boundary (the state after
 * that month's systems ran), so the canonical hour is that month's start instant. No RNG is
 * consumed and no simulation runs; the continuation is identical to the monthly runtime's.
 */
function migrateV2ToV3(legacy: GameState): GameState {
  const st = legacy;
  if (!Number.isSafeInteger(st.tick) || st.tick < 0) throw new Error('Invalid saved month tick');
  const hour = monthStartHour(st.tick);
  if (hour > CAMPAIGN_FINAL_HOUR) throw new Error('Saved month tick is outside the campaign');
  const existing = (st as { clock?: { hour?: unknown } }).clock;
  if (existing !== undefined && existing?.hour !== hour) throw new Error('Legacy save carries an inconsistent clock field');
  st.clock = { hour };
  st.version = SAVE_SCHEMA_VERSION;
  validateClockState(st);
  return st;
}

export function deserialize(text: string): GameState {
  return deserializeWithMeta(text).state;
}

/** Deserializes a save and returns the (validated) GameState plus non-simulation envelope metadata. */
export function deserializeWithMeta(text: string): { state: GameState; meta: SaveMeta } {
  const parsed: unknown = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Save envelope is missing or invalid');
  }
  const envelope = parsed as {
    format?: string;
    version?: number;
    state?: GameState;
    clockPreference?: unknown;
    engineVersion?: unknown;
    dataFingerprint?: unknown;
    savedAtHour?: unknown;
  };
  if (envelope.format !== SAVE_FORMAT) throw new Error('Not a save file of this game');

  if (envelope.version !== 1 && envelope.version !== 2 && envelope.version !== SAVE_SCHEMA_VERSION) {
    throw new Error(`Unsupported save version ${envelope.version}`);
  }

  // Reject a missing/malformed state and envelope/state version mismatch before migration.
  const rawState = envelope.state;
  if (!rawState || typeof rawState !== 'object' || Array.isArray(rawState)) {
    throw new Error('Save state is missing or invalid');
  }
  const st = rawState as GameState;
  if (st.version !== envelope.version) throw new Error('Save envelope/state version mismatch');
  normalizeLegacyFields(st);

  // An unreadable pace preference is not simulation state: fall back to AUTO rather than reject.
  const meta: SaveMeta = envelope.clockPreference === undefined ? {} : { clockPreference: parseSpeedSetting(envelope.clockPreference) };
  if (typeof envelope.engineVersion === 'string') meta.engineVersion = envelope.engineVersion;
  if (envelope.dataFingerprint !== undefined) {
    if (typeof envelope.dataFingerprint !== 'string') throw new Error('Save envelope has an invalid data fingerprint');
    const current = worldDataFingerprint();
    if (current && current !== envelope.dataFingerprint) {
      throw new Error(`Save was created with a different world data build (${envelope.dataFingerprint}; installed ${current})`);
    }
    meta.dataFingerprint = envelope.dataFingerprint;
  }
  if (typeof envelope.savedAtHour === 'number') meta.savedAtHour = envelope.savedAtHour;
  validateRngState(st);
  st.industry ??= {};
  validateIndustryState(st);

  const finish = (state: GameState) => { validateGameStateContract(state); return { state, meta }; };
  if (envelope.version === 1) return finish(migrateV2ToV3(migrateV1ToV2(st)));

  if (!st.population) throw new Error(`Save v${envelope.version} is missing its population cohort state`);
  validatePopulationState(st);
  if (envelope.version === 2) return finish(migrateV2ToV3(st));
  validateClockState(st);
  if (meta.savedAtHour !== undefined && meta.savedAtHour !== st.clock.hour) throw new Error('Save envelope hour does not match the saved canonical clock');
  return finish(st);
}
