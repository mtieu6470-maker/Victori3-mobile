// CLOCK-01 controller integration with the real engine: real-time pacing at AUTO 12h/s, fixed
// presets, bounded per-frame work, lifecycle pause and pace-preference persistence.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { GameController } from '../src/ui/game/controller';
import { monthStartHour } from '../src/engine/clock/calendar';
import { createGame } from '../src/engine/init';
import { serialize } from '../src/engine/save';

loadNodeData();

describe('GameController hourly clock pacing', () => {
  let clock = 0;
  beforeEach(() => {
    clock = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => clock);
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  /** Simulates `ms` of 60 fps animation frames. */
  function frames(c: GameController, ms: number) {
    const end = clock + ms;
    while (clock < end) { clock = Math.min(end, clock + 1000 / 60); c.tickFrame(clock); }
  }

  it('AUTO advances 12 canonical hours per real second (1 game day per 2 s) on a healthy device', () => {
    const c = new GameController();
    c.speedSetting = { kind: 'auto' };
    c.newGame({ mode: 'historical', seed: 1, player: null });
    c.setPaused(false);
    frames(c, 2000);
    expect(c.effectiveHps).toBe(12);
    expect(c.governor.status).toBe('nominal');
    expect(c.st!.clock.hour).toBeGreaterThanOrEqual(23);
    expect(c.st!.clock.hour).toBeLessThanOrEqual(24);
  });

  it('fixed 6h/s takes 4 s per game day; 48h/s takes 0.5 s', () => {
    const slow = new GameController();
    slow.newGame({ mode: 'historical', seed: 1, player: null });
    slow.setSpeedSetting({ kind: 'fixed', hps: 6 });
    slow.setPaused(false);
    frames(slow, 4000);
    expect(slow.st!.clock.hour).toBeGreaterThanOrEqual(23);
    expect(slow.st!.clock.hour).toBeLessThanOrEqual(24);

    const fast = new GameController();
    fast.newGame({ mode: 'historical', seed: 1, player: null });
    fast.setSpeedSetting({ kind: 'fixed', hps: 48 });
    fast.setPaused(false);
    frames(fast, 500);
    expect(fast.st!.clock.hour).toBeGreaterThanOrEqual(23);
    expect(fast.st!.clock.hour).toBeLessThanOrEqual(24);
  });

  it('crosses a monthly boundary in real time and runs the monthly systems exactly once', () => {
    const c = new GameController();
    c.newGame({ mode: 'historical', seed: 1, player: null });
    c.setSpeedSetting({ kind: 'fixed', hps: 48 });
    const runs0 = c.st!.counters.systemRuns.economy ?? 0;
    c.setPaused(false);
    frames(c, (monthStartHour(1) / 48) * 1000 + 200);
    expect(c.st!.tick).toBe(1);
    expect(c.st!.counters.systemRuns.economy).toBe(runs0 + 1);
  });

  it('does not run while paused and never converts a long gap into catch-up hours', () => {
    const c = new GameController();
    c.newGame({ mode: 'historical', seed: 1, player: null });
    frames(c, 5000);
    expect(c.st!.clock.hour).toBe(0);
    c.setPaused(false);
    clock += 60_000; // e.g. the WebView was frozen for a minute
    c.tickFrame(clock);
    expect(c.st!.clock.hour).toBe(3); // at most 250 ms of credit at 12h/s
  });

  it('pauses on background (lifecycle) and stays paused until the player resumes', () => {
    const c = new GameController();
    c.newGame({ mode: 'historical', seed: 1, player: null });
    c.setPaused(false);
    frames(c, 1000);
    const hour = c.st!.clock.hour;
    c.onBackground();
    expect(c.paused).toBe(true);
    expect(c.pausedByLifecycle).toBe(true);
    frames(c, 5000);
    expect(c.st!.clock.hour).toBe(hour);
    c.setPaused(false);
    expect(c.pausedByLifecycle).toBe(false);
  });

  it('persists the pace preference in the save envelope and restarts AUTO measurement after load', () => {
    const c = new GameController();
    c.newGame({ mode: 'historical', seed: 1, player: null });
    c.setSpeedSetting({ kind: 'fixed', hps: 24 });
    const text = c.save();
    expect(JSON.parse(text).clockPreference).toEqual({ kind: 'fixed', hps: 24 });

    const autoSave = serialize(createGame({ mode: 'historical', seed: 2, player: null }), { clockPreference: { kind: 'auto' } });
    const d = new GameController();
    d.governor.effectiveHps = 6; d.governor.status = 'fallback'; // transient load from a previous session
    d.load(autoSave);
    expect(d.speedSetting).toEqual({ kind: 'auto' });
    expect(d.effectiveHps).toBe(12);
    expect(d.governor.status).toBe('nominal');
    d.load(text);
    expect(d.speedSetting).toEqual({ kind: 'fixed', hps: 24 });
    expect(d.effectiveHps).toBe(24);
  });

  it('bounds per-frame simulation work and keeps the remaining owed hours in the backlog', () => {
    const c = new GameController();
    c.newGame({ mode: 'historical', seed: 1, player: null });
    c.setSpeedSetting({ kind: 'fixed', hps: 48 });
    c.setPaused(false);
    // Make every hour look expensive: the per-frame budget is exhausted after the first hour.
    let calls = 0;
    vi.mocked(performance.now).mockImplementation(() => clock + (calls++ > 0 ? 1_000 : 0));
    clock += 200; // 200 ms → 9 owed hours at 48h/s
    c.tickFrame(clock);
    expect(c.st!.clock.hour).toBe(1);
    expect(c.pace.backlogHours).toBe(8);
  });
});
