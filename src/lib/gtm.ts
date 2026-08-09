// ============================================================================
// Chargement conditionnel de Google Tag Manager
// ============================================================================
// GTM n'est injecté dans la page QUE si l'utilisateur a donné son
// consentement (bandeau RGPD). Avant ça, ni le script GTM ni son
// dataLayer ne sont créés : aucun cookie de mesure d'audience ne peut donc
// être posé tant que la personne n'a pas cliqué sur "Accepter".
// ============================================================================

const GTM_ID = 'GTM-MKRZN7PK';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

let gtmLoaded = false;

export function loadGTM(): void {
  if (gtmLoaded || typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  gtmLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);
}
