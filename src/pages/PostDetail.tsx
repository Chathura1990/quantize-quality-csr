import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BlogHeader from "@/components/BlogHeader";
import { Badge } from "@/components/ui/badge";
import { blogPosts } from "@/lib/blogData";

const PostDetail = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <BlogHeader />
        <div className="container mx-auto px-6 max-w-3xl py-16 text-center">
          <h2 className="font-heading text-2xl text-foreground mb-4">Post not found</h2>
          <Link to="/" className="text-primary hover:underline font-body">← Back to posts</Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split("\n\n").map((block, i) => {
      if (block.startsWith("## ")) {
        return <h2 key={i} className="font-heading text-2xl font-semibold text-foreground mt-10 mb-4">{block.slice(3)}</h2>;
      }
      if (block.startsWith("### ")) {
        return <h3 key={i} className="font-heading text-xl font-semibold text-foreground mt-8 mb-3">{block.slice(4)}</h3>;
      }
      if (block.startsWith("```")) {
        const code = block.replace(/```\w*\n?/, "").replace(/```$/, "");
        return (
          <pre key={i} className="bg-muted rounded-lg p-4 overflow-x-auto my-6 text-sm font-mono text-foreground">
            <code>{code}</code>
          </pre>
        );
      }
      if (block.startsWith("- ")) {
        const items = block.split("\n").filter(l => l.startsWith("- "));
        return (
          <ul key={i} className="list-disc list-inside space-y-1 my-4 text-foreground font-body leading-relaxed">
            {items.map((item, j) => <li key={j}>{item.slice(2)}</li>)}
          </ul>
        );
      }
      if (block.startsWith("1. ")) {
        const items = block.split("\n").filter(l => /^\d+\.\s/.test(l));
        return (
          <ol key={i} className="list-decimal list-inside space-y-1 my-4 text-foreground font-body leading-relaxed">
            {items.map((item, j) => <li key={j}>{item.replace(/^\d+\.\s/, "")}</li>)}
          </ol>
        );
      }
      // Inline bold and code
      const rendered = block
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.+?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
      return <p key={i} className="text-foreground font-body leading-relaxed text-[16px] my-4" dangerouslySetInnerHTML={{ __html: rendered }} />;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      <main className="container mx-auto px-6 max-w-3xl">
        <div className="py-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
            <ArrowLeft className="w-4 h-4" />
            Back to posts
          </Link>
        </div>
        <article className="pb-16">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="text-[11px] uppercase tracking-wider font-body font-semibold">
                {post.category}
              </Badge>
              <span className="text-sm text-muted-foreground font-body">{formattedDate}</span>
              <span className="text-sm text-muted-foreground font-body">·</span>
              <span className="text-sm text-muted-foreground font-body">{post.readTime}</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground font-body leading-relaxed">
              {post.excerpt}
            </p>
            <div className="flex gap-2 flex-wrap mt-4">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs text-muted-foreground font-body border border-border rounded-full px-2.5 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          </header>
          <div className="border-t border-border pt-8">
            {renderContent(post.content)}
          </div>
        </article>
      </main>
    </div>
  );
};

export default PostDetail;
