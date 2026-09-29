import { Enter } from "@/components/Enter";

/** Étiquette de section en capitales espacées, suivie d’un filet (charte, sections 12 et 13). */
export function SectionHeading({ id, title, enterIndex }: { id: string; title: string; enterIndex: number }) {
  return (
    <Enter index={enterIndex} className="flex items-center gap-3 px-1">
      <h2 id={id} className="min-w-0 text-[0.6875rem] font-semibold tracking-[0.18em] text-muted uppercase">
        {title}
      </h2>
      <span aria-hidden="true" className="section-rule h-px min-w-6 flex-1" />
    </Enter>
  );
}
