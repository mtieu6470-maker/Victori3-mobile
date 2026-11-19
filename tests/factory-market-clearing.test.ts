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
    const simulate = (coalMineLevels: number) => {
      const { st, region } = isolatedIndustrialWorld();
      region.res = ['coal', 'cott'];
      region.buildings.mine = coalMineLevels;
      region.buildings.plantation = 10;
      region.buildings.textile_mill = 2;
      region.buildings.ironworks = 2;

      // Supply iron independently so coal is the only shared scarce factory input.
      const ironRegion = st.regions.find((candidate) => candidate.owner === 'GBR' && candidate.id !== region.id);
      if (!ironRegion) throw new Error('Expected a second GBR region for isolated iron supply.');
      ironRegion.pop = 1_000_000;
      ironRegion.strata.fill(0);
      ironRegion.strata[S.peasants] = 0.2;
      ironRegion.strata[S.laborers] = 0.8;
      ironRegion.res = ['iron'];
      ironRegion.buildings.mine = 50;

      computeEconomy(st);
      return st;
    };

    const constrained = simulate(1).marketStats.GBR;
    const reference = simulate(50).marketStats.GBR;
    expect(constrained.coal.short).toBeGreaterThan(0);
    expect(constrained.coal.short).toBeLessThan(1);
    expect(constrained.iron.short).toBeLessThan(0.01);
    expect(constrained.textiles.supply).toBeGreaterThan(0);
    expect(constrained.steel.supply).toBeGreaterThan(0);

    // With iron plentiful, both primary factories are constrained by their common coal input.
    const textileRealization = constrained.textiles.supply / reference.textiles.supply;
    const steelRealization = constrained.steel.supply / reference.steel.supply;
    expect(textileRealization).toBeGreaterThan(0);
    expect(steelRealization).toBeGreaterThan(0);
    expect(textileRealization).toBeCloseTo(steelRealization, 3);
    expect(constrained.coal.demand).toBeGreaterThan(1_500_000);
    expect(Number.isFinite(constrained.coal.supply)).toBe(true);
    expect(Number.isFinite(constrained.coal.demand)).toBe(true);
  });

  it('does not let later arms demand pre-empt steel required by the earlier tools stage', () => {
    const simulate = (includeArms: boolean) => {
      const { st, region } = isolatedIndustrialWorld();
      region.res = ['iron', 'coal', 'timb'];
      region.buildings.mine = 12;
      region.buildings.logging = 10;
      region.buildings.ironworks = 2;
      region.buildings.tool_works = 1;
      // Five arms levels create a real downstream steel shortage, while one tools level
      // still has enough realized intermediate output to keep arms production above zero.
      region.buildings.arms_works = includeArms ? 5 : 0;
      computeEconomy(st);
      return st.marketStats.GBR;
    };

    const withoutArms = simulate(false);
    const withArms = simulate(true);
    // The downstream request is visible in the final ledger, but must not reduce the
    // already-resolved tools stage even when market supply can satisfy the total demand.
    expect(withArms.steel.demand).toBeGreaterThan(withoutArms.steel.demand);
    expect(withArms.tools.supply).toBeCloseTo(withoutArms.tools.supply, 5);
    expect(withArms.arms.supply).toBeGreaterThan(0);
  });

  it('shares a scarce regional factory workforce proportionally instead of prioritizing recipe order', () => {
    const simulate = (workerShare: number) => {
      const { st, region } = isolatedIndustrialWorld();
      region.strata[S.workers] = workerShare;
      region.strata[S.middle] = 0.5 - workerShare;
      region.res = ['iron', 'coal', 'cott'];
      region.buildings.mine = 50;
      region.buildings.plantation = 10;
      region.buildings.textile_mill = 2;
      region.buildings.ironworks = 2;
      computeEconomy(st);
      return st;
    };

    // 1% workers provides 4,500 people for 8,000 requested factory jobs;
    // 20% workers provides enough labor to staff both factories fully.
    const constrained = simulate(0.01).marketStats.GBR;
    const staffed = simulate(0.2).marketStats.GBR;
    expect(constrained.coal.short).toBeLessThan(0.01);
    expect(constrained.iron.short).toBeLessThan(0.01);

    const textileStaffing = constrained.textiles.supply / staffed.textiles.supply;
    const steelStaffing = constrained.steel.supply / staffed.steel.supply;
    expect(textileStaffing).toBeCloseTo(0.5625, 2);
    expect(steelStaffing).toBeCloseTo(0.5625, 2);
    expect(textileStaffing).toBeCloseTo(steelStaffing, 3);
  });

});
