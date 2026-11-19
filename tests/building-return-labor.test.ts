import { describe, expect, it } from 'vitest';
import { fresh } from './helpers';
import { buildingReturn } from '../src/engine/systems/economy';
import { BUILDINGS, GOODS, S, type GameState, type Good } from '../src/engine/types';

function isolatedRegion() {
  const st = fresh('sandbox', 914, 'GBR');
  const country = st.countries.GBR;
  const region = st.regions.find((candidate) => candidate.id === country.capital)!;
  for (const building of BUILDINGS) region.buildings[building] = 0;
  region.pop = 3_000;
  region.strata.fill(0);
  region.strata[S.peasants] = 1;
  region.res = ['coal', 'iron', 'cott', 'timb'];
  const marketId = country.customsUnion ?? country.id;
  st.marketStats[marketId] = Object.fromEntries(GOODS.map((good: Good) => [
    good,
    { supply: 0, demand: 1_000_000, imports: 0, short: 0 },
  ])) as typeof st.marketStats[string];
  return { st, country, region };
}

function makeFactoryInputsAvailable(st: GameState, countryId: string) {
  const marketId = st.countries[countryId].customsUnion ?? countryId;
  for (const good of ['cotton', 'coal'] as Good[]) {
    st.marketStats[marketId][good] = { supply: 1_000_000_000, demand: 0, imports: 0, short: 0 };
  }
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
    const prices = { ...st.worldPrices, grain: 0, cotton: 0.2, coal: 0.2, textiles: 2, tools: 1, steel: 1 };
    st.worldPrices = prices;
    st.marketPrices[country.customsUnion ?? country.id] = { ...prices };
    makeFactoryInputsAvailable(st, country.id);
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
      makeFactoryInputsAvailable(st, country.id);
      return buildingReturn(st, country, region, 'textile_mill');
    };

    const baseline = simulate(1);
    const productive = simulate(4);
    expect(baseline).toBeGreaterThan(0);
    // Output scales with sqrt(productivity), while the modeled build cost does too.
    expect(productive / baseline).toBeCloseTo(1, 3);
  });

  it('discounts another mine level when the target good is already oversupplied', () => {
    const simulate = (supply: number, demand: number) => {
      const { st, country, region } = isolatedRegion();
      region.pop = 30_000;
      region.strata.fill(0);
      region.strata[S.laborers] = 0.8;
      region.strata[S.peasants] = 0.2;
      region.res = ['coal'];
      const prices = { ...st.worldPrices, coal: 2, grain: 0, tools: 1, steel: 1 };
      st.worldPrices = prices;
      st.marketPrices.GBR = { ...prices };
      st.marketStats.GBR = {
        coal: { supply, demand, imports: 0, short: 0 },
      } as typeof st.marketStats.GBR;
      return buildingReturn(st, country, region, 'mine');
    };

    const balanced = simulate(100, 100);
    const oversupplied = simulate(1_000, 100);
    expect(balanced).toBeGreaterThan(0);
    expect(oversupplied).toBeGreaterThan(0);
    expect(oversupplied).toBeLessThan(balanced);
  });

  it('discounts factory returns when required inputs are structurally unavailable', () => {
    const simulate = (cottonShort: number, coalShort: number) => {
      const { st, country, region } = isolatedRegion();
      region.pop = 30_000;
      region.strata.fill(0);
      region.strata[S.workers] = 0.8;
      region.strata[S.peasants] = 0.2;
      const prices = { ...st.worldPrices, grain: 0, cotton: 1, coal: 1, textiles: 2, tools: 1, steel: 1 };
      st.worldPrices = prices;
      st.marketPrices.GBR = { ...prices };
      st.marketStats[country.customsUnion ?? country.id] = {
        cotton: { supply: cottonShort === 0 ? 1_000_000_000 : 1_000_000, demand: 0, imports: 0, short: 0 },
        coal: { supply: coalShort === 0 ? 1_000_000_000 : 100_000, demand: 0, imports: 0, short: 0 },
        textiles: { supply: 0, demand: 1_000_000, imports: 0, short: 0 },
      } as typeof st.marketStats.GBR;
      return buildingReturn(st, country, region, 'textile_mill');
    };

    const supplied = simulate(0, 0);
    const constrained = simulate(0.5, 0);
    const severelyConstrained = simulate(0.5, 0.75);
    expect(supplied).toBeGreaterThan(constrained);
    expect(constrained).toBeGreaterThan(severelyConstrained);
  });

  it('discounts factory revenue when its output market has persistent surplus', () => {
    const simulate = (supply: number, demand: number) => {
      const { st, country, region } = isolatedRegion();
      region.pop = 30_000;
      region.strata.fill(0);
      region.strata[S.workers] = 0.8;
      region.strata[S.peasants] = 0.2;
      const prices = { ...st.worldPrices, grain: 0, cotton: 1, coal: 1, textiles: 2, tools: 1, steel: 1 };
      st.worldPrices = prices;
      st.marketPrices.GBR = { ...prices };
      st.marketStats[country.customsUnion ?? country.id] = {
        textiles: { supply, demand, imports: 0, short: 0 },
      } as typeof st.marketStats.GBR;
      return buildingReturn(st, country, region, 'textile_mill');
    };

    const balanced = simulate(100, 100);
    const oversupplied = simulate(1_000, 100);
    expect(balanced).toBeGreaterThan(0);
    expect(oversupplied).toBeLessThan(balanced);
  });

});
