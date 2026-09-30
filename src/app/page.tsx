import { AlertBanner } from "@/components/AlertBanner";
import { BackgroundGlow } from "@/components/BackgroundGlow";
import { Ornament } from "@/components/brand/Ornament";
import { SocialIcon } from "@/components/brand/BrandIcons";
import { Enter } from "@/components/Enter";
import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/motion";
import { NewsletterCard } from "@/components/NewsletterCard";
import { ProfileHeader } from "@/components/ProfileHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionLinks } from "@/components/SectionLinks";
import { SocialBar } from "@/components/SocialBar";
import { SpotlightCard } from "@/components/SpotlightCard";
import { siteConfig } from "@/config/links.config";
import { getIcon } from "@/lib/icons";
import { isPendingHref } from "@/lib/pending";
import { getPageModel, getSiteUrl, getSpotlightGradient, isNewsletterAvailable } from "@/lib/site";
import { dateTile, frTypo } from "@/lib/typo";

/** Données structurées schema.org (Organisation) pour les moteurs de recherche. */
function OrganizationJsonLd({ siteUrl }: { siteUrl: string }) {
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
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default function HomePage() {
  const { association, socials, newsletter, footer } = siteConfig;
  const { sections, spotlight, banner } = getPageModel();
  const siteUrl = getSiteUrl();

  // Rang de chaque bloc dans l’entrée en cascade.
  let order = 5;
  const next = () => order++;

  const socialItems = socials.map((social) => ({
    href: social.href,
    label: social.label,
    pending: isPendingHref(social.href),
    icon: <SocialIcon name={social.icon ?? social.platform} className="relative size-[1.2rem]" />,
  }));

  const bannerLink = banner?.link && !isPendingHref(banner.link.href) ? banner.link : undefined;
  const SpotlightIcon = spotlight ? getIcon(spotlight.config.icon) : null;

  return (
    <>
      <a
        href="#contenu"
        className="fixed bottom-full left-3 z-50 rounded-full border border-line-strong bg-bg-elevated px-4 py-2 text-[0.8rem] font-semibold text-ink focus:top-[max(0.75rem,env(safe-area-inset-top))] focus:bottom-auto focus:shadow-[0_10px_30px_-10px_rgb(0_0_0/0.9)]"
      >
        Aller au contenu principal
      </a>
      <BackgroundGlow />
      <MotionProvider>
        <div className="support relative z-10 mx-4 mt-[max(1rem,env(safe-area-inset-top))] mb-[max(1rem,env(safe-area-inset-bottom))] flex min-h-[calc(100dvh-2rem)] flex-col surface px-[max(0.875rem,calc(50%-14rem))] pt-4 pb-8 sm:mx-auto sm:my-10 sm:min-h-0 sm:w-full sm:max-w-[30rem] sm:px-7 sm:pt-7 sm:pb-10">
          {banner ? (
            <AlertBanner
              tone={banner.tone}
              label={banner.label}
              message={frTypo(banner.message)}
              date={banner.date ? (dateTile(banner.date) ?? undefined) : undefined}
              link={bannerLink}
            />
          ) : null}

          <header className="relative pt-5">
            <ProfileHeader association={association} />
          </header>

          <Enter index={4} className="mt-7">
            <SocialBar items={socialItems} />
            <Ornament className="mt-8" />
          </Enter>

          <main id="contenu" tabIndex={-1} className="mt-7 flex flex-col outline-none">
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

          <Footer association={association} footer={footer} buildYear={new Date().getFullYear()} enterIndex={next()} />
        </div>
      </MotionProvider>
      <OrganizationJsonLd siteUrl={siteUrl} />
    </>
  );
}
