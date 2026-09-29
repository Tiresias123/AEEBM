import type { ReactNode } from "react";
import { enterStyle } from "@/lib/enter";
import { cn } from "@/lib/utils";

/**
 * Élément révélé en cascade à l’arrivée sur la page (fondu et légère montée).
 * Animation purement CSS : visible dès le premier affichage, sans dépendre de l’hydratation.
 */
export function Enter({ index, className, children }: { index: number; className?: string; children: ReactNode }) {
  return (
    <div className={cn("enter", className)} style={enterStyle(index)}>
      {children}
    </div>
  );
}
