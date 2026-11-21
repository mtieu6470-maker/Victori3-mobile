// DEV-006 fast-forward isolation, updated for CLOCK-01 (hour-granular chunks) and CG-11 fixes.
// The engine is mocked: each advanceHours() call advances exactly one month, so one call = one
// fast-forward chunk followed by a yield.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/engine/simulation', async () => {
  const cal = await vi.importActual<typeof import('../src/engine/clock/calendar')>('../src/engine/clock/calendar');
  return {
    stepMonth: vi.fn((state: { tick: number; clock: { hour: number } }) => {
      state.tick += 1; state.clock = { hour: cal.monthStartHour(state.tick) }; return true;
    }),
    advanceHours: vi.fn((state: { tick: number; clock: { hour: number } }, maxHours: number) => {
      if (maxHours <= 0) return { hours: 0, monthlyBoundaries: 0, stop: 'requested' };
      const before = state.clock.hour;
      state.tick += 1; state.clock = { hour: cal.monthStartHour(state.tick) };
      return { hours: state.clock.hour - before, monthlyBoundaries: 1, stop: 'yield' };
    }),
  };
});
vi.mock('../src/engine/save', () => ({
  serialize: vi.fn(() => ''),
  deserialize: vi.fn((value: string) => JSON.parse(value)),
  deserializeWithMeta: vi.fn((value: string) => ({ state: JSON.parse(value), meta: {} })),
}));
vi.mock('../src/engine/init', () => ({ createGame: vi.fn() }));

import { createGame } from '../src/engine/init';
import { advanceHours } from '../src/engine/simulation';
import { GameController } from '../src/ui/game/controller';
import { CAMPAIGN_END_TICK } from '../src/engine/core';
import { CAMPAIGN_FINAL_HOUR, monthStartHour } from '../src/engine/clock/calendar';

const fake = (tick: number) => ({ tick, clock: { hour: monthStartHour(tick) }, log: [] }) as any;

describe('GameController fast-forward isolation', () => {
  let request: ReturnType<typeof vi.fn>;
  let cancel: ReturnType<typeof vi.fn>;
  let yields: (() => void)[];

  beforeEach(() => {
    let nextId = 1;
    request = vi.fn(() => nextId++);
    cancel = vi.fn();
    yields = [];
    vi.stubGlobal('requestAnimationFrame', request);
    vi.stubGlobal('cancelAnimationFrame', cancel);
    vi.stubGlobal('setTimeout', ((callback: () => void) => { yields.push(callback); return 1; }) as typeof setTimeout);
    vi.mocked(advanceHours).mockClear();
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  /** Resolves every pending yield until the operation settles. */
  async function drain() {
    for (let i = 0; i < 10_000 && yields.length; i++) { yields.shift()!(); await Promise.resolve(); await Promise.resolve(); }
  }

  it('runs in yielded chunks, pauses the live RAF clock and restores its prior run state', async () => {
    const c = new GameController();
    c.st = fake(0);
    c.setPaused(false);
    expect(request).toHaveBeenCalledTimes(1);

    const work = c.fastForward(6);
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(c.paused).toBe(true);
    expect(c.st?.tick).toBe(1); // first bounded chunk only, then a yield
    expect(c.busy?.done).toBe(1);
    await drain(); await work;

    expect(c.st?.tick).toBe(6);
    expect(vi.mocked(advanceHours)).toHaveBeenCalledTimes(6);
    expect(c.paused).toBe(false);
    expect(c.busy).toBeNull();
    expect(request).toHaveBeenCalledTimes(2);
  });

  it('rejects overlapping fast-forward and blocks player stepping/commands while busy', async () => {
    const c = new GameController();
    c.st = fake(0);
    const first = c.fastForward(6);
    const second = c.fastForward(3);
    c.stepOnce(); c.stepDay();
    c.setPaused(false);
    expect(c.st?.tick).toBe(1);
    expect(c.paused).toBe(true);
    expect(c.command({} as any)).toEqual({ ok: false, reason: 'Đang mô phỏng, vui lòng chờ' });
    await drain(); await Promise.all([first, second]);
    expect(c.st?.tick).toBe(6);
    expect(c.busy).toBeNull();
  });

  it('does not let an invalidated fast-forward overwrite a newly loaded game', async () => {
    const c = new GameController();
    c.st = fake(0);
    const work = c.fastForward(6);
    c.load(JSON.stringify(fake(100)));
    await drain(); await work;
    expect(c.st?.tick).toBe(100);
    expect(c.busy).toBeNull();
    expect(c.paused).toBe(true);
  });

  it('does not let an invalidated fast-forward continue after a new game replaces the state', async () => {
    vi.mocked(createGame).mockReturnValue(fake(500));
    const c = new GameController();
    c.st = fake(0);
    const work = c.fastForward(6);
    c.newGame({ mode: 'historical', seed: 7, player: null });
    expect(c.st?.tick).toBe(500);
    await drain(); await work;
    expect(c.st?.tick).toBe(500);
    expect(c.paused).toBe(true);
    expect(c.busy).toBeNull();
  });

  it('CG11-01: backgrounding cancels an active fast-forward and never auto-resumes it', async () => {
    const c = new GameController();
    c.st = fake(0);
    c.setPaused(false);
    const work = c.fastForward(120);
    expect(c.st?.tick).toBe(1);
    c.onBackground();
    expect(c.busy).toBeNull();
    expect(c.paused).toBe(true);
    expect(c.pausedByLifecycle).toBe(true);
    await drain(); await work;
    expect(c.st?.tick).toBe(1); // no further months after the lifecycle pause
    expect(c.paused).toBe(true); // prior "running" state is NOT restored
    expect(request).toHaveBeenCalledTimes(1);
    c.onBackground(); // backgrounding while already paused stays paused, no spurious state
    expect(c.paused).toBe(true);
  });

  it('caps fast-forward at December 2026; the December hours stay playable until 23:00 31/12/2026', async () => {
    const c = new GameController();
    c.st = fake(CAMPAIGN_END_TICK - 2);
    c.setPaused(false);
    const work = c.fastForward(24);
    await drain(); await work;
    expect(vi.mocked(advanceHours)).toHaveBeenCalledTimes(2);
    expect(c.st?.tick).toBe(CAMPAIGN_END_TICK);
    expect(c.busy).toBeNull();
    expect(c.paused).toBe(false);

    (c.st as any).clock = { hour: CAMPAIGN_FINAL_HOUR };
    c.setPaused(true); c.setPaused(false); c.stepOnce(); c.stepDay();
    expect(c.paused).toBe(true);
    await c.fastForward(3);
    expect(vi.mocked(advanceHours)).toHaveBeenCalledTimes(2);
    expect(c.st?.tick).toBe(CAMPAIGN_END_TICK);
  });

  it('restores the live clock after a fast-forward chunk throws', async () => {
    let calls = 0;
    vi.mocked(advanceHours).mockImplementation((state: any) => {
      if (++calls === 3) throw new Error('simulated monthly step failure');
      const before = state.clock.hour; state.tick += 1; state.clock = { hour: monthStartHour(state.tick) };
      return { hours: state.clock.hour - before, monthlyBoundaries: 1, stop: 'yield' };
    });
    const c = new GameController();
    c.st = fake(0);
    c.setPaused(false);
    const work = c.fastForward(12);
    const settled = work.then(() => 'ok', (e: Error) => e.message);
    await drain();
    expect(await settled).toBe('simulated monthly step failure');
    expect(c.st?.tick).toBe(2);
    expect(c.busy).toBeNull();
    expect(c.paused).toBe(false);
    expect(request).toHaveBeenCalledTimes(2);
  });

  it('CG11-03: dispose removes the visibility listener and stops work', () => {
    const add = vi.fn(); const remove = vi.fn();
    vi.stubGlobal('document', { hidden: false, addEventListener: add, removeEventListener: remove });
    const c = new GameController();
    expect(add).toHaveBeenCalledTimes(1);
    const listener = add.mock.calls[0][1];
    c.dispose(); c.dispose();
    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove.mock.calls[0][1]).toBe(listener);
    expect(c.paused).toBe(true);
  });

  it('CG12-01: dispose is terminal — no RAF, timer, emit, subscription or state change afterwards', async () => {
    const c = new GameController();
    c.st = fake(0);
    const seen: number[] = [];
    c.subscribe(() => seen.push(c.version));
    c.dispose();
    const v = c.version;
    c.setPaused(false);
    await c.fastForward(12);
    c.stepOnce(); c.stepDay(); c.tickFrame(1000);
    c.setSpeedSetting({ kind: 'fixed', hps: 48 });
    c.newGame({ mode: 'historical', seed: 1, player: null });
    c.load(JSON.stringify(fake(50)));
    c.toast('x');
    const unsub = c.subscribe(() => seen.push(-1));
    unsub();
    expect(request).not.toHaveBeenCalled();
    expect(yields).toHaveLength(0);
    expect(vi.mocked(advanceHours)).not.toHaveBeenCalled();
    expect(c.st?.tick).toBe(0);
    expect(c.version).toBe(v);
    expect(seen).toEqual([]);
    expect(c.paused).toBe(true);
    expect(c.command({} as any).ok).toBe(false);
  });
});
