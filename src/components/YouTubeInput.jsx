import { useState, useEffect } from 'react';
import { Video, Check, X, AlertCircle } from 'lucide-react';
import { parseYouTubeUrl } from '../utils/youtubeParser';

export default function YouTubeInput({ youtube, onYouTubeChange }) {
  const [url, setUrl] = useState(youtube?.url || '');
  const [parsed, setParsed] = useState(youtube || null);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (youtube?.url && youtube.url !== url) {
      setUrl(youtube.url);
      setParsed(youtube);
    }
  }, [youtube]);

  const handleChange = (value) => {
    setUrl(value);
    if (!value.trim()) {
      setParsed(null);
      setInvalid(false);
      onYouTubeChange(null);
      return;
    }
    const result = parseYouTubeUrl(value);
    if (result) {
      setParsed(result);
      setInvalid(false);
      onYouTubeChange(result);
    } else {
      setParsed(null);
      setInvalid(value.length > 5);
    }
  };

  const clear = () => {
    setUrl('');
    setParsed(null);
    setInvalid(false);
    onYouTubeChange(null);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500">
          <Video size={20} />
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="🎬 Paste YouTube link..."
          className="w-full pl-11 pr-10 py-3 rounded-xl border border-sunset-orange/20 bg-white text-charcoal placeholder-earth-brown/40 focus:outline-none focus:border-terracotta transition-colors min-h-[48px]"
        />
        {url && (
          <button
            type="button"
            onClick={clear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-earth-brown/40 hover:text-charcoal"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Validation indicator */}
      {invalid && (
        <div className="flex items-center gap-1.5 text-xs text-red-500 px-2">
          <AlertCircle size={12} />
          <span>Not a valid YouTube URL</span>
        </div>
      )}

      {/* Thumbnail preview */}
      {parsed && (
        <div className="flex items-center gap-3 bg-charcoal/5 rounded-xl p-2 animate-fade-in">
          <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img src={parsed.thumbnailUrl} alt="Video thumbnail" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-white ml-0.5" />
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-green-600">
              <Check size={12} />
              <span>{parsed.isShort ? 'YouTube Short' : 'YouTube Video'}</span>
            </div>
            <p className="text-xs text-earth-brown/60 font-mono truncate mt-0.5">{parsed.videoId}</p>
          </div>
        </div>
      )}
    </div>
  );
}
