/**
 * Version statique du site pour Cloudflare Pages (dépôt direct, sans serveur) : npm run build:cloudflare
 *
 * - Construit le site en fichiers HTML (dossier out/), puis le compresse dans aeebm-cloudflare.zip.
 * - L’API d’infolettre (serveur) est mise de côté le temps du build : le module d’inscription est retiré de la page.
 * - Ajoute out/_headers (en-têtes de sécurité) et out/_redirects (images de partage), lus par Cloudflare Pages.
 *
 * Adresse publique (image de partage, SEO) : NEXT_PUBLIC_SITE_URL, par défaut https://aeebm.pages.dev.
 *   NEXT_PUBLIC_SITE_URL=https://aeebm.ca npm run build:cloudflare
 */
import { execSync } from "node:child_process";
import { existsSync, renameSync, writeFileSync } from "node:fs";

const API = "src/app/api";
const PARKED = "src/.api-hors-export";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aeebm.pages.dev";

// Build précédent interrompu : on remet l’API en place avant tout.
if (existsSync(PARKED) && !existsSync(API)) renameSync(PARKED, API);

renameSync(API, PARKED);
try {
  execSync("npx next build", {
    stdio: "inherit",
    env: { ...process.env, STATIC_EXPORT: "1", NEXT_PUBLIC_SITE_URL: siteUrl },
  });
} finally {
  renameSync(PARKED, API);
}

// Mêmes en-têtes de sécurité que next.config.ts (à garder alignés).
const headers = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];
writeFileSync("out/_headers", `/*\n${headers.map(({ key, value }) => `  ${key}: ${value}`).join("\n")}\n`);

// Images de partage générées sans extension : servies en .jpg (bon type MIME), l’adresse d’origine réécrite.
const redirects = [];
for (const name of ["opengraph-image", "twitter-image"]) {
  if (existsSync(`out/${name}`)) {
    renameSync(`out/${name}`, `out/${name}.jpg`);
    redirects.push(`/${name} /${name}.jpg 200`);
  }
}
writeFileSync("out/_redirects", `${redirects.join("\n")}\n`);

// Archive pour le dépôt manuel (facultative : absente si « zip » n’est pas installé, p. ex. sur les serveurs de build).
let archive = "";
try {
  execSync("rm -f aeebm-cloudflare.zip && cd out && zip -qr ../aeebm-cloudflare.zip .", { stdio: "ignore" });
  archive = " et aeebm-cloudflare.zip";
} catch {
  // Cloudflare Pages relié à GitHub publie directement le dossier out/.
}
console.log(`\n✓ Site statique prêt : out/${archive} (adresse publique : ${siteUrl})`);
