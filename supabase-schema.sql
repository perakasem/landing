-- Supabase Database Schema for POND Blog
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    form TEXT NOT NULL CHECK (form IN ('longform', 'shortform')),
    category TEXT NOT NULL,
    date DATE NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    chapter TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    published BOOLEAN NOT NULL DEFAULT false,
    featured_image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Site Configuration Table
CREATE TABLE IF NOT EXISTS site_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Media/Assets Table
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT,
    caption TEXT,
    mime_type TEXT,
    size_bytes INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Content Pages Table (for Bio, Resume, etc.)
CREATE TABLE IF NOT EXISTS content_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content JSONB NOT NULL, -- Structured content blocks
    meta_description TEXT,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_content_pages_slug ON content_pages(slug);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON site_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_pages_updated_at BEFORE UPDATE ON content_pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default site configuration
INSERT INTO site_config (key, value, description) VALUES
('pond_config', '{
    "title": "3rd Space",
    "subtitle": "Pond",
    "description": "A collection of thoughts and writings",
    "author": "Your Name",
    "email": "your@email.com",
    "url": "https://perakasem.co/pond"
}'::jsonb, 'Main pond/blog configuration'),
('site_metadata', '{
    "siteName": "Perakasem",
    "siteUrl": "https://perakasem.co",
    "defaultImage": "/default-image.JPG"
}'::jsonb, 'Site-wide metadata');

-- Row Level Security (RLS) Policies
-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view published posts"
    ON posts FOR SELECT
    USING (published = true);

CREATE POLICY "Public can view site config"
    ON site_config FOR SELECT
    USING (true);

CREATE POLICY "Public can view published content pages"
    ON content_pages FOR SELECT
    USING (published = true);

CREATE POLICY "Public can view media"
    ON media FOR SELECT
    USING (true);

-- Admin full access (you'll need to set up authentication)
-- These policies assume you have a user with role 'admin'
-- Adjust based on your auth setup

-- For development, you can create policies that allow all operations
-- But REMOVE these in production and use proper authentication

-- CREATE POLICY "Admin full access to posts"
--     ON posts
--     USING (auth.jwt() ->> 'role' = 'admin');

-- CREATE POLICY "Admin full access to site_config"
--     ON site_config
--     USING (auth.jwt() ->> 'role' = 'admin');

-- CREATE POLICY "Admin full access to content_pages"
--     ON content_pages
--     USING (auth.jwt() ->> 'role' = 'admin');

-- CREATE POLICY "Admin full access to media"
--     ON media
--     USING (auth.jwt() ->> 'role' = 'admin');

-- View for published posts with computed fields
CREATE OR REPLACE VIEW published_posts AS
SELECT
    id,
    slug,
    title,
    subtitle,
    form,
    category,
    date,
    tags,
    chapter,
    excerpt,
    content,
    featured_image,
    created_at,
    updated_at
FROM posts
WHERE published = true
ORDER BY date DESC;

-- Grant access to views
GRANT SELECT ON published_posts TO anon, authenticated;
