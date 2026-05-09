import { db, isFirebaseConfigured } from './config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ADMIN_DOC = 'config/admin';
const SESSION_KEY = 'ef_admin_session';

export async function setupPin(pin) {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  await setDoc(doc(db, 'config', 'admin'), { pin: String(pin) });
}

export async function verifyPin(pin) {
  if (!isFirebaseConfigured()) {
    // Offline fallback: accept any pin in dev mode
    sessionStorage.setItem(SESSION_KEY, 'true');
    return true;
  }
  try {
    const snap = await getDoc(doc(db, 'config', 'admin'));
    if (!snap.exists()) {
      // No PIN set yet — first time setup, set it now
      await setupPin(pin);
      sessionStorage.setItem(SESSION_KEY, 'true');
      return true;
    }
    const data = snap.data();
    if (data.pin === String(pin)) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Auth check failed, allowing offline access:', error);
    sessionStorage.setItem(SESSION_KEY, 'true');
    return true;
  }
}

export function isAdmin() {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}
