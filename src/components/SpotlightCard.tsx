"use client";

import { m } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { CSSProperties } from "react";
import { fadeUp, SPRING, TAP_SCALE } from "@/components/motion";
import type { SpotlightConfig } from "@/config/types";
import { getIcon } from "@/lib/icons";
import { isExternalHref, linkProps } from "@/lib/utils";

/** Lien phare : grand format, dégradé satiné, reflet animé et halo coloré. */
export function SpotlightCard({ spotlight }: { spotlight: SpotlightConfig }) {
  const Icon = getIcon(spotlight.icon);
  const external = isExternalHref(spotlight.href);
  const gradientVars = spotlight.gradient
    ? ({
        "--spot-from": spotlight.gradient.from,
        "--spot-via": spotlight.gradient.via ?? spotlight.gradient.from,
        "--spot-to": spotlight.gradient.to,
      } as CSSProperties)
    : undefined;

  return (
    <m.a
      {...linkProps(spotlight.href)}
      variants={fadeUp}
      whileHover={{ y: -2 }}
      whileTap={{ scale: TAP_SCALE }}
      transition={SPRING}
      style={gradientVars}
      className="group relative isolate block rounded-[1.4rem]"
    >
      {/* Halo extérieur accordé au dégradé */}
      <span
        aria-hidden="true"
        className="absolute inset-x-2 top-2 -bottom-2 -z-10 rounded-[1.6rem] bg-accent-gradient opacity-55 blur-2xl transition-opacity duration-500 group-hover:opacity-80"
      />

      <span className="relative flex items-center gap-4 overflow-hidden rounded-[1.4rem] bg-accent-gradient px-4 py-[1.05rem] text-on-accent shadow-[inset_0_1px_0_0_rgb(255_255_255/0.35),inset_0_-1px_0_0_rgb(0_0_0/0.15)] ring-1 ring-white/20">
        {/* Brillance supérieure */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.14] to-transparent"
        />
        {/* Reflet satiné animé */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-2/5 animate-sheen bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />

        <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-white/[0.18] shadow-[inset_0_1px_0_0_rgb(255_255_255/0.35)] ring-1 ring-white/25">
          <Icon aria-hidden="true" className="size-6" strokeWidth={1.9} />
        </span>

        <span className="relative min-w-0 flex-1 text-left">
          {spotlight.badge ? (
            <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-[0.2rem] text-[0.625rem] leading-none font-semibold tracking-[0.06em] uppercase ring-1 ring-white/25">
              <span aria-hidden="true" className="size-1.5 animate-pulse-soft rounded-full bg-current" />
              {spotlight.badge}
            </span>
          ) : null}
          <span className="block text-[1.02rem] leading-tight font-semibold tracking-[-0.01em] text-pretty">
            {spotlight.title}
          </span>
          <span className="mt-1 block text-[0.8rem] leading-snug text-on-accent/80">{spotlight.subtitle}</span>
        </span>

        <ChevronRight
          aria-hidden="true"
          className="relative size-5 shrink-0 opacity-90 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
        />
        {external ? <span className="sr-only"> (nouvel onglet)</span> : null}
      </span>
    </m.a>
  );
}
