/**
 * S0-B4 characterization only (OD-20261116-11; v3.2 §6.7).
 *
 * Runs the unmodified baseline engine and save implementation. This file is audit/test
 * instrumentation, not product code. Do not "fix" any observed behavior here.
 *
 * Contract:
 * - same mode, seed, player, data-build and map-build for both paths;
 * - same deterministic player-command schedule at absolute simulation ticks;
 * - Path A runs continuously; Path B serializes/deserializes at K, then continues;
 * - compare the complete GameState, including RNG and order-sensitive arrays;
 * - canonicalize object-key order only; never sort arrays;
 * - cover Historical and Sandbox with K=6 (mid-year) and K=12 (January boundary);
 * - characterization fixtures record actual malformed/legacy-save behavior.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { execute, type Command } from '../src/engine/commands';
import { tickToDate } from '../src/engine/core';
import { createGame } from '../src/engine/init';
import { loadNodeData } from '../src/engine/node';
import { stepMonth } from '../src/engine/simulation';
import { deserialize, SAVE_FORMAT, serialize } from '../src/engine/save';
import type { GameMode, GameState } from '../src/engine/types';

loadNodeData();

const BASELINE_PRODUCT_SHA = '2240a8fb865e0021eec2f2f4f1c6803528be9e2c';
const SEED = 21;
const TOTAL_MONTHS = 24;
const CUT_POINTS = [6, 12] as const;

const COMMANDS: ReadonlyArray<{ atTick: number; command: Command }> = [
  { atTick: 2, command: { type: 'set_tax', rate: 0.12 } },
  { atTick: 8, command: { type: 'set_budget', key: 'education', value: 0.23 } },
  { atTick: 16, command: { type: 'set_army_target', manpower: 75000 } },
];

type CommandTrace = Array<{
  tick: number;
  command: Command;
  ok: boolean;
  reason?: string;
}>;

type SaveEnvelope = {
  format: string;
  version: number;
  savedAt?: string;
  state?: GameState;
};

function fileSha256(relativePath: string): string {
  return createHash('sha256')
    .update(readFileSync(join(process.cwd(), relativePath)))
    .digest('hex');
}

const DATA_BUILD_HASHES = Object.freeze({
  db: fileSha256('src/generated/db.json'),
  map: fileSha256('src/generated/map.json'),
});

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    // JSON.stringify writes undefined array entries (and holes) as null. Keep
    // their positions and never sort arrays: array order is engine-significant.
    return Array.from(value, (item) => item === undefined ? null : canonicalize(item));
  }
  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    // JSON.stringify omits object properties whose values are undefined.
    return Object.fromEntries(
      Object.keys(record)
        .filter((key) => record[key] !== undefined)
        .sort()
        .map((key) => [key, canonicalize(record[key])]),
    );
  }
  return value;
}

function canonicalJson(state: GameState): string {
  return JSON.stringify(canonicalize(state));
}

function stateSha256(state: GameState): string {
  return createHash('sha256').update(canonicalJson(state)).digest('hex');
}

function firstDifference(a: unknown, b: unknown, path = '$'): string | null {
  if (Object.is(a, b)) return null;

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return path;
    if (a.length !== b.length) return `${path}.length`;
    for (let i = 0; i < a.length; i++) {
      const difference = firstDifference(a[i], b[i], `${path}[${i}]`);
      if (difference) return difference;
    }
    return null;
  }

  const aObject = a !== null && typeof a === 'object';
  const bObject = b !== null && typeof b === 'object';
  if (!aObject || !bObject) return path;

  const left = a as Record<string, unknown>;
  const right = b as Record<string, unknown>;
  const keys = [...new Set([...Object.keys(left), ...Object.keys(right)])].sort();
  for (const key of keys) {
    const hasLeft = Object.prototype.hasOwnProperty.call(left, key);
    const hasRight = Object.prototype.hasOwnProperty.call(right, key);
    if (hasLeft !== hasRight) return `${path}.${key}`;
    const difference = firstDifference(left[key], right[key], `${path}.${key}`);
    if (difference) return difference;
  }
  return null;
}

function jsonRoundTrip(value: unknown): unknown {
  // Compare the value that can actually survive the save serializer:
  // undefined object values disappear, undefined array entries become null,
  // non-finite numbers become null, and negative zero becomes zero.
  const serialized = JSON.stringify(value);
  return serialized === undefined ? undefined : JSON.parse(serialized) as unknown;
}

function firstJsonDifference(a: unknown, b: unknown): string | null {
  // Normalize through the same JSON representation used by serialize(), then
  // canonicalize object keys only. Arrays remain positional and order-sensitive.
  return firstDifference(
    canonicalize(jsonRoundTrip(a)),
    canonicalize(jsonRoundTrip(b)),
  );
}

function cloneState(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state)) as GameState;
}

function advanceTo(state: GameState, targetTick: number, trace: CommandTrace): void {
  while (state.tick < targetTick) {
    for (const item of COMMANDS) {
      if (item.atTick !== state.tick) continue;
      const result = execute(state, item.command);
      trace.push({
        tick: state.tick,
        command: item.command,
        ok: result.ok,
        ...(result.reason ? { reason: result.reason } : {}),
      });
      if (!result.ok) {
        throw new Error(
          `B4 scripted player command failed at tick ${state.tick}: ${JSON.stringify(item.command)}; ${result.reason ?? 'no reason'}`,
        );
      }
    }
    stepMonth(state);
  }
}

function assertNonVacuous(
  initial: GameState,
  final: GameState,
  trace: CommandTrace,
): void {
  expect(final.tick).toBe(TOTAL_MONTHS);
  expect(final.regions.length).toBeGreaterThan(0);
  expect(Object.values(final.countries).filter((country) => country.alive).length).toBeGreaterThan(0);
  expect(Object.keys(final.counters.systemRuns).length).toBeGreaterThan(0);
  expect(Object.values(final.counters.systemRuns).every((count) => count === TOTAL_MONTHS)).toBe(true);
  expect(trace).toHaveLength(COMMANDS.length);

  // A non-trivial state must evolve; tick alone is not accepted as the only change.
  const rngChanged = firstJsonDifference(initial.rng, final.rng) !== null;
  const country = final.countries.GBR;
  const initialCountry = initial.countries.GBR;
  const economyChanged = !!country && !!initialCountry && (
    country.treasury !== initialCountry.treasury ||
    country.gdp !== initialCountry.gdp ||
    country.income !== initialCountry.income
  );
  const populationChanged = final.regions.some((region, index) =>
    region.pop !== initial.regions[index]?.pop,
  );
  expect(rngChanged || economyChanged || populationChanged).toBe(true);
}

describe('S0-B4 — JSON comparison semantics', () => {
  it('matches JSON semantics for omitted values and order-sensitive arrays', () => {
    const beforeSave = {
      countries: { ABD: { group: undefined } },
      orderedEvents: ['first', 'second'],
    };
    const afterLoad = {
      countries: { ABD: {} },
      orderedEvents: ['first', 'second'],
    };

    expect(firstJsonDifference(beforeSave, afterLoad)).toBeNull();
    expect(firstJsonDifference(
      { orderedEvents: ['first', 'second'] },
      { orderedEvents: ['second', 'first'] },
    )).toBe('$.orderedEvents[0]');
    expect(firstJsonDifference({ values: [undefined] }, { values: [null] })).toBeNull();
  });

  it('matches JSON numeric normalization for non-finite numbers and negative zero', () => {
    expect(firstJsonDifference({ value: Number.NaN }, { value: null })).toBeNull();
    expect(firstJsonDifference({ value: Number.POSITIVE_INFINITY }, { value: null })).toBeNull();
    expect(firstJsonDifference({ value: Number.NEGATIVE_INFINITY }, { value: null })).toBeNull();
    expect(firstJsonDifference({ value: -0 }, { value: 0 })).toBeNull();

    expect(firstJsonDifference(
      { values: [Number.NaN, Number.POSITIVE_INFINITY, -0, undefined] },
      { values: [null, null, 0, null] },
    )).toBeNull();
    expect(firstJsonDifference({ value: Number.NaN }, { value: 0 })).toBe('$.value');
  });
});

describe('S0-B4 — save/load determinism characterization (baseline only)', () => {
  for (const mode of ['historical', 'sandbox'] as const satisfies readonly GameMode[]) {
    for (const cutTick of CUT_POINTS) {
      it(`${mode}: uninterrupted 24 months equals save/load at tick ${cutTick}`, () => {
        const cutDate = tickToDate(cutTick);
        expect(cutDate.m).toBe(cutTick === 6 ? 7 : 1);

        const continuous = createGame({ mode, seed: SEED, player: 'GBR' });
        const splitStart = createGame({ mode, seed: SEED, player: 'GBR' });
        const initial = cloneState(continuous);

        // Same build/data/seed must produce an identical starting GameState.
        expect(stateSha256(splitStart)).toBe(stateSha256(continuous));

        const continuousTrace: CommandTrace = [];
        advanceTo(continuous, TOTAL_MONTHS, continuousTrace);

        const splitTrace: CommandTrace = [];
        advanceTo(splitStart, cutTick, splitTrace);

        const serialized = serialize(splitStart);
        const envelope = JSON.parse(serialized) as SaveEnvelope;
        expect(envelope.format).toBe(SAVE_FORMAT);
        expect(envelope.version).toBe(splitStart.version);
        expect(envelope.state?.tick).toBe(cutTick);
        expect(envelope.state?.rng).toEqual(splitStart.rng);

        const loaded = deserialize(serialized);
        expect(stateSha256(loaded)).toBe(stateSha256(splitStart));
        expect(loaded.tick).toBe(cutTick);
        advanceTo(loaded, TOTAL_MONTHS, splitTrace);

        assertNonVacuous(initial, continuous, continuousTrace);
        assertNonVacuous(initial, loaded, splitTrace);
        expect(splitTrace).toEqual(continuousTrace);

        const continuousHash = stateSha256(continuous);
        const loadedHash = stateSha256(loaded);
        const firstPath = firstJsonDifference(continuous, loaded);

        console.info('[S0_B4_CASE] ' + JSON.stringify({
          baselineProductSha: BASELINE_PRODUCT_SHA,
          mode,
          seed: SEED,
          totalMonths: TOTAL_MONTHS,
          cutTick,
          cutDate: `${cutDate.y}-${String(cutDate.m).padStart(2, '0')}`,
          commandCount: continuousTrace.length,
          dbSha256: DATA_BUILD_HASHES.db,
          mapSha256: DATA_BUILD_HASHES.map,
          continuousStateSha256: continuousHash,
          saveLoadStateSha256: loadedHash,
          firstDifferingPath: firstPath,
          result: firstPath === null ? 'MATCH' : 'MISMATCH',
        }));

        // Compare every GameState field: RNG, counters, logs, pending decisions,
        // treaties, wars, prices, POP/region data and all order-sensitive arrays.
        // Save-envelope fields (format/version/savedAt) are not part of GameState.
        expect(firstPath, firstPath ? `First differing GameState path: ${firstPath}` : undefined).toBeNull();
        expect(loadedHash).toBe(continuousHash);
      });
    }
  }
});

describe('S0-B4 — malformed, incomplete and legacy save characterization', () => {
  // Explicit compact fixtures. They test the existing save contract and are not
  // product save files or defaults for a future schema.
  const fixtures = {
    malformedJson: '{"format":',
    foreignFormat: JSON.stringify({ format: 'foreign-game-save', version: 1, state: {} }),
    unsupportedVersion: JSON.stringify({ format: SAVE_FORMAT, version: 999, state: {} }),
    missingState: JSON.stringify({ format: SAVE_FORMAT, version: 1 }),
  };

  it('invalid JSON throws the native JSON parse error', () => {
    expect(() => deserialize(fixtures.malformedJson)).toThrow(SyntaxError);
  });

  it('foreign format is rejected', () => {
    expect(() => deserialize(fixtures.foreignFormat)).toThrow('Not a save file of this game');
  });

  it('unsupported version is rejected before reading state', () => {
    expect(() => deserialize(fixtures.unsupportedVersion)).toThrow('Unsupported save version 999');
  });

  it('missing envelope state throws during deserialization', () => {
    expect(() => deserialize(fixtures.missingState)).toThrow(TypeError);
  });

  it('legacy save without marketStats receives the current empty-object fallback and continues', () => {
    const state = createGame({ mode: 'historical', seed: SEED, player: 'GBR' });
    const legacyState = cloneState(state) as unknown as { version: number; marketStats?: GameState['marketStats'] };
    delete legacyState.marketStats;

    const legacyText = JSON.stringify({
      format: SAVE_FORMAT,
      version: legacyState.version,
      savedAt: '1836-01',
      state: legacyState,
    });

    const restored = deserialize(legacyText);
    expect(restored.marketStats).toEqual({});
    expect(() => stepMonth(restored)).not.toThrow();

    console.info('[S0_B4_SAVE_COMPAT] ' + JSON.stringify({
      case: 'legacy-marketStats-missing',
      deserialize: 'loaded',
      marketStatsAfterLoad: 'defaulted-to-empty-object',
      oneMonthContinuation: 'no-throw',
    }));
  });

  it('missing RNG is not rejected by deserialize (current behavior)', () => {
    const state = createGame({ mode: 'sandbox', seed: SEED, player: 'GBR' });
    const envelope = JSON.parse(serialize(state)) as SaveEnvelope & { state: GameState };
    delete (envelope.state as Partial<GameState>).rng;

    const restored = deserialize(JSON.stringify(envelope));
    expect(restored.rng).toBeUndefined();

    let continuationError: unknown;
    try {
      stepMonth(restored);
    } catch (error) {
      continuationError = error;
    }

    // Characterize the current baseline defect explicitly. Do not repair it in S0.
    expect(continuationError).toBeInstanceOf(TypeError);
    const errorName = continuationError instanceof Error ? continuationError.name : null;
    expect(errorName).toBe('TypeError');

    console.info('[S0_B4_SAVE_COMPAT] ' + JSON.stringify({
      case: 'rng-missing',
      deserialize: 'loaded-with-rng-undefined',
      oneMonthContinuation: continuationError === undefined ? 'no-throw' : 'throws',
      errorName,
    }));
  });
});
