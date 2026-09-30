"use client";

import { clsx } from "clsx";
import { m } from "framer-motion";
import { ArrowUpRight, ChevronRight, Clock3 } from "lucide-react";
import type { ReactNode } from "react";
import { LinkBadge } from "@/components/LinkBadge";
import { SPRING, TAP_SCALE } from "@/components/motion";
import { PendingLabel } from "@/components/PendingLabel";
import type { BadgeTone, LinkCategory } from "@/config/types";
import { enterStyle } from "@/lib/enter";
import { isExternalHref, linkProps } from "@/lib/links";

/**
 * Variantes de carte :
 * - "row"       : carte en liste (tuile d’icône, titre, sous-titre, chevron) ;
 * - "feature"   : grande carte (titre en Cormorant, icône en filigrane) ;
 * - "tile"      : tuile verticale (demi-largeur) ;
 * - "compact"   : tuile compacte centrée (icône et titre ; sous-titre pour les lecteurs d’écran) ;
 * - "highlight" : carte mise en avant, soulignée de bordeaux ;
 * - "grouped"   : rangée à l’intérieur d’un bloc commun (sans fond propre).
 */
export type LinkCardVariant = "row" | "feature" | "tile" | "compact" | "highlight" | "grouped";

export interface LinkCardProps {
  title: string;
  subtitle: string;
  href: string;
  category: LinkCategory;
  /** Icône rendue côté serveur (hérite de la couleur de sa tuile). */
  icon: ReactNode;
  /** Icône en filigrane (variante « feature »). */
  watermark?: ReactNode;
  badge?: { label: string; tone: BadgeTone; schedId?: string };
  /** Adresse pas encore disponible : carte non cliquable « Bientôt ». */
  pending?: boolean;
  variant?: LinkCardVariant;
  /** Rang dans l’entrée en cascade (omis dans un bloc groupé, qui entre d’un seul tenant). */
  enterIndex?: number;
}

const SHELL: Record<LinkCardVariant, string> = {
  row: "glass flex items-center gap-3.5 rounded-[1.25rem] py-3 pr-3.5 pl-3",
  feature: "lift flex min-h-[10rem] flex-col rounded-[1.5rem] p-4",
  tile: "lift flex min-h-[9rem] flex-col gap-3 rounded-[1.35rem] p-3.5",
  compact: "lift flex flex-col items-center gap-2.5 rounded-[1.35rem] px-2 pt-4 pb-3.5 text-center",
  highlight: "card-highlight flex items-center gap-3.5 rounded-[1.25rem] py-3.5 pr-3.5 pl-4",
  grouped: "flex items-center gap-3.5 px-3.5 py-3",
};

const HOVER: Record<LinkCardVariant, string> = {
  row: "hover:border-line-strong hover:bg-fill-hover focus-visible:border-line-strong",
  feature: "hover:border-line-strong",
  tile: "hover:border-line-strong",
  compact: "hover:border-line-strong",
  highlight: "hover:border-[color-mix(in_oklab,var(--heading)_45%,transparent)]",
  grouped: "hover:bg-fill-hover focus-visible:bg-fill-hover",
};

/** Cartes qui se soulèvent au survol (souris). */
const LIFTS: ReadonlySet<LinkCardVariant> = new Set(["feature", "tile", "compact", "highlight"]);

function IconTile({
  category,
  pending,
  className,
  children,
}: {
  category: LinkCategory;
  pending: boolean;
  className: string;
  children: ReactNode;
}) {
  return (
    <span
      className={clsx(
        `cat-${category}`,
        "relative grid shrink-0 place-items-center icon-tile",
        pending && "opacity-60",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Mention « Bientôt » en coin de tuile. */
function PendingChip() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.625rem] leading-none font-medium text-muted ring-1 ring-line">
      <Clock3 aria-hidden="true" className="size-3" />
      <span aria-hidden="true">Bientôt</span>
      <span className="sr-only">Bientôt disponible</span>
    </span>
  );
}

/** Carte de lien, déclinée selon la mise en page de sa section. */
export function LinkCard({
  title,
  subtitle,
  href,
  category,
  icon,
  watermark,
  badge,
  pending = false,
  variant = "row",
  enterIndex,
}: LinkCardProps) {
  const external = isExternalHref(href);
  // « Nouveau » contredirait « Bientôt » ; une pastille informative ou datée reste.
  const shownBadge = pending && badge?.tone === "new" ? undefined : badge;
  const badgeNode = shownBadge ? (
    <LinkBadge label={shownBadge.label} tone={shownBadge.tone} schedId={shownBadge.schedId} className="mb-1.5" />
  ) : null;
  const subtitleNode = (
    <>
      <span className="sr-only"> — </span>
      {subtitle}
    </>
  );

  let content: ReactNode;
  switch (variant) {
    case "feature":
      content = (
        <>
          {watermark ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-5 -bottom-7 rotate-[-12deg] text-heading opacity-[0.05] [&>svg]:size-36"
            >
              {watermark}
            </span>
          ) : null}
          <span className="relative flex items-start justify-between gap-3">
            <IconTile category={category} pending={pending} className="size-12 rounded-2xl [&>svg]:size-6">
              {icon}
            </IconTile>
            {pending ? (
              <PendingChip />
            ) : (
              <span className="grid size-9 place-items-center rounded-full bg-fill-hover text-heading ring-1 ring-line transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </span>
            )}
          </span>
          <span className="relative mt-auto flex flex-col pt-6">
            {badgeNode}
            <span className="font-display-name text-[length:calc(1.2rem*var(--display-scale))] leading-tight text-pretty text-ink">
              {title}
            </span>
            <span className="mt-1 text-[0.8rem] leading-snug text-pretty text-muted">{subtitleNode}</span>
          </span>
        </>
      );
      break;

    case "tile":
      content = (
        <>
          <span className="flex items-start justify-between gap-2">
            <IconTile category={category} pending={pending} className="size-10 rounded-xl">
              {icon}
            </IconTile>
            {pending ? (
              <PendingChip />
            ) : (
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 text-muted transition-[translate,color] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
              />
            )}
          </span>
          <span className="mt-auto flex flex-col">
            {badgeNode}
            <span className="text-[0.9rem] leading-tight font-semibold tracking-[-0.01em] text-pretty text-ink">
              {title}
            </span>
            <span className="mt-1 text-[0.72rem] leading-snug text-pretty text-muted">{subtitleNode}</span>
          </span>
        </>
      );
      break;

    case "compact":
      content = (
        <>
          <IconTile category={category} pending={pending} className="size-12 rounded-2xl [&>svg]:size-[1.4rem]">
            {icon}
          </IconTile>
          <span className="text-[0.8rem] leading-tight font-semibold text-balance text-ink">{title}</span>
          <span className="sr-only">{subtitleNode}</span>
          {pending ? (
            <span className="-mt-1 text-[0.625rem] leading-none font-medium text-muted">
              <span aria-hidden="true">Bientôt</span>
              <span className="sr-only">Bientôt disponible</span>
            </span>
          ) : null}
        </>
      );
      break;

    case "highlight":
      content = (
        <>
          <span
            aria-hidden="true"
            className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-accent-gradient forced-colors:hidden"
          />
          <span
            className={clsx(
              "grid size-11 shrink-0 place-items-center rounded-full bg-accent-gradient text-on-accent shadow-[inset_0_1px_0_0_rgb(255_255_255/0.25)]",
              pending && "opacity-80",
            )}
          >
            {icon}
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            {badgeNode}
            <span className="text-[0.98rem] leading-tight font-semibold tracking-[-0.01em] text-pretty text-heading">
              {title}
            </span>
            <span className="mt-1 text-xs leading-snug text-pretty text-soft">{subtitleNode}</span>
          </span>
          {pending ? (
            <PendingLabel />
          ) : (
            <ChevronRight
              aria-hidden="true"
              className="size-[1.1rem] shrink-0 text-heading transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 forced-colors:text-inherit!"
            />
          )}
        </>
      );
      break;

    default:
      // « row » et « grouped »
      content = (
        <>
          <IconTile
            category={category}
            pending={pending}
            className={variant === "grouped" ? "size-9 rounded-xl" : "size-10 rounded-xl"}
          >
            {icon}
          </IconTile>
          <span className="relative flex min-w-0 flex-1 flex-col">
            {badgeNode}
            <span className="text-[0.95rem] leading-tight font-semibold tracking-[-0.01em] text-pretty text-ink">
              {title}
            </span>
            <span className="mt-1 text-xs leading-snug text-pretty text-muted">{subtitleNode}</span>
          </span>
          {pending ? (
            <PendingLabel />
          ) : (
            <ChevronRight
              aria-hidden="true"
              className="relative size-[1.1rem] shrink-0 text-muted transition-[translate,color] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:text-ink forced-colors:text-inherit!"
            />
          )}
        </>
      );
  }

  const enter = enterIndex === undefined ? undefined : enterStyle(enterIndex);
  const base = clsx(
    SHELL[variant],
    "relative h-full overflow-hidden",
    variant !== "grouped" && "forced-colors:border",
    enter && "enter",
  );

  if (pending) {
    return (
      <div className={clsx(base, "cursor-default")} style={enter}>
        {content}
      </div>
    );
  }

  return (
    <m.a
      {...linkProps(href)}
      whileHover={LIFTS.has(variant) ? { y: -2 } : undefined}
      whileTap={{ scale: TAP_SCALE }}
      transition={SPRING}
      style={enter}
      className={clsx(
        base,
        "group transition-[background-color,border-color,box-shadow] duration-500 ease-[var(--ease-out-expo)]",
        HOVER[variant],
      )}
    >
      {content}
      {external ? <span className="sr-only"> (nouvel onglet)</span> : null}
    </m.a>
  );
}
