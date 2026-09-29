import type { IconName } from "@/lib/icons";
import type { LinkCategory, ThemeName } from "@/config/themes";

export type { IconName, LinkCategory, ThemeName };

/** Adresse d’un lien : URL complète (https://…), courriel (mailto:…), téléphone (tel:…) ou ancre (#…). */
export type Href =
  `https://${string}` | `http://${string}` | `mailto:${string}` | `tel:${string}` | `#${string}` | `/${string}`;

/** Date ISO 8601, p. ex. "2026-09-30" ou "2026-09-30T18:00:00-04:00" (heure de Montréal). */
export type IsoDate = string;

export interface LegalLink {
  label: string;
  href: Href;
}

export interface PostalAddress {
  street: string;
  city: string;
  province: string;
  provinceCode: string;
  postalCode: string;
}

export interface AssociationConfig {
  /** Sigle, toujours en capitales et sans points (charte, section 14). */
  acronym: string;
  /** Nom inscrit dans le logo, réservé aux communications et aux visuels. */
  displayName: string;
  /** Nom légal, tel qu’il figure en première mention dans les documents de gouvernance. */
  legalName: string;
  /** Ligne d’accroche colorée sous le nom. */
  tagline: string;
  /** Biographie courte (une ou deux lignes). */
  bio: string;
  /** Mission en une phrase (description SEO et pied de page). */
  mission: string;
  /** Pastille de vérification à côté du nom. */
  verified: { enabled: boolean; label: string };
  /** Logo officiel (version blanche, fond transparent) utilisé dans le pied de page. */
  logo: { src: `/${string}`; alt: string; width: number; height: number };
  email: string;
  address: PostalAddress;
  neq: string;
  /** Statut juridique (mention d’OBNL). */
  legalStatus: string;
  /** Date de constitution (lettres patentes), format AAAA-MM-JJ. */
  foundingDate: IsoDate;
  /** Exécutif en fonction, p. ex. « Exécutif 2026-2027 ». */
  executive: string;
  legalLinks: LegalLink[];
}

export type AlertTone = "info" | "important" | "urgent";

export interface AlertBannerConfig {
  /** Active ou désactive le bandeau. */
  enabled: boolean;
  /**
   * Identifiant unique de l’annonce. Une personne qui ferme le bandeau ne le revoit plus,
   * sauf si l’identifiant change : modifiez-le à chaque nouvelle annonce.
   */
  id: string;
  tone: AlertTone;
  /** Étiquette courte, p. ex. « AGA », « Rappel », « Urgent ». */
  label: string;
  message: string;
  link?: { label: string; href: Href };
  /** Affichage à partir de cette date (facultatif). */
  startsAt?: IsoDate;
  /** Masquage automatique à partir de cette date (facultatif). */
  endsAt?: IsoDate;
}

export type SocialPlatform =
  "instagram" | "linkedin" | "facebook" | "whatsapp" | "discord" | "tiktok" | "youtube" | "email" | "website";

export interface SocialLink {
  /** Plateforme : détermine l’icône affichée. */
  platform: SocialPlatform;
  href: Href;
  /** Libellé lu par les lecteurs d’écran et affiché en info-bulle. */
  label: string;
}

export interface SpotlightConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  href: Href;
  icon: IconName;
  /** Pastille facultative, p. ex. « Nouveau ». */
  badge?: string;
  /** Dégradé propre au bouton vedette. Par défaut : dégradé d’accent du thème. */
  gradient?: { from: string; via?: string; to: string };
}

export type BadgeTone = "new" | "important" | "deadline" | "info";

export interface LinkBadge {
  label: string;
  tone: BadgeTone;
}

export interface LinkItem {
  title: string;
  subtitle: string;
  href: Href;
  icon: IconName;
  /** Catégorie : détermine la couleur du squircle d’icône. */
  category: LinkCategory;
  badge?: LinkBadge;
  /** Masque temporairement le lien sans le supprimer. */
  hidden?: boolean;
}

export interface LinkSection {
  id: string;
  /** Titre de section facultatif (étiquette en petites capitales). */
  title?: string;
  links: LinkItem[];
}

export interface NewsletterConfig {
  enabled: boolean;
  title: string;
  description: string;
  placeholder: string;
  buttonLabel: string;
  /** Point de terminaison qui reçoit { email } en POST (JSON). */
  endpoint: `/${string}` | `https://${string}`;
  successTitle: string;
  successMessage: string;
  errorMessage: string;
  /** Mention de consentement (LCAP / Loi 25). */
  consentNote: string;
}

export interface FooterConfig {
  /** Signature typographique. `{heart}` est remplacé par un cœur animé. */
  signature: string;
  /** Liens institutionnels complémentaires. */
  links: LegalLink[];
}

export interface SiteConfig {
  /** Thème visuel : "amethyste" (défaut) ou "barreau" (charte AEEBM). */
  theme: ThemeName;
  /** URL publique canonique (partage, code QR, SEO). Surcharge possible : NEXT_PUBLIC_SITE_URL. */
  siteUrl: `https://${string}` | `http://${string}`;
  association: AssociationConfig;
  alertBanner: AlertBannerConfig;
  socials: SocialLink[];
  spotlight: SpotlightConfig;
  sections: LinkSection[];
  newsletter: NewsletterConfig;
  footer: FooterConfig;
}
