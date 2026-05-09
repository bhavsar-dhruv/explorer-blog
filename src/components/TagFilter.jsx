const ALL_TAGS = ['All', 'North', 'South', 'East', 'West', 'North-East', 'Sleeper Train', 'State Bus', 'Reflective', 'Adventurous'];

export default function TagFilter({ activeTag, onTagChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 -mx-4 px-4">
      {ALL_TAGS.map(tag => (
        <button
          key={tag}
          onClick={() => onTagChange(tag === 'All' ? null : tag)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            (tag === 'All' && !activeTag) || activeTag === tag
              ? 'bg-terracotta text-cream shadow-sm'
              : 'bg-white text-earth-brown border border-earth-brown/10'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
