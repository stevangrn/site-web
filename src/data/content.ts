// ============================================================================
// CONTENU DU SITE — modifie ce fichier pour changer les textes et les photos
// ============================================================================
// Pas besoin de base de données : tout le contenu du site est ici.
// Après avoir modifié ce fichier, sauvegarde et le site se met à jour
// automatiquement (en développement) ou après un nouveau "npm run build"
// (une fois publié).
// ============================================================================

import type { Profile, Category, Photo } from '../lib/supabase';

// ----------------------------------------------------------------------------
// 1. PROFIL — tes informations personnelles
// ----------------------------------------------------------------------------
export const profile: Profile = {
  id: 'profile-1',
  name: 'Stevan GARON',
  title: 'Photographe et télépilote de drone',
  bio: 'Capturant les moments précieux de la vie à travers mon objectif. Spécialisé dans les portraits, les paysages et les événements spéciaux.',
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
// Le portfolio s'ouvre sur ces catégories, présentées sous forme de cartes :
//   - name / description : le titre et le texte affichés sur la carte,
//   - cover_photo_id : l'id de la photo qui illustre la carte (ex: 'photo-34').
//     Sans cover_photo_id, la photo la plus récente de la catégorie est utilisée.
//   - display_order : l'ordre des cartes (plus petit = affiché en premier).
export const categories: Category[] = [
  {
    id: 'cat-portraits',
    name: 'Portraits',
    slug: 'portraits',
    description: 'Portraits captivants qui révèlent la personnalité',
    cover_photo_id: 'photo-34',
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-sports',
    name: 'Sports',
    slug: 'sports',
    description: 'Images dynamiques de compétitions sportives',
    cover_photo_id: 'photo-73',
    display_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-evenements',
    name: 'Événements',
    slug: 'evenements',
    description: 'Moments mémorables de vos événements',
    cover_photo_id: 'photo-44',
    display_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-nature',
    name: 'Nature / Paysages',
    slug: 'nature',
    description: 'La beauté sauvage de la nature',
    cover_photo_id: 'photo-6',
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
    title: 'Mante religieuse sur un mur blanc',
    description: "Mante religieuse en gros plan, posée sur un mur blanc",
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
    title: "Portrait d'une mante religieuse",
    description: "Gros plan sur la tête d'une mante religieuse, qui fixe l'objectif sur fond sombre",
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
    title: "Essaim d'abeilles",
    description: "Abeilles serrées les unes contre les autres à l'intérieur d'une ruche",
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
    title: "Photo d'une abeille butinant une fleur",
    description: "Abeille couverte de pollen butinant le cœur d'une fleur orange",
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
    title: "Photo d'une abeille butinant une fleur 2",
    description: "Abeille butinant le cœur d'une fleur rouge, isolée sur fond sombre",
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
    title: "Coucher de soleil à Noirmoutier depuis les airs",
    description: "Coucher de soleil sur Noirmoutier vu du ciel au drone, avec une longue jetée qui s'avance dans la mer",
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
    description: "Chien blanc allongé au pied des grands arbres, en pleine forêt",
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
    title: "Photo d'une fleur rouge",
    description: "Gros plan sur des dahlias rouges dans un jardin",
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
    description: "Sommet enneigé des Alpes rosi par la lumière du coucher de soleil",
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
    description: "Télésiège qui grimpe une pente enneigée des Alpes, entre les sapins, en noir et blanc",
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
    title: "Montagnes survolées",
    description: "Sommet rocheux des Alpes survolé par un avion dont la traînée barre le ciel, en noir et blanc",
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
    description: "Abeille butinant de petites fleurs roses, sur fond sombre",
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
    description: "Le groupe Stefany de banc d'essai sur scène, en noir et blanc, lors de la soirée apéro-concert du club Pass'Yon Judo",
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
    description: "Le guitariste chanteur du groupe en plein morceau, lors de la soirée apéro-concert du club Pass'Yon Judo",
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
    description: "Bourdon en vol stationnaire entre des branches en fleurs, sur fond de ciel bleu",
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
    description: "Joueuse du SL Vicomtais, maillot jaune, qui s'élève pour tirer lors d'un match de handball",
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
    description: "L'équipe féminine de handball du SL Vicomtais réunie en cercle, bras dessus bras dessous",
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
    description: "Projection spectaculaire lors d'une démonstration de judo par un judoka de Tenri, au Japon",
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
    description: "Judoka de Tenri photographié de dos, son nom brodé en japonais sur son judogi",
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
    description: "La troupe de théâtre du lycée Saint-François-d'Assise réunie sur scène, verres levés",
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
    description: "Comédienne au canotier fleuri envoyant un baiser lors d'une pièce de théâtre du lycée Saint-François-d'Assise",
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
    description: "Scène de banquet autour d'une grande table lors d'une pièce de théâtre du lycée Saint-François-d'Assise",
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
    description: "Gros plan sur la batterie et les baguettes d'un musicien pendant une répétition",
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
    description: "Saxophoniste souriant pendant une répétition en plein air",
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
    description: "Jeune trompettiste qui lit sa partition pendant une répétition en plein air",
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
    description: "Gros plan sur un trompettiste, bras croisés autour de son instrument doré",
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
    description: "Vue aérienne de la fête du lycée Saint-François-d'Assise : la foule rassemblée dans la cour à la tombée du jour",
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
    description: "La foule de la fête du lycée Saint-François-d'Assise vue en hauteur, au coucher du soleil",
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
    description: "Le terrain de basket du lycée Saint-François-d'Assise vu à la verticale au drone",
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
    description: "Vue aérienne du lycée Saint-François-d'Assise au coucher du soleil, ses bâtiments en étoile illuminés",
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
    title: "Promotion 2024-2025 SFDA",
    description: "Photo de groupe de toute la promotion 2024-2025 du lycée Saint-François-d'Assise, prise en hauteur",
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
    description: "Femme assise sur un rocher au bord de la mer, dans la lumière dorée de fin de journée",
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
    description: "Portrait d'une jeune femme, main dans les cheveux, à l'heure dorée",
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
    description: "Gymnaste en plein saut, jambes en grand écart, sur fond de ciel bleu",
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
    description: "Portrait en noir et blanc de Stevan Garon, assis à califourchon sur une chaise",
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
    title: "Gymnaste sur la plage 2",
    description: "Gymnaste en équilibre sur une main, jambes en grand écart, au bord de l'eau",
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
    title: "Gymnaste sur la plage 3",
    description: "Gymnaste en pont, une jambe tendue vers le ciel, sur la plage, en noir et blanc",
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
    description: "Deux femmes de dos face à la mer, au coucher du soleil",
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
    description: "Silhouette d'une femme en contre-jour devant la mer et un ciel orangé",
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
    description: "La mariée arrive à la mairie au bras de son père",
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
    description: "Les mariés côte à côte pendant la cérémonie à la mairie",
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
    title: "Livret de famille des mariés",
    description: "Gros plan sur le livret de famille des mariés, posé à côté du bouquet",
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
    description: "La mariée fait son entrée dans l'église au bras de son père",
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
    description: "Vue aérienne du jeu du bouquet : les invitées en cercle tiennent chacune un ruban relié au bouquet",
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
    description: "Vue aérienne des invités rassemblés devant l'église à la sortie des mariés",
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
    description: "Photo de groupe de tous les invités du mariage, prise au drone en plein air",
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
    description: "Gros plan sur le costume vert du marié, son nœud papillon et sa boutonnière fleurie",
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
    description: "Gros plan sur le bouquet champêtre que la mariée tient entre ses mains",
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
    description: "Les mariés trinquent lors du vin d'honneur",
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
    title: "Silhouette d'une femme au-dessus de la ville",
    description: "Silhouette d'une femme en contre-jour, face au coucher de soleil au-dessus de la ville",
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
    description: "Joueur balle en main qui s'enfonce dans la défense lors d'un match de basket, en noir et blanc",
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
    description: "Joueur en pleine suspension au moment de tirer, face à deux défenseurs",
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
    description: "Joueur n°4 au moment de son lancer franc, bras encore tendus, en noir et blanc",
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
    description: "Jeunes judokas alignés sur le tatami pendant un cours à Pass'Yon Judo",
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
    description: "Danseuse accompagnant des enfants sur scène, regard tourné vers l'objectif, lors de son gala de danse",
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
    description: "Danseuse en solo, bras tendu vers le ciel, qui se détache sur fond noir",
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
    description: "Judoka qui resserre sa ceinture sur le tatami lors de l'Open de Vendée de judo, en noir et blanc",
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
    description: "Gros plan sur le judogi et la ceinture rouge d'un judoka avant son combat, lors de l'Open de Vendée de judo",
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
    description: "Judoka plongeant tête la première pour projeter son adversaire, un geste interdit en compétition, lors de l'Open de Vendée",
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
    description: "Le speaker, tambour en main, anime les tribunes lors d'un match de volley-ball à La Roche-sur-Yon",
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
    title: "Focus sur les petits gestes du volley-ball",
    description: "Main d'une joueuse de volley-ball qui indique une consigne à ses coéquipières, en noir et blanc",
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
    description: "Joueuse de volley-ball en maillot rouge, en position de réception basse, le regard fixé sur le ballon",
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
    description: "Joueuse de volley-ball en maillot bleu, en pleine suspension au moment de frapper son service",
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
    description: "Femme assise de dos sur un muret, face à la mer, en noir et blanc",
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
    description: "Femme au regard perdu au milieu de la foule, en noir et blanc",
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
    description: "Vue aérienne d'un phare sur la côte basque, avec la ville en arrière-plan",
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
    title: "Focus sur le buste d'un joueur de basket 3X3",
    description: "Gros plan sur le maillot rouge d'un joueur lors du tournoi de basket 3x3 organisé par le BCEBM",
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
    title: "Vue du dessus d'un terrain de basket 3X3",
    description: "Vue du ciel d'une action sous le panier lors du tournoi de basket 3x3 organisé par le BCEBM",
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
    description: "Vue du ciel d'un joueur seul face au panier lors du tournoi de basket 3x3 organisé par le BCEBM",
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
    description: "L'équipe féminine de basket pose tout sourire après sa victoire",
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
    description: "Plan large de la salle au moment où une basketteuse tire, lors d'un match à La Roche-sur-Yon",
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
    description: "Basketteuse en pleine suspension pour marquer un panier, sous les yeux de ses adversaires",
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
    description: "Triathlète tout sourire qui pousse son VTT dans l'aire de transition",
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
    description: "Triathlètes en bonnet de bain, concentrés avant le départ de l'épreuve de natation",
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
    description: "Panneau de bienvenue fleuri à l'entrée du mariage d'Elodie et Emeric",
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
    description: "Les mains des mariés liées par des rubans pendant le rituel, en noir et blanc",
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
    description: "Photo de groupe de la famille en plein air lors du mariage d'Elodie et Emeric",
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
    description: "Le bouquet de la mariée relié aux rubans des invitées, lors du mariage d'Elodie et Emeric",
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
    description: "Les invitées alignées prennent la pose pour un défi photo lors du mariage d'Elodie et Emeric",
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
    description: "Les mariés enlacés pendant leur première danse, dans un nuage de fumée, en noir et blanc",
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
    description: "Les mariés enlacés pendant leur première danse, en noir et blanc",
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
    description: "Les participants posent sur la piste lors de la sortie karting organisée par AIR RT",
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
    description: "Pilote étudiant lancé à pleine vitesse sur la piste, lors de la sortie karting organisée par AIR RT",
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
    description: "Danseuses en blanc et en noir réunies au centre de la scène, bras levés vers le ciel",
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
    description: "Danseuses éclairées de rouge, debout derrière leurs chaises, bras tendus vers le haut",
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
    description: "Plan large de la troupe alignée derrière des chaises, baignée de lumière rouge",
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
    description: "Danseuses en robe alignées et tournées vers le public, sous une lumière verte",
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
    description: "Une petite danseuse et une danseuse adulte, paume contre paume, en contre-jour dans une lumière verte",
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
    description: "Danseuse portée sur les hanches de sa partenaire, sous un faisceau de lumière",
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
    description: "Deux danseuses de dos, poing levé, dans la chorégraphie consacrée à Martin Luther King",
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
    description: "Un danseur et une danseuse face à face, dans la pénombre de la scène",
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
    description: "Danseuse en chemisier blanc, le visage saisi par un rai de lumière",
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
    description: "Deux chanteuses en blanc, micro en main, entourées de la troupe vêtue de noir",
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
    description: "Deux danseuses en costume traditionnel, paumes jointes, dans une lumière rouge",
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
    description: "Duo de danseuses en costume traditionnel, mains jointes levées, dans un halo de lumière",
    image_url: "https://res.cloudinary.com/qg0yy7u3/image/upload/v1783529906/1_xeeid3.jpg",
    category_id: catId('sports'),
    featured: false, //en vedette sur la page d'acceuil
    featured_home: false, // true = cette photo apparaît dans les travaux en vedette
    hero: false, // true = cette photo sera affichée en héros
    display_order: 96,
    created_at: new Date().toISOString(),
  },
];