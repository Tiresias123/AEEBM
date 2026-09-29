import { Monogram } from "@/components/brand/Monogram";
import { VerifiedBadge } from "@/components/brand/VerifiedBadge";
import { BulletLine } from "@/components/BulletLine";
import { StaggerItem } from "@/components/motion";
import type { AssociationConfig } from "@/config/types";

export function ProfileHeader({ association }: { association: AssociationConfig }) {
  return (
    <header className="flex flex-col items-center text-center">
      <StaggerItem variant="pop" className="relative">
        <div className="relative size-[7.25rem] sm:size-[7.75rem]">
          {/* Halo diffus */}
          <div className="avatar-ring absolute -inset-3 animate-spin-slow rounded-full opacity-50 blur-2xl" />
          {/* Anneau satiné */}
          <div className="avatar-ring absolute inset-0 animate-spin-slow rounded-full" />
          {/* Liseré sombre entre l’anneau et le disque */}
          <div className="absolute inset-[3px] rounded-full bg-bg p-[3px]">
            <Monogram className="size-full" title={`Monogramme ${association.acronym}`} />
          </div>
        </div>
      </StaggerItem>

      <StaggerItem className="mt-6">
        <h1 className="flex items-center justify-center gap-2 font-display-name text-[length:calc(1.95rem*var(--display-scale))] leading-none text-ink">
          <span>{association.acronym}</span>
          <span className="sr-only">, {association.displayName}</span>
          {association.verified.enabled ? (
            <VerifiedBadge label={association.verified.label} className="size-[1.4rem]" />
          ) : null}
        </h1>
      </StaggerItem>

      <StaggerItem className="mt-2.5">
        <p className="text-[0.95rem] font-medium tracking-[-0.005em]">
          <BulletLine text={association.tagline} segmentClassName="text-gradient-subtitle" />
        </p>
      </StaggerItem>

      <StaggerItem className="mt-3">
        <p className="mx-auto max-w-[23rem] text-[0.875rem] leading-relaxed text-soft/90">
          <BulletLine text={association.bio} />
        </p>
      </StaggerItem>
    </header>
  );
}
