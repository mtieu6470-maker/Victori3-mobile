// Safe save-slot writes (SAVE-01). Pure logic over a minimal key-value store so it can be tested
// without IndexedDB:
// - a save is validated (full deserialize) BEFORE it can replace anything;
// - the previous good save of the slot is kept as a backup, written in the same atomic batch;
// - loading falls back to the backup when the primary is unreadable or corrupt.
import { deserialize } from '../../engine/save';

export interface SlotStore {
  get(key: string): Promise<string | undefined>;
  /** Must write all entries atomically (one IndexedDB transaction) or none. */
  putAll(entries: [string, string][]): Promise<void>;
  keys(): Promise<string[]>;
}

export const BACKUP_SUFFIX = ' ⟲backup';
export const isBackupKey = (k: string) => k.endsWith(BACKUP_SUFFIX);

function assertSlotName(name: string) {
  if (typeof name !== 'string' || !name.trim() || isBackupKey(name)) throw new Error('Tên bản lưu không hợp lệ');
}

export async function writeSlotSafely(store: SlotStore, name: string, text: string, validate: (t: string) => unknown = deserialize): Promise<void> {
  assertSlotName(name);
  validate(text); // throws: nothing is written, the existing save and backup stay intact
  const previous = await store.get(name);
  const entries: [string, string][] = [[name, text]];
  if (previous !== undefined && previous !== text) entries.push([name + BACKUP_SUFFIX, previous]);
  await store.putAll(entries);
}

export interface SlotRead { text: string; fromBackup: boolean; primaryError?: string }

export async function readSlotSafely(store: SlotStore, name: string, validate: (t: string) => unknown = deserialize): Promise<SlotRead | undefined> {
  assertSlotName(name);
  const primary = await store.get(name);
  let primaryError: string | undefined;
  if (primary !== undefined) {
    try { validate(primary); return { text: primary, fromBackup: false }; } catch (e) { primaryError = (e as Error).message; }
  }
  const backup = await store.get(name + BACKUP_SUFFIX);
  if (backup !== undefined) {
    validate(backup); // if the backup is also bad, surface that error
    return { text: backup, fromBackup: true, primaryError };
  }
  if (primaryError) throw new Error(primaryError);
  return undefined;
}

export async function listSlotNames(store: SlotStore): Promise<string[]> {
  return (await store.keys()).filter((k) => !isBackupKey(k)).sort();
}
