import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import {
  accessibleTitle,
  hasPartnerLink,
  InkBackdrop,
  InkEyebrow,
  partnerLinkProps,
  spokenName,
  Wordmark,
} from "@/components/partners/shared";
import type { PartnerModel } from "@/lib/site";
import { frTypo } from "@/lib/typo";

/**
 * Bandeau d’un grand partenaire : même matière d’encre que l’encart principal, en format bas (surtitre, nom en
 * capitales espacées, présentation facultative, pastille fléchée). Tout le bandeau mène au site du partenaire.
 * Contenu sans position propre et calques derrière (`isolate` + `-z-10`) : le lien étiré couvre tout le bandeau.
 */
export function GrandBand({
  model,
  href,
  titleAs: Title = "h3",
  eyebrow,
  showDescription = false,
}: {
  model: PartnerModel;
  href: string;
  titleAs?: "h3" | "h4";
  eyebrow?: string;
  showDescription?: boolean;
}) {
  const { key, partner, schedId } = model;
  const titleId = `${key}-titre`;
  const linked = hasPartnerLink(partner.href);

  return (
    <article
      data-sched={schedId}
      aria-labelledby={titleId}
      className="group @container relative isolate overflow-hidden rounded-[1.3rem] bg-[#1E1514] text-[#FAF7F4] shadow-[var(--card-lift)] transition-[translate,box-shadow] duration-500 ease-[var(--ease-out-expo)] forced-color-adjust-none hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 forced-colors:border"
    >
      <InkBackdrop
        behind
        glow="bg-[radial-gradient(90%_140%_at_0%_0%,rgb(255_255_255/0.07),transparent_60%),radial-gradient(70%_160%_at_100%_100%,rgb(126_33_27/0.62),transparent_70%)]"
        filet="inset-1.5 rounded-[1.05rem]"
      />

      <div className="flex items-center gap-3 py-4 pr-4 pl-5">
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <div className="mb-2.5">
              <InkEyebrow align="start">{eyebrow}</InkEyebrow>
            </div>
          ) : null}
          <Title id={titleId} translate="no" className="sr-only">
            {accessibleTitle(partner.name, partner.descriptor)}
          </Title>
          {partner.logo ? (
            <Image src={partner.logo.src} alt="" sizes="200px" className="block h-auto max-h-9 w-auto max-w-[12rem]" />
          ) : (
            <Wordmark name={partner.name} descriptor={partner.descriptor} size="sm" />
          )}
          {showDescription && partner.description ? (
            <p className="mt-2.5 text-[0.75rem] leading-snug text-pretty text-[#E2D3CC]">
              {frTypo(partner.description)}
            </p>
          ) : null}
        </div>

        {linked ? (
          <a
            {...partnerLinkProps(href)}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-[rgb(250_247_244/0.08)] text-[#FAF7F4] ring-1 ring-[rgb(201_169_162/0.35)] transition-[background-color] duration-500 group-hover:bg-[rgb(250_247_244/0.14)] after:absolute after:inset-0 after:z-10 after:rounded-[1.3rem] after:content-[''] forced-colors:border"
          >
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
            <span className="sr-only">
              {frTypo(partner.cta ?? "Découvrir")}
              <span translate="no"> : {spokenName(partner.name)}</span> (nouvel onglet)
            </span>
          </a>
        ) : null}
      </div>
    </article>
  );
}
