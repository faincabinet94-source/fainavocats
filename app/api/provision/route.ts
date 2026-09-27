import { NextResponse } from "next/server";
import { PRIX_PROVISIONS, type Provision } from "@/lib/paiement";

/* Paiement de la provision intégré au site (Stripe Checkout intégré).
 *
 * POST { part: "totale" | "moitie", email? } → { clientSecret, publishableKey }
 * GET  ?session_id=cs_… → { statut } (« complete » quand le paiement est passé)
 *
 * Variables Netlify : STRIPE_SECRET_KEY (clé restreinte, droit d'écriture sur
 * Checkout Sessions suffit) et STRIPE_PUBLISHABLE_KEY. Sans elles, la route
 * répond 503 et le site retombe sur les liens de paiement Stripe. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COURRIEL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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
  const secret = process.env.STRIPE_SECRET_KEY;
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  if (!secret || !publishableKey) return NextResponse.json({ message: "Paiement intégré non configuré" }, { status: 503 });

  const b = await request.json().catch(() => ({}));
  const part: Provision = b.part === "moitie" ? "moitie" : "totale";
  const email = typeof b.email === "string" && COURRIEL.test(b.email.trim()) ? b.email.trim() : "";
  const origine = new URL(request.url).origin;

  const parametres = (uiMode: string) => {
    const p = new URLSearchParams({
      mode: "payment",
      ui_mode: uiMode,
      locale: "fr",
      "line_items[0][price]": PRIX_PROVISIONS[part],
      "line_items[0][quantity]": "1",
      return_url: `${origine}/provision-reglee?session_id={CHECKOUT_SESSION_ID}`,
      "metadata[origine]": "site, provision",
    });
    if (email) p.set("customer_email", email);
    return p;
  };

  /* « embedded_page » dans les versions récentes de l'API, « embedded » avant :
     le compte garde la version de l'API de sa création, on essaie les deux. */
  let r = await stripe("checkout/sessions", parametres("embedded_page"));
  if (!r.ok && /ui_mode/.test(JSON.stringify(r.j))) r = await stripe("checkout/sessions", parametres("embedded"));
  if (!r.ok || !r.j.client_secret) {
    console.error("[provision] création de session refusée", r.j?.error?.message);
    return NextResponse.json({ message: "Paiement indisponible" }, { status: 502 });
  }
  return NextResponse.json({ clientSecret: r.j.client_secret, publishableKey });
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("session_id") || "";
  if (!process.env.STRIPE_SECRET_KEY || !/^cs_[A-Za-z0-9_]+$/.test(id)) return NextResponse.json({ statut: "inconnu" });
  const r = await stripe(`checkout/sessions/${id}`);
  return NextResponse.json({ statut: r.ok ? r.j.status : "inconnu" });
}
