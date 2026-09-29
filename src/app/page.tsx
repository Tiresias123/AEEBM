import { AlertBanner, AlertBannerPill } from "@/components/AlertBanner";
import { BackgroundGlow } from "@/components/BackgroundGlow";
import { SocialIcon } from "@/components/brand/BrandIcons";
import { Enter } from "@/components/Enter";
import { Footer } from "@/components/Footer";
import { LinkCard } from "@/components/LinkCard";
import { MotionProvider } from "@/components/motion";
import { NewsletterCard } from "@/components/NewsletterCard";
import { ProfileHeader } from "@/components/ProfileHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { ShareModal } from "@/components/ShareModal";
import { SocialBar } from "@/components/SocialBar";
import { SpotlightCard } from "@/components/SpotlightCard";
import { siteConfig } from "@/config/links.config";
import { getIcon } from "@/lib/icons";
import { isPendingHref } from "@/lib/pending";
import { activeTheme, getPageModel, getSiteUrl, getSpotlightGradient } from "@/lib/site";
import { frTypo } from "@/lib/typo";

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
        className="fixed bottom-full left-3 z-50 rounded-full border border-white/15 bg-bg-elevated px-4 py-2 text-[0.8rem] font-semibold text-ink focus:top-[max(0.75rem,env(safe-area-inset-top))] focus:bottom-auto focus:shadow-[0_10px_30px_-10px_rgb(0_0_0/0.9)]"
      >
        Aller au contenu principal
      </a>
      <BackgroundGlow />
      <MotionProvider>
        <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[30rem] flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 lg:my-12 lg:min-h-0 lg:rounded-[2.25rem] lg:border lg:border-white/[0.06] lg:bg-white/[0.018] lg:px-8 lg:pt-8 lg:pb-10 lg:shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)]">
          {banner ? (
            <AlertBanner
              id={banner.id}
              tone={banner.tone}
              label={banner.label}
              message={frTypo(banner.message)}
              link={bannerLink}
            />
          ) : null}

          <header className="relative pt-3">
            {banner ? (
              // Pastille bornée à l’espace à gauche de l’avatar (rayon 58 px + pastille 22 px, marge de sécurité).
              <div className="absolute top-0 left-0 z-20 max-w-[calc(50%-2.875rem)] sm:max-w-none">
                <AlertBannerPill id={banner.id} tone={banner.tone} label={banner.label} />
              </div>
            ) : null}
            <Enter index={0} className="absolute top-0 right-0 z-20">
              <ShareModal
                url={siteUrl}
                title={association.acronym}
                text={`${association.acronym} · ${association.displayName}`}
                qrLogoSrc="/qr-logo.svg"
                qrColor={activeTheme.qrColor}
                qrCaptionColor={activeTheme.qrCaptionColor}
              />
            </Enter>
            <ProfileHeader association={association} />
          </header>

          <Enter index={4} className="mt-6">
            <SocialBar items={socialItems} />
          </Enter>

          <main id="contenu" tabIndex={-1} className="mt-8 flex flex-col outline-none">
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
                icon={<SpotlightIcon aria-hidden="true" className="size-6" strokeWidth={1.9} />}
              />
            ) : null}

            {sections.map((section) => (
              <section
                key={section.id}
                data-sched={section.schedId}
                aria-labelledby={section.title ? `section-${section.id}` : undefined}
                aria-label={section.title ? undefined : "Liens"}
                className="mt-8"
              >
                {section.title ? (
                  <SectionHeading id={`section-${section.id}`} title={section.title} enterIndex={next()} />
                ) : null}
                <ul className="mt-3 flex flex-col gap-3">
                  {section.links.map(({ key, link, schedId, badgeSchedId }) => {
                    const Icon = getIcon(link.icon);
                    return (
                      <li key={key} data-sched={schedId}>
                        <LinkCard
                          title={link.title}
                          subtitle={frTypo(link.subtitle)}
                          href={link.href}
                          category={link.category}
                          pending={isPendingHref(link.href)}
                          badge={
                            link.badge
                              ? { label: link.badge.label, tone: link.badge.tone, schedId: badgeSchedId }
                              : undefined
                          }
                          enterIndex={next()}
                          icon={
                            <Icon
                              aria-hidden="true"
                              className="size-[1.35rem] drop-shadow-[0_1px_1px_rgb(0_0_0/0.25)] forced-colors:drop-shadow-none"
                              strokeWidth={1.9}
                            />
                          }
                        />
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}

            {newsletter.enabled ? (
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
