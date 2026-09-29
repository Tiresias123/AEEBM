import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/links.config";
import { monogramSvg, svgToDataUri } from "@/lib/monogram-svg";
import { activeTheme } from "@/lib/site";

/** Monogramme aux couleurs du thème actif (trait épaissi pour les petites tailles). */
export function themedMonogramUri(strokeWidth = 1.6): string {
  const { avatar, onAccent } = activeTheme.colors;
  return svgToDataUri(monogramSvg({ discFrom: avatar.from, discTo: avatar.to, ink: onAccent }, strokeWidth));
}

export function themedMonogramSvg(strokeWidth = 1.6): string {
  const { avatar, onAccent } = activeTheme.colors;
  return monogramSvg({ discFrom: avatar.from, discTo: avatar.to, ink: onAccent }, strokeWidth);
}

interface IconOptions {
  size: number;
  /** Marge autour du disque, en fraction de la taille (zone de sécurité des icônes « maskable »). */
  inset?: number;
  /** Fond plein derrière le disque (icônes Apple et « maskable »). */
  background?: boolean;
}

/** Icône PNG de l’application (favicon, écran d’accueil, manifeste). */
export function renderIcon({ size, inset = 0, background = false }: IconOptions): ImageResponse {
  const disc = Math.round(size * (1 - inset * 2));
  const stroke = size <= 64 ? 3.2 : size <= 200 ? 2.4 : 1.8;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: background ? activeTheme.colors.bg : "transparent",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- rendu Satori, pas de next/image */}
      <img src={themedMonogramUri(stroke)} width={disc} height={disc} alt="" />
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
  if (activeTheme.fonts.body === "poppins") {
    fonts.push({ name: "Body", data: await loadFont("Poppins-Medium.ttf"), weight: 500, style: "normal" });
  } else {
    fonts.push({ name: "Body", data: await loadFont("PlusJakartaSans-Medium.ttf"), weight: 500, style: "normal" });
  }
  return fonts;
}

/** Retire les émojis (non inclus dans les polices embarquées). */
export function stripEmoji(text: string): string {
  return text
    .replace(/[\p{Extended_Pictographic}️‍]/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = `${siteConfig.association.acronym} · ${siteConfig.association.displayName}`;
