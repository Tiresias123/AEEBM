import { clsx } from "clsx";
import { Mail } from "lucide-react";
import type { PartnersJoinConfig } from "@/config/types";
import { frTypo } from "@/lib/typo";

/**
 * Miniature d’un niveau, dans l’ordre de la configuration : encart (encre et papier), bandeau d’encre, puis
 * présentation sur papier (lignes de texte). Décorative : le nom du niveau suit en toutes lettres.
 */
function TierSwatch({ index }: { index: number }) {
  const frame = "flex h-7 w-9 shrink-0 flex-col overflow-hidden rounded-md ring-1 forced-colors:border";
  if (index === 0) {
    return (
      <span aria-hidden="true" className={clsx(frame, "ring-line-strong")}>
        <span className="flex h-[58%] items-center justify-center bg-[#1E1514]">
          <span className="h-px w-4 bg-[#C9A9A2]" />
        </span>
        <span className="flex flex-1 items-center justify-center bg-bg-elevated">
          <span className="h-[3px] w-3 rounded-full bg-[color-mix(in_oklab,var(--cta-from)_80%,transparent)]" />
        </span>
      </span>
    );
  }
  if (index === 1) {
    return (
      <span
        aria-hidden="true"
        className={clsx(frame, "items-start justify-center gap-1 bg-[#1E1514] pl-1.5 ring-[rgb(201_169_162/0.5)]")}
      >
        <span className="h-px w-5 bg-[#FAF7F4]" />
        <span className="h-px w-3 bg-[#C9A9A2]" />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={clsx(frame, "items-start justify-center gap-1 bg-bg-elevated pl-1.5 ring-line-strong")}
    >
      <span className="h-px w-5 bg-ink/60" />
      <span className="h-px w-3.5 bg-ink/30" />
      <span className="h-px w-4 bg-ink/30" />
    </span>
  );
}

/** Bloc « Devenir partenaire » : accroche, niveaux de visibilité, bouton de contact (courriel prérempli). */
export function JoinCard({ join }: { join: PartnersJoinConfig }) {
  return (
    <div className="rounded-[1.4rem] card-highlight px-5 pt-6 pb-5 text-center forced-colors:border">
      <p className="mx-auto max-w-[20rem] font-display-name text-[length:calc(1.3rem*var(--display-scale))] leading-[1.15] text-balance text-heading [text-shadow:var(--emboss)]">
        {frTypo(join.heading)}
      </p>
      <p className="mx-auto mt-2.5 max-w-[22rem] text-[0.8rem] leading-relaxed text-balance text-soft">
        {frTypo(join.text)}
      </p>

      <ul className="mt-5 space-y-2 text-left">
        {join.tiers.map((tier, index) => (
          <li
            key={tier.name}
            className="flex items-center gap-3.5 rounded-2xl bg-fill-hover px-3.5 py-3 ring-1 ring-line"
          >
            <TierSwatch index={index} />
            <span className="min-w-0">
              <span className="block text-[0.82rem] leading-tight font-medium text-ink">{frTypo(tier.name)}</span>
              <span className="mt-0.5 block text-[0.74rem] leading-snug text-pretty text-soft">
                {frTypo(tier.text)}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <a
        href={join.href}
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-cta-gradient px-5 text-[0.8rem] font-semibold tracking-[0.02em] text-on-accent shadow-[inset_0_1px_0_0_rgb(255_255_255/0.2),0_12px_24px_-14px_var(--cta-from)] transition-shadow duration-500 hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.2),0_16px_30px_-14px_var(--cta-from)] forced-colors:border"
      >
        <Mail aria-hidden="true" className="size-4" />
        {frTypo(join.cta)}
      </a>
      {join.note ? (
        <p className="mx-auto mt-3.5 max-w-[21rem] text-[0.68rem] leading-snug text-balance text-muted">
          {frTypo(join.note)}
        </p>
      ) : null}
    </div>
  );
}
