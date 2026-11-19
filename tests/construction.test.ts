import { describe, expect, it } from 'vitest';
import { fresh } from './helpers';
import {
  buildCost,
  canBuild,
  cancelConstruction,
  constructionMonth,
  enqueueConstruction,
} from '../src/engine/systems/economy';

describe('construction investment lifecycle', () => {
  it('completes the fifth railway level without cancelling its own queued project', () => {
    const st = fresh('sandbox', 41, 'GBR');
    const c = st.countries.GBR;
    const region = st.regions.find((r) => r.id === c.capital)!;
    c.techs.push('railways');
    region.buildings.railway = 4;

    const cost = buildCost(c, 'railway', st);
    c.statePool = cost * 2;
    c.treasury = cost * 2;

    expect(canBuild(st, c, region, 'railway')).toBe(true);
    const project = enqueueConstruction(st, c, region, 'railway', 'state');
    expect(project).not.toBeNull();
    expect(canBuild(st, c, region, 'railway')).toBe(false);

    for (let month = 0; month < 11; month++) {
      constructionMonth(st);
      expect(region.buildings.railway).toBe(4);
    }
    expect(project!.invested).toBeCloseTo(cost * 11 / 12, 5);
    constructionMonth(st);

    expect(region.buildings.railway).toBe(5);
    expect(st.constructionProjects.some((p) => p.id === project!.id)).toBe(false);
    expect(c.statePool).toBeCloseTo(cost, 5);
    expect(c.treasury).toBeCloseTo(cost, 5);
  });

  it('reconciles overstated reserves and never spends beyond treasury cash', () => {
    const st = fresh('sandbox', 42, 'GBR');
    const c = st.countries.GBR;
    const region = st.regions.find((r) => r.id === c.capital)!;
    region.buildings.university = 0;
    const cost = buildCost(c, 'university', st);
    c.statePool = cost * 2;
    c.treasury = cost / 24;

    const project = enqueueConstruction(st, c, region, 'university', 'state');
    expect(project).not.toBeNull();
    constructionMonth(st);

    expect(project!.invested).toBeCloseTo(cost / 24, 5);
    expect(c.treasury).toBe(0);
    expect(c.statePool).toBe(0);
  });

  it('cancels a state project without refunding sunk investment', () => {
    const st = fresh('sandbox', 43, 'GBR');
    const c = st.countries.GBR;
    const region = st.regions.find((r) => r.id === c.capital)!;
    region.buildings.university = 0;
    const cost = buildCost(c, 'university', st);
    c.statePool = cost * 2;
    c.treasury = cost * 2;

    const project = enqueueConstruction(st, c, region, 'university', 'state');
    expect(project).not.toBeNull();
    constructionMonth(st);
    constructionMonth(st);
    constructionMonth(st);
    const remainingPool = c.statePool;
    expect(project!.invested).toBeGreaterThan(0);

    expect(cancelConstruction(st, c, project!.id)).toBe(true);
    expect(c.statePool).toBe(remainingPool);
    expect(region.buildings.university).toBe(0);
    expect(st.constructionProjects.some((p) => p.id === project!.id)).toBe(false);
  });
});
