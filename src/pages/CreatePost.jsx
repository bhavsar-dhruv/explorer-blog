import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Send, Loader2 } from 'lucide-react';
import TipTapEditor from '../components/TipTapEditor';
import PhotoUploader from '../components/PhotoUploader';
import LocationTagger from '../components/LocationTagger';
import YouTubeInput from '../components/YouTubeInput';
import TagSelector from '../components/TagSelector';
import AutoSaveIndicator from '../components/AutoSaveIndicator';
import NetworkIndicator from '../components/NetworkIndicator';
import { saveDraft, getDraftById, deleteDraft } from '../utils/storage';
import { getCurrentLocation, getTripDayForDate } from '../utils/tripConfig';
import { publishPost as firebasePublish } from '../firebase/posts';
import { uploadMultiplePhotos } from '../firebase/mediaStorage';
import { queuePhoto, getQueuedPhotos, clearQueue, removeQueuedPhoto } from '../utils/offlineQueue';
import { useNetworkStatus } from '../utils/networkStatus';

export default function CreatePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isOnline } = useNetworkStatus();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [gps, setGps] = useState(null);
  const [youtube, setYouTube] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [draftId, setDraftId] = useState(id || null);
  const [saveStatus, setSaveStatus] = useState('unsaved');
  const [publishing, setPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [queuedPhotoCount, setQueuedPhotoCount] = useState(0);
  const autoSaveTimer = useRef(null);
  const hasLoadedDraft = useRef(false);

  // Load draft if editing
  useEffect(() => {
    if (id && !hasLoadedDraft.current) {
      const draft = getDraftById(id);
      if (draft) {
        setTitle(draft.title || '');
        setContent(draft.content || '');
        setTags(draft.tags || []);
        setGps(draft.gps || null);
        setYouTube(draft.youtube || null);
        setDraftId(draft.id);
        // Photos from draft won't have File objects, just metadata
        hasLoadedDraft.current = true;
      }
    }
  }, [id]);

  useEffect(() => {
    if (!draftId) return;
    getQueuedPhotos(draftId)
      .then((queued) => setQueuedPhotoCount(queued.length))
      .catch(() => setQueuedPhotoCount(0));
  }, [draftId]);

  // Auto-save every 30 seconds
  useEffect(() => {
    autoSaveTimer.current = setInterval(() => {
      if (title || content) {
        handleSaveDraft(true);
      }
    }, 30000);
    return () => clearInterval(autoSaveTimer.current);
  }, [title, content, tags, gps, youtube]);

  // Save on visibility change (e.g., switching apps on phone)
  useEffect(() => {
    const handleVisChange = () => {
      if (document.visibilityState === 'hidden' && (title || content)) {
        handleSaveDraft(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisChange);
    return () => document.removeEventListener('visibilitychange', handleVisChange);
  }, [title, content, tags, gps, youtube]);

  const handleSaveDraft = useCallback((auto = false) => {
    setSaveStatus('saving');
    const location = getCurrentLocation();
    const draft = saveDraft({
      id: draftId,
      title,
      content,
      tags,
      gps,
      youtube,
      itineraryLocation: location?.place || '',
      tripDay: getTripDayForDate(new Date()),
    });
    if (!draftId) setDraftId(draft.id);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('unsaved'), 5000);
  }, [draftId, title, content, tags, gps, youtube]);

  const handlePublish = async () => {
    if (!title.trim()) {
      alert('Please add a title');
      return;
    }
    if (!isOnline) {
      handleSaveDraft();
      alert('You\'re offline. Draft saved! Publish when you have a connection.');
      return;
    }

    setPublishing(true);
    setPublishProgress(0);

    try {
      // Step 1: Upload photos to Cloud Storage
      let uploadedPhotos = [];
      const photoFiles = photos.filter((p) => p.file && !p.queuedOffline);
      const queued = draftId ? await getQueuedPhotos(draftId).catch(() => []) : [];
      const queuedFiles = queued.map((item) => {
        const ext = item.type?.split('/')[1] || 'jpg';
        return new File([item.file], item.originalName || `queued-${item.id}.${ext}`, {
          type: item.type || 'image/jpeg',
        });
      });
      const allFilesToUpload = [...photoFiles.map((p) => p.file), ...queuedFiles];
      
      if (allFilesToUpload.length > 0) {
        const tempId = draftId || Date.now().toString();
        uploadedPhotos = await uploadMultiplePhotos(
          allFilesToUpload,
          tempId,
          (progress) => setPublishProgress(progress * 0.7) // 70% for photo upload
        );
      }

      setPublishProgress(80);

      // Step 2: Publish to Firestore
      const location = getCurrentLocation();
      await firebasePublish({
        title: title.trim(),
        content,
        tags,
        gps,
        youtube,
        photos: uploadedPhotos,
        itineraryLocation: location?.place || '',
        tripDay: getTripDayForDate(new Date()),
      });

      setPublishProgress(100);

      // Step 3: Clean up
      if (draftId) {
        deleteDraft(draftId);
        if (draftId) await clearQueue(draftId).catch(() => {});
      }

      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      console.error('Publish failed:', err);
      handleSaveDraft();
      alert('Publish failed: ' + err.message + '\nDraft has been saved.');
    }
    setPublishing(false);
  };

  const handleQueueOfflinePhoto = async ({ file }) => {
    const nextDraftId = draftId || crypto.randomUUID();
    if (!draftId) setDraftId(nextDraftId);
    const queued = await queuePhoto(nextDraftId, file, file.name);
    setQueuedPhotoCount((count) => count + 1);
    return queued.id;
  };

  const handleRemoveQueuedPhoto = async (queueEntryId) => {
    await removeQueuedPhoto(queueEntryId).catch(() => {});
    setQueuedPhotoCount((count) => Math.max(0, count - 1));
  };

  return (
    <div className="pb-safe">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-off-white/95 backdrop-blur-sm border-b border-sunset-orange/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-deep-indigo">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <AutoSaveIndicator status={saveStatus} />
            <NetworkIndicator queuedPhotoCount={queuedPhotoCount} />
          </div>
        </div>
      </div>

      {/* Publishing overlay */}
      {publishing && (
        <div className="fixed inset-0 z-50 bg-deep-indigo/90 flex items-center justify-center">
          <div className="text-center text-cream space-y-4 px-8">
            <Loader2 size={40} className="animate-spin mx-auto" />
            <p className="font-heading text-lg">Publishing your story...</p>
            <div className="w-64 h-2 bg-cream/10 rounded-full overflow-hidden">
              <div className="h-full bg-saffron rounded-full transition-all duration-300" style={{ width: `${publishProgress}%` }} />
            </div>
            <p className="text-xs text-cream/60 font-mono">{Math.round(publishProgress)}%</p>
          </div>
        </div>
      )}

      <div className="px-4 py-4 space-y-5">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setSaveStatus('unsaved'); }}
          placeholder="Title your story..."
          className="w-full text-2xl font-heading font-bold text-deep-indigo bg-transparent border-none outline-none placeholder-deep-indigo/20"
        />

        {/* Editor */}
        <TipTapEditor
          content={content}
          onChange={(html) => { setContent(html); setSaveStatus('unsaved'); }}
        />

        {/* Divider */}
        <div className="border-t border-sunset-orange/10 pt-4 space-y-4">
          <p className="text-xs font-mono text-earth-brown/40 uppercase tracking-wider">Attachments</p>
          
          {/* GPS */}
          <LocationTagger gps={gps} onGpsChange={(g) => { setGps(g); setSaveStatus('unsaved'); }} />

          {/* YouTube */}
          <YouTubeInput youtube={youtube} onYouTubeChange={(y) => { setYouTube(y); setSaveStatus('unsaved'); }} />

          {/* Photos */}
          <PhotoUploader
            photos={photos}
            isOnline={isOnline}
            onQueueOffline={handleQueueOfflinePhoto}
            onRemovePhoto={handleRemoveQueuedPhoto}
            onPhotosChange={(p) => { setPhotos(p); setSaveStatus('unsaved'); }}
          />
          {queuedPhotoCount > 0 && (
            <p className="text-xs text-amber-700 bg-amber-50 px-2.5 py-2 rounded-lg font-mono">
              {queuedPhotoCount} photo{queuedPhotoCount > 1 ? 's' : ''} queued in offline storage.
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="border-t border-sunset-orange/10 pt-4">
          <p className="text-xs font-mono text-earth-brown/40 uppercase tracking-wider mb-3">Tags</p>
          <TagSelector selectedTags={tags} onTagsChange={(t) => { setTags(t); setSaveStatus('unsaved'); }} />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => handleSaveDraft(false)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-deep-indigo/20 text-deep-indigo font-semibold hover:bg-deep-indigo/5 transition-colors min-h-[48px]"
          >
            <Save size={18} />
            Save Draft
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-terracotta text-cream font-semibold hover:bg-terracotta-dark transition-colors disabled:opacity-50 min-h-[48px] shadow-md"
          >
            <Send size={18} />
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
