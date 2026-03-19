import type { Category } from "@/lib/blogData";

interface CategoryFilterProps {
  active: Category;
  onChange: (cat: Category) => void;
}

const categories: Category[] = ["All", "AI", "QA", "Research"];

const CategoryFilter = ({ active, onChange }: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-body font-medium transition-colors ${
            active === cat
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
