import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { finAbonnement } from "@/lib/mensualites";
import { signalerReglement } from "@/lib/reglements";

/* Webhook Stripe « invoice.paid », pour les mensualités créées par le site
 * (abonnements dont les métadonnées portent « echeances »).
 *
 *  - première facture (billing_reason subscription_create) : pose la date de
 *    fin de l'abonnement si le client n'est pas revenu sur le site. Le
 *    paiement lui-même arrive déjà dans Airtable par l'automatisation
 *    « Stripe » (checkout.session.completed) ;
 *  - échéances suivantes (subscription_cycle) : transmises à Airtable comme
 *    règlement « Stripe abo » (voir lib/reglements.ts).
 *
 * Les autres factures du compte sont ignorées. Signature vérifiée avec
 * STRIPE_WEBHOOK_SECRET (secret de signature de l'endpoint, whsec_…). */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOLERANCE = 300; // secondes

function signatureValide(corps: string, entete: string, secret: string): boolean {
  const parties = entete.split(",").map((p) => p.split("="));
  const t = parties.find(([k]) => k === "t")?.[1];
  const signatures = parties.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!t || !signatures.length || Math.abs(Date.now() / 1000 - Number(t)) > TOLERANCE) return false;
  const attendu = Buffer.from(createHmac("sha256", secret).update(`${t}.${corps}`).digest("hex"));
  return signatures.some((s) => {
    const recu = Buffer.from(s || "");
    return recu.length === attendu.length && timingSafeEqual(recu, attendu);
  });
}

async function stripe(chemin: string, corps?: URLSearchParams) {
  const r = await fetch(`https://api.stripe.com/v1/${chemin}`, {
    method: corps ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      ...(corps ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: corps,
  });
  return { ok: r.ok, j: await r.json().catch(() => ({})) };
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
  const corps = await request.text();
  if (!secret || !process.env.STRIPE_SECRET_KEY) return NextResponse.json({ ok: false }, { status: 503 });
  if (!signatureValide(corps, request.headers.get("stripe-signature") || "", secret))
    return NextResponse.json({ ok: false }, { status: 400 });

  const evenement = JSON.parse(corps);
  if (evenement.type !== "invoice.paid") return NextResponse.json({ ok: true });
  const facture = evenement.data?.object || {};
  // Emplacement de l'abonnement selon la version d'API de l'endpoint.
  const abonnement =
    facture.subscription || facture.parent?.subscription_details?.subscription || "";
  if (typeof abonnement !== "string" || !abonnement.startsWith("sub_")) return NextResponse.json({ ok: true });

  const s = await stripe(`subscriptions/${abonnement}`);
  if (!s.ok) return NextResponse.json({ ok: false }, { status: 502 });
  const sub = s.j;
  const echeances = Number(sub.metadata?.echeances);
  if (!echeances) return NextResponse.json({ ok: true }); // abonnement non créé par le site

  if (!sub.cancel_at) {
    const fin = finAbonnement(sub.billing_cycle_anchor || sub.start_date, echeances);
    await stripe(`subscriptions/${sub.id}`, new URLSearchParams({ cancel_at: String(fin), proration_behavior: "none" }));
  }

  if (facture.billing_reason === "subscription_cycle") {
    const transmis = await signalerReglement({
      mode: "Stripe abo",
      montant: (Number(facture.amount_paid) || 0) / 100,
      email: String(facture.customer_email || ""),
      nom: String(facture.customer_name || sub.metadata?.client || ""),
      reference: `stripe:${facture.id}`,
      date: new Date((facture.status_transitions?.paid_at || evenement.created) * 1000).toISOString(),
      detail: `Mensualité - ${sub.description || ""}`.trim(),
    });
    if (!transmis) return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
