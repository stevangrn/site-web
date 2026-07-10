/*
# Create portfolio schema for photographer

1. New Tables
- `categories` - Photo categories (portrait, landscape, event, etc.)
  - `id` (uuid, primary key)
  - `name` (text, not null)
  - `slug` (text, unique, not null)
  - `description` (text)
  - `display_order` (integer, default 0)
  - `created_at` (timestamp)

- `photos` - Individual photographs
  - `id` (uuid, primary key)
  - `title` (text, not null)
  - `description` (text)
  - `image_url` (text, not null)
  - `category_id` (uuid, foreign key to categories)
  - `featured` (boolean, default false)
  - `display_order` (integer, default 0)
  - `created_at` (timestamp)

- `profile` - Photographer profile information
  - `id` (uuid, primary key)
  - `name` (text, not null)
  - `title` (text)
  - `bio` (text)
  - `email` (text)
  - `phone` (text)
  - `location` (text)
  - `social_instagram` (text)
  - `social_facebook` (text)
  - `updated_at` (timestamp)

2. Security
- Enable RLS on all tables.
- Allow anon + authenticated read access (public portfolio).
- Allow anon + authenticated write access (admin management).

3. Notes
- Single-tenant app with no auth required.
- Photos can be featured to appear prominently.
- Categories have display order for custom sorting.
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  featured boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create profile table (single row for photographer info)
CREATE TABLE IF NOT EXISTS profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text,
  bio text,
  email text,
  phone text,
  location text,
  social_instagram text,
  social_facebook text,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

-- Categories policies
DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_categories" ON categories;
CREATE POLICY "anon_insert_categories" ON categories FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_categories" ON categories;
CREATE POLICY "anon_update_categories" ON categories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_categories" ON categories;
CREATE POLICY "anon_delete_categories" ON categories FOR DELETE
  TO anon, authenticated USING (true);

-- Photos policies
DROP POLICY IF EXISTS "anon_select_photos" ON photos;
CREATE POLICY "anon_select_photos" ON photos FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_photos" ON photos;
CREATE POLICY "anon_insert_photos" ON photos FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_photos" ON photos;
CREATE POLICY "anon_update_photos" ON photos FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_photos" ON photos;
CREATE POLICY "anon_delete_photos" ON photos FOR DELETE
  TO anon, authenticated USING (true);

-- Profile policies
DROP POLICY IF EXISTS "anon_select_profile" ON profile;
CREATE POLICY "anon_select_profile" ON profile FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_profile" ON profile;
CREATE POLICY "anon_insert_profile" ON profile FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_profile" ON profile;
CREATE POLICY "anon_update_profile" ON profile FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Insert default profile
INSERT INTO profile (id, name, title, bio, email, location)
VALUES (
  gen_random_uuid(),
  'Marie Dupont',
  'Photographe Professionnelle',
  'Capturant les moments précieux de la vie à travers mon objectif. Spécialisée dans les portraits, les paysages et les événements spéciaux.',
  'contact@mariedupont-photo.com',
  'Paris, France'
) ON CONFLICT DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Portraits', 'portraits', 'Portraits captivants qui révèlent la personnalité', 1),
  ('Paysages', 'paysages', 'Paysages époustouflants du monde entier', 2),
  ('Événements', 'evenements', 'Moments mémorables de vos événements', 3),
  ('Nature', 'nature', 'La beauté sauvage de la nature', 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample photos with Pexels images
INSERT INTO photos (title, description, image_url, category_id, featured, display_order) VALUES
  ('Portrait Solaire', 'Un portrait lumineux capturant la beauté naturelle', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', (SELECT id FROM categories WHERE slug = 'portraits'), true, 1),
  ('Sérénité Matinale', 'Paysage de lac au lever du soleil', 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', (SELECT id FROM categories WHERE slug = 'paysages'), true, 2),
  ('Célébration', 'Moments de joie lors d''une cérémonie', 'https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', (SELECT id FROM categories WHERE slug = 'evenements'), false, 1),
  ('Forêt Enchantée', 'Randonnée à travers une forêt mystique', 'https://images.pexels.com/photos/957010/pexels-photo-957010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', (SELECT id FROM categories WHERE slug = 'nature'), true, 3),
  ('Regard Intense', 'Portrait en noir et blanc', 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', (SELECT id FROM categories WHERE slug = 'portraits'), false, 2),
  ('Montagne Majestueuse', 'Sommet enneigé au crépuscule', 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', (SELECT id FROM categories WHERE slug = 'paysages'), false, 2),
  ('Mariage Romantique', 'L''instant magique du premier regard', 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', (SELECT id FROM categories WHERE slug = 'evenements'), true, 4),
  ('Fleur Sauvage', 'Macro photographie d''une fleur délicate', 'https://images.pexels.com/photos/3672953/pexels-photo-3672953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', (SELECT id FROM categories WHERE slug = 'nature'), false, 1)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_photos_category_id ON photos(category_id);
CREATE INDEX IF NOT EXISTS idx_photos_featured ON photos(featured);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);
