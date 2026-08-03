import { ArrowRight, ChevronDown } from 'lucide-react';
import { navigate as goTo } from '../lib/router';
import { buildPhotoAlt, optimizeCloudinaryUrl } from '../lib/seo';
import type { Profile, Photo } from '../lib/supabase';

interface HomeProps {
  profile: Profile | null;
  featuredPhotos: Photo[];
  heroPhoto: Photo | null;
  aboutPreviewPhoto: Photo | null;
}

export function Home({ profile, featuredPhotos, heroPhoto, aboutPreviewPhoto }: HomeProps) {
  // Image principale affichée en arrière-plan sur la page d’accueil
  const heroImage =
    heroPhoto?.image_url ||
    featuredPhotos[0]?.image_url ||
    'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1920';

  // Fait défiler la page jusqu’à la section des photos mises en avant
  const scrollToPortfolio = () => {
    const element = document.getElementById('featured');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Ouvre une page du site en modifiant la vraie URL (plus de "#")
  const navigate = (path: string) => {
    goTo(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[100svh] flex items-center justify-center relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={optimizeCloudinaryUrl(heroImage)}
            alt={
              heroPhoto
                ? buildPhotoAlt(heroPhoto.title)
                : 'Stevan Garon, photographe et télépilote de drone en Vendée'
            }
            draggable={false}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-neutral-950/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/50 z-10" />

        {/* Decorative Frame */}
        <div className="absolute top-8 left-8 w-32 h-32 border-l-2 border-t-2 border-amber-500/30 z-20" />
        <div className="absolute bottom-8 right-8 w-32 h-32 border-r-2 border-b-2 border-amber-500/30 z-20" />

        {/* Content */}
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
          <p className="text-sm md:text-base tracking-[0.3em] uppercase mb-6 animate-fade-in text-white">
            {profile?.title || 'Photographe et télépilote de drone'}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight mb-8 animate-fade-in-up text-white">
            {profile?.name || 'Stevan Garon'}
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-8 animate-fade-in animation-delay-200" />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
            <button
              onClick={() => navigate('/portfolio')}
              className="group inline-flex items-center gap-3 bg-amber-500/10 backdrop-blur-sm border border-amber-500/50 px-8 py-4 rounded-full text-white hover:bg-amber-500 hover:text-neutral-950 transition-all duration-500 touch-manipulation active:scale-[0.98]"
            >
              <span className="text-sm tracking-wider uppercase">Voir Portfolio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="inline-flex items-center gap-3 border border-white/20 px-8 py-4 rounded-full text-white hover:border-amber-500 hover:text-amber-500 transition-all duration-500 touch-manipulation active:scale-[0.98]"
            >
              <span className="text-sm tracking-wider uppercase">Me Contacter</span>
            </button>
          </div>
        </div>

        <button
          onClick={scrollToPortfolio}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white hover:text-amber-500 transition-colors animate-bounce"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </section>

      {/* Featured Photos */}
      {featuredPhotos.length > 0 && (
        <section id="featured" className="py-20 px-6 bg-neutral-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-14">
              <p className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-3">
                Sélection
              </p>
              <h2 className="text-3xl md:text-4xl font-light">Travaux en Vedette</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredPhotos.slice(0, 6).map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => navigate(`/portfolio?photo=${photo.id}`)}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer text-left border border-white/10 bg-neutral-900/60 shadow-sm"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img
                    src={optimizeCloudinaryUrl(photo.image_url)}
                    alt={buildPhotoAlt(photo.title, photo.categories?.name)}
                    draggable={false}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-amber-500 text-xs tracking-widest uppercase mb-1">
                      {photo.categories?.name || 'Photographie'}
                    </p>
                    <h3 className="text-xl font-light text-white">{photo.title}</h3>
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center mt-12 md:mt-14">
              <button
                onClick={() => navigate('/portfolio')}
                className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors"
              >
                <span className="text-sm tracking-wider uppercase">Voir tout le portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* About Preview */}
      <section className="py-20 px-6 bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-sm">
                {aboutPreviewPhoto ? (
                  <img
                    src={optimizeCloudinaryUrl(aboutPreviewPhoto.image_url)}
                    alt="Stevan Garon, photographe et télépilote de drone en Vendée"
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                ) : featuredPhotos[1] ? (
                  <img
                    src={optimizeCloudinaryUrl(featuredPhotos[1].image_url)}
                    alt="Stevan Garon, photographe et télépilote de drone en Vendée"
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                    <span className="text-neutral-600 text-lg">Photo</span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-amber-500/10 rounded-2xl -z-10" />
            </div>

            <div className="lg:pl-8 order-1 lg:order-2">
              <p className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-4">
                À Propos
              </p>
              <h2 className="text-3xl md:text-4xl font-light mb-6">Mon Histoire</h2>
              <div className="space-y-6 text-neutral-400 leading-relaxed">
                <p>
                  Je m'appelle Stevan Garon. Passionné de photo depuis l'enfance, j'ai commencé par capturer le monde pour mes proches avant de décider de lancer officiellement mon activité de photographe indépendant.
                </p>
                <p>
                  Mon terrain de jeu favori ? Le sport, où je prends un plaisir fou à figer le mouvement et l'adrénaline. J'immortalise également l'énergie de vos événements (concerts, théâtre), la magie de vos mariages, ainsi que vos portraits.
                </p>
                <p>
                  Mon objectif : mettre en valeur chaque instant avec authenticité, technique et sensibilité.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 md:gap-6 mt-10">
                <div className="text-center">
                  <p className="text-4xl font-light text-amber-500">3+</p>
                  <p className="text-sm text-neutral-500 mt-1">Années</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-light text-amber-500">100%</p>
                  <p className="text-sm text-neutral-500 mt-1">Retours positifs</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-light text-amber-500">100%</p>
                  <p className="text-sm text-neutral-500 mt-1">Passion</p>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => navigate('/about')}
                  className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors"
                >
                  <span className="text-sm tracking-wider uppercase">En savoir plus</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
