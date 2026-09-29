import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { siteConfig } from "@/config/links.config";
import { isValidEmail } from "@/lib/email";

/**
 * Inscription à l’infolettre (Mailchimp, déjà utilisé par l’AEEBM).
 *
 * Variables d’environnement (Vercel › Settings › Environment Variables) :
 *   MAILCHIMP_API_KEY      Clé d’API Mailchimp (se termine par « -us21 », « -us6 », etc.)
 *   MAILCHIMP_AUDIENCE_ID  Identifiant de l’audience (Audience › Settings › Audience name and defaults)
 *
 * Double consentement : toute nouvelle adresse est créée « pending » et Mailchimp envoie un courriel
 * de confirmation (LCAP, Loi 25). Sans configuration : simulation en développement, erreur explicite en production.
 */

export const runtime = "nodejs";

const MAX_BODY_BYTES = 1024;
const DATA_CENTER = /^[a-z]{2}\d{1,3}$/;
const { newsletter } = siteConfig;

type Payload = { ok: boolean; message?: string };
type MemberStatus = "subscribed" | "unsubscribed" | "cleaned" | "pending" | "transactional" | "archived";

function json(body: Payload, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** Refuse les envois provenant d’un autre site (les clients hors navigateur n’envoient pas d’en-tête Origin). */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ ok: false, message: "Requête refusée." }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return json({ ok: false, message: "Requête invalide." }, 415);
  }

  let email = "";
  let honeypot = "";
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json({ ok: false, message: "Requête invalide." }, 413);
    const body = JSON.parse(raw) as { email?: unknown; website?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    honeypot = typeof body.website === "string" ? body.website : "";
  } catch {
    return json({ ok: false, message: "Requête invalide." }, 400);
  }

  // Robot détecté : réponse neutre, rien n’est enregistré.
  if (honeypot.length > 0) return json({ ok: true });

  if (!isValidEmail(email)) return json({ ok: false, message: newsletter.invalidEmailMessage }, 400);

  const apiKey = process.env.MAILCHIMP_API_KEY?.trim();
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID?.trim();
  const dataCenter = apiKey?.split("-").pop() ?? "";

  if (!apiKey || !audienceId || !DATA_CENTER.test(dataCenter)) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[infolettre] Simulation (Mailchimp non configuré) : ${email}`);
      return json({ ok: true });
    }
    console.error("[infolettre] MAILCHIMP_API_KEY ou MAILCHIMP_AUDIENCE_ID absent ou mal formé.");
    return json({ ok: false, message: newsletter.errorMessage }, 503);
  }

  const memberUrl = `https://${dataCenter}.api.mailchimp.com/3.0/lists/${encodeURIComponent(audienceId)}/members/${createHash("md5").update(email).digest("hex")}`;
  const call = (method: "PUT" | "PATCH" | "POST", path: string, body: object, timeout = 8000) =>
    fetch(`${memberUrl}${path}`, {
      method,
      headers: {
        Authorization: `Basic ${Buffer.from(`aeebm:${apiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(timeout),
    });

  try {
    // 1. Création (« pending » : Mailchimp envoie le courriel de confirmation) ou lecture du contact existant.
    const upsert = await call("PUT", "", { email_address: email, status_if_new: "pending", language: "fr" });

    if (!upsert.ok) {
      const detail = (await upsert.json().catch(() => null)) as { title?: string; detail?: string } | null;
      if (detail?.title === "Invalid Resource")
        return json({ ok: false, message: newsletter.invalidEmailMessage }, 400);
      if (detail?.title === "Forgotten Email Not Subscribed")
        return json({ ok: false, message: newsletter.removedMessage }, 409);
      console.error("[infolettre] Erreur Mailchimp", upsert.status, detail?.title);
      return json({ ok: false, message: newsletter.errorMessage }, 502);
    }

    const member = (await upsert.json().catch(() => null)) as { status?: MemberStatus } | null;
    let message: string | undefined;

    switch (member?.status) {
      case "subscribed":
        message = newsletter.alreadySubscribedMessage;
        break;
      case "cleaned":
        return json({ ok: false, message: newsletter.removedMessage }, 409);
      case "unsubscribed":
      case "archived":
      case "transactional": {
        // 2. Réabonnement : nouveau double consentement (Mailchimp envoie un courriel de confirmation).
        const resubscribe = await call("PATCH", "", { status: "pending" });
        if (!resubscribe.ok) {
          console.error("[infolettre] Réabonnement refusé", resubscribe.status);
          return json({ ok: false, message: newsletter.errorMessage }, 502);
        }
        break;
      }
      default:
        // « pending » : nouvelle inscription, ou confirmation déjà envoyée.
        break;
    }

    // 3. Étiquette de provenance (au mieux : un échec n’annule jamais l’inscription).
    await call("POST", "/tags", { tags: [{ name: "page-liens", status: "active" }] }, 4000).catch(() => undefined);

    return json({ ok: true, message });
  } catch (error) {
    console.error("[infolettre] Mailchimp injoignable", error instanceof Error ? error.name : "erreur");
    return json({ ok: false, message: newsletter.errorMessage }, 502);
  }
}
