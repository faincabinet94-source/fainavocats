import { NextRequest, NextResponse } from "next/server";
import { signalerReglement } from "@/lib/reglements";

/* Paiement Stancer (API v2, intentions de paiement).
 *
 * POST { amount (centimes), description, customer: { name, email } }
 *      → { redirect_url, id }  page de paiement hébergée par Stancer, qui gère
 *        le 3-D Secure. L'ancienne route /v1/checkout/ ne le déclenchait pas :
 *        les paiements étaient refusés par la banque (DSP2).
 * GET  ?id=pi_…  → { etat: "ok" | "echec" | "attente" }  au retour du client :
 *        relit l'intention chez Stancer, encaisse un paiement resté
 *        « authorized », et transmet le règlement à Airtable (lib/reglements).
 *
 * Variable Netlify : STANCER_SECRET_KEY (sprod_…). Doc : docs.stancer.com/fr/API.html */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API = "https://api.stancer.com/v2";
const OK = ["authorized", "to_capture", "capture_sent", "captured"];
const ECHEC = ["refused", "failed", "canceled", "cancelled", "expired", "disputed"];

async function stancer(chemin: string, corps?: unknown) {
  const auth = Buffer.from(`${process.env.STANCER_SECRET_KEY || ""}:`).toString("base64");
  const r = await fetch(`${API}/${chemin}`, {
    method: corps === undefined ? "GET" : "POST",
    headers: { Authorization: `Basic ${auth}`, ...(corps === undefined ? {} : { "Content-Type": "application/json" }) },
    body: corps === undefined ? undefined : JSON.stringify(corps),
  });
  return { ok: r.ok, statut: r.status, j: await r.json().catch(() => ({})) };
}

export async function POST(request: NextRequest) {
  if (!process.env.STANCER_SECRET_KEY)
    return NextResponse.json({ error: "Configuration de paiement manquante." }, { status: 500 });

  const body = await request.json().catch(() => ({}));
  const amount = Math.round(Number(body.amount));
  if (!(amount >= 100)) return NextResponse.json({ error: "Le montant minimum est de 1 €." }, { status: 400 });

  const origin = request.headers.get("origin") || "https://fain-avocats.fr";
  const description = String(body.description || "Acompte honoraires - Fain Avocats").slice(0, 64);
  const nom = String(body.customer?.name || "").trim().slice(0, 64);
  const email = String(body.customer?.email || "").trim().slice(0, 64);

  // Le Payeur (cust_…) porte le nom et le courriel, repris ensuite dans Airtable.
  let customer: string | undefined;
  if (nom || email) {
    const c = await stancer("customers/", { ...(nom && { name: nom }), ...(email && { email }) });
    if (c.ok && typeof c.j.id === "string") customer = c.j.id;
    else console.error("[stancer] payeur non créé", c.statut, c.j?.error || c.j);
  }

  const r = await stancer("payment_intents/", {
    amount,
    currency: "eur",
    description,
    return_url: `${origin}/paiement/stancer?status=done`,
    ...(customer && { customer }),
  });
  if (!r.ok || !r.j?.url) {
    console.error("[stancer] intention refusée", r.statut, r.j?.error || r.j);
    return NextResponse.json({ error: "Erreur lors de la création du paiement. Veuillez réessayer." }, { status: 502 });
  }
  return NextResponse.json({ redirect_url: r.j.url, id: r.j.id });
}

export async function GET(request: NextRequest) {
  const id = new URL(request.url).searchParams.get("id") || "";
  if (!process.env.STANCER_SECRET_KEY || !/^pi_[A-Za-z0-9]+$/.test(id)) return NextResponse.json({ etat: "attente" });

  const r = await stancer(`payment_intents/${id}`);
  if (!r.ok) return NextResponse.json({ etat: "attente" });
  let pi = r.j;

  // Client revenu sur le site après autorisation : on encaisse.
  if (pi.status === "authorized") {
    const c = await stancer(`payment_intents/${id}/capture`, {});
    if (c.ok && c.j?.status) pi = c.j;
  }

  const statut = String(pi.status || "");
  if (ECHEC.includes(statut)) return NextResponse.json({ etat: "echec" });
  if (!OK.includes(statut)) return NextResponse.json({ etat: "attente" });

  let email = "";
  let nom = "";
  const cust = pi.customer;
  if (cust && typeof cust === "object") {
    email = cust.email || "";
    nom = cust.name || "";
  } else if (typeof cust === "string" && cust.startsWith("cust_")) {
    const c = await stancer(`customers/${cust}`);
    if (c.ok) {
      email = c.j.email || "";
      nom = c.j.name || "";
    }
  }
  await signalerReglement({
    mode: "STANCER API",
    montant: (Number(pi.amount) || 0) / 100,
    email,
    nom,
    reference: `stancer:${pi.id || id}`,
    date: pi.created ? new Date(pi.created * 1000).toISOString() : new Date().toISOString(),
    detail: String(pi.description || ""),
  });
  return NextResponse.json({ etat: "ok" });
}
