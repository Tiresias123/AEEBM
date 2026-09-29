import type { Metadata } from "next";
import { siteConfig } from "@/config/links.config";
import { OG_ALT, OG_SIZE } from "@/lib/brand-images";

/**
 * Métadonnées OpenGraph et Twitter d’une page. Une page qui définit `openGraph` remplace entièrement
 * celui du layout et perd l’image générée : on la déclare donc explicitement.
 */
export function socialMetadata(
  path: string,
  title: string,
  description: string,
): Pick<Metadata, "openGraph" | "twitter"> {
  const image = { width: OG_SIZE.width, height: OG_SIZE.height, alt: OG_ALT, type: "image/jpeg" };
  return {
    openGraph: {
      type: "website",
      locale: "fr_CA",
      siteName: siteConfig.association.acronym,
      url: path,
      title,
      description,
      images: [{ url: "/opengraph-image", ...image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: "/twitter-image", ...image }],
    },
  };
}
