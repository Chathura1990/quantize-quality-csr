interface TagFilterProps {
  allTags: string[];
  activeTags: string[];
  onToggle: (tag: string) => void;
}

const TagFilter = ({ allTags, activeTags, onToggle }: TagFilterProps) => {
  if (allTags.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap mb-2">
      <span className="text-xs text-gray-400 dark:text-muted-foreground font-body uppercase tracking-wider mr-1 self-center">Tags:</span>
      {allTags.map((tag) => (
        <button
          key={tag}
          onClick={() => onToggle(tag)}
          className={`px-3 py-1 rounded-full text-xs font-body font-medium transition-colors border ${
            activeTags.includes(tag)
              ? "bg-emerald-600 text-white border-emerald-600 dark:bg-primary dark:text-black dark:border-primary"
              : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700 dark:bg-card dark:text-muted-foreground dark:border-border dark:hover:text-foreground"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagFilter;
