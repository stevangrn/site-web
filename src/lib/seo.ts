// ============================================================================
// UTILITAIRES SEO
// ============================================================================
// Regroupe les petits ajustements du plan de référencement :
//   - un <title> et une <meta description> différents par page (point 1.2)
//   - des textes "alt" plus riches sur les photos, avec contexte local (point 1.5)
//   - une optimisation automatique des images Cloudinary (point 1.6)
// ============================================================================

import type { Route } from './router';

// ----------------------------------------------------------------------------
// 1. Titre + description par page
// ----------------------------------------------------------------------------
// Depuis le passage à de vraies URLs (src/lib/router.ts), chaque page a sa
// propre adresse (/, /portfolio, /about, /contact). Ce mécanisme met à jour
// le <title> et la <meta description> à chaque changement de route : comme
// Google exécute le JavaScript de la page avant de l'indexer, il verra
// désormais un titre et une description différents pour chaque URL.
const PAGE_SEO: Record<Route, { title: string; description: string }> = {
  '/': {
    title: 'Stevan Garon — Photographe & Télépilote de drone en Vendée',
    description:
      'Photographe professionnel à La Chaize-le-Vicomte (Vendée). Portraits, événements, sports et prises de vue aériennes par drone.',
  },
  '/portfolio': {
    title: 'Portfolio photo — Portraits, Événements, Sports, Nature | Stevan Garon',
    description:
      'Découvrez mes photographies : portraits, événements, sports et paysages, réalisées en Vendée et alentours.',
  },
  '/about': {
    title: 'À propos — Stevan Garon, photographe en Vendée',
    description:
      "Parcours, matériel et approche d'un photographe et télépilote de drone basé en Vendée.",
  },
  '/contact': {
    title: 'Contact — Réservez une séance photo en Vendée',
    description:
      'Contactez Stevan Garon pour vos séances portrait, événements ou prises de vue par drone en Vendée.',
  },
};

function setMetaTag(selector: string, attribute: string, value: string, content: string) {
  let tag = document.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, value);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

// Met à jour le titre de l'onglet et les balises meta selon la page affichée.
// À appeler dans un useEffect, à chaque changement de route.
export function applyPageSeo(route: Route) {
  const seo = PAGE_SEO[route] ?? PAGE_SEO['/'];

  document.title = seo.title;
  setMetaTag('meta[name="description"]', 'name', 'description', seo.description);
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', seo.title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', seo.description);
}

// ----------------------------------------------------------------------------
// 2. Textes alternatifs enrichis pour les photos
// ----------------------------------------------------------------------------
// Ajoute un contexte géographique/métier au titre déjà renseigné dans
// content.ts, sans avoir à toucher aux 96 fiches photos une par une.
export function buildPhotoAlt(title: string, categoryName?: string): string {
  const cleanTitle = title?.trim() || 'Photographie';
  const suffix = categoryName ? `${categoryName} en Vendée` : 'Photographe en Vendée';
  return `${cleanTitle} — ${suffix}`;
}

// ----------------------------------------------------------------------------
// 3. Optimisation automatique des images Cloudinary
// ----------------------------------------------------------------------------
// Insère les paramètres f_auto,q_auto (format + qualité automatiques) dans les
// URLs Cloudinary pour servir des images plus légères, sans avoir à ré-uploader
// ni à modifier les 96 URLs dans content.ts.
export function optimizeCloudinaryUrl(url: string): string {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }
  if (url.includes('/upload/f_auto')) {
    return url; // déjà optimisée
  }
  return url.replace('/upload/', '/upload/f_auto,q_auto/');
}
