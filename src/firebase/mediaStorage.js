import { compressImage } from '../utils/imageCompression';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || 'PASTE_YOUR_KEY_HERE';
const IMGBB_UPLOAD_ENDPOINT = 'https://api.imgbb.com/1/upload';

export async function uploadPhoto(file, postId, onProgress) {
  if (!IMGBB_API_KEY || IMGBB_API_KEY === 'PASTE_YOUR_KEY_HERE') {
    throw new Error('ImgBB API key not configured');
  }

  // Enforce client-side compression before every upload.
  const { file: compressedFile } = await compressImage(file, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  });
  const filename = `${postId}-${Date.now()}-${file.name || 'photo.jpg'}`;
  const formData = new FormData();
  formData.append('image', compressedFile);
  formData.append('name', filename);

  onProgress?.(10);
  const response = await fetch(`${IMGBB_UPLOAD_ENDPOINT}?key=${encodeURIComponent(IMGBB_API_KEY)}`, {
    method: 'POST',
    body: formData,
  });
  const result = await response.json();
  if (!response.ok || !result?.success || !result?.data?.display_url) {
    throw new Error(result?.error?.message || 'ImgBB upload failed');
  }
  onProgress?.(100);

  return {
    url: result.data.display_url,
    path: result.data.delete_url || null,
    size: compressedFile.size,
  };
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
  if (!path) return;
  try {
    await fetch(path, { method: 'GET' });
  } catch (error) {
    console.warn('Failed to delete photo:', error);
  }
}
