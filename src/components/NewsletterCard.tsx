"use client";

import { clsx } from "clsx";
import { AnimatePresence, m } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { useCallback, useId, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { EASE_OUT_EXPO, SPRING, TAP_SCALE } from "@/components/motion";
import type { NewsletterConfig } from "@/config/types";
import { celebrate } from "@/lib/confetti";
import { isValidEmail } from "@/lib/email";
import { enterStyle } from "@/lib/enter";
import { isPendingHref } from "@/lib/pending";
import { frTypo } from "@/lib/typo";

type Status = "idle" | "loading" | "success" | "error";

/** Délai côté navigateur : supérieur au budget Mailchimp de l’API (10 s), voir src/app/api/newsletter/route.ts. */
const CLIENT_TIMEOUT_MS = 15_000;

/** Erreur dont le message vient de notre API (déjà rédigé en français). */
class NewsletterApiError extends Error {}

/** AbortSignal.timeout manque sur Safari/iOS avant 16 : repli sur AbortController. */
function timeoutSignal(ms: number): { signal?: AbortSignal; clear: () => void } {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    return { signal: AbortSignal.timeout(ms), clear: () => undefined };
  }
  if (typeof AbortController === "undefined") return { clear: () => undefined };
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => window.clearTimeout(timer) };
}

/** Anime la hauteur de la carte entre les états (formulaire, erreur, confirmation) au lieu d’un saut. */
function AutoHeight({ children }: { children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");
  useLayoutEffect(() => {
    const element = inner.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      const size = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
      setHeight(size);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <m.div initial={false} animate={{ height }} transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}>
      <div ref={inner}>{children}</div>
    </m.div>
  );
}

function SuccessMark() {
  return (
    <span className="text-white">
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
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: 0.35, ease: EASE_OUT_EXPO }}
        />
      </svg>
    </span>
  );
}

/**
 * Module d’inscription à l’infolettre : validation, états de chargement, confirmation animée.
 * Sans JavaScript, le formulaire est envoyé en POST à l’API, qui répond par une page de confirmation.
 */
export function NewsletterCard({ newsletter, enterIndex }: { newsletter: NewsletterConfig; enterIndex: number }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const refocusInput = useRef(false);
  const uid = useId();
  const inputId = `${uid}-email`;
  const errorId = `${uid}-error`;
  const noteId = `${uid}-note`;
  const titleId = `${uid}-title`;
  const privacyLink =
    newsletter.privacyLink && !isPendingHref(newsletter.privacyLink.href) ? newsletter.privacyLink : undefined;

  const focusOnMount = useCallback((element: HTMLElement | null) => element?.focus({ preventScroll: true }), []);
  const inputCallbackRef = useCallback((element: HTMLInputElement | null) => {
    inputRef.current = element;
    if (element && refocusInput.current) {
      refocusInput.current = false;
      element.focus();
    }
  }, []);

  function fail(message: string) {
    setStatus("error");
    setError(message);
    setAttempt((count) => count + 1);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const website = String(data.get("website") ?? "");

    if (!isValidEmail(email)) {
      fail(newsletter.invalidEmailMessage);
      inputRef.current?.focus();
      return;
    }

    setStatus("loading");
    setError(null);
    const timeout = timeoutSignal(CLIENT_TIMEOUT_MS);

    try {
      const response = await fetch(newsletter.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, website }),
        signal: timeout.signal,
      });
      const payload = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
      if (!response.ok || !payload?.ok) {
        throw new NewsletterApiError(payload?.message || newsletter.errorMessage);
      }
      setStatus("success");
      form.reset();
      void celebrate(buttonRef.current);
    } catch (caught) {
      fail(caught instanceof NewsletterApiError ? caught.message : newsletter.errorMessage);
    } finally {
      timeout.clear();
    }
  }

  const hasError = status === "error" && error !== null;
  const loading = status === "loading";
  // Une espace insécable alternée rend chaque message répété différent : il est annoncé de nouveau.
  const announcement = loading
    ? newsletter.loadingLabel
    : status === "success"
      ? `${newsletter.successTitle}. ${newsletter.successMessage}`
      : hasError
        ? `${error}${attempt % 2 ? " " : ""}`
        : "";

  return (
    <section
      id="infolettre"
      aria-labelledby={titleId}
      style={enterStyle(enterIndex)}
      className="enter relative overflow-hidden rounded-[1.4rem] glass px-5 pt-5 pb-5 text-center"
    >
      {/* Lueur d’accent en haut de carte */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-[var(--ring-1)] to-transparent opacity-70"
      />

      {/* Région d’annonce permanente (role=status : polie et atomique), hors des transitions. */}
      <p role="status" className="sr-only">
        {announcement}
      </p>

      <AutoHeight>
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
              <p className="max-w-[19rem] text-[0.8rem] leading-relaxed text-balance text-soft/85">
                {frTypo(newsletter.successMessage)}
              </p>
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
              <h2 id={titleId} className="text-[1.02rem] font-semibold tracking-[-0.01em]">
                <span className="text-gradient-subtitle">{newsletter.title}</span>
              </h2>
              <p className="mt-1 text-[0.8rem] text-balance text-soft/85">{frTypo(newsletter.description)}</p>

              <form method="post" action={newsletter.endpoint} noValidate onSubmit={handleSubmit} className="mt-4">
                <div className="flex flex-col gap-2 min-[360px]:flex-row min-[360px]:items-stretch">
                  <label htmlFor={inputId} className="sr-only">
                    {newsletter.inputLabel}
                  </label>
                  <input
                    ref={inputCallbackRef}
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
                      <span className="block pt-2.5">{frTypo(error ?? "")}</span>
                    </m.p>
                  ) : null}
                </AnimatePresence>

                <p className="mt-3 text-[0.7rem] leading-relaxed text-balance text-muted">
                  <span id={noteId}>{frTypo(newsletter.consentNote)}</span>
                  {privacyLink ? (
                    <>
                      {" "}
                      <a
                        href={privacyLink.href}
                        className="rounded underline decoration-white/25 underline-offset-2 transition-colors hover:text-ink"
                      >
                        {privacyLink.label}
                      </a>
                    </>
                  ) : null}
                </p>
              </form>
            </m.div>
          )}
        </AnimatePresence>
      </AutoHeight>
    </section>
  );
}
