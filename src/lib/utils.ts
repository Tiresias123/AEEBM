import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Fusion de classes Tailwind (composants serveur ; les composants client utilisent clsx, plus léger). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
