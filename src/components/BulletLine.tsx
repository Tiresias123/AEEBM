"use client";

import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Ligne « A • B • C » centrée : les segments passent à la ligne d’un bloc et la puce
 * qui tomberait en début de ligne est masquée (les puces sont hors flux : aucun décalage).
 */
export function BulletLine({
  text,
  className,
  segmentClassName,
}: {
  text: string;
  className?: string;
  /** Classes appliquées au texte de chaque segment (p. ex. un dégradé). */
  segmentClassName?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const parts = text
    .split("•")
    .map((part) => part.trim())
    .filter(Boolean);

  useLayoutEffect(() => {
    const container = ref.current;
    if (!container) return;
    const update = () => {
      const items = Array.from(container.querySelectorAll<HTMLElement>("[data-seg]"));
      items.forEach((item, index) => {
        const bullet = item.querySelector<HTMLElement>("[data-bullet]");
        if (!bullet) return;
        const previous = items[index - 1];
        const startsLine = !previous || item.offsetTop > previous.offsetTop + 1;
        bullet.style.visibility = startsLine ? "hidden" : "";
      });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    void document.fonts?.ready.then(update);
    return () => observer.disconnect();
  }, [text]);

  return (
    <span ref={ref} className={cn("flex flex-wrap justify-center gap-x-[1.05em]", className)}>
      {parts.map((part, index) => (
        <span key={index} data-seg="" className="relative whitespace-nowrap">
          {index > 0 ? (
            <>
              <span className="sr-only">, </span>
              <span
                data-bullet=""
                aria-hidden="true"
                className="absolute top-0 -left-[0.72em] text-muted/70 select-none"
              >
                •
              </span>
            </>
          ) : null}
          <span className={segmentClassName}>{part}</span>
        </span>
      ))}
    </span>
  );
}
