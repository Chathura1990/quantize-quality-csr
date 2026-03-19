interface TagFilterProps {
  allTags: string[];
  activeTags: string[];
  onToggle: (tag: string) => void;
}

const TagFilter = ({ allTags, activeTags, onToggle }: TagFilterProps) => {
  if (allTags.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap">
      {allTags.map((tag) => (
        <button
          key={tag}
          onClick={() => onToggle(tag)}
          className={`px-3 py-1 rounded-full text-xs font-body font-medium transition-colors border ${
            activeTags.includes(tag)
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagFilter;
