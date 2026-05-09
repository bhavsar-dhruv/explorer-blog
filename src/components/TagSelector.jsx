const TAG_CATEGORIES = {
  Region: ['North', 'South', 'East', 'West', 'North-East'],
  Transit: ['Sleeper Train', 'State Bus', 'Auto-rickshaw', 'Walking', 'Ferry', 'Local Train'],
  Mood: ['Reflective', 'Adventurous', 'Challenging', 'Peaceful', 'Chaotic'],
};

const CATEGORY_COLORS = {
  Region: 'bg-deep-indigo',
  Transit: 'bg-terracotta',
  Mood: 'bg-saffron',
};

export default function TagSelector({ selectedTags, onTagsChange }) {
  const toggleTag = (tag) => {
    const current = selectedTags || [];
    if (current.includes(tag)) {
      onTagsChange(current.filter(t => t !== tag));
    } else {
      onTagsChange([...current, tag]);
    }
  };

  return (
    <div className="space-y-3">
      {Object.entries(TAG_CATEGORIES).map(([category, tags]) => (
        <div key={category}>
          <p className="text-xs font-mono text-earth-brown/50 mb-1.5 uppercase tracking-wider">{category}</p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map(tag => {
              const isSelected = (selectedTags || []).includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all min-h-[32px] ${
                    isSelected
                      ? `${CATEGORY_COLORS[category]} text-cream shadow-sm`
                      : 'bg-off-white text-earth-brown border border-earth-brown/10 hover:border-earth-brown/30'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
