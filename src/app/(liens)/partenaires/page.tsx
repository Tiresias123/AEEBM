import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Enter } from "@/components/Enter";
import { PageSwitch } from "@/components/PageSwitch";
import { GrandBand } from "@/components/partners/GrandBand";
import { JoinCard } from "@/components/partners/JoinCard";
import { OpenSlotRow } from "@/components/partners/OpenSlotRow";
import { PrincipalCard } from "@/components/partners/PrincipalCard";
import { Disclosure } from "@/components/partners/shared";
import { SupportList } from "@/components/partners/SupportList";
import { SectionHeading } from "@/components/SectionHeading";
import { siteConfig } from "@/config/links.config";
import { socialMetadata } from "@/lib/metadata";
import { FEATURED_GRAND_SLOTS, getPageModel } from "@/lib/site";
import { frTypo } from "@/lib/typo";

const { acronym } = siteConfig.association;
const page = siteConfig.partners?.page;
const TITLE = page?.title ?? "Nos partenaires";
const DESCRIPTION = page?.description ?? `Les partenaires de l’${acronym}.`;

export const metadata: Metadata = {
  title: "Partenaires",
  description: DESCRIPTION,
  alternates: { canonical: "/partenaires" },
  ...socialMetadata("/partenaires", `Partenaires · ${acronym}`, DESCRIPTION),
};

function Group({
  id,
  title,
  enterIndex,
  children,
}: {
  id: string;
  title: string;
  enterIndex: number;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mt-10 scroll-mt-6">
      <SectionHeading id={id} title={title} enterIndex={enterIndex} as="h3" />
      <Enter index={enterIndex + 1} className="mt-3 flex flex-col gap-3">
        {children}
      </Enter>
    </section>
  );
}

/**
 * Page des partenaires : même layout que la page de liens (fond, support, en-tête, pied de page) ; seul le contenu
 * central change. Remerciement, partenaires par niveau, bloc « Devenir partenaire », mention publicitaire.
 */
export default function PartnersPage() {
  const { partners } = getPageModel();
  const config = siteConfig.partners;
  const all = partners?.all ?? { principal: [], grand: [], soutien: [] };
  const openSlots =
    config?.showOpenSlots && config.page.join ? Math.max(0, FEATURED_GRAND_SLOTS - all.grand.length) : 0;

  // Rang de chaque bloc dans l’entrée en cascade (l’en-tête du layout occupe les rangs 0 à 4).
  let order = 5;
  const next = (step = 1) => {
    const index = order;
    order += step;
    return index;
  };

  return (
    <main id="contenu" tabIndex={-1} className="mt-7 flex scroll-mt-16 flex-col outline-none">
      <Enter index={next()} className="flex justify-center">
        <PageSwitch href="/" label="Retour aux liens" icon={<ArrowLeft strokeWidth={2} />} back />
      </Enter>

      <Enter index={next()} className="mt-8 text-center">
        {config ? (
          <p className="text-[0.65rem] leading-none tracking-[0.3em] text-muted uppercase">
            <span className="[margin-right:-0.3em]">Saison {config.season}</span>
          </p>
        ) : null}
        <h2 className="mt-3 font-display-name text-[length:calc(2rem*var(--display-scale))] leading-none text-ink [text-shadow:var(--emboss)]">
          {TITLE}
        </h2>
        {page?.intro ? (
          <p className="mx-auto mt-4 max-w-[24rem] text-[0.85rem] leading-relaxed text-balance text-soft">
            {frTypo(page.intro)}
          </p>
        ) : null}
      </Enter>

      {all.principal.length ? (
        <Group id="partenaire-principal" title="Partenaire principal" enterIndex={next(2)}>
          {all.principal.map((model) => (
            <PrincipalCard key={model.key} model={model} href={model.links.page} titleAs="h4" />
          ))}
        </Group>
      ) : null}

      {all.grand.length || openSlots ? (
        <Group id="grands-partenaires" title="Grands partenaires" enterIndex={next(2)}>
          {all.grand.map((model) => (
            <GrandBand key={model.key} model={model} href={model.links.page} titleAs="h4" showDescription />
          ))}
          {openSlots ? <OpenSlotRow count={openSlots} text={config?.openSlotText} href="#devenir-partenaire" /> : null}
        </Group>
      ) : null}

      {all.soutien.length ? (
        <Group id="autres-partenaires" title="Partenaires" enterIndex={next(2)}>
          <SupportList items={all.soutien} />
        </Group>
      ) : null}

      {page?.join ? (
        <div id="devenir-partenaire" className="scroll-mt-6">
          <Group id="devenir-partenaire-titre" title={page.join.title} enterIndex={next(2)}>
            <JoinCard join={page.join} />
          </Group>
        </div>
      ) : null}

      {config?.disclosure ? (
        <Enter index={next()} className="mt-6">
          <Disclosure text={config.disclosure} />
        </Enter>
      ) : null}
    </main>
  );
}
