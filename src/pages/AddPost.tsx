import { useState } from "react";
import BlogHeader from "@/components/BlogHeader";
import UploadPostDialog from "@/components/UploadPostDialog";

const AddPost = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Meline17") {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <BlogHeader />
      <main className="max-w-[820px] mx-auto px-8">
        <div className="py-8">
          <div className="max-w-md mx-auto mt-16">
            <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-foreground mb-6 text-center">
              Admin Access
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-body text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">Incorrect password</p>
              )}
              <button
                type="submit"
                className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg font-body font-medium hover:bg-emerald-700 transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </main>
      
      {isAuthenticated && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => setUploadOpen(true)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-full font-body font-medium shadow-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            NEW POST
          </button>
        </div>
      )}

      <UploadPostDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
};

export default AddPost;
