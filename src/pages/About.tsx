import { ArrowRight, Camera } from 'lucide-react';
import { navigate as goTo } from '../lib/router';
import { buildCloudinaryCropSrcSet, cropCloudinaryUrl, fetchPriority } from '../lib/seo';
import type { Profile, Photo } from '../lib/types';

// Largeurs du portrait (format 3/4), recadré par Cloudinary : la photo
// d'origine pesait 660 Ko, la version adaptée à l'écran 5 à 10 fois moins.
const ABOUT_WIDTHS = [400, 600, 800, 1000];

interface AboutProps {
  profile: Profile | null;
  aboutPhoto: Photo | null;
}

export function About({ aboutPhoto }: AboutProps) {
  return (
    // Cette page raconte qui est le photographe et ce qu’il propose
    <>
      {/* Header */}
      <section className="pt-20 pb-12 px-6 bg-neutral-950">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-4">
            À propos
          </p>
          <h1 className="text-4xl md:text-5xl font-light mb-4">Mon histoire</h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Découvrez mon parcours et ma passion pour la photographie.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                {aboutPhoto ? (
                  <img
                    src={cropCloudinaryUrl(aboutPhoto.image_url, 800, '3:4')}
                    srcSet={buildCloudinaryCropSrcSet(aboutPhoto.image_url, ABOUT_WIDTHS, '3:4')}
                    sizes="(max-width: 1024px) calc(100vw - 48px), 600px"
                    alt="Stevan Garon, photographe et télépilote de drone en Vendée"
                    draggable={false}
                    loading="eager"
                    decoding="async"
                    {...fetchPriority('high')}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                    <Camera className="w-16 h-16 text-neutral-600" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-amber-500/10 rounded-2xl -z-10" />
              <div className="absolute -top-6 -left-6 w-32 h-32 border-l-2 border-t-2 border-amber-500/30 rounded-tl-2xl" />
            </div>

            {/* Text Content */}
            <div className="lg:pl-8">
              <div className="space-y-6 text-neutral-400 leading-relaxed">
                <p className="italic text-neutral-300">
                  Je m'appelle Stevan Garon et je capture le mouvement, l'émotion et l'énergie à travers mon objectif. La photographie m'accompagne depuis l'enfance ; depuis trois ans, elle est devenue bien plus qu'une passion : une véritable vocation.
                </p>
                <p>
                  Au départ, tout a commencé avec un petit appareil et une envie simple : montrer ma vision du monde aux autres. Encouragé par mes proches à partager mon regard, j'ai sauté le pas. Aujourd'hui, j'accompagne mes clients pour immortaliser leurs plus beaux moments.
                </p>
                <p>
                  Spécialisé dans la photographie de sport, c'est sur le terrain, dans l'action et la vitesse, que je prends le plus de plaisir. Mon univers s'étend également à l'événementiel (concerts, théâtre) et aux mariages, sans oublier quelques séances de portraits. Mon approche allie une technique maîtrisée à une sensibilité artistique pour créer des images authentiques, vibrantes, et riches en émotions.
                </p>
                <p className="italic text-neutral-300">
                  "Pour une fois les photos nous mettent en valeur... Merci merci, c'est trop bien de les avoir !" – Jeanne, une cliente ravie.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 py-8 border-t border-b border-neutral-800">
                <div className="text-center">
                  <p className="text-5xl font-light text-amber-500">3+</p>
                  <p className="text-sm text-neutral-500 mt-2">Années d'expérience</p>
                </div>
                <div className="text-center">
                  <p className="text-5xl font-light text-amber-500">100%</p>
                  <p className="text-sm text-neutral-500 mt-2">Retours positifs</p>
                </div>
                <div className="text-center">
                  <p className="text-5xl font-light text-amber-500">100%</p>
                  <p className="text-sm text-neutral-500 mt-2">Passion</p>
                </div>
              </div>

              {/* Services */}
              <div className="mt-12">
                {/* text-theme-primary au lieu de text-white : en mode clair, ce
                    titre blanc sur fond clair était invisible. H2 (et H3 pour
                    les cartes) au lieu de H3/H4 : ordre de titres logique après
                    le H1 de la page. L'apparence ne change pas. */}
                <h2 className="text-2xl font-light text-theme-primary mb-6">Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'Portraits', desc: 'Individuels, familles, professionnels' },
                    { title: 'Paysages', desc: 'Nature, urbain, architecture' },
                    { title: 'Événements', desc: 'Mariages, célébrations, corporate' },
                    { title: 'Sports', desc: 'Action, intensité, performance' },
                    {
                      title: 'Drone',
                      desc: 'Prises de vue aériennes : événements, lieux et paysages vus du ciel',
                      wide: true,
                    },
                  ].map((service) => (
                    <div
                      key={service.title}
                      className={`bg-neutral-800/30 rounded-xl p-4 border border-neutral-700/50${service.wide ? ' sm:col-span-2' : ''}`}
                    >
                      <h3 className="text-amber-500 font-medium mb-1">{service.title}</h3>
                      <p className="text-sm text-neutral-400">{service.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            Intéressé par une collaboration ?
          </h2>
          <p className="text-neutral-400 mb-8">
            N'hésitez pas à me contacter pour discuter de votre projet.
          </p>
          <button
            onClick={() => {
              goTo('/contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-3 bg-amber-500/10 backdrop-blur-sm border border-amber-500/50 px-8 py-4 rounded-full text-amber-500 hover:bg-amber-500 hover:text-neutral-950 transition-all duration-500"
          >
            <span className="text-sm tracking-wider uppercase">Me contacter</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </>
  );
}
