import { ArrowUpRight } from "lucide-react";
import { hasPartnerLink, partnerLinkProps } from "@/components/partners/shared";
import type { PartnerModel } from "@/lib/site";
import { frTypo } from "@/lib/typo";

/**
 * Partenaires (niveau « soutien ») de la page des partenaires : bloc groupé en verre, comme les liens de la
 * section « Représentation » ; nom en capitales espacées, complément, présentation, flèche.
 */
export function SupportList({ items }: { items: PartnerModel[] }) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-[1.25rem] glass forced-colors:border">
      {items.map(({ key, partner, links, schedId }) => {
        const content = (
          <>
            <span className="min-w-0 flex-1">
              <span
                translate="no"
                className="block text-[0.8rem] leading-snug font-medium tracking-[0.14em] text-ink uppercase"
              >
                {partner.name}
              </span>
              {partner.descriptor ? (
                <span className="mt-1 block text-[0.6rem] leading-none tracking-[0.3em] text-muted uppercase">
                  {partner.descriptor}
                </span>
              ) : null}
              {partner.description ? (
                <span className="mt-2 block text-[0.75rem] leading-snug text-pretty text-soft">
                  {frTypo(partner.description)}
                </span>
              ) : null}
            </span>
            {hasPartnerLink(partner.href) ? (
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 shrink-0 text-muted transition-[translate,color] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
              />
            ) : null}
          </>
        );
        return (
          <li key={key} data-sched={schedId}>
            {hasPartnerLink(partner.href) ? (
              <a
                {...partnerLinkProps(links.page)}
                className="group flex items-center gap-3.5 px-4 py-3.5 transition-colors duration-300 hover:bg-fill-hover focus-visible:bg-fill-hover"
              >
                {content}
                <span className="sr-only"> (nouvel onglet)</span>
              </a>
            ) : (
              <div className="flex items-center gap-3.5 px-4 py-3.5">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
