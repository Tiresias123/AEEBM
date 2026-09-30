import type { NextConfig } from "next";

// Aussi reportés dans out/_headers pour Cloudflare Pages (scripts/build-static.mjs).
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

/** Export statique pour Cloudflare Pages (npm run build:cloudflare) : fichiers HTML seuls, sans serveur. */
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(staticExport
    ? {
        output: "export",
        // Sans serveur, pas d’optimisation d’images à la volée : le logo est servi tel quel.
        images: { unoptimized: true },
      }
    : {
        images: { formats: ["image/avif", "image/webp"] },
        async headers() {
          return [{ source: "/:path*", headers: securityHeaders }];
        },
      }),
};

export default nextConfig;
