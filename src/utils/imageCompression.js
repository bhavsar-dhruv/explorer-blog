import imageCompression from 'browser-image-compression';

const DEFAULT_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/jpeg',
};

export async function compressImage(file, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  try {
    const compressed = await imageCompression(file, opts);
    return {
      file: compressed,
      originalSize: file.size,
      compressedSize: compressed.size,
      savings: Math.round((1 - compressed.size / file.size) * 100),
    };
  } catch (error) {
    console.error('Image compression failed:', error);
    return { file, originalSize: file.size, compressedSize: file.size, savings: 0 };
  }
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
