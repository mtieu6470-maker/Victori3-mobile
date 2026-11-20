import { describe, expect, it } from 'vitest';
import { consumeClockElapsed, SPEED_MS } from '../src/ui/game/controller';

describe('bounded monthly simulation clock', () => {
  it('uses positive, strictly increasing real-time intervals for speeds 1 through 5', () => {
    expect(SPEED_MS[1]).toBeGreaterThan(SPEED_MS[2]);
    expect(SPEED_MS[2]).toBeGreaterThan(SPEED_MS[3]);
    expect(SPEED_MS[3]).toBeGreaterThan(SPEED_MS[4]);
    expect(SPEED_MS[4]).toBeGreaterThan(SPEED_MS[5]);
    for (const interval of Object.values(SPEED_MS)) expect(interval).toBeGreaterThan(0);
  });

  it('advances exactly one month only after the selected interval has elapsed', () => {
    const interval = SPEED_MS[5];
    const before = consumeClockElapsed(0, interval - 1, interval);
    expect(before).toEqual({ accumulatorMs: interval - 1, shouldStep: false });
    const due = consumeClockElapsed(before.accumulatorMs, 1, interval);
    expect(due).toEqual({ accumulatorMs: 0, shouldStep: true });
  });

  it('never converts a long background-tab pause into multiple catch-up months', () => {
    const result = consumeClockElapsed(250, 60_000, SPEED_MS[5]);
    expect(result).toEqual({ accumulatorMs: 0, shouldStep: true });
  });

  it('clamps invalid or negative timing inputs safely', () => {
    expect(consumeClockElapsed(Number.NaN, -100, 0)).toEqual({ accumulatorMs: 0, shouldStep: false });
    expect(consumeClockElapsed(100, Number.POSITIVE_INFINITY, 1000)).toEqual({ accumulatorMs: 100, shouldStep: false });
  });
});
