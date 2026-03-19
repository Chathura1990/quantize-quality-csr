import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import DOMPurify from "dompurify";
import BlogHeader from "@/components/BlogHeader";
import CommentSection from "@/components/CommentSection";
import ViewCounter from "@/components/ViewCounter";
import { Badge } from "@/components/ui/badge";
import { fetchPostBySlug, fetchComments, recordView, recordSiteVisit } from "@/lib/api";

const PostDetail = () => {
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPostBySlug(slug!),
    enabled: !!slug,
  });

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", post?.id],
    queryFn: () => fetchComments(post!.id),
    enabled: !!post?.id,
  });

  useEffect(() => {
    if (post?.id) {
      recordView(post.id);
      recordSiteVisit(`/post/${slug}`);
    }
  }, [post?.id, slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <BlogHeader />
        <div className="container mx-auto px-6 max-w-3xl py-16 text-center">
          <p className="text-muted-foreground font-body">Loading...</p>
        </div>
      </div>
    );
  }

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

  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sanitizedContent = DOMPurify.sanitize(post.content);

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
        <article className="pb-8">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Badge variant="secondary" className="text-[11px] uppercase tracking-wider font-body font-semibold">
                {post.category}
              </Badge>
              <span className="text-sm text-muted-foreground font-body">{formattedDate}</span>
              <ViewCounter count={post.view_count} />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-lg text-muted-foreground font-body leading-relaxed">
                {post.excerpt}
              </p>
            )}
            <div className="flex gap-2 flex-wrap mt-4">
              {(post.tags ?? []).map((tag) => (
                <span key={tag} className="text-xs text-muted-foreground font-body border border-border rounded-full px-2.5 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          </header>
          <div
            className="border-t border-border pt-8 prose prose-neutral max-w-none font-body
              [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4
              [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3
              [&_p]:text-foreground [&_p]:leading-relaxed [&_p]:my-4
              [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1 [&_ul]:my-4 [&_ul]:text-foreground
              [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-1 [&_ol]:my-4 [&_ol]:text-foreground
              [&_pre]:bg-muted [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:text-sm
              [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
              [&_strong]:font-semibold [&_strong]:text-foreground
              [&_a]:text-primary [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </article>
        <CommentSection postId={post.id} comments={comments} />
      </main>
    </div>
  );
};

export default PostDetail;
