// Simulation sanity: economy and population stay plausible, AI does not get stuck, save/load is deterministic.
import { describe, it, expect } from 'vitest';
import { run, fresh, stepMonth } from './helpers';
import { serialize, deserialize } from '../src/engine/save';
import { data } from '../src/engine/data/db';
import { availableProductionMethods, productionMethodFor, setProductionMethod } from '../src/engine/systems/economy';
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
    for (const country of Object.values(legacy.state.countries)) delete country.constructionQueue;
    const loaded = deserialize(JSON.stringify(legacy));
    expect(Object.values(loaded.countries).every((country) => Array.isArray(country.constructionQueue))).toBe(true);
  });
});
