import { StaggerItem } from "@/components/motion";

/** Étiquette de section en capitales espacées, suivie d’un filet (charte, sections 12 et 13). */
export function SectionHeading({ id, title }: { id: string; title: string }) {
  return (
    <StaggerItem className="flex items-center gap-3 px-1">
      <h2 id={id} className="shrink-0 text-[0.66rem] font-semibold tracking-[0.22em] text-muted uppercase">
        {title}
      </h2>
      <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-white/[0.14] to-transparent" />
    </StaggerItem>
  );
}
