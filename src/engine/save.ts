// Save/load compatibility. Version 1 contained regional POP aggregates only.
// Version 2 adds a deterministic, explicitly estimated cohort projection.
import { STRATA, type GameState } from './types';
import { createPopulationState, validatePopulationState } from './systems/populationCohorts';

export const SAVE_FORMAT = 'currents-of-history-save';
export const SAVE_SCHEMA_VERSION = 2;

export function serialize(st: GameState): string {
  if (st.version !== SAVE_SCHEMA_VERSION) {
    throw new Error(`Cannot serialize save schema ${st.version}; expected ${SAVE_SCHEMA_VERSION}`);
  }
  validatePopulationState(st);
  return JSON.stringify({
    format: SAVE_FORMAT,
    version: SAVE_SCHEMA_VERSION,
    savedAt: `${st.date.y}-${String(st.date.m).padStart(2, '0')}`,
    state: st,
  });
}

function normalizeLegacyFields(st: GameState): void {
  st.marketStats ??= {};
  st.constructionProjects ??= [];
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
  st.version = SAVE_SCHEMA_VERSION;
  validatePopulationState(st);
  return st;
}

export function deserialize(text: string): GameState {
  const parsed: unknown = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Save envelope is missing or invalid');
  }
  const envelope = parsed as {
    format?: string;
    version?: number;
    state?: GameState;
  };
  if (envelope.format !== SAVE_FORMAT) throw new Error('Not a save file of this game');

  if (envelope.version !== 1 && envelope.version !== SAVE_SCHEMA_VERSION) {
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

  if (envelope.version === 1) return migrateV1ToV2(st);

  if (!st.population) throw new Error('Save v2 is missing its population cohort state');
  validatePopulationState(st);
  return st;
}
