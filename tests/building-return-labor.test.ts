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
  it('splits mine returns across every resource produced in the region', () => {
    const simulate = (resources: string[]) => {
      const { st, country, region } = isolatedRegion();
      region.pop = 30_000;
      region.strata.fill(0);
      region.strata[S.laborers] = 0.8;
      region.strata[S.peasants] = 0.2;
      region.res = resources as typeof region.res;
      const prices = { ...st.worldPrices, coal: 2, iron: 0.5, grain: 0, tools: 1, steel: 1 };
      st.worldPrices = prices;
      st.marketPrices.GBR = { ...prices };
      return buildingReturn(st, country, region, 'mine');
    };

    const coalOnly = simulate(['coal']);
    const coalAndIron = simulate(['coal', 'iron']);
    expect(coalOnly).toBeGreaterThan(0);
    expect(coalAndIron / coalOnly).toBeCloseTo(0.625, 3);
  });

  it('splits plantation returns across all eligible plantation goods', () => {
    const simulate = (resources: string[]) => {
      const { st, country, region } = isolatedRegion();
      region.pop = 30_000;
      region.strata.fill(0);
      region.strata[S.laborers] = 0.8;
      region.strata[S.peasants] = 0.2;
      region.res = resources as typeof region.res;
      const prices = { ...st.worldPrices, cotton: 2, opium: 0.5, grain: 0, tools: 1, steel: 1 };
      st.worldPrices = prices;
      st.marketPrices.GBR = { ...prices };
      return buildingReturn(st, country, region, 'plantation');
    };

    const cottonOnly = simulate(['cott']);
    const cottonAndOpium = simulate(['cott', 'opium']);
    expect(cottonOnly).toBeGreaterThan(0);
    expect(cottonAndOpium / cottonOnly).toBeCloseTo(0.625, 3);
  });

  it('uses square-root productivity scaling for factory output estimates', () => {
    const simulate = (productivity: number) => {
      const { st, country, region } = isolatedRegion();
      country.productivity = productivity;
      region.pop = 30_000;
      region.strata.fill(0);
      region.strata[S.workers] = 0.8;
      region.strata[S.peasants] = 0.2;
      const prices = { ...st.worldPrices, grain: 1, cotton: 1, coal: 1, tools: 1, steel: 1, textiles: 1 };
      st.worldPrices = prices;
      st.marketPrices.GBR = { ...prices };
      return buildingReturn(st, country, region, 'textile_mill');
    };

    const baseline = simulate(1);
    const productive = simulate(4);
    expect(baseline).toBeGreaterThan(0);
    // Output scales with sqrt(productivity), while the modeled build cost does too.
    expect(productive / baseline).toBeCloseTo(1, 3);
  });

});
