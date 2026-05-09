import { Check, Loader2, AlertCircle } from 'lucide-react';

export default function AutoSaveIndicator({ status, lastSaved }) {
  const configs = {
    saved: { icon: <Check size={12} />, text: 'Saved', color: 'text-green-600 bg-green-50' },
    saving: { icon: <Loader2 size={12} className="animate-spin" />, text: 'Saving...', color: 'text-saffron bg-saffron/10' },
    unsaved: { icon: <AlertCircle size={12} />, text: 'Unsaved', color: 'text-earth-brown/50 bg-earth-brown/5' },
  };

  const config = configs[status] || configs.unsaved;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono ${config.color}`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
}
