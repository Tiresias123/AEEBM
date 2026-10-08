import type { ReactNode } from "react";
import { AlertBanner } from "@/components/AlertBanner";
import { BackgroundGlow } from "@/components/BackgroundGlow";
import { Ornament } from "@/components/brand/Ornament";
import { SocialIcon } from "@/components/brand/BrandIcons";
import { Enter } from "@/components/Enter";
import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/motion";
import { ProfileHeader } from "@/components/ProfileHeader";
import { SocialBar } from "@/components/SocialBar";
import { ViewTransitionBridge } from "@/components/TransitionLink";
import { siteConfig } from "@/config/links.config";
import { isPendingHref } from "@/lib/pending";
import { getPageModel } from "@/lib/site";
import { dateTile, frTypo } from "@/lib/typo";

/** Rang du pied de page dans l’entrée en cascade (le délai est plafonné à ce rang). */
const FOOTER_ENTER_INDEX = 12;

/**
 * Layout commun de la page de liens et de la page des partenaires : fond, support (bulle principale), bandeau du
 * prochain événement, en-tête (sceau, nom, piliers), réseaux sociaux et pied de page (logo, mentions).
 * Il reste en place quand on passe d’une page à l’autre : seul le contenu central change (voir TransitionLink).
 * Les pages commencent leur entrée en cascade au rang 5.
 */
export default function LinksLayout({ children }: { children: ReactNode }) {
  const { association, socials, footer } = siteConfig;
  const { banner } = getPageModel();

  const socialItems = socials.map((social) => ({
    href: social.href,
    label: social.label,
    pending: isPendingHref(social.href),
    icon: <SocialIcon name={social.icon ?? social.platform} className="relative size-[1.2rem]" />,
  }));

  const bannerLink = banner?.link && !isPendingHref(banner.link.href) ? banner.link : undefined;

  return (
    <>
      <a
        href="#contenu"
        className="fixed bottom-full left-3 z-50 rounded-full border border-line-strong bg-bg-elevated px-4 py-2 text-[0.8rem] font-semibold text-ink focus:top-[max(0.75rem,env(safe-area-inset-top))] focus:bottom-auto focus:shadow-[0_10px_30px_-10px_rgb(0_0_0/0.9)]"
      >
        Aller au contenu principal
      </a>
      <BackgroundGlow />
      <ViewTransitionBridge />
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

          {children}

          <Footer
            association={association}
            footer={footer}
            buildYear={new Date().getFullYear()}
            enterIndex={FOOTER_ENTER_INDEX}
          />
        </div>
      </MotionProvider>
    </>
  );
}
