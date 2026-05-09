import { useState, useEffect } from 'react';
import { Loader2, BookOpen } from 'lucide-react';
import TripProgressBar from '../components/TripProgressBar';
import TagFilter from '../components/TagFilter';
import PostCard from '../components/PostCard';
import BrandingFooter from '../components/BrandingFooter';
import NetworkIndicator from '../components/NetworkIndicator';
import { getPublishedPosts } from '../firebase/posts';
import { cachePublishedPosts, getCachedPosts } from '../utils/offlineQueue';
import { useNetworkStatus } from '../utils/networkStatus';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState(null);
  const [offline, setOffline] = useState(false);
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    loadPosts();
  }, [isOnline]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await getPublishedPosts();
      setPosts(data);
      await cachePublishedPosts(data);
      setOffline(false);
    } catch (err) {
      console.warn('Failed to load from Firebase, using cache:', err);
      const cached = await getCachedPosts();
      setPosts(cached);
      setOffline(true);
    }
    setLoading(false);
  };

  const filtered = activeTag
    ? posts.filter(p => p.tags?.includes(activeTag))
    : posts;

  return (
    <div className="pb-safe">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-deep-indigo">Explorer's Fellowship</h1>
            <p className="text-xs text-earth-brown/50 font-mono mt-0.5">42 Days Across India</p>
          </div>
          <NetworkIndicator />
        </div>

        <TripProgressBar />
      </div>

      {offline && (
        <div className="mx-4 mt-3 px-3 py-2 rounded-lg bg-amber-50 text-amber-700 text-xs">
          📴 Offline — showing cached content
        </div>
      )}

      {/* Tag Filter */}
      <div className="px-4 mt-4">
        <TagFilter activeTag={activeTag} onTagChange={setActiveTag} />
      </div>

      {/* Posts Feed */}
      <div className="px-4 mt-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-terracotta" />
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((post, i) => (
            <div key={post.id} style={{ animationDelay: `${i * 0.05}s` }}>
              <PostCard post={post} />
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <BookOpen size={48} className="mx-auto text-sunset-orange/30 mb-4" />
            <h3 className="font-heading text-xl text-deep-indigo/60">No stories yet</h3>
            <p className="text-sm text-earth-brown/40 mt-2 max-w-xs mx-auto leading-relaxed">
              {posts.length === 0
                ? "The journey is about to begin. Every great story starts with a single step."
                : "No posts match this filter. Try another tag."
              }
            </p>
          </div>
        )}
      </div>

      <BrandingFooter />
    </div>
  );
}
