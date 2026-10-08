import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/links.config";
import { getSiteUrl } from "@/lib/site";

/** Généré au build (aussi requis pour l’export statique de Cloudflare Pages). */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...(siteConfig.partners?.enabled
      ? [
          {
            url: `${siteUrl}/partenaires`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.6,
          },
        ]
      : []),
    { url: `${siteUrl}/confidentialite`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
