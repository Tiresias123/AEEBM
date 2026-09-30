import { clsx } from "clsx";
import { LinkCard, type LinkCardVariant } from "@/components/LinkCard";
import type { SectionLayout } from "@/config/types";
import { getIcon } from "@/lib/icons";
import { isPendingHref } from "@/lib/pending";
import type { LinkModel } from "@/lib/site";
import { frTypo } from "@/lib/typo";
import { enterStyle } from "@/lib/enter";

function Card({ model, variant, enterIndex }: { model: LinkModel; variant: LinkCardVariant; enterIndex?: number }) {
  const { link, badgeSchedId } = model;
  const Icon = getIcon(link.icon);
  return (
    <LinkCard
      variant={variant}
      title={link.title}
      subtitle={frTypo(link.subtitle)}
      href={link.href}
      category={link.category}
      pending={isPendingHref(link.href)}
      badge={link.badge ? { label: link.badge.label, tone: link.badge.tone, schedId: badgeSchedId } : undefined}
      enterIndex={enterIndex}
      icon={<Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />}
      watermark={variant === "feature" ? <Icon strokeWidth={1} /> : undefined}
    />
  );
}

/** Découpe les liens en suites : chaque lien mis en avant forme sa propre suite (mise en page « group »). */
function runs(links: LinkModel[]): LinkModel[][] {
  const out: LinkModel[][] = [];
  for (const model of links) {
    const last = out.at(-1);
    if (model.link.highlight || !last || last[0].link.highlight) out.push([model]);
    else last.push(model);
  }
  return out;
}

/**
 * Liens d’une section, disposés selon sa mise en page (voir SectionLayout). Les liens mis en avant
 * (`highlight`) prennent la carte soulignée de bordeaux dans toutes les mises en page.
 */
export function SectionLinks({
  layout,
  links,
  enterStart,
}: {
  layout: SectionLayout;
  links: LinkModel[];
  enterStart: number;
}) {
  const variantOf = (model: LinkModel, fallback: LinkCardVariant): LinkCardVariant =>
    model.link.highlight ? "highlight" : fallback;

  if (layout === "group") {
    return (
      <div className="mt-3 flex flex-col gap-2.5">
        {runs(links).map((run, index) =>
          run.length === 1 && run[0].link.highlight ? (
            <ul key={run[0].key}>
              <li data-sched={run[0].schedId}>
                <Card model={run[0]} variant="highlight" enterIndex={enterStart + index} />
              </li>
            </ul>
          ) : (
            <ul
              key={run[0].key}
              style={enterStyle(enterStart + index)}
              className="enter divide-y divide-line overflow-hidden rounded-[1.25rem] glass forced-colors:border"
            >
              {run.map((model) => (
                <li key={model.key} data-sched={model.schedId}>
                  <Card model={model} variant="grouped" />
                </li>
              ))}
            </ul>
          ),
        )}
      </div>
    );
  }

  if (layout === "bento" || layout === "tiles") {
    const compact = layout === "tiles";
    return (
      <ul className={clsx("mt-3 grid gap-2.5", compact && links.length % 3 === 0 ? "grid-cols-3" : "grid-cols-2")}>
        {links.map((model, index) => {
          // Bento : le premier lien occupe toute la largeur ; un dernier lien isolé aussi.
          const wide = !compact && (index === 0 || (index === links.length - 1 && (links.length - 1) % 2 === 1));
          const variant = variantOf(model, compact ? "compact" : index === 0 ? "feature" : wide ? "row" : "tile");
          return (
            <li
              key={model.key}
              data-sched={model.schedId}
              className={clsx((wide || variant === "highlight") && !compact && "col-span-2")}
            >
              <Card model={model} variant={variant} enterIndex={enterStart + index} />
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="mt-3 flex flex-col gap-2.5">
      {links.map((model, index) => (
        <li key={model.key} data-sched={model.schedId}>
          <Card model={model} variant={variantOf(model, "row")} enterIndex={enterStart + index} />
        </li>
      ))}
    </ul>
  );
}
