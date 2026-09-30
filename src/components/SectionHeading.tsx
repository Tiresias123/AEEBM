import { Enter } from "@/components/Enter";

/**
 * Titre de section numéroté comme un texte de loi (I, II, III) : chiffre romain en Cormorant, titre en
 * capitales espacées, puis un filet qui s’efface vers la droite (charte, section 12).
 */
export function SectionHeading({
  id,
  title,
  numeral,
  enterIndex,
}: {
  id: string;
  title: string;
  /** Chiffre romain décoratif (non lu : l’ordre des sections suffit). */
  numeral?: string;
  enterIndex: number;
}) {
  return (
    <Enter index={enterIndex} className="flex items-center gap-3 px-1">
      {numeral ? (
        <span
          aria-hidden="true"
          className="min-w-[1.1em] font-display-name text-[length:calc(1.35rem*var(--display-scale))] leading-none text-heading [text-shadow:var(--emboss)]"
        >
          {numeral}
        </span>
      ) : null}
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
