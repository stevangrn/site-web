// ============================================================================
// Tests page par page
// ============================================================================
// La liste des pages vient du sitemap généré par "npm run build"
// (dist/sitemap.xml) : une nouvelle page ou une nouvelle catégorie est donc
// testée automatiquement, sans rien ajouter ici.
// ============================================================================

import fs from 'node:fs';
import { expect, NOT_FOUND_PATH, SITE_URL, test } from './outils';

function readSitemapPaths(): string[] {
  const file = 'dist/sitemap.xml';
  if (!fs.existsSync(file)) {
    throw new Error('dist/sitemap.xml est introuvable : lance d\'abord "npm run build".');
  }
  const xml = fs.readFileSync(file, 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
}

const PAGES = readSitemapPaths();

test('le sitemap liste toutes les pages', () => {
  expect(PAGES).toEqual(
    expect.arrayContaining(['/', '/portfolio/', '/about/', '/contact/', '/mentions-legales/', '/portfolio/sports/'])
  );
});

// Chaque page, dans les deux thèmes : elle s'affiche, sans erreur, avec un
// seul titre principal (h1), son titre d'onglet et son adresse officielle.
for (const path of PAGES) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${path} s'affiche sans erreur (thème ${theme === 'light' ? 'clair' : 'sombre'})`, async ({ page }) => {
      await page.addInitScript((value) => {
        window.localStorage.setItem('portfolio-theme', value);
      }, theme);

      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.title()).not.toBe('');
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE_URL}${path}`);
      // Laisse le temps au JavaScript de prendre le relais sur la page générée
      // (une différence entre les deux apparaîtrait comme une erreur).
      await page.waitForLoadState('networkidle');
    });
  }
}

test('les pages arrivent déjà remplies, sans attendre le JavaScript', async ({ request }) => {
  const titles = new Map<string, string>();
  for (const path of PAGES) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();

    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
    expect(title, `${path} : titre de l'onglet`).not.toBe('');
    expect(titles.get(title), `${path} : même titre qu'une autre page`).toBeUndefined();
    titles.set(title, path);

    expect(html, `${path} : description`).toMatch(/<meta name="description" content="[^"]{50,}"/);
    expect(html, `${path} : contenu de la page`).toMatch(/<div id="root"><[\s\S]*<h1/);
  }
});

test('aucun lien ni fichier interne cassé', async ({ request }) => {
  const links = new Set<string>();
  for (const path of PAGES) {
    const html = await (await request.get(path)).text();
    for (const match of html.matchAll(/(?:href|src)="(\/[^"#]*)/g)) {
      links.add(match[1].replace(/&amp;/g, '&'));
    }
  }
  expect(links.size).toBeGreaterThan(10);
  for (const link of links) {
    const response = await request.get(link);
    expect(response.status(), `lien ${link}`).toBe(200);
  }
});

test('adresse inconnue : page « introuvable » avec le code 404', async ({ page, request }) => {
  expect((await request.get(NOT_FOUND_PATH)).status()).toBe(404);
  expect((await request.get('/portfolio/categorie-inconnue/')).status()).toBe(404);

  const response = await page.goto(NOT_FOUND_PATH);
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Page introuvable');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test('image de partage : la couverture pour chaque catégorie, le logo ailleurs', async ({ request }) => {
  for (const path of PAGES) {
    const html = await (await request.get(path)).text();
    const image = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
    if (/^\/portfolio\/[^/]+\/$/.test(path)) {
      expect(image, path).toMatch(/^https:\/\/res\.cloudinary\.com\/.+\/c_fill,g_auto,w_1200,h_630,q_auto,f_jpg\//);
      expect(html, path).toContain('<meta property="og:image:type" content="image/jpeg" />');
    } else {
      expect(image, path).toBe(`${SITE_URL}/og-image.png`);
    }
  }
});

test("l'image d'accueil est préchargée sur l'accueil seulement", async ({ request }) => {
  const preload = /<link rel="preload" as="image" href="https:\/\/res\.cloudinary\.com\//;
  expect(await (await request.get('/')).text()).toMatch(preload);
  expect(await (await request.get('/about/')).text()).not.toMatch(preload);
});

test("fil d'Ariane pour Google : chaque page sauf l'accueil", async ({ request }) => {
  const expected: Record<string, string[]> = {
    '/portfolio/': ['Accueil', 'Portfolio'],
    '/portfolio/sports/': ['Accueil', 'Portfolio', 'Sports'],
    '/about/': ['Accueil', 'À propos'],
    '/contact/': ['Accueil', 'Contact'],
    '/mentions-legales/': ['Accueil', 'Mentions légales'],
  };

  for (const path of PAGES) {
    const html = await (await request.get(path)).text();
    const json = html.match(/<script type="application\/ld\+json" data-seo-breadcrumb="true">([^<]+)<\/script>/)?.[1];

    if (path === '/') {
      expect(json, "pas de fil d'Ariane sur l'accueil").toBeUndefined();
      continue;
    }
    expect(json, `${path} : fil d'Ariane présent`).toBeDefined();
    const breadcrumb = JSON.parse(json ?? '{}');
    expect(breadcrumb['@type']).toBe('BreadcrumbList');

    const items: { position: number; name: string; item: string }[] = breadcrumb.itemListElement;
    expect(items.map((item) => item.position)).toEqual(items.map((_, index) => index + 1));
    expect(items[0].item).toBe(`${SITE_URL}/`);
    // Le dernier élément est la page elle-même
    expect(items[items.length - 1].item).toBe(`${SITE_URL}${path}`);
    if (expected[path]) expect(items.map((item) => item.name)).toEqual(expected[path]);
  }
});

test('textes alternatifs des photos : une vraie description, sans mots-clés ajoutés', async ({ request }) => {
  for (const path of PAGES) {
    const html = await (await request.get(path)).text();
    const content = html.split('<div id="root">')[1] ?? '';
    const images = [...content.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
    const alts = images.map((img) =>
      img
        .match(/\salt="([^"]*)"/)?.[1]
        ?.replace(/&#x27;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
    );

    for (const alt of alts) {
      expect(alt, `${path} : une image n'a pas d'attribut alt`).toBeDefined();
      expect(alt, `${path} : mots-clés ajoutés au texte alternatif`).not.toMatch(/\| Stevan Garon/);
    }

    // Pages de catégorie : chaque photo (hébergée sur Cloudinary, donc hors
    // logo) a sa propre description
    if (/^\/portfolio\/[^/]+\/$/.test(path)) {
      const described = alts.filter(
        (alt, index): alt is string => !!alt && images[index].includes('res.cloudinary.com')
      );
      expect(described.length, `${path} : photos décrites`).toBeGreaterThan(0);
      expect(new Set(described).size, `${path} : deux photos ont le même texte`).toBe(described.length);
      for (const alt of described) expect(alt.length, `${path} : « ${alt} » trop court`).toBeGreaterThanOrEqual(20);
    }
  }
});

test('sitemap : les photos de chaque catégorie sont déclarées à Google Images', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  // React sépare les morceaux de texte par des commentaires <!-- --> : on les retire
  const chooser = (await (await request.get('/portfolio/')).text()).replace(/<!-- -->/g, '');

  for (const block of xml.split('<url>').slice(1)) {
    const page = new URL(block.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? '').pathname;
    const images = [...block.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((match) => match[1]);
    for (const image of images) expect(image, page).toMatch(/^https:\/\/res\.cloudinary\.com\//);

    const slug = page.match(/^\/portfolio\/([^/]+)\/$/)?.[1];
    if (slug) {
      // Autant d'images que de photos annoncées sur la carte de la catégorie
      // (y compris celles cachées derrière « Charger plus »)
      const announced = chooser.match(new RegExp(`href="/portfolio/${slug}/"[\\s\\S]*?(\\d+) photos`))?.[1];
      expect(images.length, `${page} : images du sitemap`).toBe(Number(announced));
    }
    if (page === '/') expect(images.length, 'accueil : images du sitemap').toBeGreaterThan(0);
  }
});

test('photos du portfolio : leur taille est connue avant le chargement', async ({ request }) => {
  const html = await (await request.get('/portfolio/sports/')).text();
  const grid = [...html.matchAll(/<img\b[^>]*q_auto:eco[^>]*>/g)].map((match) => match[0]);
  expect(grid.length).toBeGreaterThan(0);
  for (const img of grid) expect(img).toMatch(/\swidth="\d+" height="\d+"/);
  // Une seule photo est téléchargée en priorité (la première)
  expect(grid.filter((img) => img.includes('fetchpriority="high"'))).toHaveLength(1);
});

test("accueil : le titre principal présente le métier et le nom", async ({ request }) => {
  const html = await (await request.get('/')).text();
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '').replace(/<[^>]+>/g, '');
  expect(h1).toContain('Photographe et télépilote de drone');
  expect(h1).toContain('en Vendée');
  expect(h1).toContain('Stevan GARON');
});

test('chiffres : de vrais chiffres, plus de « 100 % »', async ({ request }) => {
  for (const path of ['/', '/about/']) {
    const html = await (await request.get(path)).text();
    expect(html, path).toContain('Événements photographiés');
    expect(html, path).toContain('Clubs, associations et écoles');
    expect(html, path).not.toContain('Retours positifs');
  }
});
