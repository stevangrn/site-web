import { useState, useEffect } from 'react';
import { Menu, X, Camera, Moon, Sun } from 'lucide-react';
import { navigate as goTo, getCurrentRoute, subscribeToRoute, type Route } from '../lib/router';
import { useTranslation } from '../lib/i18n';
import type { Profile } from '../lib/supabase';

interface NavbarProps {
  profile: Profile | null;
  theme: 'dark' | 'light';
  locale: 'fr' | 'en';
  onToggleTheme: () => void;
  onToggleLocale: () => void;
}

export function Navbar({ profile, theme, locale, onToggleTheme, onToggleLocale }: NavbarProps) {
  // État du menu mobile ouvert ou fermé
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Page active pour mettre en surbrillance le bon lien
  const [currentRoute, setCurrentRoute] = useState<Route>(() => getCurrentRoute());

  const t = useTranslation();

  // Liste des liens affichés dans la barre de navigation
  const navLinks = [
    { name: t('nav.home'), path: '/' as Route },
    { name: t('nav.portfolio'), path: '/portfolio' as Route },
    { name: t('nav.about'), path: '/about' as Route },
    { name: t('nav.contact'), path: '/contact' as Route },
  ];
  const themeLabel = theme === 'dark' ? t('theme.light') : t('theme.dark');
  const localeLabel = locale === 'fr' ? t('locale.fr') : t('locale.en');
  const linkClassName = (active: boolean) =>
    active
      ? 'text-amber-500'
      : 'text-[var(--text-secondary)] hover:text-amber-500';
  const mobileLinkClassName = (active: boolean) =>
    active
      ? 'bg-[var(--surface)] text-amber-500'
      : 'text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-amber-500';

  // Met à jour la page active quand l’URL change
  useEffect(() => {
    return subscribeToRoute(setCurrentRoute);
  }, []);

  // Change la page en modifiant la vraie URL (plus de "#")
  const navigate = (path: Route) => {
    goTo(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (path: string) => currentRoute === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-3">
        <a
          href="/"
          onClick={(event) => {
            event.preventDefault();
            navigate('/');
          }}
          className="flex items-center gap-2 text-[var(--text-primary)] font-light tracking-wider"
        >
          <Camera className="w-5 h-5 text-amber-500" />
          <span className="text-lg">{profile?.name?.split(' ')[0] || 'Portfolio'}</span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              onClick={(event) => {
                event.preventDefault();
                navigate(link.path);
              }}
              className={`text-sm tracking-wide transition-colors ${linkClassName(isActive(link.path))}`}
            >
              {link.name}
            </a>
          ))}

          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-amber-500"
            aria-label="Basculer le thème"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{themeLabel}</span>
          </button>
          <button
            type="button"
            onClick={onToggleLocale}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-amber-500"
            aria-label="Basculer la langue"
          >
            <span>{localeLabel}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-full border border-[var(--border-color)] bg-[var(--surface)] p-2 text-[var(--text-secondary)] transition-colors hover:text-amber-500 touch-manipulation active:scale-[0.96]"
            aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={onToggleLocale}
            className="rounded-full border border-[var(--border-color)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-amber-500 touch-manipulation active:scale-[0.96]"
            aria-label={t('locale.' + (locale === 'fr' ? 'en' : 'fr'))}
          >
            {locale === 'fr' ? 'FR' : 'EN'}
          </button>

          <button
            type="button"
            className="text-[var(--text-primary)] p-2 touch-manipulation active:scale-[0.96]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden border-t border-[var(--border-color)] bg-[var(--bg-primary)] transition-all duration-300 ease-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
      >
        <div className="flex flex-col">
          {navLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              onClick={(event) => {
                event.preventDefault();
                navigate(link.path);
              }}
              className={`block w-full text-left px-6 py-4 transition-colors ${mobileLinkClassName(isActive(link.path))}`}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
