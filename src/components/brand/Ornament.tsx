import { cn } from "@/lib/utils";

/**
 * Filet orné : deux traits fins de part et d’autre du cercle ouvert de la charte (section 09),
 * interrompu dans l’axe horizontal comme l’anneau de l’avatar.
 */
export function Ornament({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center gap-2 text-[color-mix(in_oklab,var(--ring-1)_40%,transparent)]",
        className,
      )}
    >
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-current" />
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M2.9 5.94A5.5 5.5 0 0 1 13.1 5.94M2.9 10.06A5.5 5.5 0 0 0 13.1 10.06" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-current" />
    </div>
  );
}
