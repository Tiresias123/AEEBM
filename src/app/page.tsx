import { AlertBanner } from "@/components/AlertBanner";
import { BackgroundGlow } from "@/components/BackgroundGlow";
import { Footer } from "@/components/Footer";
import { LinkCard } from "@/components/LinkCard";
import { MotionProvider, StaggerItem, StaggerRoot } from "@/components/motion";
import { NewsletterCard } from "@/components/NewsletterCard";
import { ProfileHeader } from "@/components/ProfileHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { ShareModal } from "@/components/ShareModal";
import { SocialBar } from "@/components/SocialBar";
import { SpotlightCard } from "@/components/SpotlightCard";
import { A_COMPLETER, siteConfig } from "@/config/links.config";
import { monogramSvg } from "@/lib/monogram-svg";
import { activeTheme, getSiteUrl, getVisibleSections } from "@/lib/site";

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
    sameAs: socials.map((s) => s.href).filter((href) => href.startsWith("https://") && href !== A_COMPLETER),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default function HomePage() {
  const { association, alertBanner, socials, spotlight, newsletter, footer } = siteConfig;
  const sections = getVisibleSections();
  const siteUrl = getSiteUrl();
  const qrLogoSvg = monogramSvg(
    {
      discFrom: activeTheme.colors.avatar.from,
      discTo: activeTheme.colors.avatar.to,
      ink: activeTheme.colors.onAccent,
    },
    2.6,
  );

  return (
    <>
      <BackgroundGlow />
      <MotionProvider>
        <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[30rem] flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 lg:my-12 lg:min-h-0 lg:rounded-[2.25rem] lg:border lg:border-white/[0.06] lg:bg-white/[0.018] lg:px-8 lg:pt-8 lg:pb-10 lg:shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)]">
          {alertBanner.enabled ? <AlertBanner banner={alertBanner} /> : null}

          <StaggerRoot className="flex flex-1 flex-col">
            <div className="relative pt-3">
              <StaggerItem className="absolute top-0 right-0 z-20">
                <ShareModal
                  url={siteUrl}
                  title={association.acronym}
                  text={`${association.acronym} · ${association.displayName}`}
                  qrLogoSvg={qrLogoSvg}
                  qrColor={activeTheme.qrColor}
                />
              </StaggerItem>
              <ProfileHeader association={association} />
            </div>

            <StaggerItem className="mt-6">
              <SocialBar socials={socials} />
            </StaggerItem>

            <main id="contenu" className="mt-8 flex flex-col">
              {spotlight.enabled ? <SpotlightCard spotlight={spotlight} /> : null}

              {sections.map((section) => (
                <section
                  key={section.id}
                  aria-labelledby={section.title ? `section-${section.id}` : undefined}
                  aria-label={section.title ? undefined : "Liens"}
                  className="mt-8"
                >
                  {section.title ? <SectionHeading id={`section-${section.id}`} title={section.title} /> : null}
                  <ul className="mt-3 flex flex-col gap-3">
                    {section.links.map((link, index) => (
                      <li key={`${section.id}-${index}`}>
                        <LinkCard link={link} />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}

              {newsletter.enabled ? (
                <div className="mt-10">
                  <NewsletterCard newsletter={newsletter} />
                </div>
              ) : null}
            </main>

            <Footer association={association} footer={footer} buildYear={new Date().getFullYear()} />
          </StaggerRoot>
        </div>
      </MotionProvider>
      <OrganizationJsonLd siteUrl={siteUrl} />
    </>
  );
}
