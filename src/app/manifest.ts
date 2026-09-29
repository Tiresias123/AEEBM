import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/links.config";
import { activeTheme } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  const { association } = siteConfig;
  return {
    name: `${association.acronym} · ${association.displayName}`,
    short_name: association.acronym,
    description: association.mission,
    lang: "fr-CA",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: activeTheme.colors.bg,
    theme_color: activeTheme.browserColor,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
