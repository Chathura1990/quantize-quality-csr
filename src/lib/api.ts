import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Post = Tables<"posts">;
export type Comment = Tables<"comments">;

// Posts
export async function fetchPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
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
  await supabase.rpc("increment_view_count", { p_post_id: postId });
}

export async function recordSiteVisit(pagePath: string) {
  await supabase.from("site_visits").insert({ page_path: pagePath });
}

// Comments
export async function fetchComments(postId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function addComment(postId: string, authorName: string, content: string) {
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
  const { count: totalVisits } = await supabase
    .from("site_visits")
    .select("*", { count: "exact", head: true });
  const { count: totalViews } = await supabase
    .from("post_views")
    .select("*", { count: "exact", head: true });
  return { totalVisits: totalVisits ?? 0, totalViews: totalViews ?? 0 };
}
