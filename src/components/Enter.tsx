import type { ReactNode } from "react";
import { enterStyle } from "@/lib/enter";
import { cn } from "@/lib/utils";

/**
 * Élément révélé en cascade à l’arrivée sur la page (fondu et montée, ou apparition pour l’avatar).
 * Animation purement CSS : visible dès le premier affichage, sans dépendre de l’hydratation.
 */
export function Enter({
  index,
  pop = false,
  className,
  children,
}: {
  index: number;
  pop?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("enter", pop && "enter-pop", className)} style={enterStyle(index)}>
      {children}
    </div>
  );
}
