import { createContext, useContext, type ReactNode } from 'react';
import type { Route } from './router';

export type Locale = 'fr' | 'en';

const translations = {
  fr: {
    nav: {
      home: 'Accueil',
      portfolio: 'Portfolio',
      about: 'À Propos',
      contact: 'Contact',
      legal: 'Mentions légales',
      openMenu: 'Ouvrir le menu mobile',
      closeMenu: 'Fermer le menu mobile',
    },
    theme: {
      light: 'Clair',
      dark: 'Sombre',
    },
    locale: {
      fr: 'Français',
      en: 'English',
    },
    loading: 'Chargement',
    consent: {
      title: 'Nous respectons votre vie privée.',
      text: "Ce site utilise un stockage local pour mémoriser votre préférence de thème et améliorer votre expérience. Vous pouvez accepter ou refuser cette utilisation.",
      accept: 'Accepter',
      decline: 'Refuser',
      privacy: 'Politique de confidentialité',
    },
    home: {
      hero: {
        role: 'Photographe et télépilote de drone',
        ctaPortfolio: 'Voir Portfolio',
        ctaContact: 'Me Contacter',
      },
      featured: {
        label: 'Sélection',
        title: 'Portraits, événements et paysages en Vendée',
        seeAll: 'Voir tout le portfolio',
      },
      aboutPreview: {
        label: 'À Propos',
        title: 'Mon Histoire',
        description: 'Je m’appelle Stevan Garon, photographe et télépilote de drone basé en Vendée. Je travaille sur des portraits, des événements, des sports et des projets de paysage avec un regard à la fois documentaire et artistique.',
        paragraph1: "Mon terrain de jeu favori ? Le sport, où je prends un plaisir fou à figer le mouvement et l'adrénaline. J'immortalise également l'énergie de vos événements (concerts, théâtre), la magie de vos mariages, ainsi que vos portraits en milieu naturel ou urbain.",
        paragraph2: "Mon objectif : créer des images authentiques, sensibles et techniques, à la hauteur de vos projets, que ce soit à La Chaize-le-Vicomte, dans toute la Vendée ou au-delà.",
        cta: 'En savoir plus',
      },
    },
    portfolio: {
      header: {
        title: 'Mes Créations',
        subtitle: 'Découvrez un portfolio photographique en Vendée : portraits, événements, sports, mariages et paysages capturés avec une approche naturelle, documentaire et artistique.',
      },
      filter: {
        all: 'Tout',
      },
      noPhotos: 'Aucune photo dans cette catégorie',
      loadMore: 'Charger plus',
      visiblePhotos: '{count} / {total} photos affichées',
      seeAll: 'Voir tout le portfolio',
    },
    about: {
      header: {
        label: 'À Propos',
        title: 'Mon Histoire',
        description: 'Découvrez mon parcours et ma passion pour la photographie.',
      },
      story: {
        intro: "Je m'appelle Stevan Garon et je capture le mouvement, l'émotion et l'énergie à travers mon objectif. Voyageant dans le monde de la photographie depuis mon enfance, c'est au cours des 3 dernières années que j'ai transformé cette passion en véritable vocation professionnelle en devenant photographe indépendant.",
        paragraph1: "Au départ, tout a commencé avec un petit appareil et une envie simple : montrer ma vision du monde aux autres. Encouragé par mes proches à partager mon regard, j'ai sauté le pas. Aujourd'hui, j'accompagne mes clients pour immortaliser leurs plus beaux moments.",
        paragraph2: "Spécialisé dans la photographie de sport, c'est sur le terrain, dans l'action et la vitesse, que je prends le plus de plaisir. Mon univers s'étend également à l'événementiel (concerts, théâtre) et aux mariages, sans oublier quelques séances de portraits. Mon approche allie une technique maîtrisée à une sensibilité artistique pour créer des images authentiques, vibrantes, et riches en émotions.",
        quote: '"Pour une fois les photos nous mettent en valeur... Merci merci, c’est trop bien de les avoir !" – Jeanne, une cliente ravie.',
      },
      stats: {
        years: 'Années d’expérience',
        feedback: 'Retours positifs',
        passion: 'Passion',
      },
      services: {
        title: 'Services',
        portrait: 'Portraits',
        portraitDesc: 'Individuels, familles, professionnels',
        landscape: 'Paysages',
        landscapeDesc: 'Nature, urbain, architecture',
        events: 'Événements',
        eventsDesc: 'Mariages, célébrations, corporate',
        sports: 'Sports',
        sportsDesc: 'Action, Intensité, Performance',
        cta: 'Me Contacter',
      },
      cta: {
        title: 'Intéressé par une collaboration ?',
        description: 'N’hésitez pas à me contacter pour discuter de votre projet.',
        button: 'Me Contacter',
      },
    },
    contact: {
      header: {
        label: 'Contact',
        title: 'Travaillons Ensemble',
        description: 'Disponible pour vos projets photographiques. N’hésitez pas à me contacter pour discuter de vos besoins.',
      },
      info: {
        title: 'Parlons de votre projet',
        description: 'Que vous ayez besoin d’un portrait, d’une couverture d’événement, ou de photos artistiques, je suis là pour créer avec vous des images qui vous ressemblent.',
        emailLabel: 'Email',
        phoneLabel: 'Téléphone',
        locationLabel: 'Localisation',
        mapTitle: 'Carte de La Chaize-le-Vicomte',
      },
      form: {
        title: 'Envoyez un message',
        name: 'Votre nom',
        email: 'Votre email',
        phone: 'Votre téléphone (optionnel)',
        phonePlaceholder: '06 12 34 56 78',
        projectType: 'Type de projet',
        message: 'Votre message',
        projectSelectPlaceholder: 'Sélectionnez un type',
        projectOptions: {
          portrait: 'Portrait',
          paysage: 'Paysage',
          evenement: 'Événement',
          autre: 'Autre',
        },
        honeypotLabel: 'Ne pas remplir ce champ',
        messagePlaceholder: 'Décrivez votre projet...',
        status: {
          sending: 'Envoi en cours...',
          send: 'Envoyer',
          successTitle: 'Message envoyé !',
          successDescription: 'Merci pour votre message. J’ai bien reçu votre demande et je vous répondrai dans les plus brefs délais pour en discuter.',
        },
        recaptcha: {
          label: 'Vérification anti-spam',
          active: 'reCAPTCHA est activé. La vérification se fait automatiquement lorsque vous envoyez le formulaire.',
        },
      },
      errors: {
        required: 'Veuillez renseigner votre nom, votre email et votre message.',
        invalidEmail: 'Veuillez saisir une adresse e-mail valide.',
        invalidPhone: 'Veuillez saisir un numéro de téléphone valide.',
        messageTooLong: 'Votre message est trop long. Veuillez limiter votre demande à 2000 caractères.',
        recaptchaNotReady: 'La vérification reCAPTCHA n’est pas encore prête. Veuillez patienter.',
        recaptchaFailed: 'La vérification anti-spam a échoué. Veuillez réessayer.',
        sendFailed: 'L’envoi du message a échoué. Veuillez réessayer ou me contacter directement par email.',
      },
    },
    legal: {
      header: {
        label: 'Informations légales',
        title: 'Mentions Légales',
        description: 'Conformément à la loi n°2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique.',
      },
      publisher: {
        title: 'Éditeur du site',
        intro: 'Le site stevangaron.fr est édité à titre individuel par :',
        body: 'Cette activité de photographie est exercée à titre individuel et n’est, à ce jour, rattachée à aucune structure juridique immatriculée (pas de numéro SIRET, de numéro RCS, ni de numéro de TVA intracommunautaire).',
      },
      publicationDirector: {
        title: 'Directeur de la publication',
        text: '..., également éditeur du site (coordonnées ci-dessus).',
      },
      hosting: {
        title: 'Hébergement',
        intro: 'Le site est hébergé par :',
        providerName: 'GitHub, Inc.',
        providerUrl: 'github.com',
      },
      intellectualProperty: {
        title: 'Propriété intellectuelle',
        text: 'L’ensemble des photographies, textes, logos et éléments graphiques présents sur ce site sont la propriété exclusive de {name}, sauf mention contraire. Toute reproduction, représentation, modification ou diffusion, totale ou partielle, de ce site ou de son contenu, par quelque procédé que ce soit, est interdite sans autorisation écrite préalable.',
      },
      privacy: {
        title: 'Politique de confidentialité',
        intro: 'Cette politique décrit les informations personnelles collectées sur le site stevangaron.fr et la manière dont elles sont utilisées.',
        collected: 'Données collectées : lorsque vous utilisez le formulaire de contact, je peux recueillir votre nom, votre adresse e-mail, votre numéro de téléphone (si vous le renseignez), le type de projet ainsi que votre message. Ces informations sont uniquement utilisées pour répondre à votre demande.',
        purposes: 'Finalités : les données sont traitées pour permettre la prise de contact, la préparation d’une réponse personnalisée et, si nécessaire, la mise en place d’un projet photographique.',
        thirdParties: 'Prestataires et services tiers : le formulaire peut transmettre vos données à un service externe de gestion d’e-mails afin d’assurer l’envoi du message. Aucune donnée personnelle n’est vendue ou cédée à des fins commerciales.',
        cookies: 'Cookies et stockage local : ce site n’utilise pas de cookies de suivi publicitaires. Un stockage local de votre navigateur peut toutefois être utilisé pour mémoriser votre préférence de thème (clair ou sombre).',
        retention: 'Conservation : les données sont conservées le temps strictement nécessaire au traitement de votre demande, puis supprimées ou anonymisées, sauf obligation légale ou besoin de conservation pour la preuve d’une relation commerciale.',
        rights: 'Vos droits : vous pouvez à tout moment demander l’accès, la correction, la suppression ou la limitation du traitement de vos données personnelles. Vous pouvez également retirer votre consentement ou introduire une réclamation auprès de la CNIL si vous estimez que vos droits ne sont pas respectés.',
        contact: 'Contact : pour exercer vos droits ou pour toute question relative à cette politique, vous pouvez me contacter à {email}.',
      },
      credits: {
        title: 'Crédits',
        text: 'Conception et développement du site : {name}.',
      },
    },
    footer: {
      rights: '© {year} {name}. Tous droits réservés.',
      privacy: 'Politique de confidentialité',
      legal: 'Mentions légales',
      emailAria: 'Envoyer un email',
      instagramAria: 'Voir Instagram',
    },
    categories: {
      portraits: 'Portraits',
      sports: 'Sports',
      events: 'Événements',
      nature: 'Nature / Paysages',
    },
    categoriesEn: {
      portraits: 'Portraits',
      sports: 'Sports',
      events: 'Events',
      nature: 'Nature / Landscapes',
    },
  },
  en: {
    nav: {
      home: 'Home',
      portfolio: 'Portfolio',
      about: 'About',
      contact: 'Contact',
      legal: 'Legal notice',
      openMenu: 'Open mobile menu',
      closeMenu: 'Close mobile menu',
    },
    theme: {
      light: 'Light',
      dark: 'Dark',
    },
    locale: {
      fr: 'Français',
      en: 'English',
    },
    loading: 'Loading',
    consent: {
      title: 'We respect your privacy.',
      text: 'This site uses local storage to remember your theme preference and improve your experience. You may accept or refuse this use.',
      accept: 'Accept',
      decline: 'Decline',
      privacy: 'Privacy policy',
    },
    home: {
      hero: {
        role: 'Photographer and drone pilot',
        ctaPortfolio: 'View portfolio',
        ctaContact: 'Contact me',
      },
      featured: {
        label: 'Selection',
        title: 'Portraits, events and landscapes in Vendée',
        seeAll: 'View full portfolio',
      },
      aboutPreview: {
        label: 'About',
        title: 'My Story',
        description: 'I am Stevan Garon, photographer and drone pilot based in Vendée. I work on portraits, events, sports and landscape projects with a documentary and artistic eye.',
        paragraph1: 'My favorite playground? Sport, where I take great pleasure in capturing movement and adrenaline. I also immortalize the energy of your events (concerts, theater), the magic of your weddings, and your portraits in natural or urban environments.',
        paragraph2: 'My goal: create authentic, sensitive and technical images that match your projects, whether in La Chaize-le-Vicomte, throughout Vendée or beyond.',
        cta: 'Learn more',
      },
    },
    portfolio: {
      header: {
        title: 'My Work',
        subtitle: 'Discover a photographic portfolio from Vendée: portraits, events, sports, weddings and landscapes captured with a natural, documentary and artistic approach.',
      },
      filter: {
        all: 'All',
      },
      noPhotos: 'No photos in this category',
      loadMore: 'Load more',
      visiblePhotos: '{count} / {total} photos displayed',
      seeAll: 'View full portfolio',
    },
    about: {
      header: {
        label: 'About',
        title: 'My Story',
        description: 'Discover my journey and my passion for photography.',
      },
      story: {
        intro: 'My name is Stevan Garon and I capture movement, emotion and energy through my lens. Traveling in the world of photography since childhood, it was over the past 3 years that I turned this passion into a true professional vocation as an independent photographer.',
        paragraph1: 'At first, it all started with a small camera and a simple desire: to share my view of the world with others. Encouraged by my loved ones to share my perspective, I took the plunge. Today, I help my clients immortalize their most beautiful moments.',
        paragraph2: 'Specialized in sports photography, it is on the field, in action and speed, that I take the greatest pleasure. My universe also extends to events (concerts, theater) and weddings, without forgetting portrait sessions. My approach combines mastered technique with artistic sensitivity to create authentic, vibrant images rich in emotions.',
        quote: '"For once the photos make us look great... Thank you thank you, it is so good to have them!" – Jeanne, a happy client.',
      },
      stats: {
        years: 'Years of experience',
        feedback: 'Positive feedback',
        passion: 'Passion',
      },
      services: {
        title: 'Services',
        portrait: 'Portraits',
        portraitDesc: 'Individual, family, professional',
        landscape: 'Landscapes',
        landscapeDesc: 'Nature, urban, architecture',
        events: 'Events',
        eventsDesc: 'Weddings, celebrations, corporate',
        sports: 'Sports',
        sportsDesc: 'Action, intensity, performance',
        cta: 'Contact me',
      },
    },
    contact: {
      header: {
        label: 'Contact',
        title: 'Let’s work together',
        description: 'Available for your photography projects. Feel free to contact me to discuss your needs.',
      },
      info: {
        title: 'Let’s talk about your project',
        description: 'Whether you need a portrait, event coverage, or artistic photos, I’m here to create images with you that reflect your vision.',
        emailLabel: 'Email',
        phoneLabel: 'Phone',
        locationLabel: 'Location',
        mapTitle: 'Map of La Chaize-le-Vicomte',
      },
      form: {
        title: 'Send a message',
        name: 'Your name',
        email: 'Your email',
        phone: 'Your phone (optional)',
        phonePlaceholder: '06 12 34 56 78',
        projectType: 'Project type',
        message: 'Your message',
        projectSelectPlaceholder: 'Select a type',
        projectOptions: {
          portrait: 'Portrait',
          paysage: 'Landscape',
          evenement: 'Event',
          autre: 'Other',
        },
        messagePlaceholder: 'Describe your project...',
        status: {
          sending: 'Sending...',
          send: 'Send',
          successTitle: 'Message sent!',
          successDescription: 'Thank you for your message. I have received your request and will reply as soon as possible to discuss it.',
        },
        recaptcha: {
          label: 'Anti-spam verification',
          active: 'reCAPTCHA is enabled. Verification happens automatically when you submit the form.',
        },
      },
      errors: {
        required: 'Please enter your name, email and message.',
        invalidEmail: 'Please enter a valid email address.',
        invalidPhone: 'Please enter a valid phone number.',
        messageTooLong: 'Your message is too long. Please limit it to 2000 characters.',
        recaptchaNotReady: 'reCAPTCHA verification is not ready yet. Please wait.',
        recaptchaFailed: 'Anti-spam verification failed. Please try again.',
        sendFailed: 'Message sending failed. Please try again or contact me directly by email.',
      },
    },
    legal: {
      header: {
        label: 'Legal information',
        title: 'Legal notice',
        description: 'In accordance with French law n°2004-575 of June 21, 2004 for confidence in the digital economy.',
      },
      publisher: {
        title: 'Site publisher',
        intro: 'The site stevangaron.fr is published individually by:',
        body: 'This photography activity is carried out individually and is not, at this time, attached to any registered legal entity (no SIRET number, RCS number, or VAT number).',
      },
      publicationDirector: {
        title: 'Publication director',
        text: '..., also the site publisher (contact details above).',
      },
      hosting: {
        title: 'Hosting',
        intro: 'The site is hosted by:',
        providerName: 'GitHub, Inc.',
        providerUrl: 'github.com',
      },
      intellectualProperty: {
        title: 'Intellectual property',
        text: 'All photographs, texts, logos and graphic elements on this site are the exclusive property of {name}, unless otherwise noted. Any reproduction, representation, modification or distribution, in whole or in part, of this site or its contents, by any process whatsoever, is prohibited without prior written authorization.',
      },
      privacy: {
        title: 'Privacy policy',
        intro: 'This policy describes the personal information collected on the site stevangaron.fr and how it is used.',
        collected: 'Data collected: when you use the contact form, I may collect your name, email address, phone number (if you provide it), project type and your message. This information is only used to respond to your request.',
        purposes: 'Purposes: data is processed to enable contact, prepare a personalized response and, if necessary, set up a photography project.',
        thirdParties: 'Service providers and third-party services: the form may transmit your data to an external email management service to ensure message delivery. No personal data is sold or transferred for commercial purposes.',
        cookies: 'Cookies and local storage: this site does not use advertising tracking cookies. Local storage may be used to remember your theme preference (light or dark).',
        retention: 'Retention: data is kept only as long as necessary to process your request, then deleted or anonymized, unless legal obligations or proof of a business relationship require retention.',
        rights: 'Your rights: you may request access, correction, deletion or limitation of processing of your personal data at any time. You may also withdraw your consent or make a complaint to the CNIL if you feel your rights are not respected.',
        contact: 'Contact: to exercise your rights or for any question regarding this policy, you may contact me at {email}.',
      },
      credits: {
        title: 'Credits',
        text: 'Design and development of the site: {name}.',
      },
    },
    footer: {
      rights: '© {year} {name}. All rights reserved.',
      privacy: 'Privacy policy',
      legal: 'Legal notice',
      emailAria: 'Send an email',
      instagramAria: 'View Instagram',
    },
    categories: {
      portraits: 'Portraits',
      sports: 'Sports',
      events: 'Events',
      nature: 'Nature / Landscapes',
    },
  },
} as const;

function getNestedTranslation(locale: Locale, path: string): string | undefined {
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, translations[locale] as unknown) as string | undefined;
}

export function t(locale: Locale, path: string) {
  return getNestedTranslation(locale, path) ?? getNestedTranslation('fr', path) ?? path;
}

export function format(locale: Locale, path: string, params: Record<string, string>) {
  return t(locale, path).replace(/\{(\w+)\}/g, (_, key) => params[key] ?? `{${key}}`);
}

export function getSeoTranslations(locale: Locale) {
  return {
    '/': {
      title: locale === 'fr'
        ? 'Stevan Garon — Photographe & Télépilote de drone en Vendée'
        : 'Stevan Garon — Photographer & Drone Pilot in Vendée',
      description: locale === 'fr'
        ? 'Photographe professionnel à La Chaize-le-Vicomte (Vendée). Portraits, événements, sports et prises de vue aériennes par drone.'
        : 'Professional photographer in La Chaize-le-Vicomte (Vendée). Portraits, events, sports and aerial drone photography.',
    },
    '/portfolio': {
      title: locale === 'fr'
        ? 'Portfolio photo — Portraits, Événements, Sports, Nature | Stevan Garon'
        : 'Photography Portfolio — Portraits, Events, Sports, Landscapes | Stevan Garon',
      description: locale === 'fr'
        ? 'Découvrez mes photographies : portraits, événements, sports et paysages, réalisées en Vendée et alentours.'
        : 'Discover my photographs: portraits, events, sports and landscapes, shot in Vendée and nearby regions.',
    },
    '/about': {
      title: locale === 'fr'
        ? 'À propos — Stevan Garon, photographe en Vendée'
        : 'About — Stevan Garon, Photographer in Vendée',
      description: locale === 'fr'
        ? "Parcours, matériel et approche d'un photographe et télépilote de drone basé en Vendée."
        : 'Journey, gear and approach of a photographer and drone pilot based in Vendée.',
    },
    '/contact': {
      title: locale === 'fr'
        ? 'Contact — Réservez une séance photo en Vendée'
        : 'Contact — Book a photo session in Vendée',
      description: locale === 'fr'
        ? 'Contactez Stevan Garon pour vos séances portrait, événements ou prises de vue par drone en Vendée.'
        : 'Contact Stevan Garon for your portrait sessions, events or drone photo shoots in Vendée.',
    },
    '/mentions-legales': {
      title: locale === 'fr'
        ? 'Mentions légales — Stevan Garon Photographe'
        : 'Legal notice — Stevan Garon Photographer',
      description: locale === 'fr'
        ? "Informations légales relatives à l'édition et à l'hébergement du site stevangaron.fr."
        : 'Legal information related to the publication and hosting of the site stevangaron.fr.',
    },
  } as const;
}

export function getCategoryName(locale: Locale, slug: string) {
  const mapping = {
    fr: {
      portraits: 'Portraits',
      sports: 'Sports',
      evenements: 'Événements',
      nature: 'Nature / Paysages',
    },
    en: {
      portraits: 'Portraits',
      sports: 'Sports',
      evenements: 'Events',
      nature: 'Nature / Landscapes',
    },
  } as const;

  return (mapping[locale] as Record<string, string>)[slug] ?? slug;
}

const LocaleContext = createContext<Locale>('fr');

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function useTranslation() {
  const locale = useLocale();
  return (path: string, params?: Record<string, string>) =>
    params ? format(locale, path, params) : t(locale, path);
}
