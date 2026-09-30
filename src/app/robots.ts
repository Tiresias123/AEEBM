import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

/** Généré au build (aussi requis pour l’export statique de Cloudflare Pages). */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
