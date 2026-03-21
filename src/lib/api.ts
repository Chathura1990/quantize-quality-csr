import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Post = Tables<"posts">;
export type Comment = Tables<"comments">;

const isSupabaseConfigured = () => {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY &&
    !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')
  );
};

// Posts
export async function fetchPosts() {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning empty array');
    return [];
  }
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  return data;
}

export async function fetchPostBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }
  return data;
}

export async function createPost(post: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
}) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }
  const { data, error } = await supabase
    .from("posts")
    .insert(post)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Views
export async function recordView(postId: string) {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.rpc("increment_view_count", { p_post_id: postId });
  } catch (e) {
    // Silently fail
  }
}

export async function recordSiteVisit(pagePath: string) {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from("site_visits").insert({ page_path: pagePath });
  } catch (e) {
    // Silently fail
  }
}

// Comments
export async function fetchComments(postId: string) {
  if (!isSupabaseConfigured()) {
    return [];
  }
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
  return data;
}

export async function addComment(postId: string, authorName: string, content: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }
  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id: postId, author_name: authorName, content })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Analytics
export async function fetchSiteStats() {
  if (!isSupabaseConfigured()) {
    return { totalVisits: 0, totalViews: 0 };
  }
  const { count: totalVisits } = await supabase
    .from("site_visits")
    .select("*", { count: "exact", head: true });
  const { count: totalViews } = await supabase
    .from("post_views")
    .select("*", { count: "exact", head: true });
  return { totalVisits: totalVisits ?? 0, totalViews: totalViews ?? 0 };
}
