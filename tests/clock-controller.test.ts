import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GameController } from '../src/ui/game/controller';
import type { GameState } from '../src/engine/types';

vi.mock('../src/engine/init', () => ({ createGame: vi.fn() }));
vi.mock('../src/engine/simulation', () => ({
  GAME_END_YEAR: 2026,
  isGameOver: (state: { tick: number; date: { y: number } }) => state.tick >= 2292 || state.date.y >= 2027,
  stepMonth: vi.fn(),
  stepSixHour: vi.fn((state: { tick: number; date: { y: number; m: number }; calendar: { year: number; month: number; day: number; hour: number; stepIndex: number; dayIndex: number; completed: boolean } }) => {
    const c = state.calendar; c.stepIndex++; c.hour += 6;
    if (c.hour >= 24) {
      c.hour = 0; c.day++; c.dayIndex++;
      const leap = c.year % 4 === 0 && (c.year % 100 !== 0 || c.year % 400 === 0);
      const lengths = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (c.day > lengths[c.month - 1]) {
        c.day = 1; c.month++;
        if (c.month > 12) { c.month = 1; c.year++; }
        state.tick++; state.date = { y: c.year, m: c.month };
      }
    }
    if (c.year === 2027) c.completed = true;
    return true;
  }),
}));
vi.mock('../src/engine/commands', () => ({ execute: vi.fn(() => ({ ok: true })) }));
vi.mock('../src/engine/save', () => ({ serialize: vi.fn(() => 'save'), deserialize: vi.fn() }));

type TestState = { tick: number; date: { y: number; m: number }; log: unknown[]; calendar: { year: number; month: number; day: number; hour: number; stepIndex: number; dayIndex: number; completed: boolean } };

describe('GameController six-hour clock integration', () => {
  let nowMs: number; let controller: GameController; let state: TestState;
  const pulseFor = (durationMs: number) => {
    const completePulses = Math.floor(durationMs / 50);
    for (let i = 0; i < completePulses; i++) { nowMs += 50; vi.advanceTimersByTime(50); }
    const remainder = durationMs - completePulses * 50;
    if (remainder > 0) { nowMs += remainder; vi.advanceTimersByTime(remainder); }
  };

  beforeEach(() => {
    vi.useFakeTimers(); nowMs = 0; vi.spyOn(performance, 'now').mockImplementation(() => nowMs);
    controller = new GameController();
    state = { tick: 0, date: { y: 2026, m: 1 }, log: [], calendar: { year: 2026, month: 1, day: 1, hour: 0, stepIndex: 0, dayIndex: 0, completed: false } };
    controller.st = state as unknown as GameState; controller.speed = 5;
  });
  afterEach(() => { controller.setPaused(true); vi.useRealTimers(); vi.restoreAllMocks(); });

  it('advances one six-hour step every half second at Speed 5', () => {
    controller.setPaused(false); pulseFor(450); expect(state.calendar.stepIndex).toBe(0);
    pulseFor(50); expect(state.calendar.stepIndex).toBe(1); expect(state.calendar.hour).toBe(6);
  });

  it('completes a 31-day month in 62 seconds at the Speed-5 ceiling', () => {
    controller.setPaused(false); pulseFor(61_950); expect(state.tick).toBe(0);
    pulseFor(50); expect(state.tick).toBe(1); expect(state.calendar).toMatchObject({ year: 2026, month: 2, day: 1, hour: 0 });
  });

  it('does not count paused or background time', () => {
    controller.setPaused(false); pulseFor(1000); const step = state.calendar.stepIndex;
    controller.setPaused(true); nowMs += 3_600_000; vi.advanceTimersByTime(3_600_000);
    controller.setPaused(false); pulseFor(450); expect(state.calendar.stepIndex).toBe(step);
    pulseFor(50); expect(state.calendar.stepIndex).toBe(step + 1);
  });

  it('preserves the hard cap across a speed change', () => {
    controller.speed = 1; controller.setPaused(false); pulseFor(1000);
    expect(state.calendar.stepIndex).toBe(0); controller.setSpeed(5); pulseFor(300);
    expect(state.calendar.stepIndex).toBe(1);
  });

  it('save discards only uncommitted wall-clock fraction, not a committed step', () => {
    controller.setPaused(false); pulseFor(600); expect(state.calendar.stepIndex).toBe(1);
    expect(controller.save()).toBe('save'); pulseFor(450); expect(state.calendar.stepIndex).toBe(1);
    pulseFor(50); expect(state.calendar.stepIndex).toBe(2);
  });

  it('does not catch up a long timer stall in one callback', () => {
    controller.setPaused(false); nowMs += 10_000; vi.advanceTimersByTime(10_000);
    expect(state.calendar.stepIndex).toBe(0); pulseFor(350); expect(state.calendar.stepIndex).toBe(0);
    pulseFor(50); expect(state.calendar.stepIndex).toBe(1);
  });

  it('manual stepping advances exactly one six-hour step', () => {
    controller.stepOnce(); expect(state.calendar.stepIndex).toBe(1); expect(state.calendar.hour).toBe(6);
  });
});