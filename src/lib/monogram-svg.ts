import { MONOGRAM_TEXT_PATH } from "@/components/brand/monogram-path";

/** Géométrie du cercle ouvert : rayon 67, interrompu de ±22° de part et d’autre du sigle (charte, section 10). */
const R = 67;
const GAP = (22 * Math.PI) / 180;
const DX = +(R * Math.cos(GAP)).toFixed(2);
const DY = +(R * Math.sin(GAP)).toFixed(2);

export const MONOGRAM_ARCS = {
  top: `M${100 - DX} ${100 - DY}A${R} ${R} 0 0 1 ${100 + DX} ${100 - DY}`,
  bottom: `M${100 - DX} ${100 + DY}A${R} ${R} 0 0 0 ${100 + DX} ${100 + DY}`,
};

export interface MonogramColors {
  discFrom: string;
  discTo: string;
  ink: string;
}

interface MonogramOptions {
  /** Épaisseur du cercle ouvert (sur 200). */
  strokeWidth?: number;
  /** Fond : disque (avatar rond), carré plein (tuile d’icône) ou carré arrondi (favicon). */
  shape?: "disc" | "square" | "rounded";
  /** Agrandit cercle et sigle ensemble (petites tailles). */
  scale?: number;
  /** Épaississement des lettres, pour la lisibilité à 16-32 px. */
  letterStroke?: number;
}

/**
 * Monogramme AEEBM en SVG autonome (chaîne), avec couleurs explicites.
 * Sert au code QR, à l’image de partage et aux icônes, où les variables CSS ne sont pas disponibles.
 */
export function monogramSvg(
  { discFrom, discTo, ink }: MonogramColors,
  { strokeWidth = 1.6, shape = "disc", scale = 1, letterStroke = 0 }: MonogramOptions = {},
): string {
  const background =
    shape === "disc"
      ? `<circle cx="100" cy="100" r="100" fill="url(#d)"/>`
      : `<rect width="200" height="200" rx="${shape === "rounded" ? 44 : 0}" fill="url(#d)"/>`;
  const glyphStroke = letterStroke > 0 ? ` stroke="${ink}" stroke-width="${letterStroke}" stroke-linejoin="round"` : "";
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">`,
    `<defs><linearGradient id="d" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${discFrom}"/><stop offset="1" stop-color="${discTo}"/></linearGradient></defs>`,
    background,
    `<g transform="translate(100 100) scale(${scale}) translate(-100 -100)">`,
    `<g fill="none" stroke="${ink}" stroke-width="${+(strokeWidth / scale).toFixed(2)}" stroke-linecap="round">`,
    `<path d="${MONOGRAM_ARCS.top}"/><path d="${MONOGRAM_ARCS.bottom}"/>`,
    `</g>`,
    `<path d="${MONOGRAM_TEXT_PATH}" fill="${ink}"${glyphStroke}/>`,
    `</g>`,
    `</svg>`,
  ].join("");
}

/** Variante pour les favicons (≤ 32 px) : carré arrondi plein, cercle et sigle agrandis, traits renforcés. */
export function monogramFaviconSvg(colors: MonogramColors): string {
  return monogramSvg(colors, { shape: "rounded", scale: 1.32, strokeWidth: 7, letterStroke: 1.4 });
}

export function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
