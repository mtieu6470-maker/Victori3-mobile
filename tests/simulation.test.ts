// Simulation sanity: economy and population stay plausible, AI does not get stuck, save/load is deterministic.
import { describe, it, expect } from 'vitest';
import { run, fresh, stepMonth } from './helpers';
import { GAME_END_TICK, GAME_END_YEAR, isGameOver, stepDay } from '../src/engine/simulation';
import { serialize, deserialize } from '../src/engine/save';
import { data } from '../src/engine/data/db';
import { BUILDINGS, STRATA } from '../src/engine/types';
import { allocateCompetingWorkers, availableProductionMethods, buildingReturn, calculatePopulationEconomy, calibrateCohortLivingStandards, factoryInputFulfillment, LEVEL_WORKERS, marketOf, nextEmploymentTarget, nextWageOffer, populationConsumptionDemand, productionMethodFor, setProductionMethod } from '../src/engine/systems/economy';
import { execute } from '../src/engine/commands';
import { updatePolitics } from '../src/engine/systems/politics';
import { effectiveBuildingLaborDemand, mixPopulationStrata, stratifiedNaturalChange } from '../src/engine/systems/population';
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

describe('daily Gregorian calendar clock', () => {
  it('advances one day without running monthly systems until the month boundary', () => {
    const st = fresh('historical', 91, 'FRA');
    expect(st.dayOfMonth).toBe(1);
    stepDay(st);
    expect(st.dayOfMonth).toBe(2);
    expect(st.date).toEqual({ y: 1836, m: 1 });
    expect(st.tick).toBe(0);
    expect(st.counters.systemRuns.economy ?? 0).toBe(0);

    st.dayOfMonth = 31;
    stepDay(st);
    expect(st.dayOfMonth).toBe(1);
    expect(st.date).toEqual({ y: 1836, m: 2 });
    expect(st.tick).toBe(1);
    expect(st.counters.systemRuns.economy).toBe(1);
  });

  it('uses leap-year and ordinary February lengths correctly', () => {
    const leap = fresh('historical', 92, 'FRA');
    leap.date = { y: 1836, m: 2 };
    leap.tick = 1;
    leap.dayOfMonth = 28;
    stepDay(leap);
    expect(leap.dayOfMonth).toBe(29);
    stepDay(leap);
    expect(leap.date).toEqual({ y: 1836, m: 3 });
    expect(leap.dayOfMonth).toBe(1);
    expect(leap.tick).toBe(2);

    const ordinary = fresh('historical', 93, 'FRA');
    ordinary.date = { y: 1837, m: 2 };
    ordinary.tick = 13;
    ordinary.dayOfMonth = 28;
    stepDay(ordinary);
    expect(ordinary.date).toEqual({ y: 1837, m: 3 });
    expect(ordinary.dayOfMonth).toBe(1);
    expect(ordinary.tick).toBe(14);
  });
});

describe('official campaign end date', () => {
  it('stops at January 1936 and leaves the final state frozen', () => {
    const st = fresh('historical', 12);
    st.tick = GAME_END_TICK - 1;
    st.date = { y: GAME_END_YEAR - 1, m: 12 };
    stepMonth(st);
    expect(st.tick).toBe(GAME_END_TICK);
    expect(st.date).toEqual({ y: GAME_END_YEAR, m: 1 });
    expect(isGameOver(st)).toBe(true);
    const frozen = serialize(st);
    stepMonth(st);
    expect(serialize(st)).toBe(frozen);
  });

  it('treats legacy saves already beyond 1936 as ended instead of simulating more months', () => {
    const st = fresh('sandbox', 13);
    st.tick = 1900 * 12;
    st.date = { y: 2026, m: 1 };
    const frozen = serialize(st);
    expect(isGameOver(st)).toBe(true);
    stepMonth(st);
    expect(serialize(st)).toBe(frozen);
  });
});

describe('save/load', () => {
  it('a loaded game continues exactly like the uninterrupted game', () => {
    const a = fresh('sandbox', 21); for (let i = 0; i < 30; i++) stepMonth(a);
    const b = deserialize(serialize(a));
    for (let i = 0; i < 30; i++) { stepMonth(a); stepMonth(b); }
    expect(serialize(b)).toBe(serialize(a));
  });
  it('preserves the day in current saves and defaults legacy v1 saves to day one', () => {
    const state = fresh('sandbox', 22);
    state.dayOfMonth = 17;
    const restored = deserialize(serialize(state));
    expect(restored.dayOfMonth).toBe(17);
    const legacy = JSON.parse(serialize(state));
    delete legacy.state.dayOfMonth;
    expect(deserialize(JSON.stringify(legacy)).dayOfMonth).toBe(1);
  });
  it('continues daily save/load deterministically within a month', () => {
    const a = fresh('sandbox', 23);
    for (let i = 0; i < 47; i++) stepDay(a);
    const b = deserialize(serialize(a));
    for (let i = 0; i < 75; i++) { stepDay(a); stepDay(b); }
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


describe('wealth-weighted interest-group clout', () => {
  const makeState = () => {
    const state = fresh('historical', 61, 'GBR');
    const country = state.countries.GBR;
    country.techs = [...new Set([...country.techs, 'socialist_thought'])];
    for (const region of state.regions) {
      const economy = region.popEconomy ?? {
        employed: new Array(STRATA.length).fill(0),
        incomePerCapita: new Array(STRATA.length).fill(600),
        wagePerWorker: new Array(STRATA.length).fill(0),
        sol: new Array(STRATA.length).fill(region.sol),
      };
      region.popEconomy = { ...economy, incomePerCapita: new Array(STRATA.length).fill(600) };
    }
    return state;
  };

  it('gives a richer aristocracy more landowner clout at the same population size', () => {
    const baseline = makeState();
    updatePolitics(baseline, baseline.countries.GBR, true);
    const baselineClout = baseline.countries.GBR.igs.landowners.clout;

    const wealthy = makeState();
    const aristocrats = STRATA.indexOf('aristocrats');
    for (const region of wealthy.regions) {
      if (!region.popEconomy) continue;
      region.popEconomy.incomePerCapita[aristocrats] = 3000;
    }
    updatePolitics(wealthy, wealthy.countries.GBR, true);
    expect(wealthy.countries.GBR.igs.landowners.clout).toBeGreaterThan(baselineClout);
  });

  it('makes a wealthier industrial workforce strengthen trade unions when unlocked', () => {
    const baseline = makeState();
    updatePolitics(baseline, baseline.countries.GBR, true);
    const baselineClout = baseline.countries.GBR.igs.trade_unions.clout;

    const wealthy = makeState();
    const workers = STRATA.indexOf('workers');
    const laborers = STRATA.indexOf('laborers');
    for (const region of wealthy.regions) {
      if (!region.popEconomy) continue;
      region.popEconomy.incomePerCapita[workers] = 2400;
      region.popEconomy.incomePerCapita[laborers] = 1800;
    }
    updatePolitics(wealthy, wealthy.countries.GBR, true);
    expect(wealthy.countries.GBR.igs.trade_unions.clout).toBeGreaterThan(baselineClout);
  });

  it('keeps neutral political weight for legacy regions with no cohort income ledger', () => {
    const baseline = makeState();
    updatePolitics(baseline, baseline.countries.GBR, true);
    const baselineClout = baseline.countries.GBR.igs.landowners.clout;
    const legacy = makeState();
    for (const region of legacy.regions) delete region.popEconomy;
    updatePolitics(legacy, legacy.countries.GBR, true);
    expect(legacy.countries.GBR.igs.landowners.clout).toBeCloseTo(baselineClout, 6);
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


describe('cohort-level demographic transition', () => {
  it('higher-SoL cohorts gain net natural growth while regional aggregate rates stay calibrated', () => {
    const shares = new Array(STRATA.length).fill(0);
    const peasants = STRATA.indexOf('peasants');
    const workers = STRATA.indexOf('workers');
    shares[peasants] = 0.6;
    shares[workers] = 0.4;
    const equalSol = new Array(STRATA.length).fill(0.5);
    const stratifiedSol = [...equalSol];
    stratifiedSol[peasants] = 0.2;
    stratifiedSol[workers] = 0.8;

    const equal = stratifiedNaturalChange(100000, shares, equalSol, 0.036, 0.029);
    const varied = stratifiedNaturalChange(100000, shares, stratifiedSol, 0.036, 0.029);
    const expectedPopulation = 100000 * (1 + (0.036 - 0.029) / 12);

    expect(equal.population).toBeCloseTo(expectedPopulation, 8);
    expect(varied.population).toBeCloseTo(expectedPopulation, 8);
    expect(varied.strata[workers]).toBeGreaterThan(equal.strata[workers]);
    expect(varied.strata[peasants]).toBeLessThan(equal.strata[peasants]);
    expect(varied.strata.reduce((sum, share) => sum + share, 0)).toBeCloseTo(1, 10);
  });

  it('retains the legacy aggregate rate when no cohort ledger exists', () => {
    const shares = [0.7, 0.1, 0.1, 0.1, 0, 0, 0, 0, 0];
    const result = stratifiedNaturalChange(50000, shares, undefined, 0.035, 0.03);
    expect(result.population).toBeCloseTo(50000 * (1 + (0.035 - 0.03) / 12), 8);
    result.strata.forEach((share, index) => expect(share).toBeCloseTo(shares[index], 12));
  });

  it("blends incoming migrants into the destination's occupational composition", () => {
    const residents = [0.8, 0.2, 0, 0, 0, 0, 0, 0, 0];
    const arrivals = [0.2, 0.8, 0, 0, 0, 0, 0, 0, 0];
    const mixed = mixPopulationStrata(100, residents, 50, arrivals);
    expect(mixed[0]).toBeCloseTo(0.6, 10);
    expect(mixed[1]).toBeCloseTo(0.4, 10);
    expect(mixed.reduce((sum, share) => sum + share, 0)).toBeCloseTo(1, 10);
  });
});


describe('cohort migration and malformed legacy mix', () => {
  it('uses a stable fallback when an occupied region has no valid strata', () => {
    const result = stratifiedNaturalChange(10000, [0, NaN, -1], undefined, 0.03, 0.02);
    expect(result.population).toBeCloseTo(10000 * (1 + (0.03 - 0.02) / 12), 8);
    expect(result.strata[STRATA.indexOf('peasants')]).toBeCloseTo(1, 10);
    expect(result.strata.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 10);
  });

  it('does not create a zero-sum destination mix when migrant data is invalid', () => {
    const mixed = mixPopulationStrata(100, [0.7, 0.3], 20, [NaN, -1]);
    expect(mixed[0]).toBeCloseTo(0.7, 10);
    expect(mixed[1]).toBeCloseTo(0.3, 10);
    expect(mixed.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 10);
  });
});


describe('building-level staffing ledger', () => {
  it('records actual staffed workers by productive building without exceeding capacity', () => {
    const st = fresh('historical', 87, 'GBR');
    for (const region of st.regions) {
      const ledger = region.popEconomy?.employedByBuilding;
      expect(ledger, region.id).toBeDefined();
      if (!ledger) continue;

      let totalBuildingStaff = 0;
      for (const building of BUILDINGS) {
        const staffed = ledger[building] ?? 0;
        const capacity = region.buildings[building] * LEVEL_WORKERS;
        expect(Number.isFinite(staffed), region.id + ' ' + building).toBe(true);
        expect(staffed, region.id + ' ' + building).toBeGreaterThanOrEqual(0);
        expect(staffed, region.id + ' ' + building).toBeLessThanOrEqual(capacity + 1e-6);
        totalBuildingStaff += staffed;
      }
      const employedLabour = region.popEconomy!.employed.reduce((sum, value) => sum + value, 0);
      expect(totalBuildingStaff, region.id).toBeLessThanOrEqual(employedLabour + 1e-6);
    }
  });
});


describe('profit-driven building employment', () => {
  it('moves hiring targets gradually toward partial-employment profitability equilibrium', () => {
    const lossTarget = nextEmploymentTarget(0.9, -0.8);
    const profitableTarget = nextEmploymentTarget(0.5, 0.8);
    const neutralTarget = nextEmploymentTarget(0.55, 0);

    expect(lossTarget).toBeLessThan(0.9);
    expect(lossTarget).toBeGreaterThan(0.1);
    expect(profitableTarget).toBeGreaterThan(0.5);
    expect(neutralTarget).toBeGreaterThan(0.55);
    expect(neutralTarget).toBeLessThan(0.62);
    expect(nextEmploymentTarget(undefined, -5)).toBeGreaterThanOrEqual(0.1);
    expect(nextEmploymentTarget(undefined, 5)).toBeLessThanOrEqual(1);
  });

  it('allocates scarce labor toward more attractive employers without exceeding demand', () => {
    const allocated = allocateCompetingWorkers(1000, [
      { building: 'mine', workersWanted: 1000, attractiveness: 1.8 },
      { building: 'logging', workersWanted: 1000, attractiveness: 0.4 },
    ]);
    const mine = allocated.mine ?? 0;
    const logging = allocated.logging ?? 0;

    expect(mine).toBeGreaterThan(logging);
    expect(mine + logging).toBeCloseTo(1000, 6);
    expect(mine).toBeLessThanOrEqual(1000);
    expect(logging).toBeLessThanOrEqual(1000);
  });

  it('keeps employment targets and realized margins finite in both simulation modes', () => {
    for (const mode of ['historical', 'sandbox'] as const) {
      const state = fresh(mode, 92, 'GBR');
      stepMonth(state);
      const regions = state.regions.filter((region) => region.owner === 'GBR' && region.pop > 0);
      expect(regions.length).toBeGreaterThan(0);
      for (const region of regions) {
        const targets = region.popEconomy?.employmentTargetByBuilding;
        expect(targets).toBeDefined();
        for (const building of BUILDINGS) {
          const target = targets?.[building];
          if (target !== undefined) {
            expect(Number.isFinite(target), region.id + ' ' + building).toBe(true);
            expect(target).toBeGreaterThanOrEqual(0.1);
            expect(target).toBeLessThanOrEqual(1);
          }
          const margin = region.popEconomy?.profitabilityByBuilding?.[building];
          if (margin !== undefined) {
            expect(Number.isFinite(margin), region.id + ' ' + building).toBe(true);
            expect(margin).toBeGreaterThanOrEqual(-1);
            expect(margin).toBeLessThanOrEqual(1);
          }
          const offer = region.popEconomy?.wageOfferByBuilding?.[building];
          if (offer !== undefined) {
            expect(Number.isFinite(offer), region.id + ' ' + building).toBe(true);
            expect(offer).toBeGreaterThanOrEqual(0.75);
            expect(offer).toBeLessThanOrEqual(1.5);
          }
          const wageBill = region.popEconomy?.wageBillByBuilding?.[building];
          if (wageBill !== undefined) {
            expect(Number.isFinite(wageBill), region.id + ' ' + building).toBe(true);
            expect(wageBill).toBeGreaterThanOrEqual(0);
          }
        }
      }
    }
  });
});


describe('employment-aware occupational transition', () => {
  it('reduces future worker migration when factories lower their hiring targets', () => {
    const state = fresh('historical', 93, 'GBR');
    const region = state.regions.find((entry) => entry.owner === 'GBR' && entry.pop > 0)!;
    region.buildings.textile_mill = 3;
    region.buildings.ironworks = 2;
    region.buildings.mine = 2;
    region.buildings.logging = 1;
    region.buildings.plantation = 1;

    // Establish a true 100% baseline. createGame() now seeds hiring targets during
    // its initial economy calibration, so unspecified building targets are not a
    // reliable proxy for full nominal capacity in this isolated comparison.
    const initialEconomy = region.popEconomy ?? {
      employed: new Array(STRATA.length).fill(0),
      incomePerCapita: new Array(STRATA.length).fill(0),
      wagePerWorker: new Array(STRATA.length).fill(0),
      sol: new Array(STRATA.length).fill(0),
    };
    region.popEconomy = {
      ...initialEconomy,
      employmentTargetByBuilding: {
        textile_mill: 1,
        ironworks: 1,
        tool_works: 1,
        arms_works: 1,
        luxury_workshop: 1,
        mine: 1,
        logging: 1,
        plantation: 1,
      },
    };
    const fullCapacity = effectiveBuildingLaborDemand(region);
    region.popEconomy = {
      ...(region.popEconomy ?? {
        employed: new Array(STRATA.length).fill(0),
        incomePerCapita: new Array(STRATA.length).fill(0),
        wagePerWorker: new Array(STRATA.length).fill(0),
        sol: new Array(STRATA.length).fill(0),
      }),
      employmentTargetByBuilding: {
        textile_mill: 0.25,
        ironworks: 0.25,
        mine: 0.3,
        logging: 0.3,
        plantation: 0.3,
      },
    };
    const reducedCapacity = effectiveBuildingLaborDemand(region);

    expect(reducedCapacity.factoryWorkers).toBeLessThan(fullCapacity.factoryWorkers);
    expect(reducedCapacity.laborerWorkers).toBeLessThan(fullCapacity.laborerWorkers);
    expect(reducedCapacity.factoryWorkers).toBeGreaterThanOrEqual(0);
    expect(reducedCapacity.laborerWorkers).toBeGreaterThanOrEqual(0);

    // Open positions must still attract peasants even before a local laborer class exists.
    const withoutLaborers = {
      ...region,
      strata: region.strata.map((share, index) => index === STRATA.indexOf('laborers') ? 0 : share),
    };
    expect(effectiveBuildingLaborDemand(withoutLaborers).laborerWorkers).toBeGreaterThan(0);
  });

  it('keeps full-capacity fallback for legacy saves with no hiring ledger', () => {
    const state = fresh('historical', 94, 'GBR');
    const region = state.regions.find((entry) => entry.owner === 'GBR' && entry.pop > 0)!;
    region.buildings.textile_mill = 2;
    region.buildings.mine = 1;

    // The reference legacy save has no target ledger, so every existing level
    // defaults to full nominal capacity regardless of the fresh state's prior targets.
    const legacyRegion = {
      ...region,
      popEconomy: region.popEconomy ? { ...region.popEconomy } : undefined,
    };
    if (legacyRegion.popEconomy) delete legacyRegion.popEconomy.employmentTargetByBuilding;
    const expected = effectiveBuildingLaborDemand(legacyRegion);

    const targetedRegion = {
      ...region,
      popEconomy: {
        ...(region.popEconomy ?? {
          employed: new Array(STRATA.length).fill(0),
          incomePerCapita: new Array(STRATA.length).fill(0),
          wagePerWorker: new Array(STRATA.length).fill(0),
          sol: new Array(STRATA.length).fill(0),
        }),
        employmentTargetByBuilding: {
          plantation: 0.25, mine: 0.25, logging: 0.25, textile_mill: 0.25,
          ironworks: 0.25, tool_works: 0.25, arms_works: 0.25, luxury_workshop: 0.25,
        },
      },
    };
    const reduced = effectiveBuildingLaborDemand(targetedRegion);
    const after = effectiveBuildingLaborDemand(legacyRegion);

    expect(reduced.factoryWorkers).toBeLessThan(expected.factoryWorkers);
    expect(reduced.laborerWorkers).toBeLessThan(expected.laborerWorkers);
    expect(after.factoryWorkers).toBeCloseTo(expected.factoryWorkers, 8);
    expect(after.laborerWorkers).toBeCloseTo(expected.laborerWorkers, 8);
  });
});


describe("investment follows the firm's hiring outlook", () => {
  it('discounts the return of a new factory level when its local hiring target is low', () => {
    const state = fresh('historical', 55, 'GBR');
    const country = state.countries.GBR;
    const region = state.regions.find((entry) => entry.owner === 'GBR' && entry.pop > 0)!;
    region.pop = 1_000_000;
    region.strata = [0.2, 0, 0.05, 0.05, 0.65, 0.02, 0.01, 0.01, 0.01];
    for (const building of BUILDINGS) region.buildings[building] = 0;
    const market = marketOf(state, country);
    state.marketPrices[market] = {
      ...(state.marketPrices[market] ?? state.worldPrices),
      textiles: 8,
      cotton: 0.05,
      coal: 0.05,
      grain: 0.05,
      tools: 1,
      steel: 1,
    };
    country.productivity = 2;

    const ledger = region.popEconomy ?? {
      employed: new Array(STRATA.length).fill(0),
      incomePerCapita: new Array(STRATA.length).fill(0),
      wagePerWorker: new Array(STRATA.length).fill(0),
      sol: new Array(STRATA.length).fill(0),
    };
    region.popEconomy = { ...ledger };
    if (region.popEconomy) delete region.popEconomy.employmentTargetByBuilding;
    const fullHiringReturn = buildingReturn(state, country, region, 'textile_mill');
    region.popEconomy = {
      ...region.popEconomy,
      employmentTargetByBuilding: { textile_mill: 0.2 },
    };
    const reducedHiringReturn = buildingReturn(state, country, region, 'textile_mill');
    region.popEconomy = {
      ...region.popEconomy,
      employmentTargetByBuilding: { textile_mill: 0.2 },
      wageOfferByBuilding: { textile_mill: 1.5 },
    };
    const highWageReturn = buildingReturn(state, country, region, 'textile_mill');

    expect(fullHiringReturn).toBeGreaterThan(0);
    expect(reducedHiringReturn).toBeCloseTo(fullHiringReturn * 0.2, 8);
    expect(highWageReturn).toBeLessThan(reducedHiringReturn);
  });
});


describe('firm wage bidding and fixed regional wage pool', () => {
  it('redistributes wages toward higher offers without creating additional household income', () => {
    const st = fresh('historical', 72, 'GBR');
    const prices = st.marketPrices.GBR ?? st.worldPrices;
    const shares = [0.4, 0.02, 0.2, 0.08, 0.12, 0.08, 0.03, 0.05, 0.02];
    const population = 100000;
    const employment = shares.map((share, index) => index >= 7 ? 0 : population * share * 0.45);
    const workers = STRATA.indexOf('workers');
    const laborers = STRATA.indexOf('laborers');
    const workerMix = {
      textile_mill: { [workers]: 1200 },
      mine: { [laborers]: 900 },
    };
    const valueAdded = 45_000_000;
    const standard = calculatePopulationEconomy(
      population, shares, employment, valueAdded, prices, 0.07, 0.02, 'free_labor', workerMix, {},
    );
    const bidding = calculatePopulationEconomy(
      population, shares, employment, valueAdded, prices, 0.07, 0.02, 'free_labor',
      workerMix, { textile_mill: 1.5, mine: 0.75 },
    );
    const totalWages = (economy: typeof standard) => economy.wagePerWorker.reduce(
      (sum, wage, index) => sum + wage * economy.employed[index],
      0,
    );
    const totalIncome = (economy: typeof standard) => economy.incomePerCapita.reduce(
      (sum, income, index) => sum + income * population * shares[index],
      0,
    );

    expect(bidding.wageBillByBuilding?.textile_mill).toBeGreaterThan(standard.wageBillByBuilding?.textile_mill ?? 0);
    expect(bidding.wageBillByBuilding?.mine).toBeLessThan(standard.wageBillByBuilding?.mine ?? 0);
    expect(totalWages(bidding)).toBeCloseTo(valueAdded * 0.68, 5);
    expect(totalWages(bidding)).toBeCloseTo(totalWages(standard), 5);
    expect(totalIncome(bidding)).toBeCloseTo(valueAdded, 3);
    expect(
      Object.values(bidding.wageBillByBuilding ?? {}).reduce((sum, bill) => sum + (bill ?? 0), 0),
    ).toBeLessThanOrEqual(totalWages(bidding) + 1e-6);
  });

  it('raises offers for profitable vacancies and lowers them for loss-making firms', () => {
    const profitable = nextWageOffer(1, 0.6, 0.8);
    const lossMaking = nextWageOffer(1, -0.6, 0.9);
    expect(profitable).toBeGreaterThan(1);
    expect(lossMaking).toBeLessThan(1);
    expect(nextWageOffer(0.75, -1, 1)).toBe(0.75);
    expect(nextWageOffer(1.5, 1, 1)).toBe(1.5);
    expect(nextWageOffer(undefined, NaN, NaN)).toBe(1);
  });
});
