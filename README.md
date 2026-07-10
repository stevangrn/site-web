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
- Vite : pour lancer le projet rapidement,
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
- src/hooks/useData.ts : charge les données depuis src/data/content.ts.
- src/lib/supabase.ts : ne contient plus que les types de données utilisées par le site.
- src/index.css : styles globaux et variables de thème.

## 4. Plan du site

Le site est organisé en 4 pages principales :

- Accueil : présente le photographe, son titre, une courte bio et deux boutons d'action pour voir le portfolio ou contacter.
- Portfolio : affiche les photos disponibles, permet de filtrer par catégorie et d'ouvrir une photo en grand dans une lightbox.
- À propos : raconte l'histoire du photographe, ses services et son parcours.
- Contact : propose un formulaire de contact, les coordonnées et une zone de confirmation après envoi.

## 5. Installation

1. Ouvrir le projet dans VS Code.
2. Installer les dépendances :
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
Modifie la liste `categories`. Chaque catégorie a un nom, un "slug" (identifiant sans espace ni accent), une description et un ordre d'affichage.

### Ajouter ou modifier des photos
Modifie la liste `photos`. Pour ajouter une photo :
1. Copie un bloc `{ ... }` existant.
2. Donne-lui un `id` unique (ex: `'photo-9'`).
3. Renseigne le titre, la description, `image_url` (lien vers l'image),
   la catégorie via `catId('slug-de-la-categorie')`,
   `featured: true` si la photo doit apparaître en avant sur l'accueil,
   et `display_order` pour l'ordre d'affichage.

Après modification, sauvegarde le fichier : le site se met à jour automatiquement si `npm run dev` est lancé.

### Ajouter une nouvelle page
1. Créer un nouveau fichier dans src/pages/.
2. Le faire apparaître dans src/App.tsx.
3. Ajouter un lien dans la navbar si nécessaire.

## 7. Comment comprendre le flux principal

1. L'application démarre dans src/App.tsx.
2. Elle récupère les données avec useData(), qui lit src/data/content.ts.
3. Elle choisit la page à afficher selon l'URL (avec le hash).
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

## 10. Conseils pour un étudiant débutant

- Commencer par lire dans cet ordre : App.tsx, Layout.tsx, Navbar.tsx, pages/Home.tsx.
- Modifier un petit élément à la fois.
- Tester après chaque changement avec npm run dev.
- Ne pas hésiter à comparer un composant simple avec un autre pour comprendre la logique.
