"use client";

import { clsx } from "clsx";
import { AnimatePresence, m } from "framer-motion";
import { BellRing, LoaderCircle } from "lucide-react";
import { useCallback, useId, useRef, useState, type FormEvent } from "react";
import { EASE_OUT_EXPO, SPRING, TAP_SCALE } from "@/components/motion";
import type { NewsletterConfig } from "@/config/types";
import { celebrate } from "@/lib/confetti";
import { isValidEmail } from "@/lib/email";
import { enterStyle } from "@/lib/enter";

type Status = "idle" | "loading" | "success" | "error";

/** Erreur dont le message vient de notre API (déjà rédigé en français). */
class NewsletterApiError extends Error {}

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
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
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
        transition={{ duration: 0.45, delay: 0.35, ease: EASE_OUT_EXPO }}
      />
    </svg>
  );
}

/** Module d’inscription à l’infolettre : validation, états de chargement, confirmation animée. */
export function NewsletterCard({
  newsletter,
  privacyHref,
  enterIndex,
}: {
  newsletter: NewsletterConfig;
  /** Lien vers la politique de confidentialité, affiché avec la mention de consentement. */
  privacyHref?: string;
  enterIndex: number;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState(newsletter.successMessage);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const refocusInput = useRef(false);
  const uid = useId();
  const inputId = `${uid}-email`;
  const errorId = `${uid}-error`;
  const noteId = `${uid}-note`;
  const titleId = `${uid}-title`;

  const focusOnMount = useCallback((element: HTMLElement | null) => element?.focus({ preventScroll: true }), []);
  const focusInputIfRequested = useCallback((element: HTMLInputElement | null) => {
    if (element && refocusInput.current) {
      refocusInput.current = false;
      element.focus();
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const website = String(data.get("website") ?? "");

    if (!isValidEmail(email)) {
      setStatus("error");
      setError(newsletter.invalidEmailMessage);
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const response = await fetch(newsletter.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, website }),
        signal: AbortSignal.timeout(15_000),
      });
      const payload = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
      if (!response.ok || !payload?.ok) {
        throw new NewsletterApiError(payload?.message || newsletter.errorMessage);
      }
      setSuccessMessage(payload.message || newsletter.successMessage);
      setStatus("success");
      form.reset();
      void celebrate(buttonRef.current);
    } catch (caught) {
      setStatus("error");
      setError(caught instanceof NewsletterApiError ? caught.message : newsletter.errorMessage);
    }
  }

  const hasError = status === "error" && error !== null;
  const loading = status === "loading";
  const announcement = loading
    ? newsletter.loadingLabel
    : status === "success"
      ? successMessage
      : hasError
        ? error
        : "";

  return (
    <section
      aria-labelledby={titleId}
      style={enterStyle(enterIndex)}
      className="enter relative overflow-hidden rounded-[1.4rem] glass px-5 pt-5 pb-5 text-center"
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

      {/* Région d’annonce permanente, hors des transitions, pour les lecteurs d’écran. */}
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <m.div
            key="success"
            initial={{ opacity: 0, scale: 0.96, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={SPRING}
            className="relative flex flex-col items-center gap-2 py-2"
          >
            <SuccessMark />
            <h2
              ref={focusOnMount}
              tabIndex={-1}
              id={titleId}
              className="text-gradient-subtitle text-base font-semibold outline-none"
            >
              {newsletter.successTitle}
            </h2>
            <p className="max-w-[19rem] text-[0.8rem] leading-relaxed text-balance text-soft/85">{successMessage}</p>
            <button
              type="button"
              onClick={() => {
                refocusInput.current = true;
                setStatus("idle");
              }}
              className="mt-1 inline-flex min-h-6 items-center rounded text-xs font-medium text-muted underline decoration-white/20 underline-offset-4 transition-colors hover:text-ink"
            >
              {newsletter.resetLabel}
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
            <h2 id={titleId} className="inline-flex items-center gap-2 text-[1.02rem] font-semibold tracking-[-0.01em]">
              <span className="text-gradient-subtitle">{newsletter.title}</span>
              <BellRing aria-hidden="true" className="size-4 text-[var(--ring-1)]" strokeWidth={2} />
            </h2>
            <p className="mt-1 text-[0.8rem] text-balance text-soft/85">{newsletter.description}</p>

            <form noValidate onSubmit={handleSubmit} className="mt-4">
              <div className="flex flex-col gap-2 min-[360px]:flex-row min-[360px]:items-stretch">
                <label htmlFor={inputId} className="sr-only">
                  {newsletter.inputLabel}
                </label>
                <input
                  ref={focusInputIfRequested}
                  id={inputId}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  maxLength={254}
                  placeholder={newsletter.placeholder}
                  aria-invalid={hasError || undefined}
                  aria-describedby={hasError ? `${errorId} ${noteId}` : noteId}
                  onChange={() => {
                    if (status === "error") {
                      setStatus("idle");
                      setError(null);
                    }
                  }}
                  className={clsx(
                    "h-12 min-w-0 flex-none rounded-xl border bg-black/30 px-4 text-[0.9rem] text-ellipsis text-ink placeholder:text-muted/80 min-[360px]:flex-1",
                    "transition-[border-color,box-shadow,background-color] duration-200 focus-visible:outline-offset-2",
                    "focus:border-white/30 focus:bg-black/40 focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent-via)_22%,transparent)]",
                    hasError ? "border-danger/60" : "border-white/10",
                  )}
                />
                {/* Pot de miel anti-robots : invisible et hors de l’ordre de tabulation. */}
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
                  aria-disabled={loading || undefined}
                  whileTap={{ scale: TAP_SCALE }}
                  transition={SPRING}
                  className={clsx(
                    "relative inline-flex h-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cta-gradient px-5 text-[0.9rem] font-semibold text-on-accent",
                    "shadow-[inset_0_1px_0_0_rgb(255_255_255/0.3),0_10px_24px_-12px_var(--cta-from)] transition-[filter] hover:brightness-110 forced-colors:border",
                    loading && "cursor-wait",
                  )}
                >
                  <span className={clsx(loading && "invisible")}>{newsletter.buttonLabel}</span>
                  {loading ? (
                    <span className="absolute inset-0 grid place-items-center">
                      <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                      <span className="sr-only">{newsletter.loadingLabel}</span>
                    </span>
                  ) : null}
                </m.button>
              </div>

              <AnimatePresence initial={false}>
                {hasError ? (
                  <m.p
                    key="error"
                    id={errorId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                    className="overflow-hidden text-center text-xs text-balance text-danger"
                  >
                    <span className="block pt-2.5">{error}</span>
                  </m.p>
                ) : null}
              </AnimatePresence>

              <p id={noteId} className="mt-3 text-[0.7rem] leading-relaxed text-balance text-muted">
                {newsletter.consentNote}
                {privacyHref ? (
                  <>
                    {" "}
                    <a
                      href={privacyHref}
                      className="rounded underline decoration-white/25 underline-offset-2 transition-colors hover:text-ink"
                    >
                      Politique de confidentialité
                    </a>
                  </>
                ) : null}
              </p>
            </form>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
}
