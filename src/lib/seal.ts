/**
 * Géométrie du sceau de l’en-tête (tracés SVG calculés au rendu serveur, sans JavaScript côté client).
 *
 * Tous les cercles sont « ouverts » dans l’axe horizontal, comme le cercle de la charte (section 09) :
 * chaque anneau se compose d’un arc supérieur et d’un arc inférieur séparés par une ouverture.
 */

const round = (value: number) => Math.round(value * 10) / 10;
const rad = (degrees: number) => (degrees * Math.PI) / 180;

function point(cx: number, cy: number, r: number, degrees: number): string {
  return `${round(cx + r * Math.cos(rad(degrees)))} ${round(cy + r * Math.sin(rad(degrees)))}`;
}

/**
 * Cercle ouvert : arcs supérieur et inférieur, interrompus de `gap` degrés de part et d’autre de l’axe
 * horizontal. Avec `gap` = 0, cercle complet (deux demi-cercles).
 */
export function openCircle(cx: number, cy: number, r: number, gap: number): [string, string] {
  const top = `M${point(cx, cy, r, 180 + gap)}A${r} ${r} 0 0 1 ${point(cx, cy, r, 360 - gap)}`;
  const bottom = `M${point(cx, cy, r, 180 - gap)}A${r} ${r} 0 0 0 ${point(cx, cy, r, gap)}`;
  return [top, bottom];
}

/**
 * Chemins de l’inscription circulaire, parcourus de gauche à droite pour que les lettres restent droites :
 * par le haut (pied des lettres vers le centre) et par le bas (tête des lettres vers le centre).
 */
export function inscriptionPaths(cx: number, cy: number, rTop: number, rBottom: number, gap: number) {
  return { top: openCircle(cx, cy, rTop, gap)[0], bottom: openCircle(cx, cy, rBottom, gap)[1] };
}

/**
 * Bande guillochée : `strands` sinusoïdes polaires déphasées, r(θ) = r0 + amplitude · sin(k·θ + φ),
 * dont l’entrelacs imite la gravure des diplômes et des billets. Échantillonnée tous les `step` degrés,
 * en deux moitiés (haut et bas) pour ménager l’ouverture horizontale.
 */
export function guillocheBand({
  cx,
  cy,
  r0,
  amplitude,
  k,
  strands,
  gap,
  step = 2,
}: {
  cx: number;
  cy: number;
  r0: number;
  amplitude: number;
  k: number;
  strands: number;
  gap: number;
  step?: number;
}): string[] {
  const halves: Array<[number, number]> = [
    [180 + gap, 360 - gap],
    [gap, 180 - gap],
  ];
  const paths: string[] = [];
  for (let strand = 0; strand < strands; strand++) {
    const phase = (strand * 2 * Math.PI) / strands;
    for (const [from, to] of halves) {
      const points: string[] = [];
      for (let degrees = from; degrees <= to + 1e-9; degrees += step) {
        const r = r0 + amplitude * Math.sin(k * rad(degrees) + phase);
        points.push(point(cx, cy, r, degrees));
      }
      paths.push(`M${points.join("L")}`);
    }
  }
  return paths;
}

/**
 * Ondes du cercle ouvert : arcs concentriques dont l’ouverture forme un couloir horizontal de hauteur
 * constante (`corridor`), quelle que soit la distance au centre.
 */
export function openWaves(radii: number[], corridor: number): Array<[string, string]> {
  return radii.map((r) => {
    const gap = corridor > 0 ? (Math.asin(Math.min(1, corridor / 2 / r)) * 180) / Math.PI : 0;
    return openCircle(0, 0, r, gap);
  });
}

/** Petit losange (ornement) centré en (x, y). */
export function diamond(x: number, y: number, size: number): string {
  const h = size / 2;
  return `M${round(x)} ${round(y - h)}L${round(x + h)} ${round(y)}L${round(x)} ${round(y + h)}L${round(x - h)} ${round(y)}Z`;
}
