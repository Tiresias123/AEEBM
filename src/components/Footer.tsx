import { Heart } from "lucide-react";
import Image from "next/image";
import { CurrentYear } from "@/components/CurrentYear";
import { Enter } from "@/components/Enter";
import { PostalAddress } from "@/components/PostalAddress";
import type { AssociationConfig, FooterConfig, LegalLink } from "@/config/types";
import { isExternalHref, linkProps } from "@/lib/links";
import { isPendingHref } from "@/lib/pending";
import { frTypo, NBSP } from "@/lib/typo";

function Signature({ text }: { text: string }) {
  const [before, after] = text.split("{heart}");
  if (after === undefined) return <>{text}</>;
  return (
    <>
      {before}
      <Heart
        aria-label="amour"
        role="img"
        className="mx-0.5 inline size-3.5 -translate-y-px fill-[var(--ring-1)] text-[var(--ring-1)]"
      />
      {after}
    </>
  );
}

/** Mention légale avec le titre de la loi en italique (« … de la Loi sur les compagnies (RLRQ, c. C-38) »). */
function LegalStatus({ text }: { text: string }) {
  const typeset = frTypo(text);
  const match = /(Loi sur [^()]+?)(?=\s*\()/.exec(typeset);
  if (!match) return <>{typeset}</>;
  const start = match.index;
  return (
    <>
      {typeset.slice(0, start)}
      <i>{match[1]}</i>
      {typeset.slice(start + match[1].length)}
    </>
  );
}

function LinkList({ links }: { links: LegalLink[] }) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5">
      {links.map((link) => (
        <li key={link.label}>
          <a
            {...linkProps(link.href)}
            className="inline-flex min-h-6 items-center rounded px-1 text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            {frTypo(link.label)}
            {isExternalHref(link.href) ? <span className="sr-only"> (nouvel onglet)</span> : null}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Pied de page : logo officiel, mentions institutionnelles et statut d’OBNL. */
export function Footer({
  association,
  footer,
  buildYear,
  enterIndex,
}: {
  association: AssociationConfig;
  footer: FooterConfig;
  buildYear: number;
  enterIndex: number;
}) {
  // Les adresses encore provisoires ne sont pas affichées dans le pied de page.
  const links = [...association.legalLinks, ...footer.links].filter((link) => !isPendingHref(link.href));

  return (
    <Enter index={enterIndex} className="mt-12">
      <footer className="flex flex-col items-center text-center">
        {/* Filet (charte, section 13) */}
        <span
          aria-hidden="true"
          className="mb-8 h-px w-16 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />

        {/*
         * Logo officiel, version principale « blanc sur bordeaux » (charte, section 10) : plaque bordeaux en aplat,
         * marge intérieure au moins égale à la hauteur du « B » (zone de protection), largeur au-dessus de 110 px.
         */}
        <div className="rounded-2xl bg-[#681A16] px-5 py-4 forced-colors:border">
          <Image
            src={association.logo.src}
            alt={association.logo.alt}
            sizes="120px"
            className="block h-auto w-[7.5rem]"
          />
        </div>

        <p className="mt-6 text-[0.8rem] text-soft/85">
          <Signature text={footer.signature} />
        </p>
        <p className="mt-1.5 text-[0.75rem] text-balance text-muted">
          © <CurrentYear initial={buildYear} /> {association.acronym} · Tous droits réservés · Depuis{NBSP}
          {association.foundingDate.slice(0, 4)}
        </p>

        <div className="mt-5 max-w-[22rem] space-y-1 text-[0.72rem] leading-relaxed text-balance text-muted">
          <p>{association.legalName}</p>
          <p>
            <LegalStatus text={association.legalStatus} /> ·{" "}
            <span className="whitespace-nowrap">NEQ {association.neq}</span>
          </p>
          <PostalAddress address={association.address} />
        </div>

        <nav aria-label="Liens institutionnels" className="mt-5 text-[0.72rem]">
          <LinkList links={links} />
        </nav>
      </footer>
    </Enter>
  );
}
