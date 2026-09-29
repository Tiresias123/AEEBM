"use client";

import { clsx } from "clsx";
import { m } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { PointerEvent, ReactNode } from "react";
import { LinkBadge } from "@/components/LinkBadge";
import { SPRING, TAP_SCALE } from "@/components/motion";
import type { BadgeTone, LinkCategory } from "@/config/types";
import { enterStyle } from "@/lib/enter";
import { isExternalHref, linkProps } from "@/lib/links";

export interface LinkCardProps {
  title: string;
  subtitle: string;
  href: string;
  category: LinkCategory;
  /** Icône rendue côté serveur. */
  icon: ReactNode;
  badge?: { label: string; tone: BadgeTone; schedId?: string };
  /** Adresse pas encore disponible : carte non cliquable « Bientôt disponible ». */
  pending?: boolean;
  /** Rang dans l’entrée en cascade. */
  enterIndex: number;
}

/** Suit le pointeur pour positionner le reflet lumineux (sans re-rendu React). */
function trackPointer(event: PointerEvent<HTMLAnchorElement>) {
  if (event.pointerType !== "mouse") return;
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  target.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  target.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

/** Mention discrète d’un lien pas encore disponible (à la place du chevron). */
function PendingLabel() {
  return (
    <span className="relative shrink-0 rounded-full px-2 py-1 text-[0.6rem] leading-none font-semibold tracking-[0.1em] text-muted uppercase ring-1 ring-white/10">
      Bientôt<span className="sr-only"> disponible</span>
    </span>
  );
}

const CARD =
  "glass relative flex items-center gap-3.5 overflow-hidden rounded-[1.25rem] py-3 pr-3.5 pl-3 forced-colors:border";

/** Carte de lien standard : squircle d’icône, titre et sous-titre hiérarchisés, chevron animé. */
export function LinkCard({ title, subtitle, href, category, icon, badge, pending = false, enterIndex }: LinkCardProps) {
  const external = isExternalHref(href);
  const shownBadge = badge;

  const body = (
    <>
      <span
        className={clsx(`cat-${category}`, "relative grid size-12 shrink-0 place-items-center rounded-2xl squircle")}
      >
        {icon}
      </span>

      <span className="relative flex min-w-0 flex-1 flex-col">
        <span className="text-[0.95rem] leading-tight font-semibold tracking-[-0.01em] text-pretty text-ink">
          {title}
        </span>
        {shownBadge ? (
          <LinkBadge
            label={shownBadge.label}
            tone={shownBadge.tone}
            schedId={badge?.schedId}
            className="order-first mb-1.5"
          />
        ) : null}
        <span className="mt-1 text-xs leading-snug text-balance text-muted">
          <span className="sr-only"> — </span>
          {subtitle}
        </span>
      </span>
    </>
  );

  if (pending) {
    return (
      <div className={clsx(CARD, "enter cursor-default")} style={enterStyle(enterIndex)}>
        <span className="contents [&>*]:opacity-80">{body}</span>
        <PendingLabel />
      </div>
    );
  }

  return (
    <m.a
      {...linkProps(href)}
      whileTap={{ scale: TAP_SCALE }}
      transition={SPRING}
      onPointerMove={trackPointer}
      style={enterStyle(enterIndex)}
      className={clsx(
        CARD,
        "enter group transition-[background-color,border-color] duration-300 hover:border-white/25 hover:bg-white/[0.07] focus-visible:border-white/25",
      )}
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
      {body}
      <ChevronRight
        aria-hidden="true"
        className="relative size-[1.15rem] shrink-0 text-muted transition-[translate,color] duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:text-ink"
      />
      {external ? <span className="sr-only"> (nouvel onglet)</span> : null}
    </m.a>
  );
}
