import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import type { Post } from "@/lib/api";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link to={`/post/${post.slug}`} className="group block">
      <article className="py-4 border-b border-gray-200 dark:border-border transition-colors">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-600 dark:text-primary">{post.category}</span>
          <span className="text-gray-300 dark:text-muted-foreground">·</span>
          <span className="text-xs text-gray-500 dark:text-muted-foreground font-body">{formattedDate}</span>
          <span className="text-gray-300 dark:text-muted-foreground">·</span>
          <span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-muted-foreground font-body">
            <Eye className="w-3.5 h-3.5" />
            {post.view_count} {post.view_count === 1 ? "view" : "views"}
          </span>
        </div>
        <h2 className="font-heading text-2xl md:text-3xl font-black text-gray-900 dark:text-foreground group-hover:text-emerald-600 dark:group-hover:text-primary transition-colors mb-3 leading-tight tracking-tight">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-gray-500 dark:text-muted-foreground font-body leading-relaxed text-sm mb-4 max-w-2xl">
            {post.excerpt}
          </p>
        )}
        <div className="flex gap-2 flex-wrap">
          {(post.tags ?? []).map((tag) => (
            <span key={tag} className="text-[11px] text-gray-500 dark:text-muted-foreground font-body border border-gray-200 dark:border-border rounded-full px-2.5 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
};

export default PostCard;
