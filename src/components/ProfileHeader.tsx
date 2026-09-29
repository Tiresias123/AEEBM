import { BulletLine } from "@/components/BulletLine";
import { Enter } from "@/components/Enter";
import { Seal, SealWaves } from "@/components/brand/Seal";
import { VerifiedBadge } from "@/components/brand/VerifiedBadge";
import type { AssociationConfig } from "@/config/types";
import { getIcon } from "@/lib/icons";
import { activeTheme } from "@/lib/site";
import { frTypo, stripEmoji } from "@/lib/typo";

/** Piliers de la bio : un segment par « • », avec son icône (sinon, la bio s’affiche en une ligne à puces). */
function getPillars(association: AssociationConfig) {
  const labels = stripEmoji(association.bio)
    .split("•")
    .map((part) => part.trim())
    .filter(Boolean);
  const icons = association.bioIcons ?? [];
  if (labels.length === 0 || labels.length > 4 || icons.length !== labels.length) return null;
  return labels.map((label, index) => ({ label: frTypo(label), Icon: getIcon(icons[index]) }));
}

/**
 * En-tête : sceau (monogramme, gravure guillochée, inscription circulaire) sur les ondes du cercle ouvert,
 * nom et pastille de vérification, accroche, puis les piliers de l’Association.
 */
export function ProfileHeader({ association }: { association: AssociationConfig }) {
  const open = activeTheme.avatarRing === "open";
  const pillars = getPillars(association);

  return (
    <div className="flex flex-col items-center text-center">
      {/* Ondes centrées sur le sceau (hors de toute animation d’entrée : elles restent sous le contenu). */}
      <SealWaves
        open={open}
        className="pointer-events-none absolute top-[calc(1.25rem+5.75rem)] left-1/2 -z-10 size-[45rem] -translate-x-1/2 -translate-y-1/2 text-heading sm:top-[calc(1.25rem+6.25rem)]"
      />

      <Enter index={0} className="relative">
        <Seal
          top={association.seal?.top ?? ""}
          bottom={association.seal?.bottom ?? ""}
          open={open}
          monogramLabel={`Monogramme ${association.acronym}`}
        />
      </Enter>

      <Enter index={1} className="mt-5 flex items-center justify-center gap-2.5">
        <h1 className="font-display-name text-[length:calc(2.25rem*var(--display-scale))] leading-none text-ink [text-shadow:var(--emboss)]">
          {association.acronym}
          <span className="sr-only">, {association.displayName}</span>
        </h1>
        {association.verified.enabled ? (
          <VerifiedBadge label={association.verified.label} className="size-[1.45rem]" />
        ) : null}
      </Enter>

      <Enter index={2} className="mt-3 w-full">
        <p className="text-[clamp(0.8rem,3.55vw,0.95rem)] font-medium tracking-[-0.01em]">
          <BulletLine text={association.tagline} gradient />
        </p>
      </Enter>

      <Enter index={3} className="mt-6 w-full">
        {pillars ? (
          <ul
            aria-label="Mission de l’Association"
            className="mx-auto grid max-w-[25rem] divide-x divide-line"
            style={{ gridTemplateColumns: `repeat(${pillars.length}, minmax(0, 1fr))` }}
          >
            {pillars.map(({ label, Icon }) => (
              <li key={label} className="flex flex-col items-center gap-2 px-2">
                <span className="grid size-10 place-items-center rounded-full bg-fill text-heading shadow-[var(--card-shadow)] ring-1 ring-line">
                  <Icon aria-hidden="true" className="size-[1.15rem]" strokeWidth={1.6} />
                </span>
                <span className="text-[0.75rem] leading-snug font-medium text-balance text-soft">{label}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mx-auto max-w-[23rem] text-[clamp(0.8125rem,3.5vw,0.875rem)] leading-relaxed text-soft/90">
            <BulletLine text={association.bio} />
          </p>
        )}
      </Enter>
    </div>
  );
}
