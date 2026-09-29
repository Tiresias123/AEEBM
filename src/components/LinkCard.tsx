"use client";

import { m } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { PointerEvent } from "react";
import { LinkBadge } from "@/components/LinkBadge";
import { fadeUp, SPRING, TAP_SCALE } from "@/components/motion";
import type { LinkItem } from "@/config/types";
import { getIcon } from "@/lib/icons";
import { isExternalHref, linkProps } from "@/lib/utils";

/** Suit le pointeur pour positionner le reflet lumineux (sans re-rendu React). */
function trackPointer(event: PointerEvent<HTMLAnchorElement>) {
  if (event.pointerType !== "mouse") return;
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  target.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  target.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

/** Carte de lien standard : squircle d’icône, titre et sous-titre hiérarchisés, chevron animé. */
export function LinkCard({ link }: { link: LinkItem }) {
  const Icon = getIcon(link.icon);
  const external = isExternalHref(link.href);

  return (
    <m.a
      {...linkProps(link.href)}
      variants={fadeUp}
      whileTap={{ scale: TAP_SCALE }}
      transition={SPRING}
      onPointerMove={trackPointer}
      className="group relative flex items-center gap-3.5 overflow-hidden rounded-[1.25rem] glass py-3 pr-3.5 pl-3 transition-[background-color,border-color,box-shadow] duration-300 hover:border-white/25 hover:bg-white/[0.07] focus-visible:border-white/25"
    >
      {/* Reflet qui suit la souris */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgb(255 255 255 / 0.07), transparent 65%)",
        }}
      />

      <span className={`cat-${link.category} relative grid size-12 shrink-0 place-items-center rounded-2xl squircle`}>
        <Icon
          aria-hidden="true"
          className="size-[1.35rem] text-white drop-shadow-[0_1px_1px_rgb(0_0_0/0.25)]"
          strokeWidth={1.9}
        />
      </span>

      <span className="relative min-w-0 flex-1">
        {link.badge ? <LinkBadge badge={link.badge} className="mb-1.5" /> : null}
        <span className="block text-[0.95rem] leading-tight font-semibold tracking-[-0.01em] text-pretty text-ink">
          {link.title}
        </span>
        <span className="mt-1 block text-xs leading-snug text-muted">{link.subtitle}</span>
      </span>

      <ChevronRight
        aria-hidden="true"
        className="relative size-[1.15rem] shrink-0 text-muted transition-[translate,color] duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:text-ink"
      />
      {external ? <span className="sr-only"> (nouvel onglet)</span> : null}
    </m.a>
  );
}
