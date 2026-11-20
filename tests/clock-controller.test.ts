import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GameController } from '../src/ui/game/controller';
import type { GameState } from '../src/engine/types';

vi.mock('../src/engine/init', () => ({ createGame: vi.fn() }));
vi.mock('../src/engine/simulation', () => ({
  GAME_END_YEAR: 1936,
  isGameOver: (state: { tick: number }) => state.tick >= 1000,
  stepMonth: vi.fn((state: { tick: number; date: { y: number; m: number } }) => {
    state.tick += 1;
    if (state.date.m === 12) state.date = { y: state.date.y + 1, m: 1 };
    else state.date = { y: state.date.y, m: state.date.m + 1 };
  }),
}));
vi.mock('../src/engine/commands', () => ({ execute: vi.fn(() => ({ ok: true })) }));
vi.mock('../src/engine/save', () => ({
  serialize: vi.fn(() => 'save'),
  deserialize: vi.fn(),
}));

type TestState = { tick: number; date: { y: number; m: number }; log: unknown[] };

describe('GameController clock integration', () => {
  let nowMs: number;
  let controller: GameController;
  let state: TestState;

  const pulseFor = (durationMs: number) => {
    const completePulses = Math.floor(durationMs / 50);
    for (let i = 0; i < completePulses; i++) {
      nowMs += 50;
      vi.advanceTimersByTime(50);
    }
    const remainder = durationMs - completePulses * 50;
    if (remainder > 0) {
      nowMs += remainder;
      vi.advanceTimersByTime(remainder);
    }
  };

  beforeEach(() => {
    vi.useFakeTimers();
    nowMs = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => nowMs);
    controller = new GameController();
    state = { tick: 0, date: { y: 2026, m: 1 }, log: [] };
    controller.st = state as unknown as GameState;
    controller.speed = 5;
  });

  afterEach(() => {
    controller.setPaused(true);
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('uses a timer scheduler and completes a 31-day month only after 62 real seconds at Speed 5', () => {
    // No requestAnimationFrame shim is installed: the scheduler must not depend on rendering.
    controller.setPaused(false);

    pulseFor(61_950);
    expect(state.tick).toBe(0);

    pulseFor(50);
    expect(state.tick).toBe(1);
    expect(state.date).toEqual({ y: 2026, m: 2 });
  });

  it('does not count time while paused or while the app is backgrounded', () => {
    controller.setPaused(false);
    pulseFor(1000);
    expect(state.tick).toBe(0);

    controller.setPaused(true);
    nowMs += 3_600_000;
    vi.advanceTimersByTime(3_600_000);
    controller.setPaused(false);
    pulseFor(50);
    expect(state.tick).toBe(0);
  });

  it('keeps the 0.5-day/second ceiling when switching speed during a month', () => {
    controller.speed = 1;
    controller.setPaused(false);
    pulseFor(1000); // 0.1 game-day at Speed 1

    controller.setSpeed(5);
    pulseFor(61_750); // 30.875 game-days at Speed 5; 30.975 total
    expect(state.tick).toBe(0);

    pulseFor(50); // 0.025 more game-day; still below the 31-day month
    expect(state.tick).toBe(0);

    pulseFor(50);
    expect(state.tick).toBe(1);
  });

  it('does not catch up a long timer stall in one callback', () => {
    controller.setPaused(false);

    // The callback arrives 10 seconds late. Only the 100 ms pulse budget is admitted.
    nowMs += 10_000;
    vi.advanceTimersByTime(10_000);
    expect(state.tick).toBe(0);

    pulseFor(50);
    expect(state.tick).toBe(0);
  });

  it('manual month stepping clears any fractional wall-clock month progress', () => {
    controller.setPaused(false);
    pulseFor(1000);
    controller.setPaused(true);
    controller.stepOnce();
    expect(state.tick).toBe(1);

    controller.setPaused(false);
    pulseFor(61_950);
    expect(state.tick).toBe(1);
    pulseFor(50);
    expect(state.tick).toBe(2);
  });
});
