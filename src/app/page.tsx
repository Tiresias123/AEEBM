import { AlertBanner, AlertBannerPill } from "@/components/AlertBanner";
import { BackgroundGlow } from "@/components/BackgroundGlow";
import { Ornament } from "@/components/brand/Ornament";
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
        <div className="support relative z-10 mx-auto flex min-h-dvh w-full flex-col surface px-[max(1rem,calc(50%-14rem))] pt-[max(1rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] sm:my-10 sm:min-h-0 sm:max-w-[30rem] sm:px-7 sm:pt-7 sm:pb-10">
          {banner ? (
            <AlertBanner
              id={banner.id}
              tone={banner.tone}
              label={banner.label}
              message={frTypo(banner.message)}
              date={banner.date ? (dateTile(banner.date) ?? undefined) : undefined}
              link={bannerLink}
            />
          ) : null}

          <header className="relative pt-5">
            {banner ? (
              // Pastille bornée à l’espace à gauche de l’avatar ; plancher en rem pour rester lisible avec le texte agrandi.
              <div className="absolute top-0 left-0 z-20 max-w-[max(calc(50%-2.875rem),5.5rem)] sm:max-w-none">
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

            {sections.map((section) => (
              <section
                key={section.id}
                data-sched={section.schedId}
                aria-labelledby={section.title ? `section-${section.id}` : undefined}
                aria-label={section.title ? undefined : "Liens"}
                className="mt-9"
              >
                {section.title ? (
                  <SectionHeading id={`section-${section.id}`} title={section.title} enterIndex={next()} />
                ) : null}
                <ul className="mt-3 flex flex-col gap-2.5">
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
                          icon={<Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />}
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
