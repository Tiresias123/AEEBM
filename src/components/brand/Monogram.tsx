import { useId } from "react";
import { MONOGRAM_TEXT_PATH } from "@/components/brand/monogram-path";
import { cn } from "@/lib/utils";

interface MonogramProps {
  className?: string;
  /** Titre accessible. Omettre pour une image décorative. */
  title?: string;
}

/** Géométrie du cercle ouvert : rayon 67, interruption de ±22° de part et d’autre du sigle. */
const R = 67;
const GAP = (22 * Math.PI) / 180;
const DX = +(R * Math.cos(GAP)).toFixed(2);
const DY = +(R * Math.sin(GAP)).toFixed(2);
const TOP_ARC = `M${100 - DX} ${100 - DY}A${R} ${R} 0 0 1 ${100 + DX} ${100 - DY}`;
const BOTTOM_ARC = `M${100 - DX} ${100 + DY}A${R} ${R} 0 0 0 ${100 + DX} ${100 + DY}`;

/**
 * Monogramme « avatar rond » de l’AEEBM : sigle en Cormorant Garamond inscrit dans le cercle ouvert,
 * sur un disque aux couleurs du thème. Entièrement vectoriel (net à toute taille).
 */
export function Monogram({ className, title }: MonogramProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const discId = `mono-disc-${uid}`;
  const sheenId = `mono-sheen-${uid}`;

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("block", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
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
        <path d={TOP_ARC} />
        <path d={BOTTOM_ARC} />
      </g>
      <path d={MONOGRAM_TEXT_PATH} style={{ fill: "var(--on-accent)" }} />
    </svg>
  );
}
