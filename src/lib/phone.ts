// ============================================================================
// Lien téléphone au format international
// ============================================================================
// Le numéro est affiché tel qu'il est écrit dans content.ts ("06 27 24 56 73"),
// mais le lien "tel:" doit être au format international, sans espaces
// ("tel:+33627245673") : c'est le format le plus fiable sur tous les
// téléphones, y compris depuis l'étranger.
// ============================================================================

export function toTelHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return `tel:${digits}`;
  if (digits.startsWith('00')) return `tel:+${digits.slice(2)}`;
  if (digits.startsWith('0')) return `tel:+33${digits.slice(1)}`;
  return `tel:${digits}`;
}
