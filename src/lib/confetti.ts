"use client";

import type { Options } from "canvas-confetti";

/** Lit les couleurs de confettis du thème actif, transmises par <html data-confetti>. */
function themeColors(): string[] | undefined {
  const raw = document.documentElement.dataset.confetti;
  return raw ? raw.split(",") : undefined;
}

/**
 * Déclenche une salve de confettis depuis un élément (ou le centre de l’écran).
 * La bibliothèque est chargée à la demande et respecte « réduire les animations ».
 */
export async function celebrate(origin?: HTMLElement | null): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Mesurer l’origine avant l’import : l’élément peut être démonté pendant le chargement du module.
  let x = 0.5;
  let y = 0.6;
  if (origin?.isConnected) {
    const rect = origin.getBoundingClientRect();
    x = (rect.left + rect.width / 2) / window.innerWidth;
    y = (rect.top + rect.height / 2) / window.innerHeight;
  }

  const { default: confetti } = await import("canvas-confetti");

  const base: Options = {
    origin: { x, y },
    colors: themeColors(),
    disableForReducedMotion: true,
    zIndex: 9999,
    ticks: 220,
    scalar: 0.9,
  };

  confetti({ ...base, particleCount: 70, spread: 70, startVelocity: 38 });
  window.setTimeout(() => {
    confetti({ ...base, particleCount: 40, spread: 110, startVelocity: 26, decay: 0.92, scalar: 0.75 });
  }, 140);
}
