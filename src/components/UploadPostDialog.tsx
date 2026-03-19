import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { marked } from "marked";
import DOMPurify from "dompurify";
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
  const [mdContent, setMdContent] = useState("");
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const htmlContent = DOMPurify.sanitize(await marked.parse(mdContent));
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
    setMdContent("");
    setFileName("");
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".md")) {
      toast.error("Please upload a .md file");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setMdContent(text);
      // Auto-extract title from first # heading
      const match = text.match(/^#\s+(.+)$/m);
      if (match && !title) setTitle(match[1]);
      // Auto-extract first paragraph as excerpt
      const lines = text.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
      if (lines.length > 0 && !excerpt) setExcerpt(lines[0].slice(0, 200));
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !mdContent.trim()) {
      toast.error("Title and content are required");
      return;
    }
    mutation.mutate();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-heading text-xl font-semibold text-foreground">Upload New Post</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* MD File upload */}
          <div>
            <label className="block text-sm font-body font-medium text-foreground mb-1">
              Markdown File
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
            >
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-body text-muted-foreground">
                {fileName || "Click to upload a .md file"}
              </span>
            </div>
            <input ref={fileRef} type="file" accept=".md" onChange={handleFile} className="hidden" />
          </div>

          <div>
            <label className="block text-sm font-body font-medium text-foreground mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-body font-medium text-foreground mb-1">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              maxLength={500}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="AI">AI</option>
                <option value="QA">QA</option>
                <option value="Research">Research</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-1">Tags (comma separated)</label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="LLM, Testing"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {mdContent && (
            <p className="text-xs text-muted-foreground font-body">
              ✓ Markdown loaded ({mdContent.length} characters)
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
