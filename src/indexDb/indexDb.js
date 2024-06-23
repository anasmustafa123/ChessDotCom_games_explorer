import { openDB } from "idb";

const DB_NAME = "my-database";
const STORE_NAME = "keyval";

async function initDB() {
  const db = await openDB(import.meta.env.VITE_DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(import.meta.env.VITE_STORE_NAME);
    },
  });
  return db;
}
export async function clearDB() {
  const db = await initDB();
  const tx = db.transaction(import.meta.env.VITE_STORE_NAME, "readwrite");
  const store = tx.objectStore(import.meta.env.VITE_STORE_NAME);
  await store.clear();
  await tx.done;
}
export async function setItem(key, val) {
  const db = await initDB();
  await db.put(import.meta.env.VITE_STORE_NAME, val, key);
}

export async function getItem(key) {
  const db = await initDB();
  return await db.get(import.meta.env.VITE_STORE_NAME, key);
}

export async function deleteItem(key) {
  const db = await initDB();
  await db.delete(import.meta.env.VITE_STORE_NAME, key);
}
