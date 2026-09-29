/**
 * Arrière-plan d’ambiance : fond minéral, halos radiaux fixes, cercle ouvert de la charte (page d’accueil,
 * grands écrans, toujours hors de la colonne de texte), voile de bruit et vignettage. Purement CSS, sans animation
 * permanente : les cartes en verre n’ont pas à recalculer leur flou à chaque image.
 */
export function BackgroundGlow({ circles = true }: { circles?: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-0 h-lvh overflow-hidden bg-bg">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(60vmax 60vmax at 0% 0%, color-mix(in oklab, var(--glow-1) 60%, transparent), transparent 70%)",
            "radial-gradient(55vmax 55vmax at 100% 28%, color-mix(in oklab, var(--glow-2) 55%, transparent), transparent 70%)",
            "radial-gradient(65vmax 65vmax at 0% 100%, color-mix(in oklab, var(--glow-3) 42%, transparent), transparent 70%)",
            "radial-gradient(55vmax 55vmax at 100% 100%, color-mix(in oklab, var(--glow-4) 60%, transparent), transparent 70%)",
          ].join(", "),
        }}
      />

      {/* Les pages intérieures ne portent pas le cercle ouvert (charte, section 13). */}
      {circles ? (
        <>
          {/*
           * Cercle ouvert agrandi qui sort par un angle (charte, section 13). Position bornée pour rester
           * à 1,5 rem de la colonne de 30 rem : le cercle ne passe jamais derrière un texte.
           */}
          <svg
            className="absolute -top-[22vmin] left-[max(100%-56vmin,50%+16.5rem)] hidden size-[78vmin] opacity-[0.09] lg:block"
            viewBox="0 0 200 200"
            fill="none"
          >
            <circle cx="100" cy="100" r="99" stroke="white" strokeWidth="0.35" />
          </svg>
          <svg
            className="absolute right-[max(100%-38vmin,50%+16.5rem)] -bottom-[30vmin] hidden size-[64vmin] opacity-[0.06] lg:block"
            viewBox="0 0 200 200"
            fill="none"
          >
            <circle cx="100" cy="100" r="99" stroke="white" strokeWidth="0.4" />
          </svg>
        </>
      ) : null}

      {/* Colonne centrale plus sombre pour la lisibilité, puis vignettage. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 85% at 50% 38%, color-mix(in oklab, var(--bg) 55%, transparent), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgb(0 0 0 / 0.55) 100%)" }}
      />
      <div className="noise absolute inset-0" />
    </div>
  );
}
