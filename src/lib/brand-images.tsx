import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/links.config";
import { monogramFaviconSvg, monogramSvg, svgToDataUri, type MonogramColors } from "@/lib/monogram-svg";
import { activeTheme } from "@/lib/site";

/** Couleurs du monogramme pour le thème actif (disque bordeaux et encre ivoire par défaut, charte section 10). */
export function monogramColors(): MonogramColors {
  const { avatar, onAccent } = activeTheme.colors;
  return { discFrom: avatar.from, discTo: avatar.to, ink: onAccent };
}

/** Monogramme « avatar rond » aux couleurs du thème, en SVG autonome. */
function themedMonogramSvg(strokeWidth = 1.6): string {
  return monogramSvg(monogramColors(), { strokeWidth });
}

export function themedMonogramUri(strokeWidth = 1.6): string {
  return svgToDataUri(themedMonogramSvg(strokeWidth));
}

/** Favicon lisible à 16-32 px : carré arrondi plein, sigle agrandi, traits renforcés. */
export function themedFaviconSvg(): string {
  return monogramFaviconSvg(monogramColors());
}

type IconVariant =
  /** Disque sur fond transparent (icône « any » du manifeste). */
  | "disc"
  /** Tuile pleine, bord à bord (écran d’accueil iOS, icône « maskable ») : iOS et Android arrondissent eux-mêmes. */
  | "tile"
  /** Favicon PNG (≤ 48 px). */
  | "favicon";

/** Icône PNG de l’application (favicon, écran d’accueil, manifeste). */
export function renderIcon({
  size,
  variant = "disc",
  safeZone = 1,
}: {
  size: number;
  variant?: IconVariant;
  safeZone?: number;
}) {
  const colors = monogramColors();
  const svg =
    variant === "favicon"
      ? themedFaviconSvg()
      : variant === "tile"
        ? monogramSvg(colors, { shape: "square", scale: safeZone, strokeWidth: size <= 200 ? 2.6 : 2 })
        : monogramSvg(colors, { strokeWidth: size <= 200 ? 2.4 : 1.8 });
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- rendu Satori, pas de next/image */}
      <img src={svgToDataUri(svg)} width={size} height={size} alt="" />
    </div>,
    { width: size, height: size },
  );
}

type FontWeight = 500 | 600 | 800;

async function loadFont(file: string) {
  return readFile(join(process.cwd(), "src/assets/fonts", file));
}

/** Polices pour Satori (TTF statiques, sous-ensemble latin) selon le thème actif. */
export async function loadThemeFonts() {
  const fonts: { name: string; data: Buffer; weight: FontWeight; style: "normal" }[] = [];
  if (activeTheme.fonts.display === "cormorant") {
    fonts.push({
      name: "Display",
      data: await loadFont("CormorantGaramond-SemiBold.ttf"),
      weight: 600,
      style: "normal",
    });
  } else {
    fonts.push({
      name: "Display",
      data: await loadFont("PlusJakartaSans-ExtraBold.ttf"),
      weight: 800,
      style: "normal",
    });
  }
  const body = activeTheme.fonts.body === "poppins" ? "Poppins-Medium.ttf" : "PlusJakartaSans-Medium.ttf";
  fonts.push({ name: "Body", data: await loadFont(body), weight: 500, style: "normal" });
  return fonts;
}

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = `${siteConfig.association.acronym} · ${siteConfig.association.displayName}`;
