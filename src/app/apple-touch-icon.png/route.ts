import { renderIcon } from "@/lib/brand-images";

export const dynamic = "force-static";

/** Icône d’écran d’accueil iOS (fond plein : iOS arrondit lui-même les angles). */
export function GET() {
  return renderIcon({ size: 180, inset: 0.06, background: true });
}
