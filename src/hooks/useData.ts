import { useState, useEffect } from 'react';
import type { Profile, Category, Photo } from '../lib/supabase';
import { profile as staticProfile, categories as staticCategories, photos as staticPhotos } from '../data/content';

// Ce hook fournit les données du site (profil, catégories, photos).
// Elles viennent du fichier src/data/content.ts, pas d'une base de données :
// pour modifier le contenu du site, il suffit d'éditer ce fichier.
export function useData() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // Charge les données statiques. Gardé sous forme de fonction (et
  // affiché avec un léger délai) pour conserver l'écran de chargement
  // existant et pouvoir réintroduire une vraie base de données plus tard
  // si besoin, sans changer le reste du site.
  async function fetchData() {
    try {
      setProfile(staticProfile);
      setCategories(staticCategories);
      setPhotos(staticPhotos);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  return { profile, categories, photos, loading, fetchData };
}
