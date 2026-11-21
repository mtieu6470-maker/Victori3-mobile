// CLOCK-02 SimCore protocol: generations, stale-request rejection, failure isolation, snapshot policy
// and determinism through the request interface.
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { SimCore } from '../src/engine/runtime/simCore';
import { createGame } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';
import { serialize } from '../src/engine/save';
import { monthStartHour } from '../src/engine/clock/calendar';

loadNodeData();
const opts = { mode: 'historical' as const, seed: 21, player: null };

describe('CLOCK-02 SimCore protocol', () => {
  it('rejects requests from an older generation and never lets them touch the new game', () => {
    const core = new SimCore(() => 0);
    expect(core.handle({ kind: 'newGame', gen: 1, opts }).ok).toBe(true);
    expect(core.handle({ kind: 'newGame', gen: 2, opts: { ...opts, mode: 'sandbox' } }).ok).toBe(true);
    const stale = core.handle({ kind: 'advance', gen: 1, maxHours: 10, budgetMs: 8 });
    expect(stale).toMatchObject({ ok: false, stale: true });
    expect(core.state!.clock.hour).toBe(0);
    expect(core.handle({ kind: 'newGame', gen: 2, opts })).toMatchObject({ ok: false, stale: true }); // generations only increase
    expect(core.state!.mode).toBe('sandbox');
  });

  it('a failed load keeps the current game and generation', () => {
    const core = new SimCore(() => 0);
    core.handle({ kind: 'newGame', gen: 1, opts });
    const bad = core.handle({ kind: 'load', gen: 2, text: '{"format":"other"}' });
    expect(bad).toMatchObject({ ok: false });
    expect(core.handle({ kind: 'advance', gen: 1, maxHours: 5, budgetMs: 1e9 })).toMatchObject({ ok: true, hours: 5 });
  });

  it('sends a snapshot only when more than the clock changed (unless asked never to)', () => {
    const core = new SimCore(() => 0);
    core.handle({ kind: 'newGame', gen: 1, opts });
    const intra = core.handle({ kind: 'advance', gen: 1, maxHours: 100, budgetMs: 1e9 });
    expect(intra).toMatchObject({ ok: true, kind: 'advance', hours: 100, monthlyBoundaries: 0 });
    expect((intra as { snapshot?: unknown }).snapshot).toBeUndefined();
    const boundary = core.handle({ kind: 'advance', gen: 1, maxHours: monthStartHour(1) - 100, budgetMs: 1e9 });
    expect(boundary).toMatchObject({ monthlyBoundaries: 1, tick: 1 });
    expect((boundary as { snapshot?: unknown }).snapshot).toBeDefined();
    const silent = core.handle({ kind: 'advance', gen: 1, maxHours: monthStartHour(2) - monthStartHour(1), budgetMs: 1e9, snapshot: 'never' });
    expect(silent).toMatchObject({ monthlyBoundaries: 1, tick: 2 });
    expect((silent as { snapshot?: unknown }).snapshot).toBeUndefined();
  });

  it('is deterministic: the request path reproduces direct engine stepping byte-for-byte', () => {
    const direct = createGame(opts);
    for (let i = 0; i < 3; i++) stepMonth(direct);
    const core = new SimCore(() => 0);
    core.handle({ kind: 'newGame', gen: 1, opts });
    // Irregular chunk sizes, as real-time pacing would send.
    let left = monthStartHour(3);
    for (const n of [7, 300, 1, 900, 24]) { core.handle({ kind: 'advance', gen: 1, maxHours: n, budgetMs: 1e9 }); left -= n; }
    core.handle({ kind: 'advance', gen: 1, maxHours: left, budgetMs: 1e9 });
    expect(JSON.stringify(core.state)).toBe(JSON.stringify(direct));
    const saved = core.handle({ kind: 'save', gen: 1, meta: {} });
    expect(saved).toMatchObject({ ok: true, kind: 'save' });
    expect(JSON.parse((saved as { text: string }).text).state).toEqual(JSON.parse(serialize(direct)).state);
  });

  it('reports engine errors as failed responses instead of throwing across the boundary', () => {
    const core = new SimCore(() => 0);
    core.handle({ kind: 'newGame', gen: 1, opts });
    (core.state as { rng?: unknown }).rng = undefined;
    const r = core.handle({ kind: 'save', gen: 1, meta: {} });
    expect(r).toMatchObject({ ok: false });
    expect((r as { error: string }).error).toMatch(/RNG/);
  });
});
