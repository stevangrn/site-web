// ============================================================================
// UTILITAIRES SEO
// ============================================================================
// Regroupe les petits ajustements du plan de référencement :
//   - un <title> et une <meta description> différents par page (point 1.2)
//   - des textes "alt" plus riches sur les photos, avec contexte local (point 1.5)
//   - une optimisation automatique des images Cloudinary (point 1.6)
//
// Les informations de chaque page (titre, description, canonical...) sont
// calculées une seule fois par getPageMeta(), puis utilisées à deux endroits :
//   - au build, pour écrire les balises directement dans le HTML de chaque
//     page (buildHeadTags, utilisé par scripts/prerender.mjs) : elles sont
//     ainsi lues par Google, Bing et les aperçus de partage, même sans JavaScript ;
//   - dans le navigateur, pour les mettre à jour quand on change de page sans
//     recharger (applyPageSeo).
// ============================================================================

import { portfolioPath, toHref, type Route, type SiteLocation } from './router';
import type { Category, Photo } from './types';

// Adresse officielle du site, utilisée pour le canonical, og:url et les
// données structurées (jamais l'adresse locale de développement).
export const SITE_URL = 'https://stevangaron.fr';
const SITE_NAME = 'Stevan Garon Photographe';

// Image d'aperçu affichée quand un lien du site est partagé (WhatsApp,
// Facebook, LinkedIn...), au format 1200 x 630 attendu par ces services.
export interface SocialImage {
  url: string;
  type: string;
  width: number;
  height: number;
  alt: string;
}

// Image par défaut : le logo, dans public/og-image.png. Le fichier est copié
// tel quel à la racine du site au moment du build, son adresse ne change donc
// jamais (contrairement aux fichiers de src/ ou static/, renommés par Vite).
const DEFAULT_SOCIAL_IMAGE: SocialImage = {
  url: `${SITE_URL}/og-image.png`,
  type: 'image/png',
  width: 1200,
  height: 630,
  alt: 'Logo Stevan Garon — photographe et télépilote de drone en Vendée',
};

// Image d'aperçu d'une page de catégorie (/portfolio/sports/...) : sa photo
// de couverture, recadrée par Cloudinary au format 1200 x 630 et centrée
// automatiquement sur le sujet (g_auto). Elle est demandée en JPEG (f_jpg)
// et non en format automatique, car certains services de partage ne lisent
// pas les formats récents (WebP, AVIF). Une photo qui n'est pas sur
// Cloudinary garde l'image par défaut.
function categorySocialImage(category: Category, cover: Photo | null): SocialImage {
  const url = cover?.image_url ?? '';
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/') || url.includes('/upload/f_auto')) {
    return DEFAULT_SOCIAL_IMAGE;
  }
  return {
    url: url.replace('/upload/', '/upload/c_fill,g_auto,w_1200,h_630,q_auto,f_jpg/'),
    type: 'image/jpeg',
    width: 1200,
    height: 630,
    alt: `${category.name} — ${cover?.description?.trim() || cover?.title?.trim() || 'photo de Stevan Garon'}`,
  };
}

const INSTAGRAM_URL = 'https://www.instagram.com/stevan_raw/';

// ----------------------------------------------------------------------------
// 1. Titre + description par page
// ----------------------------------------------------------------------------
const PAGE_SEO: Record<Route, { title: string; description: string }> = {
  '/': {
    title: 'Stevan Garon — Photographe & Télépilote de drone en Vendée',
    description:
      'Photographe basé à La Chaize-le-Vicomte (Vendée). Portraits, événements, sports et prises de vue aériennes par drone.',
  },
  '/portfolio': {
    // Titre court : au-delà d'environ 60 caractères, Google le coupe.
    title: 'Portfolio photo en Vendée | Stevan Garon',
    description:
      'Mes photos réalisées en Vendée et alentours : sport, événements, mariages, galas, portraits et paysages, dont des prises de vue aériennes par drone.',
  },
  '/about': {
    title: 'À propos — Stevan Garon, photographe en Vendée',
    description:
      'Stevan Garon, photographe et télépilote de drone en Vendée : mon parcours, mes spécialités (sport, événements, mariages, portraits) et mes services.',
  },
  '/contact': {
    title: 'Contact — Réservez une séance photo en Vendée',
    description:
      'Contactez Stevan Garon, photographe en Vendée, pour un mariage, un événement, du sport, un portrait ou des prises de vue par drone. Réponse sous 24 h.',
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

// Tout ce qu'il faut savoir sur une page pour remplir son <head>.
export interface PageMeta {
  title: string;
  description: string;
  // Adresse officielle de la page (null = page introuvable, sans canonical)
  canonical: string | null;
  robots: string;
  // Données structurées propres à la page (null = aucune)
  schema: Record<string, unknown> | null;
  // Fil d'Ariane de la page pour Google (null = aucun, ex : l'accueil)
  breadcrumb: Record<string, unknown> | null;
  // Image d'aperçu quand la page est partagée
  image: SocialImage;
}

// Adresse officielle d'un chemin, avec le "/" final (ex: https://stevangaron.fr/portfolio/).
function absoluteUrl(path: string): string {
  return `${SITE_URL}${toHref(path)}`;
}

// ----------------------------------------------------------------------------
// Fil d'Ariane (« Accueil › Portfolio › Sports »)
// ----------------------------------------------------------------------------
// Décrit à Google le chemin de chaque page dans le site. Google peut alors
// l'afficher dans ses résultats sur ordinateur, à la place de l'adresse brute
// (sur mobile, il n'affiche plus que le nom du site depuis 2025). Rien ne
// change à l'écran sur le site. Les noms sont ceux du menu.
const BREADCRUMB_NAMES: Record<Exclude<Route, '/404'>, string> = {
  '/': 'Accueil',
  '/portfolio': 'Portfolio',
  '/about': 'À propos',
  '/contact': 'Contact',
  '/mentions-legales': 'Mentions légales',
};

function buildBreadcrumb(items: { name: string; path: string }[]): Record<string, unknown> | null {
  // Un fil d'Ariane réduit à l'accueil n'apporte rien
  if (items.length < 2) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

const HOME_CRUMB = { name: BREADCRUMB_NAMES['/'], path: '/' };

// Calcule les informations d'une page. `category` = la catégorie affichée
// sur une page /portfolio/<categorie>/ (null sinon), `cover` = sa photo de
// couverture (voir pickCategoryCover dans photos.ts), utilisée comme image
// d'aperçu de la page.
//
// Les données structurées décrivent la page affichée. L'activité elle-même
// (ProfessionalService : nom, adresse, téléphone...) est décrite une seule
// fois, dans le <script type="application/ld+json"> de index.html.
export function getPageMeta(location: SiteLocation, category: Category | null, cover: Photo | null = null): PageMeta {
  const { route } = location;

  if (route === '/404') {
    return {
      ...PAGE_SEO['/404'],
      canonical: null,
      robots: 'noindex, follow',
      schema: null,
      breadcrumb: null,
      image: DEFAULT_SOCIAL_IMAGE,
    };
  }

  if (route === '/portfolio' && category) {
    const url = absoluteUrl(portfolioPath(category.slug));
    const description = `${category.description ? `${category.description}. ` : ''}Photos réalisées en Vendée et alentours par Stevan Garon, photographe et télépilote de drone.`;
    const image = categorySocialImage(category, cover);
    return {
      title: `${category.name} — Portfolio photo en Vendée | Stevan Garon`,
      description,
      canonical: url,
      robots: 'index, follow',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'ImageGallery',
        name: `${category.name} — Portfolio de Stevan Garon`,
        url,
        description,
        ...(image !== DEFAULT_SOCIAL_IMAGE ? { image: image.url } : {}),
      },
      breadcrumb: buildBreadcrumb([
        HOME_CRUMB,
        { name: BREADCRUMB_NAMES['/portfolio'], path: '/portfolio' },
        { name: category.name, path: portfolioPath(category.slug) },
      ]),
      image,
    };
  }

  const seo = PAGE_SEO[route];
  const url = absoluteUrl(route);
  let schema: Record<string, unknown>;

  if (route === '/portfolio') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: seo.title,
      url,
      description: 'Portfolio photo de portraits, événements, sports et paysages en Vendée.',
    };
  } else if (route === '/about') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Stevan Garon',
      url,
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
  } else if (route === '/contact') {
    schema = { '@context': 'https://schema.org', '@type': 'ContactPage', name: seo.title, url };
  } else if (route === '/mentions-legales') {
    schema = { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Mentions légales', url };
  } else {
    schema = { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url, inLanguage: 'fr-FR' };
  }

  const breadcrumb = route === '/' ? null : buildBreadcrumb([HOME_CRUMB, { name: BREADCRUMB_NAMES[route], path: route }]);

  return { ...seo, canonical: url, robots: 'index, follow', schema, breadcrumb, image: DEFAULT_SOCIAL_IMAGE };
}

// ----------------------------------------------------------------------------
// Écriture des balises dans le HTML (au build)
// ----------------------------------------------------------------------------
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Bloc de données structurées (JSON-LD). L'attribut data-seo-... permet de le
// retrouver dans le navigateur pour le mettre à jour en changeant de page.
function jsonLdTag(attribute: string, data: Record<string, unknown> | null): string {
  if (!data) return '';
  return `<script type="application/ld+json" ${attribute}="true">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

// Renvoie les balises du <head> d'une page, à insérer dans son fichier HTML.
export function buildHeadTags(meta: PageMeta): string {
  const ogUrl = meta.canonical ?? `${SITE_URL}/`;
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="robots" content="${meta.robots}" />`,
    meta.canonical ? `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />` : '',
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="fr_FR" />',
    `<meta property="og:url" content="${escapeHtml(ogUrl)}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:image" content="${escapeHtml(meta.image.url)}" />`,
    `<meta property="og:image:secure_url" content="${escapeHtml(meta.image.url)}" />`,
    `<meta property="og:image:type" content="${meta.image.type}" />`,
    `<meta property="og:image:width" content="${meta.image.width}" />`,
    `<meta property="og:image:height" content="${meta.image.height}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(meta.image.alt)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(meta.image.url)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(meta.image.alt)}" />`,
    jsonLdTag('data-seo-schema', meta.schema),
    jsonLdTag('data-seo-breadcrumb', meta.breadcrumb),
  ];
  return tags.filter(Boolean).join('\n    ');
}

// ----------------------------------------------------------------------------
// Mise à jour des balises dans le navigateur (changement de page)
// ----------------------------------------------------------------------------
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

function setJsonLd(attribute: string, data: Record<string, unknown> | null) {
  let script = document.querySelector(`script[${attribute}="true"]`);
  if (!data) {
    script?.remove();
    return;
  }
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute(attribute, 'true');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

// Met à jour le titre de l'onglet et les balises meta selon la page affichée.
// À appeler dans un useEffect, à chaque changement de page.
export function applyPageSeo(meta: PageMeta) {
  document.title = meta.title;
  setMetaTag('meta[name="description"]', 'name', 'description', meta.description);
  // Une page introuvable ne doit pas apparaître dans Google.
  setMetaTag('meta[name="robots"]', 'name', 'robots', meta.robots);
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', meta.title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', meta.description);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', meta.canonical ?? `${SITE_URL}/`);
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', meta.description);
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', meta.image.url);
  setMetaTag('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', meta.image.url);
  setMetaTag('meta[property="og:image:type"]', 'property', 'og:image:type', meta.image.type);
  setMetaTag('meta[property="og:image:width"]', 'property', 'og:image:width', String(meta.image.width));
  setMetaTag('meta[property="og:image:height"]', 'property', 'og:image:height', String(meta.image.height));
  setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', meta.image.alt);
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', meta.image.url);
  setMetaTag('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', meta.image.alt);
  setCanonicalUrl(meta.canonical);
  setJsonLd('data-seo-schema', meta.schema);
  setJsonLd('data-seo-breadcrumb', meta.breadcrumb);
}

// ----------------------------------------------------------------------------
// 2. Textes alternatifs des photos (attribut "alt")
// ----------------------------------------------------------------------------
// Le texte alternatif décrit ce que montre la photo : il est lu par les
// lecteurs d'écran des personnes malvoyantes et sert à Google Images pour
// comprendre l'image. On utilise la description rédigée dans content.ts
// (une phrase précise et différente pour chaque photo), sinon le titre.
// Pas de mots-clés ajoutés ("en Vendée | Stevan Garon") : répétés sur
// chaque photo, ils étaient parfois faux (Alpes, côte basque, Japon) et
// Google les considère comme du bourrage de mots-clés.
export function buildPhotoAlt(photo: Pick<Photo, 'title' | 'description'>): string {
  return photo.description?.trim() || photo.title?.trim() || 'Photographie de Stevan Garon';
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
//
// Le paramètre `quality` permet de demander une compression un peu plus forte
// ('eco') pour les vignettes de la grille du portfolio : environ 25 % plus
// légères, sans différence visible à cette taille. La photo ouverte en grand
// dans la visionneuse garde la qualité normale.
export type CloudinaryQuality = 'auto' | 'eco';

export function optimizeCloudinaryUrl(url: string, width?: number, quality: CloudinaryQuality = 'auto'): string {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }
  if (url.includes('/upload/f_auto')) {
    return url; // déjà optimisée
  }
  const qualityPart = quality === 'eco' ? 'q_auto:eco' : 'q_auto';
  const sizePart = width ? `,c_limit,w_${Math.round(width)}` : '';
  return url.replace('/upload/', `/upload/f_auto,${qualityPart}${sizePart}/`);
}

// ----------------------------------------------------------------------------
// 4. Attribut srcset pour les images Cloudinary
// ----------------------------------------------------------------------------
// Génère plusieurs variantes de la même image à différentes largeurs, pour
// que le navigateur choisisse lui-même la plus petite qui reste nette selon
// la taille d'écran et la densité de pixels (mobile, tablette, écran Retina...).
// À utiliser avec l'attribut `sizes` sur la balise <img>.
export function buildCloudinarySrcSet(
  url: string,
  widths: number[],
  quality: CloudinaryQuality = 'auto'
): string | undefined {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/') || url.includes('/upload/f_auto')) {
    return undefined;
  }
  return widths.map((width) => `${optimizeCloudinaryUrl(url, width, quality)} ${width}w`).join(', ');
}

// ----------------------------------------------------------------------------
// 5. Image de fond de l'accueil
// ----------------------------------------------------------------------------
// Largeurs générées pour l'image de fond du hero : c'est la plus grande image
// du site (pleine largeur d'écran) et généralement le LCP (Largest Contentful
// Paint), la métrique de performance la plus regardée par Google.
// Partagées entre la page d'accueil (src/pages/Home.tsx) et le préchargement
// ajouté au HTML pendant le build (src/entry-server.tsx) : les deux doivent
// demander exactement les mêmes fichiers pour que le préchargement serve.
export const HERO_WIDTHS = [768, 1280, 1920, 2560];
export const HERO_DEFAULT_WIDTH = 1920;

// Largeur de la photo ouverte en grand dans la visionneuse. C'est aussi
// l'adresse déclarée à Google Images dans le sitemap (src/entry-server.tsx).
export const LIGHTBOX_DEFAULT_WIDTH = 1600;

// Attribut HTML fetchpriority (priorité de téléchargement d'une image), à
// placer sur une balise <img> avec {...fetchPriority('high')}. React 18 ne
// connaît pas encore la forme "fetchPriority" et l'écrirait en signalant une
// erreur pendant la génération des pages : on écrit donc directement
// l'attribut HTML, en minuscules.
export function fetchPriority(value: 'high' | 'low' | 'auto'): Record<string, string> {
  return { fetchpriority: value };
}

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