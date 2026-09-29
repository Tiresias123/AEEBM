import { createHash } from "node:crypto";
import { after, NextResponse } from "next/server";
import { siteConfig } from "@/config/links.config";
import { isValidEmail } from "@/lib/email";
import { frTypo } from "@/lib/typo";

/**
 * Inscription à l’infolettre (Mailchimp, déjà utilisé par l’AEEBM).
 *
 * Variables d’environnement (Vercel › Settings › Environment Variables) :
 *   MAILCHIMP_API_KEY      Clé d’API Mailchimp (se termine par « -us21 », « -us6 », etc.)
 *   MAILCHIMP_AUDIENCE_ID  Identifiant de l’audience (Audience › Settings › Audience name and defaults)
 *
 * - Double consentement : toute nouvelle adresse est créée « pending » et Mailchimp envoie un courriel
 *   de confirmation (LCAP, Loi 25).
 * - Réponse identique pour une nouvelle adresse et une adresse déjà abonnée : l’API ne révèle pas qui est inscrit.
 * - Limite de débit par adresse IP (au mieux, par instance). Pour une protection durable, ajouter une règle
 *   « Rate limit » sur /api/newsletter dans Vercel › Firewall.
 * - Sans JavaScript, le formulaire arrive en POST classique : réponse sous forme de courte page HTML.
 * - Sans configuration : simulation en développement, erreur explicite en production.
 */

export const runtime = "nodejs";

const MAX_BODY_BYTES = 1024;
const DATA_CENTER = /^[a-z]{2}\d{1,3}$/;
/** Budget total des appels Mailchimp bloquants, sous le délai de 15 s du formulaire (NewsletterCard). */
const MAILCHIMP_BUDGET_MS = 10_000;
const RATE_WINDOW_MS = 10 * 60_000;
// Plusieurs membres peuvent partager une même adresse IP (Wi-Fi de l’École, événements) : limite généreuse.
const RATE_PER_IP = 20;
const RATE_GLOBAL = 300;

const { newsletter, association } = siteConfig;

type Payload = { ok: boolean; message?: string };
type MemberStatus = "subscribed" | "unsubscribed" | "cleaned" | "pending" | "transactional" | "archived";

const hits = new Map<string, number[]>();

/** Limiteur en mémoire (fenêtre glissante) : borne les envois de courriels de confirmation en rafale. */
function isRateLimited(key: string, max: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  const limited = recent.length >= max;
  if (!limited) recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return limited;
}

function clientIp(request: Request): string {
  return request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "inconnu";
}

/** Seul client légitime : la page elle-même (un navigateur envoie toujours Origin ou Sec-Fetch-Site sur un POST). */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin || origin === "null") return request.headers.get("sec-fetch-site") === "same-origin";
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char] ?? char);
}

/** Page de réponse minimale pour un envoi sans JavaScript. */
function htmlPage({ ok, message }: Payload, status: number): Response {
  const title = ok ? newsletter.successTitle : "Inscription impossible";
  const text = frTypo(message ?? (ok ? newsletter.successMessage : newsletter.errorMessage));
  const body = `<!doctype html><html lang="fr-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(title)} · ${escapeHtml(association.acronym)}</title></head><body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#08090d;color:#fff;font:16px/1.55 system-ui,sans-serif"><main style="max-width:28rem;padding:2rem;text-align:center"><h1 style="font-size:1.4rem">${escapeHtml(title)}</h1><p style="color:#d4d4d8">${escapeHtml(text)}</p><p><a href="/" style="color:#f0abfc">Retour à la page de l’${escapeHtml(association.acronym)}</a></p></main></body></html>`;
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

async function subscribe(email: string, honeypot: string): Promise<{ status: number; body: Payload }> {
  // Robot détecté : réponse neutre, rien n’est enregistré.
  if (honeypot.length > 0) return { status: 200, body: { ok: true } };
  if (!isValidEmail(email)) return { status: 400, body: { ok: false, message: newsletter.invalidEmailMessage } };

  const apiKey = process.env.MAILCHIMP_API_KEY?.trim();
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID?.trim();
  const dataCenter = apiKey?.split("-").pop() ?? "";

  if (!apiKey || !audienceId || !DATA_CENTER.test(dataCenter)) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[infolettre] Simulation (Mailchimp non configuré) : ${email}`);
      return { status: 200, body: { ok: true } };
    }
    console.error("[infolettre] MAILCHIMP_API_KEY ou MAILCHIMP_AUDIENCE_ID absent ou mal formé.");
    return { status: 503, body: { ok: false, message: newsletter.errorMessage } };
  }

  const memberUrl = `https://${dataCenter}.api.mailchimp.com/3.0/lists/${encodeURIComponent(audienceId)}/members/${createHash("md5").update(email).digest("hex")}`;
  const authorization = `Basic ${Buffer.from(`aeebm:${apiKey}`).toString("base64")}`;
  const deadline = AbortSignal.timeout(MAILCHIMP_BUDGET_MS);
  const call = (method: "PUT" | "PATCH" | "POST", path: string, body: object, signal: AbortSignal = deadline) =>
    fetch(`${memberUrl}${path}`, {
      method,
      headers: { Authorization: authorization, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal,
    });

  try {
    // 1. Création (« pending » : Mailchimp envoie le courriel de confirmation) ou lecture du contact existant.
    const upsert = await call("PUT", "", { email_address: email, status_if_new: "pending", language: "fr" });

    if (!upsert.ok) {
      const detail = (await upsert.json().catch(() => null)) as { title?: string } | null;
      if (detail?.title === "Invalid Resource") {
        return { status: 400, body: { ok: false, message: newsletter.invalidEmailMessage } };
      }
      if (detail?.title === "Forgotten Email Not Subscribed") {
        return { status: 409, body: { ok: false, message: newsletter.removedMessage } };
      }
      console.error("[infolettre] Erreur Mailchimp", upsert.status, detail?.title);
      return { status: 502, body: { ok: false, message: newsletter.errorMessage } };
    }

    const member = (await upsert.json().catch(() => null)) as { status?: MemberStatus } | null;
    switch (member?.status) {
      case "cleaned":
        return { status: 409, body: { ok: false, message: newsletter.removedMessage } };
      case "unsubscribed":
      case "archived":
      case "transactional": {
        // 2. Réabonnement : nouveau double consentement (Mailchimp envoie un courriel de confirmation).
        const resubscribe = await call("PATCH", "", { status: "pending" });
        if (!resubscribe.ok) {
          console.error("[infolettre] Réabonnement refusé", resubscribe.status);
          return { status: 502, body: { ok: false, message: newsletter.errorMessage } };
        }
        break;
      }
      default:
        // « pending » ou « subscribed » : même réponse, pour ne pas révéler qui est déjà inscrit.
        break;
    }

    // 3. Étiquette de provenance, après la réponse (au mieux : un échec n’annule jamais l’inscription).
    after(() =>
      call("POST", "/tags", { tags: [{ name: "page-liens", status: "active" }] }, AbortSignal.timeout(4000)).then(
        (response) => {
          if (!response.ok) console.warn("[infolettre] Étiquette non appliquée", response.status);
        },
        () => undefined,
      ),
    );

    return { status: 200, body: { ok: true } };
  } catch (error) {
    console.error("[infolettre] Mailchimp injoignable", error instanceof Error ? error.name : "erreur");
    return { status: 502, body: { ok: false, message: newsletter.errorMessage } };
  }
}

export async function POST(request: Request) {
  const type = request.headers.get("content-type") ?? "";
  const isForm = type.startsWith("application/x-www-form-urlencoded");
  const reply = (body: Payload, status = 200) =>
    isForm ? htmlPage(body, status) : NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

  if (!isSameOrigin(request)) return reply({ ok: false, message: "Requête refusée." }, 403);
  if (!isForm && !type.startsWith("application/json")) return reply({ ok: false, message: "Requête invalide." }, 415);
  if (isRateLimited(`ip:${clientIp(request)}`, RATE_PER_IP) || isRateLimited("global", RATE_GLOBAL)) {
    return reply({ ok: false, message: "Trop de tentatives. Réessayez dans quelques minutes." }, 429);
  }

  let email = "";
  let honeypot = "";
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return reply({ ok: false, message: "Requête invalide." }, 413);
    const body = (isForm ? Object.fromEntries(new URLSearchParams(raw)) : JSON.parse(raw)) as {
      email?: unknown;
      website?: unknown;
    };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    honeypot = typeof body.website === "string" ? body.website : "";
  } catch {
    return reply({ ok: false, message: "Requête invalide." }, 400);
  }

  const result = await subscribe(email, honeypot);
  return reply(result.body, result.status);
}
