"use client";

import { m } from "framer-motion";
import { socialIcons } from "@/components/brand/BrandIcons";
import { SPRING } from "@/components/motion";
import type { SocialLink } from "@/config/types";
import { isExternalHref, linkProps } from "@/lib/utils";

export function SocialBar({ socials }: { socials: SocialLink[] }) {
  if (socials.length === 0) return null;

  return (
    <nav aria-label="Réseaux sociaux">
      <ul className="flex flex-wrap items-center justify-center gap-3">
        {socials.map((social) => {
          const Icon = socialIcons[social.platform];
          const external = isExternalHref(social.href);
          return (
            <li key={`${social.platform}-${social.label}`}>
              <m.a
                {...linkProps(social.href)}
                aria-label={external ? `${social.label} (nouvel onglet)` : social.label}
                title={social.label}
                className="group relative grid size-12 place-items-center rounded-full glass text-ink/85 transition-colors duration-300 hover:text-ink"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.92 }}
                transition={SPRING}
              >
                {/* Halo individuel au survol */}
                <span
                  aria-hidden="true"
                  className="absolute -inset-1 -z-10 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle, color-mix(in oklab, var(--accent-via) 70%, transparent), transparent 70%)",
                  }}
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full opacity-0 ring-1 ring-white/25 transition-opacity duration-300 group-hover:opacity-100"
                />
                <Icon className="relative size-[1.2rem]" />
              </m.a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
