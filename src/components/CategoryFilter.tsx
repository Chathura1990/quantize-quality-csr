import type { Category } from "@/lib/blogData";

interface CategoryFilterProps {
  active: Category;
  onChange: (cat: Category) => void;
}

const categories: Category[] = ["All", "AI", "QA", "Research"];

const CategoryFilter = ({ active, onChange }: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-body font-medium transition-colors ${
            active === cat
              ? "bg-emerald-600 text-white dark:bg-primary dark:text-black"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-muted dark:text-muted-foreground dark:hover:bg-gray-800 dark:hover:text-foreground"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
