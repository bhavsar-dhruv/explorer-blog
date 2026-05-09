import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, Video, Clock } from 'lucide-react';
import { getDrafts, deleteDraft, getWordCount } from '../utils/storage';
import { getQueuedPhotos } from '../utils/offlineQueue';
import { format } from 'date-fns';

export default function DraftsPage() {
  const [drafts, setDrafts] = useState(getDrafts());
  const [queueCounts, setQueueCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function loadQueueCounts() {
      const counts = {};
      await Promise.all(
        drafts.map(async (draft) => {
          const queued = await getQueuedPhotos(draft.id).catch(() => []);
          counts[draft.id] = queued.length;
        })
      );
      setQueueCounts(counts);
    }
    loadQueueCounts();
  }, [drafts]);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (!confirm('Delete this draft?')) return;
    deleteDraft(id);
    setDrafts(getDrafts());
  };

  return (
    <div className="pb-safe">
      <div className="px-4 pt-4 pb-2">
        <h1 className="font-heading text-2xl font-bold text-deep-indigo">Drafts</h1>
        <p className="text-xs text-earth-brown/50 font-mono mt-1">{drafts.length} draft{drafts.length !== 1 ? 's' : ''} saved locally</p>
      </div>

      <div className="px-4 mt-2 space-y-3">
        {drafts.length === 0 ? (
          <div className="text-center py-16">
            <FileText size={48} className="mx-auto text-sunset-orange/30 mb-4" />
            <h3 className="font-heading text-xl text-deep-indigo/60">No drafts</h3>
            <p className="text-sm text-earth-brown/40 mt-2">
              Start writing and your work will be auto-saved here.
            </p>
          </div>
        ) : (
          drafts.map(draft => (
            <div
              key={draft.id}
              onClick={() => navigate(`/edit/${draft.id}`)}
              className="bg-white rounded-xl border border-sunset-orange/10 p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-deep-indigo truncate">
                    {draft.title || 'Untitled draft'}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-earth-brown/50">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock size={10} />
                      {draft.updatedAt ? format(new Date(draft.updatedAt), 'd MMM, h:mm a') : 'Unknown'}
                    </span>
                    <span className="font-mono">{getWordCount(draft.content)} words</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {draft.gps && <span className="text-xs text-green-600">📍 GPS</span>}
                    {draft.youtube && <span className="text-xs text-red-500"><Video size={12} /></span>}
                    {(queueCounts[draft.id] || 0) > 0 && (
                      <span className="text-xs text-amber-700 font-mono">
                        {queueCounts[draft.id]} queued
                      </span>
                    )}
                    {draft.tags?.slice(0, 2).map(t => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-sunset-orange/10 text-earth-brown">{t}</span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(e, draft.id)}
                  className="p-2 text-earth-brown/30 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
