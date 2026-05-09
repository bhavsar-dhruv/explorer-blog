/**
 * Parse YouTube URLs and extract video IDs
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/shorts/
 */

export function parseYouTubeUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  let parsedUrl;
  try {
    parsedUrl = new URL(trimmed);
  } catch {
    return null;
  }

  const host = parsedUrl.hostname.replace(/^www\./, '');
  let videoId = null;
  let isShort = false;

  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
    if (parsedUrl.pathname === '/watch') {
      videoId = parsedUrl.searchParams.get('v');
    } else if (parsedUrl.pathname.startsWith('/shorts/')) {
      videoId = parsedUrl.pathname.split('/')[2] || null;
      isShort = true;
    } else if (parsedUrl.pathname.startsWith('/embed/')) {
      videoId = parsedUrl.pathname.split('/')[2] || null;
    }
  } else if (host === 'youtu.be') {
    videoId = parsedUrl.pathname.replace('/', '').split('/')[0] || null;
  }

  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return null;

  return {
    videoId,
    isShort,
    url: trimmed,
    thumbnailUrl: getYouTubeThumbnail(videoId),
    embedUrl: getEmbedUrl(videoId),
  };
}

export function getYouTubeThumbnail(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function getEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function isValidYouTubeUrl(url) {
  return parseYouTubeUrl(url) !== null;
}
