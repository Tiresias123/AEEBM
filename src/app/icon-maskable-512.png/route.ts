import { renderIcon } from "@/lib/brand-images";

export const dynamic = "force-static";

/** Icône « maskable » : tuile pleine, monogramme dans la zone de sécurité centrale (80 %). */
export function GET() {
  return renderIcon({ size: 512, variant: "tile", safeZone: 1 });
}
