import BlogHeader from "@/components/BlogHeader";
import CategoryFilter from "@/components/CategoryFilter";
import PostCard from "@/components/PostCard";
import SearchBar from "@/components/SearchBar";
import TagFilter from "@/components/TagFilter";
import { fetchPosts, recordSiteVisit } from "@/lib/api";
import type { Category } from "@/lib/blogData";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const { data: posts = [] } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  useEffect(() => {
    recordSiteVisit("/");
  }, []);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((p) => (p.tags ?? []).forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [posts]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filtered = useMemo(() => {
    let result = posts;
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (activeTags.length > 0) {
      result = result.filter((p) =>
        activeTags.every((t) => (p.tags ?? []).includes(t))
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.excerpt ?? "").toLowerCase().includes(q) ||
          (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [posts, activeCategory, activeTags, searchQuery]);

  return (
    <div className="min-h-screen bg-white dark:bg-background text-gray-900 dark:text-foreground">
      <BlogHeader />
      <main className="max-w-[820px] mx-auto px-8">
        <section className="py-5 border-b border-gray-200 dark:border-border">
          <div className="mb-8">
            <h1 className="font-heading text-4xl md:text-5xl font-black text-gray-900 dark:text-foreground mb-4 leading-tight tracking-tight">
              Exploring AI, QA & Engineering
            </h1>
            <p className="text-gray-500 dark:text-muted-foreground font-body text-sm leading-relaxed max-w-lg">
              Deep dives into artificial intelligence architectures, quality assurance methodologies, 
              and software engineering practices.
            </p>
          </div>
        </section>

        <section className="py-5">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
          {allTags.length > 0 && (
            <TagFilter allTags={allTags} activeTags={activeTags} onToggle={toggleTag} />
          )}
        </section>

        <section className="pb-16">
          {filtered.length > 0 ? (
            filtered.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p className="text-gray-500 dark:text-muted-foreground font-body py-12 text-center">
              {posts.length === 0
                ? "No posts yet. Click 'New Post' to upload your first article!"
                : "No posts match your filters."}
            </p>
          )}
        </section>
      </main>
      <footer className="border-t border-gray-200 dark:border-border py-8">
        <div className="max-w-[820px] mx-auto px-8 text-center">
          <p className="text-xs text-gray-400 dark:text-muted-foreground font-body">
            © 2026 Quantized Quality · Built for exploration
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
