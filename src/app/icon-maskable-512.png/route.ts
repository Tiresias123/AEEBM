import { renderIcon } from "@/lib/brand-images";

export const dynamic = "force-static";

/** Icône « maskable » : disque dans la zone de sécurité (80 %) sur fond plein. */
export function GET() {
  return renderIcon({ size: 512, inset: 0.1, background: true });
}
