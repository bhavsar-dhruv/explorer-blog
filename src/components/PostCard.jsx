import { useNavigate } from 'react-router-dom';
import { MapPin, Video } from 'lucide-react';
import Timestamp from './Timestamp';

export default function PostCard({ post }) {
  const navigate = useNavigate();

  const excerpt = post.content
    ? post.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 140)
    : '';

  const thumbnail = post.photos?.[0]?.url || (post.youtube?.thumbnailUrl);

  return (
    <article
      onClick={() => navigate(`/post/${post.id}`)}
      className="bg-white rounded-2xl shadow-sm border border-sunset-orange/10 overflow-hidden cursor-pointer hover:shadow-md transition-shadow animate-fade-in"
    >
      {thumbnail && (
        <div className="relative aspect-[2/1] overflow-hidden">
          <img src={thumbnail} alt="" className="w-full h-full object-cover" />
          {post.youtube && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-white ml-0.5" />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <h3 className="font-heading text-lg font-semibold text-deep-indigo leading-snug">
          {post.title || 'Untitled'}
        </h3>

        <div className="mt-2">
          <Timestamp date={post.createdAt} tripDay={post.tripDay} compact />
        </div>

        {excerpt && (
          <p className="text-sm text-earth-brown/70 mt-2 line-clamp-2 leading-relaxed">
            {excerpt}...
          </p>
        )}

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {post.itineraryLocation && (
            <span className="inline-flex items-center gap-1 text-xs bg-deep-indigo/5 text-deep-indigo px-2 py-1 rounded-full">
              <MapPin size={10} /> {post.itineraryLocation}
            </span>
          )}
          {post.gps && (
            <span className="text-xs text-green-600 font-mono">📍</span>
          )}
          {post.youtube && (
            <span className="text-xs text-red-500">
              <Video size={12} />
            </span>
          )}
          {post.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-sunset-orange/10 text-earth-brown">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
