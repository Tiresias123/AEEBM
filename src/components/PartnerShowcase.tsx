import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Fragment } from "react";
import type { PartnerConfig } from "@/config/types";
import { linkProps } from "@/lib/links";
import { guillocheRibbon } from "@/lib/seal";
import type { PartnerModel, PartnersModel } from "@/lib/site";
import { frTypo } from "@/lib/typo";

/** Rel des liens commandités (signalés comme tels aux moteurs de recherche). */
const SPONSORED_REL = "sponsored noopener noreferrer";

/** Liens sortants de partenaire : nouvel onglet, rel « sponsored ». */
function partnerLinkProps(href: string) {
  const props = linkProps(href);
  return props.rel ? { ...props, rel: SPONSORED_REL } : props;
}

/** Nom lu par les lecteurs d’écran : « Jolicoeur | Lapierre » devient « Jolicoeur Lapierre ». */
function spokenName(name: string): string {
  return name.replace(/\s*\|\s*/g, " ");
}

/*
 * Ruban guilloché du bandeau (bande de sécurité des billets et des chèques, en écho au sceau de l’en-tête) :
 * deux familles de sinusoïdes croisées, tracées au rendu serveur.
 */
const RIBBON = [
  ...guillocheRibbon({ width: 400, cy: 80, amplitude: 40, period: 200, strands: 9 }),
  ...guillocheRibbon({ width: 400, cy: 80, amplitude: 22, period: 100, strands: 9, offset: Math.PI / 9 }),
];

/**
 * Nom du partenaire composé en capitales espacées, à la manière de son logotype : la barre verticale du nom
 * (« Jolicoeur | Lapierre ») devient un filet, le complément (« Gestion financière ») passe dessous.
 */
function Wordmark({ name, descriptor }: { name: string; descriptor?: string }) {
  const parts = name.split("|").map((part) => part.trim());
  return (
    <span aria-hidden="true" translate="no" className="flex flex-col items-center">
      <span className="[margin-right:-0.24em] flex items-center text-[clamp(0.78rem,5.1cqi,1.06rem)] leading-none font-medium tracking-[0.24em] whitespace-nowrap uppercase">
        {parts.map((part, index) => (
          <Fragment key={index}>
            {/* Filet centré : l’espacement des lettres prolonge déjà le mot précédent de 0,24 em. */}
            {index > 0 ? <span className="mr-[0.75em] ml-[0.51em] h-[1.15em] w-px bg-current opacity-55" /> : null}
            {part}
          </Fragment>
        ))}
      </span>
      {descriptor ? (
        <span className="mt-2.5 [margin-right:-0.42em] flex items-center gap-2.5 text-[clamp(0.5rem,2.75cqi,0.6rem)] leading-none tracking-[0.42em] text-[#E2D3CC] uppercase">
          <span className="h-px w-5 bg-current opacity-50" />
          {descriptor}
          <span className="[margin-left:-0.42em] h-px w-5 bg-current opacity-50" />
        </span>
      ) : null}
    </span>
  );
}

/**
 * Encart du partenaire principal : bandeau d’encre (nom en capitales espacées sur ruban guilloché, signature
 * en Cormorant) puis volet papier (titre, présentation, domaines, bouton). Toute la carte mène au site du
 * partenaire ; le bouton porte le nom accessible du lien.
 */
function PrincipalCard({ id, partner, schedId }: { id: string; partner: PartnerConfig; schedId?: string }) {
  const cta = partner.cta ?? "Découvrir";
  return (
    <article
      data-sched={schedId}
      aria-labelledby={id}
      className="group relative isolate overflow-hidden rounded-[1.6rem] lift transition-[translate,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 forced-colors:border"
    >
      {/* Bandeau d’encre */}
      <div className="@container relative overflow-hidden bg-[#1E1514] px-5 pt-9 pb-8 text-center text-[#FAF7F4] forced-color-adjust-none">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_0%,rgb(255_255_255/0.08),transparent_62%),radial-gradient(85%_70%_at_50%_125%,rgb(126_33_27/0.7),transparent_72%)]"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 400 160"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 size-full [mask-image:linear-gradient(90deg,transparent,black_18%,black_82%,transparent)] text-[#C9A9A2] opacity-[0.17] transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:-translate-x-2 motion-reduce:transition-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
        >
          {RIBBON.map((d, index) => (
            <path key={index} d={d} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 rounded-[1.15rem] border border-[rgb(201_169_162/0.22)]"
        />

        <div className="relative">
          <h3 id={id} translate="no" className="sr-only">
            {[spokenName(partner.name), partner.descriptor].filter(Boolean).join(" ")}
          </h3>
          {partner.logo ? (
            <Image
              src={partner.logo.src}
              alt=""
              sizes="240px"
              className="mx-auto block h-auto max-h-14 w-auto max-w-[min(15rem,80%)]"
            />
          ) : (
            <Wordmark name={partner.name} descriptor={partner.descriptor} />
          )}
          {partner.tagline ? (
            <p className="mt-4 font-display-name text-[length:calc(1.5rem*var(--display-scale))] leading-none text-[#D9BDB6]">
              {frTypo(partner.tagline)}
            </p>
          ) : null}
        </div>
      </div>

      {/* Volet papier */}
      {/* Sans position propre : le lien étiré du bouton couvre ainsi toute la carte, bandeau compris. */}
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

        <a
          {...partnerLinkProps(partner.href)}
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-cta-gradient px-5 text-[0.8rem] font-semibold tracking-[0.02em] text-on-accent shadow-[inset_0_1px_0_0_rgb(255_255_255/0.2),0_12px_24px_-14px_var(--cta-from)] transition-shadow duration-500 group-hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.2),0_16px_30px_-14px_var(--cta-from)] after:absolute after:inset-0 after:z-10 after:rounded-[1.6rem] after:content-[''] forced-colors:border"
        >
          {frTypo(cta)}
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

        {partner.legal ? (
          <p className="mt-4 text-[0.65rem] leading-snug text-balance text-muted">
            {/* Une mention par ligne (raison sociale, puis statut) : aucune coupure au milieu d’une mention. */}
            {frTypo(partner.legal)
              .split(" · ")
              .map((part, index) => (
                <span key={index} className="block">
                  {index > 0 ? <span className="sr-only"> · </span> : null}
                  {part}
                </span>
              ))}
          </p>
        ) : null}
      </div>
    </article>
  );
}

/** Partenaires de soutien : noms en petites capitales, liés à leur site. */
function SupportRow({ items }: { items: PartnerModel[] }) {
  return (
    <div className="mt-6 text-center">
      <p className="text-[0.65rem] tracking-[0.2em] text-muted uppercase">Avec le soutien de</p>
      <ul className="mt-2.5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {items.map(({ key, partner, schedId }) => (
          <li key={key} data-sched={schedId}>
            <a
              {...partnerLinkProps(partner.href)}
              className="inline-flex min-h-8 items-center rounded px-1 text-[0.72rem] font-medium tracking-[0.14em] text-soft uppercase transition-colors hover:text-heading"
            >
              {partner.logo ? (
                <Image src={partner.logo.src} alt={partner.logo.alt} sizes="120px" className="h-6 w-auto" />
              ) : (
                partner.name
              )}
              <span className="sr-only"> (nouvel onglet)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Bloc des partenaires (posé par la page entre deux filets ornés, au-dessus du logo de l’Association) : mention
 * de partenariat (transparence publicitaire), encart du partenaire principal, puis partenaires de soutien.
 */
export function PartnerShowcase({ partners }: { partners: PartnersModel }) {
  return (
    <section aria-labelledby="partenaires">
      <h2
        id="partenaires"
        className="flex items-center justify-center gap-3 font-display text-[0.75rem] font-semibold tracking-[0.2em] text-heading uppercase sm:text-[0.8125rem]"
      >
        <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-transparent to-line-strong" />
        <span className="[margin-right:-0.2em]">{partners.label}</span>
        <span aria-hidden="true" className="h-px w-8 bg-gradient-to-l from-transparent to-line-strong" />
      </h2>
      {partners.principal.length ? (
        <div className="mt-4 flex flex-col gap-4">
          {partners.principal.map(({ key, partner, schedId }) => (
            <PrincipalCard key={key} id={key} partner={partner} schedId={schedId} />
          ))}
        </div>
      ) : null}
      {partners.disclosure ? (
        <p className="mx-auto mt-3 max-w-[22rem] text-center text-[0.65rem] leading-relaxed text-balance text-muted">
          {frTypo(partners.disclosure)}
        </p>
      ) : null}
      {partners.soutien.length ? <SupportRow items={partners.soutien} /> : null}
    </section>
  );
}
