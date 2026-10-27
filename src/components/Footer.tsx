import { Camera, Instagram, Facebook, Mail } from 'lucide-react';
import { navigate as goTo, toHref, type Route } from '../lib/router';
import type { Profile } from '../lib/supabase';

interface FooterProps {
  profile: Profile | null;
  // Rouvre le bandeau cookies pour changer son choix à tout moment
  // (la CNIL demande que retirer son accord soit aussi simple que le donner).
  onManageConsent: () => void;
}

// Construit l'adresse du profil Instagram à partir du pseudo écrit dans
// content.ts, avec ou sans "@" (instagram.com/@pseudo n'est pas le format
// officiel : le bon format est https://www.instagram.com/pseudo/).
function instagramUrl(handle: string): string {
  return `https://www.instagram.com/${handle.trim().replace(/^@/, '')}/`;
}

export function Footer({ profile, onManageConsent }: FooterProps) {
  // Liens du footer vers les pages du site
  const navLinks = [
    { name: 'Accueil', path: '/' as Route },
    { name: 'Portfolio', path: '/portfolio' as Route },
    { name: 'À Propos', path: '/about' as Route },
    { name: 'Contact', path: '/contact' as Route },
  ];

  const email = profile?.email || 'stevan.garon@gmail.com';

  // Permet de changer de page en cliquant sur un lien du footer
  const navigate = (path: Route) => {
    goTo(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ouvre la politique de confidentialité directement à sa section
  // (ancre #confidentialite de la page Mentions légales).
  const openPrivacyPolicy = () => {
    goTo('/mentions-legales#confidentialite');
    // Si la page est déjà affichée, on fait défiler tout de suite ; sinon,
    // c'est la page Mentions légales qui le fait à son ouverture.
    window.requestAnimationFrame(() => {
      document.getElementById('confidentialite')?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  return (
    <footer className="py-12 px-6 bg-[var(--bg-primary)] border-t border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <Camera className="w-5 h-5 text-amber-500" aria-hidden="true" />
            <span className="text-lg font-light tracking-wider text-[var(--text-primary)]">
              {profile?.name?.split(' ')[0] || 'Portfolio'}
            </span>
          </div>

          <div className="flex items-center justify-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={toHref(link.path)}
                onClick={(event) => {
                  event.preventDefault();
                  navigate(link.path);
                }}
                className="text-[var(--text-muted)] hover:text-amber-500 text-sm transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-end">
            {profile?.social_facebook && (
              <a
                href={profile.social_facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center hover:bg-amber-500 hover:text-neutral-950 text-[var(--text-muted)] transition-all"
                aria-label="Voir Facebook"
              >
                <Facebook className="w-5 h-5" aria-hidden="true" />
              </a>
            )}
            <a
              href={`mailto:${email}`}
              className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center hover:bg-amber-500 hover:text-neutral-950 text-[var(--text-muted)] transition-all"
              aria-label="Envoyer un email"
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
            </a>
            {profile?.social_instagram && (
              <a
                href={instagramUrl(profile.social_instagram)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center hover:bg-amber-500 hover:text-neutral-950 text-[var(--text-muted)] transition-all"
                aria-label="Voir Instagram"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[var(--border-color)] text-center space-y-2">
          <p className="text-[var(--text-muted)] text-sm">
            © {new Date().getFullYear()} {profile?.name || 'Photographe'}. Tous droits réservés.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <a
              href={toHref('/mentions-legales')}
              onClick={(event) => {
                event.preventDefault();
                navigate('/mentions-legales');
              }}
              className="text-[var(--text-muted)] hover:text-amber-500 transition-colors"
            >
              Mentions légales
            </a>
            <a
              href={toHref('/mentions-legales#confidentialite')}
              onClick={(event) => {
                event.preventDefault();
                openPrivacyPolicy();
              }}
              className="text-[var(--text-muted)] hover:text-amber-500 transition-colors"
            >
              Politique de confidentialité
            </a>
            <button
              type="button"
              onClick={onManageConsent}
              className="text-[var(--text-muted)] hover:text-amber-500 transition-colors"
            >
              Gérer les cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
