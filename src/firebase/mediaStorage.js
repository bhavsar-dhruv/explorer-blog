import { storage, isFirebaseConfigured } from './config';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { compressImage } from '../utils/imageCompression';

export async function uploadPhoto(file, postId, onProgress) {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');

  // Enforce client-side compression before every upload.
  const { file: compressedFile } = await compressImage(file, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  });

  const filename = `${Date.now()}_${file.name || 'photo.jpg'}`;
  const storageRef = ref(storage, `posts/${postId}/${filename}`);
  const uploadTask = uploadBytesResumable(storageRef, compressedFile);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({
          url,
          path: `posts/${postId}/${filename}`,
          size: compressedFile.size,
        });
      }
    );
  });
}

export async function uploadMultiplePhotos(files, postId, onProgress, onStateChange, onItemProgress) {
  const results = [];
  if (files.length > 0) onStateChange?.('compressing');
  for (let i = 0; i < files.length; i++) {
    onStateChange?.('uploading');
    onItemProgress?.({ current: i + 1, total: files.length });
    const result = await uploadPhoto(files[i], postId, (p) => {
      const overall = ((i + p / 100) / files.length) * 100;
      if (onProgress) onProgress(overall);
    });
    results.push(result);
  }
  return results;
}

export async function deletePhoto(path) {
  if (!isFirebaseConfigured()) return;
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.warn('Failed to delete photo:', error);
  }
}
