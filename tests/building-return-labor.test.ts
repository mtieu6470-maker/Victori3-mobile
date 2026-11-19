import { describe, expect, it } from 'vitest';
import { fresh } from './helpers';
import { buildingReturn } from '../src/engine/systems/economy';
import { BUILDINGS, S } from '../src/engine/types';

function isolatedRegion() {
  const st = fresh('sandbox', 914, 'GBR');
  const country = st.countries.GBR;
  const region = st.regions.find((candidate) => candidate.id === country.capital)!;
  for (const building of BUILDINGS) region.buildings[building] = 0;
  region.pop = 3_000;
  region.strata.fill(0);
  region.strata[S.peasants] = 1;
  region.res = ['coal', 'iron', 'cott', 'timb'];
  return { st, country, region };
}

describe('building return uses the labor pools available to production', () => {
  it('does not count peasants or artisans as factory workers', () => {
    const { st, country, region } = isolatedRegion();
    region.strata.fill(0);
    region.strata[S.peasants] = 0.6;
    region.strata[S.artisans] = 0.4;
    region.strata[S.workers] = 0;

    expect(buildingReturn(st, country, region, 'textile_mill')).toBe(0);
    expect(buildingReturn(st, country, region, 'ironworks')).toBe(0);
  });

  it('does not count peasants as mine or logging laborers', () => {
    const { st, country, region } = isolatedRegion();
    region.strata.fill(0);
    region.strata[S.peasants] = 1;
    region.strata[S.laborers] = 0;
    region.strata[S.slaves] = 0;

    expect(buildingReturn(st, country, region, 'mine')).toBe(0);
    expect(buildingReturn(st, country, region, 'logging')).toBe(0);
  });

  it('does not count peasants as plantation labor when there are no slaves or laborers', () => {
    const { st, country, region } = isolatedRegion();
    region.strata.fill(0);
    region.strata[S.peasants] = 1;
    region.strata[S.laborers] = 0;
    region.strata[S.slaves] = 0;

    expect(buildingReturn(st, country, region, 'plantation')).toBe(0);
  });

  it('scales a factory investment estimate by the available worker staffing ratio', () => {
    const { st, country, region } = isolatedRegion();
    region.strata.fill(0);
    region.strata[S.workers] = 0.9;
    region.strata[S.peasants] = 0.1;
    const constrainedReturn = buildingReturn(st, country, region, 'textile_mill');

    region.strata[S.workers] = 1;
    region.strata[S.peasants] = 0;
    const fullyStaffedReturn = buildingReturn(st, country, region, 'textile_mill');

    expect(constrainedReturn).toBeGreaterThan(0);
    expect(fullyStaffedReturn).toBeGreaterThan(constrainedReturn);
    expect(constrainedReturn / fullyStaffedReturn).toBeCloseTo(0.9, 2);
  });
});
