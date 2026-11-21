// Save slots in IndexedDB (saves are several MB of JSON, beyond localStorage limits). Works offline.
// Writes go through slots.ts: validated before write, previous save kept as backup in the same
// transaction, automatic fallback to the backup on load (SAVE-01).
import { listSlotNames, readSlotSafely, writeSlotSafely, type SlotRead, type SlotStore } from './slots';

const DB = 'dong-chay-lich-su'; const STORE = 'saves';
function open(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => { r.result.createObjectStore(STORE); };
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
}
async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((res, rej) => { const t = db.transaction(STORE, mode); const q = fn(t.objectStore(STORE)); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); });
}

export const idbStore: SlotStore = {
  get: (key) => tx<string | undefined>('readonly', (s) => s.get(key) as IDBRequest<string | undefined>),
  keys: () => tx<IDBValidKey[]>('readonly', (s) => s.getAllKeys()).then((k) => k.map(String)),
  putAll: async (entries) => {
    const db = await open();
    await new Promise<void>((res, rej) => {
      const t = db.transaction(STORE, 'readwrite');
      const s = t.objectStore(STORE);
      for (const [k, v] of entries) s.put(v, k);
      t.oncomplete = () => res(); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error ?? new Error('Save transaction aborted'));
    });
  },
};

export const saveSlot = (name: string, text: string) => writeSlotSafely(idbStore, name, text);
/** Returns the save text (falling back to the slot's backup if the primary is corrupt). */
export const loadSlot = async (name: string): Promise<string | undefined> => (await loadSlotDetailed(name))?.text;
export const loadSlotDetailed = (name: string): Promise<SlotRead | undefined> => readSlotSafely(idbStore, name);
export const listSlots = () => listSlotNames(idbStore);
