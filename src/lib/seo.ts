// ============================================================================
// UTILITAIRES SEO
// ============================================================================
// Regroupe les petits ajustements du plan de référencement :
//   - un <title> et une <meta description> différents par page (point 1.2)
//   - des textes "alt" plus riches sur les photos, avec contexte local (point 1.5)
//   - une optimisation automatique des images Cloudinary (point 1.6)
// ============================================================================

import { toHref, type Route } from './router';

// Adresse officielle du site, utilisée pour le canonical, og:url et les
// données structurées (jamais l'adresse locale de développement).
const SITE_URL = 'https://stevangaron.fr';

// Image affichée quand un lien du site est partagé (WhatsApp, Facebook,
// LinkedIn...). Le fichier est dans public/og-image.png : il est copié tel
// quel à la racine du site au moment du build, son adresse ne change donc
// jamais (contrairement aux fichiers de src/ ou static/, renommés par Vite).
const SOCIAL_IMAGE_URL = `${SITE_URL}/og-image.png`;
const SOCIAL_IMAGE_ALT = 'Logo Stevan Garon — photographe et télépilote de drone en Vendée';
const INSTAGRAM_URL = 'https://www.instagram.com/stevan_raw/';

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
  '/mentions-legales': {
    title: 'Mentions légales — Stevan Garon Photographe',
    description:
      "Informations légales relatives à l'édition et à l'hébergement du site stevangaron.fr.",
  },
  '/404': {
    title: 'Page introuvable — Stevan Garon Photographe',
    description: "Cette page n'existe pas ou a été déplacée.",
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

// Met à jour le canonical, ou le retire (page introuvable : elle ne doit
// désigner aucune adresse officielle).
function setCanonicalUrl(url: string | null) {
  let link = document.querySelector('link[rel="canonical"]');
  if (url === null) {
    link?.remove();
    return;
  }
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function setSocialImageMeta() {
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', SOCIAL_IMAGE_URL);
  setMetaTag('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', SOCIAL_IMAGE_URL);
  setMetaTag('meta[property="og:image:type"]', 'property', 'og:image:type', 'image/png');
  setMetaTag('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
  setMetaTag('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
  setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', SOCIAL_IMAGE_ALT);
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', SOCIAL_IMAGE_URL);
  setMetaTag('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', SOCIAL_IMAGE_ALT);
}

function setJsonLd(schema: Record<string, unknown>) {
  let script = document.querySelector('script[data-seo-schema="true"]');
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-seo-schema', 'true');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schema);
}

// Adresse officielle d'une page, avec le "/" final (ex: https://stevangaron.fr/portfolio/).
function pageUrlFor(route: Route): string {
  return `${SITE_URL}${toHref(route)}`;
}

// Données structurées propres à chaque page. L'activité elle-même
// (ProfessionalService : nom, adresse, téléphone...) est décrite une seule
// fois, dans le <script type="application/ld+json"> de index.html : ici, on
// ajoute seulement ce qui décrit la page affichée, avec des propriétés que
// chaque type Schema.org prévoit réellement.
function buildStructuredData(route: Route): Record<string, unknown> | null {
  const pageUrl = pageUrlFor(route);
  const seo = PAGE_SEO[route];

  if (route === '/portfolio') {
    return {
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      name: seo.title,
      url: pageUrl,
      description: 'Portfolio photo de portraits, événements, sports et paysages en Vendée.',
    };
  }

  if (route === '/about') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Stevan Garon',
      url: pageUrl,
      jobTitle: 'Photographe et télépilote de drone',
      description:
        'Photographe basé en Vendée, spécialisé dans les portraits, événements, sports et prises de vue aériennes.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'La Chaize-le-Vicomte',
        addressRegion: 'Vendée',
        addressCountry: 'FR',
      },
      sameAs: [INSTAGRAM_URL],
    };
  }

  if (route === '/contact') {
    return {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: seo.title,
      url: pageUrl,
    };
  }

  if (route === '/mentions-legales') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Mentions légales',
      url: pageUrl,
    };
  }

  if (route === '/404') {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Stevan Garon Photographe',
    url: pageUrl,
    inLanguage: 'fr-FR',
  };
}

// Met à jour le titre de l'onglet et les balises meta selon la page affichée.
// À appeler dans un useEffect, à chaque changement de route.
export function applyPageSeo(route: Route) {
  const seo = PAGE_SEO[route] ?? PAGE_SEO['/'];
  const isNotFound = route === '/404';
  const canonicalUrl = isNotFound ? null : pageUrlFor(route);

  document.title = seo.title;
  setMetaTag('meta[name="description"]', 'name', 'description', seo.description);
  // Une page introuvable ne doit pas apparaître dans Google.
  setMetaTag('meta[name="robots"]', 'name', 'robots', isNotFound ? 'noindex, follow' : 'index, follow');
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', seo.title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', seo.description);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl ?? SITE_URL + '/');
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Stevan Garon Photographe');
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);
  setCanonicalUrl(canonicalUrl);
  setSocialImageMeta();

  const schema = buildStructuredData(route);
  if (schema) {
    setJsonLd(schema);
  } else {
    document.querySelector('script[data-seo-schema="true"]')?.remove();
  }
}

// ----------------------------------------------------------------------------
// 2. Textes alternatifs enrichis pour les photos
// ----------------------------------------------------------------------------
// Ajoute un contexte géographique/métier au titre déjà renseigné dans
// content.ts, sans avoir à toucher aux 96 fiches photos une par une.
export function buildPhotoAlt(title: string, categoryName?: string): string {
  const cleanTitle = title?.trim() || 'Photographie';
  const suffix = categoryName ? `${categoryName} en Vendée` : 'Photographe en Vendée';
  return `${cleanTitle} — ${suffix} | Stevan Garon`;
}

// ----------------------------------------------------------------------------
// 3. Optimisation automatique des images Cloudinary
// ----------------------------------------------------------------------------
// Insère les paramètres f_auto,q_auto (format + qualité automatiques) dans les
// URLs Cloudinary pour servir des images plus légères, sans avoir à ré-uploader
// ni à modifier les 96 URLs dans content.ts.
//
// Le paramètre `width` optionnel ajoute en plus c_limit,w_XXX : Cloudinary ne
// renverra jamais une image plus large que ce qui est réellement affiché à
// l'écran (au lieu d'envoyer la photo originale, souvent 3000px+ de large,
// pour une vignette de 400px). C'est le gain de performance le plus important
// du site : moins de données transférées = chargement plus rapide, surtout
// sur mobile / 4G.
export function optimizeCloudinaryUrl(url: string, width?: number): string {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }
  if (url.includes('/upload/f_auto')) {
    return url; // déjà optimisée
  }
  const sizePart = width ? `,c_limit,w_${Math.round(width)}` : '';
  return url.replace('/upload/', `/upload/f_auto,q_auto${sizePart}/`);
}

// ----------------------------------------------------------------------------
// 4. Attribut srcset pour les images Cloudinary
// ----------------------------------------------------------------------------
// Génère plusieurs variantes de la même image à différentes largeurs, pour
// que le navigateur choisisse lui-même la plus petite qui reste nette selon
// la taille d'écran et la densité de pixels (mobile, tablette, écran Retina...).
// À utiliser avec l'attribut `sizes` sur la balise <img>.
export function buildCloudinarySrcSet(url: string, widths: number[]): string | undefined {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/') || url.includes('/upload/f_auto')) {
    return undefined;
  }
  return widths.map((width) => `${optimizeCloudinaryUrl(url, width)} ${width}w`).join(', ');
}

// ----------------------------------------------------------------------------
// 5. Image de fond de l'accueil
// ----------------------------------------------------------------------------
// Largeurs générées pour l'image de fond du hero : c'est la plus grande image
// du site (pleine largeur d'écran) et généralement le LCP (Largest Contentful
// Paint), la métrique de performance la plus regardée par Google.
// Partagées entre la page d'accueil (src/pages/Home.tsx) et le préchargement
// ajouté au HTML pendant le build (vite.config.ts) : les deux doivent
// demander exactement les mêmes fichiers pour que le préchargement serve.
export const HERO_WIDTHS = [768, 1280, 1920, 2560];
export const HERO_DEFAULT_WIDTH = 1920;

// ----------------------------------------------------------------------------
// 6. Images recadrées par Cloudinary (cartes de catégories du portfolio)
// ----------------------------------------------------------------------------
// Pour une carte de format fixe (4/5), on demande à Cloudinary l'image déjà
// recadrée à ce format (c_fill), centrée automatiquement sur le sujet
// (g_auto). Le navigateur ne télécharge ainsi que la partie affichée : les
// couvertures pèsent environ deux fois moins qu'en version non recadrée.
export function cropCloudinaryUrl(url: string, width: number, aspectRatio = '4:5'): string {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/') || url.includes('/upload/f_auto')) {
    return url;
  }
  return url.replace('/upload/', `/upload/f_auto,q_auto,c_fill,ar_${aspectRatio},g_auto,w_${Math.round(width)}/`);
}

export function buildCloudinaryCropSrcSet(url: string, widths: number[], aspectRatio = '4:5'): string | undefined {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/') || url.includes('/upload/f_auto')) {
    return undefined;
  }
  return widths.map((width) => `${cropCloudinaryUrl(url, width, aspectRatio)} ${width}w`).join(', ');
}