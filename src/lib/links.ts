/** Vrai pour les liens qui quittent le site (http/https). */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/** Attributs d’ancre adaptés au type de lien (nouvel onglet sécurisé pour l’externe). */
export function linkProps(href: string): {
  href: string;
  target?: "_blank";
  rel?: string;
} {
  if (isExternalHref(href)) {
    return { href, target: "_blank", rel: "noopener noreferrer" };
  }
  return { href };
}
