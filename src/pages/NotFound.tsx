import { ArrowRight } from 'lucide-react';
import { navigate as goTo, toHref } from '../lib/router';

// Page affichée quand l'adresse ne correspond à aucune page du site
// (ex: un ancien lien ou une faute de frappe). Avant, ces adresses
// affichaient l'accueil, ce qui pouvait laisser croire à un doublon de la
// page d'accueil. Elle est exclue de Google (balise robots "noindex",
// voir src/lib/seo.ts).
export function NotFound() {
  const navigate = (path: string) => {
    goTo(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 py-20 bg-neutral-950">
      <div className="max-w-xl text-center">
        <p className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-4">Erreur 404</p>
        <h1 className="text-4xl md:text-5xl font-light mb-4">Page introuvable</h1>
        <p className="text-neutral-400 mb-10">
          Cette page n'existe pas ou a été déplacée. Vous pouvez revenir à l'accueil ou parcourir
          le portfolio.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/"
            onClick={(event) => {
              event.preventDefault();
              navigate('/');
            }}
            className="inline-flex items-center gap-3 rounded-full bg-amber-500 px-8 py-4 text-neutral-950 transition-colors hover:bg-amber-400"
          >
            <span className="text-sm tracking-wider uppercase">Retour à l'accueil</span>
          </a>
          <a
            href={toHref('/portfolio')}
            onClick={(event) => {
              event.preventDefault();
              navigate('/portfolio');
            }}
            className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors"
          >
            <span className="text-sm tracking-wider uppercase">Voir le portfolio</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
