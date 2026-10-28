// ============================================================================
// Choix des photos mises en avant
// ============================================================================
// Règles qui décident quelle photo s'affiche en grand sur l'accueil, laquelle
// illustre la page À propos, lesquelles composent la sélection de l'accueil
// et quelle photo sert de couverture à chaque catégorie. Elles sont
// regroupées ici car elles servent à deux endroits :
//   - dans le site lui-même (src/App.tsx, src/pages/Portfolio.tsx),
//   - au moment du build (src/entry-server.tsx), pour précharger l'image
//     d'accueil dès le HTML et choisir l'image de partage de chaque page.
// ============================================================================

import type { Category, Photo } from './types';

// Image de fond de l'accueil : la photo marquée "hero: true" dans content.ts.
export function pickHeroPhoto(photos: Photo[]): Photo | null {
  return photos.find((photo) => photo.hero) ?? photos.find((photo) => photo.featured) ?? null;
}

// Photo de la page À propos : celle marquée "about: true".
export function pickAboutPhoto(photos: Photo[]): Photo | null {
  return photos.find((photo) => photo.about) ?? photos.find((photo) => photo.featured) ?? null;
}

// Sélection de l'accueil : les photos marquées "featured_home: true", sans la
// photo réservée à À propos.
export function pickFeaturedPhotos(photos: Photo[]): Photo[] {
  return photos.filter((photo) => (photo.featured_home ?? photo.featured) && !photo.about);
}

// Couverture d'une catégorie : la photo choisie dans content.ts
// (cover_photo_id), sinon la première photo de la catégorie dans l'ordre
// d'affichage du portfolio (hors photo réservée à À propos). Sert pour la carte de la catégorie dans le
// portfolio et pour l'image d'aperçu quand on partage sa page.
export function pickCategoryCover(category: Category, photos: Photo[]): Photo | null {
  const chosen = category.cover_photo_id ? photos.find((photo) => photo.id === category.cover_photo_id) : undefined;
  if (chosen) return chosen;
  return (
    photos
      .filter((photo) => photo.category_id === category.id && !photo.about)
      .sort((a, b) => (b.display_order ?? 0) - (a.display_order ?? 0))[0] ?? null
  );
}
