import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { siteConfig } from "@/config/links.config";

/**
 * Inscription à l’infolettre (Mailchimp, déjà utilisé par l’AEEBM).
 *
 * Variables d’environnement (Vercel › Settings › Environment Variables) :
 *   MAILCHIMP_API_KEY      Clé d’API Mailchimp (se termine par « -us21 », « -us6 », etc.)
 *   MAILCHIMP_AUDIENCE_ID  Identifiant de l’audience (Audience › Settings › Audience name and defaults)
 *
 * Double consentement (statut « pending ») : Mailchimp envoie un courriel de confirmation,
 * conformément à la LCAP et à la Loi 25.
 * Sans configuration : simulation en développement, erreur explicite en production.
 */

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_EMAIL_LENGTH = 254;

type Payload = { ok: boolean; message?: string };

function json(body: Payload, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  let email = "";
  let honeypot = "";
  try {
    const body = (await request.json()) as { email?: unknown; website?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    honeypot = typeof body.website === "string" ? body.website : "";
  } catch {
    return json({ ok: false, message: "Requête invalide." }, 400);
  }

  // Robot détecté : on répond comme si tout allait bien, sans rien enregistrer.
  if (honeypot.length > 0) return json({ ok: true });

  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return json({ ok: false, message: "Veuillez entrer une adresse courriel valide." }, 400);
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[infolettre] Simulation (Mailchimp non configuré) : ${email}`);
      return json({ ok: true });
    }
    console.error("[infolettre] MAILCHIMP_API_KEY ou MAILCHIMP_AUDIENCE_ID manquant.");
    return json({ ok: false, message: siteConfig.newsletter.errorMessage }, 503);
  }

  const dataCenter = apiKey.split("-").pop();
  const subscriberHash = createHash("md5").update(email).digest("hex");
  const url = `https://${dataCenter}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriberHash}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${Buffer.from(`aeebm:${apiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status_if_new: "pending",
        tags: ["page-liens"],
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (response.ok) return json({ ok: true });

    const detail = (await response.json().catch(() => null)) as { title?: string; detail?: string } | null;
    if (detail?.title === "Member Exists") return json({ ok: true });
    if (detail?.title === "Invalid Resource") {
      return json({ ok: false, message: "Cette adresse courriel semble invalide." }, 400);
    }
    if (detail?.title === "Forgotten Email Not Subscribed") {
      return json(
        { ok: false, message: "Cette adresse s’est désabonnée : réinscrivez-vous depuis un courriel de l’AEEBM." },
        400,
      );
    }
    console.error("[infolettre] Erreur Mailchimp", response.status, detail?.title, detail?.detail);
    return json({ ok: false, message: siteConfig.newsletter.errorMessage }, 502);
  } catch (error) {
    console.error("[infolettre] Mailchimp injoignable", error);
    return json({ ok: false, message: siteConfig.newsletter.errorMessage }, 502);
  }
}
