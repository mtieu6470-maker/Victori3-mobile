// Save slots in IndexedDB (saves are several MB of JSON, beyond localStorage limits). Works offline.
const DB = 'dong-chay-lich-su'; const STORE = 'saves';
function open(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => { r.result.createObjectStore(STORE); };
    r.onsuccess = () => {
      const db = r.result;
      // Release this connection on version changes so app upgrades are not blocked by an idle handle.
      db.onversionchange = () => db.close();
      res(db);
    };
    r.onerror = () => rej(r.error ?? new Error('Không mở được cơ sở dữ liệu lưu game'));
  });
}
async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    let transaction: IDBTransaction;
    let request!: IDBRequest<T>;
    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      db.close();
    };
    try {
      transaction = db.transaction(STORE, mode);
      request = fn(transaction.objectStore(STORE));
    } catch (error) {
      close();
      reject(error);
      return;
    }

    // A request may succeed before the transaction is committed. Resolve only on transaction.complete.
    transaction.oncomplete = () => {
      close();
      resolve(request.result);
    };
    const fail = () => {
      close();
      reject(transaction.error ?? request.error ?? new Error('Giao dịch lưu game không hoàn tất'));
    };
    transaction.onerror = fail;
    transaction.onabort = fail;
  });
}
export const saveSlot = (name: string, text: string) => tx('readwrite', (s) => s.put(text, name));
export const loadSlot = (name: string) => tx<string | undefined>('readonly', (s) => s.get(name) as IDBRequest<string | undefined>);
export const listSlots = () => tx<IDBValidKey[]>('readonly', (s) => s.getAllKeys()).then((k) => k.map(String).sort());
