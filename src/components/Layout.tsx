import { useEffect, type ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import type { Profile } from '../lib/supabase';

interface LayoutProps {
  profile: Profile | null;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  children: ReactNode;
}

export function Layout({ profile, theme, onToggleTheme, children }: LayoutProps) {
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
      <Navbar profile={profile} theme={theme} onToggleTheme={onToggleTheme} />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer profile={profile} />
    </div>
  );
}