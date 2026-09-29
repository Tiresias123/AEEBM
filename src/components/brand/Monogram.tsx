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
 * sur un disque aux couleurs du thème. Entièrement vectoriel (net à toute taille).
 */
export function Monogram({ className, label }: MonogramProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const discId = `mono-disc-${uid}`;
  const sheenId = `mono-sheen-${uid}`;

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
        <radialGradient id={sheenId} cx="0.32" cy="0.22" r="0.85">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0.02" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="100" fill={`url(#${discId})`} />
      <circle cx="100" cy="100" r="100" fill={`url(#${sheenId})`} />
      <g fill="none" style={{ stroke: "var(--on-accent)" }} strokeWidth="1.6" strokeLinecap="round" opacity="0.92">
        <path d={MONOGRAM_ARCS.top} />
        <path d={MONOGRAM_ARCS.bottom} />
      </g>
      <path d={MONOGRAM_TEXT_PATH} style={{ fill: "var(--on-accent)" }} />
    </svg>
  );
}
