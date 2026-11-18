/**
 * S0-B4 characterization of frozen baseline 2240a8f.
 * Audit-only: this file is copied into an isolated baseline checkout by the
 * tests-only workflow. Do not change product serialization, schema, RNG or simulation.
 */
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { execute } from '../src/engine/commands';
import { deserialize, serialize, SAVE_FORMAT } from '../src/engine/save';
import type { GameState } from '../src/engine/types';
import { fresh, stepMonth } from './helpers';
import { S0_B4_SCENARIO } from './fixtures/s0-b4-scenario';

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`).join(',')}}`;
  }
  const encoded = JSON.stringify(value);
  return encoded === undefined ? 'undefined' : encoded;
}

function persistedSnapshot(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state)) as GameState;
}

function stateHash(state: GameState): string {
  return createHash('sha256').update(canonical(persistedSnapshot(state))).digest('hex');
}

function textHash(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

/** Compare every persisted field; arrays retain their simulation-significant order. */
function firstDifference(a: unknown, b: unknown, path = 'state'): string | null {
  if (Object.is(a, b)) return null;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return `${path}.length (${a.length} !== ${b.length})`;
    for (let i = 0; i < a.length; i++) {
      const difference = firstDifference(a[i], b[i], `${path}[${i}]`);
      if (difference) return difference;
    }
    return null;
  }
  if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
    const ak = Object.keys(a as object).sort();
    const bk = Object.keys(b as object).sort();
    const keys = [...new Set([...ak, ...bk])].sort();
    for (const key of keys) {
      if (!(key in (a as object)) || !(key in (b as object))) return `${path}.${key} (field presence differs)`;
      const difference = firstDifference(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
        `${path}.${key}`,
      );
      if (difference) return difference;
    }
    return null;
  }
  return path;
}

function applyCommandsAtCurrentTick(state: GameState): void {
  for (const entry of S0_B4_SCENARIO.commands) {
    if (entry.tick !== state.tick) continue;
    const result = execute(state, entry.command);
    expect(result.ok, `command at tick ${entry.tick} (${entry.command.type}) should be accepted: ${result.reason ?? ''}`).toBe(true);
  }
}

/** Apply the same deterministic test-supplied commands before each monthly tick. */
function advanceTo(state: GameState, targetTick: number): void {
  expect(targetTick).toBeGreaterThanOrEqual(state.tick);
  while (state.tick < targetTick) {
    applyCommandsAtCurrentTick(state);
    stepMonth(state);
  }
  expect(state.tick).toBe(targetTick);
}

describe('S0-B4 save/load characterization — frozen baseline 2240a8f', () => {
  for (const mode of S0_B4_SCENARIO.modes) {
    for (const cut of S0_B4_SCENARIO.saveCuts) {
      it(`${mode}: replay identical player commands across save at K=${cut}, then resume to N=${S0_B4_SCENARIO.totalMonths}`, () => {
        const uninterrupted = fresh(mode, S0_B4_SCENARIO.seed, S0_B4_SCENARIO.player);
        const interrupted = fresh(mode, S0_B4_SCENARIO.seed, S0_B4_SCENARIO.player);
        const initialHash = stateHash(uninterrupted);

        expect(uninterrupted.countries[S0_B4_SCENARIO.player]?.alive).toBe(true);
        expect(interrupted.countries[S0_B4_SCENARIO.player]?.alive).toBe(true);

        advanceTo(uninterrupted, S0_B4_SCENARIO.totalMonths);
        advanceTo(interrupted, cut);
        expect(interrupted.tick, 'save checkpoint must be reached').toBe(cut);

        const saveText = serialize(interrupted);
        const saveHash = textHash(saveText);
        const restored = deserialize(saveText);
        expect(restored.tick).toBe(cut);
        advanceTo(restored, S0_B4_SCENARIO.totalMonths);

        const expected = persistedSnapshot(uninterrupted);
        const actual = persistedSnapshot(restored);
        const difference = firstDifference(expected, actual);
        const expectedHash = stateHash(expected);
        const actualHash = stateHash(actual);

        expect(uninterrupted.tick).toBe(S0_B4_SCENARIO.totalMonths);
        expect(Object.keys(uninterrupted.countries).length).toBeGreaterThan(0);
        expect(uninterrupted.regions.length).toBeGreaterThan(0);
        expect(expectedHash).not.toBe(initialHash);
        expect(difference, difference ? `first differing persisted state path: ${difference}` : 'persisted states must match').toBeNull();
        expect(actualHash).toBe(expectedHash);
        expect(serialize(restored)).toBe(serialize(uninterrupted));

        const player = uninterrupted.countries[S0_B4_SCENARIO.player];
        expect(player.taxRate).toBe(0.16);
        expect(player.budget.education).toBeCloseTo(0.11, 8);
        expect(player.budget.construction).toBeCloseTo(0.14, 8);

        // Keep compact, reproducible hashes in the Actions log; full GameState remains an artifact-free test value.
        console.info('[S0-B4]', JSON.stringify({
          baseline: S0_B4_SCENARIO.baselineSha,
          mode,
          seed: S0_B4_SCENARIO.seed,
          player: S0_B4_SCENARIO.player,
          cut,
          totalMonths: S0_B4_SCENARIO.totalMonths,
          saveSha256: saveHash,
          initialStateSha256: initialHash,
          finalStateSha256: actualHash,
          firstDifference: difference,
        }));
      });
    }
  }

  it('rejects malformed non-JSON input', () => {
    expect(() => deserialize('{not-json')).toThrow();
  });

  it('rejects a foreign save format', () => {
    expect(() => deserialize(JSON.stringify({ format: 'foreign', version: 1, state: {} })))
      .toThrow('Not a save file of this game');
  });

  it('rejects an unsupported save version', () => {
    expect(() => deserialize(JSON.stringify({ format: SAVE_FORMAT, version: 999, state: {} })))
      .toThrow('Unsupported save version 999');
  });

  it('throws when the save envelope has no state object', () => {
    expect(() => deserialize(JSON.stringify({ format: SAVE_FORMAT, version: 1 }))).toThrow();
  });

  it('records the baseline legacy default for absent marketStats without inventing post-baseline fields', () => {
    const state = fresh('historical', 77, null);
    const envelope = JSON.parse(serialize(state)) as { state: Partial<GameState> };
    delete envelope.state.marketStats;

    const restored = deserialize(JSON.stringify(envelope));
    expect(restored.marketStats).toEqual({});
    // Baseline 2240a8f predates constructionQueue entirely; deserialization does not add it.
    expect(Object.values(restored.countries).every((country) => !('constructionQueue' in country))).toBe(true);
    expect(restored.regions.length).toBeGreaterThan(0);
  });
});
