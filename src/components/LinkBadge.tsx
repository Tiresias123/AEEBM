import type { LinkBadge as LinkBadgeConfig } from "@/config/types";
import { cn } from "@/lib/utils";

/** Pastille de statut d’un lien : « Nouveau », « Important », « Date limite »… */
export function LinkBadge({ badge, className }: { badge: LinkBadgeConfig; className?: string }) {
  return (
    <span
      className={cn(
        `tone-${badge.tone} tone-badge inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-[0.2rem] text-[0.625rem] leading-none font-semibold tracking-[0.06em] uppercase`,
        className,
      )}
    >
      {badge.tone === "deadline" || badge.tone === "new" ? (
        <span aria-hidden="true" className="size-1.5 animate-pulse-soft rounded-full bg-current" />
      ) : null}
      {badge.label}
    </span>
  );
}
