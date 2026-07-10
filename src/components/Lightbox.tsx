import { X } from 'lucide-react';
import type { Photo } from '../lib/supabase';

interface LightboxProps {
  photo: Photo | null;
  onClose: () => void;
}

export function Lightbox({ photo, onClose }: LightboxProps) {
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-neutral-950/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-6 text-white hover:text-amber-500 transition-colors"
        onClick={onClose}
      >
        <X className="w-8 h-8" />
      </button>
      <div className="max-w-5xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <img
          src={photo.image_url}
          alt={photo.title}
          draggable={false}
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
        />
        <div className="text-center mt-4">
          <p className="text-amber-500 text-sm tracking-widest uppercase mb-1">
            {photo.categories?.name || 'Photographie'}
          </p>
          <h3 className="text-xl font-light text-white">{photo.title}</h3>
          {photo.description && (
            <p className="text-neutral-400 text-sm mt-2">{photo.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}