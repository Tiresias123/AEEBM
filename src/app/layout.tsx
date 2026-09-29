import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Poppins } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";
import { siteConfig } from "@/config/links.config";
import { themeToCssVariables } from "@/config/themes";
import { bannerPrepaintScript } from "@/lib/banner";
import { activeTheme, getPlaceholderLinks, getSiteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

// Polices de la charte AEEBM (thème « barreau ») : chargées seulement si le thème les utilise.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
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
    "étudiants en droit",
    "examen du Barreau",
    "stage",
    "mentorat",
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
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
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

if (process.env.NODE_ENV === "production") {
  const pending = getPlaceholderLinks();
  if (pending.length > 0) {
    console.warn(
      `\n⚠️  [AEEBM] ${pending.length} adresse(s) encore à compléter dans src/config/links.config.ts :\n` +
        pending.map((label) => `   • ${label}`).join("\n") +
        "\n",
    );
  }
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="fr-CA"
      data-theme={siteConfig.theme}
      data-display-font={activeTheme.fonts.display}
      data-body-font={activeTheme.fonts.body}
      data-confetti={activeTheme.colors.confetti.join(",")}
      style={themeToCssVariables(activeTheme) as CSSProperties}
      className={cn(jakarta.variable, cormorant.variable, poppins.variable)}
      // Le script ci-dessous peut ajouter data-banner-hidden avant l’hydratation.
      suppressHydrationWarning
    >
      <head>
        {siteConfig.alertBanner.enabled ? (
          <script dangerouslySetInnerHTML={{ __html: bannerPrepaintScript(siteConfig.alertBanner) }} />
        ) : null}
      </head>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
