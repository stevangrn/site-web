import { useState, useEffect } from 'react';
import { ExternalLink, Aperture } from 'lucide-react';
import { Lightbox } from '../components/Lightbox';
import type { Category, Photo } from '../lib/supabase';

interface PortfolioProps {
  categories: Category[];
  photos: Photo[];
}

export function Portfolio({ categories, photos }: PortfolioProps) {
  // Filtre les photos selon la catégorie choisie
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Stocke la photo ouverte dans la lumière/agrandissement
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);

  // Si l’URL contient une photo, on l’ouvre automatiquement dans la lightbox
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const photoId = params.get('photo');
    if (photoId) {
      const photo = photos.find((p) => p.id === photoId);
      if (photo) setLightboxPhoto(photo);
    }
  }, [photos]);

  // Affiche toutes les photos ou seulement celles d’une catégorie,
  // en inversant l’ordre d’affichage par rapport au fichier de contenu.
  // Les photos réservées au About sont exclues de la galerie.
  const sortedPhotos = [...photos]
    .filter((photo) => !photo.about)
    .sort((a, b) => (b.display_order ?? 0) - (a.display_order ?? 0));

  const filteredPhotos = selectedCategory
    ? sortedPhotos.filter((p) => p.category_id === selectedCategory)
    : sortedPhotos;

  return (
    <>
      {/* Header */}
      <section className="pt-20 pb-12 px-6 bg-neutral-950">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-4">
            Portfolio
          </p>
          <h1 className="text-4xl md:text-5xl font-light mb-4">Mes Créations</h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Découvrez une sélection de mes travaux photographiques, des portraits
            aux paysages en passant par les événements sur la terre comme dans les aires.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-6 bg-neutral-950 sticky top-16 z-40 border-b border-neutral-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2 rounded-full text-sm tracking-wide transition-all ${
                selectedCategory === null
                  ? 'bg-amber-500 text-neutral-950'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              Tout
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2 rounded-full text-sm tracking-wide transition-all ${
                  selectedCategory === category.id
                    ? 'bg-amber-500 text-neutral-950'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 px-6 bg-neutral-900 min-h-[60vh]">
        <div className="max-w-7xl mx-auto">
          {filteredPhotos.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => setLightboxPhoto(photo)}
                  className="break-inside-avoid group relative rounded-xl overflow-hidden cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    className="w-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/40 transition-colors duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <ExternalLink className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-neutral-950 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <p className="text-amber-500 text-xs tracking-widest uppercase mb-1">
                      {photo.categories?.name || 'Photographie'}
                    </p>
                    <h3 className="text-lg font-light text-white">{photo.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-neutral-500">
              <Aperture className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucune photo dans cette catégorie</p>
            </div>
          )}
        </div>
      </section>

      <Lightbox photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
    </>
  );
}
