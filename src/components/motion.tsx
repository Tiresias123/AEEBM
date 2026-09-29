"use client";

import { LazyMotion, MotionConfig, domAnimation, m, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Fournisseur d’animations : charge le sous-ensemble DOM de framer-motion à la demande
 * et respecte automatiquement « réduire les animations » du système.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.065, delayChildren: 0.08 },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.86, filter: "blur(8px)" },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
};

/** Conteneur de la page : orchestre l’entrée en cascade de ses enfants. */
export function StaggerRoot({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div className={className} variants={staggerContainer} initial="hidden" animate="show">
      {children}
    </m.div>
  );
}

/** Élément animé en cascade (fondu + montée, ou apparition pour l’avatar). */
export function StaggerItem({
  children,
  className,
  variant = "fade",
}: {
  children: ReactNode;
  className?: string;
  variant?: "fade" | "pop";
}) {
  return (
    <m.div className={className} variants={variant === "pop" ? popIn : fadeUp}>
      {children}
    </m.div>
  );
}

export const TAP_SCALE = 0.975;
export const SPRING = { type: "spring", stiffness: 420, damping: 30, mass: 0.7 } as const;
