import { useId } from "react";
import { MONOGRAM_TEXT_PATH } from "@/components/brand/monogram-path";
import { MONOGRAM_ARCS } from "@/lib/monogram-svg";
import { cn } from "@/lib/utils";

interface MonogramProps {
  className?: string;
  /** Nom accessible. Omettre pour une image décorative. */
  label?: string;
}

/**
 * Monogramme « avatar rond » de l’AEEBM : sigle en Cormorant Garamond inscrit dans le cercle ouvert,
 * sur son disque bordeaux en aplat (sans effet ajouté : charte, section 10). Entièrement vectoriel.
 */
export function Monogram({ className, label }: MonogramProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const discId = `mono-disc-${uid}`;

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("block", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id={discId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--avatar-from)" }} />
          <stop offset="1" style={{ stopColor: "var(--avatar-to)" }} />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="100" fill={`url(#${discId})`} />
      <g fill="none" style={{ stroke: "var(--on-accent)" }} strokeWidth="1.6" strokeLinecap="round">
        <path d={MONOGRAM_ARCS.top} />
        <path d={MONOGRAM_ARCS.bottom} />
      </g>
      <path d={MONOGRAM_TEXT_PATH} style={{ fill: "var(--on-accent)" }} />
    </svg>
  );
}
