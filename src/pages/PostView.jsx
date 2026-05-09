import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2, MapPin, Loader2 } from 'lucide-react';
import Timestamp from '../components/Timestamp';
import YouTubeEmbed from '../components/YouTubeEmbed';
import PhotoCarousel from '../components/PhotoCarousel';
import PhotoGrid from '../components/PhotoGrid';
import { getPostById, deletePost } from '../firebase/posts';
import { isAdmin } from '../firebase/auth';

export default function PostView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gridOpenIndex, setGridOpenIndex] = useState(null);
  const admin = isAdmin();

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    setLoading(true);
    try {
      const data = await getPostById(id);
      setPost(data);
    } catch (err) {
      console.error('Failed to load post:', err);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    try {
      await deletePost(id);
      navigate('/');
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const formatCoord = (val, posChar, negChar) => {
    const abs = Math.abs(val);
    const char = val >= 0 ? posChar : negChar;
    return `${abs.toFixed(4)}° ${char}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={24} className="animate-spin text-terracotta" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <p className="text-earth-brown/60">Post not found</p>
        <button onClick={() => navigate('/')} className="mt-4 text-terracotta underline">Go home</button>
      </div>
    );
  }

  return (
    <div className="pb-safe">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-off-white/95 backdrop-blur-sm border-b border-sunset-orange/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-deep-indigo">
            <ArrowLeft size={20} />
          </button>
          {admin && (
            <div className="flex items-center gap-1">
              <button onClick={() => navigate(`/edit/${id}`)} className="p-2 text-deep-indigo hover:bg-deep-indigo/5 rounded-lg">
                <Edit3 size={18} />
              </button>
              <button onClick={handleDelete} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      <article className="px-4 py-4">
        {/* Title */}
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-deep-indigo leading-tight">
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="mt-3 space-y-2">
          <Timestamp date={post.createdAt} tripDay={post.tripDay} />

          <div className="flex items-center gap-3 flex-wrap">
            {post.itineraryLocation && (
              <span className="inline-flex items-center gap-1 text-xs bg-deep-indigo/5 text-deep-indigo px-2 py-1 rounded-full">
                📍 {post.itineraryLocation}
              </span>
            )}
            {post.gps && (
              <span className="text-xs font-mono text-green-700 bg-green-50 px-2 py-1 rounded-full">
                {formatCoord(post.gps.latitude, 'N', 'S')}, {formatCoord(post.gps.longitude, 'E', 'W')}
              </span>
            )}
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-sunset-orange/10 text-earth-brown">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* YouTube Embed (below title, above text) */}
        {post.youtube && <YouTubeEmbed youtube={post.youtube} />}

        {/* Photos */}
        {post.photos?.length > 0 && (
          <div className="my-4">
            {post.photos.length > 4 ? (
              <PhotoGrid photos={post.photos} onPhotoClick={setGridOpenIndex} />
            ) : (
              <PhotoCarousel photos={post.photos} />
            )}
          </div>
        )}

        {/* Content */}
        <div
          className="post-content mt-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {gridOpenIndex !== null && (
        <PhotoCarousel
          photos={post.photos}
          initialIndex={gridOpenIndex}
          forceFullscreen
          onClose={() => setGridOpenIndex(null)}
        />
      )}
    </div>
  );
}
