import { useState, useEffect } from 'react';
import { useData } from './hooks/useData';
import { Layout } from './components/Layout';
import { Loading } from './components/Loading';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { applyPageSeo } from './lib/seo';
import { getCurrentRoute, subscribeToRoute, type Route } from './lib/router';

type Theme = 'dark' | 'light';

function App() {
  // Récupère les données du profil, des photos et des catégories depuis la base
  const { profile, categories, photos, loading } = useData();

  // Gère la page actuellement affichée selon la vraie URL (/, /portfolio, /about, /contact)
  const [route, setRoute] = useState<Route>(() => getCurrentRoute());

  // Gère le thème clair/sombre du site
  const [theme, setTheme] = useState<Theme>('dark');

  // Au chargement, on récupère le thème sauvegardé ou celui du système
  useEffect(() => {
    const savedTheme = window.localStorage.getItem('portfolio-theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = savedTheme === 'light' || savedTheme === 'dark'
      ? savedTheme
      : systemPrefersLight
        ? 'light'
        : 'dark';

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
    ) : (
      <Home profile={profile} featuredPhotos={featuredPhotos} heroPhoto={heroPhoto} aboutPreviewPhoto={aboutPhoto} />
    );

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Layout profile={profile} theme={theme} onToggleTheme={toggleTheme}>
      {pageContent}
    </Layout>
  );
}

export default App;
