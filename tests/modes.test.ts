// Historical Mode vs Sandbox Mode vs Observer Mode on ONE engine: parity, tendency, freedom, intervention.
import { describe, it, expect } from 'vitest';
import { run, fresh, stepMonth } from './helpers';
import { SYSTEMS } from '../src/engine/simulation';
import { MODES } from '../src/engine/modes';
import { data } from '../src/engine/data/db';
import { territorialSimilarity } from '../src/engine/divergence';
import { createConditionEvalContext, evalCondition } from '../src/engine/historical';
import { rankings } from '../src/engine/metrics';
import { execute } from '../src/engine/commands';

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
    for (const k of ['budget', 'construction', 'research', 'improve_relations', 'alliance']) {
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
  it('wars, alliances, territorial and institutional changes emerge', () => {
    console.log('[SANDBOX_DIPLOMACY_DIAG]', JSON.stringify(runs.map((st, i) => ({
      seed: SEEDS[i],
      actions: st.counters.aiActions,
      alliances: st.treaties.filter((t) => t.type === 'alliance').length,
      rivalries: st.rivalries.length,
      alive: Object.values(st.countries).filter((country) => country.alive && !country.decentralized).length,
      lawEntries: st.log.filter((entry) => entry.type === 'law').length,
      reformStarts: st.log.filter((entry) => entry.text.includes('begins debating')).length,
      reformFailures: st.log.filter((entry) => entry.text.includes('reform of') && entry.text.includes('failed')).length,
      reformsInProgress: Object.values(st.countries).filter((country) => !!country.reform).length,
      remainingReforms: Object.values(st.countries).filter((country) => !!country.reform).map((country) => [country.id, country.reform!.group, Number(country.reform!.progress.toFixed(3))]),
      failedReformSamples: st.log.filter((entry) => entry.text.includes('reform of') && entry.text.includes('failed')).slice(0, 6).map((entry) => entry.text),
      relationsAbove20: Object.values(st.relations).filter((v) => v >= 20).length,
      gdpTop: Object.values(st.countries).filter((country) => country.alive && !country.decentralized).sort((a, b) => b.gdp - a.gdp).slice(0, 5).map((country) => [country.id, Math.round(country.gdp)]),
    }))));
    for (const st of runs) {
      expect(st.counters.aiActions.declare_war ?? 0).toBeGreaterThan(5);
      expect(st.counters.aiActions.alliance ?? 0).toBeGreaterThan(5);
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
    const played = run('historical', 5, 6, 'PRU', { 2: [{ type: 'set_army_target', manpower: 400000 }], 12: [{ type: 'declare_war', target: 'BAV', goals: [{ by: 'PRU', type: 'conquer', target: 'BAV', regions: ['BAV_FRA'] }] }] });
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


describe('canonical rank_at_most condition', () => {
  function rankFixture() {
    const st = fresh('historical', 17);
    for (const country of Object.values(st.countries)) country.alive = false;

    const setPower = (id: string, gdp: number) => {
      const country = st.countries[id];
      country.alive = true;
      country.decentralized = false;
      country.gdp = gdp;
      country.army.manpower = 0;
      country.army.quality = 1;
      country.army.supply = 1;
      country.army.morale = 1;
      country.navy.strength = 0;
      country.navy.quality = 1;
      country.prestige = 0;
      return country;
    };

    setPower('GBR', 4e9);
    setPower('FRA', 4e9);
    setPower('USA', 1e9);
    // Subjects are eligible under the public rankings() contract.
    st.countries.FRA.overlord = 'GBR';
    return st;
  }

  it('uses canonical power score, includes subjects and applies the maximum competition rank', () => {
    const st = rankFixture();
    const context = createConditionEvalContext(st);

    expect(evalCondition(st, { type: 'rank_at_most', entity: 'GBR', rank: 1 }, undefined, context)).toBe(true);
    expect(evalCondition(st, { type: 'rank_at_most', entity: 'FRA', rank: 1 }, undefined, context)).toBe(true);
    expect(evalCondition(st, { type: 'rank_at_most', entity: 'USA', rank: 2 }, undefined, context)).toBe(false);
    expect(context.powerRanks.rankByEntity.FRA).toBe(1);
    expect(context.powerRanks.rankByEntity.USA).toBe(3);
  });

  it('gives exact ties the same competition rank and stable ID display ordering', () => {
    const st = rankFixture();
    const context = createConditionEvalContext(st);
    const ordered = rankings(st);

    expect(ordered.map((row) => row.id)).toEqual(['FRA', 'GBR', 'USA']);
    expect(context.powerRanks.rankByEntity.FRA).toBe(1);
    expect(context.powerRanks.rankByEntity.GBR).toBe(1);
    expect(context.powerRanks.rankByEntity.USA).toBe(3);
  });

  it('fails closed for dead, decentralized, unknown targets and invalid thresholds', () => {
    const st = rankFixture();
    st.countries.USA.alive = false;
    st.countries.QNG.alive = true;
    st.countries.QNG.decentralized = true;
    const context = createConditionEvalContext(st);

    expect(evalCondition(st, { type: 'rank_at_most', entity: 'USA', rank: 1 }, undefined, context)).toBe(false);
    expect(evalCondition(st, { type: 'rank_at_most', entity: 'QNG', rank: 1 }, undefined, context)).toBe(false);
    expect(evalCondition(st, { type: 'rank_at_most', entity: 'UNKNOWN', rank: 1 }, undefined, context)).toBe(false);
    expect(evalCondition(st, { type: 'rank_at_most', entity: 'GBR', rank: 0 }, undefined, context)).toBe(false);
    expect(evalCondition(st, { type: 'rank_at_most', entity: 'GBR', rank: 1.5 }, undefined, context)).toBe(false);
    expect(context.diagnostics.length).toBeGreaterThan(0);
  });

  it('fails closed when any eligible candidate has a non-finite power score', () => {
    const st = rankFixture();
    st.countries.USA.gdp = Number.NaN;
    const context = createConditionEvalContext(st);

    expect(context.powerRanks.valid).toBe(false);
    expect(evalCondition(st, { type: 'rank_at_most', entity: 'GBR', rank: 1 }, undefined, context)).toBe(false);
    expect(context.diagnostics.some((message) => message.includes('Non-finite'))).toBe(true);
  });

  it('shares one immutable per-tick context through nested all/any expressions', () => {
    const st = rankFixture();
    const context = createConditionEvalContext(st);
    const nested = {
      type: 'all',
      of: [
        { type: 'rank_at_most', entity: 'GBR', rank: 1 },
        {
          type: 'any',
          of: [
            { type: 'rank_at_most', entity: 'USA', rank: 3 },
            { type: 'rank_at_most', entity: 'USA', rank: 1 },
          ],
        },
      ],
    };

    expect(createConditionEvalContext(st)).toBe(context);
    expect(evalCondition(st, nested, undefined, context)).toBe(true);
    st.tick += 1;
    expect(evalCondition(st, { type: 'rank_at_most', entity: 'GBR', rank: 1 }, undefined, context)).toBe(false);
    expect(context.powerRanks.tick).not.toBe(st.tick);
  });
});


describe('player decision command revalidation and safe consumption', () => {
  function queueDanishDecision() {
    const st = fresh('historical', 29, 'DEN');
    st.date = { y: 1848, m: 1 };
    st.countries.DEN.laws.power = 'autocracy';
    const window = data().db.decision_windows.find((item) => item.id === 'dw_danish_june_constitution')!;
    st.pendingPlayerDecisions.push({
      id: 'pd_test_danish_constitution',
      windowId: window.id,
      options: window.options.map((option) => ({ id: option.id, historical: option.historical })),
    });
    return { st, window };
  }

  it('applies a canonical current option, consumes it only after success, and is idempotent on retry', () => {
    const { st } = queueDanishDecision();
    const command = { type: 'decide' as const, pendingId: 'pd_test_danish_constitution', option: 'june_constitution' };

    expect(execute(st, command)).toEqual({ ok: true });
    expect(st.countries.DEN.laws.power).toBe('census_suffrage');
    expect(st.countries.DEN.laws.press).toBe('free_press');
    expect(st.pendingPlayerDecisions).toHaveLength(0);
    expect(st.firedEvents.filter((id) => id === 'dw_danish_june_constitution')).toHaveLength(1);
    expect(st.counters.decisionWindowsFired).toBe(1);
    expect(execute(st, command).ok).toBe(false);
    expect(st.counters.decisionWindowsFired).toBe(1);
  });

  it('rejects an option that was not offered without consuming or mutating the decision', () => {
    const { st } = queueDanishDecision();
    const result = execute(st, {
      type: 'decide',
      pendingId: 'pd_test_danish_constitution',
      option: 'inject_arbitrary_effect',
    });

    expect(result.ok).toBe(false);
    expect(st.countries.DEN.laws.power).toBe('autocracy');
    expect(st.pendingPlayerDecisions).toHaveLength(1);
    expect(st.firedEvents).not.toContain('dw_danish_june_constitution');
    expect(st.counters.decisionWindowsFired).toBe(0);
  });

  it('does not let a different player-controlled country resolve another polity decision', () => {
    const { st } = queueDanishDecision();
    st.player = 'NED';
    const result = execute(st, {
      type: 'decide',
      pendingId: 'pd_test_danish_constitution',
      option: 'june_constitution',
    });

    expect(result.ok).toBe(false);
    expect(st.pendingPlayerDecisions).toHaveLength(1);
    expect(st.firedEvents).not.toContain('dw_danish_june_constitution');
    expect(st.countries.DEN.laws.power).toBe('autocracy');
  });

  it('invalidates an expired window without firing it or applying effects', () => {
    const { st } = queueDanishDecision();
    st.date = { y: 1851, m: 1 };
    const result = execute(st, {
      type: 'decide',
      pendingId: 'pd_test_danish_constitution',
      option: 'june_constitution',
    });

    expect(result.ok).toBe(false);
    expect(st.pendingPlayerDecisions).toHaveLength(0);
    expect(st.firedEvents).not.toContain('dw_danish_june_constitution');
    expect(st.countries.DEN.laws.power).toBe('autocracy');
    expect(st.log.some((entry) => entry.text.includes('was invalidated'))).toBe(true);
  });

  it('invalidates a pending choice when its causal preconditions no longer hold', () => {
    const { st } = queueDanishDecision();
    st.countries.DEN.laws.power = 'oligarchy';
    const result = execute(st, {
      type: 'decide',
      pendingId: 'pd_test_danish_constitution',
      option: 'june_constitution',
    });

    expect(result.ok).toBe(false);
    expect(st.pendingPlayerDecisions).toHaveLength(0);
    expect(st.firedEvents).not.toContain('dw_danish_june_constitution');
    expect(st.countries.DEN.laws.press).not.toBe('free_press');
  });

  it('invalidates tampered/stale offered-option lists before effects can execute', () => {
    const { st } = queueDanishDecision();
    st.pendingPlayerDecisions[0].options = [{ id: 'inject_arbitrary_effect', historical: true }];
    const result = execute(st, {
      type: 'decide',
      pendingId: 'pd_test_danish_constitution',
      option: 'inject_arbitrary_effect',
    });

    expect(result.ok).toBe(false);
    expect(st.pendingPlayerDecisions).toHaveLength(0);
    expect(st.firedEvents).not.toContain('dw_danish_june_constitution');
    expect(st.countries.DEN.laws.power).toBe('autocracy');
  });

  it('rejects historical pending choices in Sandbox Mode', () => {
    const st = fresh('sandbox', 29, 'DEN');
    st.pendingPlayerDecisions.push({
      id: 'pd_sandbox_invalid',
      windowId: 'dw_danish_june_constitution',
      options: [
        { id: 'june_constitution', historical: true },
        { id: 'refuse', historical: false },
      ],
    });

    const result = execute(st, {
      type: 'decide',
      pendingId: 'pd_sandbox_invalid',
      option: 'june_constitution',
    });

    expect(result.ok).toBe(false);
    expect(st.pendingPlayerDecisions).toHaveLength(1);
    expect(st.firedEvents).not.toContain('dw_danish_june_constitution');
  });

  it('preflights all option effects before mutating any state', async () => {
    const { st } = queueDanishDecision();
    // Construct a deliberately malformed canonical option with a valid first effect
    // and an unsupported trailing effect. The whole option must be rejected pre-mutation.
    const { applyWindowOption } = await import('../src/engine/systems/events');
    const window = data().db.decision_windows.find((item) => item.id === 'dw_danish_june_constitution')!;
    const option = window.options.find((item) => item.id === 'june_constitution')!;
    const original = option.effects;
    (option as any).effects = [
      { type: 'set_law', entity: 'DEN', group: 'power', value: 'census_suffrage' },
      { type: 'unsupported_effect', payload: true },
    ];
    try {
      expect(applyWindowOption(st, window.id, option.id)).toBe(false);
      expect(st.countries.DEN.laws.power).toBe('autocracy');
    } finally {
      (option as any).effects = original;
    }
  });
});


describe('decision effect transaction rollback', () => {
  it('keeps the live game unchanged when a later effect handler throws after an earlier staged mutation', async () => {
    const st = fresh('historical', 41, 'WAL');
    const { applyWindowOption } = await import('../src/engine/systems/events');
    const window = data().db.decision_windows.find((item) => item.id === 'dw_romanian_union')!;
    const option = window.options.find((item) => item.id === 'elect_cuza')!;
    const originalEffects = option.effects;

    const sourceA = st.countries.WAL;
    const sourceB = st.countries.MOL;
    sourceA.alive = true;
    sourceB.alive = true;
    if (st.countries.ROM) st.countries.ROM.alive = false;

    const regionA = st.regions[0];
    const regionB = st.regions[1];
    regionA.owner = 'WAL';
    regionA.controller = 'WAL';
    regionB.owner = 'MOL';
    regionB.controller = 'MOL';
    regionB.strata = null as any;

    const oldLaw = sourceA.laws.power;
    const ownerA = regionA.owner;
    const ownerB = regionB.owner;
    const logLength = st.log.length;
    const territoryLogLength = st.territoryLog.length;
    const nextId = st.nextId;

    (option as any).effects = [
      { type: 'set_law', entity: 'WAL', group: 'power', value: 'census_suffrage' },
      { type: 'merge', entities: ['WAL', 'MOL'], into: 'ROM' },
    ];

    try {
      // The first effect mutates the staged clone; the second throws during
      // new-state politics calculation after staged territorial transfers.
      expect(applyWindowOption(st, window.id, option.id)).toBe(false);
      expect(st.countries.WAL.laws.power).toBe(oldLaw);
      expect(st.regions[0].owner).toBe(ownerA);
      expect(st.regions[1].owner).toBe(ownerB);
      expect(st.log).toHaveLength(logLength);
      expect(st.territoryLog).toHaveLength(territoryLogLength);
      expect(st.nextId).toBe(nextId);
      expect(st.countries.ROM?.alive).not.toBe(true);
    } finally {
      (option as any).effects = originalEffects;
    }
  });
});
