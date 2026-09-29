"use client";

import { clsx } from "clsx";
import { m } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { LinkBadge } from "@/components/LinkBadge";
import { SPRING, TAP_SCALE } from "@/components/motion";
import { PendingLabel } from "@/components/PendingLabel";
import type { BadgeTone, LinkCategory } from "@/config/types";
import { enterStyle } from "@/lib/enter";
import { isExternalHref, linkProps } from "@/lib/links";

export interface LinkCardProps {
  title: string;
  subtitle: string;
  href: string;
  category: LinkCategory;
  /** Icône rendue côté serveur (hérite de la couleur de sa tuile). */
  icon: ReactNode;
  badge?: { label: string; tone: BadgeTone; schedId?: string };
  /** Adresse pas encore disponible : carte non cliquable « Bientôt ». */
  pending?: boolean;
  /** Rang dans l’entrée en cascade. */
  enterIndex: number;
}

const CARD =
  "glass relative flex items-center gap-3.5 overflow-hidden rounded-[1.25rem] py-3 pr-3.5 pl-3 forced-colors:border";

/** Carte de lien standard : tuile d’icône, titre et sous-titre hiérarchisés, chevron animé. */
export function LinkCard({ title, subtitle, href, category, icon, badge, pending = false, enterIndex }: LinkCardProps) {
  const external = isExternalHref(href);
  // « Nouveau » contredirait « Bientôt » ; une pastille informative ou datée (« AGA · 30 sept. ») reste.
  const shownBadge = pending && badge?.tone === "new" ? undefined : badge;

  const body = (
    <>
      <span
        className={clsx(
          `cat-${category}`,
          "relative grid size-10 shrink-0 place-items-center rounded-xl icon-tile",
          pending && "opacity-60",
        )}
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
            schedId={shownBadge.schedId}
            className="order-first mb-1.5"
          />
        ) : null}
        <span className="mt-1 text-xs leading-snug text-pretty text-muted">
          <span className="sr-only"> — </span>
          {subtitle}
        </span>
      </span>
    </>
  );

  if (pending) {
    return (
      <div className={clsx(CARD, "enter cursor-default")} style={enterStyle(enterIndex)}>
        {body}
        <PendingLabel />
      </div>
    );
  }

  return (
    <m.a
      {...linkProps(href)}
      whileTap={{ scale: TAP_SCALE }}
      transition={SPRING}
      style={enterStyle(enterIndex)}
      className={clsx(
        CARD,
        "enter group transition-[background-color,border-color] duration-500 ease-[var(--ease-out-expo)] hover:border-line-strong hover:bg-fill-hover focus-visible:border-line-strong",
      )}
    >
      {body}
      <ChevronRight
        aria-hidden="true"
        className="relative size-[1.1rem] shrink-0 text-muted transition-[translate,color] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:text-ink forced-colors:text-inherit!"
      />
      {external ? <span className="sr-only"> (nouvel onglet)</span> : null}
    </m.a>
  );
}
