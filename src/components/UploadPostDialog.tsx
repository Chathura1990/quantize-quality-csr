import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { createPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface UploadPostDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UploadPostDialog = ({ open, onClose, onSuccess }: UploadPostDialogProps) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("AI");
  const [tags, setTags] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return createPost({
        title: title.trim(),
        slug,
        excerpt: excerpt.trim(),
        content: htmlContent,
        category,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
    },
    onSuccess: () => {
      toast.success("Post published!");
      resetForm();
      onSuccess();
      onClose();
    },
    onError: (err: Error) => toast.error(err.message || "Failed to create post"),
  });

  const resetForm = () => {
    setTitle("");
    setCategory("AI");
    setTags("");
    setExcerpt("");
    setHtmlContent("");
    setFileName("");
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".html")) {
      toast.error("Please upload an .html file");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setHtmlContent(text);
      // Auto-extract title from <title> tag
      const titleMatch = text.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch && !title) setTitle(titleMatch[1].trim());
      // Auto-extract first paragraph as excerpt
      const pMatch = text.match(/<p[^>]*>([^<]+)<\/p>/i);
      if (pMatch && !excerpt) setExcerpt(pMatch[1].slice(0, 200));
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !htmlContent.trim()) {
      toast.error("Title and HTML content are required");
      return;
    }
    mutation.mutate();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-background border border-gray-200 dark:border-border rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-border">
          <h2 className="font-heading text-xl font-semibold text-gray-900 dark:text-foreground">Upload New Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-muted-foreground dark:hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* HTML File upload */}
          <div>
            <label className="block text-sm font-body font-medium text-gray-700 dark:text-foreground mb-1">
              HTML File
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-border rounded-lg cursor-pointer hover:border-emerald-500 dark:hover:border-primary transition-colors"
            >
              <Upload className="w-5 h-5 text-gray-400 dark:text-muted-foreground" />
              <span className="text-sm font-body text-gray-500 dark:text-muted-foreground">
                {fileName || "Click to upload an .html file"}
              </span>
            </div>
            <input ref={fileRef} type="file" accept=".html" onChange={handleFile} className="hidden" />
          </div>

          <div>
            <label className="block text-sm font-body font-medium text-gray-700 dark:text-foreground mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-border bg-white dark:bg-gray-900 text-gray-900 dark:text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-body font-medium text-gray-700 dark:text-foreground mb-1">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              maxLength={500}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-border bg-white dark:bg-gray-900 text-gray-900 dark:text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-ring resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body font-medium text-gray-700 dark:text-foreground mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-border bg-white dark:bg-gray-900 text-gray-900 dark:text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-ring"
              >
                <option value="AI">AI</option>
                <option value="QA">QA</option>
                <option value="Research">Research</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-gray-700 dark:text-foreground mb-1">Tags (comma separated)</label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="LLM, Testing"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-border bg-white dark:bg-gray-900 text-gray-900 dark:text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-ring"
              />
            </div>
          </div>

          {htmlContent && (
            <p className="text-xs text-gray-500 dark:text-muted-foreground font-body">
              ✓ HTML loaded ({htmlContent.length} characters)
            </p>
          )}

          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Publishing..." : "Publish Post"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UploadPostDialog;
