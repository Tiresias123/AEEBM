/**
 * Arrière-plan d’ambiance : fond minéral, halos radiaux en lente dérive, cercle ouvert de la charte
 * (écrans larges uniquement, pour ne jamais passer derrière le texte), voile de bruit et vignettage.
 * Composant purement CSS : aucun JavaScript côté client.
 */
export function BackgroundGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-0 h-lvh overflow-hidden bg-bg">
      {/* Halos */}
      <div
        className="absolute -top-[25vmax] -left-[30vmax] size-[80vmax] animate-drift-a rounded-full opacity-70 will-change-transform"
        style={{
          background: "radial-gradient(closest-side, color-mix(in oklab, var(--glow-1) 78%, transparent), transparent)",
        }}
      />
      <div
        className="absolute top-[8vh] -right-[32vmax] size-[75vmax] animate-drift-b rounded-full opacity-60 will-change-transform"
        style={{
          background: "radial-gradient(closest-side, color-mix(in oklab, var(--glow-2) 80%, transparent), transparent)",
        }}
      />
      <div
        className="absolute -bottom-[35vmax] -left-[20vmax] size-[85vmax] animate-drift-c rounded-full opacity-50 will-change-transform"
        style={{
          background: "radial-gradient(closest-side, color-mix(in oklab, var(--glow-3) 70%, transparent), transparent)",
        }}
      />
      <div
        className="absolute -right-[25vmax] -bottom-[30vmax] size-[70vmax] animate-drift-a rounded-full opacity-60 will-change-transform [animation-delay:-12s]"
        style={{
          background: "radial-gradient(closest-side, color-mix(in oklab, var(--glow-4) 85%, transparent), transparent)",
        }}
      />

      {/* Cercle ouvert : agrandi, il sort de la page par l’angle supérieur droit (charte, section 13). */}
      <svg
        className="absolute -top-[22vmin] -right-[22vmin] hidden size-[78vmin] opacity-[0.09] lg:block"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="99" stroke="white" strokeWidth="0.35" />
      </svg>
      <svg
        className="absolute -bottom-[30vmin] -left-[26vmin] hidden size-[64vmin] opacity-[0.06] lg:block"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="99" stroke="white" strokeWidth="0.4" />
      </svg>

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
