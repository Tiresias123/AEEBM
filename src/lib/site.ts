import { siteConfig } from "@/config/links.config";
import { themes, type ThemeTokens } from "@/config/themes";
import type {
  AlertBannerConfig,
  LinkItem,
  LinkSection,
  PostalAddress,
  SectionLayout,
  SpotlightConfig,
} from "@/config/types";
import { isPendingHref } from "@/lib/pending";
import {
  hasEnded,
  resolveWindow,
  type ResolvedWindow,
  type ScheduledElement,
  type ScheduledGroup,
} from "@/lib/schedule";
import { NBSP } from "@/lib/typo";

/** Jetons du thème actif. */
export const activeTheme: ThemeTokens = themes[siteConfig.theme];

/** Normalise une URL de site : espaces retirés, https:// ajouté au besoin, barre oblique finale retirée. */
function normalizeSiteUrl(raw: string, source: string): string {
  const trimmed = raw.trim();
  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error(`${source} invalide : « ${raw} » (attendu : https://domaine.ca)`);
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error(`${source} doit commencer par https:// (reçu : « ${raw} »)`);
  }
  return `${parsed.origin}${parsed.pathname.replace(/\/+$/, "")}`;
}

/** Provenance de l’URL publique : variable d’environnement, domaine de production Vercel ou configuration. */
export function getSiteUrlSource(): "env" | "vercel" | "config" {
  if (process.env.NEXT_PUBLIC_SITE_URL?.trim()) return "env";
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()) return "vercel";
  return "config";
}

/**
 * URL canonique du site, sans barre oblique finale.
 * Priorité : NEXT_PUBLIC_SITE_URL › domaine de production Vercel › `siteConfig.siteUrl`.
 */
export function getSiteUrl(): string {
  switch (getSiteUrlSource()) {
    case "env":
      return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? "", "NEXT_PUBLIC_SITE_URL");
    case "vercel":
      return normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "", "VERCEL_PROJECT_PRODUCTION_URL");
    default:
      return normalizeSiteUrl(siteConfig.siteUrl, "siteConfig.siteUrl");
  }
}

/** Sections prêtes à l’affichage : liens masqués retirés, sections vides ignorées. */
export function getVisibleSections(): LinkSection[] {
  return siteConfig.sections
    .map((section) => ({ ...section, links: section.links.filter((link) => !link.hidden) }))
    .filter((section) => section.links.length > 0);
}

/** Dégradé du lien vedette pour le thème actif (undefined : dégradé d’accent du thème). */
export function getSpotlightGradient(spotlight: SpotlightConfig) {
  return spotlight.gradient?.[siteConfig.theme];
}

/** Liste lisible des adresses encore provisoires (A_COMPLETER), pour avertir au build. */
export function getPlaceholderLinks(): string[] {
  const pending: string[] = [];
  const check = (label: string, href: string) => {
    if (isPendingHref(href)) pending.push(label);
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
  siteConfig.footer.links.forEach((l) => check(`Pied de page · ${l.label}`, l.href));
  return pending;
}

/** Vrai si l’infolettre intégrée est active sans ses secrets Mailchimp (chaque inscription échouerait en production). */
/**
 * Export statique (Cloudflare Pages, voir scripts/build-static.mjs) : aucune fonction serveur, donc pas d’API
 * d’infolettre ; le module d’inscription est retiré de la page.
 */
export const isStaticExport = process.env.STATIC_EXPORT === "1";

/** Module d’infolettre affichable : activé, et servi par un hébergement capable d’exécuter l’API. */
export function isNewsletterAvailable(): boolean {
  return siteConfig.newsletter.enabled && !isStaticExport;
}

export function isNewsletterMisconfigured(): boolean {
  const { newsletter } = siteConfig;
  return (
    !isStaticExport &&
    newsletter.enabled &&
    newsletter.endpoint === "/api/newsletter" &&
    (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_AUDIENCE_ID)
  );
}

/**
 * Adresse postale québécoise : parties de la rue (coupure possible seulement entre elles, jamais après
 * le numéro civique) puis « Montréal (Québec) H2Y 2Y7 », insécable.
 */
export function formatAddress(address: PostalAddress): { street: string; streetParts: string[]; locality: string } {
  const parts = address.street.split(/,\s*/).filter(Boolean);
  if (parts.length > 1 && /^\d+[A-Za-z]?$/.test(parts[0])) parts.splice(0, 2, `${parts[0]},${NBSP}${parts[1]}`);
  return {
    street: address.street,
    streetParts: parts,
    locality: `${address.city} (${address.province})${NBSP}${address.postalCode.replace(/\s+/g, NBSP)}`,
  };
}

export interface LinkModel {
  key: string;
  link: LinkItem;
  /** Identifiant de période d’affichage du lien (data-sched), s’il est daté. */
  schedId?: string;
  /** Identifiant de période d’affichage de la pastille, si elle est datée. */
  badgeSchedId?: string;
}

export interface SectionModel {
  id: string;
  title?: string;
  layout: SectionLayout;
  links: LinkModel[];
  /** Identifiant de période de la section, quand tous ses liens sont datés (masquée avec eux). */
  schedId?: string;
}

export interface PageModel {
  sections: SectionModel[];
  spotlight: { config: SpotlightConfig; schedId?: string } | null;
  banner: AlertBannerConfig | null;
  /** Éléments datés, masqués avant le premier affichage hors de leur période (script de préaffichage). */
  scheduled: ScheduledElement[];
  /** Sections dont tous les liens sont datés : masquées quand tous leurs liens le sont. */
  groups: ScheduledGroup[];
}

function isDated(window: ResolvedWindow): boolean {
  return window.start !== null || window.end !== null;
}

/**
 * Modèle de la page au moment du build : liens masqués et éléments déjà expirés retirés, identifiants
 * de période attribués aux éléments datés (qui s’afficheront ou disparaîtront ensuite sans redéploiement).
 */
export function getPageModel(now: number = Date.now()): PageModel {
  const scheduled: ScheduledElement[] = [];
  const groups: ScheduledGroup[] = [];
  // Identifiants opaques et déterministes (même ordre au build de la page et du layout).
  const schedule = (window: ResolvedWindow): string => {
    const id = `s${scheduled.length}`;
    scheduled.push({ id, window });
    return id;
  };

  const sections = siteConfig.sections
    .map((section, sectionIndex): SectionModel => {
      const links = section.links.flatMap((link, index): LinkModel[] => {
        if (link.hidden) return [];
        const key = `${section.id}-${index}`;
        const window = resolveWindow(link, `Lien « ${link.title} »`);
        if (hasEnded(window, now)) return [];
        const model: LinkModel = { key, link };
        if (isDated(window)) model.schedId = schedule(window);
        if (link.badge) {
          const badgeWindow = resolveWindow(link.badge, `Pastille « ${link.badge.label} »`);
          if (hasEnded(badgeWindow, now)) model.link = { ...link, badge: undefined };
          else if (isDated(badgeWindow)) model.badgeSchedId = schedule(badgeWindow);
        }
        return [model];
      });
      const model: SectionModel = { id: section.id, title: section.title, layout: section.layout ?? "list", links };
      if (links.length > 0 && links.every((link) => link.schedId)) {
        model.schedId = `g${sectionIndex}`;
        groups.push({ id: model.schedId, members: links.map((link) => link.schedId as string) });
      }
      return model;
    })
    .filter((section) => section.links.length > 0);

  let spotlight: PageModel["spotlight"] = null;
  if (siteConfig.spotlight.enabled) {
    const window = resolveWindow(siteConfig.spotlight, "Lien vedette");
    if (!hasEnded(window, now)) {
      spotlight = { config: siteConfig.spotlight };
      if (isDated(window)) spotlight.schedId = schedule(window);
    }
  }

  const bannerConfig = siteConfig.alertBanner;
  const banner =
    bannerConfig.enabled && !hasEnded(resolveWindow(bannerConfig, "alertBanner"), now) ? bannerConfig : null;

  return { sections, spotlight, banner, scheduled, groups };
}
