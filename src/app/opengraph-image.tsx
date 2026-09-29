import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/links.config";
import { loadThemeFonts, OG_ALT, OG_SIZE, stripEmoji, themedMonogramUri } from "@/lib/brand-images";
import { activeTheme, getSiteUrl } from "@/lib/site";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = "image/png";

/** Image de partage (OpenGraph / Twitter), générée au build à partir de la configuration et du thème. */
export default async function OpenGraphImage() {
  const { association } = siteConfig;
  const c = activeTheme.colors;
  const fonts = await loadThemeFonts();
  const isSerif = activeTheme.fonts.display === "cormorant";
  const host = getSiteUrl().replace(/^https?:\/\//, "");
  const bio = stripEmoji(association.bio);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: c.bg,
        backgroundImage: [
          `radial-gradient(circle at 8% 10%, ${c.glow[0]} 0%, transparent 45%)`,
          `radial-gradient(circle at 95% 20%, ${c.glow[1]} 0%, transparent 42%)`,
          `radial-gradient(circle at 20% 110%, ${c.glow[2]} 0%, transparent 45%)`,
          `radial-gradient(circle at 85% 105%, ${c.glow[3]} 0%, transparent 45%)`,
        ].join(", "),
        fontFamily: "Body",
        color: c.text,
        padding: "72px 80px",
      }}
    >
      {/* Cercle ouvert sortant par l’angle (charte) */}
      <div
        style={{
          position: "absolute",
          right: -260,
          top: -300,
          width: 720,
          height: 720,
          borderRadius: 9999,
          border: "1.5px solid rgba(255,255,255,0.10)",
          display: "flex",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 64, width: "100%" }}>
        {/* Avatar avec anneau */}
        <div
          style={{
            display: "flex",
            width: 300,
            height: 300,
            flexShrink: 0,
            borderRadius: 9999,
            padding: 7,
            backgroundImage: `linear-gradient(135deg, ${c.ring[0]}, ${c.ring[1]} 50%, ${c.ring[2]})`,
            boxShadow: `0 0 90px 10px ${c.ring[1]}55`,
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              borderRadius: 9999,
              padding: 7,
              backgroundColor: c.bg,
            }}
          >
            <img src={themedMonogramUri(1.8)} width={272} height={272} alt="" />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                fontFamily: "Display",
                fontSize: isSerif ? 150 : 124,
                lineHeight: 1,
                letterSpacing: isSerif ? "0.04em" : "-0.03em",
                color: c.text,
              }}
            >
              {association.acronym}
            </div>
            <svg width="56" height="56" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="v" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor={c.verified.from} />
                  <stop offset="1" stopColor={c.verified.to} />
                </linearGradient>
              </defs>
              <path
                d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
                fill="url(#v)"
              />
              <path
                d="m8.6 12.1 2.3 2.3 4.5-4.6"
                fill="none"
                stroke="#fff"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: 32,
              backgroundImage: `linear-gradient(90deg, ${c.subtitle.from}, ${c.subtitle.to})`,
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {association.tagline}
          </div>
          <div
            style={{ display: "flex", marginTop: 18, fontSize: 26, lineHeight: 1.45, color: c.textSoft, maxWidth: 680 }}
          >
            {bio}
          </div>

          <div style={{ display: "flex", marginTop: 40 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 28px",
                borderRadius: 9999,
                fontSize: 24,
                color: c.onAccent,
                backgroundImage: `linear-gradient(100deg, ${c.accent.from}, ${c.accent.via} 55%, ${c.accent.to})`,
                boxShadow: `0 16px 50px -12px ${c.accent.via}`,
              }}
            >
              {host}
            </div>
          </div>
        </div>
      </div>
    </div>,
    { ...size, fonts },
  );
}
