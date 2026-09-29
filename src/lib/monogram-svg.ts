import { MONOGRAM_TEXT_PATH } from "@/components/brand/monogram-path";

const R = 67;
const GAP = (22 * Math.PI) / 180;
const DX = +(R * Math.cos(GAP)).toFixed(2);
const DY = +(R * Math.sin(GAP)).toFixed(2);

export interface MonogramColors {
  discFrom: string;
  discTo: string;
  ink: string;
}

/**
 * Monogramme AEEBM en SVG autonome (chaîne), avec couleurs explicites.
 * Sert au code QR, à l’image OpenGraph et aux icônes, où les variables CSS ne sont pas disponibles.
 */
export function monogramSvg({ discFrom, discTo, ink }: MonogramColors, strokeWidth = 1.6): string {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">`,
    `<defs><linearGradient id="d" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${discFrom}"/><stop offset="1" stop-color="${discTo}"/></linearGradient></defs>`,
    `<circle cx="100" cy="100" r="100" fill="url(#d)"/>`,
    `<g fill="none" stroke="${ink}" stroke-width="${strokeWidth}" stroke-linecap="round">`,
    `<path d="M${100 - DX} ${100 - DY}A${R} ${R} 0 0 1 ${100 + DX} ${100 - DY}"/>`,
    `<path d="M${100 - DX} ${100 + DY}A${R} ${R} 0 0 0 ${100 + DX} ${100 + DY}"/>`,
    `</g>`,
    `<path d="${MONOGRAM_TEXT_PATH}" fill="${ink}"/>`,
    `</svg>`,
  ].join("");
}

export function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
