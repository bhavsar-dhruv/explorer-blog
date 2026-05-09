import { openDB } from 'idb';

const DB_NAME = 'explorer-fellowship-db';
const DB_VERSION = 1;
const PHOTO_STORE = 'photoQueue';
const CACHE_STORE = 'postCache';

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(PHOTO_STORE)) {
        db.createObjectStore(PHOTO_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(CACHE_STORE)) {
        db.createObjectStore(CACHE_STORE, { keyPath: 'id' });
      }
    },
  });
}

// ─── Photo Queue ───

export async function queuePhoto(draftId, file, originalName) {
  const db = await getDB();
  const id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36);
  
  const entry = {
    id,
    draftId,
    file,  // Blob
    originalName: originalName || file.name,
    size: file.size,
    type: file.type,
    queuedAt: new Date().toISOString(),
  };
  
  await db.put(PHOTO_STORE, entry);
  return entry;
}

export async function getQueuedPhotos(draftId) {
  const db = await getDB();
  const all = await db.getAll(PHOTO_STORE);
  return all.filter(item => item.draftId === draftId);
}

export async function getAllQueuedPhotos() {
  const db = await getDB();
  return db.getAll(PHOTO_STORE);
}

export async function removeQueuedPhoto(id) {
  const db = await getDB();
  await db.delete(PHOTO_STORE, id);
}

export async function clearQueue(draftId) {
  const db = await getDB();
  const all = await db.getAll(PHOTO_STORE);
  const toDelete = all.filter(item => item.draftId === draftId);
  const tx = db.transaction(PHOTO_STORE, 'readwrite');
  await Promise.all(toDelete.map(item => tx.store.delete(item.id)));
  await tx.done;
}

export async function getQueueSize() {
  const all = await getAllQueuedPhotos();
  return all.reduce((total, item) => total + (item.size || 0), 0);
}

// ─── Post Cache (for offline reading) ───

export async function cachePost(post) {
  const db = await getDB();
  await db.put(CACHE_STORE, { ...post, cachedAt: new Date().toISOString() });
}

export async function cachePosts(posts) {
  const db = await getDB();
  const tx = db.transaction(CACHE_STORE, 'readwrite');
  await Promise.all(posts.map(post => tx.store.put({ ...post, cachedAt: new Date().toISOString() })));
  await tx.done;
}

// Alias names matching product spec
export async function cachePublishedPosts(posts) {
  return cachePosts(posts);
}

export async function getCachedPosts() {
  const db = await getDB();
  return db.getAll(CACHE_STORE);
}
