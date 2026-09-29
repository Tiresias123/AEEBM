import type { AlertBannerConfig } from "@/config/types";

export const BANNER_STORAGE_PREFIX = "aeebm:bandeau:";

/**
 * Script exécuté avant le premier affichage : masque le bandeau (sans décalage de mise en page)
 * s’il a été fermé par la personne ou s’il est hors de sa période de diffusion.
 */
export function bannerPrepaintScript(banner: AlertBannerConfig): string {
  const start = banner.startsAt ? JSON.stringify(banner.startsAt) : "null";
  const end = banner.endsAt ? JSON.stringify(banner.endsAt) : "null";
  const key = JSON.stringify(BANNER_STORAGE_PREFIX + banner.id);
  return `(function(){var d=document.documentElement,n=Date.now(),s=${start},e=${end},h=(s&&n<Date.parse(s))||(e&&n>=Date.parse(e));try{h=h||localStorage.getItem(${key})==="1"}catch(_){}if(h)d.setAttribute("data-banner-hidden","")})();`;
}
