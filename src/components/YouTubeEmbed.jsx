export default function YouTubeEmbed({ youtube }) {
  if (!youtube?.videoId) return null;

  const embedUrl = `https://www.youtube.com/embed/${youtube.videoId}?rel=0&modestbranding=1`;

  return (
    <div className="my-4 rounded-xl overflow-hidden shadow-md">
      <div className={youtube.isShort ? 'aspect-[9/16] max-h-[70vh] mx-auto max-w-[320px]' : 'aspect-video w-full'}>
        <iframe
          src={embedUrl}
          title="YouTube video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
