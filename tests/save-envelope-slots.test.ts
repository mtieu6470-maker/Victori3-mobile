// SAVE-01: envelope identity (engine version, world-data fingerprint, saved hour), RNG fail-closed
// (B4-R1) and safe slot writes with backup/recovery.
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { advanceHours } from '../src/engine/simulation';
import { deserialize, deserializeWithMeta, serialize, worldDataFingerprint } from '../src/engine/save';
import { ENGINE_VERSION } from '../src/engine/version';
import { BACKUP_SUFFIX, listSlotNames, readSlotSafely, writeSlotSafely, type SlotStore } from '../src/ui/game/slots';

loadNodeData();

function memoryStore(failPut = false): SlotStore & { map: Map<string, string> } {
  const map = new Map<string, string>();
  return {
    map,
    get: async (k) => map.get(k),
    keys: async () => [...map.keys()],
    putAll: async (entries) => { if (failPut) throw new Error('disk full'); for (const [k, v] of entries) map.set(k, v); },
  };
}

describe('SAVE-01 envelope identity', () => {
  it('writes engine version, world-data fingerprint and saved hour, and reads them back', () => {
    const st = createGame({ mode: 'historical', seed: 4, player: null });
    advanceHours(st, 37);
    const env = JSON.parse(serialize(st));
    expect(env.engineVersion).toBe(ENGINE_VERSION);
    expect(env.dataFingerprint).toBe(worldDataFingerprint());
    expect(env.dataFingerprint).toMatch(/^fp1-[0-9a-f]{16}-\d+r$/);
    expect(env.savedAtHour).toBe(37);
    const { meta } = deserializeWithMeta(JSON.stringify(env));
    expect(meta).toMatchObject({ engineVersion: ENGINE_VERSION, dataFingerprint: env.dataFingerprint, savedAtHour: 37 });
  });

  it('rejects a save built for a different world data layout with an explicit message', () => {
    const env = JSON.parse(serialize(createGame({ mode: 'sandbox', seed: 4, player: null })));
    env.dataFingerprint = 'fp1-0000000000000000-1r';
    expect(() => deserialize(JSON.stringify(env))).toThrow('different world data build');
    env.dataFingerprint = 42;
    expect(() => deserialize(JSON.stringify(env))).toThrow('invalid data fingerprint');
  });

  it('rejects an envelope hour that disagrees with the canonical clock', () => {
    const env = JSON.parse(serialize(createGame({ mode: 'historical', seed: 4, player: null })));
    env.savedAtHour = 999;
    expect(() => deserialize(JSON.stringify(env))).toThrow('envelope hour does not match');
  });

  it('still loads pre-SAVE-01 envelopes without identity fields', () => {
    const env = JSON.parse(serialize(createGame({ mode: 'historical', seed: 4, player: null })));
    delete env.engineVersion; delete env.dataFingerprint; delete env.savedAtHour;
    expect(() => deserialize(JSON.stringify(env))).not.toThrow();
  });

  it('B4-R1: fails closed on missing, malformed or degenerate RNG state', () => {
    const base = JSON.parse(serialize(createGame({ mode: 'historical', seed: 4, player: null })));
    for (const rng of [undefined, [1, 2, 3], [1, 2, 3, -4], [1, 2, 3, 2 ** 32], [0.5, 1, 2, 3], [0, 0, 0, 0], 'abcd']) {
      const env = structuredClone(base);
      if (rng === undefined) delete env.state.rng; else env.state.rng = rng;
      expect(() => deserialize(JSON.stringify(env))).toThrow(/RNG state/);
    }
    const st = createGame({ mode: 'historical', seed: 4, player: null });
    (st as any).rng = undefined;
    expect(() => serialize(st)).toThrow(/RNG state/);
  });
});

describe('SAVE-01 safe slot writes', () => {
  const save = (seed: number, hours = 0) => { const st = createGame({ mode: 'historical', seed, player: null }); advanceHours(st, hours); return serialize(st); };

  it('keeps the previous good save as a backup in the same write', async () => {
    const store = memoryStore();
    const a = save(1, 5); const b = save(1, 9);
    await writeSlotSafely(store, 'Slot', a);
    expect(store.map.has('Slot' + BACKUP_SUFFIX)).toBe(false);
    await writeSlotSafely(store, 'Slot', b);
    expect(store.map.get('Slot')).toBe(b);
    expect(store.map.get('Slot' + BACKUP_SUFFIX)).toBe(a);
    expect(await listSlotNames(store)).toEqual(['Slot']);
  });

  it('never replaces a good save with an invalid one', async () => {
    const store = memoryStore();
    const a = save(2);
    await writeSlotSafely(store, 'Slot', a);
    await expect(writeSlotSafely(store, 'Slot', '{"format":"currents-of-history-save","version":3}')).rejects.toThrow();
    await expect(writeSlotSafely(store, 'Slot', 'not json')).rejects.toThrow();
    expect(store.map.get('Slot')).toBe(a);
    expect(store.map.has('Slot' + BACKUP_SUFFIX)).toBe(false);
  });

  it('a failed storage write leaves the existing slot untouched', async () => {
    const store = memoryStore();
    const a = save(3);
    await writeSlotSafely(store, 'Slot', a);
    const failing = { ...store, putAll: async () => { throw new Error('disk full'); } };
    await expect(writeSlotSafely(failing, 'Slot', save(3, 4))).rejects.toThrow('disk full');
    expect(store.map.get('Slot')).toBe(a);
  });

  it('recovers from the backup when the primary is corrupt, and reports it', async () => {
    const store = memoryStore();
    const a = save(4, 2); const b = save(4, 6);
    await writeSlotSafely(store, 'Slot', a);
    await writeSlotSafely(store, 'Slot', b);
    store.map.set('Slot', b.slice(0, b.length / 2)); // truncated write / storage corruption
    const r = await readSlotSafely(store, 'Slot');
    expect(r?.fromBackup).toBe(true);
    expect(r?.text).toBe(a);
    expect(r?.primaryError).toBeTruthy();
    expect(deserialize(r!.text).clock.hour).toBe(2);
  });

  it('returns undefined for a missing slot and rejects reserved names', async () => {
    const store = memoryStore();
    expect(await readSlotSafely(store, 'Nope')).toBeUndefined();
    await expect(writeSlotSafely(store, '  ', save(5))).rejects.toThrow();
    await expect(writeSlotSafely(store, 'x' + BACKUP_SUFFIX, save(5))).rejects.toThrow();
  });
});
