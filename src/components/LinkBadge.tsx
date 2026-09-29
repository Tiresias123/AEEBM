import { clsx } from "clsx";
import type { BadgeTone } from "@/config/types";

/** Pastille de statut d’un lien : « Nouveau », « Important », « Date limite »… */
export function LinkBadge({
  label,
  tone,
  schedId,
  className,
}: {
  label: string;
  tone: BadgeTone;
  /** Identifiant de période d’affichage (pastille datée). */
  schedId?: string;
  className?: string;
}) {
  return (
    <span
      data-sched={schedId}
      className={clsx(
        `tone-${tone} tone-badge inline-flex w-fit shrink-0 items-center gap-1 rounded-full px-2 py-[0.2rem] text-[0.6875rem] leading-none font-semibold tracking-[0.04em] uppercase`,
        className,
      )}
    >
      {tone === "deadline" || tone === "new" || tone === "important" ? (
        <span aria-hidden="true" className="tone-dot size-1.5 rounded-full" />
      ) : null}
      <span className="sr-only">(</span>
      {label}
      <span className="sr-only">)</span>
    </span>
  );
}
