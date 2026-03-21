import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-muted-foreground" />
      <input
        type="text"
        placeholder="Search articles..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card text-gray-900 dark:text-foreground font-body text-sm placeholder:text-gray-400 dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-ring"
      />
    </div>
  );
};

export default SearchBar;
