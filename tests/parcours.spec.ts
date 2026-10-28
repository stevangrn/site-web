// ============================================================================
// Parcours de visite
// ============================================================================
// Ces tests reproduisent ce que fait un visiteur : choisir une catégorie,
// ouvrir une photo, changer de page, de thème, répondre au bandeau cookies,
// envoyer un message. Ils tournent sur ordinateur et sur mobile.
// ============================================================================

import { expect, expectExpectedError, skipCookieBanner, test } from './outils';

const FORM_ENDPOINT = 'https://formsubmit.co/**';

test.describe('avec le choix des cookies déjà fait', () => {
  test.beforeEach(async ({ page }) => {
    await skipCookieBanner(page);
  });

  test('portfolio : choisir une catégorie puis ouvrir une photo', async ({ page }) => {
    await page.goto('/portfolio/');
    await expect(page.locator('h1')).toHaveText('Mes créations');

    await page.locator('main a[href="/portfolio/sports/"]').first().click();
    await expect(page).toHaveURL(/\/portfolio\/sports\/$/);
    await expect(page.locator('h1')).toHaveText('Sports');
    await expect(page).toHaveTitle(/^Sports —/);

    await page.getByRole('button', { name: /^Agrandir la photo/ }).first().click();
    const lightbox = page.getByRole('dialog');
    await expect(lightbox).toBeVisible();
    await expect(page.locator('#lightbox-title')).not.toBeEmpty();

    await lightbox.getByRole('button', { name: "Fermer l'aperçu de la photo" }).click();
    await expect(lightbox).toBeHidden();
  });

  test('un lien vers une photo ouvre directement la visionneuse', async ({ page }) => {
    await page.goto('/portfolio/sports/?photo=photo-73');
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('#lightbox-title')).toHaveText('Basketteuse en plein saut pour marquer un panier');
  });

  test('les anciennes adresses du portfolio mènent à la bonne page', async ({ page }) => {
    await page.goto('/portfolio/?categorie=nature');
    await expect(page).toHaveURL(/\/portfolio\/nature\/$/);
    await expect(page.locator('h1')).toHaveText('Nature / Paysages');

    await page.goto('/portfolio/?photo=photo-6');
    await expect(page).toHaveURL(/\/portfolio\/nature\/\?photo=photo-6$/);
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('navigation par le menu', async ({ page, isMobile }) => {
    await page.goto('/');
    const menu = page.locator('nav');

    if (isMobile) await page.getByRole('button', { name: 'Ouvrir le menu mobile' }).click();
    await menu.getByRole('link', { name: 'Contact', exact: true }).filter({ visible: true }).first().click();
    await expect(page).toHaveURL(/\/contact\/$/);
    await expect(page.locator('h1')).toHaveText('Travaillons ensemble');
    await expect(page).toHaveTitle(/^Contact —/);

    if (isMobile) await page.getByRole('button', { name: 'Ouvrir le menu mobile' }).click();
    await menu.getByRole('link', { name: 'À propos', exact: true }).filter({ visible: true }).first().click();
    await expect(page).toHaveURL(/\/about\/$/);
    await expect(page.locator('h1')).toHaveText('Mon histoire');
    await expect(page.getByRole('heading', { name: 'Drone', exact: true })).toBeVisible();
  });

  test('le thème choisi est retenu', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const before = await html.getAttribute('data-theme');
    const after = before === 'light' ? 'dark' : 'light';

    await page.getByRole('button', { name: /Passer au thème/ }).filter({ visible: true }).first().click();
    await expect(html).toHaveAttribute('data-theme', after);

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', after);
  });

  test("aucune page ne déborde de l'écran en largeur", async ({ page }) => {
    for (const path of ['/', '/portfolio/', '/portfolio/sports/', '/about/', '/contact/', '/mentions-legales/']) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${path} déborde de ${overflow} px`).toBeLessThanOrEqual(0);
    }
  });

  test.describe('formulaire de contact', () => {
    async function fillForm(page: import('@playwright/test').Page) {
      await page.goto('/contact/');
      await page.fill('#contact-name', 'Marie Test');
      await page.fill('#contact-email', 'marie@example.com');
      await page.selectOption('#contact-project-type', 'mariage');
      await page.fill('#contact-message', 'Bonjour,\nje me marie en juin 2027 à La Roche-sur-Yon.');
    }

    test('message envoyé : la confirmation reste affichée', async ({ page }) => {
      await page.clock.install();
      await page.route(FORM_ENDPOINT, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":"true"}' })
      );
      await fillForm(page);

      const [request] = await Promise.all([
        page.waitForRequest(FORM_ENDPOINT),
        page.getByRole('button', { name: 'Envoyer', exact: true }).click(),
      ]);
      expect(request.postDataJSON()).toMatchObject({
        name: 'Marie Test',
        email: 'marie@example.com',
        projectType: 'mariage',
        message: 'Bonjour,\nje me marie en juin 2027 à La Roche-sur-Yon.',
      });

      const confirmation = page.getByRole('status');
      await expect(confirmation).toContainText('Message envoyé');
      await expect(confirmation).toContainText('sous 24 h');

      // Avant, la confirmation disparaissait au bout de 5 secondes
      await page.clock.runFor(10_000);
      await expect(confirmation).toBeVisible();

      await confirmation.getByRole('button', { name: 'Envoyer un autre message' }).click();
      await expect(page.locator('#contact-message')).toHaveValue('');
    });

    test("en cas de panne de l'envoi, le message peut partir par e-mail", async ({ page }) => {
      await page.route(FORM_ENDPOINT, (route) => route.fulfill({ status: 500, body: '' }));
      await fillForm(page);
      await page.getByRole('button', { name: 'Envoyer', exact: true }).click();

      const alert = page.getByRole('alert');
      await expect(alert).toContainText('a échoué');
      // Le message tapé n'est pas perdu
      await expect(page.locator('#contact-message')).toHaveValue(/je me marie en juin 2027/);

      const mailto = (await alert.getByRole('link', { name: 'Envoyer par e-mail' }).getAttribute('href')) ?? '';
      expect(mailto.startsWith('mailto:stevan.garon@gmail.com?subject=')).toBe(true);
      const body = decodeURIComponent(mailto.split('&body=')[1] ?? '');
      expect(body).toContain('je me marie en juin 2027 à La Roche-sur-Yon.');
      expect(body).toContain('Nom : Marie Test');
      expect(body).toContain('E-mail : marie@example.com');
      expect(body).toContain('Type de projet : Mariage');

      // Le site écrit l'erreur dans la console : c'est attendu ici
      expectExpectedError(page, 'Contact form error');
    });
  });
});

test.describe('bandeau cookies', () => {
  test('refuser : le bandeau disparaît et la mesure d’audience ne se charge pas', async ({ page }) => {
    const analytics: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('googletagmanager.com')) analytics.push(request.url());
    });

    await page.goto('/');
    const banner = page.getByRole('region', { name: 'Gestion des cookies' });
    await expect(banner).toBeVisible();
    await banner.getByRole('button', { name: 'Refuser' }).click();
    await expect(banner).toBeHidden();

    await page.reload();
    await expect(page.locator('h1')).toBeVisible();
    await expect(banner).toBeHidden();
    expect(analytics).toEqual([]);
  });

  test('accepter : la mesure d’audience se charge', async ({ page }) => {
    await page.goto('/');
    const banner = page.getByRole('region', { name: 'Gestion des cookies' });
    await expect(banner).toBeVisible();

    await Promise.all([
      page.waitForRequest((request) => request.url().includes('googletagmanager.com')),
      banner.getByRole('button', { name: 'Accepter' }).click(),
    ]);
    await expect(banner).toBeHidden();
  });
});
