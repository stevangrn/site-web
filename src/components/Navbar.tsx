import { useState } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { isPlainClick, navigate as goTo, toHref, type Route } from '../lib/router';
import type { Profile } from '../lib/types';

interface NavbarProps {
  profile: Profile | null;
  // Page affichée, pour mettre en surbrillance le bon lien
  route: Route;
  onToggleTheme: () => void;
}

export function Navbar({ profile, route, onToggleTheme }: NavbarProps) {
  // État du menu mobile ouvert ou fermé
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Liste des liens affichés dans la barre de navigation
  const navLinks = [
    { name: 'Accueil', path: '/' as Route },
    { name: 'Portfolio', path: '/portfolio' as Route },
    { name: 'À propos', path: '/about' as Route },
    { name: 'Contact', path: '/contact' as Route },
  ];

  // Bouton de thème : les deux versions (soleil + « Clair » en mode sombre,
  // lune + « Sombre » en mode clair) sont dans la page, et c'est le CSS qui
  // affiche la bonne selon l'attribut data-theme de <html> (voir index.css).
  // Ainsi le bouton est juste dès le premier affichage, même avant que le
  // JavaScript ne soit chargé. Le nom lu par les lecteurs d'écran contient le
  // mot affiché (règle d'accessibilité WCAG 2.5.3).
  const themeButtonContent = (withText: boolean) => (
    <>
      <span className="only-dark-theme inline-flex items-center gap-2">
        <Sun className="h-4 w-4" aria-hidden="true" />
        <span className={withText ? '' : 'sr-only'}>
          <span className="sr-only">Passer au thème </span>
          {withText ? 'Clair' : 'clair'}
        </span>
      </span>
      <span className="only-light-theme inline-flex items-center gap-2">
        <Moon className="h-4 w-4" aria-hidden="true" />
        <span className={withText ? '' : 'sr-only'}>
          <span className="sr-only">Passer au thème </span>
          {withText ? 'Sombre' : 'sombre'}
        </span>
      </span>
    </>
  );
  const linkClassName = (active: boolean) =>
    active
      ? 'text-amber-500'
      : 'text-[var(--text-secondary)] hover:text-amber-500';
  const mobileLinkClassName = (active: boolean) =>
    active
      ? 'bg-[var(--surface)] text-amber-500'
      : 'text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-amber-500';

  // Change la page en modifiant la vraie URL (plus de "#")
  const navigate = (path: Route) => {
    goTo(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (path: string) => route === path;

  return (
    // Fond plein : l'ancienne classe "bg-[var(--bg-primary)]/95" n'était pas
    // générée par Tailwind (pas d'opacité possible sur une variable CSS), la
    // barre était donc transparente et laissait voir la page en dessous.
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-3">
        <a
          href="/"
          onClick={(event) => {
            // Ctrl/Cmd + clic ou clic molette : nouvel onglet, comme un lien normal
            if (!isPlainClick(event)) return;
            event.preventDefault();
            navigate('/');
          }}
          className="flex items-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          {/* Monogramme SG de ton logo (public/logo-sg.png). L'image fait 3 fois
              la taille affichée, pour rester nette sur les écrans haute
              définition. */}
          <img
            src="/logo-sg.png"
            width={45}
            height={36}
            alt={`${profile?.name ?? 'Stevan Garon'} — accueil`}
            className="h-9 w-auto"
            draggable={false}
          />
        </a>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.path}
              href={toHref(link.path)}
              onClick={(event) => {
                // Ctrl/Cmd + clic ou clic molette : nouvel onglet, comme un lien normal
                if (!isPlainClick(event)) return;
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
          >
            {themeButtonContent(true)}
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-full border border-[var(--border-color)] bg-[var(--surface)] p-2 text-[var(--text-secondary)] transition-colors hover:text-amber-500 touch-manipulation active:scale-[0.96]"
          >
            {themeButtonContent(false)}
          </button>

          <button
            type="button"
            className="text-[var(--text-primary)] p-2 touch-manipulation active:scale-[0.96]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fermer le menu mobile' : 'Ouvrir le menu mobile'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden border-t border-[var(--border-color)] bg-[var(--bg-primary)] transition-all duration-300 ease-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
      >
        <div className="flex flex-col">
          {navLinks.map((link) => (
            <a
              key={link.path}
              href={toHref(link.path)}
              onClick={(event) => {
                // Ctrl/Cmd + clic ou clic molette : nouvel onglet, comme un lien normal
                if (!isPlainClick(event)) return;
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
