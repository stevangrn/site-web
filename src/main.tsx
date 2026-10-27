import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
// Police Inter hébergée avec le site (paquet @fontsource-variable/inter) au
// lieu de Google Fonts : pas de requête vers les serveurs de Google, donc pas
// d'adresse IP transmise, et un affichage plus rapide. Une seule police
// "variable" couvre toutes les graisses utilisées (200 à 500).
import '@fontsource-variable/inter';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
