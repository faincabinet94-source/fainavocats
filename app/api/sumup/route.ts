import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { verifierSumup } from "@/lib/reglements";
import { adresseSite } from "@/lib/renseignements/n8n";

/* Versement libre par SumUp (API Checkouts + module de carte intégré).
 *
 * POST { montant, nom, email, objet } → { id }  (id de checkout pour SumUpCard.mount)
 * GET  ?id=…                          → { statut } (PAID quand le paiement est passé)
 *
 * Un paiement passé est transmis à Airtable (voir lib/reglements.ts), à la
 * notification de SumUp (/api/sumup/notification) comme au retour du client.
 *
 * Variables Netlify : SUMUP_API_KEY (clé secrète sup_sk_…) et
 * SUMUP_MERCHANT_CODE (code marchand, commence par M). */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COURRIEL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX = 20000;

async function sumup(chemin: string, corps?: unknown) {
  const r = await fetch(`https://api.sumup.com/v0.1/${chemin}`, {
    method: corps ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${process.env.SUMUP_API_KEY}`,
      ...(corps ? { "Content-Type": "application/json" } : {}),
    },
    body: corps ? JSON.stringify(corps) : undefined,
  });
  return { ok: r.ok, j: await r.json().catch(() => ({})) };
}

export async function POST(request: Request) {
  if (!process.env.SUMUP_API_KEY || !process.env.SUMUP_MERCHANT_CODE)
    return NextResponse.json({ message: "Le paiement par carte n'est pas encore disponible. Appelez-nous au 01 40 68 02 37." }, { status: 503 });

  const b = await request.json().catch(() => ({}));
  const montant = Math.round(Number(b.montant) * 100) / 100;
  const nom = String(b.nom || "").trim().slice(0, 80);
  const email = String(b.email || "").trim();
  const objet = String(b.objet || "").trim().slice(0, 80);
  if (!(montant >= 1 && montant <= MAX)) return NextResponse.json({ message: `Montant entre 1 et ${MAX} €.` }, { status: 400 });
  if (!nom || !COURRIEL.test(email)) return NextResponse.json({ message: "Nom et courriel requis." }, { status: 400 });

  const origine = new URL(request.url).origin;
  const reference = randomUUID();
  const r = await sumup("checkouts", {
    checkout_reference: reference,
    amount: montant,
    currency: "EUR",
    merchant_code: process.env.SUMUP_MERCHANT_CODE,
    description: `Versement ${nom}${objet ? ` - ${objet}` : ""} (${email})`.slice(0, 255),
    redirect_url: `${origine}/paiement/merci?sumup=${reference}${b.retour === "espace" ? "&retour=espace" : ""}`,
    return_url: `${adresseSite(request)}/api/sumup/notification`,
  });
  const id = r.j?.id || r.j?.checkout_id;
  if (!r.ok || !id) {
    console.error("[sumup] création refusée", r.j?.message || r.j?.error_code);
    return NextResponse.json({ message: "Paiement indisponible pour le moment." }, { status: 502 });
  }
  return NextResponse.json({ id });
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") || "";
  return NextResponse.json({ statut: (await verifierSumup(id)).statut });
}
