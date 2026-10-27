import { useState, useEffect } from 'react';
import { ExternalLink, Aperture, ArrowLeft, ArrowRight } from 'lucide-react';
import { Lightbox } from '../components/Lightbox';
import { navigate as goTo, portfolioPath, toHref } from '../lib/router';
import {
  buildCloudinaryCropSrcSet,
  buildCloudinarySrcSet,
  buildPhotoAlt,
  cropCloudinaryUrl,
  fetchPriority,
  optimizeCloudinaryUrl,
} from '../lib/seo';
import type { Category, Photo } from '../lib/types';

interface PortfolioProps {
  categories: Category[];
  photos: Photo[];
  // Catégorie affichée, déduite de l'adresse (/portfolio/sports/ -> Sports).
  // null = l'écran « Choisissez une catégorie » (/portfolio/).
  category: Category | null;
}

// Largeurs pour les vignettes de la grille en mosaïque (1 à 3 colonnes selon
// l'écran) : pas besoin d'envoyer une photo de 3000px de large pour une
// vignette qui n'en affichera jamais plus de 700-800.
const GRID_WIDTHS = [400, 600, 900, 1200];

// Largeurs pour les photos de couverture des cartes de catégories (1 à 4
// colonnes), recadrées au format de la carte par Cloudinary.
const COVER_WIDTHS = [320, 480, 640, 960];

// Nombre de photos affichées au départ, puis ajoutées à chaque clic sur
// "Charger plus". 18 = multiple de 2 et 3 colonnes (bonne coupe en grille).
const PAGE_SIZE = 18;

export function Portfolio({ categories, photos, category }: PortfolioProps) {
  // Stocke la photo ouverte dans la lumière/agrandissement
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);

  // Nombre de photos actuellement affichées dans la grille (pagination)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Toutes les photos de la galerie, de la plus récente à la plus ancienne
  // (ordre inverse du fichier de contenu). Les photos réservées au About
  // sont exclues de la galerie.
  const sortedPhotos = [...photos]
    .filter((photo) => !photo.about)
    .sort((a, b) => (b.display_order ?? 0) - (a.display_order ?? 0));

  // Catégories dans l'ordre choisi dans content.ts (display_order)
  const sortedCategories = [...categories].sort((a, b) => a.display_order - b.display_order);
  const currentCategory = category;
  const selectedCategory = category?.id ?? null;

  const filteredPhotos = selectedCategory
    ? sortedPhotos.filter((p) => p.category_id === selectedCategory)
    : [];

  // Revient à la première page de résultats à chaque changement de catégorie,
  // pour ne pas garder un "visibleCount" hérité d'un autre filtre.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setLightboxPhoto(null);
  }, [selectedCategory]);

  // Si l’URL contient une photo de cette catégorie (?photo=photo-12), on
  // l'ouvre automatiquement dans la lightbox, et on affiche assez de photos
  // pour qu'elle soit présente dans la grille (liens venant de l'accueil).
  // Lu après l'affichage (et non pendant) : la page générée au build ne
  // contient pas de photo ouverte.
  useEffect(() => {
    const photoId = new URLSearchParams(window.location.search).get('photo');
    if (!photoId) return;

    const index = filteredPhotos.findIndex((p) => p.id === photoId);
    if (index < 0) return;

    setLightboxPhoto(filteredPhotos[index]);
    const requiredCount = Math.ceil((index + 1) / PAGE_SIZE) * PAGE_SIZE;
    setVisibleCount((current) => Math.max(current, requiredCount));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  // Photos réellement affichées à l'écran, et s'il en reste à charger
  const visiblePhotos = filteredPhotos.slice(0, visibleCount);
  const hasMore = filteredPhotos.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((current) => current + PAGE_SIZE);
  };

  // Associe chaque photo à son nom de catégorie (pour enrichir le alt SEO),
  // les photos de content.ts ne portant que le category_id.
  const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));

  // Nombre de photos et photo de couverture de chaque catégorie
  const photosOf = (c: Category) => sortedPhotos.filter((p) => p.category_id === c.id);
  const coverOf = (c: Category) =>
    photos.find((p) => p.id === c.cover_photo_id) ?? photosOf(c)[0] ?? null;

  // Change de catégorie (ou revient à l'écran de choix avec null) : chaque
  // catégorie a sa propre page (/portfolio/sports/), App.tsx affiche la bonne
  // quand l'adresse change.
  const chooseCategory = (target: Category | null, scrollTargetId: string) => {
    goTo(portfolioPath(target?.slug));
    window.requestAnimationFrame(() => {
      document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <>
      {/* Header : sur une page de catégorie, le titre principal (H1) est le
          nom de la catégorie, pour que chaque page ait son propre titre aux
          yeux de Google. */}
      <section className="pt-20 pb-12 px-6 bg-neutral-950">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-4">
            Portfolio
          </p>
          <h1 className="text-4xl md:text-5xl font-light mb-4">
            {currentCategory ? currentCategory.name : 'Mes Créations'}
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            {currentCategory?.description
              ? `${currentCategory.description}.`
              : 'Découvrez un portfolio photographique en Vendée : portraits, événements, sports, mariages et paysages capturés avec une approche naturelle, documentaire et artistique.'}
          </p>
        </div>
      </section>

      {currentCategory === null ? (
        /* Écran de choix : une carte par catégorie, avec sa photo de couverture */
        <section id="portfolio-categories" className="scroll-mt-16 py-12 px-6 bg-neutral-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-light text-center mb-10">Choisissez une catégorie</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedCategories.map((category, index) => {
                const cover = coverOf(category);
                const count = photosOf(category).length;
                return (
                  <a
                    key={category.id}
                    href={toHref(portfolioPath(category.slug))}
                    onClick={(event) => {
                      event.preventDefault();
                      chooseCategory(category, 'portfolio-galerie');
                    }}
                    className="group relative block aspect-[4/3] sm:aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
                  >
                    {cover && (
                      <img
                        src={cropCloudinaryUrl(cover.image_url, 640)}
                        srcSet={buildCloudinaryCropSrcSet(cover.image_url, COVER_WIDTHS)}
                        sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 1024px) calc(50vw - 36px), 300px"
                        alt=""
                        draggable={false}
                        loading="eager"
                        // La première carte est souvent le plus grand élément
                        // visible (mobile) : on la télécharge en priorité.
                        {...fetchPriority(index === 0 ? 'high' : 'auto')}
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
                    {/* "on-dark" : texte posé sur la photo, il garde les couleurs
                        prévues pour un fond sombre dans les deux thèmes. */}
                    <div className="on-dark absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-amber-500 text-xs tracking-widest uppercase mb-2">
                        {count} {count > 1 ? 'photos' : 'photo'}
                      </p>
                      <h3 className="text-2xl font-light text-white mb-1">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-white/80">{category.description}</p>
                      )}
                      <span className="mt-4 inline-flex items-center gap-2 text-sm tracking-wider uppercase text-white group-hover:text-amber-500 transition-colors">
                        Voir les photos
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Category Filter : retour au choix + passage direct d'une catégorie à l'autre */}
          <section
            id="portfolio-galerie"
            className="scroll-mt-16 py-6 px-6 bg-neutral-950 sticky top-16 z-40 border-b border-neutral-800/50"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap items-center justify-center gap-3" role="group" aria-label="Changer de catégorie">
                <button
                  type="button"
                  onClick={() => chooseCategory(null, 'portfolio-categories')}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm tracking-wide border border-[var(--border-color)] text-[var(--text-primary)] hover:border-amber-500 hover:text-amber-500 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  Toutes les catégories
                </button>
                {sortedCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => chooseCategory(category, 'portfolio-galerie')}
                    aria-pressed={selectedCategory === category.id}
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
              {/* Titre invisible à l'écran mais lu par les lecteurs d'écran et
                  Google : il garde un ordre de titres logique (H1 > H2 > H3)
                  entre le titre de la page et les titres des photos. */}
              <h2 className="sr-only">Photos : {currentCategory.name}</h2>
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
                          src={optimizeCloudinaryUrl(photo.image_url, 600)}
                          srcSet={buildCloudinarySrcSet(photo.image_url, GRID_WIDTHS)}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          alt={buildPhotoAlt(photo.title, categoryNameById.get(photo.category_id ?? ''))}
                          draggable={false}
                          loading={index < 6 ? 'eager' : 'lazy'}
                          decoding="async"
                          className="w-full transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/40 group-focus-visible:bg-neutral-950/40 transition-colors duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500">
                          <ExternalLink className="w-8 h-8 text-white" />
                        </div>
                        <div className="on-dark absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-neutral-950 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500">
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
                    {/* Couleurs basées sur les variables du thème : l'ancien
                        "bg-neutral-800 text-neutral-200" donnait un texte gris très
                        pâle sur fond gris très pâle en mode clair (bouton invisible). */}
                    {hasMore && (
                      <button
                        type="button"
                        onClick={handleLoadMore}
                        className="px-8 py-3 rounded-full text-sm tracking-wide uppercase border border-[var(--border-color)] bg-[var(--surface-strong)] text-[var(--text-primary)] hover:bg-amber-500 hover:text-neutral-950 transition-colors"
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
        </>
      )}

      {/* Appel à contact en bas du portfolio : la personne qui vient de
          regarder les photos a un moyen direct de passer à l'étape suivante. */}
      <section className="py-16 px-6 bg-neutral-950 border-t border-neutral-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-4">Un projet en tête ?</h2>
          <p className="text-neutral-400 mb-8">
            Mariage, événement, sport, portrait ou prise de vue par drone : parlons-en.
          </p>
          <a
            href={toHref('/contact')}
            onClick={(event) => {
              event.preventDefault();
              goTo('/contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-3 rounded-full bg-amber-500 px-8 py-4 text-neutral-950 transition-colors hover:bg-amber-400"
          >
            <span className="text-sm tracking-wider uppercase">Me contacter</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
          <p className="mt-4 text-sm text-neutral-500">Réponse sous 24&nbsp;h</p>
        </div>
      </section>

      <Lightbox
        photo={lightboxPhoto}
        photos={filteredPhotos}
        onClose={() => setLightboxPhoto(null)}
        onNavigate={setLightboxPhoto}
      />
    </>
  );
}
