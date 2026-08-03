import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { buildPhotoAlt, optimizeCloudinaryUrl } from '../lib/seo';
import type { Photo } from '../lib/supabase';

interface LightboxProps {
  photo: Photo | null;
  onClose: () => void;
}

// Sélecteur standard des éléments focusables, pour le piège de focus.
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function Lightbox({ photo, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Élément qui avait le focus juste avant l'ouverture (la vignette cliquée),
  // pour lui rendre le focus à la fermeture au lieu de le perdre.
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Ouverture/fermeture : focus, verrouillage du scroll de fond, restauration du focus.
  useEffect(() => {
    if (!photo) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement | null;

    // On bloque le scroll de la page derrière la lightbox.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // On envoie le focus sur le bouton de fermeture dès l'ouverture, pour
    // qu'un utilisateur clavier arrive directement dans la boîte de dialogue.
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      // On rend le focus à la vignette d'origine, sinon il retombe sur <body>
      // et l'utilisateur clavier perd sa position dans la page.
      previouslyFocusedElement.current?.focus();
    };
  }, [photo]);

  // Fermeture avec Échap + piège de focus (Tab reste à l'intérieur de la boîte).
  useEffect(() => {
    if (!photo) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, onClose]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-neutral-950/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lightbox-title"
        className="contents"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Fermer l'aperçu de la photo"
          className="absolute top-6 right-6 text-white hover:text-amber-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full p-1"
        >
          <X className="w-8 h-8" />
        </button>
        <div className="max-w-5xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
          <img
            src={optimizeCloudinaryUrl(photo.image_url)}
            alt={buildPhotoAlt(photo.title, photo.categories?.name)}
            draggable={false}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
          />
          <div className="text-center mt-4">
            <p className="text-amber-500 text-sm tracking-widest uppercase mb-1">
              {photo.categories?.name || 'Photographie'}
            </p>
            <h3 id="lightbox-title" className="text-xl font-light text-white">
              {photo.title}
            </h3>
            {photo.description && (
              <p className="text-neutral-400 text-sm mt-2">{photo.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
