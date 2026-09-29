import type { CSSProperties } from "react";

/** Style de l’entrée en cascade (classe « enter ») : rang dans la séquence, délai = rang × 55 ms, plafonné. */
export function enterStyle(index: number): CSSProperties {
  return { "--i": index } as CSSProperties;
}
