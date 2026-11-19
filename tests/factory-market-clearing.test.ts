import { describe, expect, it } from 'vitest';
import { fresh } from './helpers';
import { computeEconomy } from '../src/engine/systems/economy';
import { BUILDINGS, S, STRATA } from '../src/engine/types';

function isolatedIndustrialWorld() {
  const st = fresh('sandbox', 731, 'GBR');
  for (const country of Object.values(st.countries)) {
    country.laws.trade = 'isolationism';
    country.customsUnion = null;
    country.army.manpower = 0;
    country.navy.strength = 0;
  }
  for (const region of st.regions) {
    for (const building of BUILDINGS) region.buildings[building] = 0;
    region.res = [];
    region.coastal = false;
    region.pop = 1_000;
    region.strata.fill(0);
    region.strata[S.peasants] = 1;
    region.employment = new Array(STRATA.length).fill(0);
    region.wages = new Array(STRATA.length).fill(0);
  }
  const country = st.countries.GBR;
  const region = st.regions.find((candidate) => candidate.id === country.capital)!;
  region.pop = 1_000_000;
  region.strata.fill(0);
  region.strata[S.peasants] = 0.2;
  region.strata[S.laborers] = 0.3;
  region.strata[S.workers] = 0.3;
  region.strata[S.middle] = 0.2;
  return { st, region };
}

describe('factory intermediate-goods market clearing', () => {
  it('does not let downstream factories consume steel or tools that upstream factories cannot produce', () => {
    const baseline = isolatedIndustrialWorld();
    computeEconomy(baseline.st);

    const { st, region } = isolatedIndustrialWorld();
    region.buildings.ironworks = 2;
    region.buildings.tool_works = 1;
    region.buildings.arms_works = 1;
    // No iron, coal, timber, or other source of intermediate industrial inputs.
    computeEconomy(st);

    const market = st.marketStats.GBR;
    expect(market.steel.supply).toBe(0);
    expect(market.tools.supply).toBe(0);
    expect(market.arms.supply).toBe(0);
    // Requested inputs remain visible even though no production can satisfy them.
    // Shortage must not be hidden by replacing requested demand with actual consumption.
    expect(market.iron.demand).toBeGreaterThan(baseline.st.marketStats.GBR.iron.demand);
    expect(market.coal.demand).toBeGreaterThan(baseline.st.marketStats.GBR.coal.demand);
    expect(market.steel.demand).toBeGreaterThan(0);
    expect(market.tools.demand).toBeGreaterThan(baseline.st.marketStats.GBR.tools.demand);
    expect(market.iron.short).toBeCloseTo(1, 5);
    expect(market.coal.short).toBeCloseTo(1, 5);
    expect(market.steel.short).toBeCloseTo(1, 5);
    expect(market.tools.short).toBeCloseTo(1, 5);
  });

  it('allows a fully supplied steel-to-tools-to-arms production chain', () => {
    const { st, region } = isolatedIndustrialWorld();
    region.res = ['iron', 'coal', 'timb'];
    region.buildings.mine = 12;
    region.buildings.logging = 10;
    region.buildings.ironworks = 2;
    region.buildings.tool_works = 1;
    region.buildings.arms_works = 1;
    computeEconomy(st);

    const market = st.marketStats.GBR;
    expect(market.steel.supply).toBeGreaterThan(0);
    expect(market.tools.supply).toBeGreaterThan(0);
    expect(market.arms.supply).toBeGreaterThan(0);
    expect(market.steel.short).toBeLessThan(0.01);
    expect(market.tools.short).toBeLessThan(0.01);
  });
  it('shares a partial primary-stage coal shortage proportionally across textile and steel factories', () => {
    const { st: constrained, region: constrainedRegion } = isolatedIndustrialWorld();
    constrainedRegion.res = ['iron', 'coal', 'cott'];
    constrainedRegion.buildings.mine = 2;
    constrainedRegion.buildings.plantation = 10;
    constrainedRegion.buildings.textile_mill = 2;
    constrainedRegion.buildings.ironworks = 2;
    computeEconomy(constrained);

    // A matched, unconstrained reference keeps population, productivity and factory capacity
    // identical; only the upstream mine capacity changes.
    const { st: supplied, region: suppliedRegion } = isolatedIndustrialWorld();
    suppliedRegion.res = ['iron', 'coal', 'cott'];
    suppliedRegion.buildings.mine = 50;
    suppliedRegion.buildings.plantation = 10;
    suppliedRegion.buildings.textile_mill = 2;
    suppliedRegion.buildings.ironworks = 2;
    computeEconomy(supplied);

    const market = constrained.marketStats.GBR;
    const reference = supplied.marketStats.GBR;
    expect(market.coal.short).toBeGreaterThan(0);
    expect(market.coal.short).toBeLessThan(1);
    expect(market.textiles.supply).toBeGreaterThan(0);
    expect(market.steel.supply).toBeGreaterThan(0);

    // Both primary factories consume coal and must receive the same proportional availability.
    // Compare realized output to a matched no-shortage run so this fails on sequential priority.
    const textileRealization = market.textiles.supply / reference.textiles.supply;
    const steelRealization = market.steel.supply / reference.steel.supply;
    expect(textileRealization).toBeGreaterThan(0);
    expect(steelRealization).toBeGreaterThan(0);
    expect(textileRealization).toBeCloseTo(steelRealization, 3);

    // Demand remains the full requested amount while production is constrained.
    expect(market.coal.demand).toBeGreaterThan(1_500_000);
    expect(Number.isFinite(market.coal.supply)).toBe(true);
    expect(Number.isFinite(market.coal.demand)).toBe(true);
  });
});
