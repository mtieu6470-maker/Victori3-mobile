// Save slots in IndexedDB (saves are several MB of JSON, beyond localStorage limits). Works offline.
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
export const saveSlot = (name: string, text: string) => tx('readwrite', (s) => s.put(text, name));
export const loadSlot = (name: string) => tx<string | undefined>('readonly', (s) => s.get(name) as IDBRequest<string | undefined>);
export const listSlots = () => tx<IDBValidKey[]>('readonly', (s) => s.getAllKeys()).then((k) => k.map(String).sort());
