// Historical Mode vs Sandbox Mode vs Observer Mode on ONE engine: parity, tendency, freedom, intervention.
import { describe, it, expect } from 'vitest';
import { run, fresh, stepMonth } from './helpers';
import { SYSTEMS } from '../src/engine/simulation';
import { MODES } from '../src/engine/modes';
import { data } from '../src/engine/data/db';
import { territorialSimilarity } from '../src/engine/divergence';

const SEEDS = [1, 2, 3];
const YEARS = 40;

describe('one engine, two modes', () => {
  it('both modes run exactly the same systems the same number of times', () => {
    const h = run('historical', 7, 10), s = run('sandbox', 7, 10);
    expect(Object.keys(h.counters.systemRuns).sort()).toEqual(SYSTEMS.map((x) => x.name).sort());
    expect(h.counters.systemRuns).toEqual(s.counters.systemRuns);
  });
  it('mode configuration only toggles historical data layers (no rule or system switches)', () => {
    const keys = Object.keys(MODES.historical).sort();
    expect(keys).toEqual(['datedExogenousEvents', 'decisionWindows', 'historicalCustomsAccessions', 'historicalPriorities', 'historicalSuccession', 'mode', 'priorityBiasScale']);
  });
  it('AI activity is not reduced in either mode', () => {
    const h = run('historical', 7, 10), s = run('sandbox', 7, 10);
    for (const k of ['budget', 'construction', 'research', 'improve_relations']) {
      const a = h.counters.aiActions[k] ?? 0, b = s.counters.aiActions[k] ?? 0;
      expect(a, k).toBeGreaterThan(0); expect(b, k).toBeGreaterThan(0);
      expect(a / b, k).toBeGreaterThan(0.5); expect(a / b, k).toBeLessThan(2);
    }
  });
  it('the historical layer is active only in Historical Mode', () => {
    const h = run('historical', 7, 10), s = run('sandbox', 7, 10);
    expect(h.counters.historicalBiasApplied).toBeGreaterThan(0);
    expect(h.counters.decisionWindowsFired).toBeGreaterThan(0);
    expect(s.counters.historicalBiasApplied).toBe(0);
    expect(s.counters.decisionWindowsFired).toBe(0);
  });
});

describe('Historical Mode follows history more closely, without railroading', () => {
  const pairs = SEEDS.map((seed) => ({ h: run('historical', seed, YEARS), s: run('sandbox', seed, YEARS) }));
  const ms = (st: ReturnType<typeof run>) => st.divergence.similarity.at(-1)!.milestones;
  it('mean milestone similarity is higher in Historical Mode than in Sandbox (paired seeds)', () => {
    const mh = pairs.reduce((a, p) => a + ms(p.h), 0) / pairs.length;
    const msb = pairs.reduce((a, p) => a + ms(p.s), 0) / pairs.length;
    console.log('milestone similarity historical', mh.toFixed(3), 'sandbox', msb.toFixed(3));
    expect(mh).toBeGreaterThan(msb);
  });
  it('Historical Mode does not reproduce history exactly (some milestones are missed)', () => {
    for (const p of pairs) expect(Object.values(p.h.divergence.milestones).some((m) => m.status === 'missed')).toBe(true);
  });
  it('historical priorities stop applying when their prerequisites disappear', () => {
    // QNG opium priority for Britain requires Qing isolationism; once Qing opens, the bias is gone
    const st = fresh('historical', 4);
    st.countries.QNG.laws.trade = 'protectionism';
    st.date = { y: 1840, m: 1 };
    const pr = data().entity.get('GBR')!.priorities.find((p) => p.id === 'GBR_open_china')!;
    expect(pr).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return import('../src/engine/historical').then(({ activePriorities }) => {
      expect(activePriorities(st, st.countries.GBR).some((p) => p.id === 'GBR_open_china')).toBe(false);
      st.countries.QNG.laws.trade = 'isolationism';
      expect(activePriorities(st, st.countries.GBR).some((p) => p.id === 'GBR_open_china')).toBe(true);
    });
  });
});

describe('Sandbox Mode is free', () => {
  const runs = SEEDS.map((seed) => run('sandbox', seed, YEARS));
  it('different seeds produce different worlds', () => {
    let differing = 0;
    for (let i = 0; i < runs.length; i++) for (let j = i + 1; j < runs.length; j++) differing += runs[i].regions.filter((r, k) => r.owner !== runs[j].regions[k].owner).length;
    expect(differing).toBeGreaterThan(0);
  });
  it('wars, historical diplomatic pacts, territorial and institutional changes emerge', () => {
    for (const st of runs) {
      expect(st.counters.aiActions.declare_war ?? 0).toBeGreaterThan(5);
      expect(st.treaties.some((treaty) => treaty.type === 'defensive_pact')).toBe(true);
      expect(st.territoryLog.length).toBeGreaterThan(3);
      expect(st.log.filter((l) => l.type === 'law').length).toBeGreaterThan(5);
    }
  });
  it('produces non-historical outcomes (territory changes that differ from the historical owner)', () => {
    const nonHist = runs.reduce((a, st) => a + st.territoryLog.filter((t) => t.historicalMatch === false).length, 0);
    expect(nonHist).toBeGreaterThan(0);
  });
});

describe('Observer Mode runs every country with the same AI', () => {
  const st = run('historical', 11, 8);
  it('every surviving country — including the smallest — takes AI decisions', () => {
    const alive = Object.values(st.countries).filter((c) => c.alive);
    const idle = alive.filter((c) => !(st.counters.aiActionsByCountry[c.id] > 0)).map((c) => c.id);
    expect(idle).toEqual([]);
    for (const id of ['LIE', 'SMR', 'RGR', 'HAW', 'BHU']) if (st.countries[id]?.alive) expect(st.counters.aiActionsByCountry[id]).toBeGreaterThan(10);
  });
});

describe('player intervention changes history', () => {
  it('a non-historical war declared by the player creates divergence from the AI-only run', () => {
    const base = run('historical', 5, 6);
    const played = run('historical', 5, 6, 'PRU', {
      2: [{ type: 'set_army_target', manpower: 400000 }],
      11: [{ type: 'break_defensive_pact', target: 'BAV' }],
      12: [{ type: 'declare_war', target: 'BAV', goals: [{ by: 'PRU', type: 'conquer', target: 'BAV', regions: ['BAV_FRA'] }] }],
    });
    expect(played.log.some((l) => l.type === 'war' && l.text.includes('Prussia declares war on Kingdom of Bavaria'))).toBe(true);
    const diff = played.regions.filter((r, i) => r.owner !== base.regions[i].owner || Math.abs(r.pop - base.regions[i].pop) > 1).length;
    expect(diff).toBeGreaterThan(0);
  });
  it('Observer Mode rejects player commands (no country under control)', async () => {
    const { execute } = await import('../src/engine/commands');
    const st = fresh('sandbox', 1, null);
    expect(execute(st, { type: 'set_tax', rate: 0.1 }).ok).toBe(false);
  });
});

describe('historical succession is exogenous in Historical Mode only', () => {
  it('Victoria succeeds William IV in June 1837 and Hanover separates (Salic law)', () => {
    const st = fresh('historical', 2);
    while (st.date.y < 1837 || (st.date.y === 1837 && st.date.m < 8)) stepMonth(st);
    expect(st.countries.GBR.leader.name).toBe('Victoria');
    expect(st.countries.HAN.overlord).toBeNull();
  });
  it('Sandbox Mode does not use recorded death dates (generated or heir successions only)', () => {
    const st = run('sandbox', 2, 12);
    const gbr = st.log.filter((l) => l.type === 'succession' && l.actors.includes('GBR'));
    for (const l of gbr) expect(l.date === '1837-06-01' && l.text.includes('Victoria')).toBe(false);
  });
});

describe('territorial similarity is measured identically in both modes', () => {
  it('is 1.0 at start in both modes (same starting world)', () => {
    expect(territorialSimilarity(fresh('historical'))).toBeCloseTo(1, 5);
    expect(territorialSimilarity(fresh('sandbox'))).toBeCloseTo(1, 5);
  });
});
