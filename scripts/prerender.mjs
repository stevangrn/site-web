#!/usr/bin/env node
// ============================================================================
// Pré-rendu : une vraie page HTML par adresse
// ============================================================================
// Lancé automatiquement à la fin de "npm run build", après :
//   1. vite build                      -> le site normal, dans dist/
//   2. vite build --ssr ...            -> src/entry-server.tsx, dans dist-ssr/
//
// Pour chaque page du site, ce script prend dist/index.html comme modèle et y
// écrit :
//   - les balises de la page (titre, description, canonical, partage...) à la
//     place du bloc <!--page-meta--> ... <!--/page-meta--> ;
//   - le contenu de la page à l'intérieur de <div id="root"></div>.
// Il écrit aussi dist/404.html (page introuvable) et dist/sitemap.xml.
// ============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const serverEntry = path.join(root, 'dist-ssr', 'entry-server.js');

const { render, getPagePaths, getPageImages, SITE_URL } = await import(pathToFileURL(serverEntry).href);

const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf8');
const META_BLOCK = /<!--page-meta-->[\s\S]*?<!--\/page-meta-->/;
const ROOT_TAG = '<div id="root"></div>';

if (!META_BLOCK.test(template) || !template.includes(ROOT_TAG)) {
  throw new Error(
    'dist/index.html ne contient pas le bloc <!--page-meta--> ou <div id="root"></div> : vérifie index.html.'
  );
}

function buildPage(pagePath) {
  const { html, head } = render(pagePath);
  return template
    .replace(META_BLOCK, () => `<!--page-meta-->\n    ${head}\n    <!--/page-meta-->`)
    .replace(ROOT_TAG, () => `<div id="root">${html}</div>`);
}

async function writePage(file, content) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content, 'utf8');
}

const pagePaths = getPagePaths();

for (const pagePath of pagePaths) {
  const file = pagePath === '/' ? path.join(distDir, 'index.html') : path.join(distDir, pagePath, 'index.html');
  await writePage(file, buildPage(pagePath));
  console.log(`  page générée : ${pagePath}`);
}

// Page affichée par GitHub Pages pour toute adresse inconnue
await writePage(path.join(distDir, '404.html'), buildPage('/404'));
console.log('  page générée : 404.html');

// Sitemap : la liste des pages, générée à partir des mêmes adresses, avec
// pour chacune ses photos (balises <image:image>, lues par Google Images).
const escapeXml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

let imageCount = 0;
const sitemapEntries = pagePaths.map((pagePath) => {
  const images = getPageImages(pagePath);
  imageCount += images.length;
  return [
    '  <url>',
    `    <loc>${escapeXml(`${SITE_URL}${pagePath}`)}</loc>`,
    ...images.map((image) => `    <image:image>\n      <image:loc>${escapeXml(image)}</image:loc>\n    </image:image>`),
    '  </url>',
  ].join('\n');
});

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
  ...sitemapEntries,
  '</urlset>',
  '',
].join('\n');
await fs.writeFile(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');
console.log(`  sitemap.xml : ${pagePaths.length} adresses, ${imageCount} images`);
