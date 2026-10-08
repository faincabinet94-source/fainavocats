import { NextResponse } from "next/server";

/* Règlement d'honoraires d'un montant libre, Stripe Checkout intégré au site
 * (solde, acompte, montant au choix). Ouvert depuis l'espace client, qui
 * passe le solde et le courriel ; utilisable aussi par un lien du cabinet.
 *
 * POST { montant (euros), email?, objet?, retour? } → { clientSecret, publishableKey }
 *      retour « espace » : la page de confirmation ramène le client dans son espace
 * GET  ?session_id=cs_… → { statut } (« complete » quand le paiement est passé)
 *
 * Remontée dans Airtable : la notification Stripe « checkout.session.completed »
 * du compte alimente l'automatisation Airtable « Stripe » (ligne dans
 * 💲Règlements), comme pour la provision. Rien de plus à brancher.
 *
 * Variables Netlify : STRIPE_SECRET_KEY (la clé restreinte doit pouvoir créer
 * des Checkout Sessions avec un prix à la volée : Products et Prices en
 * écriture, comme pour les mensualités) et STRIPE_PUBLISHABLE_KEY. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COURRIEL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MINIMUM = 1; // euros
const MAXIMUM = 20000;

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
  if (!secret || !publishableKey) return NextResponse.json({ message: "Le paiement en ligne n'est pas disponible pour le moment. Appelez-nous au 01 40 68 02 37." }, { status: 503 });

  const b = await request.json().catch(() => ({}));
  const montant = Number(b.montant);
  if (!(montant >= MINIMUM) || montant > MAXIMUM) return NextResponse.json({ message: `Montant entre ${MINIMUM} € et ${MAXIMUM} €.` }, { status: 400 });
  const centimes = Math.round(montant * 100);
  const email = typeof b.email === "string" && COURRIEL.test(b.email.trim()) ? b.email.trim() : "";
  const objet = String(b.objet || "").trim().slice(0, 80) || "Honoraires";
  const retour = b.retour === "espace" ? "&retour=espace" : "";
  const origine = new URL(request.url).origin;

  const parametres = (uiMode: string) => {
    const p = new URLSearchParams({
      mode: "payment",
      ui_mode: uiMode,
      locale: "fr",
      "line_items[0][price_data][currency]": "eur",
      "line_items[0][price_data][unit_amount]": String(centimes),
      "line_items[0][price_data][product_data][name]": `${objet} - Fain Avocats`,
      "line_items[0][quantity]": "1",
      return_url: `${origine}/paiement/merci?stripe={CHECKOUT_SESSION_ID}${retour}`,
      "metadata[origine]": "site, honoraires",
      "metadata[objet]": objet,
    });
    if (email) p.set("customer_email", email);
    return p;
  };

  let r = await stripe("checkout/sessions", parametres("embedded_page"));
  if (!r.ok && /ui_mode/.test(JSON.stringify(r.j))) r = await stripe("checkout/sessions", parametres("embedded"));
  if (!r.ok || !r.j.client_secret) {
    console.error("[honoraires] création de session refusée", r.j?.error?.message);
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
