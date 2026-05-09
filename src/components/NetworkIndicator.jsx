import { Wifi, WifiOff } from 'lucide-react';
import { useNetworkStatus } from '../utils/networkStatus';

export default function NetworkIndicator({ queuedPhotoCount = 0 }) {
  const { isOnline } = useNetworkStatus();

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono transition-colors ${
      isOnline ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'
    }`}>
      {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
      <span>{isOnline ? 'Online' : 'Offline'}</span>
      {queuedPhotoCount > 0 && <span>· {queuedPhotoCount} queued</span>}
    </div>
  );
}
