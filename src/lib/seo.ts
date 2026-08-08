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
  '/mentions-legales': {
    title: 'Mentions légales — Stevan Garon Photographe',
    description:
      "Informations légales relatives à l'édition et à l'hébergement du site stevangaron.fr.",
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

function setCanonicalUrl(url: string) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function setSocialImageMeta() {
  const imageUrl = 'https://stevangaron.fr/static/logo.png';
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', imageUrl);
  setMetaTag('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', imageUrl);
  setMetaTag('meta[property="og:image:type"]', 'property', 'og:image:type', 'image/png');
  setMetaTag('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
  setMetaTag('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
  setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', 'Stevan Garon — photographe et télépilote de drone en Vendée');
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl);
  setMetaTag('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', 'Stevan Garon — photographe et télépilote de drone en Vendée');
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

function buildStructuredData(route: Route) {
  const baseUrl = 'https://stevangaron.fr';
  const pageUrl = new URL(route, baseUrl).toString();

  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Stevan Garon Photographe',
    image: `${baseUrl}/static/logo.png`,
    url: baseUrl,
    telephone: '+33627245673',
    email: 'stevan.garon@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'La Chaize-le-Vicomte',
      addressRegion: 'Vendée',
      addressCountry: 'FR',
    },
    areaServed: ['La Chaize-le-Vicomte', 'Vendée', 'La Roche-sur-Yon', 'Fontenay-le-Comte'],
    sameAs: ['https://instagram.com/stevan_raw'],
    priceRange: '€€',
  };

  if (route === '/portfolio') {
    return {
      ...baseSchema,
      '@type': 'ImageGallery',
      url: pageUrl,
      description: 'Portfolio photo de portraits, événements, sports et paysages en Vendée.',
    };
  }

  if (route === '/about') {
    return {
      ...baseSchema,
      '@type': 'Person',
      url: pageUrl,
      jobTitle: 'Photographe et télépilote de drone',
      description: 'Photographe professionnel basé en Vendée, spécialisé dans les portraits, événements, sports et prises de vue aériennes.',
    };
  }

  if (route === '/contact') {
    return {
      ...baseSchema,
      '@type': 'ContactPoint',
      url: pageUrl,
      contactType: 'Reservation de séance photo',
      availableLanguage: ['fr'],
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

  return {
    ...baseSchema,
    '@type': 'WebSite',
    url: pageUrl,
    name: 'Stevan Garon Photographe',
    description: 'Photographe professionnel en Vendée, spécialisé dans les portraits, événements, sports et prises de vue aériennes.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/portfolio`,
      'query-input': 'required name=search_term_string',
    },
  };
}

// Met à jour le titre de l'onglet et les balises meta selon la page affichée.
// À appeler dans un useEffect, à chaque changement de route.
export function applyPageSeo(route: Route) {
  const seo = PAGE_SEO[route] ?? PAGE_SEO['/'];
  const canonicalUrl = new URL(route, window.location.origin || 'https://stevangaron.fr').toString();

  document.title = seo.title;
  setMetaTag('meta[name="description"]', 'name', 'description', seo.description);
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', seo.title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', seo.description);
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Stevan Garon Photographe');
  setCanonicalUrl(canonicalUrl);
  setSocialImageMeta();
  setJsonLd(buildStructuredData(route));
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
export function optimizeCloudinaryUrl(url: string): string {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }
  if (url.includes('/upload/f_auto')) {
    return url; // déjà optimisée
  }
  return url.replace('/upload/', '/upload/f_auto,q_auto/');
}