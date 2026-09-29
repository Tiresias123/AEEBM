"use client";

import { useEffect, useState } from "react";

/**
 * Année courante. Rendue à la génération de la page, puis actualisée dans le navigateur
 * pour rester juste même si le site n’a pas été redéployé depuis le 1er janvier.
 */
export function CurrentYear({ initial }: { initial: number }) {
  const [year, setYear] = useState(initial);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return <time dateTime={String(year)}>{year}</time>;
}
