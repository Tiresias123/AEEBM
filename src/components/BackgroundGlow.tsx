/**
 * Arrière-plan d’ambiance : fond minéral, halos radiaux fixes, voile de bruit et vignettage.
 * Purement CSS et immobile.
 */
export function BackgroundGlow() {
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
