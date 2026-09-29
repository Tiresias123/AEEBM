"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { SPRING } from "@/components/motion";
import { isExternalHref, linkProps } from "@/lib/links";

export interface SocialItem {
  href: string;
  label: string;
  /** Icône rendue côté serveur. */
  icon: ReactNode;
  /** Compte pas encore renseigné : pastille atténuée, non cliquable. */
  pending: boolean;
}

const BUTTON = "glass relative grid size-12 place-items-center rounded-full";

/** Barre des réseaux sociaux : pastilles en verre, élévation et halo au survol. */
export function SocialBar({ items }: { items: SocialItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Réseaux sociaux">
      <ul className="flex flex-wrap items-center justify-center gap-3">
        {items.map((item) => (
          <li key={item.label}>
            {item.pending ? (
              <span className={`${BUTTON} cursor-default text-ink/35`}>
                {item.icon}
                <span className="sr-only">{item.label} (bientôt disponible)</span>
              </span>
            ) : (
              <m.a
                {...linkProps(item.href)}
                aria-label={isExternalHref(item.href) ? `${item.label} (nouvel onglet)` : item.label}
                className={`${BUTTON} text-ink/85 transition-[color,box-shadow] duration-300 hover:text-ink hover:shadow-[0_0_26px_-4px_color-mix(in_oklab,var(--accent-via)_85%,transparent),inset_0_0_0_1px_var(--line-strong)] focus-visible:shadow-[0_0_26px_-4px_color-mix(in_oklab,var(--accent-via)_85%,transparent)]`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.92 }}
                transition={SPRING}
              >
                {item.icon}
              </m.a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
