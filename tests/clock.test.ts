import { describe, expect, it } from 'vitest';
import {
  MAX_ADMITTED_ELAPSED_MS_PER_PULSE,
  SimulationPacer,
  SPEED_GAME_DAYS_PER_REAL_SECOND,
  daysInGregorianMonth,
  gameDaysForElapsedMs,
} from '../src/engine/clock';

function advanceInPulses(pacer: SimulationPacer, fromMs: number, toMs: number, speed: 1 | 2 | 3 | 4 | 5) {
  for (let timestamp = fromMs + 50; timestamp <= toMs; timestamp += 50) {
    pacer.advance(timestamp, speed);
  }
}

describe('Gregorian monthly clock', () => {
  it('uses Gregorian month lengths, including century leap-year rules', () => {
    expect(daysInGregorianMonth(1836, 2)).toBe(29);
    expect(daysInGregorianMonth(1900, 2)).toBe(28);
    expect(daysInGregorianMonth(2000, 2)).toBe(29);
    expect(daysInGregorianMonth(2026, 2)).toBe(28);
    expect(daysInGregorianMonth(2026, 1)).toBe(31);
    expect(daysInGregorianMonth(2026, 4)).toBe(30);
  });

  it('rejects invalid month inputs', () => {
    expect(() => daysInGregorianMonth(0, 1)).toThrow(RangeError);
    expect(() => daysInGregorianMonth(2026, 0)).toThrow(RangeError);
    expect(() => daysInGregorianMonth(2026, 13)).toThrow(RangeError);
    expect(() => daysInGregorianMonth(2026.5, 1)).toThrow(RangeError);
  });

  it('has strictly increasing speed rates and caps Speed 5 at half a day per second', () => {
    const rates = Object.values(SPEED_GAME_DAYS_PER_REAL_SECOND);
    expect(rates).toEqual([0.1, 0.2, 0.3, 0.4, 0.5]);
    expect(Math.max(...rates)).toBe(0.5);
    expect(gameDaysForElapsedMs(1000, 5)).toBe(0.05); // single pulse is bounded to 100 ms
  });

  it('never admits more elapsed time than the real interval, even after a long stall', () => {
    expect(gameDaysForElapsedMs(10_000, 5)).toBe(MAX_ADMITTED_ELAPSED_MS_PER_PULSE * 0.5 / 1000);
    expect(gameDaysForElapsedMs(-1, 5)).toBe(0);
    expect(gameDaysForElapsedMs(Number.NaN, 5)).toBe(0);
  });

  it('advances exactly half a calendar day per second at Speed 5 under regular pulses', () => {
    const pacer = new SimulationPacer();
    pacer.resume(0);
    for (let t = 50; t <= 10_000; t += 50) pacer.advance(t, 5);
    expect(pacer.pendingDays).toBeCloseTo(5, 10);
  });

  it('requires at least 62 seconds for a 31-day month at Speed 5', () => {
    const pacer = new SimulationPacer();
    pacer.resume(0);
    for (let t = 50; t < 62_000; t += 50) pacer.advance(t, 5);
    expect(pacer.consumeMonth(2026, 1)).toBe(false);

    pacer.advance(62_000, 5);
    expect(pacer.consumeMonth(2026, 1)).toBe(true);
    expect(pacer.pendingDays).toBeCloseTo(0, 8);
  });

  it('uses the actual February duration in leap and non-leap years', () => {
    expect(daysInGregorianMonth(2024, 2) / SPEED_GAME_DAYS_PER_REAL_SECOND[5]).toBe(58);
    expect(daysInGregorianMonth(2025, 2) / SPEED_GAME_DAYS_PER_REAL_SECOND[5]).toBe(56);
  });

  it('preserves fractional progress over pause/resume but does not count paused time', () => {
    const pacer = new SimulationPacer();
    pacer.resume(0);
    advanceInPulses(pacer, 0, 1000, 5);
    expect(pacer.pendingDays).toBeCloseTo(0.5, 10);

    pacer.pause();
    pacer.resume(3_600_000); // one simulated hour later; the gap itself is not counted
    pacer.advance(3_600_050, 5);
    expect(pacer.pendingDays).toBeCloseTo(0.525, 10);
  });

  it('accrues elapsed time at the old speed before a speed change', () => {
    const pacer = new SimulationPacer();
    pacer.resume(0);
    advanceInPulses(pacer, 0, 1000, 1);
    advanceInPulses(pacer, 1000, 2000, 5);
    expect(pacer.pendingDays).toBeCloseTo(0.6, 10);
  });

  it('does not accrue time for backward or duplicate monotonic timestamps', () => {
    const pacer = new SimulationPacer();
    pacer.resume(1000);
    pacer.advance(1000, 5);
    pacer.advance(900, 5);
    pacer.advance(1050, 5);
    expect(pacer.pendingDays).toBeCloseTo(0.025, 10);
  });

  it('resets accumulated fractional progress for a new or loaded campaign', () => {
    const pacer = new SimulationPacer();
    pacer.resume(0);
    advanceInPulses(pacer, 0, 1000, 5);
    pacer.reset();
    expect(pacer.pendingDays).toBe(0);
    pacer.advance(20_000, 5);
    expect(pacer.pendingDays).toBe(0);
  });
});
