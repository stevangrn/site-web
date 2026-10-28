// ============================================================================
// Génération des pages au build (pré-rendu)
// ============================================================================
// Ce fichier n'est utilisé que pendant "npm run build", jamais dans le
// navigateur. Il produit, pour chaque adresse du site, le HTML de la page et
// les balises de son <head>. Le script scripts/prerender.mjs les écrit
// ensuite dans dist/ (un fichier index.html par page).
//
// Résultat : Google, Bing, les aperçus de partage (WhatsApp, Facebook...)
// et les visiteurs reçoivent une page déjà remplie, avec le bon titre et la
// bonne description, sans attendre le JavaScript.
// ============================================================================

// Ce fichier ne sert qu'au build : la règle "fast refresh" (rechargement à
// chaud des composants en développement) ne le concerne pas.
/* eslint-disable react-refresh/only-export-components */

import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { categories, photos } from './data/content';
import { pickAboutPhoto, pickCategoryCover, pickFeaturedPhotos, pickHeroPhoto } from './lib/photos';
import { parsePath, portfolioPath, resolveLocation, toHref, validRoutes } from './lib/router';
import {
  buildCloudinarySrcSet,
  buildHeadTags,
  cropCloudinaryUrl,
  getPageMeta,
  HERO_DEFAULT_WIDTH,
  HERO_WIDTHS,
  LIGHTBOX_DEFAULT_WIDTH,
  optimizeCloudinaryUrl,
  SITE_URL,
} from './lib/seo';
import type { Photo } from './lib/types';

export { SITE_URL };

// Toutes les pages à générer : les pages fixes et une page par catégorie
// du portfolio (/portfolio/sports/...). Une nouvelle catégorie ajoutée dans
// content.ts aura donc automatiquement sa page et sa place dans le sitemap.
export function getPagePaths(): string[] {
  return [...validRoutes, ...categories.map((category) => portfolioPath(category.slug))].map(toHref);
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

// Préchargement de l'image d'accueil
// L'image de fond de l'accueil est l'élément le plus lourd et le plus visible
// de la page. Cette balise, écrite seulement dans la page d'accueil, demande
// au navigateur de la télécharger tout de suite, sans attendre le JavaScript.
// L'adresse et les tailles sont exactement celles de l'image affichée
// (src/pages/Home.tsx), pour que le navigateur réutilise le téléchargement.
// L'image est celle marquée "hero: true" dans src/data/content.ts.
function heroPreloadTag(): string {
  const hero = pickHeroPhoto(photos);
  if (!hero) return '';

  const href = optimizeCloudinaryUrl(hero.image_url, HERO_DEFAULT_WIDTH);
  const srcset = buildCloudinarySrcSet(hero.image_url, HERO_WIDTHS);
  const responsive = srcset ? ` imagesrcset="${escapeAttribute(srcset)}" imagesizes="100vw"` : '';

  return `<link rel="preload" as="image" href="${escapeAttribute(href)}"${responsive} fetchpriority="high" />`;
}

// Images de chaque page, déclarées à Google Images dans le sitemap.
// - Pages de catégorie : toutes les photos de la catégorie, y compris celles
//   qui n'apparaissent qu'après « Charger plus » (Google ne clique pas sur ce
//   bouton : sans le sitemap, il ne les verrait jamais). On déclare la
//   version grand format, celle de la visionneuse.
// - Accueil : l'image de fond et la sélection. À propos : le portrait.
const isCloudinary = (url: string) => url.includes('res.cloudinary.com');
const largeImage = (photo: Photo) => optimizeCloudinaryUrl(photo.image_url, LIGHTBOX_DEFAULT_WIDTH);

export function getPageImages(path: string): string[] {
  const { location, category } = resolveLocation(parsePath(path), categories);
  let urls: string[] = [];

  if (location.route === '/portfolio' && category) {
    urls = photos
      .filter((photo) => photo.category_id === category.id && !photo.about)
      .sort((a, b) => (b.display_order ?? 0) - (a.display_order ?? 0))
      .map(largeImage);
  } else if (location.route === '/') {
    const hero = pickHeroPhoto(photos);
    urls = [
      ...(hero ? [optimizeCloudinaryUrl(hero.image_url, HERO_DEFAULT_WIDTH)] : []),
      ...pickFeaturedPhotos(photos).slice(0, 6).map(largeImage),
    ];
  } else if (location.route === '/about') {
    const portrait = pickAboutPhoto(photos);
    // Même adresse que le portrait affiché sur la page (src/pages/About.tsx)
    urls = portrait ? [cropCloudinaryUrl(portrait.image_url, 800, '3:4')] : [];
  }

  return [...new Set(urls.filter(isCloudinary))];
}

// HTML d'une page et balises de son <head>.
export function render(path: string): { html: string; head: string } {
  const page = resolveLocation(parsePath(path), categories);
  const html = renderToString(
    <StrictMode>
      <App initialPath={path} />
    </StrictMode>
  );

  const cover = page.category ? pickCategoryCover(page.category, photos) : null;
  const head = buildHeadTags(getPageMeta(page.location, page.category, cover));
  const preload = page.location.route === '/' ? heroPreloadTag() : '';

  return { html, head: preload ? `${preload}\n    ${head}` : head };
}
