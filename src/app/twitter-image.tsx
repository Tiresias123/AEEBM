import { OG_ALT, OG_SIZE } from "@/lib/brand-images";
import { ogImageResponse } from "@/lib/og-render";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = "image/jpeg";
/** Générée au build (aussi requis pour l’export statique de Cloudflare Pages). */
export const dynamic = "force-static";

/** Image de partage (Twitter / X), identique à l’image OpenGraph. */
export default function TwitterImage() {
  return ogImageResponse();
}
