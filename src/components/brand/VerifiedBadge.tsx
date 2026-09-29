import { useId } from "react";
import { cn } from "@/lib/utils";

/** Tracés de la rosette (lucide « BadgeCheck », licence ISC), partagés avec l’image de partage. */
export const ROSETTE_PATH =
  "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z";
export const CHECK_PATH = "m8.6 12.1 2.3 2.3 4.5-4.6";

/** Pastille de vérification (rosette pleine + coche), dans les couleurs « verified » du thème. */
export function VerifiedBadge({ label, className }: { label: string; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const gradientId = `verified-${uid}`;

  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <svg viewBox="0 0 24 24" className="size-full drop-shadow-[0_2px_3px_rgb(0_0_0/0.18)]" role="img">
        <title>{label}</title>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: "var(--verified-from)" }} />
            <stop offset="1" style={{ stopColor: "var(--verified-to)" }} />
          </linearGradient>
        </defs>
        <path d={ROSETTE_PATH} fill={`url(#${gradientId})`} />
        <path d={CHECK_PATH} fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
