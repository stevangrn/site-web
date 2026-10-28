#!/usr/bin/env node
// ============================================================================
// Petit serveur qui imite GitHub Pages, pour les tests
// ============================================================================
// Sert le dossier dist/ (le site construit par "npm run build") comme le fait
// GitHub Pages en ligne :
//   - /about       -> redirection 301 vers /about/ (le "/" final) ;
//   - /about/      -> dist/about/index.html ;
//   - adresse inconnue -> dist/404.html, avec le code 404.
//
// Utilisé automatiquement par les tests (voir playwright.config.ts). On peut
// aussi le lancer à la main pour voir le site exactement comme en ligne :
//   node scripts/serve-dist.mjs        (puis ouvrir http://localhost:4180)
// ============================================================================

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.argv[2] || process.env.PORT || 4180);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

if (!fs.existsSync(path.join(root, 'index.html'))) {
  console.error('Le dossier dist/ est vide : lance d\'abord "npm run build".');
  process.exit(1);
}

function send(res, status, file) {
  res.writeHead(status, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}

http
  .createServer((req, res) => {
    const url = new URL(req.url || '/', 'http://localhost');
    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      pathname = '/';
    }
    const file = path.join(root, pathname);

    // Interdit de sortir du dossier dist/ (adresses du type /../../)
    if (!file.startsWith(root)) {
      res.writeHead(403);
      res.end();
      return;
    }

    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if (!pathname.endsWith('/')) {
        res.writeHead(301, { Location: `${pathname}/${url.search}` });
        res.end();
        return;
      }
      const index = path.join(file, 'index.html');
      if (fs.existsSync(index)) {
        send(res, 200, index);
        return;
      }
    } else if (fs.existsSync(file)) {
      send(res, 200, file);
      return;
    }

    send(res, 404, path.join(root, '404.html'));
  })
  .listen(port, () => {
    console.log(`Site servi sur http://localhost:${port} (comme sur GitHub Pages)`);
  });
