import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blogData";

interface PostCardProps {
  post: BlogPost;
}

const PostCard = ({ post }: PostCardProps) => {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link to={`/post/${post.id}`} className="group block">
      <article className="py-8 border-b border-border transition-colors">
        <div className="flex items-center gap-3 mb-3">
          <Badge variant="secondary" className="text-[11px] uppercase tracking-wider font-body font-semibold">
            {post.category}
          </Badge>
          <span className="text-xs text-muted-foreground font-body">{formattedDate}</span>
          <span className="text-xs text-muted-foreground font-body">·</span>
          <span className="text-xs text-muted-foreground font-body">{post.readTime}</span>
        </div>
        <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">
          {post.title}
        </h2>
        <p className="text-muted-foreground font-body leading-relaxed text-[15px] mb-3">
          {post.excerpt}
        </p>
        <div className="flex gap-2 flex-wrap">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs text-muted-foreground font-body border border-border rounded-full px-2.5 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
};

export default PostCard;
