// ============================================================================
// Génération des pages au build (pré-rendu)
// ============================================================================
// Ce fichier n'est utilisé que pendant "npm run build", jamais dans le
// navigateur. Il produit, pour chaque adresse du site, le HTML de la page et
// les balises de son <head>. Le script scripts/prerender.mjs les écrit
// ensuite dans dist/ (un fichier index.html par page).
//
// Résultat : Google, Bing, les aperçus de partage (WhatsApp, Facebook...)
// et les visiteurs reçoivent une page déjà remplie, avec le bon titre et la
// bonne description, sans attendre le JavaScript.
// ============================================================================

// Ce fichier ne sert qu'au build : la règle "fast refresh" (rechargement à
// chaud des composants en développement) ne le concerne pas.
/* eslint-disable react-refresh/only-export-components */

import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { categories } from './data/content';
import { parsePath, portfolioPath, resolveLocation, toHref, validRoutes } from './lib/router';
import { buildHeadTags, getPageMeta, SITE_URL } from './lib/seo';

export { SITE_URL };

// Toutes les pages à générer : les pages fixes et une page par catégorie
// du portfolio (/portfolio/sports/...). Une nouvelle catégorie ajoutée dans
// content.ts aura donc automatiquement sa page et sa place dans le sitemap.
export function getPagePaths(): string[] {
  return [...validRoutes, ...categories.map((category) => portfolioPath(category.slug))].map(toHref);
}

// HTML d'une page et balises de son <head>.
export function render(path: string): { html: string; head: string } {
  const page = resolveLocation(parsePath(path), categories);
  const html = renderToString(
    <StrictMode>
      <App initialPath={path} />
    </StrictMode>
  );
  return { html, head: buildHeadTags(getPageMeta(page.location, page.category)) };
}
