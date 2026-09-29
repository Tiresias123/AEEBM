/**
 * Jetons de design (design tokens) par thème.
 *
 * Source unique des couleurs : injectées en variables CSS sur <html>, et réutilisées
 * pour l’image OpenGraph, le manifeste PWA et la couleur de la barre du navigateur.
 *
 * - « ivoire »    (défaut) : charte AEEBM 2026-2027 sur papier blanc cassé légèrement grainé, encre
 *                   bordeaux-noir, bulles blanches à filet chaud, bordeaux Barreau pour les titres et le lien
 *                   vedette, posé sur un fond bordeaux sombre (grand écran).
 * - « bordeaux »  : direction artistique de la charte AEEBM 2026-2027 en version sombre.
 *                   Bordeaux Barreau #681A16 et ses nuances (grenat, bordeaux profond), neutres chauds
 *                   (ivoire, rosé, brume, pierre), sauge réservée à « vérifié », grenat réservé aux appels
 *                   à l’action, Cormorant Garamond + Poppins, cercle ouvert.
 * - « amethyste » : direction « Dark Luxury / Glassmorphism » (pourpre, indigo, cobalt).
 */

export type ThemeName = "ivoire" | "bordeaux" | "amethyste";

export type BadgeTone = "new" | "important" | "deadline" | "info";

export type LinkCategory = "academique" | "evenements" | "carriere" | "representation" | "services";

interface Gradient {
  from: string;
  to: string;
}

export interface ThemeTokens {
  /** Libellé lisible du thème (documentation). */
  label: string;
  fonts: { display: "jakarta" | "cormorant"; body: "jakarta" | "poppins" };
  /** Couleur de la barre d’adresse mobile et du manifeste. */
  browserColor: string;
  /** Couleur des modules du code QR (sur fond blanc). */
  qrColor: string;
  /** Couleur de la légende (URL) sous le code QR, sur fond blanc. */
  qrCaptionColor: string;
  /** Anneau de l’avatar : continu, ou ouvert comme le cercle de la charte (interrompu dans l’axe du sigle). */
  avatarRing: "closed" | "open";
  colors: {
    bg: string;
    bgElevated: string;
    text: string;
    textSoft: string;
    textMuted: string;
    /** Halos d’ambiance (4 calques radiaux). */
    glow: [string, string, string, string];
    /** Support de la page (surface teintée et grainée) : dégradé vertical et lumière d’ambiance. */
    panel: { from: string; to: string; light: string };
    /** Dégradé d’accent principal (bouton vedette, boutons d’action). */
    accent: { from: string; via: string; to: string };
    /** Texte du bouton vedette et des boutons d’action. */
    onAccent: string;
    /** Anneau lumineux de l’avatar (dégradé conique). */
    ring: [string, string, string];
    /** Dégradé du sous-titre. */
    subtitle: Gradient;
    /** Pastille de vérification. */
    verified: Gradient;
    /** Disque de l’avatar (monogramme). */
    avatar: Gradient;
    /** Bouton d’inscription à l’infolettre. */
    cta: Gradient;
    /** Couleurs des confettis. */
    confetti: string[];
    /** Teinte des tuiles d’icônes par catégorie. */
    categories: Record<LinkCategory, string>;
    /** Pastilles de statut des liens : couleur du libellé, puis du point. */
    badges: Record<BadgeTone, string>;
    badgeDots: Record<BadgeTone, string>;
    /** Liseré autour du point de pastille (utile quand le point est plus sombre que le fond). */
    badgeDotRing: string;
    /** Messages d’erreur des formulaires. */
    danger: string;
    /** Titres de section. */
    heading: string;
    /**
     * Bulles d’information posées sur le support (cartes, bandeau, boutons ronds, champs) : fond, fond au
     * survol, fond des champs, filet, filet appuyé, ombre ; teinte des tuiles d’icônes (fond et icône, en %).
     */
    surface: {
      scheme: "light" | "dark";
      fill: string;
      fillHover: string;
      fillStrong: string;
      line: string;
      lineStrong: string;
      shadow: string;
      tileBg: string;
      tileFg: string;
      /** Relief des grands titres (gaufrage sur papier) : ombre de texte, ou « none ». */
      emboss: string;
    };
  };
  /** Opacité du voile de bruit. */
  noiseOpacity: number;
}

export const themes: Record<ThemeName, ThemeTokens> = {
  ivoire: {
    label: "Ivoire — charte AEEBM 2026-2027 (papier)",
    fonts: { display: "cormorant", body: "poppins" },
    browserColor: "#F6F0E7", // Haut du support sur téléphone
    qrColor: "#681A16",
    qrCaptionColor: "#6E6663", // Pierre : texte secondaire sur fond clair
    avatarRing: "open",
    colors: {
      bg: "#0B0909", // Fond bordeaux sombre autour du support (grand écran)
      bgElevated: "#FFFDF9",
      text: "#1E1514", // Encre bordeaux-noir
      textSoft: "#4A3C38",
      textMuted: "#635B58", // Pierre (charte), à peine assombrie : 4,5:1 jusqu’au bas du support
      glow: ["#7E211B", "#4A1310", "#2E1715", "#4E1511"],
      panel: { from: "#F8F3EA", to: "#EEE4D5", light: "#FFFFFF" }, // Blanc cassé vers beige, lumière du haut
      accent: { from: "#9E2B25", via: "#681A16", to: "#4A1310" }, // Bordeaux Barreau
      onAccent: "#FAF7F4",
      ring: ["#8A2520", "#681A16", "#C9A9A2"], // Bordeaux clair, bordeaux, rosé poudré
      subtitle: { from: "#681A16", to: "#8A2520" },
      verified: { from: "#5F8069", to: "#4E6E58" }, // Sauge foncée : contraste suffisant sur papier
      avatar: { from: "#681A16", to: "#681A16" },
      cta: { from: "#7E1019", to: "#7E1019" }, // Grenat : réservé aux appels à l’action
      confetti: ["#681A16", "#7E1019", "#C9A9A2", "#6E6663", "#5F8069"],
      categories: {
        academique: "#9A3B32", // Bordeaux clair
        evenements: "#A8243A", // Grenat
        carriere: "#8C5E50", // Cuir
        representation: "#681A16", // Bordeaux Barreau
        services: "#8C4A4F", // Bois de rose
      },
      badges: {
        new: "#681A16",
        important: "#8A2520",
        deadline: "#7E1019",
        info: "#5A504C",
      },
      badgeDots: {
        new: "#681A16",
        important: "#8A2520",
        deadline: "#7E1019",
        info: "#6E6663",
      },
      badgeDotRing: "transparent",
      danger: "#A1231C",
      heading: "#681A16",
      surface: {
        scheme: "light",
        fill: "rgb(255 253 249 / 0.84)",
        fillHover: "#FFFFFF",
        fillStrong: "#FFFFFF",
        line: "rgb(104 26 22 / 0.13)",
        lineStrong: "rgb(104 26 22 / 0.32)",
        shadow: "0 1px 2px rgb(74 35 28 / 0.05), 0 12px 28px -18px rgb(74 35 28 / 0.32)",
        tileBg: "10%",
        tileFg: "100%",
        emboss: "0 1px 0 rgb(255 255 255 / 0.8), 0 -0.5px 0 rgb(60 14 10 / 0.12)",
      },
    },
    noiseOpacity: 0.04,
  },
  bordeaux: {
    label: "Bordeaux — charte AEEBM 2026-2027",
    fonts: { display: "cormorant", body: "poppins" },
    browserColor: "#2F1816", // Haut du support sur téléphone
    qrColor: "#681A16",
    qrCaptionColor: "#6E6663", // Pierre : texte secondaire sur fond clair
    avatarRing: "open",
    colors: {
      bg: "#0B0909",
      bgElevated: "#120E0E",
      text: "#FAF7F4", // Ivoire
      textSoft: "#DAD2CE", // Brume
      textMuted: "#A39894", // Pierre éclaircie pour le contraste sur fond sombre
      glow: ["#7E211B", "#4A1310", "#2E1715", "#4E1511"], // Bordeaux lumineux, bordeaux profond, pierre chaude
      panel: { from: "#1D1312", to: "#110C0C", light: "#681A16" }, // Bordeaux fumé, éclairé par le haut
      accent: { from: "#8A2520", via: "#681A16", to: "#4A1310" }, // Bordeaux Barreau
      onAccent: "#FAF7F4",
      ring: ["#F5EAE8", "#681A16", "#DAD2CE"], // Rosé, bordeaux, brume
      subtitle: { from: "#F5EAE8", to: "#DAD2CE" },
      verified: { from: "#7FA08A", to: "#6F8F7A" }, // Sauge : statut « vérifié »
      avatar: { from: "#681A16", to: "#681A16" }, // Monogramme « avatar rond » sur bordeaux
      cta: { from: "#7E1019", to: "#7E1019" }, // Grenat : réservé aux appels à l’action
      confetti: ["#681A16", "#F5EAE8", "#FAF7F4", "#DAD2CE", "#A39894"],
      // Nuancier dérivé de la charte.
      categories: {
        academique: "#9A3B32", // Bordeaux clair
        evenements: "#A8243A", // Grenat
        carriere: "#8C5E50", // Cuir (bordeaux et pierre)
        representation: "#84231D", // Bordeaux Barreau profond
        services: "#8C4A4F", // Bois de rose (bordeaux et rosé)
      },
      // Étiquettes en ivoire, rosé ou brume ; grenat réservé au point « à traiter » (charte, section 13).
      badges: {
        new: "#F5EAE8",
        important: "#DAD2CE",
        deadline: "#FAF7F4",
        info: "#DAD2CE",
      },
      badgeDots: {
        new: "#F5EAE8",
        important: "#DAD2CE",
        deadline: "#7E1019",
        info: "#A39894",
      },
      badgeDotRing: "#F5EAE8",
      danger: "#F0B8B2",
      heading: "#CFC6C2",
      surface: {
        scheme: "dark",
        fill: "rgb(255 255 255 / 0.05)",
        fillHover: "rgb(255 255 255 / 0.075)",
        fillStrong: "rgb(0 0 0 / 0.3)",
        line: "rgb(255 255 255 / 0.07)",
        lineStrong: "rgb(255 255 255 / 0.22)",
        shadow: "inset 0 1px 0 0 rgb(255 255 255 / 0.04)",
        tileBg: "26%",
        tileFg: "22%",
        emboss: "none",
      },
    },
    noiseOpacity: 0.04,
  },
  amethyste: {
    label: "Améthyste — Dark Luxury",
    fonts: { display: "jakarta", body: "jakarta" },
    browserColor: "#08090D",
    qrColor: "#141129",
    qrCaptionColor: "#6B6780",
    avatarRing: "closed",
    colors: {
      bg: "#08090D",
      bgElevated: "#0D0E15",
      text: "#FFFFFF",
      textSoft: "#D4D4D8",
      textMuted: "#A1A1AA",
      glow: ["#312E81", "#701A75", "#1E40AF", "#1E1B4B"],
      panel: { from: "#13131F", to: "#0B0C12", light: "#312E81" },
      // Dégradé fuchsia › indigo › cobalt, assombri pour un texte blanc lisible (≥ 4,5:1) sur tout le dégradé.
      accent: { from: "#A21CAF", via: "#4F46E5", to: "#2563EB" },
      onAccent: "#FFFFFF",
      ring: ["#E879F9", "#8B5CF6", "#3B82F6"],
      subtitle: { from: "#F0ABFC", to: "#A5B4FC" },
      verified: { from: "#A855F7", to: "#6366F1" },
      avatar: { from: "#681A16", to: "#681A16" }, // Monogramme officiel, aplat bordeaux Barreau (charte, section 10)
      cta: { from: "#C026D3", to: "#4F46E5" },
      confetti: ["#E879F9", "#A855F7", "#6366F1", "#3B82F6", "#FFFFFF"],
      categories: {
        academique: "#818CF8",
        evenements: "#F472B6",
        carriere: "#60A5FA",
        representation: "#A855F7",
        services: "#2DD4BF",
      },
      badges: {
        new: "#E879F9",
        important: "#FBBF24",
        deadline: "#FB7185",
        info: "#93C5FD",
      },
      badgeDots: {
        new: "#E879F9",
        important: "#FBBF24",
        deadline: "#FB7185",
        info: "#93C5FD",
      },
      badgeDotRing: "transparent",
      danger: "#FB7185",
      heading: "#C4C4CC",
      surface: {
        scheme: "dark",
        fill: "rgb(255 255 255 / 0.05)",
        fillHover: "rgb(255 255 255 / 0.075)",
        fillStrong: "rgb(0 0 0 / 0.3)",
        line: "rgb(255 255 255 / 0.07)",
        lineStrong: "rgb(255 255 255 / 0.22)",
        shadow: "inset 0 1px 0 0 rgb(255 255 255 / 0.04)",
        tileBg: "26%",
        tileFg: "22%",
        emboss: "none",
      },
    },
    noiseOpacity: 0.035,
  },
};

/** Convertit les jetons d’un thème en variables CSS appliquées sur <html>. */
export function themeToCssVariables(theme: ThemeTokens): Record<string, string> {
  const c = theme.colors;
  const vars: Record<string, string> = {
    "--bg": c.bg,
    "--bg-elevated": c.bgElevated,
    "--text": c.text,
    "--text-soft": c.textSoft,
    "--text-muted": c.textMuted,
    "--glow-1": c.glow[0],
    "--glow-2": c.glow[1],
    "--glow-3": c.glow[2],
    "--glow-4": c.glow[3],
    "--panel-from": c.panel.from,
    "--panel-to": c.panel.to,
    "--panel-light": c.panel.light,
    "--accent-from": c.accent.from,
    "--accent-via": c.accent.via,
    "--accent-to": c.accent.to,
    "--on-accent": c.onAccent,
    "--ring-1": c.ring[0],
    "--ring-2": c.ring[1],
    "--ring-3": c.ring[2],
    "--subtitle-from": c.subtitle.from,
    "--subtitle-to": c.subtitle.to,
    "--verified-from": c.verified.from,
    "--verified-to": c.verified.to,
    "--avatar-from": c.avatar.from,
    "--avatar-to": c.avatar.to,
    "--cta-from": c.cta.from,
    "--cta-to": c.cta.to,
    "--badge-new": c.badges.new,
    "--badge-important": c.badges.important,
    "--badge-deadline": c.badges.deadline,
    "--badge-info": c.badges.info,
    "--badge-new-dot": c.badgeDots.new,
    "--badge-important-dot": c.badgeDots.important,
    "--badge-deadline-dot": c.badgeDots.deadline,
    "--badge-info-dot": c.badgeDots.info,
    "--badge-dot-ring": c.badgeDotRing,
    "--danger": c.danger,
    "--noise-opacity": String(theme.noiseOpacity),
    "--heading": c.heading,
    "--scheme": c.surface.scheme,
    "--fill": c.surface.fill,
    "--fill-hover": c.surface.fillHover,
    "--fill-strong": c.surface.fillStrong,
    "--line": c.surface.line,
    "--line-strong": c.surface.lineStrong,
    "--card-shadow": c.surface.shadow,
    "--tile-bg": c.surface.tileBg,
    "--tile-fg": c.surface.tileFg,
    "--emboss": c.surface.emboss,
  };
  for (const [category, color] of Object.entries(c.categories)) vars[`--cat-${category}`] = color;
  return vars;
}
