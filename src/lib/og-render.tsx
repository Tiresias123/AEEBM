import { ImageResponse } from "next/og";
import type { CSSProperties } from "react";
import { CHECK_PATH, ROSETTE_PATH } from "@/components/brand/VerifiedBadge";
import { siteConfig } from "@/config/links.config";
import { loadThemeFonts, OG_SIZE, stripEmoji, themedMonogramUri } from "@/lib/brand-images";
import { activeTheme, getSiteUrl } from "@/lib/site";

/** Anneau ouvert (thème « bordeaux ») : deux arcs interrompus dans l’axe du sigle, comme le cercle de la charte. */
const RING_R = 146;
const RING_DX = +(RING_R * Math.cos((22 * Math.PI) / 180)).toFixed(2);
const RING_DY = +(RING_R * Math.sin((22 * Math.PI) / 180)).toFixed(2);
const RING_ARCS = [
  `M${150 - RING_DX} ${150 - RING_DY}A${RING_R} ${RING_R} 0 0 1 ${150 + RING_DX} ${150 - RING_DY}`,
  `M${150 - RING_DX} ${150 + RING_DY}A${RING_R} ${RING_R} 0 0 0 ${150 + RING_DX} ${150 + RING_DY}`,
];

/** Segments « A • B • C » insécables pour Satori : la puce reste en fin de segment, jamais en début de ligne. */
function Segments({
  text,
  bulletColor,
  segmentStyle,
}: {
  text: string;
  bulletColor: string;
  segmentStyle?: CSSProperties;
}) {
  const parts = text
    .split("•")
    .map((part) => part.trim())
    .filter(Boolean);
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {parts.map((part, index) => (
        <div key={index} style={{ display: "flex", whiteSpace: "nowrap" }}>
          <span style={segmentStyle}>{part}</span>
          {index < parts.length - 1 ? <span style={{ color: bulletColor, padding: "0 0.4em" }}>•</span> : null}
        </div>
      ))}
    </div>
  );
}

/** Rendu PNG de l’image de partage (1200 × 630), à partir de la configuration et du thème actif. */
export async function renderOgImage(): Promise<ArrayBuffer> {
  const { association } = siteConfig;
  const c = activeTheme.colors;
  const fonts = await loadThemeFonts();
  const isSerif = activeTheme.fonts.display === "cormorant";
  const openRing = activeTheme.avatarRing === "open";
  const host = getSiteUrl().replace(/^https?:\/\//, "");

  const response = new ImageResponse(
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
      {/* Cercle ouvert sortant par l’angle inférieur droit, à distance du texte (charte, sections 09 et 13). */}
      <div
        style={{
          position: "absolute",
          left: 1000,
          top: 430,
          width: 760,
          height: 760,
          borderRadius: 9999,
          border: "1.5px solid rgba(255,255,255,0.14)",
          display: "flex",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 64, width: "100%" }}>
        {/* Avatar avec anneau (continu, ou ouvert et sans halo dans le thème « bordeaux ») */}
        <div
          style={{
            display: "flex",
            position: "relative",
            width: 300,
            height: 300,
            flexShrink: 0,
            borderRadius: 9999,
            padding: 8,
            ...(openRing
              ? {}
              : {
                  backgroundImage: `linear-gradient(135deg, ${c.ring[0]}, ${c.ring[1]} 50%, ${c.ring[2]})`,
                  boxShadow: `0 0 90px 10px ${c.ring[1]}55`,
                }),
          }}
        >
          {openRing ? (
            <svg width="300" height="300" viewBox="0 0 300 300" style={{ position: "absolute", left: 0, top: 0 }}>
              <defs>
                <linearGradient id="r" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor={c.ring[0]} />
                  <stop offset="0.5" stopColor={c.ring[1]} />
                  <stop offset="1" stopColor={c.ring[2]} />
                </linearGradient>
              </defs>
              {RING_ARCS.map((d) => (
                <path key={d} d={d} fill="none" stroke="url(#r)" strokeWidth="6" strokeLinecap="round" />
              ))}
            </svg>
          ) : null}
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              borderRadius: 9999,
              padding: 7,
              backgroundColor: openRing ? "transparent" : c.bg,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- rendu Satori */}
            <img src={themedMonogramUri(1.8)} width={270} height={270} alt="" />
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
            {association.verified.enabled ? (
              <svg width="56" height="56" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="v" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor={c.verified.from} />
                    <stop offset="1" stopColor={c.verified.to} />
                  </linearGradient>
                </defs>
                <path d={ROSETTE_PATH} fill="url(#v)" />
                <path
                  d={CHECK_PATH}
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
          </div>

          <div style={{ display: "flex", marginTop: 22, fontSize: 30 }}>
            <Segments
              text={association.tagline}
              bulletColor={c.textMuted}
              segmentStyle={{
                backgroundImage: `linear-gradient(90deg, ${c.subtitle.from}, ${c.subtitle.to})`,
                backgroundClip: "text",
                color: "transparent",
              }}
            />
          </div>
          <div
            style={{ display: "flex", marginTop: 16, fontSize: 25, lineHeight: 1.45, color: c.textSoft, maxWidth: 700 }}
          >
            <Segments text={stripEmoji(association.bio)} bulletColor={c.textMuted} />
          </div>

          <div style={{ display: "flex", marginTop: 40 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
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
    { ...OG_SIZE, fonts },
  );
  return response.arrayBuffer();
}

/**
 * Image de partage compacte : l’image générée (PNG RGBA peu compressé, ~470 Ko) est réencodée en JPEG
 * (~60 Ko) pour rester sous la limite d’aperçu de WhatsApp (~300 Ko). Repli PNG si sharp est absent.
 */
export async function ogImageResponse(): Promise<Response> {
  const png = await renderOgImage();
  try {
    const { default: sharp } = await import("sharp");
    const jpeg = await sharp(Buffer.from(png)).removeAlpha().jpeg({ quality: 86, mozjpeg: true }).toBuffer();
    return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": "image/jpeg" } });
  } catch {
    return new Response(png, { headers: { "Content-Type": "image/png" } });
  }
}
