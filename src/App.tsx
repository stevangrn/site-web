import { useState, useEffect } from 'react';
import { useData } from './hooks/useData';
import { Layout } from './components/Layout';
import { Loading } from './components/Loading';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

type Route = '/' | '/portfolio' | '/about' | '/contact';
type Theme = 'dark' | 'light';

// Liste des pages autorisées du site
const validRoutes: Route[] = ['/', '/portfolio', '/about', '/contact'];

function App() {
  // Récupère les données du profil, des photos et des catégories depuis la base
  const { profile, categories, photos, loading } = useData();

  // Gère la page actuellement affichée selon l’ancre dans l’URL
  const [route, setRoute] = useState<Route>('/');

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

  // Écoute les changements de page quand l’URL change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || '/';
      if (validRoutes.includes(hash as Route)) {
        setRoute(hash as Route);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
