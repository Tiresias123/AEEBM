import { themedMonogramSvg } from "@/lib/brand-images";

export const dynamic = "force-static";

/** Monogramme incrusté au centre du code QR (chargé seulement à l’ouverture de la fenêtre de partage). */
export function GET() {
  return new Response(themedMonogramSvg(2.6), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
