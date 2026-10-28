// Types des données du site (profil, catégories, photos).
// Les données elles-mêmes sont dans src/data/content.ts.
// (Ce fichier s'appelait auparavant supabase.ts, du temps où le site
// utilisait la base de données Supabase.)

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

// Un chiffre mis en avant sur l'accueil et la page À propos (ex : « 3+ »
// avec « Années d'expérience » en dessous)
export type Stat = {
  value: string;
  label: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  // Id de la photo qui illustre la catégorie sur l'accueil du portfolio
  // (facultatif : sans elle, la photo la plus récente de la catégorie).
  cover_photo_id?: string;
  display_order: number;
  created_at: string;
};

export type Photo = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  // Taille de l'image d'origine en pixels (sert à réserver sa place dans la
  // page avant son chargement). Facultatif.
  width?: number;
  height?: number;
  category_id: string | null;
  featured: boolean;
  hero?: boolean;
  featured_home?: boolean;
  about?: boolean;
  display_order: number;
  created_at: string;
  categories?: Category;
};
