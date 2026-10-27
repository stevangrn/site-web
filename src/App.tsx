import { useState, useEffect, useMemo } from 'react';
import { useData } from './hooks/useData';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { MentionsLegales } from './pages/MentionsLegales';
import { NotFound } from './pages/NotFound';
import { applyPageSeo, getPageMeta } from './lib/seo';
import { pickAboutPhoto, pickFeaturedPhotos, pickHeroPhoto } from './lib/photos';
import {
  navigate as goTo,
  parsePath,
  portfolioPath,
  replaceUrl,
  resolveLocation,
  subscribeToLocation,
  toHref,
  type SiteLocation,
} from './lib/router';
import { loadGTM } from './lib/gtm';

// Toutes les pages sont incluses directement (plus de chargement à la
// demande) : elles sont légères (une trentaine de Ko au total, une dizaine
// une fois compressées), et cela supprime l'écran "Chargement" qui
// s'affichait en changeant de page.
//
// IMPORTANT — pré-rendu : chaque page est d'abord générée en HTML au build
// (scripts/prerender.mjs), puis le navigateur "réveille" ce HTML (hydratation).
// Pour que les deux correspondent exactement, le premier affichage ne doit
// dépendre que de l'adresse de la page : tout ce qui dépend du navigateur
// (choix cookies, thème, paramètres "?photo=") est lu APRÈS, dans un useEffect.

type Theme = 'dark' | 'light';

// Clé du choix cookies dans le navigateur : 'accepted' ou 'declined'.
const CONSENT_KEY = 'portfolio-consent';

// Supprime les cookies de mesure d'audience Google (_ga, _gid...) déjà
// déposés, quand la personne retire son accord.
function removeAnalyticsCookies() {
  const hostname = window.location.hostname;
  const domains = [hostname, `.${hostname.replace(/^www\./, '')}`];
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim();
    if (name.startsWith('_ga') || name === '_gid' || name.startsWith('_gat')) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      domains.forEach((domain) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
      });
    }
  });
}

interface AppProps {
  // Chemin de la page à afficher (ex: "/portfolio/sports/"). Dans le
  // navigateur, c'est l'adresse actuelle ; pendant le build, c'est la page
  // en cours de génération.
  initialPath: string;
}

function App({ initialPath }: AppProps) {
  // Données du site (profil, photos, catégories), lues dans src/data/content.ts
  const { profile, categories, photos } = useData();

  // Page actuellement affichée selon la vraie URL (/, /portfolio/, /portfolio/sports/, /about/...)
  const [location, setLocation] = useState<SiteLocation>(() => parsePath(initialPath));

  // Consentement RGPD / cookies : affiché tant que la personne n'a fait
  // aucun choix (ni accepté, ni refusé), ou quand elle clique sur
  // "Gérer les cookies" en bas de page. Un refus est mémorisé comme une
  // acceptation : on ne redemande pas à chaque visite (recommandation CNIL).
  const [showConsentBanner, setShowConsentBanner] = useState(false);

  // Si la personne avait déjà accepté lors d'une visite précédente, on peut
  // charger GTM tout de suite. Sinon, GTM reste bloqué tant qu'elle n'a pas
  // cliqué sur "Accepter".
  useEffect(() => {
    const consentChoice = window.localStorage.getItem(CONSENT_KEY);
    if (consentChoice === 'accepted') {
      loadGTM();
    } else if (consentChoice !== 'declined') {
      setShowConsentBanner(true);
    }
  }, []);

  // Écoute les changements de page quand l’URL change (navigation interne
  // ou boutons précédent/suivant du navigateur)
  useEffect(() => {
    return subscribeToLocation(setLocation);
  }, []);

  // Anciennes adresses du portfolio (/portfolio/?categorie=sports et
  // /portfolio/?photo=photo-12) : on les convertit vers la nouvelle forme
  // (/portfolio/sports/ et /portfolio/nature/?photo=photo-12), pour que les
  // liens déjà partagés continuent de fonctionner.
  useEffect(() => {
    if (location.route !== '/portfolio' || location.categorySlug) return;
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('categorie');
    if (slug && categories.some((category) => category.slug === slug)) {
      replaceUrl(portfolioPath(slug));
      return;
    }
    const photoId = params.get('photo');
    const photo = photoId ? photos.find((p) => p.id === photoId) : undefined;
    const photoCategory = categories.find((category) => category.id === photo?.category_id);
    if (photo && photoCategory) {
      replaceUrl(`${portfolioPath(photoCategory.slug)}?photo=${photo.id}`);
    }
  }, [location, categories, photos]);

  // Page réellement affichée (une catégorie inconnue donne "Page introuvable")
  const page = useMemo(() => resolveLocation(location, categories), [location, categories]);

  // Met à jour le <title>, la <meta description>, le canonical... quand on
  // change de page sans recharger. Voir src/lib/seo.ts.
  useEffect(() => {
    applyPageSeo(getPageMeta(page.location, page.category));
  }, [page]);

  // Photos mises en avant : sélection de l'accueil (sans la photo réservée à
  // À Propos), image de fond de l'accueil et photo de la page À Propos.
  // Les règles sont dans src/lib/photos.ts.
  const featuredPhotos = pickFeaturedPhotos(photos);
  const heroPhoto = pickHeroPhoto(photos);
  const aboutPhoto = pickAboutPhoto(photos);
  const route = page.location.route;
  const pageContent =
    route === '/portfolio' ? (
      <Portfolio categories={categories} photos={photos} category={page.category} />
    ) : route === '/about' ? (
      <About profile={profile} aboutPhoto={aboutPhoto} />
    ) : route === '/contact' ? (
      <Contact profile={profile} />
    ) : route === '/mentions-legales' ? (
      <MentionsLegales profile={profile} />
    ) : route === '/404' ? (
      <NotFound />
    ) : (
      <Home
        profile={profile}
        categories={categories}
        featuredPhotos={featuredPhotos}
        heroPhoto={heroPhoto}
        aboutPreviewPhoto={aboutPhoto}
      />
    );

  // Change de thème : le thème est porté par l'attribut data-theme de <html>,
  // posé avant le premier affichage par le petit script de index.html.
  const toggleTheme = () => {
    const root = document.documentElement;
    const nextTheme: Theme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', nextTheme);
    root.style.colorScheme = nextTheme;
    try {
      window.localStorage.setItem('portfolio-theme', nextTheme);
    } catch {
      // stockage indisponible (navigation privée...) : le thème change quand même
    }
  };

  const acceptConsent = () => {
    window.localStorage.setItem(CONSENT_KEY, 'accepted');
    setShowConsentBanner(false);
    loadGTM();
  };

  const declineConsent = () => {
    const previousChoice = window.localStorage.getItem(CONSENT_KEY);
    window.localStorage.setItem(CONSENT_KEY, 'declined');
    setShowConsentBanner(false);

    // Retrait d'un accord donné auparavant : GTM est peut-être déjà chargé
    // dans cette page. On efface ses cookies et on recharge la page pour
    // qu'il ne tourne plus.
    if (previousChoice === 'accepted') {
      removeAnalyticsCookies();
      window.location.reload();
    }
  };

  // Ouvre la politique de confidentialité SANS valider le bandeau : la
  // personne doit pouvoir la lire avant de choisir.
  const openPrivacyPolicy = () => {
    goTo('/mentions-legales#confidentialite');
    window.requestAnimationFrame(() => {
      document.getElementById('confidentialite')?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  return (
    <>
      <Layout
        profile={profile}
        route={route}
        onToggleTheme={toggleTheme}
        onManageConsent={() => setShowConsentBanner(true)}
      >
        {pageContent}
      </Layout>

      {/* Bandeau cookies. Fond plein (l'ancien fond semi-transparent n'était
          pas généré par Tailwind, le texte se retrouvait illisible sur les
          photos) et boutons "Refuser" / "Accepter" identiques : la CNIL
          demande que refuser soit aussi simple et visible qu'accepter. */}
      {showConsentBanner && (
        <div
          role="region"
          aria-label="Gestion des cookies"
          className="fixed bottom-0 left-0 right-0 z-[60] border-t border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.25)] md:py-4"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-8">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Nous respectons votre vie privée.
              </p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Avec votre accord, ce site utilise Google Tag Manager pour mesurer son audience. Votre
                choix de thème est mémorisé dans votre navigateur. Vous pourrez changer d'avis à tout
                moment via «&nbsp;Gérer les cookies&nbsp;» en bas de page.{' '}
                <a
                  href={toHref('/mentions-legales#confidentialite')}
                  onClick={(event) => {
                    event.preventDefault();
                    openPrivacyPolicy();
                  }}
                  className="text-amber-500 underline underline-offset-2 hover:text-amber-400"
                >
                  Politique de confidentialité
                </a>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={declineConsent}
                className="flex-1 rounded-full bg-amber-500 px-6 py-2 text-sm font-medium text-neutral-950 transition-colors hover:bg-amber-400 md:flex-none"
              >
                Refuser
              </button>
              <button
                type="button"
                onClick={acceptConsent}
                className="flex-1 rounded-full bg-amber-500 px-6 py-2 text-sm font-medium text-neutral-950 transition-colors hover:bg-amber-400 md:flex-none"
              >
                Accepter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
