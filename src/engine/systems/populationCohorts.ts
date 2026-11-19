import { STRATA, type GameState, type PopulationCohort, type PopulationState, type Region, type Stratum } from '../types';

const UNCLASSIFIED_OCCUPATION = 'unclassified';
const UNKNOWN_QUALIFICATION = 'unknown';
const COHORT_TEMPLATE = 'region-strata-aggregate-v1';
const POPULATION_TOLERANCE = 1e-7;

function compareOrdinal(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Canonical tuple identity. Culture/religion are null until a defensible
 * cohort cross-tab exists; a region-wide label is not copied onto every class.
 */
export function populationCohortId(regionId: string, stratum: Stratum): string {
  return 'pop:v1:' + JSON.stringify([
    regionId,
    null,
    null,
    stratum,
    UNCLASSIFIED_OCCUPATION,
    UNKNOWN_QUALIFICATION,
  ]);
}

export function createPopulationState(regions: readonly Region[]): PopulationState {
  const cohorts: PopulationCohort[] = [];
  const orderedRegions = [...regions].sort((a, b) => compareOrdinal(a.id, b.id));

  for (const region of orderedRegions) {
    if (!Number.isFinite(region.pop) || region.pop < 0) {
      throw new Error(`Invalid regional population for ${region.id}`);
    }
    if (!Array.isArray(region.strata) || region.strata.length !== STRATA.length) {
      throw new Error(`Invalid stratum vector for ${region.id}`);
    }

    let shareTotal = 0;
    for (let index = 0; index < STRATA.length; index++) {
      const share = region.strata[index];
      if (!Number.isFinite(share) || share < 0) {
        throw new Error(`Invalid ${STRATA[index]} share for ${region.id}`);
      }
      shareTotal += share;
      const size = region.pop * share;
      if (size <= 0) continue;

      const stratum = STRATA[index];
      cohorts.push({
        id: populationCohortId(region.id, stratum),
        regionId: region.id,
        cultureId: null,
        religionId: null,
        stratum,
        occupationId: UNCLASSIFIED_OCCUPATION,
        qualificationId: UNKNOWN_QUALIFICATION,
        size,
        literacy: null,
        radicalism: null,
        wealthPerCapita: null,
        incomePerCapita: null,
        templateId: COHORT_TEMPLATE,
      });
    }

    if (region.pop > 0 && Math.abs(shareTotal - 1) > POPULATION_TOLERANCE) {
      throw new Error(`Stratum shares for ${region.id} sum to ${shareTotal}, not 1`);
    }
  }

  cohorts.sort((a, b) => compareOrdinal(a.id, b.id));
  return {
    schemaVersion: 1,
    authority: 'region_aggregate_projection',
    method: COHORT_TEMPLATE,
    quality: 'estimated',
    cohorts,
  };
}

/** Rebuild the projection after the legacy regional population pipeline has run. */
export function refreshPopulationState(st: GameState): void {
  st.population = createPopulationState(st.regions);
}

/**
 * Fail-closed consistency check used by save/load and tests. The projection
 * must exactly represent each region total and its nine stratum shares.
 */
export function validatePopulationState(st: GameState): void {
  const population = st.population;
  if (!population || population.schemaVersion !== 1 ||
      population.authority !== 'region_aggregate_projection' ||
      population.method !== COHORT_TEMPLATE || population.quality !== 'estimated' ||
      !Array.isArray(population.cohorts)) {
    throw new Error('Invalid population cohort envelope');
  }

  const regions = new Map(st.regions.map((region) => [region.id, region]));
  const totals = new Map<string, number>();
  const strataTotals = new Map<string, number[]>();
  const seen = new Set<string>();

  for (const cohort of population.cohorts) {
    const region = regions.get(cohort.regionId);
    if (!region) throw new Error(`Population cohort references unknown region ${cohort.regionId}`);
    if (seen.has(cohort.id)) throw new Error(`Duplicate population cohort ${cohort.id}`);
    seen.add(cohort.id);

    if (!STRATA.includes(cohort.stratum) ||
        cohort.id !== populationCohortId(cohort.regionId, cohort.stratum)) {
      throw new Error(`Non-canonical population cohort identity ${cohort.id}`);
    }
    if (cohort.cultureId !== null || cohort.religionId !== null ||
        cohort.occupationId !== UNCLASSIFIED_OCCUPATION ||
        cohort.qualificationId !== UNKNOWN_QUALIFICATION ||
        cohort.templateId !== COHORT_TEMPLATE) {
      throw new Error(`Unsupported population cohort attribution in ${cohort.id}`);
    }
    if (!Number.isFinite(cohort.size) || cohort.size <= 0) {
      throw new Error(`Invalid cohort size in ${cohort.id}`);
    }
    if (cohort.ageCounts !== undefined) {
      throw new Error(`Unsupported cohort age counts in ${cohort.id}`);
    }
    if (cohort.literacy !== null || cohort.radicalism !== null ||
        cohort.wealthPerCapita !== null || cohort.incomePerCapita !== null) {
      throw new Error(`Unsupported cohort-level attribute in ${cohort.id}`);
    }

    totals.set(cohort.regionId, (totals.get(cohort.regionId) ?? 0) + cohort.size);
    const values = strataTotals.get(cohort.regionId) ?? new Array(STRATA.length).fill(0);
    values[STRATA.indexOf(cohort.stratum)] += cohort.size;
    strataTotals.set(cohort.regionId, values);
  }

  for (const region of st.regions) {
    if (!Number.isFinite(region.pop) || region.pop < 0 ||
        !Array.isArray(region.strata) || region.strata.length !== STRATA.length) {
      throw new Error(`Invalid regional POP read model for ${region.id}`);
    }
    const total = totals.get(region.id) ?? 0;
    const tolerance = Math.max(POPULATION_TOLERANCE, Math.abs(region.pop) * 1e-10);
    if (Math.abs(total - region.pop) > tolerance) {
      throw new Error(`Population cohort mass mismatch for ${region.id}: ${total} vs ${region.pop}`);
    }
    const byStratum = strataTotals.get(region.id) ?? new Array(STRATA.length).fill(0);
    for (let i = 0; i < STRATA.length; i++) {
      const expected = region.pop > 0 ? byStratum[i] / total : 0;
      const actual = region.pop > 0 ? region.strata[i] : 0;
      if (Math.abs(expected - actual) > POPULATION_TOLERANCE) {
        throw new Error(`Population cohort stratum mismatch for ${region.id}/${STRATA[i]}`);
      }
    }
  }
}
