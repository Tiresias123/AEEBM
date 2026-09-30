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
 *   • Afficher un lien ou une pastille un temps .. startsAt / endsAt : "2026-10-15" (heure de Montréal)
 *   • Changer l’ordre des liens ................. déplacer le bloc { … } voulu
 *   • Mise en page d’une section ................ layout: "list" | "bento" | "tiles" | "group"
 *   • Mettre un lien en avant ................... highlight: true
 *   • Couleur de l’icône ........................ category: "academique" | "evenements" | "carriere" | "representation" | "services"
 *   • Pastille .................................. badge: { label: "Nouveau", tone: "new" | "important" | "deadline" | "info" }
 *   • Icônes disponibles ........................ voir src/lib/icons.ts (catalogue : https://lucide.dev/icons)
 *   • Prochain événement (bandeau) .............. alertBanner : label, message, date, endsAt
 *   • Thème visuel .............................. theme: "ivoire" (charte, papier clair) | "bordeaux" (charte, sombre) | "amethyste"
 *   • Nouvelle année ............................ changer COHORTE ci-dessous
 *
 * Adresses provisoires : tant qu’un lien vaut A_COMPLETER, la carte s’affiche « Bientôt » (non cliquable,
 * sans pastille « Nouveau ») et chaque build le signale dans la console.
 */

import logoBlanc from "@/assets/brand/aeebm-logo-blanc.png";
import type { SiteConfig } from "@/config/types";
import { A_COMPLETER } from "@/lib/pending";

/** Adresse provisoire : à remplacer par l’URL définitive (Google Drive, formulaire, billetterie, etc.). */
export { A_COMPLETER };

/** Cohorte et mandat de l’exécutif : à changer une fois par an. */
const COHORTE = "2026-2027";
const COURRIEL = "aeebm.contact@gmail.com";

export const siteConfig: SiteConfig = {
  theme: "ivoire",

  // URL publique (code QR, partage, SEO). Sur Vercel, le domaine de production est détecté automatiquement ;
  // NEXT_PUBLIC_SITE_URL a priorité. Cette valeur ne sert qu’en dernier recours.
  siteUrl: "https://aeebm.ca",
  siteUrlConfirmed: false, // ⚠️ Passer à true une fois le domaine repris auprès de l’ancien prestataire (fiche, section 08)

  /* ───────────────────────────── 1. IDENTITÉ ───────────────────────────── */
  association: {
    acronym: "AEEBM",
    displayName: "Association étudiante de l’École du Barreau de Montréal",
    legalName: "Association des étudiants de l’École du Barreau du Québec à Montréal",
    cohort: COHORTE,
    tagline: `Cohorte ${COHORTE} • École du Barreau de Montréal`,
    bio: "Défense des droits des candidats • Tutorat & Entraide • Réseautage & Vie associative ⚖️",
    bioIcons: ["Scale", "HeartHandshake", "UsersRound"], // Une icône par pilier de la bio, dans l’ordre
    seal: { top: "Association étudiante", bottom: "École du Barreau · Montréal" }, // Inscription du sceau
    mission:
      "L’AEEBM représente les étudiantes et étudiants du Centre de Montréal de l’École du Barreau du Québec auprès de la direction de l’École et des partenaires, défend leurs droits et anime la vie du Centre.",
    verified: { enabled: true, label: "Page officielle de l’AEEBM" },
    logo: {
      src: logoBlanc,
      alt: "Logo de l’Association étudiante de l’École du Barreau de Montréal",
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
    // Personne morale sans but lucratif constituée en vertu de la partie III de la Loi sur les compagnies (RLRQ, c. C-38).
    legalStatus: "Organisme sans but lucratif",
    foundingDate: "1988-01-21", // Lettres patentes du 21 janvier 1988
    // La politique de confidentialité reste publiée à /confidentialite, sans lien depuis la page.
    legalLinks: [{ label: "Règlements généraux", href: A_COMPLETER }],
  },

  /* ─────────────────────── 2. PROCHAIN ÉVÉNEMENT (BANDEAU) ─────────────────────── */
  // Toujours le prochain événement public de l’Association. À terme : alimenté automatiquement par
  // l’agenda Google de l’AEEBM (voir README, « Évolution prévue »).
  alertBanner: {
    enabled: true,
    tone: "important",
    label: "AGA",
    // ⚠️ Ajouter l’heure et le lieu tirés de l’avis de convocation.
    message: "Assemblée générale annuelle le mercredi 30 septembre. Votre voix compte.",
    date: "2026-09-30", // Vignette de date du bandeau (facultative)
    link: { label: "Avis de convocation", href: A_COMPLETER },
    endsAt: "2026-10-01", // Masqué automatiquement après l’assemblée (minuit, heure de Montréal).
  },

  /* ───────────────────────────── 3. RÉSEAUX SOCIAUX ───────────────────────────── */
  // ⚠️ Remplacer les adresses A_COMPLETER par les comptes officiels de l’AEEBM.
  socials: [
    { platform: "instagram", href: "https://www.instagram.com/aeeb.mtl/", label: "Instagram de l’AEEBM (@aeeb.mtl)" },
    { platform: "linkedin", href: A_COMPLETER, label: "LinkedIn de l’AEEBM" },
    // Groupe de cohorte : préférer une Communauté WhatsApp (numéros masqués entre membres)
    // ou activer « Approuver les nouveaux participants ». Pour Discord : platform: "discord".
    { platform: "whatsapp", href: A_COMPLETER, label: "Groupe WhatsApp de la cohorte" },
    { platform: "facebook", href: A_COMPLETER, label: "Page Facebook de l’AEEBM" },
    { platform: "email", href: `mailto:${COURRIEL}`, label: `Écrire à ${COURRIEL}` },
  ],

  /* ───────────────────────────── 4. LIEN VEDETTE ───────────────────────────── */
  spotlight: {
    enabled: true,
    title: `Guide de la rentrée ${COHORTE}`,
    subtitle: "Calendrier, services et contacts utiles",
    href: "https://drive.google.com/file/d/1VreVTsNC5EDBW61fCb9X78cK8MtbBiTd/view?usp=sharing",
    icon: "BookOpen",
    badge: "Nouveau",
    // Dégradé propre au lien vedette, par thème (un thème absent reprend son dégradé d’accent).
    gradient: {
      ivoire: { from: "#A32D26", via: "#681A16", to: "#3A0D0A" },
      bordeaux: { from: "#A32D26", via: "#681A16", to: "#3A0D0A" },
      amethyste: { from: "#A21CAF", via: "#4F46E5", to: "#2563EB" },
    },
  },

  /* ───────────────────────────── 5. LIENS ───────────────────────────── */
  sections: [
    {
      id: "academique",
      title: "Réussir l’École",
      layout: "bento", // Premier lien en grande carte, les suivants en tuiles
      links: [
        {
          title: "Cliniques de préparation",
          subtitle: "Ateliers de révision avant l’examen",
          href: A_COMPLETER,
          icon: "NotebookPen",
          category: "academique",
        },
        {
          title: "Tutorat et entraide",
          subtitle: "Jumelage entre pairs, par matière",
          href: A_COMPLETER,
          icon: "UsersRound",
          category: "academique",
        },
        {
          title: "Guide des stages",
          subtitle: "Recherche de stage et entrevues",
          href: A_COMPLETER,
          icon: "BriefcaseBusiness",
          category: "carriere",
        },
      ],
    },
    {
      id: "vie-etudiante",
      title: "Vie étudiante",
      layout: "tiles", // Tuiles compactes côte à côte
      links: [
        {
          title: "Calendrier des événements",
          subtitle: "5 à 7, réseautage et soirées",
          href: A_COMPLETER,
          icon: "CalendarDays",
          category: "evenements",
        },
        {
          title: "Billetterie",
          subtitle: "Vos places pour les prochaines soirées",
          href: A_COMPLETER,
          icon: "Ticket",
          category: "evenements",
          badge: { label: "Nouveau", tone: "new" },
        },
        {
          title: "Boutique AEEBM",
          subtitle: "Vêtements et objets de l’AEEBM",
          href: A_COMPLETER,
          icon: "ShoppingBag",
          category: "evenements",
        },
      ],
    },
    {
      id: "representation",
      title: "Représentation et services",
      layout: "group", // Liens réunis dans un même bloc ; le lien « highlight » est mis en avant
      links: [
        {
          title: "Signaler une situation",
          subtitle: "Plainte ou préoccupation académique",
          // Formulaire Google (voir outils/formulaire-signalement.gs et README)
          href: "https://docs.google.com/forms/d/e/1FAIpQLSfvoNcePgYKI8_Cpp3PfOtka4BJ6iwCl4QSXROPPGu8nDWz4w/viewform",
          icon: "MessageSquareWarning",
          category: "representation",
          highlight: true,
        },
        {
          // Procès-verbaux : consultables par les membres (art. 20) ; les réserver à un dossier restreint.
          title: "Assemblées et documents officiels",
          subtitle: "Convocations, ordres du jour, règlements",
          href: A_COMPLETER,
          icon: "ScrollText",
          category: "representation",
        },
        {
          title: "Assurance santé et dentaire",
          subtitle: "Régime Alumo (anciennement ASEQ)",
          href: "https://www.alumo.ca", // ⚠️ Remplacer par le portail du régime de l’AEEBM (https://…alumo.ca)
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
    title: "Restez informés",
    description: "Ne manquez aucun avis ni événement du Barreau.",
    inputLabel: "Adresse courriel",
    placeholder: "Adresse courriel",
    buttonLabel: "S’abonner",
    loadingLabel: "Inscription en cours…",
    endpoint: "/api/newsletter",
    // Réponse identique pour une nouvelle adresse et une adresse déjà abonnée : la page ne révèle pas qui est inscrit.
    successTitle: "Vérifiez vos courriels",
    successMessage:
      "Si cette adresse n’est pas déjà abonnée, un lien de confirmation vient de vous être envoyé. Rien reçu ? Consultez vos courriels indésirables.",
    resetLabel: "Inscrire une autre adresse",
    invalidEmailMessage: "Veuillez entrer une adresse courriel valide.",
    removedMessage: `Cette adresse a été retirée de notre liste et ne peut pas être réinscrite ici. Écrivez-nous à ${COURRIEL}.`,
    errorMessage: `Inscription impossible pour le moment. Écrivez-nous à ${COURRIEL}.`,
    consentNote: "Avis, assemblées et événements de l’AEEBM. Désabonnement en un clic.",
  },

  /* ───────────────────────── CONFIDENTIALITÉ (Loi 25) ───────────────────────── */
  privacy: {
    officer: { title: "Présidence de l’AEEBM", email: COURRIEL },
    updatedAt: "2026-09-29",
    // Mailchimp mesure par défaut l’ouverture des courriels et les clics (Campagne › Settings & Tracking).
    // Passer à false seulement si « Track opens » et « Track clicks » sont décochés pour chaque envoi.
    emailTracking: true,
    processors: [
      { name: "Mailchimp (Intuit)", purpose: "envoi de l’infolettre", location: "États-Unis" },
      { name: "Google (Gmail)", purpose: "réception de vos courriels et demandes", location: "États-Unis" },
      // ⚠️ Ajuster selon l’hébergeur retenu pour le site.
      { name: "Vercel", purpose: "hébergement du site et transmission des inscriptions", location: "États-Unis" },
    ],
  },

  /* ───────────────────────────── PIED DE PAGE ───────────────────────────── */
  footer: {
    signature: `Conçu avec {heart} par l’exécutif ${COHORTE}`,
    links: [
      { label: "École du Barreau du Québec", href: "https://www.ecoledubarreau.qc.ca" },
      { label: "Barreau du Québec", href: "https://www.barreau.qc.ca" },
    ],
  },
};
