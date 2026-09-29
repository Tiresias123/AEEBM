import { Clock3 } from "lucide-react";
import { clsx } from "clsx";

/**
 * Mention discrète d’un lien pas encore disponible, à la place du chevron. Sous 360 px, une horloge
 * de la taille du chevron remplace le mot pour laisser toute la largeur au texte de la carte.
 */
export function PendingLabel({ onAccent = false }: { onAccent?: boolean }) {
  return (
    <span className={clsx("relative shrink-0", onAccent ? "text-on-accent" : "text-muted")}>
      <Clock3 aria-hidden="true" className="size-[1.15rem] opacity-80 min-[360px]:hidden" />
      <span
        aria-hidden="true"
        className={clsx(
          "hidden rounded-full px-2 py-1 text-[0.625rem] leading-none font-semibold tracking-[0.06em] uppercase min-[360px]:inline-block",
          onAccent ? "bg-black/20 ring-1 ring-white/30" : "ring-1 ring-white/10",
        )}
      >
        Bientôt
      </span>
      <span className="sr-only">Bientôt disponible</span>
    </span>
  );
}
