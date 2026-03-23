import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import BlogHeader from "@/components/BlogHeader";
import CommentSection from "@/components/CommentSection";
import { Badge } from "@/components/ui/badge";
import { fetchPostBySlug, fetchPosts, fetchComments, recordView, recordSiteVisit } from "@/lib/api";

const isFullHtml = (content: string) =>
  content.includes('<!DOCTYPE') || content.includes('<html');

const wrapHtmlWithLinkHandler = (html: string) => {
  const script = `<script>
    document.addEventListener('click', function(e) {
      var a = e.target.closest('a');
      if (a && a.href) {
        e.preventDefault();
        var href = a.getAttribute('href');
        if (href && (href.startsWith('/') || href === '#' || href.startsWith('?'))) {
          window.parent.location.href = href;
        } else if (href && !href.startsWith('http')) {
          window.parent.location.href = href;
        } else {
          window.open(href, '_blank');
        }
      }
    });
  <\/script>`;
  
  return html.replace('</head>', script + '</head>');
};

const PostDetail = () => {
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPostBySlug(slug!),
    enabled: !!slug,
  });

  const { data: allPosts = [] } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
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

  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <BlogHeader />
        <div className="max-w-[820px] mx-auto px-8 py-16 text-center">
          <p className="text-muted-foreground font-body">Loading...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <BlogHeader />
        <div className="max-w-[820px] mx-auto px-8 py-16 text-center">
          <h2 className="font-heading text-2xl text-foreground mb-4">Post not found</h2>
          <Link to="/" className="text-primary hover:underline font-body">Back to posts</Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const contentIsFullHtml = isFullHtml(post.content);

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      <main className={contentIsFullHtml ? "w-full" : "max-w-[820px] mx-auto px-8"}>
        <div className={contentIsFullHtml ? "" : "py-8"}>
          {!contentIsFullHtml && (
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-body">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          )}
        </div>
        <article className="pb-8">
          {!contentIsFullHtml && (
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <Badge variant="secondary" className="text-[11px] uppercase tracking-wider font-body font-semibold text-primary border-primary">
                  {post.category}
                </Badge>
                <span className="text-xs text-muted-foreground font-body">{formattedDate}</span>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-black text-foreground leading-tight mb-4 tracking-tight">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-muted-foreground font-body leading-relaxed mb-4 max-w-2xl">
                  {post.excerpt}
                </p>
              )}
              <div className="flex gap-2 flex-wrap">
                {(post.tags ?? []).map((tag) => (
                  <span key={tag} className="text-[11px] text-muted-foreground font-body border border-border rounded-full px-2.5 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            </header>
          )}
          {contentIsFullHtml ? (
            <>
              <iframe
                srcDoc={wrapHtmlWithLinkHandler(post.content)}
                className="w-full border-0"
                style={{ height: "100vh", minHeight: "800px" }}
                title={post.title}
                sandbox="allow-same-origin allow-scripts"
              />
              <div className="max-w-2xl mx-auto px-4">
                <CommentSection postId={post.id} comments={comments} />
              </div>
            </>
          ) : (
            <>
              <div
                className="border-t border-border pt-8 prose prose-neutral max-w-none font-body
                  [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:tracking-tight
                  [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3
                  [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:my-4 [&_p]:text-sm
                  [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1 [&_ul]:my-4 [&_ul]:text-muted-foreground [&_ul]:text-sm
                  [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-1 [&_ol]:my-4 [&_ol]:text-muted-foreground [&_ol]:text-sm
                  [&_pre]:bg-muted [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:text-sm
                  [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:text-primary
                  [&_strong]:font-semibold [&_strong]:text-foreground
                  [&_a]:text-primary [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              <div className="max-w-2xl mx-auto">
                <CommentSection postId={post.id} comments={comments} />
              </div>
            </>
          )}
        </article>
      </main>
      
      {/* Navigation Buttons */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
        {prevPost && (
          <Link
            to={`/post/${prevPost.slug}`}
            className="w-10 h-10 rounded-full bg-gray-800 dark:bg-gray-700 border border-gray-600 dark:border-gray-500 flex items-center justify-center text-gray-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-colors"
            title={`Previous: ${prevPost.title}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
        )}
      </div>
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
        {nextPost && (
          <Link
            to={`/post/${nextPost.slug}`}
            className="w-10 h-10 rounded-full bg-gray-800 dark:bg-gray-700 border border-gray-600 dark:border-gray-500 flex items-center justify-center text-gray-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-colors"
            title={`Next: ${nextPost.title}`}
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
