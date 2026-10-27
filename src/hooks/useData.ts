import type { Profile, Category, Photo } from '../lib/types';
import { profile, categories, photos } from '../data/content';

// Ce hook fournit les données du site (profil, catégories, photos).
// Elles viennent du fichier src/data/content.ts, pas d'une base de données :
// pour modifier le contenu du site, il suffit d'éditer ce fichier.
//
// Les données sont incluses dans le site : elles sont donc disponibles dès le
// premier affichage, sans écran de chargement.
export function useData(): { profile: Profile; categories: Category[]; photos: Photo[] } {
  return { profile, categories, photos };
}
