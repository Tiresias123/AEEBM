import { BulletLine } from "@/components/BulletLine";
import { Enter } from "@/components/Enter";
import { Monogram } from "@/components/brand/Monogram";
import { VerifiedBadge } from "@/components/brand/VerifiedBadge";
import type { AssociationConfig } from "@/config/types";

/** Avatar à anneau fin, nom, pastille de vérification, accroche et biographie. */
export function ProfileHeader({ association }: { association: AssociationConfig }) {
  return (
    <div className="flex flex-col items-center text-center">
      <Enter index={0} className="relative">
        <div className="relative size-[7rem] sm:size-[7.5rem]">
          {/* Anneau satiné (ouvert dans le thème « bordeaux ») */}
          <div aria-hidden="true" className="avatar-ring-frame absolute inset-0 rounded-full">
            <div className="avatar-ring size-full rounded-full" />
          </div>
          {/* Liseré sombre entre l’anneau et le disque */}
          <div className="absolute inset-[3px] rounded-full bg-bg p-[4px]">
            <Monogram className="size-full" label={`Monogramme ${association.acronym}`} />
          </div>
        </div>
      </Enter>

      <Enter index={1} className="mt-6 flex items-center justify-center gap-2">
        <h1 className="font-display-name text-[length:calc(1.95rem*var(--display-scale))] leading-none text-ink">
          {association.acronym}
          <span className="sr-only">, {association.displayName}</span>
        </h1>
        {association.verified.enabled ? (
          <VerifiedBadge label={association.verified.label} className="size-[1.4rem]" />
        ) : null}
      </Enter>

      <Enter index={2} className="mt-2.5 w-full">
        <p className="text-[clamp(0.8rem,3.55vw,0.95rem)] font-medium tracking-[-0.01em]">
          <BulletLine text={association.tagline} gradient />
        </p>
      </Enter>

      <Enter index={3} className="mt-3 w-full">
        <p className="mx-auto max-w-[23rem] text-[clamp(0.8125rem,3.5vw,0.875rem)] leading-relaxed text-soft/90">
          <BulletLine text={association.bio} />
        </p>
      </Enter>
    </div>
  );
}
