/**
 * Firebase Configuration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com
 * 2. Create a new project (or use existing)
 * 3. Go to Project Settings > General > Your apps > Add web app
 * 4. Copy the firebaseConfig object and paste below
 * 5. Enable Firestore: Build > Firestore Database > Create database (test mode)
 * 6. Enable Storage: Build > Storage > Get started
 * 7. For Storage, you need the Blaze (pay-as-you-go) plan
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ⚠️ REPLACE THIS with your actual Firebase config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDh7vcwLvPSHDCO27wlhSG8jNM_2opZhgM",
  authDomain: "explorer-fellowship-blog.firebaseapp.com",
  projectId: "explorer-fellowship-blog",
  storageBucket: "explorer-fellowship-blog.firebasestorage.app",
  messagingSenderId: "489634978338",
  appId: "1:489634978338:web:ab1abe36459d0da9aa887b",
  measurementId: "G-R6Q0TQW2E6"
};

let app, db, storage;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.warn('Firebase not configured yet. Running in offline-only mode.', error.message);
}

export { app, db, storage };
export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "YOUR_API_KEY";
};
