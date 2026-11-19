// Simulation sanity: economy and population stay plausible, AI does not get stuck, save/load is deterministic.
import { describe, it, expect } from 'vitest';
import { run, fresh, stepMonth } from './helpers';
import { serialize, deserialize } from '../src/engine/save';
import { data } from '../src/engine/data/db';

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
        console.log(`[POPULATION_BENCHMARK] ${mode} ${id} simulated=${Math.round(c.stats.pop)} benchmark=${Math.round(ref)} ratio=${ratio.toFixed(4)}`);
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
