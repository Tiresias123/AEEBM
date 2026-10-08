import { clsx } from "clsx";
import { Fragment } from "react";
import { linkProps } from "@/lib/links";
import { isPendingHref } from "@/lib/pending";
import { guillocheRibbon } from "@/lib/seal";
import { frTypo } from "@/lib/typo";

/*
 * Éléments communs aux partenaires : liens commandités, nom lu à voix haute, matière « encre » des bandeaux
 * (fond, ruban guilloché, filet intérieur), nom composé en capitales espacées, mentions en petits caractères.
 * Les couleurs d’encre sont fixes (charte : encre #1E1514, ivoire #FAF7F4, rosé #C9A9A2) quel que soit le thème.
 */

/** Rel des liens commandités (signalés comme tels aux moteurs de recherche). */
const SPONSORED_REL = "sponsored noopener noreferrer";

/** Liens sortants de partenaire : nouvel onglet, rel « sponsored ». */
export function partnerLinkProps(href: string) {
  const props = linkProps(href);
  return props.rel ? { ...props, rel: SPONSORED_REL } : props;
}

/** Vrai si le partenaire a une adresse utilisable (sinon : rien de cliquable). */
export function hasPartnerLink(href: string): boolean {
  return !isPendingHref(href);
}

/** Nom lu par les lecteurs d’écran : « Jolicoeur | Lapierre » devient « Jolicoeur Lapierre ». */
export function spokenName(name: string): string {
  return name.replace(/\s*\|\s*/g, " ");
}

/** Titre accessible d’une carte : nom et complément (« Jolicoeur Lapierre Gestion financière »). */
export function accessibleTitle(name: string, descriptor?: string): string {
  return [spokenName(name), descriptor].filter(Boolean).join(" ");
}

/*
 * Ruban guilloché (bande de sécurité des billets et des chèques, en écho au sceau de l’en-tête) : deux familles
 * de sinusoïdes croisées, tracées au rendu serveur.
 */
const RIBBON = [
  ...guillocheRibbon({ width: 400, cy: 80, amplitude: 40, period: 200, strands: 9 }),
  ...guillocheRibbon({ width: 400, cy: 80, amplitude: 22, period: 100, strands: 9, offset: Math.PI / 9 }),
];

/**
 * Matière « encre » : fond (encre éclairée par le haut, lueur bordeaux), ruban guilloché qui glisse au survol du
 * groupe, filet intérieur rosé. À poser dans un parent `relative` à fond d’encre ; `behind` place les calques
 * sous le contenu non positionné (parent `isolate`).
 */
export function InkBackdrop({
  glow,
  filet,
  behind = false,
}: {
  /** Dégradés de fond (lumière et lueur bordeaux). */
  glow: string;
  /** Position et arrondi du filet intérieur. */
  filet: string;
  behind?: boolean;
}) {
  const layer = clsx("pointer-events-none absolute", behind && "-z-10");
  return (
    <>
      <span aria-hidden="true" className={clsx(layer, "inset-0", glow)} />
      <svg
        aria-hidden="true"
        viewBox="0 0 400 160"
        preserveAspectRatio="xMidYMid slice"
        className={clsx(
          layer,
          "inset-0 size-full [mask-image:linear-gradient(90deg,transparent,black_18%,black_82%,transparent)] text-[#C9A9A2] opacity-[0.17] transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:-translate-x-2 motion-reduce:transition-none",
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
      >
        {RIBBON.map((d, index) => (
          <path key={index} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <span aria-hidden="true" className={clsx(layer, "border border-[rgb(201_169_162/0.22)]", filet)} />
    </>
  );
}

/** Mots du nom (format « sm ») : le dernier mot avant chaque barre verticale porte le filet. */
function smallTokens(parts: string[]): { word: string; bar: boolean }[] {
  return parts.flatMap((part, partIndex) => {
    const words = part.split(/\s+/).filter(Boolean);
    return words.map((word, wordIndex) => ({
      word,
      bar: wordIndex === words.length - 1 && partIndex < parts.length - 1,
    }));
  });
}

/**
 * Nom du partenaire composé en capitales espacées, à la manière de son logotype : la barre verticale du nom
 * (« Jolicoeur | Lapierre ») devient un filet, le complément (« Gestion financière ») passe dessous.
 * - « lg » : centré, sur une ligne (bandeau de l’encart principal) ;
 * - « sm » : aligné à gauche, peut passer à la ligne (bandeau de grand partenaire).
 * Taille en unités de conteneur (cqi) : le parent porte `@container`.
 */
export function Wordmark({ name, descriptor, size }: { name: string; descriptor?: string; size: "lg" | "sm" }) {
  const parts = name.split("|").map((part) => part.trim());
  const large = size === "lg";
  return (
    <span aria-hidden="true" translate="no" className={clsx("flex flex-col", large ? "items-center" : "items-start")}>
      <span
        className={clsx(
          "leading-none font-medium uppercase",
          large
            ? "[margin-right:-0.24em] flex items-center text-[clamp(0.78rem,5.1cqi,1.06rem)] tracking-[0.24em] whitespace-nowrap"
            : "text-[clamp(0.74rem,4.4cqi,0.9rem)] leading-[1.35] tracking-[0.2em] text-balance [overflow-wrap:break-word]",
        )}
      >
        {large
          ? parts.map((part, index) => (
              <Fragment key={index}>
                {/* Filet centré : l’espacement des lettres prolonge déjà le mot précédent de 0,24 em. */}
                {index > 0 ? <span className="mr-[0.75em] ml-[0.51em] h-[1.15em] w-px bg-current opacity-55" /> : null}
                {part}
              </Fragment>
            ))
          : smallTokens(parts).map((token, index) => (
              <Fragment key={index}>
                {index > 0 ? " " : null}
                {token.bar ? (
                  // Le filet reste accroché au mot qui le précède : jamais en tête de ligne.
                  <span className="whitespace-nowrap">
                    {token.word}
                    <span className="mr-[0.25em] ml-[0.5em] inline-block h-[1.05em] w-px bg-current align-[-0.15em] opacity-55" />
                  </span>
                ) : (
                  token.word
                )}
              </Fragment>
            ))}
      </span>
      {descriptor ? (
        <span
          className={clsx(
            "flex items-center leading-none text-[#E2D3CC] uppercase",
            large
              ? "mt-2.5 [margin-right:-0.42em] gap-2.5 text-[clamp(0.5rem,2.75cqi,0.6rem)] tracking-[0.42em]"
              : "mt-1.5 text-[0.58rem] tracking-[0.34em]",
          )}
        >
          {large ? <span className="h-px w-5 bg-current opacity-50" /> : null}
          {descriptor}
          {large ? <span className="[margin-left:-0.42em] h-px w-5 bg-current opacity-50" /> : null}
        </span>
      ) : null}
    </span>
  );
}

/** Surtitre d’encre (« Partenaire principal », « Grand partenaire ») entre deux losanges. */
export function InkEyebrow({ children, align = "center" }: { children: string; align?: "center" | "start" }) {
  return (
    <p
      className={clsx(
        "flex items-center gap-2 text-[0.6rem] leading-none tracking-[0.3em] text-[#C9A9A2] uppercase",
        align === "center" ? "justify-center" : "justify-start",
      )}
    >
      {align === "center" ? <span aria-hidden="true" className="size-1 rotate-45 bg-current opacity-70" /> : null}
      <span className={align === "center" ? "[margin-right:-0.3em]" : undefined}>{children}</span>
      {align === "center" ? <span aria-hidden="true" className="size-1 rotate-45 bg-current opacity-70" /> : null}
    </p>
  );
}

/** Mentions en petits caractères, une par ligne (raison sociale, puis statut) : aucune coupure au milieu. */
export function LegalLines({ text, className }: { text: string; className?: string }) {
  return (
    <p className={clsx("text-[0.65rem] leading-snug text-balance text-muted", className)}>
      {frTypo(text)
        .split(" · ")
        .map((part, index) => (
          <span key={index} className="block">
            {index > 0 ? <span className="sr-only"> · </span> : null}
            {part}
          </span>
        ))}
    </p>
  );
}

/** Mention publicitaire sous les partenaires (transparence). */
export function Disclosure({ text, className }: { text: string; className?: string }) {
  return (
    <p
      className={clsx(
        "mx-auto max-w-[22rem] text-center text-[0.65rem] leading-relaxed text-balance text-muted",
        className,
      )}
    >
      {frTypo(text)}
    </p>
  );
}
