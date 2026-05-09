import { useState } from 'react';
import { MapPin, Loader2, X, RefreshCw } from 'lucide-react';

export default function LocationTagger({ gps, onGpsChange }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const data = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          capturedAt: new Date().toISOString(),
        };
        onGpsChange(data);
        setLoading(false);
      },
      (err) => {
        const messages = {
          1: 'Location permission denied. Please enable in settings.',
          2: 'Position unavailable. Try again outdoors.',
          3: 'Location request timed out. Try again.',
        };
        setError(messages[err.code] || 'Failed to get location');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  };

  const formatCoord = (val, posChar, negChar) => {
    const abs = Math.abs(val);
    const char = val >= 0 ? posChar : negChar;
    return `${abs.toFixed(4)}° ${char}`;
  };

  const clearLocation = () => {
    onGpsChange(null);
    setError(null);
  };

  if (gps) {
    return (
      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <MapPin size={18} className="text-green-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-mono text-green-800 truncate">
            📍 {formatCoord(gps.latitude, 'N', 'S')}, {formatCoord(gps.longitude, 'E', 'W')}
          </p>
          <p className="text-xs text-green-600">±{gps.accuracy}m accuracy</p>
        </div>
        <button type="button" onClick={getLocation} className="p-2 text-green-600 hover:bg-green-100 rounded-lg" aria-label="Refresh">
          <RefreshCw size={16} />
        </button>
        <button type="button" onClick={clearLocation} className="p-2 text-green-600 hover:bg-green-100 rounded-lg" aria-label="Clear">
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={getLocation}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-green-300 text-green-700 hover:border-green-500 hover:bg-green-50 transition-colors min-h-[48px]"
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            <span>Acquiring GPS signal...</span>
          </>
        ) : (
          <>
            <MapPin size={20} />
            <span>📍 Get Exact Location</span>
          </>
        )}
      </button>
      {error && (
        <p className="text-xs text-red-500 px-2">{error}</p>
      )}
    </div>
  );
}
