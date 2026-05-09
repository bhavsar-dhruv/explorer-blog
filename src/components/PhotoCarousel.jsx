import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function PhotoCarousel({ photos, initialIndex = 0, forceFullscreen = false, onClose }) {
  const [current, setCurrent] = useState(initialIndex);
  const [fullscreen, setFullscreen] = useState(false);

  if (!photos || !photos.length) return null;

  const prev = () => setCurrent(i => (i > 0 ? i - 1 : photos.length - 1));
  const next = () => setCurrent(i => (i < photos.length - 1 ? i + 1 : 0));

  const handleSwipe = (() => {
    let startX = 0;
    return {
      onTouchStart: (e) => { startX = e.touches[0].clientX; },
      onTouchEnd: (e) => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
      },
    };
  })();

  const Viewer = ({ className }) => (
    <div className={`relative ${className || ''}`} {...handleSwipe}>
      <img
        src={photos[current].url || photos[current].previewUrl}
        alt={`Photo ${current + 1}`}
        className="w-full h-full object-contain"
        onClick={() => setFullscreen(!fullscreen)}
      />
      {photos.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-charcoal/50 text-white rounded-full">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-charcoal/50 text-white rounded-full">
            <ChevronRight size={20} />
          </button>
        </>
      )}
      {/* Dots */}
      {photos.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-4' : 'bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (fullscreen || forceFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <button
          onClick={() => {
            if (forceFullscreen && onClose) onClose();
            else setFullscreen(false);
          }}
          className="absolute top-4 right-4 z-10 p-2 bg-white/20 rounded-full text-white"
        >
          <X size={24} />
        </button>
        <Viewer className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden bg-charcoal/5">
      <Viewer className="aspect-[4/3]" />
    </div>
  );
}
