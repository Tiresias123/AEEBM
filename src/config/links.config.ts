/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  AEEBM · CONFIGURATION DE LA PAGE DE LIENS                               ║
 * ║  Tout le contenu de la page se modifie ici, sans toucher au code JSX.    ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * Mise à jour en 30 secondes :
 *   1. Modifiez le texte ou l’adresse voulue ci-dessous (entre guillemets).
 *   2. Enregistrez (ou « Commit changes » sur GitHub) : le site se redéploie seul.
 *
 * Repères :
 *   • Masquer un lien sans le supprimer ......... hidden: true
 *   • Changer l’ordre des liens ................. déplacer le bloc { … } voulu
 *   • Couleur de l’icône ........................ category: "academique" | "evenements" | "carriere" | "representation" | "services"
 *   • Pastille .................................. badge: { label: "Nouveau", tone: "new" | "important" | "deadline" | "info" }
 *   • Icônes disponibles ........................ voir src/lib/icons.ts (catalogue : https://lucide.dev/icons)
 *   • Bandeau d’annonce ......................... alertBanner.enabled + changer alertBanner.id à chaque nouvelle annonce
 *   • Thème visuel .............................. theme: "amethyste" | "barreau" (charte bordeaux de l’AEEBM)
 *
 * Les adresses marquées A_COMPLETER sont signalées dans la console à chaque build
 * tant qu’elles n’ont pas été remplacées par la vraie adresse.
 */

import type { SiteConfig } from "@/config/types";

/** Adresse provisoire : à remplacer par l’URL définitive (Google Drive, formulaire, billetterie, etc.). */
export const A_COMPLETER = "#a-completer" as const;

const COURRIEL = "aeebm.contact@gmail.com";

export const siteConfig: SiteConfig = {
  theme: "amethyste",

  // URL publique de la page (code QR, partage, SEO). Peut être surchargée par NEXT_PUBLIC_SITE_URL.
  siteUrl: "https://aeebm.ca", // ⚠️ À confirmer : domaine repris ou nouveau (feuille de route, section 16)

  /* ───────────────────────────── 1. IDENTITÉ ───────────────────────────── */
  association: {
    acronym: "AEEBM",
    displayName: "Association étudiante de l’École du Barreau de Montréal",
    legalName: "Association des étudiants de l’École du Barreau du Québec à Montréal",
    tagline: "Cohorte 2026-2027 • École du Barreau de Montréal",
    bio: "Défense des droits des candidats • Tutorat & Entraide • Réseautage & Vie associative ⚖️",
    mission:
      "L’AEEBM représente les étudiantes et étudiants du Centre de Montréal de l’École du Barreau du Québec auprès de la direction de l’École et des partenaires, défend leurs droits et anime la vie du Centre.",
    verified: { enabled: true, label: "Compte officiel de l’AEEBM" },
    logo: {
      src: "/brand/aeebm-logo-blanc.png",
      alt: "Logo de l’Association étudiante de l’École du Barreau de Montréal",
      width: 533,
      height: 567,
    },
    email: COURRIEL,
    address: {
      street: "445, boulevard Saint-Laurent, bureau 215",
      city: "Montréal",
      province: "Québec",
      provinceCode: "QC",
      postalCode: "H2Y 2Y7",
    },
    neq: "1148601249",
    legalStatus:
      "Personne morale sans but lucratif constituée en vertu de la partie III de la Loi sur les compagnies (RLRQ, c. C-38)",
    foundingDate: "1988-01-21", // Lettres patentes du 21 janvier 1988
    executive: "Exécutif 2026-2027",
    legalLinks: [
      { label: "Règlements généraux", href: A_COMPLETER },
      { label: "Loi sur les compagnies, partie III", href: "https://www.legisquebec.gouv.qc.ca/fr/document/lc/C-38" },
    ],
  },

  /* ─────────────────────── 2. BANDEAU D’ANNONCE PRIORITAIRE ─────────────────────── */
  alertBanner: {
    enabled: true,
    id: "aga-2026-09-30", // Changer l’identifiant pour réafficher le bandeau à tout le monde.
    tone: "important",
    label: "AGA",
    message: "Assemblée générale annuelle le mercredi 30 septembre. Votre voix compte.",
    link: { label: "Avis de convocation", href: A_COMPLETER },
    endsAt: "2026-10-01T00:00:00-04:00", // Masqué automatiquement après l’assemblée.
  },

  /* ───────────────────────────── 3. RÉSEAUX SOCIAUX ───────────────────────────── */
  // ⚠️ Remplacer les adresses A_COMPLETER par les comptes officiels de l’AEEBM.
  socials: [
    { platform: "instagram", href: A_COMPLETER, label: "Instagram de l’AEEBM" },
    { platform: "linkedin", href: A_COMPLETER, label: "LinkedIn de l’AEEBM" },
    { platform: "whatsapp", href: A_COMPLETER, label: "Groupe WhatsApp de la cohorte" },
    { platform: "facebook", href: A_COMPLETER, label: "Page Facebook de l’AEEBM" },
    { platform: "email", href: `mailto:${COURRIEL}`, label: `Écrire à ${COURRIEL}` },
  ],

  /* ───────────────────────────── 4. LIEN VEDETTE ───────────────────────────── */
  spotlight: {
    enabled: true,
    title: "Guide de la rentrée 2026-2027",
    subtitle: "Calendrier, services, contacts et ressources essentielles",
    href: A_COMPLETER,
    icon: "BookOpen",
    badge: "Nouveau",
    gradient: { from: "#A21CAF", via: "#6366F1", to: "#3B82F6" }, // Retirer pour reprendre le dégradé du thème.
  },

  /* ───────────────────────────── 5. LIENS ───────────────────────────── */
  sections: [
    {
      id: "academique",
      title: "Réussir l’École",
      links: [
        {
          title: "Banque de résumés & annales",
          subtitle: "Résumés par matière, examens simulés et corrigés",
          href: A_COMPLETER,
          icon: "Library",
          category: "academique",
          badge: { label: "Mis à jour", tone: "new" },
        },
        {
          title: "Cliniques de préparation",
          subtitle: "Horaire des ateliers et séances de révision avant l’examen",
          href: A_COMPLETER,
          icon: "NotebookPen",
          category: "academique",
        },
        {
          title: "Tutorat & entraide",
          subtitle: "Jumelage entre pairs par matière, en présentiel ou à distance",
          href: A_COMPLETER,
          icon: "UsersRound",
          category: "academique",
        },
      ],
    },
    {
      id: "carriere",
      title: "Carrière & stage",
      links: [
        {
          title: "Programme de mentorat",
          subtitle: "Jumelage avec des juristes en exercice",
          href: A_COMPLETER,
          icon: "Handshake",
          category: "carriere",
          badge: { label: "Date limite · 15 oct.", tone: "deadline" }, // Exemple : ajuster la date.
        },
        {
          title: "Guide des stages",
          subtitle: "Recherche de stage, entrevues et options après l’École",
          href: A_COMPLETER,
          icon: "BriefcaseBusiness",
          category: "carriere",
        },
      ],
    },
    {
      id: "vie-etudiante",
      title: "Vie étudiante",
      links: [
        {
          title: "Calendrier des événements",
          subtitle: "5 à 7, réseautage et fêtes d’après examens",
          href: A_COMPLETER,
          icon: "CalendarDays",
          category: "evenements",
        },
        {
          title: "Billetterie",
          subtitle: "Réservez vos places pour les prochaines soirées",
          href: A_COMPLETER,
          icon: "Ticket",
          category: "evenements",
          badge: { label: "Nouveau", tone: "new" },
        },
        {
          title: "Photos des finissantes et finissants",
          subtitle: "Séances photo avec Juristas",
          href: A_COMPLETER,
          icon: "Camera",
          category: "evenements",
        },
        {
          title: "Boutique AEEBM",
          subtitle: "Vêtements et objets aux couleurs de l’Association",
          href: A_COMPLETER,
          icon: "ShoppingBag",
          category: "evenements",
        },
      ],
    },
    {
      id: "representation",
      title: "Représentation & services",
      links: [
        {
          title: "Signaler une situation",
          subtitle: "Plainte ou préoccupation académique, traitée en toute confidentialité",
          href: A_COMPLETER,
          icon: "MessageSquareWarning",
          category: "representation",
          badge: { label: "Confidentiel", tone: "info" },
        },
        {
          title: "Assemblées & documents officiels",
          subtitle: "Avis de convocation, procès-verbaux et règlements généraux",
          href: A_COMPLETER,
          icon: "ScrollText",
          category: "representation",
        },
        {
          title: "Assurance santé & dentaire",
          subtitle: "Régime collectif ASEQ, couverture du 1er septembre au 31 août",
          href: "https://www.aseq.ca",
          icon: "HeartPulse",
          category: "services",
        },
        {
          title: "Écrire à l’exécutif",
          subtitle: COURRIEL,
          href: `mailto:${COURRIEL}`,
          icon: "Mail",
          category: "services",
        },
      ],
    },
  ],

  /* ───────────────────────────── 6. INFOLETTRE ───────────────────────────── */
  newsletter: {
    enabled: true,
    title: "Restez informé·es",
    description: "Ne manquez aucun avis ni événement du Barreau.",
    placeholder: "Votre adresse courriel",
    buttonLabel: "S’abonner",
    endpoint: "/api/newsletter",
    successTitle: "Inscription confirmée",
    successMessage: "Surveillez votre boîte de réception : un courriel de confirmation vous attend.",
    errorMessage: `Inscription impossible pour le moment. Écrivez-nous à ${COURRIEL}.`,
    consentNote: "Une infolettre par mois, au plus. Désabonnement en un clic.",
  },

  /* ───────────────────────────── PIED DE PAGE ───────────────────────────── */
  footer: {
    signature: "Conçu avec {heart} par l’exécutif 2026-2027",
    links: [
      { label: "École du Barreau du Québec", href: "https://www.ecoledubarreau.qc.ca" },
      { label: "Barreau du Québec", href: "https://www.barreau.qc.ca" },
    ],
  },
};
