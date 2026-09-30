import type { StaticImageData } from "next/image";
import type { IconName } from "@/lib/icons";
import type { BadgeTone, LinkCategory, ThemeName } from "@/config/themes";

export type { BadgeTone, IconName, LinkCategory, ThemeName };

/** Adresse d’un lien : URL complète (https://…), courriel (mailto:…), téléphone (tel:…), page du site (/…) ou ancre (#…). */
export type Href =
  `https://${string}` | `http://${string}` | `mailto:${string}` | `tel:${string}` | `#${string}` | `/${string}`;

/**
 * Date ISO 8601. Sans fuseau, elle est lue à l’heure de Montréal :
 * "2026-09-30" (minuit), "2026-09-30T18:00". Un fuseau explicite est respecté : "2026-09-30T18:00:00-04:00".
 */
export type IsoDate = string;

/** Période d’affichage facultative : l’élément apparaît et disparaît seul, sans redéploiement. */
export interface Schedule {
  /** Affiché à partir de cette date. */
  startsAt?: IsoDate;
  /** Masqué automatiquement à partir de cette date. */
  endsAt?: IsoDate;
}

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
  /** Cohorte et mandat de l’exécutif en cours, p. ex. "2026-2027". */
  cohort: string;
  /** Ligne d’accroche colorée sous le nom (segments séparés par « • »). */
  tagline: string;
  /** Biographie courte (segments séparés par « • »). */
  bio: string;
  /** Icônes des piliers de la bio (une par segment séparé par « • »), affichés en trois colonnes. */
  bioIcons?: IconName[];
  /** Inscription circulaire du sceau de l’en-tête (arc supérieur, arc inférieur). */
  seal?: { top: string; bottom: string };
  /** Mission en une phrase (description SEO et image de partage). */
  mission: string;
  /** Pastille de vérification à côté du nom. */
  verified: { enabled: boolean; label: string };
  /** Logo officiel (version blanche, fond transparent), affiché dans le pied de page. */
  logo: { src: StaticImageData; alt: string };
  email: string;
  address: PostalAddress;
  neq: string;
  /** Statut juridique (mention d’OBNL). */
  legalStatus: string;
  /** Date de constitution (lettres patentes), format AAAA-MM-JJ. */
  foundingDate: IsoDate;
  legalLinks: LegalLink[];
}

export type AlertTone = "info" | "important" | "urgent";

/** Bandeau du prochain événement public de l’Association (toujours affiché pendant sa période). */
export interface AlertBannerConfig extends Schedule {
  /** Active ou désactive le bandeau. */
  enabled: boolean;
  tone: AlertTone;
  /** Étiquette courte, p. ex. « AGA », « 5 à 7 », « Gala ». */
  label: string;
  message: string;
  /** Date de l’événement (« 2026-09-30 ») : affichée en vignette à gauche du message. */
  date?: IsoDate;
  link?: { label: string; href: Href };
}

export type SocialPlatform =
  "instagram" | "linkedin" | "facebook" | "whatsapp" | "discord" | "tiktok" | "youtube" | "email" | "website";

/** Icône d’un réseau : pictogramme de marque (nom de plateforme) ou icône lucide du registre. */
export type SocialIconName = SocialPlatform | IconName;

export interface SocialLink {
  /** Plateforme : sert d’icône par défaut. */
  platform: SocialPlatform;
  href: Href;
  /** Libellé lu par les lecteurs d’écran et affiché en info-bulle. */
  label: string;
  /** Icône facultative : "discord", "youtube"… ou une icône lucide ("GraduationCap"…). Par défaut : celle de la plateforme. */
  icon?: SocialIconName;
}

export interface SpotlightConfig extends Schedule {
  enabled: boolean;
  title: string;
  subtitle: string;
  href: Href;
  icon: IconName;
  /** Pastille facultative, p. ex. « Nouveau ». */
  badge?: string;
  /** Dégradé propre au bouton vedette, par thème. Un thème absent reprend son dégradé d’accent. */
  gradient?: Partial<Record<ThemeName, { from: string; via?: string; to: string }>>;
}

export interface LinkBadge extends Schedule {
  label: string;
  tone: BadgeTone;
}

export interface LinkItem extends Schedule {
  title: string;
  subtitle: string;
  href: Href;
  icon: IconName;
  /** Catégorie : détermine la teinte de la tuile d’icône. */
  category: LinkCategory;
  /** Pastille facultative (avec sa propre période d’affichage, p. ex. jusqu’à la date limite). */
  badge?: LinkBadge;
  /** Masque le lien sans le supprimer. */
  hidden?: boolean;
  /** Met le lien en avant (carte soulignée de bordeaux), p. ex. une démarche importante. */
  highlight?: boolean;
}

/**
 * Mise en page d’une section :
 * - "list"  : cartes en liste (par défaut) ;
 * - "bento" : le premier lien en grande carte, les suivants en tuiles sur deux colonnes ;
 * - "tiles" : tuiles compactes côte à côte (icône et titre ; idéal pour 3 liens courts) ;
 * - "group" : liens réunis dans un même bloc, séparés par des filets (un lien `highlight` en sort).
 */
export type SectionLayout = "list" | "bento" | "tiles" | "group";

export interface LinkSection {
  /** Identifiant (lettres, chiffres, tirets). */
  id: string;
  /** Titre de section facultatif (numéroté en chiffres romains, en petites capitales). */
  title?: string;
  layout?: SectionLayout;
  links: LinkItem[];
}

export interface NewsletterConfig {
  enabled: boolean;
  title: string;
  description: string;
  /** Libellé du champ, lu par les lecteurs d’écran. */
  inputLabel: string;
  placeholder: string;
  buttonLabel: string;
  /** Annoncé pendant l’envoi. */
  loadingLabel: string;
  /** Point de terminaison qui reçoit { email } en POST (JSON). */
  endpoint: `/${string}` | `https://${string}`;
  successTitle: string;
  successMessage: string;
  /** Bouton affiché après une inscription réussie. */
  resetLabel: string;
  invalidEmailMessage: string;
  /** Adresse retirée définitivement de l’audience : réinscription impossible depuis la page. */
  removedMessage: string;
  errorMessage: string;
  /** Mention à la collecte (LCAP ; Loi 25), suivie du lien vers la politique de confidentialité. */
  consentNote: string;
  /** Lien affiché après la mention de consentement. */
  privacyLink?: LegalLink;
}

export interface PrivacyConfig {
  /** Personne responsable de la protection des renseignements personnels (Loi 25 : par défaut, la présidence). */
  officer: { title: string; email: string };
  /** Date de la dernière mise à jour de la politique (AAAA-MM-JJ). */
  updatedAt: IsoDate;
  /** Mailchimp mesure-t-il l’ouverture des courriels et les clics ? (mentionné dans la politique) */
  emailTracking: boolean;
  /** Fournisseurs qui traitent des renseignements pour l’AEEBM. */
  processors: { name: string; purpose: string; location: string }[];
}

export interface FooterConfig {
  /** Signature typographique. `{heart}` est remplacé par un cœur. */
  signature: string;
  /** Liens institutionnels complémentaires. */
  links: LegalLink[];
}

export interface SiteConfig {
  /** Thème visuel : "ivoire" (charte, papier clair, défaut), "bordeaux" (charte, sombre) ou "amethyste". */
  theme: ThemeName;
  /** URL publique canonique (partage, code QR, SEO). Surcharge possible : NEXT_PUBLIC_SITE_URL. */
  siteUrl: `https://${string}` | `http://${string}`;
  /** Le domaine de siteUrl est-il confirmé ? Sinon, le build avertit s’il sert d’URL publique. */
  siteUrlConfirmed?: boolean;
  association: AssociationConfig;
  alertBanner: AlertBannerConfig;
  socials: SocialLink[];
  spotlight: SpotlightConfig;
  sections: LinkSection[];
  newsletter: NewsletterConfig;
  privacy: PrivacyConfig;
  footer: FooterConfig;
}
