import { useState, useEffect } from 'react';
import { useData } from './hooks/useData';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { MentionsLegales } from './pages/MentionsLegales';
import { NotFound } from './pages/NotFound';
import { applyPageSeo } from './lib/seo';
import { pickAboutPhoto, pickFeaturedPhotos, pickHeroPhoto } from './lib/photos';
import { getCurrentRoute, navigate as goTo, subscribeToRoute, toHref, type Route } from './lib/router';
import { loadGTM } from './lib/gtm';

// Toutes les pages sont incluses directement (plus de chargement à la
// demande) : elles sont légères (une trentaine de Ko au total, une dizaine
// une fois compressées), et cela supprime l'écran "Chargement" qui
// s'affichait en changeant de page.

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

// Thème au premier affichage : celui choisi lors d'une visite précédente, sinon
// celui du système. Lu tout de suite (et non après un premier affichage en
// sombre) pour éviter un "flash" de thème au chargement.
function getInitialTheme(): Theme {
  const savedTheme = window.localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function App() {
  // Données du site (profil, photos, catégories), lues dans src/data/content.ts
  const { profile, categories, photos } = useData();

  // Gère la page actuellement affichée selon la vraie URL (/, /portfolio, /about, /contact)
  const [route, setRoute] = useState<Route>(() => getCurrentRoute());

  // Gère le thème clair/sombre du site
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Consentement RGPD / cookies : affiché tant que la personne n'a fait
  // aucun choix (ni accepté, ni refusé), ou quand elle clique sur
  // "Gérer les cookies" en bas de page. Un refus est mémorisé comme une
  // acceptation : on ne redemande pas à chaque visite (recommandation CNIL).
  const [showConsentBanner, setShowConsentBanner] = useState(() => {
    const consentChoice = window.localStorage.getItem(CONSENT_KEY);
    return consentChoice !== 'accepted' && consentChoice !== 'declined';
  });

  // Si la personne avait déjà accepté lors d'une visite précédente, on peut
  // charger GTM tout de suite. Sinon, GTM reste bloqué tant qu'elle n'a pas
  // cliqué sur "Accepter".
  useEffect(() => {
    if (window.localStorage.getItem(CONSENT_KEY) === 'accepted') {
      loadGTM();
    }
  }, []);

  // À chaque changement de thème, on applique le style au site et on le sauvegarde
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  // Écoute les changements de page quand l’URL change (navigation interne
  // ou boutons précédent/suivant du navigateur)
  useEffect(() => {
    return subscribeToRoute(setRoute);
  }, []);

  // Met à jour le <title> et la <meta description> selon la page affichée
  // (plan SEO, point 1.2). Voir src/lib/seo.ts pour le détail et les limites.
  useEffect(() => {
    applyPageSeo(route);

    if (typeof window !== 'undefined' && window.location.hostname === 'stevangaron.fr') {
      const params = new URLSearchParams(window.location.search);
      const isDebug = params.get('seo_debug') === '1';
      if (isDebug) {
        console.info('[SEO] route:', route);
        console.info('[SEO] canonical:', document.querySelector('link[rel="canonical"]')?.getAttribute('href'));
      }
    }
  }, [route]);

  // Photos mises en avant : sélection de l'accueil (sans la photo réservée à
  // À Propos), image de fond de l'accueil et photo de la page À Propos.
  // Les règles sont dans src/lib/photos.ts.
  const featuredPhotos = pickFeaturedPhotos(photos);
  const heroPhoto = pickHeroPhoto(photos);
  const aboutPhoto = pickAboutPhoto(photos);
  const pageContent =
    route === '/portfolio' ? (
      <Portfolio categories={categories} photos={photos} />
    ) : route === '/about' ? (
      <About profile={profile} aboutPhoto={aboutPhoto} />
    ) : route === '/contact' ? (
      <Contact profile={profile} />
    ) : route === '/mentions-legales' ? (
      <MentionsLegales profile={profile} />
    ) : route === '/404' ? (
      <NotFound />
    ) : (
      <Home profile={profile} featuredPhotos={featuredPhotos} heroPhoto={heroPhoto} aboutPreviewPhoto={aboutPhoto} />
    );

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
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
        theme={theme}
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
