// Ce fichier ne contient plus que les types utilisés par le site.
// Le site n'utilise plus Supabase : les données viennent de src/data/content.ts.

export type Profile = {
  id: string;
  name: string;
  title: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  social_instagram: string | null;
  social_facebook: string | null;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  created_at: string;
};

export type Photo = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category_id: string | null;
  featured: boolean;
  hero?: boolean;
  featured_home?: boolean;
  about?: boolean;
  display_order: number;
  created_at: string;
  categories?: Category;
};
