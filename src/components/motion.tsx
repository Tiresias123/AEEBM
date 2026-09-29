"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Fournisseur d’animations interactives (pression tactile, survol, transitions d’état) :
 * charge le sous-ensemble DOM de framer-motion à la demande et respecte « réduire les animations ».
 * L’entrée en cascade est en CSS (voir <Enter>) pour que le contenu s’affiche sans attendre le JavaScript.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

export const TAP_SCALE = 0.98;
/** Ressort amorti sans rebond : mouvements doux et continus. */
export const SPRING = { type: "spring", stiffness: 260, damping: 32, mass: 0.8 } as const;
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
