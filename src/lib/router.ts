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
// IMPORTANT côté hébergement : pour que ça fonctionne, le serveur doit
// répondre avec index.html pour TOUTES les routes (/, /portfolio, /about,
// /contact), sinon recharger la page sur /portfolio donnera une erreur 404.
// Voir public/_redirects (Netlify) et vercel.json (Vercel) ajoutés au
// projet ; pour un hébergement classique (Apache/OVH...), voir le .htaccess
// ajouté dans public/, et le README pour GitHub Pages.
// ============================================================================

export type Route = '/' | '/portfolio' | '/about' | '/contact';

export const validRoutes: Route[] = ['/', '/portfolio', '/about', '/contact'];

// Lit la route actuelle depuis l'URL réelle (plus depuis le hash).
// GitHub Pages redirige automatiquement /portfolio vers /portfolio/ (avec un
// "/" final) pour les vrais fichiers déployés par page : on l'ignore donc
// pour reconnaître la route. Les paramètres de requête (ex: ?photo=photo-3)
// ne font pas partie de la route elle-même : ils restent lisibles via
// window.location.search.
export function getCurrentRoute(): Route {
  const path = window.location.pathname;
  const normalizedPath = path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path;
  return (validRoutes as string[]).includes(normalizedPath) ? (normalizedPath as Route) : '/';
}

// Change de page sans recharger, en mettant à jour l'URL affichée dans la
// barre d'adresse (vraie URL, plus de "#"). Accepte une query string
// (ex: "/portfolio?photo=photo-3") pour le lien direct vers une photo.
export function navigate(path: string) {
  const currentFullPath = window.location.pathname + window.location.search;
  if (currentFullPath !== path) {
    window.history.pushState({}, '', path);
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
