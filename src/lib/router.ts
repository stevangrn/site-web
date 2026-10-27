// ============================================================================
// ROUTEUR — navigation par de vraies URLs (History API)
// ============================================================================
// Remplace l'ancien routage par ancre (stevangaron.fr/#/portfolio) par de
// vraies URLs (stevangaron.fr/portfolio), pour que Google puisse indexer
// chaque page séparément (plan SEO, point 1.1).
//
// Reste volontairement simple (pas de librairie comme react-router) pour
// coller à l'esprit "facile à lire" du projet : on utilise directement les
// APIs du navigateur (history.pushState + événement popstate).
//
// Les pages du site :
//   /                      accueil
//   /portfolio/            choix d'une catégorie
//   /portfolio/sports/     photos d'une catégorie (une page par catégorie)
//   /about/  /contact/  /mentions-legales/
// Toute autre adresse affiche la page "Page introuvable".
//
// IMPORTANT côté hébergement : chaque page existe comme un vrai fichier HTML,
// déjà rempli, généré au build par scripts/prerender.mjs (voir README).
//
// Les fonctions qui lisent une adresse (parsePath, toHref) n'utilisent pas
// "window" : elles servent aussi pendant le build, où il n'y a pas de
// navigateur.
// ============================================================================

import type { Category } from './types';

// '/404' n'est pas une vraie adresse : c'est la route interne utilisée pour
// afficher la page "Page introuvable" quand l'URL ne correspond à aucune page.
export type Route = '/' | '/portfolio' | '/about' | '/contact' | '/mentions-legales' | '/404';

// Les vraies pages du site (celles qui ont une adresse et vont dans le sitemap).
export const validRoutes: Route[] = ['/', '/portfolio', '/about', '/contact', '/mentions-legales'];

// Une adresse décodée : la page, et pour le portfolio la catégorie affichée
// (null = écran de choix des catégories).
export interface SiteLocation {
  route: Route;
  categorySlug: string | null;
}

// Décode un chemin (sans "?..." ni "#..."). GitHub Pages ajoute un "/" final
// aux adresses (/portfolio -> /portfolio/) : on l'ignore pour reconnaître la page.
export function parsePath(pathname: string): SiteLocation {
  if (pathname === '' || pathname === '/' || pathname === '/index.html') {
    return { route: '/', categorySlug: null };
  }
  const parts = pathname.split('/').filter(Boolean);

  if (parts[0] === 'portfolio' && parts.length === 2) {
    return { route: '/portfolio', categorySlug: decodeURIComponent(parts[1]) };
  }

  const normalizedPath = `/${parts.join('/')}`;
  if ((validRoutes as string[]).includes(normalizedPath)) {
    return { route: normalizedPath as Route, categorySlug: null };
  }
  return { route: '/404', categorySlug: null };
}

// Adresse actuelle du navigateur, décodée.
export function getCurrentLocation(): SiteLocation {
  return parsePath(window.location.pathname);
}

// Page réellement affichée pour une adresse : une catégorie qui n'existe pas
// (ex: /portfolio/inconnue/) donne la page "Page introuvable".
export function resolveLocation(
  location: SiteLocation,
  categories: Category[]
): { location: SiteLocation; category: Category | null } {
  if (location.route === '/portfolio' && location.categorySlug) {
    const category = categories.find((c) => c.slug === location.categorySlug) ?? null;
    if (!category) {
      return { location: { route: '/404', categorySlug: null }, category: null };
    }
    return { location, category };
  }
  return { location, category: null };
}

// Chemin d'une page du portfolio : le choix des catégories, ou une catégorie.
export function portfolioPath(categorySlug?: string | null): string {
  return categorySlug ? `/portfolio/${categorySlug}` : '/portfolio';
}

// Transforme un chemin interne en adresse "officielle" du site, avec le "/"
// final que GitHub Pages impose (ex: "/portfolio" -> "/portfolio/",
// "/portfolio/sports?photo=photo-3" -> "/portfolio/sports/?photo=photo-3").
// Ainsi les liens, la barre d'adresse, le canonical et le sitemap utilisent
// tous la même forme, et aucun lien ne passe par une redirection 301.
export function toHref(path: string): string {
  const match = path.match(/^([^?#]*)(.*)$/);
  const pathname = match?.[1] ?? path;
  const rest = match?.[2] ?? '';
  if (pathname === '' || pathname === '/' || pathname.endsWith('/')) {
    return `${pathname || '/'}${rest}`;
  }
  return `${pathname}/${rest}`;
}

// Change de page sans recharger, en mettant à jour l'URL affichée dans la
// barre d'adresse (vraie URL, plus de "#"). Accepte une query string
// (ex: "/portfolio/sports?photo=photo-3") pour le lien direct vers une photo,
// et une ancre (ex: "/mentions-legales#confidentialite").
export function navigate(path: string) {
  const target = toHref(path);
  const currentFullPath = window.location.pathname + window.location.search + window.location.hash;
  if (currentFullPath !== target) {
    window.history.pushState({}, '', target);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

// Comme navigate(), mais remplace l'adresse au lieu d'en ajouter une à
// l'historique (utilisé pour convertir une ancienne adresse en nouvelle).
export function replaceUrl(path: string) {
  window.history.replaceState({}, '', toHref(path));
  window.dispatchEvent(new PopStateEvent('popstate'));
}

// S'abonne aux changements d'adresse (navigation interne via navigate() +
// boutons précédent/suivant du navigateur). Retourne une fonction de
// désabonnement, à utiliser dans le cleanup d'un useEffect.
export function subscribeToLocation(onChange: (location: SiteLocation) => void): () => void {
  const handler = () => onChange(getCurrentLocation());
  window.addEventListener('popstate', handler);
  return () => window.removeEventListener('popstate', handler);
}
