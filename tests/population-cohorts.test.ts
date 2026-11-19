import { describe, expect, it } from 'vitest';
import { createGame } from '../src/engine/init';
import { loadNodeData } from '../src/engine/node';
import { deserialize, SAVE_FORMAT, SAVE_SCHEMA_VERSION, serialize } from '../src/engine/save';
import { createPopulationState, validatePopulationState } from '../src/engine/systems/populationCohorts';
import { stepMonth, SYSTEMS } from '../src/engine/simulation';
import type { GameState } from '../src/engine/types';

loadNodeData();

function cloneState(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state)) as GameState;
}

describe('DEV-005 — population cohort foundation', () => {
  it('bootstraps one stable, honest cohort per non-empty regional stratum', () => {
    const state = createGame({ mode: 'historical', seed: 21, player: 'GBR' });
    expect(state.version).toBe(SAVE_SCHEMA_VERSION);
    expect(state.population.authority).toBe('region_aggregate_projection');
    expect(state.population.quality).toBe('estimated');
    expect(state.population.cohorts.length).toBeGreaterThan(state.regions.length);
    expect(() => validatePopulationState(state)).not.toThrow();

    for (const region of state.regions) {
      const cohorts = state.population.cohorts.filter((cohort) => cohort.regionId === region.id);
      const size = cohorts.reduce((sum, cohort) => sum + cohort.size, 0);
      expect(size).toBeCloseTo(region.pop, 7);
      for (const cohort of cohorts) {
        expect(cohort.id.startsWith('pop:v1:')).toBe(true);
        expect(cohort.cultureId).toBeNull();
        expect(cohort.religionId).toBeNull();
        expect(cohort.occupationId).toBe('unclassified');
        expect(cohort.qualificationId).toBe('unknown');
        expect(cohort.ageCounts).toBeUndefined();
        expect(cohort.wealthPerCapita).toBeNull();
        expect(cohort.incomePerCapita).toBeNull();
      }
    }
  });

  it('normalizes tolerated stratum rounding before creating large-population cohorts', () => {
    const state = cloneState(createGame({ mode: 'historical', seed: 22, player: 'GBR' }));
    const region = state.regions[0];
    region.pop = 1_000_000_000;
    region.strata[0] += 5e-8;

    state.population = createPopulationState(state.regions);
    expect(() => serialize(state)).not.toThrow();

    const regionCohortMass = state.population.cohorts
      .filter((cohort) => cohort.regionId === region.id)
      .reduce((sum, cohort) => sum + cohort.size, 0);
    expect(Math.abs(regionCohortMass - region.pop) / region.pop).toBeLessThan(1e-12);
  });

  it('keeps the cohort projection synchronized after monthly demographic and migration updates', () => {
    const state = createGame({ mode: 'sandbox', seed: 37, player: 'GBR' });
    for (let month = 0; month < 24; month++) stepMonth(state);
    expect(() => validatePopulationState(state)).not.toThrow();

    const cohortMass = state.population.cohorts.reduce((sum, cohort) => sum + cohort.size, 0);
    const regionMass = state.regions.reduce((sum, region) => sum + region.pop, 0);
    expect(Math.abs(cohortMass - regionMass) / Math.max(1, regionMass)).toBeLessThan(1e-12);
  });

  it('refreshes cohort mass after the final monthly system mutates regional population', () => {
    const state = createGame({ mode: 'sandbox', seed: 91, player: 'GBR' });
    const originalLength = SYSTEMS.length;
    try {
      SYSTEMS.push({
        name: 'test-late-population-mutation',
        run: (current) => {
          const region = current.regions[0];
          region.pop *= 0.975;
        },
      });
      stepMonth(state);
      expect(() => validatePopulationState(state)).not.toThrow();
      const cohort = state.population.cohorts
        .filter((entry) => entry.regionId === state.regions[0].id)
        .reduce((sum, entry) => sum + entry.size, 0);
      expect(cohort).toBeCloseTo(state.regions[0].pop, 7);
    } finally {
      SYSTEMS.length = originalLength;
    }
  });

  it('migrates a v1 save deterministically without consuming RNG or changing regional aggregates', () => {
    const original = createGame({ mode: 'historical', seed: 83, player: 'GBR' });
    stepMonth(original);
    const legacy = cloneState(original) as Omit<GameState, 'population'> & { population?: GameState['population'] };
    delete legacy.population;
    legacy.version = 1;

    const beforeRng = JSON.stringify(legacy.rng);
    const beforeRegions = legacy.regions.map((region) => ({
      id: region.id,
      pop: region.pop,
      strata: [...region.strata],
      owner: region.owner,
      controller: region.controller,
    }));
    const legacyText = JSON.stringify({
      format: SAVE_FORMAT,
      version: 1,
      savedAt: '1836-02',
      state: legacy,
    });

    const restored = deserialize(legacyText);
    expect(restored.version).toBe(SAVE_SCHEMA_VERSION);
    expect(JSON.stringify(restored.rng)).toBe(beforeRng);
    expect(restored.population.cohorts.length).toBeGreaterThan(0);
    expect(restored.regions.map((region) => ({
      id: region.id,
      pop: region.pop,
      strata: region.strata,
      owner: region.owner,
      controller: region.controller,
    }))).toEqual(beforeRegions);
    expect(() => validatePopulationState(restored)).not.toThrow();

    const roundTrip = deserialize(serialize(restored));
    expect(roundTrip.population).toEqual(restored.population);
    expect(roundTrip.rng).toEqual(restored.rng);
  });

  it('rejects null region and cohort records with explicit validation errors', () => {
    const malformedRegions = [...createGame({ mode: 'historical', seed: 41, player: 'GBR' }).regions] as unknown[];
    malformedRegions[0] = null;
    expect(() => createPopulationState(malformedRegions as never)).toThrow('Invalid region record');

    const state = cloneState(createGame({ mode: 'historical', seed: 42, player: 'GBR' }));
    const malformedCohorts = state.population.cohorts as unknown[];
    malformedCohorts[0] = null;
    expect(() => validatePopulationState(state)).toThrow('Invalid population cohort record');
    expect(() => serialize(state)).toThrow('Invalid population cohort record');

    const malformedV2 = JSON.stringify({
      format: SAVE_FORMAT,
      version: SAVE_SCHEMA_VERSION,
      state,
    });
    expect(() => deserialize(malformedV2)).toThrow('Invalid population cohort record');
  });

  it('rejects legacy saves with missing or malformed regional data during migration', () => {
    const missingRegions = cloneState(createGame({ mode: 'historical', seed: 43, player: 'GBR' })) as unknown as Record<string, unknown>;
    delete missingRegions.population;
    delete missingRegions.regions;
    missingRegions.version = 1;
    const missingRegionsSave = JSON.stringify({
      format: SAVE_FORMAT,
      version: 1,
      state: missingRegions,
    });
    expect(() => deserialize(missingRegionsSave)).toThrow('Invalid region list');

    const nullRegionState = cloneState(createGame({ mode: 'historical', seed: 44, player: 'GBR' })) as unknown as Record<string, unknown>;
    delete nullRegionState.population;
    nullRegionState.version = 1;
    const regions = nullRegionState.regions as unknown[];
    regions[0] = null;
    const nullRegionSave = JSON.stringify({
      format: SAVE_FORMAT,
      version: 1,
      state: nullRegionState,
    });
    expect(() => deserialize(nullRegionSave)).toThrow('Invalid region record');
  });

  it('rejects a non-object save envelope with a clear validation error', () => {
    expect(() => deserialize('null')).toThrow('Save envelope is missing or invalid');
    expect(() => deserialize('[]')).toThrow('Save envelope is missing or invalid');
    expect(() => deserialize('42')).toThrow('Save envelope is missing or invalid');
  });

  it('rejects duplicate region identities before creating or validating cohorts', () => {
    const state = cloneState(createGame({ mode: 'historical', seed: 29, player: 'GBR' }));
    state.regions.push({ ...state.regions[0], strata: [...state.regions[0].strata] });
    expect(() => createPopulationState(state.regions)).toThrow('Duplicate region ID');
    expect(() => validatePopulationState(state)).toThrow('Duplicate region ID');
  });

  it('rejects missing or blank region identifiers', () => {
    const missingId = cloneState(createGame({ mode: 'historical', seed: 30, player: 'GBR' }));
    (missingId.regions[0] as unknown as { id: string | undefined }).id = undefined;
    expect(() => createPopulationState(missingId.regions)).toThrow('Invalid region ID');
    expect(() => validatePopulationState(missingId)).toThrow('Invalid region ID');

    const blankId = cloneState(createGame({ mode: 'historical', seed: 31, player: 'GBR' }));
    blankId.regions[0].id = '   ';
    expect(() => createPopulationState(blankId.regions)).toThrow('Invalid region ID');
  });

  it('rejects a legacy save whose embedded state version disagrees with its envelope', () => {
    const state = cloneState(createGame({ mode: 'historical', seed: 32, player: 'GBR' })) as Omit<GameState, 'population'> & { population?: GameState['population'] };
    delete state.population;
    state.version = 2;
    const malformedV1 = JSON.stringify({
      format: SAVE_FORMAT,
      version: 1,
      savedAt: '1836-01',
      state,
    });
    expect(() => deserialize(malformedV1)).toThrow('Save envelope/state version mismatch');
  });

  it('rejects non-finite, negative and non-normalized regional stratum shares', () => {
    const nanState = cloneState(createGame({ mode: 'historical', seed: 15, player: 'GBR' }));
    nanState.regions[0].strata[0] = Number.NaN;
    expect(() => serialize(nanState)).toThrow('Invalid regional stratum share');

    const negativeState = cloneState(createGame({ mode: 'historical', seed: 16, player: 'GBR' }));
    negativeState.regions[0].strata[0] = -0.01;
    expect(() => serialize(negativeState)).toThrow('Invalid regional stratum share');

    const unnormalizedState = cloneState(createGame({ mode: 'historical', seed: 17, player: 'GBR' }));
    unnormalizedState.regions[0].strata[0] += 0.05;
    expect(() => serialize(unnormalizedState)).toThrow('Regional stratum shares do not sum to 1');
  });

  it('rejects incomplete or inconsistent v2 population state rather than silently repairing it', () => {
    const state = createGame({ mode: 'sandbox', seed: 5, player: 'GBR' });
    const missing = cloneState(state) as Omit<GameState, 'population'> & { population?: GameState['population'] };
    delete missing.population;
    expect(() => deserialize(JSON.stringify({
      format: SAVE_FORMAT,
      version: SAVE_SCHEMA_VERSION,
      state: missing,
    }))).toThrow('missing its population cohort state');

    const inconsistent = cloneState(state);
    inconsistent.population.cohorts[0].size += 1;
    expect(() => serialize(inconsistent)).toThrow('Population cohort mass mismatch');
  });
});
