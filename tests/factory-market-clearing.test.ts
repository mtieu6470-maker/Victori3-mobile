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
    // No steel can be made, so upstream/downstream factories must not add fictitious input demand.
    expect(market.iron.demand).toBeCloseTo(baseline.st.marketStats.GBR.iron.demand, 5);
    expect(market.steel.demand).toBeCloseTo(baseline.st.marketStats.GBR.steel.demand, 5);
    expect(market.tools.demand).toBeCloseTo(baseline.st.marketStats.GBR.tools.demand, 5);
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
});
