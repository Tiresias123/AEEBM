import { themedMonogramSvg } from "@/lib/brand-images";

export const dynamic = "force-static";

/** Favicon vectoriel : monogramme AEEBM aux couleurs du thème (trait renforcé pour les petites tailles). */
export function GET() {
  return new Response(themedMonogramSvg(3.2), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
