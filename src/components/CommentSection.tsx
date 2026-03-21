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
    <section className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
      <h3 className="font-heading text-2xl font-light text-gray-500 dark:text-gray-500 mb-6">
        Comments ({comments.length})
      </h3>

      {/* Comment list */}
      <div className="space-y-6 mb-10">
        {comments.length === 0 && (
          <p className="text-gray-400 dark:text-gray-500 font-body text-sm">No comments yet. Be the first to share your thoughts!</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {comment.author_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="font-body font-medium text-sm text-gray-900 dark:text-gray-100">{comment.author_name}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-body">{formatDate(comment.created_at)}</span>
            </div>
            <p className="font-body text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{comment.content}</p>
          </div>
        ))}
      </div>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h4 className="font-heading text-lg font-light text-gray-500 dark:text-gray-500">Leave a comment</h4>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          required
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-body text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <textarea
          placeholder="Write your comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          maxLength={2000}
          required
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-body text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Posting..." : "Post Comment"}
        </Button>
      </form>
    </section>
  );
};

export default CommentSection;
