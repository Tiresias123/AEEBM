import type { AlertBannerConfig, Schedule } from "@/config/types";

/** Clé localStorage : bandeau replié par la personne, pour un identifiant d’annonce donné. */
export const BANNER_STORAGE_PREFIX = "aeebm:bandeau:";

const TIME_ZONE = "America/Toronto"; // Heure de l’Est (Montréal)
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/;

/** Décalage de Montréal par rapport à UTC, en minutes, à un instant donné (−240 l’été, −300 l’hiver). */
function montrealOffsetMinutes(epochMs: number): number {
  const name =
    new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, timeZoneName: "longOffset" })
      .formatToParts(new Date(epochMs))
      .find((part) => part.type === "timeZoneName")?.value ?? "GMT";
  const match = /GMT([+-])(\d{2}):?(\d{2})?/.exec(name);
  if (!match) return 0;
  return (match[1] === "-" ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3] ?? 0));
}

/**
 * Convertit une date de la configuration en instant (ms). Sans fuseau, la date est lue à l’heure de Montréal :
 * "2026-10-01" = 1er octobre à 0 h à Montréal. Lève une erreur explicite au build si le format est invalide.
 */
export function toEpochMs(value: string, label: string): number {
  const match = ISO_DATE.exec(value.trim());
  if (!match) {
    throw new Error(`${label} : date invalide « ${value} » (formats acceptés : AAAA-MM-JJ ou AAAA-MM-JJTHH:MM)`);
  }
  const [, year, month, day, hour = "00", minute = "00", second = "00", zone] = match;
  if (zone) {
    const offset = zone === "Z" ? "Z" : zone.includes(":") ? zone : `${zone.slice(0, 3)}:${zone.slice(3)}`;
    return Date.parse(`${year}-${month}-${day}T${hour}:${minute}:${second}${offset}`);
  }
  const wallClockAsUtc = Date.UTC(+year, +month - 1, +day, +hour, +minute, +second);
  let epoch = wallClockAsUtc - montrealOffsetMinutes(wallClockAsUtc) * 60_000;
  // Ajustement autour des changements d’heure.
  epoch = wallClockAsUtc - montrealOffsetMinutes(epoch) * 60_000;
  return epoch;
}

export interface ResolvedWindow {
  start: number | null;
  end: number | null;
}

export function resolveWindow(schedule: Schedule, label: string): ResolvedWindow {
  return {
    start: schedule.startsAt ? toEpochMs(schedule.startsAt, `${label} (startsAt)`) : null,
    end: schedule.endsAt ? toEpochMs(schedule.endsAt, `${label} (endsAt)`) : null,
  };
}

/** Vrai si l’élément est déjà expiré à l’instant donné (inutile de l’envoyer au navigateur). */
export function hasEnded(window: ResolvedWindow, now: number): boolean {
  return window.end !== null && now >= window.end;
}

/** JSON sûr dans un <script> en ligne (neutralise « </script> » et « <!-- »). */
function inlineJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export interface ScheduledElement {
  /** Valeur de l’attribut data-sched de l’élément (lettres, chiffres, tirets). */
  id: string;
  window: ResolvedWindow;
}

/**
 * Script exécuté avant le premier affichage (sans décalage de mise en page) :
 * - bandeau : `data-banner="hidden"` hors période, `data-banner="collapsed"` s’il a été replié ;
 * - éléments datés (liens, pastilles, lien vedette) : masqués hors de leur période d’affichage.
 */
export function prepaintScript(banner: AlertBannerConfig | null, elements: ScheduledElement[]): string {
  const bannerData = banner
    ? { ...resolveWindow(banner, "alertBanner"), key: BANNER_STORAGE_PREFIX + banner.id }
    : null;
  const items = elements.map((element) => [element.id, element.window.start, element.window.end]);
  return (
    `(function(){var d=document.documentElement,n=Date.now(),b=${inlineJson(bannerData)},l=${inlineJson(items)},h=[];` +
    `function o(s,e){return(s!==null&&n<s)||(e!==null&&n>=e)}` +
    `if(b){if(o(b.start,b.end))d.setAttribute("data-banner","hidden");else try{if(localStorage.getItem(b.key)==="1")d.setAttribute("data-banner","collapsed")}catch(_){}}` +
    `for(var i=0;i<l.length;i++)if(o(l[i][1],l[i][2]))h.push('[data-sched="'+l[i][0]+'"]');` +
    `if(h.length){var t=document.createElement("style");t.textContent=h.join(",")+"{display:none!important}";document.head.appendChild(t)}})();`
  );
}
