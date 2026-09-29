/** Espace insécable. */
export const NBSP = " ";

/**
 * Typographie française (Québec) appliquée à l’affichage : espaces insécables entre un nombre et le mot
 * qui suit (« 1er septembre », « 30 sept. »), dans « 5 à 7 » et dans le code postal (« H2Y 2Y7 »).
 */
export function frTypo(text: string): string {
  return text
    .replace(/\b([A-Z]\d[A-Z]) (\d[A-Z]\d)\b/g, `$1${NBSP}$2`)
    .replace(/(\d+(?:er|re|e)?) (?=\p{L})/gu, `$1${NBSP}`)
    .replace(/(\d) à (\d)/g, `$1${NBSP}à${NBSP}$2`);
}
