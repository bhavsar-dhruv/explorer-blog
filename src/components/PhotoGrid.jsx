export default function PhotoGrid({ photos, onPhotoClick }) {
  if (!photos?.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {photos.map((photo, index) => (
        <button
          key={photo.path || photo.url || index}
          type="button"
          className="aspect-square rounded-lg overflow-hidden bg-charcoal/5"
          onClick={() => onPhotoClick?.(index)}
        >
          <img
            src={photo.url || photo.previewUrl}
            alt={`Photo ${index + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </button>
      ))}
    </div>
  );
}
