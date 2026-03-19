
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Research',
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read posts
CREATE POLICY "Posts are publicly readable"
  ON public.posts FOR SELECT
  USING (true);

-- Only authenticated users can insert/update/delete (admin)
CREATE POLICY "Authenticated users can create posts"
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update posts"
  ON public.posts FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete posts"
  ON public.posts FOR DELETE
  TO authenticated
  USING (true);

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read comments
CREATE POLICY "Comments are publicly readable"
  ON public.comments FOR SELECT
  USING (true);

-- Anyone can add comments (no auth required for blog comments)
CREATE POLICY "Anyone can add comments"
  ON public.comments FOR INSERT
  WITH CHECK (true);

-- Post views tracking
CREATE TABLE public.post_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Post views are publicly readable"
  ON public.post_views FOR SELECT
  USING (true);

CREATE POLICY "Anyone can record a view"
  ON public.post_views FOR INSERT
  WITH CHECK (true);

-- Function to increment view count
CREATE OR REPLACE FUNCTION public.increment_view_count(p_post_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO public.post_views (post_id) VALUES (p_post_id);
  UPDATE public.posts SET view_count = view_count + 1 WHERE id = p_post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Site visits tracking
CREATE TABLE public.site_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site visits are publicly readable"
  ON public.site_visits FOR SELECT
  USING (true);

CREATE POLICY "Anyone can record a visit"
  ON public.site_visits FOR INSERT
  WITH CHECK (true);

-- Indexes
CREATE INDEX idx_posts_slug ON public.posts(slug);
CREATE INDEX idx_posts_category ON public.posts(category);
CREATE INDEX idx_posts_tags ON public.posts USING GIN(tags);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_post_views_post_id ON public.post_views(post_id);
CREATE INDEX idx_site_visits_page ON public.site_visits(page_path);
