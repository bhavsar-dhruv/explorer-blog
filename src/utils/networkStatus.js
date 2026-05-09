import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState(
    navigator.connection?.effectiveType || navigator.connection?.type || 'unknown'
  );

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    const updateConnection = () => {
      setConnectionType(navigator.connection?.effectiveType || navigator.connection?.type || 'unknown');
    };
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    navigator.connection?.addEventListener?.('change', updateConnection);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
      navigator.connection?.removeEventListener?.('change', updateConnection);
    };
  }, []);

  return { isOnline, connectionType };
}
