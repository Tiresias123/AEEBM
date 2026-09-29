import { Enter } from "@/components/Enter";

/** Étiquette de section en capitales espacées (charte, section 12). */
export function SectionHeading({ id, title, enterIndex }: { id: string; title: string; enterIndex: number }) {
  return (
    <Enter index={enterIndex} className="px-1">
      <h2 id={id} className="text-[0.6875rem] font-semibold tracking-[0.18em] text-muted uppercase">
        {title}
      </h2>
    </Enter>
  );
}
