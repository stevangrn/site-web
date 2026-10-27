import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
// Police Inter hébergée avec le site (paquet @fontsource-variable/inter) au
// lieu de Google Fonts : pas de requête vers les serveurs de Google, donc pas
// d'adresse IP transmise, et un affichage plus rapide. Une seule police
// "variable" couvre toutes les graisses utilisées (200 à 500).
import '@fontsource-variable/inter';
import './index.css';

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App initialPath={window.location.pathname} />
  </StrictMode>
);

// Sur le site publié, chaque page arrive déjà remplie (HTML généré au build
// par scripts/prerender.mjs) : React se contente de la "réveiller"
// (hydratation) au lieu de tout redessiner. En développement (npm run dev),
// la page arrive vide et React l'affiche normalement.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
