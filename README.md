# Portfolio personnel - Guide de démarrage

Ce projet est un site web de portfolio personnel construit avec React, TypeScript, Vite et Tailwind CSS.

Il a été pensé pour être simple à lire et à modifier, même par un étudiant de deuxième année en BUT Réseaux et Télécommunications.

## 1. Objectif du projet

Ce site permet de :
- présenter un portfolio photo ou artistique,
- afficher des informations sur la personne (nom, bio, contact),
- modifier facilement le contenu du site en éditant un seul fichier,
- naviguer entre plusieurs pages sans recharger la page entière.

## 2. Technologies utilisées

- React : pour construire les composants de la page,
- TypeScript : pour ajouter des types et éviter certaines erreurs,
- Vite (version 8) : pour lancer le projet en local et construire le site,
- Tailwind CSS : pour le style des pages.

Le site n'utilise plus de base de données externe (Supabase a été retiré) :
tout le contenu (profil, catégories, photos) est stocké directement dans le
code, dans le fichier `src/data/content.ts`. C'est plus simple à faire
tourner et à entretenir, sans compte externe ni clé à configurer.

## 3. Structure du projet

- src/App.tsx : point d'entrée principal de l'application.
- src/components/ : composants réutilisables comme la navbar, le footer et le layout.
- src/pages/ : les différentes pages du site : accueil, portfolio, à propos, contact.
- src/data/content.ts : **le fichier à modifier pour changer le contenu du site** (profil, catégories, photos).
- src/hooks/useData.ts : fournit les données de src/data/content.ts aux pages.
- src/lib/types.ts : les types des données utilisées par le site (profil, catégories, photos).
- src/lib/photos.ts : choix de la photo d'accueil, de la photo À propos et de la sélection de l'accueil.
- src/lib/seo.ts : titres, descriptions, canonical, fil d'Ariane et images de partage de chaque page, et images optimisées (Cloudinary).
- src/lib/router.ts : navigation entre les pages par de vraies adresses.
- src/index.css : styles globaux et variables de thème.
- src/entry-server.tsx et scripts/prerender.mjs : génération d'une page HTML par adresse au moment du build (voir « Pré-rendu » plus bas), y compris le préchargement de l'image d'accueil.
- vite.config.ts : configuration du build, dont la liste des navigateurs pris en charge.
- .github/ : déploiement automatique, vérifications et mises à jour automatiques (voir la partie 9).
- tests/ et playwright.config.ts : les tests automatiques du site (voir « Tests automatiques »).
- scripts/serve-dist.mjs : petit serveur qui affiche le site construit exactement comme GitHub Pages (utilisé par les tests).

## 4. Plan du site

Le site est organisé en 4 pages principales :

- Accueil : présente le photographe, son titre, une courte bio et deux boutons d'action pour voir le portfolio ou contacter.
- Portfolio (/portfolio/) : s'ouvre sur le choix d'une catégorie (une carte par catégorie avec sa photo de couverture). Chaque catégorie a sa propre page (/portfolio/sports/, /portfolio/nature/...), où l'on peut ouvrir une photo en grand dans une lightbox.
- À propos : raconte l'histoire du photographe, ses services et son parcours.
- Contact : propose un formulaire de contact, les coordonnées et une zone de confirmation après envoi.

Les icônes du site (onglet du navigateur, écran d'accueil des téléphones) sont dans `public/` : `favicon.ico`, `favicon-32x32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, et le manifeste `site.webmanifest`.

## 5. Installation

1. Avoir Node.js installé, en version 24 de préférence (minimum 20.19) : `node -v`
   dans un terminal affiche la version. Sinon, la télécharger sur nodejs.org
   (version « LTS »).
2. Ouvrir le projet dans VS Code, puis installer les dépendances :
   ```bash
   npm install
   ```
3. Lancer le projet :
   ```bash
   npm run dev
   ```
4. Ouvrir l'adresse affichée dans le terminal (en général http://localhost:5173).

Aucune configuration supplémentaire (pas de compte, pas de clé) n'est nécessaire.

## 6. Comment modifier le contenu

Tout se passe dans **src/data/content.ts**. Ce fichier contient trois listes,
avec des commentaires expliquant chaque champ :

### Modifier les informations du profil
En haut du fichier, modifie l'objet `profile` : nom, titre, bio, email, téléphone, localisation, réseaux sociaux.

### Modifier les catégories
Modifie la liste `categories`. Chaque catégorie a un nom, un "slug" (identifiant sans espace ni accent), une description, une photo de couverture (`cover_photo_id`, l'id d'une photo, ex: `'photo-34'`) et un ordre d'affichage.

### Ajouter ou modifier des photos
Le plus simple : la commande
```bash
npm run add:photo
```
pose les questions (titre, description, lien de l'image, catégorie) et ajoute la photo à la fin de la liste `photos`.

Pour le faire à la main, modifie la liste `photos` :
1. Copie un bloc `{ ... }` existant.
2. Donne-lui un `id` unique (ex: `'photo-9'`).
3. Renseigne le titre, la description, `image_url` (lien vers l'image),
   la catégorie via `catId('slug-de-la-categorie')`,
   `featured_home: true` si la photo doit apparaître dans la sélection de l'accueil,
   `hero: true` pour en faire l'image de fond de l'accueil,
   et `display_order` pour l'ordre d'affichage.

Après modification, sauvegarde le fichier : le site se met à jour automatiquement si `npm run dev` est lancé.

### Ajouter une nouvelle page
1. Créer un nouveau fichier dans src/pages/.
2. Le faire apparaître dans src/App.tsx.
3. Ajouter un lien dans la navbar si nécessaire.

## 7. Comment comprendre le flux principal

1. L'application démarre dans src/main.tsx, qui affiche src/App.tsx.
2. Elle récupère les données avec useData(), qui lit src/data/content.ts.
3. Elle choisit la page à afficher selon la vraie URL (/, /portfolio/, /portfolio/sports/, /about/, /contact/), décodée par src/lib/router.ts.
4. Le layout global affiche la navbar, le contenu et le footer.

## 8. Modifier le thème

Le thème clair/sombre est géré dans :
- src/App.tsx
- src/index.css

Pour changer les couleurs, il suffit de modifier les variables CSS dans src/index.css.

## 9. Vérifier le projet

Pour vérifier que tout fonctionne :
```bash
npm run build
```

Si la commande réussit, le site est prêt à être publié (le résultat est dans le dossier `dist/`).
Pour voir ce résultat dans le navigateur : `npm run preview`.

Avant de publier, lancer aussi :
```bash
npm run check
```
qui vérifie les types (TypeScript) puis le code (ESLint). Ces mêmes
vérifications sont faites automatiquement avant chaque mise en ligne.

### Tests automatiques

Le dossier `tests/` contient des tests qui ouvrent le site construit dans un
vrai navigateur (Chromium, avec l'outil Playwright) et vérifient :

- que chaque page du sitemap s'affiche sans erreur, en thème clair et sombre,
  avec son titre, sa description et son adresse officielle ;
- qu'aucun lien ni fichier interne n'est cassé, et qu'une adresse inconnue
  donne bien la page « introuvable » (code 404) ;
- les images de partage, le fil d'Ariane pour Google et le préchargement de
  l'image d'accueil ;
- les parcours d'un visiteur, sur ordinateur et sur mobile : choisir une
  catégorie, ouvrir une photo, le menu, le thème, le bandeau cookies, le
  formulaire de contact (envoi réussi et panne de l'envoi).

Les photos et les services extérieurs (envoi du formulaire, mesure
d'audience) sont simulés : les tests n'envoient jamais de vrai message.

Ils se lancent tout seuls avant chaque mise en ligne. Pour les lancer sur ton
ordinateur :
```bash
npx playwright install chromium   # une seule fois : installe le navigateur des tests
npm run build
npm test
```
Si un test échoue, le message indique la page et ce qui ne va pas. Sur
GitHub, le rapport détaillé se télécharge en bas de la page du workflow
(rubrique « Artifacts »).

### Une vraie page HTML par adresse (pré-rendu)

`npm run build` fait trois choses :
1. construit le site normal dans `dist/` ;
2. construit `src/entry-server.tsx` dans `dist-ssr/` (une version du site qui
   tourne sans navigateur) ;
3. lance `scripts/prerender.mjs`, qui écrit pour chaque adresse un fichier
   HTML déjà rempli : `dist/index.html`, `dist/portfolio/index.html`,
   `dist/portfolio/sports/index.html`, `dist/about/index.html`..., plus
   `dist/404.html` et `dist/sitemap.xml`.

Chaque page arrive donc avec son contenu, son titre, sa description et son
image de partage, même sans JavaScript : c'est ce que lisent Google, Bing et
les aperçus de partage (WhatsApp, Facebook, LinkedIn...). Une nouvelle
catégorie ajoutée dans `src/data/content.ts` a automatiquement sa page
(`/portfolio/<slug>/`) et sa place dans le sitemap.

Point d'attention si tu modifies les composants : le premier affichage ne doit
dépendre que de l'adresse de la page. Tout ce qui dépend du navigateur
(`window`, `localStorage`, paramètres `?photo=`...) se lit dans un `useEffect`,
sinon la page générée au build et celle du navigateur ne correspondent plus
(voir le commentaire en haut de `src/App.tsx`).

### Déploiement sur GitHub Pages

Le site est publié automatiquement sur GitHub Pages à chaque `git push` sur
la branche `main`, par le workflow `.github/workflows/deploy.yml` : il installe
les dépendances, lance les vérifications, construit le site (avec le
pré-rendu), lance les tests automatiques et publie le dossier `dist/`. Si une
vérification ou un test échoue, rien n'est publié et le site en ligne reste
tel quel.

En développement (`npm run dev`), Vite affiche le site sans pré-rendu, aucune
configuration n'est nécessaire.

Le workflow `.github/workflows/verifier.yml` fait les mêmes vérifications et
les mêmes tests sur chaque *pull request*, sans rien publier.

### Mises à jour automatiques (Dependabot)

Une fois par mois, GitHub regarde si les outils du site (`package.json`) et
les actions des workflows ont des mises à jour. S'il y en a, il ouvre une
*pull request* qui les regroupe (onglet « Pull requests » du dépôt), et le
workflow de vérification la teste tout seul :

- coche verte : cliquer sur « Merge pull request ». Le site est mis à jour et
  redéployé automatiquement ;
- croix rouge : ne pas fusionner, la mise à jour casse quelque chose.

Seules les petites mises à jour, compatibles, sont proposées. Les grandes
versions (React 19, Tailwind CSS 4...) demandent des changements dans le code
et se font à la main. Les réglages sont dans `.github/dependabot.yml`.

## 10. Conseils pour un étudiant débutant

- Commencer par lire dans cet ordre : App.tsx, Layout.tsx, Navbar.tsx, pages/Home.tsx.
- Modifier un petit élément à la fois.
- Tester après chaque changement avec npm run dev.
- Ne pas hésiter à comparer un composant simple avec un autre pour comprendre la logique.
