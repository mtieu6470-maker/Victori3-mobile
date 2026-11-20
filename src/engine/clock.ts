/**
 * Wall-clock pacing for the existing monthly simulation.
 *
 * This is intentionally separate from rendering. The controller polls this pacer
 * from a timer and only commits a month when a full Gregorian month has elapsed.
 */
export type SimulationSpeed = 1 | 2 | 3 | 4 | 5;

/**
 * Calendar days advanced per real second.
 * Speed 5 is the owner's hard ceiling; lower speeds are evenly spaced below it.
 */
export const SPEED_GAME_DAYS_PER_REAL_SECOND: Readonly<Record<SimulationSpeed, number>> = Object.freeze({
  1: 0.1,
  2: 0.2,
  3: 0.3,
  4: 0.4,
  5: 0.5,
});

/** Timer cadence is independent of RAF/render frequency. */
export const SIMULATION_CLOCK_PULSE_MS = 50;

/**
 * Maximum wall time accepted from a single pulse. When the browser/UI stalls or
 * throttles timers, simulation slows down rather than catching up in a burst.
 */
export const MAX_ADMITTED_ELAPSED_MS_PER_PULSE = 100;

const DAY_EPSILON = 1e-9;

export function daysInGregorianMonth(year: number, month: number): number {
  if (!Number.isInteger(year) || year < 1 || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError(`Invalid Gregorian month: ${year}-${month}`);
  }

  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[month - 1];
}

/** Pure conversion used by tests and by the runtime scheduler. */
export function gameDaysForElapsedMs(elapsedMs: number, speed: SimulationSpeed): number {
  if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) return 0;
  const rate = SPEED_GAME_DAYS_PER_REAL_SECOND[speed];
  if (!Number.isFinite(rate) || rate <= 0) throw new RangeError(`Invalid simulation speed: ${speed}`);
  const admittedMs = Math.min(elapsedMs, MAX_ADMITTED_ELAPSED_MS_PER_PULSE);
  return (admittedMs / 1000) * rate;
}

/**
 * Monotonic accumulator for monthly steps. Pause/resume preserves already earned
 * fractional progress but never counts time while paused.
 */
export class SimulationPacer {
  private lastMonotonicMs: number | null = null;
  private pendingGameDays = 0;

  resume(nowMs: number): void {
    if (!Number.isFinite(nowMs)) throw new RangeError('Monotonic timestamp must be finite');
    this.lastMonotonicMs = nowMs;
  }

  pause(): void {
    this.lastMonotonicMs = null;
  }

  reset(): void {
    this.lastMonotonicMs = null;
    this.pendingGameDays = 0;
  }

  advance(nowMs: number, speed: SimulationSpeed): number {
    if (!Number.isFinite(nowMs)) throw new RangeError('Monotonic timestamp must be finite');

    if (this.lastMonotonicMs === null) {
      this.lastMonotonicMs = nowMs;
      return this.pendingGameDays;
    }

    // Do not move the baseline backwards if a faulty clock/test supplies an older value.
    if (nowMs <= this.lastMonotonicMs) return this.pendingGameDays;

    const elapsedMs = nowMs - this.lastMonotonicMs;
    this.lastMonotonicMs = nowMs;
    this.pendingGameDays += gameDaysForElapsedMs(elapsedMs, speed);
    return this.pendingGameDays;
  }

  consumeMonth(year: number, month: number): boolean {
    const monthDays = daysInGregorianMonth(year, month);
    if (this.pendingGameDays + DAY_EPSILON < monthDays) return false;

    this.pendingGameDays = Math.max(0, this.pendingGameDays - monthDays);
    return true;
  }

  get pendingDays(): number {
    return this.pendingGameDays;
  }
}
