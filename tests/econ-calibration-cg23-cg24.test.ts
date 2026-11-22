// ECON-CAL-02: historical scale constraints for the 1836 cotton/textile economy.
// Evidence: CG-23 (Woodbury 1836, Table A/Table I: world crop 1834 ≈ 900m lb, United States 460m lb ≈ 51%,
// England raw-cotton use ≈ 33-36% of the world crop) and CG-24 (1835 factory returns: 355,373 textile
// factory hands in Great Britain). Model cotton units are calibrated as pounds of raw cotton per year.
// Tolerances are deliberately wide: these are order-of-magnitude guards against regressions such as the
// pre-ECON-CAL-02 state (1.71M mill hands; Britain needing ~2x the world crop; Qing the largest grower).
import { afterEach, describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame, FACTORY_SHARE_OF_WORKERS_1836, plantationLabourShare1836 } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';
import { data } from '../src/engine/data/db';
import { LEVEL_WORKERS, PRODUCTIVITY_ELASTICITY, RECIPES } from '../src/engine/systems/economy';
import { ECONOMY_FLAGS } from '../src/engine/systems/industry';
import { S } from '../src/engine/types';

loadNodeData();

const start = createGame({ mode: 'historical', seed: 1, player: null });
const month1 = structuredClone(start);
stepMonth(month1);
const worldCotton = (st: typeof start) => Object.values(st.marketStats).reduce((s, m) => s + m.cotton.supply, 0);

describe('ECON-CAL-02 historical scale (CG-23 / CG-24)', () => {
  it('CG-24: Britain starts with about 355k textile factory hands, not the whole worker stratum', () => {
    const hands = start.regions.filter((r) => r.owner === 'GBR').reduce((s, r) => s + r.buildings.textile_mill, 0) * LEVEL_WORKERS;
    expect(hands).toBeGreaterThan(355_373 * 0.85);
    expect(hands).toBeLessThan(355_373 * 1.15);
    // The outworkers moved to artisans, so strata still sum to one and factories can be fully staffed.
    for (const r of start.regions) {
      expect(r.strata.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 9);
      const factoryJobs = (['textile_mill', 'ironworks', 'tool_works', 'arms_works', 'luxury_workshop'] as const).reduce((s, b) => s + r.buildings[b], 0) * LEVEL_WORKERS;
      expect(factoryJobs).toBeLessThanOrEqual(r.pop * 0.45 * r.strata[S.workers] * 1.1 + 2 * LEVEL_WORKERS);
    }
    expect(FACTORY_SHARE_OF_WORKERS_1836).toBeGreaterThan(0);
    expect(FACTORY_SHARE_OF_WORKERS_1836).toBeLessThan(1);
  });

  it('CG-23: the world cotton crop is of the right order (Woodbury 1834: 900m lb)', () => {
    const w = worldCotton(month1);
    expect(w).toBeGreaterThan(600e6);
    expect(w).toBeLessThan(1_300e6);
  });

  it('CG-23: the United States is the largest commercial cotton grower with a large share', () => {
    const ranked = Object.entries(month1.marketStats).map(([id, m]) => [id, m.cotton.supply] as const).sort((a, b) => b[1] - a[1]);
    expect(ranked[0][0]).toBe('USA');
    expect(ranked[0][1] / worldCotton(month1)).toBeGreaterThan(0.35);
    expect(ranked[0][1] / worldCotton(month1)).toBeLessThan(0.65);
  });

  it('CG-23: British mills use roughly a third of the world crop', () => {
    const share = month1.marketStats.GBR.cotton.demand / worldCotton(month1);
    expect(share).toBeGreaterThan(0.28);
    expect(share).toBeLessThan(0.45);
  });

  it('keeps GDP calibrated to the Maddison-based targets after decoupling physical output', () => {
    const d = data();
    for (const id of ['GBR', 'FRA', 'USA', 'QNG', 'RUS']) {
      const c = start.countries[id]; if (!c) continue;
      const pop = start.regions.filter((r) => r.owner === id).reduce((s, r) => s + r.pop, 0);
      const target = pop * (d.db.gdp_pc_1836[id]?.value ?? 450);
      expect(c.gdp / target).toBeGreaterThan(0.9);
      expect(c.gdp / target).toBeLessThan(1.1);
    }
    expect(PRODUCTIVITY_ELASTICITY.physical + PRODUCTIVITY_ELASTICITY.value).toBeCloseTo(1, 9);
  });

  it('slave plantations keep the 1836 scale; free-labour cotton-only belts are mostly household production', () => {
    expect(plantationLabourShare1836(true, ['cott'])).toBe(0.9);
    expect(plantationLabourShare1836(false, ['grain', 'cott'])).toBeLessThan(plantationLabourShare1836(false, ['cott', 'cash']));
    expect(RECIPES.textile_mill!.inputs.cotton).toBeLessThan(0.3); // cloth, not yarn (see recipe note)
  });
});

describe('ECON-CAL-02 with IND-02a site operations switched on (test only)', () => {
  afterEach(() => { ECONOMY_FLAGS.siteOperations = false; });
  it('British textile mills stay profitable and fully operating through the first year', () => {
    ECONOMY_FLAGS.siteOperations = true;
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    for (let i = 0; i < 12; i++) stepMonth(st);
    const mills = st.regions.filter((r) => r.owner === 'GBR' && r.buildings.textile_mill > 0).map((r) => st.industry[`${r.id}|textile_mill`]);
    expect(mills.length).toBeGreaterThan(10);
    expect(mills.every((o) => o && o.util === 1)).toBe(true);
  });
});
