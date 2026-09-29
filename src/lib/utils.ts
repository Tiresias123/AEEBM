import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Vrai pour les liens qui quittent le site (http/https vers un autre domaine). */
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
