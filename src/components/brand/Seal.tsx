import type { CSSProperties } from "react";
import { Monogram } from "@/components/brand/Monogram";
import { diamond, guillocheBand, inscriptionPaths, openCircle, openWaves } from "@/lib/seal";

/*
 * Sceau de l’en-tête (repère de 240 unités, centre 120) :
 *   disque du monogramme (r 66) · bande guillochée (r 72 à 84) · filet intérieur (r 90)
 *   · inscription circulaire (r 98 en haut, 106 en bas) · filet extérieur (r 114).
 * Tous les anneaux s’interrompent dans l’axe horizontal (cercle ouvert de la charte), où se posent deux losanges.
 */
const C = 120;
const GAP = 11;

/** Délai de tracé (animation CSS « seal-draw »). */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Seal({
  top,
  bottom,
  open,
  monogramLabel,
}: {
  /** Inscription de l’arc supérieur. */
  top: string;
  /** Inscription de l’arc inférieur. */
  bottom: string;
  /** Anneaux ouverts (charte) ou continus. */
  open: boolean;
  monogramLabel: string;
}) {
  const gap = open ? GAP : 0;
  const outer = openCircle(C, C, 114, gap);
  const inner = openCircle(C, C, 90, gap);
  const band = guillocheBand({ cx: C, cy: C, r0: 78, amplitude: 6, k: 18, strands: 4, gap, step: 2 });
  const text = inscriptionPaths(C, C, 98, 106, open ? GAP + 3 : 3);

  return (
    <div className="relative size-[11.5rem] sm:size-[12.5rem]">
      <svg
        viewBox="0 0 240 240"
        aria-hidden="true"
        focusable="false"
        className="absolute inset-0 size-full overflow-visible text-heading"
      >
        <defs>
          <path id="sceau-haut" d={text.top} />
          <path id="sceau-bas" d={text.bottom} />
        </defs>

        <g fill="none" stroke="currentColor" strokeLinecap="round">
          {outer.map((d, i) => (
            <path
              key={d}
              d={d}
              pathLength={1}
              className="seal-draw"
              style={delay(i * 120)}
              strokeWidth={0.9}
              strokeOpacity={0.6}
            />
          ))}
          {inner.map((d, i) => (
            <path
              key={d}
              d={d}
              pathLength={1}
              className="seal-draw"
              style={delay(150 + i * 120)}
              strokeWidth={0.7}
              strokeOpacity={0.5}
            />
          ))}
          {band.map((d, i) => (
            <path
              key={d}
              d={d}
              pathLength={1}
              className="seal-draw"
              style={delay(250 + i * 45)}
              strokeWidth={0.45}
              strokeOpacity={0.42}
            />
          ))}
        </g>

        {open ? (
          <g fill="currentColor" className="seal-fade">
            <path d={diamond(C - 102, C, 5)} />
            <path d={diamond(C + 102, C, 5)} />
          </g>
        ) : null}

        <g
          fill="currentColor"
          className="seal-fade"
          style={{ fontFamily: "var(--font-body-family)", fontWeight: 500, fontSize: 9.5, letterSpacing: "2.4px" }}
        >
          <text>
            <textPath href="#sceau-haut" startOffset="50%" textAnchor="middle">
              {top.toLocaleUpperCase("fr-CA")}
            </textPath>
          </text>
          <text>
            <textPath href="#sceau-bas" startOffset="50%" textAnchor="middle">
              {bottom.toLocaleUpperCase("fr-CA")}
            </textPath>
          </text>
        </g>
      </svg>

      {/* Disque du monogramme, légèrement en relief sur le papier. */}
      <div className="absolute inset-[22.5%] rounded-full shadow-[0_12px_26px_-12px_rgb(60_14_10/0.6),0_2px_6px_-2px_rgb(60_14_10/0.35)]">
        <Monogram className="size-full" label={monogramLabel} />
      </div>
    </div>
  );
}

/*
 * Ondes du cercle ouvert : arcs concentriques très fins autour du sceau, qui s’estompent vers l’extérieur
 * (masque radial) et se tracent en cascade à l’arrivée. Repère centré (1 unité = 1 px).
 */
const WAVE_RADII = Array.from({ length: 20 }, (_, i) => 118 + i * 12);
const WAVES_MASK =
  "radial-gradient(closest-side, #000 25%, rgb(0 0 0 / 0.55) 55%, transparent 100%), linear-gradient(to bottom, #000 50%, transparent 66%)";

export function SealWaves({ open, className }: { open: boolean; className?: string }) {
  const waves = openWaves(WAVE_RADII, open ? 22 : 0);
  return (
    <svg
      viewBox="-360 -360 720 720"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{
        // Estompées vers l’extérieur, et sous le sceau pour laisser l’accroche et les piliers sur papier nu.
        maskImage: WAVES_MASK,
        WebkitMaskImage: WAVES_MASK,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      <g fill="none" stroke="currentColor" strokeWidth={0.7} strokeOpacity={0.22}>
        {waves.map(([topArc, bottomArc], i) => (
          <g key={i}>
            <path d={topArc} pathLength={1} className="seal-draw" style={delay(350 + i * 45)} />
            <path d={bottomArc} pathLength={1} className="seal-draw" style={delay(350 + i * 45)} />
          </g>
        ))}
      </g>
    </svg>
  );
}
