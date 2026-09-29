"use client";

import { clsx } from "clsx";
import { m } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { SPRING, TAP_SCALE } from "@/components/motion";
import { enterStyle } from "@/lib/enter";
import { isExternalHref, linkProps } from "@/lib/links";

export interface SpotlightCardProps {
  title: string;
  subtitle: string;
  href: string;
  /** Icône rendue côté serveur. */
  icon: ReactNode;
  badge?: string;
  gradient?: { from: string; via?: string; to: string };
  pending?: boolean;
  enterIndex: number;
  /** Identifiant de période d’affichage. */
  schedId?: string;
}

/** Lien phare : grand format, dégradé satiné, reflet animé et halo coloré accordé au dégradé. */
export function SpotlightCard({
  title,
  subtitle,
  href,
  icon,
  badge,
  gradient,
  pending = false,
  enterIndex,
  schedId,
}: SpotlightCardProps) {
  const external = isExternalHref(href);
  const shownBadge = badge;
  const style = {
    ...enterStyle(enterIndex),
    ...(gradient
      ? {
          "--spot-from": gradient.from,
          "--spot-via": gradient.via ?? gradient.from,
          "--spot-to": gradient.to,
        }
      : {}),
  } as CSSProperties;

  const card = (
    <>
      {/* Halo extérieur accordé au dégradé */}
      <span
        aria-hidden="true"
        className={clsx(
          "absolute -inset-x-1 top-4 -bottom-5 -z-10 rounded-[1.6rem] bg-accent-gradient blur-[30px] transition-opacity duration-500",
          pending ? "opacity-40" : "opacity-70 group-hover:opacity-90",
        )}
      />

      <span className="relative flex items-center gap-3.5 overflow-hidden rounded-[1.4rem] bg-accent-gradient py-[1.05rem] pr-[calc(0.875rem+1px)] pl-[calc(0.75rem+1px)] text-on-accent shadow-[inset_0_1px_0_0_rgb(255_255_255/0.35),inset_0_-1px_0_0_rgb(0_0_0/0.15),0_20px_50px_-18px_var(--spot-from,var(--accent-from)),0_12px_40px_-20px_var(--spot-to,var(--accent-to))] ring-1 ring-white/10 forced-colors:border">
        {/* Brillance supérieure */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.12] to-transparent"
        />
        {/* Reflet satiné (deux passages à l’arrivée) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-2/5 animate-sheen bg-gradient-to-r from-transparent via-white/15 to-transparent motion-reduce:hidden"
        />

        <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-white/[0.16] shadow-[inset_0_1px_0_0_rgb(255_255_255/0.35)] ring-1 ring-white/25">
          {icon}
        </span>

        <span className="relative flex min-w-0 flex-1 flex-col text-left">
          <span className="text-[1.02rem] leading-tight font-semibold tracking-[-0.01em] text-pretty">{title}</span>
          {shownBadge ? (
            <span className="order-first mb-1.5 inline-flex w-fit items-center gap-1 rounded-full bg-black/20 px-2 py-[0.2rem] text-[0.625rem] leading-none font-semibold tracking-[0.06em] uppercase ring-1 ring-white/30">
              <span aria-hidden="true" className="size-1.5 animate-pulse-soft rounded-full bg-current" />
              <span className="sr-only">(</span>
              {shownBadge}
              <span className="sr-only">)</span>
            </span>
          ) : null}
          <span className="mt-1 text-[0.8rem] leading-snug text-balance text-on-accent/90">
            <span className="sr-only"> — </span>
            {subtitle}
          </span>
        </span>

        {pending ? (
          <span className="relative shrink-0 rounded-full bg-black/20 px-2 py-1 text-[0.6rem] leading-none font-semibold tracking-[0.1em] uppercase ring-1 ring-white/30">
            Bientôt<span className="sr-only"> disponible</span>
          </span>
        ) : (
          <ChevronRight
            aria-hidden="true"
            className="relative size-5 shrink-0 opacity-90 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
          />
        )}
        {external ? <span className="sr-only"> (nouvel onglet)</span> : null}
      </span>
    </>
  );

  if (pending) {
    return (
      <div data-sched={schedId} style={style} className="enter relative isolate block cursor-default rounded-[1.4rem]">
        {card}
      </div>
    );
  }

  return (
    <m.a
      {...linkProps(href)}
      data-sched={schedId}
      whileHover={{ y: -2 }}
      whileTap={{ scale: TAP_SCALE }}
      transition={SPRING}
      style={style}
      className="enter group relative isolate block rounded-[1.4rem]"
    >
      {card}
    </m.a>
  );
}
