import { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { buildPhotoAlt, optimizeCloudinaryUrl } from '../lib/seo';
import type { Photo } from '../lib/supabase';

interface LightboxProps {
  photo: Photo | null;
  photos: Photo[];
  onClose: () => void;
  onNavigate: (photo: Photo) => void;
}

// Sélecteur standard des éléments focusables, pour le piège de focus.
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function Lightbox({ photo, photos, onClose, onNavigate }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Élément qui avait le focus juste avant l'ouverture (la vignette cliquée),
  // pour lui rendre le focus à la fermeture au lieu de le perdre.
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const isOpen = photo !== null;

  // Ouverture/fermeture : focus, verrouillage du scroll de fond, restauration
  // du focus. Ne dépend que de isOpen (et non de photo) pour ne pas se
  // redéclencher à chaque navigation précédent/suivant sur la même ouverture.
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement | null;

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
  }, [isOpen]);

  // Position de la photo actuelle dans la liste, pour savoir si on peut
  // aller précédent/suivant et pour l'indicateur "3 / 42".
  const currentIndex = photo ? photos.findIndex((p) => p.id === photo.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < photos.length - 1;

  const goToPrev = () => {
    if (hasPrev) onNavigate(photos[currentIndex - 1]);
  };
  const goToNext = () => {
    if (hasNext) onNavigate(photos[currentIndex + 1]);
  };

  // Raccourcis clavier : Échap pour fermer, flèches pour naviguer, Tab piégé
  // dans la boîte de dialogue tant qu'elle est ouverte.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'ArrowLeft' && hasPrev) {
        event.preventDefault();
        goToPrev();
        return;
      }

      if (event.key === 'ArrowRight' && hasNext) {
        event.preventDefault();
        goToNext();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, photo, hasPrev, hasNext]);

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
          className="absolute top-6 right-6 text-white hover:text-amber-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full p-1 z-10"
        >
          <X className="w-8 h-8" />
        </button>

        {hasPrev && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            aria-label="Photo précédente"
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white hover:text-amber-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full p-2 z-10"
          >
            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
          </button>
        )}

        {hasNext && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Photo suivante"
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white hover:text-amber-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full p-2 z-10"
          >
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
          </button>
        )}

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
            {currentIndex >= 0 && photos.length > 1 && (
              <p className="text-neutral-500 text-xs mt-3">
                {currentIndex + 1} / {photos.length}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
