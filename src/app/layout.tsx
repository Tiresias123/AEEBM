import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Poppins } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";
import { siteConfig } from "@/config/links.config";
import { themeToCssVariables } from "@/config/themes";
import { prepaintScript } from "@/lib/schedule";
import {
  activeTheme,
  getPageModel,
  getPlaceholderLinks,
  getSiteUrl,
  getSiteUrlSource,
  isNewsletterMisconfigured,
} from "@/lib/site";
import { cn } from "@/lib/utils";
import "./globals.css";

// Préchargement : polices du thème par défaut (« bordeaux ») seulement. Le navigateur ne télécharge une police
// non préchargée que si le thème l’utilise. En passant au thème « amethyste », inverser les valeurs de preload.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-cormorant",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-poppins",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  preload: false,
});

const { association } = siteConfig;
const siteUrl = getSiteUrl();
const title = `${association.acronym} · ${association.displayName}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s · ${association.acronym}`,
  },
  description: association.mission,
  applicationName: association.acronym,
  authors: [{ name: association.acronym, url: siteUrl }],
  creator: association.acronym,
  publisher: association.legalName,
  keywords: [
    "AEEBM",
    "École du Barreau",
    "Barreau du Québec",
    "Montréal",
    "association étudiante",
    "étudiantes et étudiants en droit",
    "examen du Barreau",
    "stages",
    "réseautage",
  ],
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: "fr_CA",
    url: "/",
    siteName: association.acronym,
    title,
    description: association.mission,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: association.mission,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: association.acronym,
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
  themeColor: activeTheme.browserColor,
};

/* Vérifications affichées dans la console au build (et au démarrage du serveur). */
if (process.env.NODE_ENV === "production") {
  const warnings: string[] = [];
  const pending = getPlaceholderLinks();
  if (pending.length > 0) {
    warnings.push(
      `${pending.length} adresse(s) encore à compléter dans src/config/links.config.ts (affichées « Bientôt disponible ») :\n` +
        pending.map((label) => `   • ${label}`).join("\n"),
    );
  }
  if (getSiteUrlSource() === "config" && !siteConfig.siteUrlConfirmed) {
    warnings.push(
      `URL publique = siteUrl de repli (${siteConfig.siteUrl}). Le code QR, le partage et l’URL canonique y pointeront :\n` +
        "   définir NEXT_PUBLIC_SITE_URL ou déployer sur Vercel (domaine de production détecté automatiquement).",
    );
  }
  if (
    getSiteUrlSource() !== "config" &&
    !siteConfig.siteUrlConfirmed &&
    new URL(siteUrl).host === new URL(siteConfig.siteUrl).host
  ) {
    warnings.push(
      `L’URL publique pointe vers ${new URL(siteUrl).host}, domaine non confirmé : le code QR, le partage et l’URL canonique y pointeront.\n` +
        "   Passer siteUrlConfirmed à true une fois le domaine repris, ou définir une autre URL (NEXT_PUBLIC_SITE_URL).",
    );
  }
  if (isNewsletterMisconfigured()) {
    warnings.push(
      "Infolettre active, mais MAILCHIMP_API_KEY ou MAILCHIMP_AUDIENCE_ID est absent : chaque inscription échouera.\n" +
        "   Ajouter les deux variables chez l’hébergeur, ou mettre newsletter.enabled à false.",
    );
  }
  for (const section of siteConfig.sections) {
    if (!/^[a-z0-9-]+$/i.test(section.id)) {
      warnings.push(`sections.id « ${section.id} » : utiliser seulement lettres, chiffres et tirets.`);
    }
  }
  if (!/^[a-z0-9-]+$/i.test(siteConfig.alertBanner.id)) {
    warnings.push(`alertBanner.id « ${siteConfig.alertBanner.id} » : utiliser seulement lettres, chiffres et tirets.`);
  }
  if (warnings.length > 0) console.warn(warnings.map((warning) => `\n⚠️  [AEEBM] ${warning}`).join("\n") + "\n");
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const { banner, scheduled, groups } = getPageModel();
  const needsPrepaint = banner !== null || scheduled.length > 0;
  return (
    <html
      lang="fr-CA"
      data-theme={siteConfig.theme}
      data-display-font={activeTheme.fonts.display}
      data-body-font={activeTheme.fonts.body}
      data-avatar-ring={activeTheme.avatarRing}
      data-confetti={activeTheme.colors.confetti.join(",")}
      style={themeToCssVariables(activeTheme) as CSSProperties}
      className={cn(jakarta.variable, cormorant.variable, poppins.variable)}
      // Le script ci-dessous peut ajouter data-banner avant l’hydratation.
      suppressHydrationWarning
    >
      <head>
        {needsPrepaint ? (
          <script dangerouslySetInnerHTML={{ __html: prepaintScript(banner, scheduled, groups) }} />
        ) : null}
      </head>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
