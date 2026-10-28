// ============================================================================
// Outils communs aux tests
// ============================================================================
// - Les photos (Cloudinary) et les services extérieurs sont remplacés par de
//   fausses réponses : les tests ne dépendent pas d'Internet, sont rapides et
//   n'envoient jamais de vrai message ni de vraie mesure d'audience.
// - Chaque test vérifie automatiquement, à la fin, qu'il n'y a eu aucune
//   erreur JavaScript, aucune erreur dans la console et aucun fichier du site
//   introuvable (erreur 404) pendant la visite.
// ============================================================================

import { test as base, expect, type Page } from '@playwright/test';

export { expect };

// Adresse officielle du site, écrite dans les balises canonical et de partage
export const SITE_URL = 'https://stevangaron.fr';

// Adresse qui n'existe pas, utilisée pour tester la page "introuvable"
export const NOT_FOUND_PATH = '/page-qui-n-existe-pas/';

// Petite image grise qui remplace les photos pendant les tests
const IMAGE_STUB =
  '<svg xmlns="http://www.w3.org/2000/svg" width="4" height="3"><rect width="4" height="3" fill="#888"/></svg>';

async function stubExternalRequests(page: Page) {
  await page.route(
    (url) => url.hostname !== 'localhost',
    async (route) => {
      const { hostname } = new URL(route.request().url());
      if (hostname === 'res.cloudinary.com') {
        await route.fulfill({ contentType: 'image/svg+xml', body: IMAGE_STUB });
      } else if (hostname.endsWith('googletagmanager.com')) {
        await route.fulfill({ contentType: 'text/javascript', body: '' });
      } else {
        await route.fulfill({ status: 204, body: '' });
      }
    }
  );
}

// Erreurs relevées pendant chaque test, page par page
const errorsByPage = new WeakMap<Page, string[]>();

// Pour un test qui provoque exprès une erreur (ex : panne du service d'envoi
// du formulaire) : vérifie qu'elle a bien eu lieu, puis la retire de la liste
// pour qu'elle ne fasse pas échouer le test.
export function expectExpectedError(page: Page, text: string) {
  const errors = errorsByPage.get(page) ?? [];
  const index = errors.findIndex((error) => error.includes(text));
  expect(index, `l'erreur attendue « ${text} » a bien eu lieu`).toBeGreaterThanOrEqual(0);
  errors.splice(index, 1);
}

// Évite le bandeau cookies (choix déjà fait) pour les tests qui ne le
// concernent pas : sur mobile, il cacherait le bas de l'écran.
export async function skipCookieBanner(page: Page) {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem('portfolio-consent', 'declined');
    } catch {
      // stockage indisponible : le bandeau s'affichera, sans gêner le test
    }
  });
}

export const test = base.extend({
  page: async ({ page, baseURL }, provide) => {
    const origin = new URL(baseURL ?? 'http://localhost').origin;
    const errors: string[] = [];
    errorsByPage.set(page, errors);
    await stubExternalRequests(page);

    page.on('pageerror', (error) => errors.push(`Erreur JavaScript : ${error.message}`));
    page.on('console', (message) => {
      if (message.type() !== 'error') return;
      // Les fichiers introuvables sont suivis juste en dessous, adresse par adresse.
      if (message.text().startsWith('Failed to load resource')) return;
      errors.push(`Console : ${message.text()}`);
    });
    page.on('response', (response) => {
      const url = new URL(response.url());
      if (url.origin !== origin || response.status() < 400) return;
      // La page "introuvable" testée exprès répond 404 : c'est voulu.
      const expectedNotFound =
        response.status() === 404 &&
        response.request().resourceType() === 'document' &&
        url.pathname === NOT_FOUND_PATH;
      if (!expectedNotFound) errors.push(`Erreur ${response.status()} sur ${url.pathname}`);
    });

    await provide(page);

    expect(errors, 'aucune erreur pendant le test').toEqual([]);
  },
});
