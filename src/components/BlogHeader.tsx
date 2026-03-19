import { Link } from "react-router-dom";

const BlogHeader = () => {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <span className="font-heading text-primary-foreground text-lg font-bold">R</span>
          </div>
          <div>
            <h1 className="font-heading text-xl font-semibold text-foreground leading-tight">Research Notes</h1>
            <p className="text-xs text-muted-foreground">AI & QA Explorations</p>
          </div>
        </Link>
        <nav className="hidden sm:flex items-center gap-6">
          <Link to="/" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
            Posts
          </Link>
          <Link to="/about" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default BlogHeader;
