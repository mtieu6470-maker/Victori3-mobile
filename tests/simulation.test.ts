// Simulation sanity: economy and population stay plausible, AI does not get stuck, save/load is deterministic.
import { describe, it, expect } from 'vitest';
import { run, fresh, stepMonth } from './helpers';
import { serialize, deserialize } from '../src/engine/save';
import { data } from '../src/engine/data/db';
import { STRATA } from '../src/engine/types';
import { availableProductionMethods, calculatePopulationEconomy, calibrateCohortLivingStandards, factoryInputFulfillment, populationConsumptionDemand, productionMethodFor, setProductionMethod } from '../src/engine/systems/economy';
import { execute } from '../src/engine/commands';
import { advanceConstruction, cancelConstruction, queueConstruction, canBuild } from '../src/engine/systems/economy';

describe('economy and population sanity (40 years, both modes)', () => {
  for (const mode of ['historical', 'sandbox'] as const) {
    const st = run(mode, 1, 40);
    it(`${mode}: no NaN/negative values in regions and countries`, () => {
      for (const r of st.regions) { expect(Number.isFinite(r.pop) && r.pop > 0, r.id).toBe(true); expect(r.sol).toBeGreaterThanOrEqual(0); expect(r.sol).toBeLessThanOrEqual(1); expect(Number.isFinite(r.output)).toBe(true); }
      for (const c of Object.values(st.countries)) if (c.alive) { expect(Number.isFinite(c.gdp), c.id).toBe(true); expect(Number.isFinite(c.treasury)).toBe(true); expect(c.legitimacy).toBeGreaterThanOrEqual(0); }
    });
    it(`${mode}: world population growth 1836-1876 is within a plausible band (0.2%-1.2% per year)`, () => {
      const p0 = data().db.regions.reduce((s, r) => s + r.pop, 0);
      const p1 = st.regions.reduce((s, r) => s + r.pop, 0);
      const g = Math.pow(p1 / p0, 1 / 40) - 1;
      console.log(mode, 'world pop growth %/yr', (g * 100).toFixed(2));
      expect(g).toBeGreaterThan(0.002); expect(g).toBeLessThan(0.012);
    });
    it(`${mode}: national trends stay within a factor of 2 of the 1870 benchmarks (population: CoW; not a script)`, () => {
      const bm = (id: string) => data().db.benchmarks.find((b) => b.entity === id && b.field === 'population.total' && b.date === '1875')?.value;
      for (const id of ['GBR', 'FRA', 'USA', 'RUS', 'SPA']) {
        const c = st.countries[id]; const ref = bm(id); if (!c?.alive || !ref) continue;
        const ratio = c.stats.pop / ref;
        expect(ratio, `${id} ${(ratio).toFixed(2)}`).toBeGreaterThan(0.5); expect(ratio).toBeLessThan(2);
      }
    });
  }
});

describe('AI does not get stuck in meaningless loops', () => {
  const st = run('sandbox', 1, 40);
  it('no law flips back to a value it left within 15 years', () => {
    for (const c of Object.values(st.countries)) {
      const h = c.ai.lawHistory;
      for (let i = 0; i < h.length; i++) for (let j = i + 1; j < h.length; j++) if (h[i].group === h[j].group && h[j].tick - h[i].tick < 180) {
        const before = h.slice(0, i).filter((x) => x.group === h[i].group).at(-1)?.value;
        expect(h[j].value === before && !!before, `${c.id} ${h[i].group}`).toBe(false);
      }
    }
  });
  it('wars end: no war lasts more than 12 years', () => { for (const w of st.wars) expect(st.tick - w.start).toBeLessThanOrEqual(145); });
  it('countries keep researching and building over the whole period', () => {
    expect(st.counters.aiActions.research).toBeGreaterThan(100);
    expect(st.counters.aiActions.construction).toBeGreaterThan(1000);
  });
});

describe('save/load', () => {
  it('a loaded game continues exactly like the uninterrupted game', () => {
    const a = fresh('sandbox', 21); for (let i = 0; i < 30; i++) stepMonth(a);
    const b = deserialize(serialize(a));
    for (let i = 0; i < 30; i++) { stepMonth(a); stepMonth(b); }
    expect(serialize(b)).toBe(serialize(a));
  });
  it('rejects foreign files', () => { expect(() => deserialize('{"format":"x"}')).toThrow(); });
});

describe('war support (Pass 16 pack, ch. 34/73: exhaustion alone does not capitulate)', () => {
  it('an exhausted attacker that is winning stays in the war', async () => {
    const { declareWar } = await import('../src/engine/systems/diplomacy');
    const { militaryMonth } = await import('../src/engine/systems/military');
    const st = fresh('sandbox', 5, null);
    const a = 'FRA', d = 'SAR';
    declareWar(st, a, d, [{ by: a, type: 'subjugate', target: d }], 'Test war');
    const w = st.wars[st.wars.length - 1];
    for (const m of w.attackers.members) st.countries[m].warExhaustion = 99;
    w.score = 40;
    militaryMonth(st);
    expect(st.wars.some((x) => x.id === w.id)).toBe(true);
  });
  it('an exhausted attacker that is losing gives up', async () => {
    const { declareWar } = await import('../src/engine/systems/diplomacy');
    const { militaryMonth } = await import('../src/engine/systems/military');
    const st = fresh('sandbox', 5, null);
    declareWar(st, 'SAR', 'FRA', [{ by: 'SAR', type: 'subjugate', target: 'FRA' }], 'Test war 2');
    const w = st.wars[st.wars.length - 1];
    for (const m of w.attackers.members) st.countries[m].warExhaustion = 99;
    w.score = -30;
    militaryMonth(st);
    expect(st.wars.some((x) => x.id === w.id)).toBe(false);
  });
});


describe('stratified employment and household income', () => {
  it('allocates all regional value added to worker households and owners without losing income', () => {
    const st = fresh('historical', 31, 'GBR');
    const prices = st.marketPrices.GBR ?? st.worldPrices;
    const shares = [0.4, 0.02, 0.2, 0.08, 0.12, 0.08, 0.03, 0.05, 0.02];
    const population = 100000;
    const employment = shares.map((share, i) => i >= 7 ? 0 : population * share * 0.45);
    const valueAdded = 45_000_000;
    const cohorts = calculatePopulationEconomy(population, shares, employment, valueAdded, prices, 0.07, 0.02, 'free_labor');

    const distributedIncome = cohorts.incomePerCapita.reduce((sum, income, i) => sum + income * population * shares[i], 0);
    expect(distributedIncome).toBeCloseTo(valueAdded, 3);
    expect(cohorts.employed).toHaveLength(STRATA.length);
    expect(cohorts.incomePerCapita).toHaveLength(STRATA.length);
    expect(cohorts.wagePerWorker).toHaveLength(STRATA.length);
    expect(cohorts.sol).toHaveLength(STRATA.length);
    for (let i = 0; i < STRATA.length; i++) {
      expect(Number.isFinite(cohorts.incomePerCapita[i])).toBe(true);
      expect(cohorts.incomePerCapita[i]).toBeGreaterThanOrEqual(0);
      expect(cohorts.sol[i]).toBeGreaterThanOrEqual(0);
      expect(cohorts.sol[i]).toBeLessThanOrEqual(1);
      if (i < 7) expect(cohorts.employed[i]).toBeLessThanOrEqual(population * shares[i] * 0.45 + 1e-6);
    }
    expect(new Set(cohorts.sol.map((v) => v.toFixed(3))).size).toBeGreaterThan(1);
    expect(cohorts.wagePerWorker[STRATA.indexOf('workers')]).toBeGreaterThan(0);
  });

  it('keeps the historical weighted SoL mean while retaining differences between strata', () => {
    const st = fresh('historical', 34, 'GBR');
    const prices = st.marketPrices.GBR ?? st.worldPrices;
    const shares = [0.4, 0.02, 0.2, 0.08, 0.12, 0.08, 0.03, 0.05, 0.02];
    const population = 100000;
    const employment = shares.map((share, i) => i >= 7 ? 0 : population * share * 0.45);
    const raw = calculatePopulationEconomy(population, shares, employment, 45_000_000, prices, 0.07, 0.02, 'free_labor');
    const calibrated = calibrateCohortLivingStandards(raw, shares, 0.58);
    const mean = calibrated.sol.reduce((sum, sol, i) => sum + sol * shares[i], 0);
    expect(mean).toBeCloseTo(0.58, 5);
    expect(new Set(calibrated.sol.map((sol) => sol.toFixed(4))).size).toBeGreaterThan(1);
    expect(calibrated.sol.every((sol) => sol >= 0 && sol <= 1)).toBe(true);
  });

  it('builds cohort ledgers in both game modes and keeps employment below each class labour pool', () => {
    for (const mode of ['historical', 'sandbox'] as const) {
      const st = fresh(mode, 32, 'GBR');
      const regions = st.regions.filter((r) => r.owner === 'GBR' && r.pop > 0);
      expect(regions.length).toBeGreaterThan(0);
      for (const region of regions) {
        expect(region.popEconomy).toBeDefined();
        const p = region.popEconomy!;
        expect(p.employed).toHaveLength(STRATA.length);
        expect(p.sol).toHaveLength(STRATA.length);
        for (let i = 0; i < STRATA.length; i++) {
          expect(Number.isFinite(p.employed[i])).toBe(true);
          expect(p.employed[i]).toBeGreaterThanOrEqual(0);
          if (i < 7) expect(p.employed[i]).toBeLessThanOrEqual(region.pop * region.strata[i] * 0.45 + 1e-5);
        }
        const averageIncome = p.incomePerCapita.reduce((sum, income, i) => sum + income * region.strata[i], 0);
        expect(averageIncome * region.pop).toBeCloseTo(region.output * 12, 2);
      }
    }
  });

  it('rebuilds cohort data after loading a legacy save without the optional ledger', () => {
    const state = fresh('historical', 33, 'GBR');
    const legacy = JSON.parse(serialize(state));
    for (const region of legacy.state.regions) delete region.popEconomy;
    const restored = deserialize(JSON.stringify(legacy));
    expect(restored.regions.every((region) => region.popEconomy === undefined)).toBe(true);
    stepMonth(restored);
    expect(restored.regions.every((region) => !!region.popEconomy)).toBe(true);
  });
});

describe('cohort-specific market demand', () => {
  it('preserves the legacy aggregate demand curve when every stratum has equal income', () => {
    const shares = [0.4, 0.02, 0.2, 0.08, 0.12, 0.08, 0.03, 0.05, 0.02];
    const pop = 100000;
    const wealth = 1.4;
    const demand = populationConsumptionDemand(pop, shares, STRATA.map(() => 600 * wealth), 'GBR');
    const luxuryShare = shares[5] * 0.4 + shares[7] + shares[8];
    expect(demand.grain).toBeCloseTo(pop * 200 * (1 + 0.25 * Math.log(wealth)), 5);
    expect(demand.textiles).toBeCloseTo(pop * 12 * Math.pow(wealth, 0.8), 5);
    expect(demand.cash_crops).toBeCloseTo(pop * 6 * wealth, 5);
    expect(demand.luxury).toBeCloseTo(pop * luxuryShare * 160 * wealth, 5);
    expect(demand.coal).toBeCloseTo(pop * 1.5 * wealth, 5);
  });

  it('moves discretionary consumption toward richer strata while keeping basic needs universal', () => {
    const shares = [0.4, 0.02, 0.2, 0.08, 0.12, 0.08, 0.03, 0.05, 0.02];
    const equalIncome = STRATA.map(() => 600);
    const richerOwners = [600, 600, 600, 600, 600, 600, 600, 2400, 3600];
    const equal = populationConsumptionDemand(100000, shares, equalIncome, 'GBR');
    const stratified = populationConsumptionDemand(100000, shares, richerOwners, 'GBR');

    expect(stratified.luxury).toBeGreaterThan(equal.luxury);
    expect(stratified.textiles).toBeGreaterThan(equal.textiles);
    expect(stratified.grain).toBeGreaterThan(equal.grain);

    const peasantsOnly = [1, 0, 0, 0, 0, 0, 0, 0, 0];
    const poorStaples = populationConsumptionDemand(10000, peasantsOnly, STRATA.map(() => 0), 'GBR');
    expect(poorStaples.grain).toBeGreaterThan(0);
    expect(poorStaples.textiles).toBeGreaterThan(0);
    expect(populationConsumptionDemand(100000, shares, equalIncome, 'QNG').opium)
      .toBeGreaterThan(populationConsumptionDemand(100000, shares, equalIncome, 'GBR').opium);
  });

  it('uses a safe legacy fallback when cohort incomes are absent or invalid', () => {
    const shares = [0.4, 0.02, 0.2, 0.08, 0.12, 0.08, 0.03, 0.05, 0.02];
    const fallback = populationConsumptionDemand(10000, shares, undefined, 'GBR', 1.2);
    const invalid = populationConsumptionDemand(10000, shares, [NaN, -1], 'GBR', 1.2);
    expect(invalid.grain).toBeCloseTo(fallback.grain, 5);
    expect(invalid.textiles).toBeCloseTo(fallback.textiles, 5);
    expect(invalid.luxury).toBeCloseTo(fallback.luxury, 5);
  });
});

describe('factory input constraints', () => {
  it('does not let an unrelated sector shortage reduce factory output', () => {
    const shortages = { steel: 0.8, tools: 0.4 };
    const textileInputs = { cotton: 0.45, coal: 0.08 };
    const armsInputs = { steel: 0.35, tools: 0.15 };

    expect(factoryInputFulfillment(textileInputs, shortages)).toBe(1);
    expect(factoryInputFulfillment(armsInputs, shortages)).toBeCloseTo(0.2);
  });

  it('limits a factory by the scarcest input in its own recipe', () => {
    const ironworksInputs = { iron: 0.5, coal: 0.4 };
    expect(factoryInputFulfillment(ironworksInputs, { iron: 0.1, coal: 0.25 })).toBeCloseTo(0.75);
    expect(factoryInputFulfillment({}, { steel: 1 })).toBe(1);
  });
});

describe('factory production methods', () => {
  it('uses researched methods by default and persists explicit regional choices', () => {
    const st = fresh('historical', 3, 'GBR');
    const c = st.countries.GBR;
    const r = st.regions.find((x) => x.owner === c.id && x.buildings.textile_mill > 0);
    expect(r).toBeDefined();
    const region = r!;
    const options = availableProductionMethods(c, 'textile_mill');
    expect(options.map((m) => m.id)).toContain('power_looms');
    const baseMethod = options.find((m) => m.id === 'hand_looms')!;
    const advancedMethod = options.find((m) => m.id === 'power_looms')!;
    expect(productionMethodFor(c, region, 'textile_mill')?.id).toBe(advancedMethod.id);
    expect(setProductionMethod(c, region, 'textile_mill', baseMethod.id)).toBe(true);
    expect(productionMethodFor(c, region, 'textile_mill')?.id).toBe(baseMethod.id);
    expect(region.productionMethods?.textile_mill).toBe(baseMethod.id);
  });

  it('rejects a technology-gated method when the required technology is absent', () => {
    const st = fresh('historical', 4, 'GBR');
    const c = st.countries.GBR;
    const r = st.regions.find((x) => x.owner === c.id && x.buildings.textile_mill > 0)!;
    c.techs = c.techs.filter((id) => id !== 'mechanized_spinning');
    expect(availableProductionMethods(c, 'textile_mill').map((m) => m.id)).not.toContain('power_looms');
    const result = execute(st, { type: 'set_production_method', region: r.id, building: 'textile_mill', method: 'power_looms' });
    expect(result.ok).toBe(false);
  });

  it('loads saves both with and without per-region method fields', () => {
    const st = fresh('historical', 3, 'GBR');
    const c = st.countries.GBR;
    const r = st.regions.find((x) => x.owner === c.id && x.buildings.textile_mill > 0)!;
    setProductionMethod(c, r, 'textile_mill', 'hand_looms');
    const loaded = deserialize(serialize(st));
    const restored = loaded.regions.find((x) => x.id === r.id)!;
    expect(restored.productionMethods?.textile_mill).toBe('hand_looms');
    const legacy = JSON.parse(serialize(st));
    for (const region of legacy.state.regions) delete region.productionMethods;
    const old = deserialize(JSON.stringify(legacy));
    expect(old.regions.every((x) => x.productionMethods === undefined)).toBe(true);
  });
});


describe('monthly construction queue', () => {
  it('spends no more than monthly construction capacity and completes after adequate funding', () => {
    const st = fresh('historical', 11, 'GBR');
    const c = st.countries.GBR;
    const region = st.regions.find((r) => r.owner === c.id && canBuild(st, c, r, 'textile_mill'))!;
    expect(region).toBeDefined();
    const before = region.buildings.textile_mill;
    expect(queueConstruction(st, c, region, 'textile_mill')).toBe(true);
    const project = c.constructionQueue[0];
    (c as any).statePool = project.cost;
    c.finance = { tax: 0, tariff: 0, army: 0, navy: 0, admin: 0, education: 0, health: 0, construction: project.cost / 3, interest: 0 };
    advanceConstruction(st, c);
    expect(c.constructionQueue[0].progress).toBeCloseTo(project.cost / 3);
    expect(region.buildings.textile_mill).toBe(before);
    c.finance.construction = project.cost;
    advanceConstruction(st, c);
    expect(c.constructionQueue.length).toBe(0);
    expect(region.buildings.textile_mill).toBe(before + 1);
  });

  it('refunds invested money to the construction pool when a project is cancelled', () => {
    const st = fresh('historical', 12, 'GBR');
    const c = st.countries.GBR;
    const region = st.regions.find((r) => r.owner === c.id && canBuild(st, c, r, 'textile_mill'))!;
    expect(queueConstruction(st, c, region, 'textile_mill')).toBe(true);
    const project = c.constructionQueue[0];
    project.progress = 12345;
    (c as any).statePool = 0;
    expect(cancelConstruction(c, project.id)).toBe(true);
    expect(c.constructionQueue.length).toBe(0);
    expect((c as any).statePool).toBe(12345);
  });

  it('migrates saves written before constructionQueue existed', () => {
    const st = fresh('historical', 13, 'GBR');
    const legacy = JSON.parse(serialize(st));
    for (const country of Object.values(legacy.state.countries) as Array<Record<string, unknown>>) delete country.constructionQueue;
    const loaded = deserialize(JSON.stringify(legacy));
    expect(Object.values(loaded.countries).every((country) => Array.isArray(country.constructionQueue))).toBe(true);
  });
});
