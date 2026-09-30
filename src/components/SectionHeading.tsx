import { Enter } from "@/components/Enter";

/** Titre de section en capitales espacées (charte, section 12), suivi d’un filet qui s’efface vers la droite. */
export function SectionHeading({ id, title, enterIndex }: { id: string; title: string; enterIndex: number }) {
  return (
    <Enter index={enterIndex} className="flex items-center gap-3 px-1">
      <h2
        id={id}
        className="font-display text-[0.8125rem] font-semibold tracking-[0.15em] text-balance text-heading uppercase sm:text-[0.875rem] sm:tracking-[0.2em]"
      >
        {title}
      </h2>
      <span aria-hidden="true" className="h-px min-w-0 flex-1 bg-gradient-to-r from-line-strong to-transparent" />
    </Enter>
  );
}
