-- Lab Posts table for technical articles (server config, Docker, testing, dev)
CREATE TABLE IF NOT EXISTS lab_posts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_image text,
  author text NOT NULL DEFAULT 'David López',
  tags text[] NOT NULL DEFAULT '{}',
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  language text NOT NULL DEFAULT 'ES',
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE lab_posts ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access"
  ON lab_posts
  FOR SELECT
  TO anon
  USING (true);

-- Index for common queries
CREATE INDEX idx_lab_posts_language_published
  ON lab_posts (language, published_at DESC);

CREATE INDEX idx_lab_posts_tags
  ON lab_posts USING GIN (tags);
