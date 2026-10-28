// ============================================================================
// Tests automatiques du site (Playwright)
// ============================================================================
// Les tests ouvrent le site construit (dossier dist/) dans un vrai navigateur
// et vérifient que tout fonctionne : chaque page s'affiche sans erreur, aucun
// lien n'est cassé, le portfolio, la visionneuse, le formulaire de contact,
// le thème et le bandeau cookies marchent, sur ordinateur et sur mobile.
//
// Ils se lancent automatiquement avant chaque mise en ligne (voir
// .github/workflows/deploy.yml). Pour les lancer sur ton ordinateur :
//   npx playwright install chromium   (une seule fois, installe le navigateur)
//   npm run build
//   npm test
// Le détail des tests est dans le dossier tests/.
// ============================================================================

import { defineConfig, devices } from '@playwright/test';

const PORT = 4180;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // Sur GitHub : un test oublié en mode ".only" fait échouer la vérification,
  // et un test qui échoue est relancé une fois avant de conclure à une panne.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'fr-FR',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'ordinateur', use: { ...devices['Desktop Chrome'] } },
    // Sur mobile, seuls les parcours de visite sont rejoués (menu mobile,
    // portfolio, contact...) : les vérifications page par page sont les mêmes
    // que sur ordinateur.
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testMatch: /parcours\.spec\.ts/ },
  ],
  // Démarre le serveur qui imite GitHub Pages (scripts/serve-dist.mjs)
  webServer: {
    command: `node scripts/serve-dist.mjs ${PORT}`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
  },
});
