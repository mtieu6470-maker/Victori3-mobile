import { describe, expect, it } from 'vitest';
import {
  AUTO_FALLBACK_HPS, AUTO_NOMINAL_HPS, consumeBacklog, createPaceState, creditElapsed, FIXED_RATES_HPS,
  MAX_CREDIT_PER_CALLBACK_MS, maxBacklogHours, nextSpeedSetting, parseSpeedSetting, realSecondsPerDay, type PaceState,
} from '../src/engine/clock/pace';
import { createGovernor, GOVERNOR_THRESHOLDS as T, observeFrame, type GovernorState } from '../src/engine/clock/governor';

/** Feeds `seconds` of 60 fps frames at a given simulation share; drains backlog like a fast device. */
function feed(g: GovernorState, seconds: number, simShare: number, extra: { saturated?: boolean; droppedPerFrame?: number } = {}) {
  const frame = 1000 / 60;
  for (let t = 0; t < seconds * 1000; t += frame) {
    observeFrame(g, { realMs: frame, simMs: frame * simShare, saturated: !!extra.saturated, droppedRealMs: extra.droppedPerFrame ?? 0 });
  }
  return g;
}

describe('CLOCK-01 pace accumulator (exact integer accounting)', () => {
  it('derives the owner reference timings: 12h/s → 2 s per day, 6h/s → 4 s per day', () => {
    expect(realSecondsPerDay(12)).toBe(2);
    expect(realSecondsPerDay(6)).toBe(4);
    expect(FIXED_RATES_HPS).toEqual([3, 6, 12, 24, 48]);
    expect([AUTO_NOMINAL_HPS, AUTO_FALLBACK_HPS]).toEqual([12, 6]);
  });

  it.each([3, 6, 12, 24, 48])('credits exactly %i hours per real second without drift over 10 simulated minutes of 60 fps frames', (rate) => {
    let pace: PaceState = createPaceState();
    let hours = 0;
    // 36,000 frames of 1000/60 ms: the per-frame rounding to whole microseconds must not accumulate.
    for (let f = 1; f <= 36_000; f++) {
      const elapsed = (f * 1000) / 60 - ((f - 1) * 1000) / 60;
      pace = creditElapsed(pace, elapsed, rate);
      hours += pace.backlogHours;
      pace = consumeBacklog(pace, pace.backlogHours);
    }
    expect(hours).toBeGreaterThanOrEqual(rate * 600 - 1);
    expect(hours).toBeLessThanOrEqual(rate * 600);
    expect(pace.droppedRealMs).toBe(0);
    expect(Number.isSafeInteger(pace.credit)).toBe(true);
  });

  it('owes exactly 24 hours after 2 s at 12h/s and after 4 s at 6h/s', () => {
    const run = (rate: number, ms: number) => {
      let p = createPaceState(); let owed = 0;
      for (let t = 0; t < ms; t += 20) { p = creditElapsed(p, 20, rate); owed += p.backlogHours; p = consumeBacklog(p, p.backlogHours); }
      return owed;
    };
    expect(run(12, 2000)).toBe(24);
    expect(run(6, 4000)).toBe(24);
  });

  it('never converts a long gap (background, freeze) into a burst of catch-up hours', () => {
    const p = creditElapsed(createPaceState(), 60_000, 12);
    expect(p.backlogHours).toBe(3); // 250 ms × 12h/s
    expect(p.droppedRealMs).toBe(60_000 - MAX_CREDIT_PER_CALLBACK_MS);
  });

  it('bounds the backlog when the device cannot keep up and reports the shortfall as lag', () => {
    let p = createPaceState();
    for (let i = 0; i < 200; i++) p = creditElapsed(p, 16, 12); // nothing consumed: fully stalled
    expect(p.backlogHours).toBe(maxBacklogHours(12));
    expect(p.droppedRealMs).toBeGreaterThan(0);
    // Owed hours are preserved, not discarded: consuming one leaves the rest owed.
    expect(consumeBacklog(p, 1).backlogHours).toBe(maxBacklogHours(12) - 1);
  });

  it('CG11-02: never deletes already-owed hours when the rate (and therefore the cap) drops', () => {
    // 40 owed hours accumulated at 48h/s, then the player switches to 3h/s (cap 3).
    let p: PaceState = { credit: 0, backlogHours: 40, droppedRealMs: 0 };
    p = creditElapsed(p, 16, 3);
    expect(p.backlogHours).toBe(40); // existing debt preserved; new credit refused…
    expect(p.droppedRealMs).toBeGreaterThanOrEqual(0); // …and any refused credit is reported as lag
    // AUTO 12 → 6 with 11 owed hours: still 11 owed after crediting at the fallback rate.
    const q = creditElapsed({ credit: 0, backlogHours: 11, droppedRealMs: 0 }, 250, 6);
    expect(q.backlogHours).toBe(11);
    expect(q.droppedRealMs).toBeCloseTo(166.667, 2); // 1 refused hour at 6h/s
    // Once the backlog is drained below the cap, new credit is accepted again.
    // (one callback credits at most 250 ms: 1.5 h + the 0.5 h carried credit = 2 h)
    expect(creditElapsed(consumeBacklog(q, 11), 500, 6).backlogHours).toBe(2);
  });

  it('clamps invalid timing/rate inputs safely', () => {
    expect(creditElapsed(createPaceState(), Number.NaN, 12)).toEqual(createPaceState());
    expect(creditElapsed(createPaceState(), -50, 12)).toEqual(createPaceState());
    expect(creditElapsed(createPaceState(), 100, 0).backlogHours).toBe(0);
    expect(creditElapsed({ credit: -3, backlogHours: 1.5, droppedRealMs: 0 }, 0, 12)).toEqual({ credit: 0, backlogHours: 0, droppedRealMs: 0 });
  });

  it('parses untrusted preferences fail-safe to AUTO and cycles presets', () => {
    expect(parseSpeedSetting({ kind: 'fixed', hps: 24 })).toEqual({ kind: 'fixed', hps: 24 });
    for (const bad of [null, 'auto', { kind: 'fixed', hps: 7 }, { kind: 'turbo' }, []]) expect(parseSpeedSetting(bad)).toEqual({ kind: 'auto' });
    const seen: string[] = [];
    let s = parseSpeedSetting(null);
    for (let i = 0; i < 6; i++) { seen.push(s.kind === 'auto' ? 'AUTO' : String(s.hps)); s = nextSpeedSetting(s); }
    expect(seen).toEqual(['AUTO', '3', '6', '12', '24', '48']);
    expect(s).toEqual({ kind: 'auto' });
  });
});

describe('CLOCK-01 AUTO governor: 12h/s nominal, sustained-load fallback to 6h/s with hysteresis', () => {
  it('stays at 12h/s for a healthy load and for an isolated monthly-boundary spike', () => {
    const g = createGovernor({ kind: 'auto' });
    feed(g, 30, 0.02);
    expect(g.effectiveHps).toBe(12);
    // A single 120 ms frame (monthly boundary on a slow phone) inside an otherwise light window.
    observeFrame(g, { realMs: 120, simMs: 110, saturated: false, droppedRealMs: 0 });
    feed(g, 10, 0.02);
    expect(g.effectiveHps).toBe(12);
    expect(g.status).toBe('nominal');
  });

  it('does not fall back on a short burst below the sustained window count', () => {
    const g = createGovernor({ kind: 'auto' });
    feed(g, (T.windowMs / 1000) * (T.downgradeWindows - 1), 0.7);
    feed(g, 4, 0.05);
    expect(g.effectiveHps).toBe(12);
  });

  it('falls back visibly to 6h/s after sustained measured overload', () => {
    const g = createGovernor({ kind: 'auto' });
    feed(g, (T.windowMs / 1000) * T.downgradeWindows + 0.1, 0.7);
    expect(g.effectiveHps).toBe(6);
    expect(g.status).toBe('fallback');
    expect(g.switches).toBe(1);
  });

  it('also treats sustained saturated frames or lag as overload', () => {
    const sat = feed(createGovernor({ kind: 'auto' }), 8, 0.3, { saturated: true });
    expect(sat.effectiveHps).toBe(6);
    const lag = feed(createGovernor({ kind: 'auto' }), 8, 0.1, { droppedPerFrame: 2 });
    expect(lag.effectiveHps).toBe(6);
  });

  it('returns to 12h/s only after sustained projected headroom (hysteresis, no oscillation)', () => {
    const g = createGovernor({ kind: 'auto' });
    feed(g, 8, 0.7);
    expect(g.effectiveHps).toBe(6);
    // Load at 6h/s of 0.15 projects to 0.30 at 12h/s: not enough headroom, must stay at 6.
    feed(g, 120, 0.15);
    expect(g.effectiveHps).toBe(6);
    // Clear headroom (0.05 → 0.10 projected) but not yet sustained long enough.
    feed(g, (T.windowMs / 1000) * (T.upgradeWindows - 2), 0.05);
    expect(g.effectiveHps).toBe(6);
    feed(g, (T.windowMs / 1000) * 3, 0.05);
    expect(g.effectiveHps).toBe(12);
    expect(g.switches).toBe(2);
  });

  it('borderline load around the threshold does not cause rapid 12↔6 switching', () => {
    const g = createGovernor({ kind: 'auto' });
    for (let i = 0; i < 60; i++) feed(g, 2, i % 2 ? 0.5 : 0.4);
    expect(g.switches).toBeLessThanOrEqual(1);
  });

  it('reports overloaded (never pretends to hold 6h/s) when even the fallback cannot keep up', () => {
    const g = createGovernor({ kind: 'auto' });
    feed(g, 8, 0.8, { saturated: true });
    expect(g.effectiveHps).toBe(6);
    feed(g, 8, 0.8, { saturated: true });
    expect(g.status).toBe('overloaded');
    expect(g.effectiveHps).toBe(6);
    feed(g, 2.1, 0.05);
    expect(g.status).toBe('fallback');
  });

  it('never changes a user-selected fixed rate, but reports when it is not being achieved', () => {
    const g = createGovernor({ kind: 'fixed', hps: 48 });
    feed(g, 20, 0.9, { saturated: true });
    expect(g.effectiveHps).toBe(48);
    expect(g.status).toBe('fixed_overloaded');
    feed(g, 2.1, 0.01);
    expect(g.status).toBe('fixed');
  });

  it('does not use the calendar: identical measurements give identical decisions', () => {
    const a = feed(createGovernor({ kind: 'auto' }), 20, 0.3);
    const b = feed(createGovernor({ kind: 'auto' }), 20, 0.3);
    expect(a).toEqual(b);
  });
});
