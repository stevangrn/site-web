// ============================================================================
// Choix des photos mises en avant
// ============================================================================
// Règles qui décident quelle photo s'affiche en grand sur l'accueil, laquelle
// illustre la page À propos, et lesquelles composent la sélection de
// l'accueil. Elles sont regroupées ici car elles servent à deux endroits :
//   - dans le site lui-même (src/App.tsx),
//   - au moment du build (vite.config.ts), pour précharger l'image d'accueil
//     dès le HTML, avant même que le JavaScript ne soit téléchargé.
// ============================================================================

import type { Photo } from './supabase';

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
