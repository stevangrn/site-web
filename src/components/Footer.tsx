import { Camera, Instagram, Facebook, Mail } from 'lucide-react';
import { navigate as goTo, type Route } from '../lib/router';
import type { Profile } from '../lib/supabase';

interface FooterProps {
  profile: Profile | null;
}

export function Footer({ profile }: FooterProps) {
  // Liens du footer vers les pages du site
  const navLinks = [
    { name: 'Accueil', path: '/' as Route },
    { name: 'Portfolio', path: '/portfolio' as Route },
    { name: 'À Propos', path: '/about' as Route },
    { name: 'Contact', path: '/contact' as Route },
  ];

  // Permet de changer de page en cliquant sur un lien du footer
  const navigate = (path: Route) => {
    goTo(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 px-6 bg-[var(--bg-primary)] border-t border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <Camera className="w-5 h-5 text-amber-500" />
            <span className="text-lg font-light tracking-wider text-[var(--text-primary)]">
              {profile?.name?.split(' ')[0] || 'Portfolio'}
            </span>
          </div>

          <div className="flex items-center justify-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="text-[var(--text-muted)] hover:text-amber-500 text-sm transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-end">
            {profile?.social_facebook && (
              <a
                href={profile.social_facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center hover:bg-amber-500 hover:text-neutral-950 text-[var(--text-muted)] transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
            )}
            <a
              href={`mailto:${profile?.email || 'contact@example.com'}`}
              className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center hover:bg-amber-500 hover:text-neutral-950 text-[var(--text-muted)] transition-all"
              aria-label="Envoyer un email"
            >
              <Mail className="w-5 h-5" />
            </a>
            {profile?.social_instagram && (
              <a
                href={`https://instagram.com/${profile.social_instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center hover:bg-amber-500 hover:text-neutral-950 text-[var(--text-muted)] transition-all"
                aria-label="Voir Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[var(--border-color)] text-center space-y-2">
          <p className="text-[var(--text-muted)] text-sm">
            © {new Date().getFullYear()} {profile?.name || 'Photographe'}. Tous droits réservés.
          </p>
          <button
            onClick={() => navigate('/mentions-legales')}
            className="text-[var(--text-muted)] hover:text-amber-500 text-xs transition-colors"
          >
            Mentions légales
          </button>
        </div>
      </div>
    </footer>
  );
}