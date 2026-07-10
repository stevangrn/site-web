import type { ReactNode } from 'react';
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
