const DATABASE_NAME = "entropia-manager-local";
const DATABASE_VERSION = 1;
const STORE_NAME = "chat-log";
const HANDLE_KEY = "selected-file";

export type StoredChatLogHandle = FileSystemFileHandle & {
  queryPermission: (descriptor?: { mode?: "read" | "readwrite" }) => Promise<PermissionState>;
  requestPermission: (descriptor?: { mode?: "read" | "readwrite" }) => Promise<PermissionState>;
};

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB error"));
  });
}

async function withStore<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const request = operation(transaction.objectStore(STORE_NAME));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB error"));
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB error"));
  });
}

export async function getChatLogHandle(): Promise<StoredChatLogHandle | null> {
  if (typeof indexedDB === "undefined") return null;
  return (await withStore<StoredChatLogHandle | undefined>("readonly", (store) => store.get(HANDLE_KEY))) ?? null;
}

export async function saveChatLogHandle(handle: StoredChatLogHandle): Promise<void> {
  await withStore("readwrite", (store) => store.put(handle, HANDLE_KEY));
}

export async function removeChatLogHandle(): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  await withStore("readwrite", (store) => store.delete(HANDLE_KEY));
}
