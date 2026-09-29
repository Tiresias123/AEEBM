"use client";

import { AnimatePresence, m } from "framer-motion";
import { BellRing, LoaderCircle } from "lucide-react";
import { useId, useRef, useState, type FormEvent } from "react";
import { fadeUp, SPRING, TAP_SCALE } from "@/components/motion";
import type { NewsletterConfig } from "@/config/types";
import { celebrate } from "@/lib/confetti";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function SuccessMark() {
  return (
    <svg viewBox="0 0 52 52" className="size-12" aria-hidden="true">
      <m.circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        strokeWidth="2"
        style={{ stroke: "var(--ring-1)" }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
      <m.path
        d="M16 27l7 7 13-15"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

/** Module d’inscription à l’infolettre : validation, états de chargement, confirmation animée. */
export function NewsletterCard({ newsletter }: { newsletter: NewsletterConfig }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const uid = useId();
  const inputId = `${uid}-email`;
  const errorId = `${uid}-error`;
  const noteId = `${uid}-note`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const website = String(data.get("website") ?? "");

    if (!EMAIL_PATTERN.test(email)) {
      setStatus("error");
      setError("Veuillez entrer une adresse courriel valide.");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const response = await fetch(newsletter.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const payload = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.message ?? newsletter.errorMessage);
      }
      setStatus("success");
      form.reset();
      void celebrate(buttonRef.current);
    } catch (caught) {
      setStatus("error");
      setError(caught instanceof Error && caught.message ? caught.message : newsletter.errorMessage);
    }
  }

  const hasError = status === "error" && error !== null;

  return (
    <m.section
      variants={fadeUp}
      aria-labelledby={`${uid}-title`}
      className="relative overflow-hidden rounded-[1.4rem] glass px-5 pt-5 pb-5 text-center"
    >
      {/* Lueur d’accent en haut de carte */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-[var(--ring-1)] to-transparent opacity-70"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 left-1/2 h-32 w-3/4 -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--accent-from)" }}
      />

      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <m.div
            key="success"
            initial={{ opacity: 0, scale: 0.96, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={SPRING}
            className="relative flex flex-col items-center gap-2 py-2"
            role="status"
          >
            <SuccessMark />
            <h2 id={`${uid}-title`} className="text-gradient-subtitle text-base font-semibold">
              {newsletter.successTitle}
            </h2>
            <p className="max-w-[18rem] text-[0.8rem] leading-relaxed text-soft/85">{newsletter.successMessage}</p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-1 text-xs font-medium text-muted underline decoration-white/20 underline-offset-4 transition-colors hover:text-ink"
            >
              Inscrire une autre adresse
            </button>
          </m.div>
        ) : (
          <m.div
            key="form"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="relative"
          >
            <h2
              id={`${uid}-title`}
              className="inline-flex items-center gap-2 text-[1.02rem] font-semibold tracking-[-0.01em]"
            >
              <span className="text-gradient-subtitle">{newsletter.title}</span>
              <BellRing aria-hidden="true" className="size-4 text-[var(--ring-1)]" strokeWidth={2} />
            </h2>
            <p className="mt-1 text-[0.8rem] text-soft/85">{newsletter.description}</p>

            <form noValidate onSubmit={handleSubmit} className="mt-4" aria-describedby={noteId}>
              <div className="flex items-stretch gap-2">
                <label htmlFor={inputId} className="sr-only">
                  Adresse courriel
                </label>
                <input
                  id={inputId}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  placeholder={newsletter.placeholder}
                  aria-invalid={hasError || undefined}
                  aria-describedby={hasError ? errorId : undefined}
                  onChange={() => {
                    if (status === "error") {
                      setStatus("idle");
                      setError(null);
                    }
                  }}
                  className={cn(
                    "h-12 min-w-0 flex-1 rounded-xl border bg-black/30 px-4 text-[0.9rem] text-ink placeholder:text-muted/80",
                    "transition-[border-color,box-shadow,background-color] duration-200 outline-none",
                    "focus:border-white/30 focus:bg-black/40 focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent-via)_22%,transparent)]",
                    hasError ? "border-[var(--badge-deadline)]/60" : "border-white/10",
                  )}
                />
                {/* Pot de miel anti-robots : invisible pour les humains. */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-px w-px opacity-0"
                />
                <m.button
                  ref={buttonRef}
                  type="submit"
                  disabled={status === "loading"}
                  whileTap={{ scale: TAP_SCALE }}
                  transition={SPRING}
                  className="relative inline-flex h-12 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl bg-cta-gradient px-5 text-[0.9rem] font-semibold text-on-accent shadow-[inset_0_1px_0_0_rgb(255_255_255/0.3),0_10px_24px_-12px_var(--cta-from)] transition-[filter,opacity] hover:brightness-110 disabled:cursor-wait disabled:opacity-85"
                >
                  {status === "loading" ? (
                    <>
                      <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                      <span className="sr-only">Inscription en cours</span>
                    </>
                  ) : (
                    newsletter.buttonLabel
                  )}
                </m.button>
              </div>

              <div aria-live="polite" className="min-h-0">
                {hasError ? (
                  <p id={errorId} role="alert" className="mt-2.5 text-left text-xs text-[var(--badge-deadline)]">
                    {error}
                  </p>
                ) : null}
              </div>

              <p id={noteId} className="mt-3 text-[0.7rem] leading-relaxed text-muted/90">
                {newsletter.consentNote}
              </p>
            </form>
          </m.div>
        )}
      </AnimatePresence>
    </m.section>
  );
}
