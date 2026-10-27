import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { photos } from './src/data/content';
import { pickHeroPhoto } from './src/lib/photos';
import { buildCloudinarySrcSet, HERO_DEFAULT_WIDTH, HERO_WIDTHS, optimizeCloudinaryUrl } from './src/lib/seo';

// ----------------------------------------------------------------------------
// Préchargement de l'image d'accueil
// ----------------------------------------------------------------------------
// L'image de fond de l'accueil est l'élément le plus lourd et le plus visible
// de la page. Sans aide, le navigateur ne la découvre qu'après avoir
// téléchargé et exécuté tout le JavaScript du site. Ce petit plugin écrit
// dans le <head> du HTML, au moment du build, un script de quelques lignes
// qui lance son téléchargement immédiatement.
//
// Le script ne précharge l'image que sur l'accueil ("/") : le même
// index.html est copié pour /portfolio/, /about/... (voir le workflow de
// déploiement), et ces pages n'affichent pas cette image.
//
// L'image est celle marquée "hero: true" dans src/data/content.ts : changer
// de photo d'accueil met donc aussi le préchargement à jour automatiquement.
function heroImagePreload(): Plugin {
  return {
    name: 'hero-image-preload',
    transformIndexHtml() {
      const hero = pickHeroPhoto(photos);
      if (!hero) return [];

      const href = optimizeCloudinaryUrl(hero.image_url, HERO_DEFAULT_WIDTH);
      const srcset = buildCloudinarySrcSet(hero.image_url, HERO_WIDTHS) ?? '';

      return [
        {
          tag: 'script',
          injectTo: 'head',
          children: `(function () {
  var path = window.location.pathname;
  if (path !== '/' && path !== '/index.html') return;
  var link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = ${JSON.stringify(href)};
  if (${JSON.stringify(srcset)}) {
    link.setAttribute('imagesrcset', ${JSON.stringify(srcset)});
    link.setAttribute('imagesizes', '100vw');
  }
  link.setAttribute('fetchpriority', 'high');
  document.head.appendChild(link);
})();`,
        },
      ];
    },
  };
}

// https://vitejs.dev/config/
// "npm run build" lance deux constructions (voir package.json) : le site
// normal, puis la version "serveur" (isSsrBuild) qui sert seulement à générer
// le HTML des pages (scripts/prerender.mjs).
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), heroImagePreload()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Inutile de recopier public/ (images, sitemap...) dans dist-ssr/.
    copyPublicDir: !isSsrBuild,
  },
}));
