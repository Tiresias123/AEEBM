import { Handshake } from "lucide-react";
import { PageSwitch } from "@/components/PageSwitch";
import { GrandBand } from "@/components/partners/GrandBand";
import { OpenSlotRow } from "@/components/partners/OpenSlotRow";
import { PrincipalCard } from "@/components/partners/PrincipalCard";
import { Disclosure } from "@/components/partners/shared";
import type { PartnersModel } from "@/lib/site";
import { frTypo } from "@/lib/typo";

/** Vrai si le bloc de la page d’accueil a quelque chose à montrer. */
export function hasFeaturedPartners(partners: PartnersModel): boolean {
  const { principal, grand, openSlots } = partners.featured;
  return principal.length + grand.length + openSlots > 0;
}

/**
 * Bloc des partenaires de la page d’accueil (posé entre deux filets ornés, au-dessus du logo de l’Association) :
 * espace réservé aux trois plus grands partenaires. Titre, mot de remerciement et micro-bulle vers la page des
 * partenaires, puis l’encart du partenaire principal, les bandeaux des grands partenaires et, s’il en reste,
 * les places disponibles ; mention publicitaire en pied.
 */
export function PartnerShowcase({ partners }: { partners: PartnersModel }) {
  const { config, featured } = partners;
  return (
    <section aria-labelledby="partenaires">
      <h2
        id="partenaires"
        className="flex items-center justify-center gap-3 font-display text-[0.75rem] font-semibold tracking-[0.2em] text-heading uppercase sm:text-[0.8125rem]"
      >
        <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-transparent to-line-strong" />
        <span className="[margin-right:-0.2em]">{config.title}</span>
        <span aria-hidden="true" className="h-px w-8 bg-gradient-to-l from-transparent to-line-strong" />
      </h2>
      {config.intro ? (
        <p className="mx-auto mt-3 max-w-[21rem] text-center text-[0.8rem] leading-relaxed text-balance text-soft">
          {frTypo(config.intro)}
        </p>
      ) : null}
      <div className="mt-3.5 flex justify-center">
        <PageSwitch href="/partenaires" label={config.linkLabel} icon={<Handshake strokeWidth={1.75} />} />
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {featured.principal.map((model) => (
          <PrincipalCard key={model.key} model={model} href={model.links.home} eyebrow="Partenaire principal" />
        ))}
        {featured.grand.map((model) => (
          <GrandBand key={model.key} model={model} href={model.links.home} eyebrow="Grand partenaire" />
        ))}
        {featured.openSlots > 0 ? (
          <OpenSlotRow
            count={featured.openSlots}
            text={config.openSlotText}
            href="/partenaires#devenir-partenaire"
            eyebrow="Grand partenaire"
          />
        ) : null}
      </div>

      {config.disclosure ? <Disclosure text={config.disclosure} className="mt-3" /> : null}
    </section>
  );
}
