import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import {
  accessibleTitle,
  hasPartnerLink,
  InkBackdrop,
  InkEyebrow,
  LegalLines,
  partnerLinkProps,
  spokenName,
  Wordmark,
} from "@/components/partners/shared";
import type { PartnerModel } from "@/lib/site";
import { frTypo } from "@/lib/typo";

/**
 * Encart du partenaire principal : bandeau d’encre (surtitre, nom en capitales espacées sur ruban guilloché,
 * signature en Cormorant) puis volet papier (titre, présentation, domaines, bouton). Toute la carte mène au site
 * du partenaire : le bouton porte le nom accessible du lien et son pseudo-élément couvre la carte.
 */
export function PrincipalCard({
  model,
  href,
  titleAs: Title = "h3",
  eyebrow,
}: {
  model: PartnerModel;
  /** Lien du partenaire (avec les paramètres UTM de l’emplacement). */
  href: string;
  titleAs?: "h3" | "h4";
  /** Surtitre du bandeau (p. ex. « Partenaire principal »), omis quand un titre de section le dit déjà. */
  eyebrow?: string;
}) {
  const { key, partner, schedId } = model;
  const titleId = `${key}-titre`;
  const linked = hasPartnerLink(partner.href);

  return (
    <article
      data-sched={schedId}
      aria-labelledby={titleId}
      className="group relative isolate overflow-hidden rounded-[1.6rem] lift transition-[translate,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 forced-colors:border"
    >
      {/* Bandeau d’encre */}
      <div className="@container relative overflow-hidden bg-[#1E1514] px-5 pt-7 pb-8 text-center text-[#FAF7F4] forced-color-adjust-none">
        <InkBackdrop
          glow="bg-[radial-gradient(120%_85%_at_50%_0%,rgb(255_255_255/0.08),transparent_62%),radial-gradient(85%_70%_at_50%_125%,rgb(126_33_27/0.7),transparent_72%)]"
          filet="inset-2 rounded-[1.15rem]"
        />

        <div className="relative">
          {eyebrow ? (
            <div className="mb-5">
              <InkEyebrow>{eyebrow}</InkEyebrow>
            </div>
          ) : (
            <div className="h-2" />
          )}
          <Title id={titleId} translate="no" className="sr-only">
            {accessibleTitle(partner.name, partner.descriptor)}
          </Title>
          {partner.logo ? (
            <Image
              src={partner.logo.src}
              alt=""
              sizes="240px"
              className="mx-auto block h-auto max-h-14 w-auto max-w-[min(15rem,80%)]"
            />
          ) : (
            <Wordmark name={partner.name} descriptor={partner.descriptor} size="lg" />
          )}
          {partner.tagline ? (
            <p className="mt-4 font-display-name text-[length:calc(1.5rem*var(--display-scale))] leading-none text-[#D9BDB6]">
              {frTypo(partner.tagline)}
            </p>
          ) : null}
        </div>
      </div>

      {/* Volet papier, sans position propre : le lien étiré du bouton couvre ainsi toute la carte, bandeau compris. */}
      <div className="px-5 pt-6 pb-5 text-center">
        {partner.headline ? (
          <p className="mx-auto max-w-[19rem] font-display-name text-[length:calc(1.28rem*var(--display-scale))] leading-[1.15] text-balance text-heading [text-shadow:var(--emboss)]">
            {frTypo(partner.headline)}
          </p>
        ) : null}
        {partner.description ? (
          <p className="mx-auto mt-2.5 max-w-[21rem] text-[0.8rem] leading-relaxed text-pretty text-soft">
            {frTypo(partner.description)}
          </p>
        ) : null}

        {partner.services?.length ? (
          <ul aria-label="Domaines" className="mt-4 flex flex-wrap justify-center gap-1.5">
            {partner.services.map((service) => (
              <li
                key={service}
                className="rounded-full bg-fill-hover px-2.5 py-[0.3rem] text-[0.68rem] leading-none text-soft ring-1 ring-line"
              >
                {frTypo(service)}
              </li>
            ))}
          </ul>
        ) : null}

        {linked ? (
          <a
            {...partnerLinkProps(href)}
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-cta-gradient px-5 text-[0.8rem] font-semibold tracking-[0.02em] text-on-accent shadow-[inset_0_1px_0_0_rgb(255_255_255/0.2),0_12px_24px_-14px_var(--cta-from)] transition-shadow duration-500 group-hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.2),0_16px_30px_-14px_var(--cta-from)] after:absolute after:inset-0 after:z-10 after:rounded-[1.6rem] after:content-[''] forced-colors:border"
          >
            {frTypo(partner.cta ?? "Découvrir")}
            <span className="sr-only" translate="no">
              {" "}
              : {spokenName(partner.name)}
            </span>
            <span className="sr-only"> (nouvel onglet)</span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        ) : null}

        {partner.legal ? <LegalLines text={partner.legal} className="mt-4" /> : null}
      </div>
    </article>
  );
}
