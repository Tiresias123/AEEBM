import { ArrowRight } from "lucide-react";
import type { AlertTone } from "@/config/types";
import { enterStyle } from "@/lib/enter";
import { isExternalHref, linkProps } from "@/lib/links";

const toneClass: Record<AlertTone, string> = {
  info: "tone-info",
  important: "tone-important",
  urgent: "tone-deadline",
};

export interface AlertBannerProps {
  tone: AlertTone;
  label: string;
  message: string;
  /** Vignette de date (jour, mois abrégé) : l’étiquette passe alors au-dessus du message. */
  date?: { day: string; month: string };
  /** Lien facultatif (omis tant que l’adresse est provisoire). */
  link?: { label: string; href: string };
}

/**
 * Bandeau du prochain événement de l’Association, toujours affiché (hors de sa période : masqué avant
 * le premier affichage par le script de src/lib/schedule.ts). Rendu serveur, sans JavaScript.
 */
export function AlertBanner({ tone, label, message, date, link }: AlertBannerProps) {
  const text = (
    <>
      {message}
      {link ? (
        <>
          {" "}
          <a
            {...linkProps(link.href)}
            className="group inline-flex items-center gap-0.5 rounded font-semibold text-ink underline decoration-line-strong underline-offset-[3px] transition-colors hover:decoration-current"
          >
            {link.label}
            <ArrowRight
              aria-hidden="true"
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            />
            {isExternalHref(link.href) ? <span className="sr-only"> (nouvel onglet)</span> : null}
          </a>
        </>
      ) : null}
    </>
  );

  return (
    <aside
      data-alert-banner=""
      aria-label="Prochain événement"
      style={enterStyle(0)}
      className={`${toneClass[tone]} enter mb-5`}
    >
      {date ? (
        // Vignette de date, puis l’étiquette au-dessus du message.
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3.5 rounded-2xl glass p-2 pr-4">
          <span
            aria-hidden="true"
            className="flex w-[3.25rem] flex-col items-center justify-center self-stretch rounded-xl bg-accent-gradient px-1 py-2 text-on-accent shadow-[inset_0_1px_0_0_rgb(255_255_255/0.2)] forced-colors:border"
          >
            <span className="font-display-name text-[length:calc(1.4rem*var(--display-scale))] leading-none [font-variant-numeric:lining-nums]">
              {date.day}
            </span>
            <span className="mt-1 text-[0.6rem] leading-none font-semibold tracking-[0.14em] uppercase">
              {date.month}
            </span>
          </span>
          <div className="min-w-0 py-0.5">
            <p className="flex items-center gap-1.5 text-[0.6875rem] leading-none font-bold tracking-[0.12em] text-[var(--tone)] uppercase">
              <span aria-hidden="true" className="tone-dot size-1.5 shrink-0 rounded-full" />
              <span className="min-w-0 [overflow-wrap:anywhere]">{label}</span>
            </p>
            <p className="mt-1.5 text-[0.8rem] leading-snug text-balance [overflow-wrap:break-word] text-soft">
              {text}
            </p>
          </div>
        </div>
      ) : (
        // Étiquette et message sur une rangée ; sous 17 rem (texte agrandi), l’étiquette passe au-dessus.
        <div className="@container">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 rounded-2xl glass py-2.5 pr-4 pl-3 @max-[17rem]:grid-cols-1">
            <span className="tone-badge inline-flex max-w-full min-w-0 items-center justify-center gap-1.5 justify-self-start rounded-full px-2 py-[0.3rem] text-[0.6875rem] leading-none font-bold tracking-[0.06em] [overflow-wrap:anywhere] uppercase">
              <span aria-hidden="true" className="tone-dot size-1.5 shrink-0 rounded-full" />
              <span className="min-w-0">{label}</span>
            </span>
            <p className="min-w-0 text-[0.8rem] leading-snug text-balance [overflow-wrap:break-word] text-soft">
              {text}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
