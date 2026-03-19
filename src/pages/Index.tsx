import { useState } from "react";
import BlogHeader from "@/components/BlogHeader";
import PostCard from "@/components/PostCard";
import CategoryFilter from "@/components/CategoryFilter";
import { blogPosts, type Category } from "@/lib/blogData";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filtered = activeCategory === "All"
    ? blogPosts
    : blogPosts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      <main className="container mx-auto px-6 max-w-3xl">
        <section className="py-12 md:py-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
            Latest Research
          </h2>
          <p className="text-muted-foreground font-body text-lg mb-8">
            Personal notes on artificial intelligence, quality assurance, and software engineering.
          </p>
          <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
        </section>
        <section className="pb-16">
          {filtered.length > 0 ? (
            filtered.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p className="text-muted-foreground font-body py-12 text-center">No posts in this category yet.</p>
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
    </div>
  );
};

export default Index;
