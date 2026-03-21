import { Link } from "react-router-dom";

const BlogHeader = () => {
  return (
    <header className="border-b border-gray-200 dark:border-border sticky top-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="max-w-[820px] mx-auto px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="font-body text-sm font-semibold tracking-wide text-emerald-600 dark:text-primary">Quantized Quality</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6">
          <Link to="/" className="text-xs font-body text-gray-500 dark:text-muted-foreground hover:text-emerald-600 dark:hover:text-primary transition-colors">
            Posts
          </Link>
          <Link to="/about" className="text-xs font-body text-gray-500 dark:text-muted-foreground hover:text-emerald-600 dark:hover:text-primary transition-colors">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default BlogHeader;
