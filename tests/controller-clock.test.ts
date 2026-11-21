// CLOCK-01/CLOCK-02 controller integration with the real engine behind an InlineSimHost: real-time
// pacing at AUTO 12h/s, fixed presets, bounded per-request work with backpressure, lifecycle pause,
// pace-preference persistence and read-only UI copies.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { GameController } from '../src/ui/game/controller';
import { InlineSimHost, type SimHost } from '../src/ui/game/simHost';
import { monthStartHour } from '../src/engine/clock/calendar';
import { createGame } from '../src/engine/init';
import { serialize } from '../src/engine/save';
import type { SimRequest, SimResponse } from '../src/engine/runtime/simCore';

loadNodeData();

describe('GameController hourly clock pacing (CLOCK-02 host)', () => {
  let clock = 0;
  beforeEach(() => {
    clock = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => clock);
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  async function started(host: SimHost = new InlineSimHost()) {
    const c = new GameController(host);
    await c.newGame({ mode: 'historical', seed: 1, player: null });
    return c;
  }
  /** Simulates `ms` of 60 fps animation frames, letting each host round trip complete. */
  async function frames(c: GameController, ms: number) {
    const end = clock + ms;
    while (clock < end) { clock = Math.min(end, clock + 1000 / 60); c.tickFrame(clock); await c.whenIdle(); }
  }

  it('AUTO advances 12 canonical hours per real second (1 game day per 2 s) on a healthy device', async () => {
    const c = await started();
    c.setSpeedSetting({ kind: 'auto' });
    c.setPaused(false);
    await frames(c, 2000);
    expect(c.effectiveHps).toBe(12);
    expect(c.governor.status).toBe('nominal');
    expect(c.st!.clock.hour).toBeGreaterThanOrEqual(23);
    expect(c.st!.clock.hour).toBeLessThanOrEqual(24);
  });

  it('fixed 6h/s takes 4 s per game day; 48h/s takes 0.5 s', async () => {
    const slow = await started();
    slow.setSpeedSetting({ kind: 'fixed', hps: 6 });
    slow.setPaused(false);
    await frames(slow, 4000);
    expect(slow.st!.clock.hour).toBeGreaterThanOrEqual(23);
    expect(slow.st!.clock.hour).toBeLessThanOrEqual(24);

    const fast = await started();
    fast.setSpeedSetting({ kind: 'fixed', hps: 48 });
    fast.setPaused(false);
    await frames(fast, 500);
    expect(fast.st!.clock.hour).toBeGreaterThanOrEqual(23);
    expect(fast.st!.clock.hour).toBeLessThanOrEqual(24);
  });

  it('crosses a monthly boundary in real time, runs the monthly systems once and replaces the UI copy', async () => {
    const host = new InlineSimHost();
    const c = await started(host);
    c.setSpeedSetting({ kind: 'fixed', hps: 48 });
    const runs0 = c.st!.counters.systemRuns.economy ?? 0;
    const before = c.st;
    c.setPaused(false);
    await frames(c, (monthStartHour(1) / 48) * 1000 + 200);
    expect(c.st!.tick).toBe(1);
    expect(c.st!.counters.systemRuns.economy).toBe(runs0 + 1);
    expect(c.st).not.toBe(before); // a fresh snapshot after the boundary
    expect(c.st).not.toBe(host.core.state); // never the authoritative object
    expect(c.st!.clock.hour).toBe(host.core.state!.clock.hour);
  });

  it('does not run while paused and never converts a long gap into catch-up hours', async () => {
    const c = await started();
    await frames(c, 5000);
    expect(c.st!.clock.hour).toBe(0);
    c.setPaused(false);
    clock += 60_000; // e.g. the WebView was frozen for a minute
    c.tickFrame(clock); await c.whenIdle();
    expect(c.st!.clock.hour).toBe(3); // at most 250 ms of credit at 12h/s
  });

  it('pauses on background (lifecycle) and stays paused until the player resumes', async () => {
    const c = await started();
    c.setPaused(false);
    await frames(c, 1000);
    const hour = c.st!.clock.hour;
    c.onBackground();
    expect(c.paused).toBe(true);
    expect(c.pausedByLifecycle).toBe(true);
    await frames(c, 5000);
    expect(c.st!.clock.hour).toBe(hour);
    c.setPaused(false);
    expect(c.pausedByLifecycle).toBe(false);
  });

  it('persists the pace preference in the save envelope and restarts AUTO measurement after load', async () => {
    const c = await started();
    c.setSpeedSetting({ kind: 'fixed', hps: 24 });
    const text = await c.save();
    expect(JSON.parse(text).clockPreference).toEqual({ kind: 'fixed', hps: 24 });

    const autoSave = serialize(createGame({ mode: 'historical', seed: 2, player: null }), { clockPreference: { kind: 'auto' } });
    const d = new GameController(new InlineSimHost());
    d.governor.effectiveHps = 6; d.governor.status = 'fallback'; // transient load from a previous session
    await d.load(autoSave);
    expect(d.speedSetting).toEqual({ kind: 'auto' });
    expect(d.effectiveHps).toBe(12);
    expect(d.governor.status).toBe('nominal');
    await d.load(text);
    expect(d.speedSetting).toEqual({ kind: 'fixed', hps: 24 });
    expect(d.effectiveHps).toBe(24);
    await expect(d.load('{"format":"nope"}')).rejects.toThrow('Not a save file');
    expect(d.st).not.toBeNull(); // a rejected load keeps the current game
  });

  it('bounds each advance request and keeps the remaining owed hours in the backlog', async () => {
    const c = await started();
    c.setSpeedSetting({ kind: 'fixed', hps: 48 });
    c.setPaused(false);
    // Make every hour look expensive: the request budget is exhausted after the first hour.
    let calls = 0;
    vi.mocked(performance.now).mockImplementation(() => clock + (calls++ > 0 ? 1_000 : 0));
    clock += 200; // 200 ms → 9 owed hours at 48h/s
    c.tickFrame(clock); await c.whenIdle();
    expect(c.st!.clock.hour).toBe(1);
    expect(c.pace.backlogHours).toBe(8);
  });

  it('keeps at most one advance request in flight (backpressure) and feeds worker time to the governor', async () => {
    let advances = 0; let maxConcurrent = 0; let concurrent = 0;
    const inner = new InlineSimHost();
    const host: SimHost = {
      kind: 'inline',
      async request(req: SimRequest): Promise<SimResponse> {
        if (req.kind !== 'advance') return inner.request(req);
        advances++; concurrent++; maxConcurrent = Math.max(maxConcurrent, concurrent);
        await new Promise((r) => setTimeout(r, 0));
        const res = await inner.request(req);
        concurrent--;
        return res.ok && res.kind === 'advance' ? { ...res, simMs: 10 } : res;
      },
      dispose() { inner.dispose(); },
    };
    const c = await started(host);
    c.setSpeedSetting({ kind: 'fixed', hps: 48 });
    c.setPaused(false);
    for (let i = 0; i < 20; i++) { clock += 16; c.tickFrame(clock); } // frames arrive faster than replies
    expect(advances).toBe(1);
    await c.whenIdle();
    for (let i = 0; i < 400; i++) { clock += 16; c.tickFrame(clock); await c.whenIdle(); }
    expect(maxConcurrent).toBe(1);
    expect(c.governor.lastWindow?.simShare ?? 0).toBeGreaterThan(0.3); // 10 ms of worker time per ~16 ms frame
  });

  it('commands run in the host and return the engine result with a fresh snapshot', async () => {
    const c = await started();
    const r = await c.command({ type: 'declare_war', target: 'NOPE', goals: [] } as any);
    expect(r.ok).toBe(false);
    expect(typeof r.reason).toBe('string');
  });

  it('CG-12: fast-forward really yields at the 12 ms budget between hourly engine steps (real engine, fake clock)', async () => {
    const c = await started();
    // Every clock read advances 1 ms, so a chunk can process only ~12 hours before yielding.
    vi.mocked(performance.now).mockImplementation(() => ++clock);
    let chunks = 0;
    const realSetTimeout = globalThis.setTimeout;
    vi.stubGlobal('setTimeout', ((cb: () => void) => { chunks++; return realSetTimeout(cb, 0); }) as typeof setTimeout);
    await c.fastForward(1);
    expect(c.st!.tick).toBe(1);
    expect(c.st!.clock.hour).toBe(monthStartHour(1));
    expect(chunks).toBeGreaterThan(30); // many bounded chunks, not one blocking run
  });
});
