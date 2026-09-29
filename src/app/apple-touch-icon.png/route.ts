import { renderIcon } from "@/lib/brand-images";

export const dynamic = "force-static";

/** Icône d’écran d’accueil iOS : tuile bordeaux bord à bord (iOS arrondit lui-même les angles). */
export function GET() {
  return renderIcon({ size: 180, variant: "tile", safeZone: 1.12 });
}
