// Real-time pacing for the hourly-canonical clock (CLOCK-01). Pure, deterministic, DOM-free.
//
// Pacing decides only HOW MANY canonical hours are owed for a span of real time. It never decides
// what an hour does; the engine processes every owed hour in order (simulation.ts advanceHour).
//
// Accounting is exact integer arithmetic: elapsed real time is measured in whole microseconds and
// multiplied by an integer rate in game-hours/second, so `credit` is in units of 1e-6 game-hours.
// Over the 38–77 hour real campaign this never drifts and never leaves the safe-integer range
// because every input is clamped.

/**
 * Owner decision 2026-11-22: 12 game-hours per real second is the MAXIMUM pace (faster presets made the
 * campaign end too quickly); slower presets are offered instead. 1/2/3/6/12 h/s = 24/12/8/4/2 real
 * seconds per game day.
 */
export const FIXED_RATES_HPS = [1, 2, 3, 6, 12] as const;
export const MAX_RATE_HPS = 12;
export type FixedRateHps = (typeof FIXED_RATES_HPS)[number];
/** Owner directive 2026-11-21: AUTO targets 12h/s, visibly falling back to 6h/s under sustained load. */
export const AUTO_NOMINAL_HPS = 12;
export const AUTO_FALLBACK_HPS = 6;

export type SpeedSetting = { kind: 'auto' } | { kind: 'fixed'; hps: FixedRateHps };
export const DEFAULT_SPEED: SpeedSetting = { kind: 'auto' };

/** Short HUD labels for the fixed presets. */
export const RATE_LABEL: Record<FixedRateHps, string> = { 1: '1h/s', 2: '2h/s', 3: '3h/s', 6: '6h/s', 12: '12h/s' };

export function isFixedRate(value: unknown): value is FixedRateHps {
  return typeof value === 'number' && (FIXED_RATES_HPS as readonly number[]).includes(value);
}

/** Presets removed by the 2026-11-22 owner decision; preferences saved with them clamp to the maximum. */
const LEGACY_FAST_RATES: readonly number[] = [24, 48];

/** Parses untrusted preference input; anything unrecognised becomes AUTO (fail safe, not fail open). */
export function parseSpeedSetting(value: unknown): SpeedSetting {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const v = value as { kind?: unknown; hps?: unknown };
    if (v.kind === 'fixed' && isFixedRate(v.hps)) return { kind: 'fixed', hps: v.hps };
    if (v.kind === 'fixed' && typeof v.hps === 'number' && LEGACY_FAST_RATES.includes(v.hps)) return { kind: 'fixed', hps: MAX_RATE_HPS };
  }
  return { kind: 'auto' };
}

export function speedSettingsEqual(a: SpeedSetting, b: SpeedSetting): boolean {
  return a.kind === b.kind && (a.kind === 'auto' || (b.kind === 'fixed' && a.hps === b.hps));
}

/** Cycle order used by the HUD speed button: AUTO → 1 → 2 → 3 → 6 → 12 → AUTO. */
export function nextSpeedSetting(s: SpeedSetting): SpeedSetting {
  if (s.kind === 'auto') return { kind: 'fixed', hps: FIXED_RATES_HPS[0] };
  const i = FIXED_RATES_HPS.indexOf(s.hps);
  return i < 0 || i === FIXED_RATES_HPS.length - 1 ? { kind: 'auto' } : { kind: 'fixed', hps: FIXED_RATES_HPS[i + 1] };
}

const MICRO = 1_000_000;
/**
 * A single frame/timer callback can credit at most this much real time. A longer gap (tab hidden,
 * process frozen, debugger) is not converted into a burst of catch-up hours; the excess is
 * reported as `droppedRealMs` so the UI can show lag honestly.
 */
export const MAX_CREDIT_PER_CALLBACK_MS = 250;
/**
 * NEW credit is only accepted while owed hours are below this many real seconds at the current rate.
 * Hours already owed are never deleted: after a rate drop the backlog may exceed this bound and is
 * drained normally (CG11-02 / CG-12 note).
 */
export const MAX_BACKLOG_SECONDS = 1;

export interface PaceState {
  /** Fractional hour credit in 1e-6 game-hours; always 0 ≤ credit < 1e6. */
  credit: number;
  /** Whole hours owed to the simulation but not yet processed. New credit is bounded; existing debt is never truncated. */
  backlogHours: number;
  /** Real milliseconds that could not be credited (gap clamp or backlog bound): visible lag. */
  droppedRealMs: number;
}

export function createPaceState(): PaceState {
  return { credit: 0, backlogHours: 0, droppedRealMs: 0 };
}

export function maxBacklogHours(rateHps: number): number {
  return Math.max(1, Math.ceil(rateHps * MAX_BACKLOG_SECONDS));
}

/**
 * Credits `elapsedMs` of real time at `rateHps` and returns the new pace state. Hours become owed
 * in `backlogHours`; the caller processes them (bounded per frame) and calls `consumeBacklog`.
 */
export function creditElapsed(pace: PaceState, elapsedMs: number, rateHps: number): PaceState {
  const rate = Number.isSafeInteger(rateHps) && rateHps > 0 && rateHps <= 1000 ? rateHps : 0;
  const raw = Number.isFinite(elapsedMs) && elapsedMs > 0 ? elapsedMs : 0;
  const creditedMs = Math.min(raw, MAX_CREDIT_PER_CALLBACK_MS);
  let dropped = pace.droppedRealMs + (raw - creditedMs);
  const credit0 = Number.isSafeInteger(pace.credit) && pace.credit >= 0 && pace.credit < MICRO ? pace.credit : 0;
  const backlog0 = Number.isSafeInteger(pace.backlogHours) && pace.backlogHours >= 0 ? pace.backlogHours : 0;
  if (rate === 0) return { credit: credit0, backlogHours: backlog0, droppedRealMs: dropped };

  // elapsed µs × (hours/s) = 1e-6 hours (since 1 s = 1e6 µs): exact integer product.
  const micros = Math.round(creditedMs * 1000);
  const total = credit0 + micros * rate;
  const due = Math.floor(total / MICRO);
  const credit = total - due * MICRO;
  // Only NEW credit is bounded. Hours already owed are never deleted here, even if they exceed the
  // current rate's cap after a rate change (CG11-02): they stay owed until processed.
  const cap = maxBacklogHours(rate);
  const room = Math.max(0, cap - backlog0);
  const accepted = Math.min(due, room);
  if (due > accepted) dropped += ((due - accepted) * 1000) / rate;
  const backlogHours = backlog0 + accepted;
  return { credit, backlogHours, droppedRealMs: dropped };
}

export function consumeBacklog(pace: PaceState, processedHours: number): PaceState {
  const n = Number.isSafeInteger(processedHours) && processedHours > 0 ? processedHours : 0;
  return { ...pace, backlogHours: Math.max(0, pace.backlogHours - n) };
}

/** Discards owed time (used on pause, load, new game and rate-mode changes). */
export function resetPace(): PaceState {
  return createPaceState();
}

/** Real seconds per in-game day at a rate (12h/s → 2 s; 6h/s → 4 s). */
export function realSecondsPerDay(rateHps: number): number {
  return 24 / rateHps;
}
