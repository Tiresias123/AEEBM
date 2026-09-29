"use client";

import { clsx } from "clsx";
import { m } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { SPRING, TAP_SCALE } from "@/components/motion";
import { PendingLabel } from "@/components/PendingLabel";
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

/** Lien phare : grand format sur dégradé satiné, ombre douce accordée au dégradé. */
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
  // Un lien vedette pas encore disponible n’affiche pas sa pastille (« Nouveau » contredirait « Bientôt »).
  const shownBadge = pending ? undefined : badge;
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
    <span
      className={clsx(
        "relative flex items-center gap-3.5 overflow-hidden rounded-[1.4rem] bg-accent-gradient py-4 pr-[calc(0.875rem+1px)] pl-[calc(0.75rem+1px)] text-on-accent inset-ring inset-ring-white/10 transition-shadow duration-500 forced-colors:border",
        "shadow-[inset_0_1px_0_0_rgb(255_255_255/0.18),0_16px_36px_-22px_var(--spot-from,var(--accent-from))]",
        !pending &&
          "group-hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.18),0_20px_44px_-20px_var(--spot-from,var(--accent-from))]",
      )}
    >
      <span className="relative grid size-11 shrink-0 place-items-center rounded-xl bg-white/[0.12]">{icon}</span>

      <span className="relative flex min-w-0 flex-1 flex-col text-left">
        <span className="text-[1.02rem] leading-tight font-semibold tracking-[-0.01em] text-pretty">{title}</span>
        {shownBadge ? (
          <span className="order-first mb-1.5 inline-flex w-fit items-center gap-1 rounded-full bg-black/20 px-2 py-[0.2rem] text-[0.6875rem] leading-none font-semibold tracking-[0.04em] uppercase ring-1 ring-white/25">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
            <span className="sr-only">(</span>
            {shownBadge}
            <span className="sr-only">)</span>
          </span>
        ) : null}
        <span className="mt-1 text-[0.8rem] leading-snug text-pretty text-on-accent/90">
          <span className="sr-only"> — </span>
          {subtitle}
        </span>
      </span>

      {pending ? (
        <PendingLabel onAccent />
      ) : (
        <ChevronRight
          aria-hidden="true"
          className="relative size-5 shrink-0 opacity-90 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
        />
      )}
      {external ? <span className="sr-only"> (nouvel onglet)</span> : null}
    </span>
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
      whileHover={{ y: -1 }}
      whileTap={{ scale: TAP_SCALE }}
      transition={SPRING}
      style={style}
      className="enter group relative isolate block rounded-[1.4rem]"
    >
      {card}
    </m.a>
  );
}
