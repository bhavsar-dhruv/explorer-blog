import { db, isFirebaseConfigured } from './config';
import {
  collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp, Timestamp
} from 'firebase/firestore';
import { deletePhoto } from './mediaStorage';

const POSTS_COLLECTION = 'posts';

export async function publishPost(post) {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  
  const postData = {
    title: post.title || 'Untitled',
    content: post.content || '',
    tags: post.tags || [],
    itineraryLocation: post.itineraryLocation || '',
    tripDay: post.tripDay || null,
    gps: post.gps || null,
    youtube: post.youtube || null,
    photos: post.photos || [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: 'published',
  };

  const docRef = await addDoc(collection(db, POSTS_COLLECTION), postData);
  return { id: docRef.id, ...postData };
}

export async function getPublishedPosts(tag = null) {
  if (!isFirebaseConfigured()) return [];
  
  const q = query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  const posts = snapshot.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      createdAt: data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : data.createdAt,
      updatedAt: data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate().toISOString()
        : data.updatedAt,
    };
  });
  return tag ? posts.filter((post) => post.tags?.includes(tag)) : posts;
}

export async function getPostById(id) {
  if (!isFirebaseConfigured()) return null;
  const snap = await getDoc(doc(db, POSTS_COLLECTION, id));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    ...data,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : data.createdAt,
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : data.updatedAt,
  };
}

export async function updatePost(id, updates) {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const ref = doc(db, POSTS_COLLECTION, id);
  const existing = await getDoc(ref);
  if (!existing.exists()) throw new Error('Post not found');
  const current = existing.data();

  const safeUpdates = {
    ...updates,
    createdAt: current.createdAt,
    gps: current.gps ?? null,
    updatedAt: serverTimestamp(),
  };
  await updateDoc(ref, safeUpdates);
}

export async function deletePost(id) {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const ref = doc(db, POSTS_COLLECTION, id);
  const existing = await getDoc(ref);
  if (existing.exists()) {
    const data = existing.data();
    const photos = data.photos || [];
    await Promise.all(photos.map((photo) => deletePhoto(photo.path)));
  }
  await deleteDoc(doc(db, POSTS_COLLECTION, id));
}
