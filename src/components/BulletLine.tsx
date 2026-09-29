"use client";

import { clsx } from "clsx";
import { useLayoutEffect, useRef } from "react";

/**
 * Ligne « A • B • C » centrée : les segments passent à la ligne d’un bloc et la puce qui tomberait
 * en début de ligne est masquée (les puces sont hors flux : aucun décalage). Avec `gradient`, le dégradé
 * du sous-titre parcourt chaque ligne d’un seul tenant au lieu de recommencer à chaque segment.
 */
export function BulletLine({ text, gradient = false }: { text: string; gradient?: boolean }) {
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
      const lines: HTMLElement[][] = [];
      items.forEach((item, index) => {
        const previous = items[index - 1];
        const startsLine = !previous || item.offsetTop > previous.offsetTop + 1;
        const bullet = item.querySelector<HTMLElement>("[data-bullet]");
        if (bullet) bullet.style.visibility = startsLine ? "hidden" : "";
        if (startsLine) lines.push([]);
        lines[lines.length - 1].push(item);
      });

      if (!gradient) return;
      for (const line of lines) {
        const left = Math.min(...line.map((item) => item.offsetLeft));
        const right = Math.max(...line.map((item) => item.offsetLeft + item.offsetWidth));
        for (const item of line) {
          const label = item.querySelector<HTMLElement>("[data-label]");
          if (!label) continue;
          label.style.backgroundSize = `${right - left}px 100%`;
          label.style.backgroundPosition = `${left - item.offsetLeft}px 0`;
        }
      }
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    void document.fonts?.ready.then(update);
    return () => observer.disconnect();
  }, [text, gradient]);

  return (
    <span ref={ref} className="flex flex-wrap justify-center gap-x-[1.05em]">
      {parts.map((part, index) => (
        <span key={index} data-seg="" className="relative max-w-full text-balance">
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
          <span data-label="" className={clsx(gradient && "text-gradient-subtitle")}>
            {part}
          </span>
        </span>
      ))}
    </span>
  );
}
