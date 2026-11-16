/**
 * S0-B4 characterization of the frozen 2240a8f save/load behavior.
 * Audit-only: do not change product serialization, schema, RNG or simulation code here.
 */
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { deserialize, serialize, SAVE_FORMAT } from '../src/engine/save';
import type { GameState } from '../src/engine/types';
import { fresh, stepMonth } from './helpers';

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function stateHash(state: GameState): string {
  return createHash('sha256').update(canonical(state)).digest('hex');
}

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
      const difference = firstDifference((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key], `${path}.${key}`);
      if (difference) return difference;
    }
    return null;
  }
  return path;
}

describe('S0-B4 save/load characterization — frozen baseline behavior', () => {
  for (const mode of ['historical', 'sandbox'] as const) {
    for (const cut of [5, 12]) {
      it(`${mode}: save at K=${cut}, resume to N=18 matches uninterrupted state`, () => {
        const uninterrupted = fresh(mode, 20261116, null);
        const resumed = fresh(mode, 20261116, null);
        const initialHash = stateHash(uninterrupted);

        for (let i = 0; i < 18; i++) stepMonth(uninterrupted);
        for (let i = 0; i < cut; i++) stepMonth(resumed);

        expect(resumed.tick, 'cut point must be reached').toBe(cut);
        const restored = deserialize(serialize(resumed));
        for (let i = cut; i < 18; i++) stepMonth(restored);

        expect(uninterrupted.tick).toBe(18);
        expect(Object.keys(uninterrupted.countries).length).toBeGreaterThan(0);
        expect(uninterrupted.regions.length).toBeGreaterThan(0);
        expect(stateHash(uninterrupted)).not.toBe(initialHash);

        const difference = firstDifference(uninterrupted, restored);
        expect(difference, difference ? `first differing state path: ${difference}` : 'states must match').toBeNull();
        expect(stateHash(restored)).toBe(stateHash(uninterrupted));
      });
    }
  }

  it('rejects non-JSON input', () => {
    expect(() => deserialize('{not-json')).toThrow();
  });

  it('rejects a foreign save format', () => {
    expect(() => deserialize(JSON.stringify({ format: 'foreign', version: 1, state: {} }))).toThrow('Not a save file of this game');
  });

  it('rejects an unsupported save version', () => {
    expect(() => deserialize(JSON.stringify({ format: SAVE_FORMAT, version: 999, state: {} }))).toThrow('Unsupported save version 999');
  });

  it('throws when the save envelope has no state object', () => {
    expect(() => deserialize(JSON.stringify({ format: SAVE_FORMAT, version: 1 }))).toThrow();
  });

  it('records legacy defaults for absent marketStats and constructionQueue', () => {
    const state = fresh('historical', 77, null);
    const envelope = JSON.parse(serialize(state)) as { state: GameState };
    delete (envelope.state as Partial<GameState>).marketStats;
    for (const country of Object.values(envelope.state.countries)) delete (country as Partial<typeof country>).constructionQueue;

    const restored = deserialize(JSON.stringify(envelope));
    expect(restored.marketStats).toEqual({});
    expect(Object.values(restored.countries).every(country => Array.isArray(country.constructionQueue))).toBe(true);
  });
});
