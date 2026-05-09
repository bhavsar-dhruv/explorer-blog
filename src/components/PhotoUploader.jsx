import { useState, useRef } from 'react';
import { Camera, X, Loader2, ArrowDown } from 'lucide-react';
import { compressImage, formatFileSize } from '../utils/imageCompression';

export default function PhotoUploader({
  photos,
  onPhotosChange,
  isOnline = true,
  onQueueOffline,
  onRemovePhoto,
}) {
  const [compressing, setCompressing] = useState(false);
  const [stats, setStats] = useState(null);
  const fileRef = useRef(null);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setCompressing(true);
    setStats(null);
    const newPhotos = [...(photos || [])];

    let totalOriginal = 0, totalCompressed = 0;

    for (const file of files) {
      const result = await compressImage(file);
      totalOriginal += result.originalSize;
      totalCompressed += result.compressedSize;

      // Create preview URL
      const previewUrl = URL.createObjectURL(result.file);
      const photoId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36);
      let queueEntryId = null;
      if (!isOnline && onQueueOffline) {
        queueEntryId = await onQueueOffline({
          id: photoId,
          file: result.file,
        });
      }

      newPhotos.push({
        id: photoId,
        file: result.file,
        previewUrl,
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
        savings: result.savings,
        queuedOffline: !isOnline,
        queueEntryId,
      });
    }

    setStats({
      original: formatFileSize(totalOriginal),
      compressed: formatFileSize(totalCompressed),
      savings: Math.round((1 - totalCompressed / totalOriginal) * 100),
    });

    setCompressing(false);
    onPhotosChange(newPhotos);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removePhoto = (id) => {
    const removedPhoto = (photos || []).find((p) => p.id === id);
    if (removedPhoto?.queueEntryId && onRemovePhoto) {
      onRemovePhoto(removedPhoto.queueEntryId);
    }
    const updated = (photos || []).filter((p) => p.id !== id);
    onPhotosChange(updated);
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={compressing}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-sunset-orange/30 text-earth-brown hover:border-terracotta hover:text-terracotta transition-colors min-h-[48px]"
      >
        {compressing ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            <span>Compressing...</span>
          </>
        ) : (
          <>
            <Camera size={20} />
            <span>Add Photos</span>
          </>
        )}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFiles}
        className="hidden"
      />

      {stats && (
        <div className="flex items-center gap-2 text-xs font-mono text-earth-brown/70 bg-cream/50 rounded-lg px-3 py-2">
          <ArrowDown size={14} className="text-green-600" />
          <span>{stats.original} → {stats.compressed}</span>
          <span className="text-green-600 font-semibold">({stats.savings}% saved)</span>
        </div>
      )}

      {photos && photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group rounded-lg overflow-hidden aspect-square">
              <img
                src={photo.previewUrl || photo.url}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                className="absolute top-1 right-1 p-1 bg-charcoal/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-charcoal/60 text-white text-[10px] px-1 py-0.5 font-mono">
                {formatFileSize(photo.compressedSize || photo.size || 0)}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isOnline && photos?.length > 0 && (
        <p className="text-xs text-amber-700 bg-amber-50 px-2.5 py-2 rounded-lg font-mono">
          📤 Offline mode: selected photos are queued and will upload on publish when online.
        </p>
      )}
    </div>
  );
}
