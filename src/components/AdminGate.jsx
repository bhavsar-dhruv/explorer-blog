import { useState } from 'react';
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { verifyPin, isAdmin } from '../firebase/auth';

export default function AdminGate({ children }) {
  const [authenticated, setAuthenticated] = useState(isAdmin());
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);

  if (authenticated) return children;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pin.trim()) return;
    setLoading(true);
    setError('');
    try {
      const ok = await verifyPin(pin.trim());
      if (ok) {
        setAuthenticated(true);
      } else {
        setError('Incorrect PIN');
        setPin('');
      }
    } catch (err) {
      setError('Verification failed. Check your connection.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-off-white">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-deep-indigo/10 rounded-2xl mb-4">
            <Lock size={28} className="text-deep-indigo" />
          </div>
          <h2 className="font-heading text-2xl text-deep-indigo font-bold">Admin Access</h2>
          <p className="text-sm text-earth-brown/60 mt-2">Enter your PIN to create or edit posts</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPin ? 'text' : 'password'}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              className="w-full px-4 py-3 rounded-xl border border-sunset-orange/20 bg-white text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:border-terracotta"
              maxLength={6}
              autoFocus
              inputMode="numeric"
            />
            <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-brown/40">
              {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading || !pin.trim()}
            className="w-full py-3 rounded-xl bg-terracotta text-cream font-semibold hover:bg-terracotta-dark transition-colors disabled:opacity-50 min-h-[48px]"
          >
            {loading ? <Loader2 size={20} className="animate-spin mx-auto" /> : 'Unlock'}
          </button>

          <p className="text-xs text-earth-brown/40 text-center">First time? Enter any PIN to set it up.</p>
        </form>
      </div>
    </div>
  );
}
