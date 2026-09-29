"use client";

import { clsx } from "clsx";
import { AnimatePresence, m } from "framer-motion";
import { ArrowRight, ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { EASE_OUT_EXPO, SPRING } from "@/components/motion";
import type { AlertTone } from "@/config/types";
import { BANNER_STORAGE_PREFIX } from "@/lib/schedule";
import { isExternalHref, linkProps } from "@/lib/links";

/*
 * État du bandeau (« open », « collapsed », « hidden ») : attribut data-banner de <html>, fixé avant
 * le premier affichage par le script de src/lib/schedule.ts, puis partagé entre le bandeau et sa pastille.
 */
type BannerState = "open" | "collapsed" | "hidden";
const EVENT = "aeebm:bandeau";

function readState(): BannerState {
  const value = document.documentElement.getAttribute("data-banner");
  return value === "collapsed" || value === "hidden" ? value : "open";
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

function useBannerState(): BannerState {
  return useSyncExternalStore(subscribe, readState, () => "open");
}

function setBannerState(id: string, state: "open" | "collapsed") {
  const root = document.documentElement;
  // Changement fait par la personne : la règle CSS de préaffichage cesse de s’appliquer et l’animation se joue.
  root.setAttribute("data-banner-live", "");
  if (state === "collapsed") root.setAttribute("data-banner", "collapsed");
  else root.removeAttribute("data-banner");
  try {
    if (state === "collapsed") localStorage.setItem(BANNER_STORAGE_PREFIX + id, "1");
    else localStorage.removeItem(BANNER_STORAGE_PREFIX + id);
  } catch {
    // Stockage indisponible (navigation privée) : état conservé pour cette visite seulement.
  }
  window.dispatchEvent(new Event(EVENT));
}

const toneClass: Record<AlertTone, string> = {
  info: "tone-info",
  important: "tone-important",
  urgent: "tone-deadline",
};

export interface AlertBannerProps {
  id: string;
  tone: AlertTone;
  label: string;
  message: string;
  /** Lien facultatif (omis tant que l’adresse est provisoire). */
  link?: { label: string; href: string };
}

/** Bandeau d’information prioritaire, repliable en pastille et mémorisé par identifiant d’annonce. */
export function AlertBanner({ id, tone, label, message, link }: AlertBannerProps) {
  const state = useBannerState();
  const external = link ? isExternalHref(link.href) : false;
  const panelId = `annonce-${id}`;
  const collapseRef = useRef<HTMLButtonElement>(null);
  const reopened = useRef(false);

  useEffect(() => {
    if (state === "open" && reopened.current) {
      reopened.current = false;
      collapseRef.current?.focus({ preventScroll: true });
    }
  }, [state]);

  useEffect(() => {
    const onReopen = () => {
      reopened.current = true;
    };
    window.addEventListener(`${EVENT}:reopen`, onReopen);
    return () => window.removeEventListener(`${EVENT}:reopen`, onReopen);
  }, []);

  return (
    <AnimatePresence initial={false}>
      {state === "open" ? (
        <m.aside
          key="banner"
          id={panelId}
          data-alert-banner=""
          aria-label="Annonce"
          exit={{ opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }}
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{
            opacity: 1,
            height: "auto",
            marginBottom: 20,
            transition: { duration: 0.45, ease: EASE_OUT_EXPO },
          }}
          className={clsx(toneClass[tone], "enter @container relative mb-5 overflow-hidden rounded-2xl")}
        >
          {/* Une rangée ; sous 17 rem (texte agrandi), l’étiquette et × passent au-dessus du message. */}
          <div className="relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 rounded-2xl glass py-2.5 pr-2 pl-3 @max-[17rem]:grid-cols-[minmax(0,1fr)_auto]">
            <span className="tone-badge inline-flex max-w-full min-w-0 items-center justify-center gap-1.5 justify-self-start rounded-full px-2 py-[0.3rem] text-[0.6875rem] leading-none font-bold tracking-[0.06em] [overflow-wrap:anywhere] uppercase">
              <span aria-hidden="true" className="tone-dot size-1.5 shrink-0 rounded-full" />
              <span className="min-w-0">{label}</span>
            </span>
            <p className="min-w-0 text-[0.8rem] leading-snug text-balance [overflow-wrap:break-word] text-soft @max-[17rem]:col-span-full @max-[17rem]:row-start-2">
              {message}
              {link ? (
                <>
                  {" "}
                  <a
                    {...linkProps(link.href)}
                    className="group inline-flex items-center gap-0.5 rounded font-semibold text-ink underline decoration-white/25 underline-offset-[3px] transition-colors hover:decoration-white/70"
                  >
                    {link.label}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                    {external ? <span className="sr-only"> (nouvel onglet)</span> : null}
                  </a>
                </>
              ) : null}
            </p>
            <button
              ref={collapseRef}
              type="button"
              onClick={() => {
                window.dispatchEvent(new Event(`${EVENT}:collapse`));
                setBannerState(id, "collapsed");
              }}
              aria-label="Replier l’annonce"
              aria-controls={panelId}
              aria-expanded="true"
              className="relative grid size-7 place-items-center rounded-full text-muted transition-colors after:absolute after:-inset-2 after:rounded-full after:content-[''] hover:bg-white/10 hover:text-ink @max-[17rem]:col-start-2 @max-[17rem]:row-start-1"
            >
              <X aria-hidden="true" className="size-3.5" />
            </button>
          </div>
        </m.aside>
      ) : null}
    </AnimatePresence>
  );
}

/** Pastille affichée quand l’annonce est repliée : un clic la rouvre (placée en haut à gauche de l’en-tête). */
export function AlertBannerPill({ id, tone, label }: Pick<AlertBannerProps, "id" | "tone" | "label">) {
  const state = useBannerState();
  const pillRef = useRef<HTMLButtonElement>(null);
  const collapsedByUser = useRef(false);

  useEffect(() => {
    const onCollapse = () => {
      collapsedByUser.current = true;
    };
    window.addEventListener(`${EVENT}:collapse`, onCollapse);
    return () => window.removeEventListener(`${EVENT}:collapse`, onCollapse);
  }, []);

  useEffect(() => {
    // Après un repli par la personne, le focus passe sur la pastille (il ne retombe pas sur <body>).
    if (state === "collapsed" && collapsedByUser.current) {
      collapsedByUser.current = false;
      pillRef.current?.focus({ preventScroll: true });
    }
  }, [state]);

  return (
    <AnimatePresence>
      {state === "collapsed" ? (
        <m.button
          ref={pillRef}
          key="pill"
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileTap={{ scale: 0.94 }}
          transition={SPRING}
          onClick={() => {
            window.dispatchEvent(new Event(`${EVENT}:reopen`));
            setBannerState(id, "open");
          }}
          aria-label={`Afficher l’annonce\u00A0: ${label}`}
          aria-controls={`annonce-${id}`}
          aria-expanded="false"
          className={clsx(
            toneClass[tone],
            "inline-flex h-11 max-w-full items-center gap-1.5 rounded-full glass pr-3 pl-3.5 text-[0.6875rem] font-bold tracking-[0.06em] text-[var(--tone)] uppercase forced-colors:border",
          )}
        >
          <span aria-hidden="true" className="tone-dot size-1.5 shrink-0 rounded-full" />
          <span className="min-w-0 truncate">{label}</span>
          <ChevronDown aria-hidden="true" className="size-3.5 shrink-0 opacity-80" />
        </m.button>
      ) : null}
    </AnimatePresence>
  );
}
