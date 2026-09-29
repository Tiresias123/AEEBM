import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { BackgroundGlow } from "@/components/BackgroundGlow";
import { Enter } from "@/components/Enter";
import { siteConfig } from "@/config/links.config";
import { formatAddress } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: `Comment l’${siteConfig.association.acronym} recueille, utilise et protège les renseignements personnels.`,
  alternates: { canonical: "/confidentialite" },
};

function Section({ title, children, index }: { title: string; children: ReactNode; index: number }) {
  return (
    <Enter index={index} className="border-t border-white/[0.08] pt-6">
      <h2 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-ink">{title}</h2>
      <div className="mt-2 space-y-2 text-[0.875rem] leading-relaxed text-soft/90">{children}</div>
    </Enter>
  );
}

/*
 * Politique rédigée à partir de la configuration (responsable, fournisseurs, date).
 * À faire valider par l’exécutif lors de l’adoption des politiques internes (feuille de route, section 16).
 */
export default function PrivacyPage() {
  const { association, privacy } = siteConfig;
  const address = formatAddress(association.address);
  const updated = new Intl.DateTimeFormat("fr-CA", { dateStyle: "long", timeZone: "America/Toronto" }).format(
    new Date(`${privacy.updatedAt}T12:00:00-04:00`),
  );

  return (
    <>
      <BackgroundGlow />
      <main className="relative z-10 mx-auto w-full max-w-[40rem] px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-16 sm:px-8 lg:pt-14">
        <Enter index={0}>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full pr-2 text-[0.85rem] font-medium text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Retour à la page de l’{association.acronym}
          </Link>
        </Enter>

        <Enter index={1} className="mt-6">
          <h1 className="font-display-name text-[length:calc(1.9rem*var(--display-scale))] leading-tight text-ink">
            Politique de confidentialité
          </h1>
          <p className="mt-2 text-[0.8rem] text-muted">Mise à jour le {updated}</p>
        </Enter>

        <div className="mt-8 space-y-6 rounded-[1.4rem] glass p-6 sm:p-8">
          <Enter index={2}>
            <p className="text-[0.9rem] leading-relaxed text-soft">
              L’{association.legalName} ({association.acronym}) protège les renseignements personnels qu’elle recueille
              sur cette page, conformément à la Loi sur la protection des renseignements personnels dans le secteur
              privé (Loi 25).
            </p>
          </Enter>

          <Section index={3} title="Renseignements recueillis">
            <p>
              Seulement l’adresse courriel que vous fournissez volontairement pour recevoir l’infolettre. La page
              n’utilise ni témoin (cookie) de suivi ni outil de mesure d’audience.
            </p>
            <p>
              Votre navigateur mémorise localement si vous avez replié une annonce. Cette information reste sur votre
              appareil et n’est jamais transmise.
            </p>
          </Section>

          <Section index={4} title="Utilisation">
            <p>
              Votre adresse sert uniquement à vous envoyer l’infolettre de l’{association.acronym} : avis, assemblées et
              événements. Elle n’est ni vendue, ni louée, ni cédée.
            </p>
          </Section>

          <Section index={5} title="Consentement et retrait">
            <p>
              Un courriel de confirmation vous est envoyé avant tout abonnement (double consentement). Vous pouvez
              retirer votre consentement en tout temps par le lien de désabonnement présent dans chaque envoi, ou en
              écrivant à{" "}
              <a
                className="text-ink underline decoration-white/30 underline-offset-2"
                href={`mailto:${privacy.officer.email}`}
              >
                {privacy.officer.email}
              </a>
              .
            </p>
          </Section>

          <Section index={6} title="Fournisseurs et communication à l’extérieur du Québec">
            <p>Pour ces seules fins, votre adresse est traitée par :</p>
            <ul className="list-disc space-y-1 pl-5">
              {privacy.processors.map((processor) => (
                <li key={processor.name}>
                  {processor.name} : {processor.purpose} ({processor.location})
                </li>
              ))}
            </ul>
            <p>
              Vos renseignements peuvent donc être communiqués à l’extérieur du Québec. L’{association.acronym} retient
              des fournisseurs qui offrent une protection adéquate et limite leur accès à ce qui est nécessaire.
            </p>
          </Section>

          <Section index={7} title="Conservation">
            <p>
              Votre adresse est conservée jusqu’à votre désabonnement. Le fournisseur d’envoi peut garder une trace de
              votre refus afin de ne plus vous écrire.
            </p>
          </Section>

          <Section index={8} title="Vos droits">
            <p>
              Vous pouvez demander l’accès à vos renseignements, leur rectification ou leur suppression. Si vous estimez
              que votre demande n’a pas été traitée correctement, vous pouvez vous adresser à la Commission d’accès à
              l’information du Québec.
            </p>
          </Section>

          <Section index={9} title="Personne responsable">
            <p>
              {privacy.officer.title}
              <br />
              <a
                className="text-ink underline decoration-white/30 underline-offset-2"
                href={`mailto:${privacy.officer.email}`}
              >
                {privacy.officer.email}
              </a>
              <br />
              <span className="whitespace-nowrap">{address.street},</span>{" "}
              <span className="whitespace-nowrap">{address.locality}</span>
            </p>
          </Section>

          <Section index={10} title="Liens vers d’autres sites">
            <p>
              Cette page renvoie vers des services tiers (formulaires, dossiers partagés, réseaux sociaux, billetterie)
              qui appliquent leurs propres politiques de confidentialité.
            </p>
          </Section>
        </div>
      </main>
    </>
  );
}
