import { useState, useEffect } from 'react';
import { ExternalLink, Aperture } from 'lucide-react';
import { Lightbox } from '../components/Lightbox';
import { buildPhotoAlt, optimizeCloudinaryUrl } from '../lib/seo';
import type { Category, Photo } from '../lib/supabase';

interface PortfolioProps {
  categories: Category[];
  photos: Photo[];
}

// Nombre de photos affichées au départ, puis ajoutées à chaque clic sur
// "Charger plus". 18 = multiple de 2 et 3 colonnes (bonne coupe en grille).
const PAGE_SIZE = 18;

export function Portfolio({ categories, photos }: PortfolioProps) {
  // Filtre les photos selon la catégorie choisie
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Stocke la photo ouverte dans la lumière/agrandissement
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);

  // Nombre de photos actuellement affichées dans la grille (pagination)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Affiche toutes les photos ou seulement celles d’une catégorie,
  // en inversant l’ordre d’affichage par rapport au fichier de contenu.
  // Les photos réservées au About sont exclues de la galerie.
  const sortedPhotos = [...photos]
    .filter((photo) => !photo.about)
    .sort((a, b) => (b.display_order ?? 0) - (a.display_order ?? 0));

  const filteredPhotos = selectedCategory
    ? sortedPhotos.filter((p) => p.category_id === selectedCategory)
    : sortedPhotos;

  // Revient à la première page de résultats à chaque changement de catégorie,
  // pour ne pas garder un "visibleCount" hérité d'un autre filtre.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory]);

  // Si l’URL contient une photo, on l’ouvre automatiquement dans la lightbox,
  // et on affiche assez de photos pour qu'elle soit présente dans la grille
  // (utile pour les liens directs venant de la page d'accueil).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const photoId = params.get('photo');
    if (!photoId) return;

    const photo = photos.find((p) => p.id === photoId);
    if (!photo) return;

    setLightboxPhoto(photo);

    const index = sortedPhotos.findIndex((p) => p.id === photoId);
    if (index >= 0) {
      const requiredCount = Math.ceil((index + 1) / PAGE_SIZE) * PAGE_SIZE;
      setVisibleCount((current) => Math.max(current, requiredCount));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos]);

  // Photos réellement affichées à l'écran, et s'il en reste à charger
  const visiblePhotos = filteredPhotos.slice(0, visibleCount);
  const hasMore = filteredPhotos.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((current) => current + PAGE_SIZE);
  };

  // Associe chaque photo à son nom de catégorie (pour enrichir le alt SEO),
  // les photos de content.ts ne portant que le category_id.
  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));

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
          {visiblePhotos.length > 0 ? (
            <>
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {visiblePhotos.map((photo, index) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setLightboxPhoto(photo)}
                    aria-label={`Agrandir la photo : ${photo.title}`}
                    className="block w-full text-left break-inside-avoid group relative rounded-xl overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
                    style={{ animationDelay: `${(index % PAGE_SIZE) * 50}ms` }}
                  >
                    <img
                      src={optimizeCloudinaryUrl(photo.image_url)}
                      alt={buildPhotoAlt(photo.title, categoryNameById.get(photo.category_id ?? ''))}
                      draggable={false}
                      loading={index < 6 ? 'eager' : 'lazy'}
                      className="w-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/40 group-focus-visible:bg-neutral-950/40 transition-colors duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500">
                      <ExternalLink className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-neutral-950 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500">
                      <p className="text-amber-500 text-xs tracking-widest uppercase mb-1">
                        {photo.categories?.name || 'Photographie'}
                      </p>
                      <h3 className="text-lg font-light text-white">{photo.title}</h3>
                    </div>
                  </button>
                ))}
              </div>

              {/* Pagination : affiche le compteur et un bouton pour charger la suite */}
              <div className="flex flex-col items-center gap-4 mt-12">
                <p className="text-sm text-neutral-500">
                  {visiblePhotos.length} / {filteredPhotos.length} photos affichées
                </p>
                {hasMore && (
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    className="px-8 py-3 rounded-full text-sm tracking-wide uppercase bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-all"
                  >
                    Charger plus
                  </button>
                )}
              </div>
            </>
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
