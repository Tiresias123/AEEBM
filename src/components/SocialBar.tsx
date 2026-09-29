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

const BUTTON = "relative grid size-11 place-items-center rounded-full";

/** Barre des réseaux sociaux : une seule pastille en verre ; icônes aux couleurs des titres, relief au survol. */
export function SocialBar({ items }: { items: SocialItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Réseaux sociaux" className="flex justify-center">
      <ul className="inline-flex max-w-full flex-wrap items-center justify-center gap-1 rounded-full glass p-1.5 forced-colors:border">
        {items.map((item) => (
          <li key={item.label}>
            {item.pending ? (
              <span className={`${BUTTON} cursor-default text-ink/30`}>
                {item.icon}
                <span className="sr-only">{item.label} (bientôt disponible)</span>
              </span>
            ) : (
              <m.a
                {...linkProps(item.href)}
                aria-label={isExternalHref(item.href) ? `${item.label} (nouvel onglet)` : item.label}
                className={`${BUTTON} text-heading transition-[background-color,box-shadow] duration-300 hover:bg-fill-hover hover:shadow-[var(--card-shadow),inset_0_0_0_1px_var(--line)] focus-visible:bg-fill-hover`}
                whileHover={{ scale: 1.1 }}
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
