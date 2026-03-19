import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import BlogHeader from "@/components/BlogHeader";
import PostCard from "@/components/PostCard";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import TagFilter from "@/components/TagFilter";
import UploadPostDialog from "@/components/UploadPostDialog";
import { fetchPosts, recordSiteVisit } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Category } from "@/lib/blogData";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);

  const { data: posts = [], refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  useEffect(() => {
    recordSiteVisit("/");
  }, []);

  // All unique tags
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
    <div className="min-h-screen bg-background">
      <BlogHeader />
      <main className="container mx-auto px-6 max-w-3xl">
        <section className="py-12 md:py-16">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                Latest Research
              </h2>
              <p className="text-muted-foreground font-body text-lg mb-6">
                Personal notes on artificial intelligence, quality assurance, and software engineering.
              </p>
            </div>
            <Button
              onClick={() => setUploadOpen(true)}
              size="sm"
              className="shrink-0 mt-1"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Post
            </Button>
          </div>

          <div className="space-y-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
            {allTags.length > 0 && (
              <div>
                <span className="text-xs text-muted-foreground font-body uppercase tracking-wider mr-2">Tags:</span>
                <TagFilter allTags={allTags} activeTags={activeTags} onToggle={toggleTag} />
              </div>
            )}
          </div>
        </section>
        <section className="pb-16">
          {filtered.length > 0 ? (
            filtered.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p className="text-muted-foreground font-body py-12 text-center">
              {posts.length === 0
                ? "No posts yet. Click 'New Post' to upload your first article!"
                : "No posts match your filters."}
            </p>
          )}
        </section>
      </main>
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <p className="text-sm text-muted-foreground font-body">
            © 2026 Research Notes. Built for personal research and exploration.
          </p>
        </div>
      </footer>
      <UploadPostDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default Index;
