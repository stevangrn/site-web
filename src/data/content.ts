// ============================================================================
// CONTENU DU SITE — modifie ce fichier pour changer les textes et les photos
// ============================================================================
// Pas besoin de base de données : tout le contenu du site est ici.
// Après avoir modifié ce fichier, sauvegarde et le site se met à jour
// automatiquement (en développement) ou après un nouveau "npm run build"
// (une fois publié).
// ============================================================================

import { TrainFrontTunnelIcon } from 'lucide-react';
import type { Profile, Category, Photo } from '../lib/supabase';

// ----------------------------------------------------------------------------
// 1. PROFIL — tes informations personnelles
// ----------------------------------------------------------------------------
export const profile: Profile = {
  id: 'profile-1',
  name: 'Stevan GARON',
  title: 'Photographe et télépilote de drone',
  bio: 'Capturant les moments précieux de la vie à travers mon objectif. Spécialisée dans les portraits, les paysages et les événements spéciaux.',
  email: 'stevan.garon@gmail.com',
  phone: '06 27 24 56 73',
  location: 'La Chaize-le-Vicomte, Vendée, France',
  social_instagram: '@stevan_raw',
  social_facebook: null,
  updated_at: new Date().toISOString(),
};

// ----------------------------------------------------------------------------
// 2. CATÉGORIES — les catégories de photos (utilisées pour filtrer le portfolio)
// ----------------------------------------------------------------------------
export const categories: Category[] = [
  {
    id: 'cat-portraits',
    name: 'Portraits',
    slug: 'portraits',
    description: 'Portraits captivants qui révèlent la personnalité',
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-sports',
    name: 'Sports',
    slug: 'sports',
    description: 'Images dynamiques de compétitions sportives',
    display_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-evenements',
    name: 'Événements',
    slug: 'evenements',
    description: 'Moments mémorables de vos événements',
    display_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-nature',
    name: 'Nature / Paysages',
    slug: 'nature',
    description: 'La beauté sauvage de la nature',
    display_order: 4,
    created_at: new Date().toISOString(),
  },
];

// Petit raccourci pour retrouver une catégorie par son slug
const catId = (slug: string) => categories.find((c) => c.slug === slug)!.id;

// ----------------------------------------------------------------------------
// 3. PHOTOS — la liste de toutes tes photos
// ----------------------------------------------------------------------------
// Pour ajouter une photo :
//   1. Copie un bloc { ... } ci-dessous.
//   2. Donne-lui un "id" unique (ex: 'photo-9').
//   3. Renseigne titre, description, image_url (lien vers l'image),
//      category_id (via catId('slug-de-la-categorie')),
//      featured (true pour qu'elle apparaisse en avant sur l'accueil),
//      featured_home (true pour l'ajouter aux travaux en vedette),
//      hero (true pour choisir cette photo comme image de héros),
//      display_order (ordre d'affichage, plus petit = affiché en premier).
// ----------------------------------------------------------------------------
export const photos: Photo[] = [
  {
    id: 'photo-1',
    title: 'Manthe-Religieuse sur un mur blanc',
    description: "Photo macro d'une manthe religieuse posée sur un mur blanc",
    image_url: 'https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529895/91_lf2eeh.jpg',
    category_id: catId('nature'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-2',
    title: "Portrait d'une Manthe-Religieuse",
    description: "Photo macro d'un portrait d'une manthe religieuse",
    image_url: 'https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529898/90_f3vjnk.jpg',
    category_id: catId('nature'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: true, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-3',
    title: "Essain d'abeilles",
    description: "Photo d'un essain d'abeille dans une ruche",
    image_url: 'https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529944/89_shznyc.jpg',
    category_id: catId('nature'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-4',
    title: "Photo d'une abeilles butinant une fleur",
    description: "Photo macro d'une abeille butinant une fleur",
    image_url: 'https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529932/88_vcpm9t.jpg',
    category_id: catId('nature'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: true, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-5',
    title: "Photo d'une abeilles butinant une fleur 2",
    description: "Photo macro d'une abeille butinant une fleur 2",
    image_url: 'https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529903/87_qhxx7o.jpg',
    category_id: catId('nature'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-6',
    title: "Choucher de soleil à Noirmoutier depuis les airs",
    description: "Photo en drone d'un coucher de soleil à Noirmoutier depuis les airs",
    image_url: 'https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529949/85_yyug2n.jpg',
    category_id: catId('nature'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-7',
    title: "Portrait d'un chien dans la forêt",
    description: "Photographie d'un chien en pleine forêt",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783530014/84_zyelht.jpg",
    category_id: catId('nature'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-8',
    title: "Photo d'une fleure rouge ",
    description: "Photographie d'une fleur rouge prise dans un jardin",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529943/83_bpia61.jpg",
    category_id: catId('nature'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-9',
    title: "Montagne dans les alpes",
    description: "Photographie d'une montagne lors d'un coucher de soleil",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529981/82_zvaolx.jpg",
    category_id: catId('nature'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 9,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-10',
    title: "Télésièges",
    description: "Photographie d'un télésiège dans les alpes",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783530004/81_molehc.jpg",
    category_id: catId('nature'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 10,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-11',
    title: "Montagnes survolé",
    description: "Photographie d'une montagne survolé par un avion dans les alpes",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529960/80_vstx0l.jpg",
    category_id: catId('nature'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 11,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-12',
    title: "Abeilles butinant une fleur",
    description: "Photographie macro d'une abeille butinant une fleur",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529995/79_pgbedi.jpg",
    category_id: catId('nature'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 12,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-13',
    title: "Apéro concert Pass'Yon Judo 1",
    description: "Concert du groupe Stefany de banc d'essai pour la soirée apéro concert du club de judo Pass'Yon Judo",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529899/79_3_yoe7j1.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 13,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-14',
    title: "Apéro concert Pass'Yon Judo 2",
    description: "Concert du groupe Stefany de banc d'essai pour la soirée apéro concert du club de judo Pass'Yon Judo",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529917/79_2_ljewe5.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 14,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-15',
    title: "Bourdon face à la caméra",
    description: "Photographie macro d'un bourdon faisant du sur place face à la caméra",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529913/77_xyphrx.jpg",
    category_id: catId('nature'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 15,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-16',
    title: "Action de Handball",
    description: "Photographie d'une joueuse du SL Vicomtais en pleine action de handball",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529932/76_suv3tq.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 16,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-17',
    title: "Equipe de Handball",
    description: "Photographie de l'équipe féminine du SL Vicomtais de handball",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529902/75_igbo6v.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 17,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-18',
    title: "Démonstration de judo de l'école Tenri",
    description: "Démonstration d'une technique de judo par un étudiant de l'école de Tenri au japon",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529951/73_j3mejk.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 18,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-20',
    title: "Portrait d'un judoka de l'école de Tenri",
    description: "Photographie d'un judoka de l'école japonaise de Tenri",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783530009/73_2_k01jjk.jpg",
    category_id: catId('portraits'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 20,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-21',
    title: "Pièce de théâtre du lycée SFDA 1",
    description: "Photographie d'une pièce de théâtre du lycée Saint François d'Assise",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783530005/72_qndg7x.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 21,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-22',
    title: "Portrait d'une comédienne",
    description: "Portrait hotographie d'une pièce de théâtre du lycée Saint François d'Assise",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529962/71_orv8lp.jpg",
    category_id: catId('portraits'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 22,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-23',
    title: "Pièce de théâtre du lycée SFDA 2",
    description: "Photographie d'une pièce de théâtre du lycée Saint François d'Assise",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529955/70_xtxwmu.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 23,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-24',
    title: "Répétition de musique de Chaizy acoustique 1",
    description: "Photographie d'un batteur de l'association chaizy acoustic",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529925/69_mkeq0b.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 24,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-25',
    title: "Répétition de musique de Chaizy acoustique 2",
    description: "Photographie d'un musicien de l'association chaizy acoustic",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529933/68_y6eicd.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 25,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-26',
    title: "Répétition de musique de Chaizy acoustique 3",
    description: "Photographie d'un musicien de l'association chaizy acoustic",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529994/67_cso3rl.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 26,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-27',
    title: "Répétition de musique de Chaizy acoustique 4",
    description: "Photographie gros plan d'un musicien de l'association chaizy acoustic",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529990/66_kk2ego.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: true, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 27,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-28',
    title: "Fête du lycée de SFDA 1",
    description: "Photographie aérienne de la fête du lycée de SFDA",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529970/65_xeer2d.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 28,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-29',
    title: "Fête du lycée de SFDA 2",
    description: "Photographie aérienne de la fête du lycée de SFDA",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529952/64_jmkjgf.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: true, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 29,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-30',
    title: "Terrain de basket de SFDA",
    description: "Photographie aérienne du terrain de basket de SFDA",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529998/63_xbe7wo.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 30,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-31',
    title: "Lycée Saint François d'Assise",
    description: "Photographie aérienne du lycée saint françois d'Assise au coucher de soleil",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529977/62_kwjqqz.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: true, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 31,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-32',
    title: "Promotion 2024-2026 SFDA",
    description: "Photographie aérienne de la promiotion 2025-2026 du lycée saint françois d'Assise",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529992/61_v9kpal.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 32,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-33',
    title: "Portraits d'une femme sur un rocher ",
    description: "Photographie d'une femme sur un rocher lors de la golden hour",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529942/60_lrzuus.jpg",
    category_id: catId('portraits'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 33,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-34',
    title: "Portraits d'une femme",
    description: "Photographie d'une femme lors de la golden hour",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529989/59_ezfwby.jpg",
    category_id: catId('portraits'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 34,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-35',
    title: "Gymnaste sur la plage",
    description: "Un portrait d'une gymnaste en plein vol sur la plage",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529965/58_uuri5i.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: true, // true = cette photo sera affichée en héros
    display_order: 35,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-36',
    title: "Stevan GARON",
    description: "portrait d'un photographe",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783602979/2024_09_28_220_2_d0t3az.jpg",
    category_id: catId('portraits'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    about: true, // true = cette photo est réservée à la page À Propos
    display_order: 36,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-37',
    title: "Gymnaste sur la palge 2",
    description: "Un portrait d'une gymnaste faisant un grand écart sur la plage",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783530001/57_ty48ee.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 37,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-38',
    title: "Gymnaste sur la palge 3",
    description: "Un portrait d'une gymnaste faisant un grand écart sur la plage",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783530003/56_r84ykg.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 38,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-39',
    title: "Duo sur la plage au coucher de soleil",
    description: "Portrait de deux femmes sur la plage en plein coucher de soleil",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529900/55_zvdzic.jpg",
    category_id: catId('portraits'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 39,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-40',
    title: "Silhouette d'une femme sur la plage au coucher de soleil",
    description: "Portrait d'une femme sur la plage en plein coucher de soleil",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529894/54_vkau58.jpg",
    category_id: catId('portraits'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 40,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-41',
    title: "L'entrée de la mariée à la mairie",
    description: "L'entrée de la mariée à la mairie dans les bras de son père",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783608867/SG1_3195_vgfmwn.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 41,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-42',
    title: "Les mariés à la mairie",
    description: "Les mariés lors de la cérémonie à la mairie",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783608867/SG1_3202_dajrvz.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 42,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-43',
    title: "Carnet de famille des mariés",
    description: "Close-up sur le carnet de famille des mariés",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783608864/SG1_3299_oqchbv.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 43,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-44',
    title: "L'entrée de la mariée à l'église",
    description: "L'entrée de la mariée à l'église dans les bras de son père",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783608854/SG1_3343_awedwm.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: true, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 44,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-45',
    title: "Cérémonie du bouquet",
    description: "Cérémonie du bouquet de la marié",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529967/53_3_lho8cr.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 45,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-46',
    title: "Photographie aérienne de la sortie de l'église par les mariés",
    description: "Photographie aérienne de la sortie de l'église par les mariés",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529950/53_2_q8b3g2.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 46,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-47',
    title: "Photo aérienne des invités lors du mariage",
    description: "Photographie aérienne de groupe des invités du mariage",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529977/53_o4nmmo.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 47,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-48',
    title: "Costume du marié",
    description: "Close-up sur le costume du marié",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529920/50_vzvre2.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 48,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-49',
    title: "Bouquet de la mariée",
    description: "Close-up sur lebouquet de la mariée",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529975/49_yh29u7.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 49,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-50',
    title: "Verre de l'amitié des mariés",
    description: "portrait des mariés lors du verre de l'amitié",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529935/47_occwng.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 50,
    created_at: new Date().toISOString(),
  },
    {
    id: 'photo-51',
    title: "Silhouette d'une femme au dessus de la ville",
    description: "portrait d'une femme lors d'un coucher de soleil au dessus de la ville",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529945/46_bhd8uj.jpg",
    category_id: catId('portraits'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 51,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-52',
    title: "Joueur de Basket du BCEBM",
    description: "Joueur en pleine action lors d'un match de basket",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529974/45_w5c4ox.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 52,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-53',
    title: "Joueur de Basket du BCEBM en plein saut",
    description: "Joueur sautant pour marquer un panier lors d'un match",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529971/45_2_hb9mxc.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 53,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-54',
    title: "Lancer franc",
    description: "Joueur marquant un panier lors d'un lancer franc",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529969/44_vkputo.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 54,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-55',
    title: "Cours de Judo",
    description: "Judoka enfant lors d'un cours de judo à Pass'Yon Judo",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783530015/43_fwgzyi.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: true, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 55,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-56',
    title: "Danseuse en plein gala",
    description: "Danseuse accompagnant des enfants lors dee son gala de danse",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529907/42_egx8jl.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 56,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-57',
    title: "Silhouette d'une danseuse faisant un solo",
    description: "Silhouette d'une danseuse en plein gala de danse",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529956/41_gebyea.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 57,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-58',
    title: "Judoka se rhabillant lors d'un combat",
    description: "Judoka remettant sa ceinture lors de l'Open de Vendée de judo",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529996/40_bfstgs.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 58,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-59',
    title: "Kimono d'un judoka vendéen",
    description: "Close up sur le kimono d'un judoka se préparant à un combat lors de l'Open de Vendée de judo",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783530018/39_m95evj.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 59,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-60',
    title: "Technique de judo",
    description: "Action interdite de la part d'un judoka lors de l'Open de Vendée",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783530010/38_lp6ya3.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 60,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-61',
    title: "Speaker lors d'un match de Volleyball",
    description: "Speaker avec un tambour lors d'un match de Volleyball de la Roche-sur-Yon",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529999/37_h9nyyv.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 61,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-62',
    title: "Focus sur les petits geste du Volleyball",
    description: "Focus sur la main d'une joueuse de Volleyball indiquant des informations a ces camarades de jeux",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529919/36_rse7ob.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 62,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-63',
    title: "Joueuse prête pour la réception",
    description: "Une joueuse de volley-ball en maillot rouge est en position de réception basse, le regard concentré vers le haut",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529959/35_vjxv1b.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héross
    display_order: 63,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-64',
    title: "Joueuse réalisant un service",
    description: "Une joueuse de volley-ball en maillot bleu dans les airs prête a frapper la balle pour faire son service",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783530013/34_dbjvts.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 64,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-65',
    title: "Seule face à la mer",
    description: "Femme seule face à la mer",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529985/33_cpswhz.jpg",
    category_id: catId('portraits'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 65,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-66',
    title: "Perdu dans la foule",
    description: "Femme ayant le regard perdu à travers la foule",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529937/32_tqgblo.jpg",
    category_id: catId('portraits'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 66,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-67',
    title: "Un phare sur la côte",
    description: "Photo aérienne d'un phare sur les côtes basque",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529910/31_2_uhrxyd.jpg",
    category_id: catId('nature'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: true, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 67,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-68',
    title: "Focus sur le buste d'un jour de basket 3X3",
    description: "Photo d'un joueur de basket de 3X3 lors d'un tournoi organisé par le BCEBM",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783530000/30_jmjesm.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 68,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-69',
    title: "Vu du dessus d'un terrain de basket 3X3",
    description: "Photo aérienne d'un match de basket de 3X3 lors d'un tournoi organisé par le BCEBM",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529937/29_mtyf88.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 69,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-70',
    title: "Seul face au panier",
    description: "Photo aérienne d'un homme tirant un ballon dans le panier lors d'un match de basket de 3X3 lors d'un tournoi organisé par le BCEBM",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529952/28_uoxzao.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: true, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 70,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-71',
    title: "Une équipe ! Une Victoire",
    description: "Photo de groupe d'une équipe de basket venant de gagner son match",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529930/27_o7pb74.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 71,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-72',
    title: "Un shoot = un panier",
    description: "Plan large d'une basketteuse venant de tirer",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529948/25_iwipwa.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 72,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-73',
    title: "Basketteuse en plein saut pour marquer un panier",
    description: "Photo d'une basketteuse sautant pour marquer un panier",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529943/24_rijlsi.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 73,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-74',
    title: "Cycliste en plein triathlon",
    description: "Photo d'un cycliste lors d'une transition du triathlon",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783530019/23_pklbdz.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 74,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-75',
    title: "Nageur en préparation de son triathlon",
    description: "Photo d'un nageur qui se prépare a faire son triathlon",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783530011/22_vzpsd3.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 75,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-76',
    title: "Pancarte du mariage d'Elodie&Emeric",
    description: "Pancarte du mariage d'Elodie et Emeric",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783530007/21_ujnt9v.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 76,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-77',
    title: "Rituel des rubans en mariage",
    description: "Rituel des rubans du mariage d'Elodie et Emeric",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529969/20_d7okcl.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 77,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-78',
    title: "Famille d'Elodie et Emeric",
    description: "Photo de groupe de la famille lors du mariage d'Elodie et Emeric",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783530008/19_tfdtly.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 78,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-79',
    title: "Cérémonie du bouquet du mariage d'Elodie et Emeric",
    description: "Photo de la cérémonie du bouquet lors du mariage d'Elodie et Emeric",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529991/18_nskbky.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 79,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-80',
    title: "Défi photo lors du mariage d'Elodie et Emeric",
    description: "Défi avec photos imposé au invités du mariage d'Elodie et Emeric",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783530017/17_ablomn.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 80,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-81',
    title: "Première danse du mariage d'Elodie et Emeric",
    description: "Photo lors de la première danse du mariage d'Elodie et Emeric",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783530021/15_oy4szh.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 81,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-82',
    title: "Première danse du mariage d'Elodie et Emeric",
    description: "Photo lors de la première danse du mariage d'Elodie et Emeric",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783530021/15_oy4szh.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 82,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-83',
    title: "Photo de groupe Karting",
    description: "Photo d'un groupe participant à une activité karting  organisé par AIR RT",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529979/14_vchchx.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 83,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-84',
    title: "Pilote de Karting",
    description: "Photo d'un pilote étudiant participant à une activité karting  organisé par AIR RT",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529993/13_th3sql.jpg",
    category_id: catId('evenements'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 84,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-85',
    title: "Chorégraphie du gala de danse Happy Dance 1",
    description: "",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529984/12_q09qvo.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 85,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-86',
    title: "Chorégraphie du gala de danse Happy Dance 2",
    description: "",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529984/11_tp0rjx.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 86,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-87',
    title: "Chorégraphie du gala de danse Happy Dance 3",
    description: "",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529954/10_vvva8u.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 87,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-88',
    title: "Chorégraphie du gala de danse Happy Dance 4",
    description: "",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529904/9_aaefyg.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 88,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-89',
    title: "Chorégraphie du gala de danse Happy Dance 5",
    description: "",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529940/8_q7teng.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 89,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-90',
    title: "Chorégraphie du gala de danse ASLD 1",
    description: "Danseuse qui est porté sur les hanches de sa partenaires",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529928/7_bubnyr.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 90,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-91',
    title: "Chorégraphie du gala de danse ASLD 2",
    description: "Daseuse de la chorégraphie Marthin Luther King",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529932/6_vkrykj.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 91,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-92',
    title: "Chorégraphie du gala de danse ASLD 3",
    description: "",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529928/5_pvlmcl.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 92,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-93',
    title: "Chorégraphie du gala de danse ASLD 4",
    description: "",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529923/4_ufxlgb.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 93,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-94',
    title: "Chorégraphie du gala de danse ASLD 5",
    description: "",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529937/3_kluinf.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 94,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-95',
    title: "Chorégraphie du gala de danse ASLD 6",
    description: "",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529911/2_dkundw.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 95,
    created_at: new Date().toISOString(),
  },
  {
    id: 'photo-96',
    title: "Chorégraphie du gala de danse ASLD 7",
    description: "",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529906/1_xeeid3.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 96,
    created_at: new Date().toISOString(),
  },
];
