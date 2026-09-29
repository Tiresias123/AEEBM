import { Enter } from "@/components/Enter";

/** Titre de section en capitales espacées, dans la police de titre de la charte (section 12). */
export function SectionHeading({ id, title, enterIndex }: { id: string; title: string; enterIndex: number }) {
  return (
    <Enter index={enterIndex} className="px-1">
      <h2 id={id} className="font-display text-[0.875rem] font-semibold tracking-[0.2em] text-heading uppercase">
        {title}
      </h2>
    </Enter>
  );
}
