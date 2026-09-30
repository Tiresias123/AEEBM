import { OG_ALT, OG_SIZE } from "@/lib/brand-images";
import { ogImageResponse } from "@/lib/og-render";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = "image/jpeg";
/** Générée au build (aussi requis pour l’export statique de Cloudflare Pages). */
export const dynamic = "force-static";

/** Image de partage (OpenGraph), générée au build à partir de la configuration et du thème. */
export default function OpenGraphImage() {
  return ogImageResponse();
}
