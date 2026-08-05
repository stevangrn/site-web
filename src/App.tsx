import { useState, useEffect } from 'react';
import { useData } from './hooks/useData';
import { Layout } from './components/Layout';
import { Loading } from './components/Loading';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { MentionsLegales } from './pages/MentionsLegales';
import { applyPageSeo } from './lib/seo';
import { getCurrentRoute, navigate as goTo, subscribeToRoute, type Route } from './lib/router';
import { LocaleProvider, t } from './lib/i18n';

type Theme = 'dark' | 'light';
type Locale = 'fr' | 'en';

function App() {
  // Récupère les données du profil, des photos et des catégories depuis la base
  const { profile, categories, photos, loading } = useData();

  // Gère la page actuellement affichée selon la vraie URL (/, /portfolio, /about, /contact)
  const [route, setRoute] = useState<Route>(() => getCurrentRoute());

  // Gère le thème clair/sombre du site
  const [theme, setTheme] = useState<Theme>('dark');

  // Gère la langue du site
  const [locale, setLocale] = useState<Locale>('fr');

  // Consentement RGPD / cookies : affiché tant qu'il n'a pas été accepté
  const [showConsentBanner, setShowConsentBanner] = useState(false);

  // Au chargement, on récupère le thème sauvegardé ou celui du système
  useEffect(() => {
    const savedTheme = window.localStorage.getItem('portfolio-theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = savedTheme === 'light' || savedTheme === 'dark'
      ? savedTheme
      : systemPrefersLight
        ? 'light'
        : 'dark';

    const consentAccepted = window.localStorage.getItem('portfolio-consent') === 'accepted';
    const savedLocale = window.localStorage.getItem('portfolio-locale');
    const initialLocale = savedLocale === 'fr' || savedLocale === 'en'
      ? savedLocale
      : window.navigator.language.startsWith('en')
        ? 'en'
        : 'fr';

    setShowConsentBanner(!consentAccepted);
    setTheme(initialTheme);
    setLocale(initialLocale);
  }, []);

  // À chaque changement de thème, on applique le style au site et on le sauvegarde
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem('portfolio-locale', locale);
  }, [locale]);

  // Écoute les changements de page quand l’URL change (navigation interne
  // ou boutons précédent/suivant du navigateur)
  useEffect(() => {
    return subscribeToRoute(setRoute);
  }, []);

  // Met à jour le <title> et la <meta description> selon la page affichée
  // (plan SEO, point 1.2). Voir src/lib/seo.ts pour le détail et les limites.
  useEffect(() => {
    applyPageSeo(route, locale);

    if (typeof window !== 'undefined' && window.location.hostname === 'stevangaron.fr') {
      const params = new URLSearchParams(window.location.search);
      const isDebug = params.get('seo_debug') === '1';
      if (isDebug) {
        console.info('[SEO] route:', route);
        console.info('[SEO] canonical:', document.querySelector('link[rel="canonical"]')?.getAttribute('href'));
      }
    }
  }, [route, locale]);

  // Pendant le chargement, on affiche l’écran de chargement
  if (loading) {
    return (
      <LocaleProvider locale={locale}>
        <Loading />
      </LocaleProvider>
    );
  }

  // On garde seulement les photos mises en avant pour la section
  // Travaux en Vedette de l’accueil, en excluant la photo réservée à À Propos.
  const featuredPhotos = photos.filter((photo) => (photo.featured_home ?? photo.featured) && !photo.about);
  const heroPhoto = photos.find((photo) => photo.hero) ?? photos.find((photo) => photo.featured) ?? null;
  const aboutPhoto = photos.find((photo) => photo.about) ?? photos.find((photo) => photo.featured) ?? null;
  const pageContent =
    route === '/portfolio' ? (
      <Portfolio categories={categories} photos={photos} />
    ) : route === '/about' ? (
      <About profile={profile} aboutPhoto={aboutPhoto} />
    ) : route === '/contact' ? (
      <Contact profile={profile} />
    ) : route === '/mentions-legales' ? (
      <MentionsLegales profile={profile} />
    ) : (
      <Home profile={profile} featuredPhotos={featuredPhotos} heroPhoto={heroPhoto} aboutPreviewPhoto={aboutPhoto} />
    );

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const toggleLocale = () => {
    setLocale((currentLocale) => (currentLocale === 'fr' ? 'en' : 'fr'));
  };

  const acceptConsent = () => {
    window.localStorage.setItem('portfolio-consent', 'accepted');
    setShowConsentBanner(false);
  };

  const declineConsent = () => {
    window.localStorage.setItem('portfolio-consent', 'declined');
    setShowConsentBanner(false);
  };

  return (
    <LocaleProvider locale={locale}>
      <Layout
        profile={profile}
        theme={theme}
        locale={locale}
        onToggleTheme={toggleTheme}
        onToggleLocale={toggleLocale}
      >
        {pageContent}
      </Layout>

      {showConsentBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-[60] border-t border-[var(--border-color)] bg-[var(--bg-primary)]/95 backdrop-blur-md px-4 py-4 shadow-[0_-10px_30px_rgba(0,0,0,0.25)]">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/90 p-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {t(locale, 'consent.title')}
              </p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {t(locale, 'consent.text')}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={declineConsent}
                className="rounded-full border border-[var(--border-color)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-amber-500"
              >
                {t(locale, 'consent.decline')}
              </button>
              <button
                type="button"
                onClick={acceptConsent}
                className="rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-neutral-950 transition-colors hover:bg-amber-400"
              >
                {t(locale, 'consent.accept')}
              </button>
              <button
                type="button"
                onClick={() => {
                  window.localStorage.setItem('portfolio-consent', 'accepted');
                  setShowConsentBanner(false);
                  goTo('/mentions-legales');
                }}
                className="text-sm text-amber-500 transition-colors hover:text-amber-400"
              >
                {t(locale, 'consent.privacy')}
              </button>
            </div>
          </div>
        </div>
      )}
    </LocaleProvider>
  );
}

export default App;
