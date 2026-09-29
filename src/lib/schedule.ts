import type { AlertBannerConfig, Schedule } from "@/config/types";

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
  const [y, mo, d, h, mi, s] = [year, month, day, hour, minute, second].map(Number);
  const invalid = () =>
    new Error(
      `${label} : date inexistante « ${value} » (mois 01-12, jour valide pour le mois, heure 00-23, minutes 00-59)`,
    );
  if (mo < 1 || mo > 12 || d < 1 || d > new Date(Date.UTC(y, mo, 0)).getUTCDate() || h > 23 || mi > 59 || s > 59) {
    throw invalid();
  }
  if (zone) {
    const offset = zone === "Z" ? "Z" : zone.includes(":") ? zone : `${zone.slice(0, 3)}:${zone.slice(3)}`;
    const epoch = Date.parse(`${year}-${month}-${day}T${hour}:${minute}:${second}${offset}`);
    if (Number.isNaN(epoch)) throw invalid();
    return epoch;
  }
  const wallClockAsUtc = Date.UTC(y, mo - 1, d, h, mi, s);
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
  /** Valeur de l’attribut data-sched de l’élément (identifiant opaque généré au build). */
  id: string;
  window: ResolvedWindow;
}

/** Groupe masqué quand tous ses membres le sont (p. ex. une section dont tous les liens sont datés). */
export interface ScheduledGroup {
  id: string;
  members: string[];
}

/**
 * Script exécuté avant le premier affichage (sans décalage de mise en page) :
 * - bandeau : `data-banner="hidden"` hors de sa période d’affichage ;
 * - éléments datés (liens, pastilles, lien vedette) : masqués hors de leur période d’affichage ;
 * - groupes (sections) : masqués quand tous leurs éléments datés le sont.
 */
export function prepaintScript(
  banner: AlertBannerConfig | null,
  elements: ScheduledElement[],
  groups: ScheduledGroup[] = [],
): string {
  const bannerData = banner ? resolveWindow(banner, "alertBanner") : null;
  const items = elements.map((element) => [element.id, element.window.start, element.window.end]);
  const sets = groups.map((group) => [group.id, group.members]);
  return (
    `(function(){var d=document.documentElement,n=Date.now(),b=${inlineJson(bannerData)},l=${inlineJson(items)},g=${inlineJson(sets)},h=[],x={};` +
    `function o(s,e){return(s!==null&&n<s)||(e!==null&&n>=e)}` +
    `if(b&&o(b.start,b.end))d.setAttribute("data-banner","hidden");` +
    `for(var i=0;i<l.length;i++)if(o(l[i][1],l[i][2])){x[l[i][0]]=1;h.push('[data-sched="'+l[i][0]+'"]')}` +
    `for(var j=0;j<g.length;j++){var a=g[j][1],k=0;while(k<a.length&&x[a[k]])k++;if(k===a.length)h.push('[data-sched="'+g[j][0]+'"]')}` +
    `if(h.length){var t=document.createElement("style");t.textContent=h.join(",")+"{display:none!important}";document.head.appendChild(t)}})();`
  );
}
