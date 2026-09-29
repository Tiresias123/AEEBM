import { Clock3 } from "lucide-react";
import { clsx } from "clsx";

/**
 * Mention discrète d’un lien pas encore disponible, à la place du chevron. Sous 360 px, une horloge
 * de la taille du chevron remplace le mot pour laisser toute la largeur au texte de la carte.
 */
export function PendingLabel({ onAccent = false }: { onAccent?: boolean }) {
  return (
    <span className={clsx("relative shrink-0", onAccent ? "text-on-accent/85" : "text-muted")}>
      <Clock3 aria-hidden="true" className="size-[1.1rem] opacity-80 min-[360px]:hidden" />
      <span aria-hidden="true" className="hidden text-[0.7rem] leading-none font-medium min-[360px]:inline">
        Bientôt
      </span>
      <span className="sr-only">Bientôt disponible</span>
    </span>
  );
}
