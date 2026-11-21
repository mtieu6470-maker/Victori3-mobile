// CLOCK-01: the hourly-canonical scheduler must reproduce the pre-migration monthly runtime exactly,
// be independent of how real-time pacing chunks hours, never execute January 2027, and continue
// identically across save/load (including mid-month saves and v2 → v3 migration).
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import {
  SYSTEMS, advanceHour, advanceHours, assertClockConsistent, hoursToNextMonth, positionAtMonthStart, stepMonth,
} from '../src/engine/simulation';
import { tickToDate, CAMPAIGN_END_TICK } from '../src/engine/core';
import { sampleYear } from '../src/engine/metrics';
import { refreshPopulationState } from '../src/engine/systems/populationCohorts';
import { CAMPAIGN_FINAL_HOUR, formatDateTime, hourToDateTime, monthStartHour } from '../src/engine/clock/calendar';
import { deserialize, deserializeWithMeta, SAVE_FORMAT, SAVE_SCHEMA_VERSION, serialize } from '../src/engine/save';
import type { GameMode, GameState } from '../src/engine/types';

loadNodeData();

/** Verbatim behaviour of the pre-CLOCK-01 monthly step (base 94d0d28), used as the reference. */
function legacyStepMonth(st: GameState): void {
  st.tick += 1;
  st.date = tickToDate(st.tick);
  for (const s of SYSTEMS) {
    s.run(st);
    st.counters.systemRuns[s.name] = (st.counters.systemRuns[s.name] ?? 0) + 1;
  }
  if (st.date.m === 1) sampleYear(st);
  refreshPopulationState(st);
}

const withoutClock = (st: GameState) => { const { clock: _clock, ...rest } = st; return JSON.stringify(rest); };
const clone = (st: GameState) => JSON.parse(JSON.stringify(st)) as GameState;

describe('CLOCK-01 hourly scheduler equivalence with the monthly runtime', () => {
  it.each(['historical', 'sandbox'] as GameMode[])('%s: 14 monthly boundaries produce byte-identical state (incl. the January yearly phase)', (mode) => {
    const legacy = createGame({ mode, seed: 1836, player: null });
    const hourly = createGame({ mode, seed: 1836, player: null });
    for (let i = 0; i < 14; i++) {
      legacyStepMonth(legacy);
      expect(stepMonth(hourly)).toBe(true);
      expect(hourly.clock.hour).toBe(monthStartHour(hourly.tick));
      expect(withoutClock(hourly)).toBe(withoutClock(legacy));
    }
    expect(hourly.tick).toBe(14);
    expect(formatDateTime(hourToDateTime(hourly.clock.hour))).toBe('1837-03-01T00:00');
  });

  it('result at a canonical time does not depend on how hours are chunked by real-time pacing', () => {
    const target = monthStartHour(3) + 157; // mid-April 1836
    const byHour = createGame({ mode: 'sandbox', seed: 99, player: 'GBR' });
    while (byHour.clock.hour < target) expect(advanceHour(byHour)).toBe(true);

    const byChunks = createGame({ mode: 'sandbox', seed: 99, player: 'GBR' });
    const chunks = [1, 7, 24, 3, 100, 333, 2, 48, 719, 12, 6];
    let i = 0;
    while (byChunks.clock.hour < target) {
      const n = Math.min(chunks[i++ % chunks.length], target - byChunks.clock.hour);
      expect(advanceHours(byChunks, n).hours).toBe(n);
    }

    const byYieldingBatches = createGame({ mode: 'sandbox', seed: 99, player: 'GBR' });
    let calls = 0;
    while (byYieldingBatches.clock.hour < target) {
      // A budget that yields after every 5th hour, as a slow device would.
      const r = advanceHours(byYieldingBatches, target - byYieldingBatches.clock.hour, () => ++calls % 5 === 0);
      expect(r.hours).toBeGreaterThan(0);
    }

    expect(JSON.stringify(byChunks)).toBe(JSON.stringify(byHour));
    expect(JSON.stringify(byYieldingBatches)).toBe(JSON.stringify(byHour));
    expect(byHour.tick).toBe(3);
  });

  it('runs monthly systems only at monthly boundaries; intra-month hours change nothing but the clock', () => {
    const st = createGame({ mode: 'historical', seed: 5, player: null });
    stepMonth(st);
    const before = withoutClock(st);
    const n = hoursToNextMonth(st) - 1; // stop one hour before the March 1836 boundary
    expect(advanceHours(st, n)).toEqual({ hours: n, monthlyBoundaries: 0, stop: 'requested' });
    expect(withoutClock(st)).toBe(before);
    expect(formatDateTime(hourToDateTime(st.clock.hour))).toBe('1836-02-29T23:00');
    expect(advanceHours(st, 1)).toEqual({ hours: 1, monthlyBoundaries: 1, stop: 'requested' });
    expect(st.tick).toBe(2);
    expect(st.date).toEqual({ y: 1836, m: 3 });
  });

  it('plays every December 2026 hour, stops at 31/12/2026 23:00 and never executes January 2027', () => {
    const st = createGame({ mode: 'historical', seed: 2026, player: null });
    positionAtMonthStart(st, CAMPAIGN_END_TICK);
    const runs = JSON.stringify(st.counters.systemRuns);
    const r = advanceHours(st, 10_000);
    expect(r).toEqual({ hours: 31 * 24 - 1, monthlyBoundaries: 0, stop: 'campaign_end' });
    expect(st.clock.hour).toBe(CAMPAIGN_FINAL_HOUR);
    expect(st.tick).toBe(CAMPAIGN_END_TICK);
    expect(st.date).toEqual({ y: 2026, m: 12 });
    expect(JSON.stringify(st.counters.systemRuns)).toBe(runs);

    const terminal = JSON.stringify(st);
    expect(advanceHour(st)).toBe(false);
    expect(advanceHours(st, 5)).toEqual({ hours: 0, monthlyBoundaries: 0, stop: 'campaign_end' });
    expect(stepMonth(st)).toBe(false);
    expect(JSON.stringify(st)).toBe(terminal);
  });

  it('fails closed when canonical hour, month tick or date are inconsistent', () => {
    const st = createGame({ mode: 'historical', seed: 3, player: null });
    st.tick = 5; // tick edited without the clock
    expect(() => assertClockConsistent(st)).toThrow('Clock/tick mismatch');
    expect(() => advanceHour(st)).toThrow(RangeError);
    expect(() => stepMonth(st)).toThrow(RangeError);

    const st2 = createGame({ mode: 'historical', seed: 3, player: null });
    st2.clock.hour = -1;
    expect(() => advanceHour(st2)).toThrow('Invalid canonical clock hour');
    const st3 = createGame({ mode: 'historical', seed: 3, player: null });
    st3.date = { y: 1837, m: 1 };
    expect(() => advanceHour(st3)).toThrow('Clock/date mismatch');
  });
});

describe('CLOCK-01 save schema v3 and continuation', () => {
  it('continues identically after a mid-month save/load (canonical hour and RNG persisted)', () => {
    const uninterrupted = createGame({ mode: 'historical', seed: 77, player: 'FRA' });
    const saved = createGame({ mode: 'historical', seed: 77, player: 'FRA' });
    const mid = monthStartHour(1) + 413; // within February 1836
    advanceHours(uninterrupted, mid);
    advanceHours(saved, mid);

    const text = serialize(saved, { clockPreference: { kind: 'fixed', hps: 24 } });
    const { state: loaded, meta } = deserializeWithMeta(text);
    expect(loaded.version).toBe(SAVE_SCHEMA_VERSION);
    expect(loaded.clock.hour).toBe(mid);
    expect(meta.clockPreference).toEqual({ kind: 'fixed', hps: 24 });
    // The pace preference is envelope metadata, never part of deterministic GameState.
    expect(JSON.stringify(loaded)).toBe(JSON.stringify(saved));

    for (let i = 0; i < 2; i++) { stepMonth(uninterrupted); stepMonth(loaded); }
    expect(JSON.stringify(loaded)).toBe(JSON.stringify(uninterrupted));
  });

  it('migrates a monthly v2 save to v3 at its month-start hour without consuming RNG, then continues identically', () => {
    const reference = createGame({ mode: 'sandbox', seed: 412, player: 'PRU' });
    stepMonth(reference); stepMonth(reference);
    const legacy = clone(reference) as Partial<GameState>;
    delete legacy.clock;
    legacy.version = 2;
    const rngBefore = JSON.stringify(legacy.rng);
    const migrated = deserialize(JSON.stringify({ format: SAVE_FORMAT, version: 2, savedAt: '1836-03', state: legacy }));
    expect(migrated.version).toBe(3);
    expect(migrated.clock).toEqual({ hour: monthStartHour(2) });
    expect(JSON.stringify(migrated.rng)).toBe(rngBefore);
    // Structural equality: the migrated object gains `clock` as its last key, so raw JSON key order differs.
    expect(migrated).toEqual(reference);

    stepMonth(reference); stepMonth(migrated);
    expect(migrated).toEqual(reference);
  });

  it('migrates a v1 save through v2 to v3', () => {
    const st = createGame({ mode: 'historical', seed: 8, player: null });
    stepMonth(st);
    const legacy = clone(st) as Partial<GameState>;
    delete legacy.clock; delete legacy.population;
    legacy.version = 1;
    const migrated = deserialize(JSON.stringify({ format: SAVE_FORMAT, version: 1, state: legacy }));
    expect(migrated.version).toBe(3);
    expect(migrated.clock.hour).toBe(monthStartHour(1));
    expect(() => stepMonth(migrated)).not.toThrow();
  });

  it('rejects v3 saves with a missing, invalid or inconsistent clock instead of repairing them', () => {
    const st = createGame({ mode: 'historical', seed: 9, player: null });
    stepMonth(st);
    const envelope = (mutate: (s: Record<string, unknown>) => void) => {
      const s = clone(st) as unknown as Record<string, unknown>;
      mutate(s);
      return JSON.stringify({ format: SAVE_FORMAT, version: 3, state: s });
    };
    expect(() => deserialize(envelope((s) => { delete s.clock; }))).toThrow('missing its canonical clock');
    expect(() => deserialize(envelope((s) => { s.clock = { hour: -5 }; }))).toThrow('Invalid canonical clock hour');
    expect(() => deserialize(envelope((s) => { s.clock = { hour: CAMPAIGN_FINAL_HOUR + 1 }; }))).toThrow('Invalid canonical clock hour');
    expect(() => deserialize(envelope((s) => { s.clock = { hour: 12.5 }; }))).toThrow('Invalid canonical clock hour');
    expect(() => deserialize(envelope((s) => { s.clock = { hour: monthStartHour(7) }; }))).toThrow('does not match the saved month tick');
    expect(() => deserialize(JSON.stringify({ format: SAVE_FORMAT, version: 2, state: { ...clone(st), version: 2, clock: { hour: 3 } } }))).toThrow('inconsistent clock field');

    const bad = clone(st); bad.clock.hour += 24 * 40;
    expect(() => serialize(bad)).toThrow('does not match the saved month tick');
  });

  it('treats an unreadable pace preference as AUTO without rejecting the save', () => {
    const st = createGame({ mode: 'historical', seed: 10, player: null });
    const text = JSON.stringify({ ...JSON.parse(serialize(st)), clockPreference: { kind: 'fixed', hps: 999 } });
    expect(deserializeWithMeta(text).meta.clockPreference).toEqual({ kind: 'auto' });
    expect(deserializeWithMeta(serialize(st)).meta).toEqual({});
  });
});
