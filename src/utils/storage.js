const DRAFTS_KEY = 'ef_drafts';
const PUBLISHED_CACHE_KEY = 'ef_published_cache';

function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function saveDraft(draft) {
  const drafts = getDrafts();
  const existing = drafts.findIndex(d => d.id === draft.id);
  
  const draftData = {
    ...draft,
    id: draft.id || generateId(),
    updatedAt: new Date().toISOString(),
    createdAt: draft.createdAt || new Date().toISOString(),
    status: 'draft',
  };
  
  if (existing >= 0) {
    drafts[existing] = draftData;
  } else {
    drafts.unshift(draftData);
  }
  
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  return draftData;
}

export function getDrafts() {
  try {
    return JSON.parse(localStorage.getItem(DRAFTS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getDraftById(id) {
  return getDrafts().find(d => d.id === id) || null;
}

export function deleteDraft(id) {
  const drafts = getDrafts().filter(d => d.id !== id);
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

export function getWordCount(html) {
  if (!html) return 0;
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text ? text.split(' ').length : 0;
}

// Cache published posts for offline reading
export function cachePublishedPosts(posts) {
  try {
    localStorage.setItem(PUBLISHED_CACHE_KEY, JSON.stringify({
      posts,
      cachedAt: new Date().toISOString()
    }));
  } catch {
    // Storage full — clear old cache
    localStorage.removeItem(PUBLISHED_CACHE_KEY);
  }
}

export function getCachedPosts() {
  try {
    const data = JSON.parse(localStorage.getItem(PUBLISHED_CACHE_KEY) || '{}');
    return data.posts || [];
  } catch {
    return [];
  }
}

export function exportAllData() {
  return {
    drafts: getDrafts(),
    cachedPosts: getCachedPosts(),
    exportedAt: new Date().toISOString(),
  };
}
