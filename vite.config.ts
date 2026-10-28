import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
// "npm run build" lance deux constructions (voir package.json) : le site
// normal, puis la version "serveur" (isSsrBuild) qui sert seulement à générer
// le HTML des pages (scripts/prerender.mjs).
//
// Le préchargement de l'image d'accueil, qui était fait ici, est maintenant
// écrit directement dans la page d'accueil générée (src/entry-server.tsx).
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Navigateurs pris en charge : les mêmes qu'avec Vite 5 (iPhone sous
    // iOS 14 et plus, Chrome, Firefox et Edge de 2020 et plus). Sans cette
    // ligne, Vite 8 écrit du CSS que Safari ne comprend qu'à partir
    // d'iOS 16.4 : sur les iPhone plus anciens, la mise en page ne
    // s'adapterait plus à la taille de l'écran.
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    // Inutile de recopier public/ (images, sitemap...) dans dist-ssr/.
    copyPublicDir: !isSsrBuild,
  },
}));
