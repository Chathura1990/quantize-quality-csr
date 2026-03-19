import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment } from "@/lib/api";
import type { Comment } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

const CommentSection = ({ postId, comments }: CommentSectionProps) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => addComment(postId, name.trim(), content.trim()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setName("");
      setContent("");
      toast.success("Comment posted!");
    },
    onError: () => toast.error("Failed to post comment"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    if (name.trim().length > 100 || content.trim().length > 2000) {
      toast.error("Name or comment is too long");
      return;
    }
    mutation.mutate();
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h3 className="font-heading text-2xl font-semibold text-foreground mb-6">
        Comments ({comments.length})
      </h3>

      {/* Comment list */}
      <div className="space-y-6 mb-10">
        {comments.length === 0 && (
          <p className="text-muted-foreground font-body text-sm">No comments yet. Be the first to share your thoughts!</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">
                  {comment.author_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="font-body font-semibold text-sm text-foreground">{comment.author_name}</span>
              <span className="text-xs text-muted-foreground font-body">{formatDate(comment.created_at)}</span>
            </div>
            <p className="font-body text-sm text-foreground leading-relaxed">{comment.content}</p>
          </div>
        ))}
      </div>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h4 className="font-heading text-lg font-semibold text-foreground">Leave a comment</h4>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          required
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <textarea
          placeholder="Write your comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          maxLength={2000}
          required
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Posting..." : "Post Comment"}
        </Button>
      </form>
    </section>
  );
};

export default CommentSection;
