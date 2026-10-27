import { useEffect, type ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import type { Route } from '../lib/router';
import type { Profile } from '../lib/types';

interface LayoutProps {
  profile: Profile | null;
  // Page affichée (pour mettre en surbrillance le bon lien du menu)
  route: Route;
  onToggleTheme: () => void;
  onManageConsent: () => void;
  children: ReactNode;
}

export function Layout({ profile, route, onToggleTheme, onManageConsent, children }: LayoutProps) {
  // Protection anti-copie des images sur l'ensemble du site :
  // bloque le clic droit sur les images, le glisser-déposer,
  // et le raccourci Ctrl/Cmd+S. Rappel : rien n'empêche une
  // capture d'écran, mais cela dissuade la majorité des visiteurs.
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    // Cette structure entoure toutes les pages du site
    // Elle affiche toujours la barre de navigation, le contenu et le footer
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col transition-colors duration-300">
      {/* Lien d'évitement : invisible tant qu'il n'a pas le focus, il permet
          aux utilisateurs de clavier et de lecteur d'écran de sauter
          directement au contenu sans devoir traverser toute la navigation
          à chaque page. Norme d'accessibilité de base (WCAG 2.4.1). */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-amber-500 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-neutral-950"
      >
        Aller au contenu principal
      </a>
      <Navbar profile={profile} route={route} onToggleTheme={onToggleTheme} />
      <main id="main-content" className="flex-1 pt-16">
        {children}
      </main>
      <Footer profile={profile} onManageConsent={onManageConsent} />
    </div>
  );
}