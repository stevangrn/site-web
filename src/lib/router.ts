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
// IMPORTANT côté hébergement : chaque page doit exister comme un vrai
// fichier, sinon recharger la page sur /portfolio donnerait une erreur 404.
// Sur GitHub Pages, c'est le workflow .github/workflows/deploy.yml qui s'en
// charge : il copie index.html dans portfolio/, about/, contact/ et
// mentions-legales/, et en 404.html pour les adresses inconnues.
// ============================================================================

// '/404' n'est pas une vraie adresse : c'est la route interne utilisée pour
// afficher la page "Page introuvable" quand l'URL ne correspond à aucune page.
export type Route = '/' | '/portfolio' | '/about' | '/contact' | '/mentions-legales' | '/404';

// Les vraies pages du site (celles qui ont une adresse et vont dans le sitemap).
export const validRoutes: Route[] = ['/', '/portfolio', '/about', '/contact', '/mentions-legales'];

// Lit la route actuelle depuis l'URL réelle (plus depuis le hash).
// GitHub Pages redirige automatiquement /portfolio vers /portfolio/ (avec un
// "/" final) pour les vrais fichiers déployés par page : on l'ignore donc
// pour reconnaître la route. Les paramètres de requête (ex: ?photo=photo-3)
// ne font pas partie de la route elle-même : ils restent lisibles via
// window.location.search.
// Une adresse inconnue (ex: /galerie) affiche la page "Page introuvable"
// au lieu de l'accueil.
export function getCurrentRoute(): Route {
  const path = window.location.pathname;
  if (path === '' || path === '/' || path === '/index.html') {
    return '/';
  }
  const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;
  return (validRoutes as string[]).includes(normalizedPath) ? (normalizedPath as Route) : '/404';
}

// Transforme un chemin interne en adresse "officielle" du site, avec le "/"
// final que GitHub Pages impose (ex: "/portfolio" -> "/portfolio/",
// "/portfolio?photo=photo-3" -> "/portfolio/?photo=photo-3"). Ainsi les liens,
// la barre d'adresse, le canonical et le sitemap utilisent tous la même forme,
// et aucun lien ne passe par une redirection 301.
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
// (ex: "/portfolio?photo=photo-3") pour le lien direct vers une photo, et une
// ancre (ex: "/mentions-legales#confidentialite").
export function navigate(path: string) {
  const target = toHref(path);
  const currentFullPath = window.location.pathname + window.location.search + window.location.hash;
  if (currentFullPath !== target) {
    window.history.pushState({}, '', target);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

// S'abonne aux changements de route (navigation interne via navigate() +
// boutons précédent/suivant du navigateur). Retourne une fonction de
// désabonnement, à utiliser dans le cleanup d'un useEffect.
export function subscribeToRoute(onChange: (route: Route) => void): () => void {
  const handler = () => onChange(getCurrentRoute());
  window.addEventListener('popstate', handler);
  return () => window.removeEventListener('popstate', handler);
}