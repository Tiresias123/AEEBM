import { Heart } from "lucide-react";
import Image from "next/image";
import { CurrentYear } from "@/components/CurrentYear";
import { Enter } from "@/components/Enter";
import { Ornament } from "@/components/brand/Ornament";
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
        className="mx-0.5 inline size-3.5 -translate-y-px fill-[var(--ring-1)] text-[var(--ring-1)] forced-colors:fill-[CanvasText] forced-colors:text-[CanvasText]"
      />
      {after}
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
    <Enter index={enterIndex} className="mt-14">
      <footer className="flex flex-col items-center text-center">
        <Ornament className="mb-8" />
        {/*
         * Logo officiel, version principale « blanc sur bordeaux » (charte, section 10) : plaque bordeaux en aplat,
         * marge intérieure au moins égale à la hauteur du « B » (zone de protection), largeur au-dessus de 110 px.
         */}
        <div className="rounded-2xl bg-[#681A16] px-5 py-4 forced-color-adjust-none">
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

        <div className="mt-4 max-w-[22rem] space-y-0.5 text-[0.72rem] leading-relaxed text-balance text-muted">
          <p>
            © <CurrentYear initial={buildYear} /> {association.acronym} · Tous droits réservés
          </p>
          <p>{association.legalName}</p>
          <p>
            {frTypo(association.legalStatus)} depuis{NBSP}
            {association.foundingDate.slice(0, 4)} · <span className="whitespace-nowrap">NEQ {association.neq}</span>
          </p>
          <PostalAddress address={association.address} />
        </div>

        <nav aria-label="Liens institutionnels" className="mt-4 text-[0.72rem]">
          <LinkList links={links} />
        </nav>
      </footer>
    </Enter>
  );
}
