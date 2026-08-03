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
import { getCurrentRoute, navigate, subscribeToRoute, type Route } from './lib/router';

type Theme = 'dark' | 'light';

function App() {
  // Récupère les données du profil, des photos et des catégories depuis la base
  const { profile, categories, photos, loading } = useData();

  // Gère la page actuellement affichée selon la vraie URL (/, /portfolio, /about, /contact)
  const [route, setRoute] = useState<Route>(() => getCurrentRoute());

  // Gère le thème clair/sombre du site
  const [theme, setTheme] = useState<Theme>('dark');

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
    setShowConsentBanner(!consentAccepted);
    setTheme(initialTheme);
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
  }, [route]);

  // Pendant le chargement, on affiche l’écran de chargement
  if (loading) {
    return <Loading />;
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

  const acceptConsent = () => {
    window.localStorage.setItem('portfolio-consent', 'accepted');
    setShowConsentBanner(false);
  };

  const declineConsent = () => {
    window.localStorage.setItem('portfolio-consent', 'declined');
    setShowConsentBanner(false);
  };

  return (
    <>
      <Layout profile={profile} theme={theme} onToggleTheme={toggleTheme}>
        {pageContent}
      </Layout>

      {showConsentBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-[60] border-t border-[var(--border-color)] bg-[var(--bg-primary)]/95 backdrop-blur-md px-4 py-4 shadow-[0_-10px_30px_rgba(0,0,0,0.25)]">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/90 p-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Nous respectons votre vie privée.
              </p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Ce site utilise un stockage local pour mémoriser votre préférence de thème et améliorer votre expérience.
                Vous pouvez accepter ou refuser cette utilisation.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={declineConsent}
                className="rounded-full border border-[var(--border-color)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-amber-500"
              >
                Refuser
              </button>
              <button
                type="button"
                onClick={acceptConsent}
                className="rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-neutral-950 transition-colors hover:bg-amber-400"
              >
                Accepter
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
                Politique de confidentialité
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
