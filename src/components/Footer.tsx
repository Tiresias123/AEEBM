import { Heart } from "lucide-react";
import Image from "next/image";
import { Fragment } from "react";
import { CurrentYear } from "@/components/CurrentYear";
import { StaggerItem } from "@/components/motion";
import type { AssociationConfig, FooterConfig, LegalLink } from "@/config/types";
import { formatAddress } from "@/lib/site";
import { linkProps } from "@/lib/utils";

function Signature({ text }: { text: string }) {
  const [before, after] = text.split("{heart}");
  if (after === undefined) return <>{text}</>;
  return (
    <>
      {before}
      <Heart
        aria-label="amour"
        role="img"
        className="mx-0.5 inline size-3.5 -translate-y-px animate-pulse-soft fill-[var(--ring-1)] text-[var(--ring-1)]"
      />
      {after}
    </>
  );
}

function LinkList({ links }: { links: LegalLink[] }) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1.5">
      {links.map((link, index) => (
        <Fragment key={link.label}>
          {index > 0 ? (
            <li aria-hidden="true" className="text-white/15">
              ·
            </li>
          ) : null}
          <li>
            <a
              {...linkProps(link.href)}
              className="rounded px-1 text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              {link.label}
            </a>
          </li>
        </Fragment>
      ))}
    </ul>
  );
}

/** Pied de page : logo officiel, mentions institutionnelles et statut d’OBNL. */
export function Footer({
  association,
  footer,
  buildYear,
}: {
  association: AssociationConfig;
  footer: FooterConfig;
  buildYear: number;
}) {
  return (
    <StaggerItem className="mt-12">
      <footer className="flex flex-col items-center text-center">
        {/* Filet (charte, section 13) */}
        <span
          aria-hidden="true"
          className="mb-8 h-px w-16 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />

        <Image
          src={association.logo.src}
          alt={association.logo.alt}
          width={association.logo.width}
          height={association.logo.height}
          sizes="112px"
          className="h-auto w-28 opacity-85"
        />

        <p className="mt-6 text-[0.8rem] text-soft/80">
          <Signature text={footer.signature} />
        </p>
        <p className="mt-1.5 text-[0.75rem] text-muted">
          © <CurrentYear initial={buildYear} /> {association.acronym} · Tous droits réservés · Depuis{" "}
          {association.foundingDate.slice(0, 4)}
        </p>

        <div className="mt-5 max-w-[22rem] space-y-1 text-[0.68rem] leading-relaxed text-muted/80">
          <p>{association.legalName}</p>
          <p>
            {association.legalStatus} · NEQ {association.neq}
          </p>
          <address className="not-italic">{formatAddress(association.address)}</address>
        </div>

        <nav aria-label="Liens institutionnels" className="mt-5 text-[0.7rem]">
          <LinkList links={[...association.legalLinks, ...footer.links]} />
        </nav>
      </footer>
    </StaggerItem>
  );
}
