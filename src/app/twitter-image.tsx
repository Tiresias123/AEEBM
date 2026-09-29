import { OG_ALT, OG_SIZE } from "@/lib/brand-images";
import { ogImageResponse } from "@/lib/og-render";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = "image/jpeg";

/** Image de partage (Twitter / X), identique à l’image OpenGraph. */
export default function TwitterImage() {
  return ogImageResponse();
}
