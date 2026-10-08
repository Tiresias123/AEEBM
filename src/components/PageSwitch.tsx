import { clsx } from "clsx";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { TransitionLink } from "@/components/TransitionLink";

/**
 * Micro-bulle de renvoi vers une autre page du layout commun (page des partenaires, retour aux liens) : pastille
 * en verre, médaillon bordeaux à gauche, chevron qui avance au survol. Changement de page animé (TransitionLink).
 */
export function PageSwitch({
  href,
  label,
  icon,
  back = false,
  className,
}: {
  href: string;
  label: string;
  /** Icône du médaillon, rendue côté serveur. */
  icon: ReactNode;
  /** Retour : pas de chevron (l’icône du médaillon indique la direction). */
  back?: boolean;
  className?: string;
}) {
  return (
    <TransitionLink
      href={href}
      className={clsx(
        "group inline-flex min-h-10 items-center gap-2 rounded-full glass py-1 pl-1 text-[0.75rem] leading-none font-medium text-ink transition-[background-color,border-color] duration-300 hover:border-line-strong hover:bg-fill-hover forced-colors:border",
        back ? "pr-4" : "pr-3",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-gradient text-on-accent shadow-[inset_0_1px_0_0_rgb(255_255_255/0.22)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-105 motion-reduce:transition-none [&>svg]:size-3.5"
      >
        {icon}
      </span>
      {label}
      {back ? null : (
        <ChevronRight
          aria-hidden="true"
          className="size-3.5 text-muted transition-[translate,color] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:text-ink"
        />
      )}
    </TransitionLink>
  );
}
