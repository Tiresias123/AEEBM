import { ChevronRight } from "lucide-react";
import { TransitionLink } from "@/components/TransitionLink";
import { frTypo } from "@/lib/typo";

const COUNT_WORDS = ["", "Une place disponible", "Deux places disponibles"];

/**
 * Places de grand partenaire encore libres : rangée en pointillé (emplacement vide), qui mène au bloc
 * « Devenir partenaire » de la page des partenaires.
 */
export function OpenSlotRow({
  count,
  text,
  href,
  eyebrow,
}: {
  count: number;
  text?: string;
  href: string;
  /** Surtitre (« Grand partenaire »), omis sous un titre de section qui le dit déjà. */
  eyebrow?: string;
}) {
  const title = COUNT_WORDS[count] ?? `${count} places disponibles`;
  // Ancre de la même page : lien ordinaire ; autre page : changement d’onglet animé.
  const className =
    "group flex items-center gap-3 rounded-[1.3rem] border border-dashed border-[color-mix(in_oklab,var(--heading)_34%,transparent)] bg-[color-mix(in_oklab,var(--fill)_40%,transparent)] py-3.5 pr-4 pl-5 text-left transition-[background-color,border-color] duration-300 hover:border-[color-mix(in_oklab,var(--heading)_55%,transparent)] hover:bg-fill";
  const content = (
    <>
      <span className="min-w-0 flex-1">
        {eyebrow ? (
          <span className="mb-2 block text-[0.6rem] leading-none tracking-[0.3em] text-muted uppercase">{eyebrow}</span>
        ) : null}
        <span className="block font-display-name text-[length:calc(1.06rem*var(--display-scale))] leading-tight text-heading">
          {title}
        </span>
        {text ? (
          <span className="mt-1 block text-[0.72rem] leading-snug text-balance text-muted">{frTypo(text)}</span>
        ) : null}
      </span>
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-full text-heading ring-1 ring-line-strong transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5"
      >
        <ChevronRight className="size-4" />
      </span>
    </>
  );

  return href.startsWith("#") ? (
    <a href={href} className={className}>
      {content}
    </a>
  ) : (
    <TransitionLink href={href} className={className}>
      {content}
    </TransitionLink>
  );
}
