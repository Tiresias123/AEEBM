/**
 * Jetons de design (design tokens) par thème.
 *
 * Source unique des couleurs : injectées en variables CSS sur <html>, et réutilisées
 * pour l’image OpenGraph, le manifeste PWA et la couleur de la barre du navigateur.
 *
 * - « amethyste » : direction « Dark Luxury / Glassmorphism » (pourpre, indigo, cobalt).
 * - « barreau »   : déclinaison sombre de la charte AEEBM 2026-2027 (bordeaux Barreau,
 *                   neutres chauds, sauge pour « vérifié », grenat réservé aux appels à l’action,
 *                   Cormorant Garamond + Poppins).
 */

export type ThemeName = "amethyste" | "barreau";

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
  colors: {
    bg: string;
    bgElevated: string;
    text: string;
    textSoft: string;
    textMuted: string;
    /** Halos d’ambiance (4 calques radiaux). */
    glow: [string, string, string, string];
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
    /** Squircles d’icônes par catégorie. */
    categories: Record<LinkCategory, Gradient>;
    /** Pastilles de statut des liens. */
    badges: Record<"new" | "important" | "deadline" | "info", string>;
  };
  /** Opacité du voile de bruit. */
  noiseOpacity: number;
}

export const themes: Record<ThemeName, ThemeTokens> = {
  amethyste: {
    label: "Améthyste — Dark Luxury",
    fonts: { display: "jakarta", body: "jakarta" },
    browserColor: "#08090D",
    qrColor: "#141129",
    colors: {
      bg: "#08090D",
      bgElevated: "#0D0E15",
      text: "#FFFFFF",
      textSoft: "#D4D4D8",
      textMuted: "#A1A1AA",
      glow: ["#312E81", "#701A75", "#1E40AF", "#1E1B4B"],
      accent: { from: "#A21CAF", via: "#6366F1", to: "#3B82F6" },
      onAccent: "#FFFFFF",
      ring: ["#E879F9", "#8B5CF6", "#3B82F6"],
      subtitle: { from: "#F0ABFC", to: "#A5B4FC" },
      verified: { from: "#A855F7", to: "#6366F1" },
      avatar: { from: "#2E1065", to: "#0B0B1A" },
      cta: { from: "#C026D3", to: "#6366F1" },
      confetti: ["#E879F9", "#A855F7", "#6366F1", "#3B82F6", "#FFFFFF"],
      categories: {
        academique: { from: "#818CF8", to: "#4F46E5" },
        evenements: { from: "#F472B6", to: "#C026D3" },
        carriere: { from: "#60A5FA", to: "#1D4ED8" },
        representation: { from: "#A855F7", to: "#6D28D9" },
        services: { from: "#64748B", to: "#1E293B" },
      },
      badges: {
        new: "#E879F9",
        important: "#FBBF24",
        deadline: "#FB7185",
        info: "#93C5FD",
      },
    },
    noiseOpacity: 0.035,
  },
  barreau: {
    label: "Barreau — charte AEEBM 2026-2027",
    fonts: { display: "cormorant", body: "poppins" },
    browserColor: "#0B0909",
    qrColor: "#681A16",
    colors: {
      bg: "#0B0909",
      bgElevated: "#120E0E",
      text: "#FAF7F4", // Ivoire
      textSoft: "#DAD2CE", // Brume
      textMuted: "#A39894", // Pierre éclaircie pour le contraste sur fond sombre
      glow: ["#681A16", "#4A1310", "#2A1614", "#3D1411"],
      accent: { from: "#8A2520", via: "#681A16", to: "#4A1310" }, // Bordeaux Barreau
      onAccent: "#FAF7F4",
      ring: ["#F5EAE8", "#681A16", "#DAD2CE"], // Rosé, bordeaux, brume
      subtitle: { from: "#F5EAE8", to: "#DAD2CE" },
      verified: { from: "#7FA08A", to: "#6F8F7A" }, // Sauge : statut « vérifié »
      avatar: { from: "#681A16", to: "#681A16" }, // Monogramme « avatar rond » sur bordeaux
      cta: { from: "#7E1019", to: "#7E1019" }, // Grenat : réservé aux appels à l’action
      confetti: ["#681A16", "#F5EAE8", "#FAF7F4", "#DAD2CE", "#6F8F7A"],
      categories: {
        academique: { from: "#6A4640", to: "#3A2624" },
        evenements: { from: "#8A3A34", to: "#5E1C18" },
        carriere: { from: "#6E6663", to: "#45403E" },
        representation: { from: "#7A221D", to: "#4A1310" },
        services: { from: "#3A3432", to: "#221E1E" },
      },
      badges: {
        new: "#F5EAE8",
        important: "#DAD2CE",
        deadline: "#E8A09A",
        info: "#B9CDBF",
      },
    },
    noiseOpacity: 0.04,
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
    "--noise-opacity": String(theme.noiseOpacity),
  };
  for (const [category, gradient] of Object.entries(c.categories)) {
    vars[`--cat-${category}-from`] = gradient.from;
    vars[`--cat-${category}-to`] = gradient.to;
  }
  return vars;
}
