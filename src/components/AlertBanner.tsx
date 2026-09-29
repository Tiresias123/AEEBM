"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { AlertBannerConfig } from "@/config/types";
import { BANNER_STORAGE_PREFIX } from "@/lib/banner";
import { cn, isExternalHref, linkProps } from "@/lib/utils";

const toneClass: Record<AlertBannerConfig["tone"], string> = {
  info: "tone-info",
  important: "tone-important",
  urgent: "tone-deadline",
};

/** Bandeau d’information prioritaire, rétractable et mémorisé par identifiant d’annonce. */
export function AlertBanner({ banner }: { banner: AlertBannerConfig }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (document.documentElement.hasAttribute("data-banner-hidden")) setOpen(false);
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(BANNER_STORAGE_PREFIX + banner.id, "1");
    } catch {
      // Stockage indisponible (navigation privée) : fermeture pour cette visite seulement.
    }
  }

  if (!banner.enabled) return null;
  const external = banner.link ? isExternalHref(banner.link.href) : false;

  return (
    <AnimatePresence>
      {open ? (
        <m.aside
          key={banner.id}
          data-alert-banner=""
          aria-label="Annonce"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] } }}
          exit={{ opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }}
          className={cn(toneClass[banner.tone], "relative mb-5 overflow-hidden")}
        >
          <div className="relative flex items-start gap-3 rounded-2xl glass py-2.5 pr-2 pl-3">
            <span
              aria-hidden="true"
              className="absolute inset-y-2 left-0 w-[3px] rounded-full"
              style={{ background: "var(--tone)", boxShadow: "0 0 12px var(--tone)" }}
            />
            <span className="tone-badge mt-[0.1rem] inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-[0.3rem] text-[0.62rem] leading-none font-bold tracking-[0.1em] uppercase">
              <span aria-hidden="true" className="size-1.5 animate-pulse-soft rounded-full bg-current" />
              {banner.label}
            </span>
            <p className="min-w-0 flex-1 text-[0.8rem] leading-snug text-soft">
              {banner.message}
              {banner.link ? (
                <>
                  {" "}
                  <a
                    {...linkProps(banner.link.href)}
                    className="group inline-flex items-center gap-0.5 font-semibold whitespace-nowrap text-ink underline decoration-white/25 underline-offset-[3px] transition-colors hover:decoration-white/70"
                  >
                    {banner.link.label}
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
              type="button"
              onClick={dismiss}
              aria-label="Masquer l’annonce"
              className="-my-0.5 grid size-7 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-ink"
            >
              <X aria-hidden="true" className="size-3.5" />
            </button>
          </div>
        </m.aside>
      ) : null}
    </AnimatePresence>
  );
}
