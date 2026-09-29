import { A_COMPLETER, siteConfig } from "@/config/links.config";
import { themes, type ThemeTokens } from "@/config/themes";
import type { LinkSection } from "@/config/types";

/** Jetons du thème actif. */
export const activeTheme: ThemeTokens = themes[siteConfig.theme];

/**
 * URL canonique du site, sans barre oblique finale.
 * Priorité : NEXT_PUBLIC_SITE_URL › domaine de production Vercel › `siteConfig.siteUrl`.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const url =
    fromEnv && fromEnv.length > 0 ? fromEnv : vercelProduction ? `https://${vercelProduction}` : siteConfig.siteUrl;
  return url.replace(/\/+$/, "");
}

/** Sections prêtes à l’affichage : liens masqués retirés, sections vides ignorées. */
export function getVisibleSections(): LinkSection[] {
  return siteConfig.sections
    .map((section) => ({ ...section, links: section.links.filter((link) => !link.hidden) }))
    .filter((section) => section.links.length > 0);
}

/** Liste lisible des adresses encore provisoires (A_COMPLETER), pour avertir au build. */
export function getPlaceholderLinks(): string[] {
  const pending: string[] = [];
  const check = (label: string, href: string) => {
    if (href === A_COMPLETER) pending.push(label);
  };
  siteConfig.socials.forEach((s) => check(`Réseau social · ${s.label}`, s.href));
  if (siteConfig.spotlight.enabled) check(`Lien vedette · ${siteConfig.spotlight.title}`, siteConfig.spotlight.href);
  siteConfig.sections.forEach((section) =>
    section.links.forEach((link) => {
      if (!link.hidden) check(`Lien · ${link.title}`, link.href);
    }),
  );
  if (siteConfig.alertBanner.enabled && siteConfig.alertBanner.link) {
    check(`Bandeau · ${siteConfig.alertBanner.link.label}`, siteConfig.alertBanner.link.href);
  }
  siteConfig.association.legalLinks.forEach((l) => check(`Mention légale · ${l.label}`, l.href));
  return pending;
}

/** Adresse postale au format québécois : « 445, boulevard …, Montréal (Québec) H2Y 2Y7 ». */
export function formatAddress(address: SiteConfigAddress): string {
  return `${address.street}, ${address.city} (${address.province}) ${address.postalCode}`;
}

type SiteConfigAddress = typeof siteConfig.association.address;
