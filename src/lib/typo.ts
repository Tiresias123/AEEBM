/** Espace insécable. */
export const NBSP = " ";
/** Gluon (word joiner) : empêche une coupure sans ajouter d’espace ni exiger de glyphe. */
const WORD_JOINER = "⁠";

/**
 * Typographie française (Québec) appliquée à l’affichage, sans modifier la configuration :
 * - espaces insécables entre un nombre et le mot suivant (« 1er septembre », « 30 sept. »), dans « 5 à 7 »,
 *   dans le code postal (« H2Y 2Y7 ») et dans les références juridiques (« partie III », « c. C-38 ») ;
 * - aucune coupure avant « ? ! ; : » » ni après « « » ;
 * - « vice-présidence », « ex-ASEQ » ne se coupent pas au trait d’union.
 * Idempotente : l’appliquer deux fois ne change rien.
 */
export function frTypo(text: string): string {
  return text
    .replace(/\b([A-Z]\d[A-Z]) (\d[A-Z]\d)\b/g, `$1${NBSP}$2`)
    .replace(/(\d)[  ]à (\d)/g, `$1${NBSP}à${NBSP}$2`)
    .replace(/(\d+(?:er|re|e)?) (?=\p{L})/gu, `$1${NBSP}`)
    .replace(/\b(partie|titre|livre|chapitre|section|art\.) (?=[\dIVXLCDM]+\b)/giu, `$1${NBSP}`)
    .replace(/\bc\. (?=[A-Z]-\d)/g, `c.${NBSP}`)
    .replace(/ ([?!;:»])/g, `${NBSP}$1`)
    .replace(/« /g, `«${NBSP}`)
    .replace(/\b(vice|ex)-(?!⁠)(?=\p{L})/giu, `$1-${WORD_JOINER}`);
}
