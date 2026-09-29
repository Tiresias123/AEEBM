/** Adresse provisoire : lien pas encore disponible (affiché « Bientôt disponible », non cliquable). */
export const A_COMPLETER = "#a-completer" as const;

export function isPendingHref(href: string): boolean {
  return href === A_COMPLETER;
}
