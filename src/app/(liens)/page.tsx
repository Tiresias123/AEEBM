import { Ornament } from "@/components/brand/Ornament";
import { Enter } from "@/components/Enter";
import { NewsletterCard } from "@/components/NewsletterCard";
import { hasFeaturedPartners, PartnerShowcase } from "@/components/PartnerShowcase";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionLinks } from "@/components/SectionLinks";
import { SpotlightCard } from "@/components/SpotlightCard";
import { siteConfig } from "@/config/links.config";
import { getIcon } from "@/lib/icons";
import { isPendingHref } from "@/lib/pending";
import { getPageModel, getSiteUrl, getSpotlightGradient, isNewsletterAvailable, type PartnerModel } from "@/lib/site";
import { frTypo } from "@/lib/typo";

/** Données structurées schema.org (Organisation) pour les moteurs de recherche. */
function OrganizationJsonLd({ siteUrl, sponsors }: { siteUrl: string; sponsors: PartnerModel[] }) {
  const { association, socials } = siteConfig;
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: association.acronym,
    alternateName: association.displayName,
    legalName: association.legalName,
    description: association.mission,
    url: siteUrl,
    logo: `${siteUrl}/icon-512.png`,
    email: association.email,
    foundingDate: association.foundingDate,
    address: {
      "@type": "PostalAddress",
      streetAddress: association.address.street,
      addressLocality: association.address.city,
      addressRegion: association.address.provinceCode,
      postalCode: association.address.postalCode,
      addressCountry: "CA",
    },
    identifier: { "@type": "PropertyValue", propertyID: "NEQ", value: association.neq },
    sameAs: socials.map((s) => s.href).filter((href) => href.startsWith("https://")),
    // Partenaires de la page d’accueil (adresse sans paramètres UTM).
    ...(sponsors.length
      ? {
          sponsor: sponsors.map(({ partner }) => ({
            "@type": "Organization",
            name: [partner.name, partner.descriptor].filter(Boolean).join(" "),
            url: partner.href,
          })),
        }
      : {}),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** Page de liens : contenu central du layout commun (lien vedette, sections, infolettre, grands partenaires). */
export default function HomePage() {
  const { newsletter } = siteConfig;
  const { sections, spotlight, partners } = getPageModel();
  const siteUrl = getSiteUrl();

  // Rang de chaque bloc dans l’entrée en cascade (l’en-tête du layout occupe les rangs 0 à 4).
  let order = 5;
  const next = () => order++;

  const SpotlightIcon = spotlight ? getIcon(spotlight.config.icon) : null;
  const featured = partners && hasFeaturedPartners(partners) ? partners : null;

  return (
    <>
      <main id="contenu" tabIndex={-1} className="mt-7 flex scroll-mt-16 flex-col outline-none">
        {spotlight && SpotlightIcon ? (
          <SpotlightCard
            title={spotlight.config.title}
            subtitle={frTypo(spotlight.config.subtitle)}
            href={spotlight.config.href}
            badge={spotlight.config.badge}
            gradient={getSpotlightGradient(spotlight.config)}
            pending={isPendingHref(spotlight.config.href)}
            schedId={spotlight.schedId}
            enterIndex={next()}
            icon={<SpotlightIcon aria-hidden="true" className="size-[1.4rem]" strokeWidth={1.75} />}
          />
        ) : null}

        {sections.map((section) => {
          const headingIndex = next();
          const enterStart = order;
          order += section.links.length;
          return (
            <section
              key={section.id}
              data-sched={section.schedId}
              aria-labelledby={section.title ? `section-${section.id}` : undefined}
              aria-label={section.title ? undefined : "Liens"}
              className="mt-10"
            >
              {section.title ? (
                <SectionHeading id={`section-${section.id}`} title={section.title} enterIndex={headingIndex} />
              ) : null}
              <SectionLinks layout={section.layout} links={section.links} enterStart={enterStart} />
            </section>
          );
        })}

        {isNewsletterAvailable() ? (
          <div className="mt-10">
            <NewsletterCard newsletter={newsletter} enterIndex={next()} />
          </div>
        ) : null}
      </main>

      {/* Grands partenaires : entre le filet ci-dessous et celui du pied de page, au-dessus du logo. */}
      {featured ? (
        <div data-sched={featured.featured.schedId}>
          <Enter index={next()} className="mt-14">
            <Ornament className="mb-8" />
            <PartnerShowcase partners={featured} />
          </Enter>
        </div>
      ) : null}

      <OrganizationJsonLd
        siteUrl={siteUrl}
        sponsors={featured ? [...featured.featured.principal, ...featured.featured.grand] : []}
      />
    </>
  );
}
