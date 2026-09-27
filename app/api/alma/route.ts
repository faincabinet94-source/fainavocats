import { NextResponse } from "next/server";
import { baseAlma, verifierAlma } from "@/lib/reglements";
import { adresseSite } from "@/lib/renseignements/n8n";

/* Paiement en 3 ou 4 fois par Alma (API Payments, page de paiement Alma).
 *
 * POST { montant, fois, prenom, nom, email, telephone, objet } → { url }
 * GET  ?pid=payment_…                                         → { etat }
 *
 * Un paiement accepté est transmis à Airtable (voir lib/reglements.ts), à la
 * notification d'Alma (/api/alma/notification) comme au retour du client.
 *
 * Variable Netlify : ALMA_API_KEY (sk_live_… ; une clé sk_test_… passe par le
 * bac à sable d'Alma). Alma fixe lui-même les montants minimum et maximum
 * autorisés : son message d'erreur est renvoyé tel quel. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COURRIEL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function alma(chemin: string, corps?: unknown) {
  const r = await fetch(`${baseAlma()}/v1/${chemin}`, {
    method: corps ? "POST" : "GET",
    headers: {
      Authorization: `Alma-Auth ${process.env.ALMA_API_KEY}`,
      ...(corps ? { "Content-Type": "application/json" } : {}),
    },
    body: corps ? JSON.stringify(corps) : undefined,
  });
  return { ok: r.ok, j: await r.json().catch(() => ({})) };
}

export async function POST(request: Request) {
  if (!process.env.ALMA_API_KEY)
    return NextResponse.json({ message: "Le paiement en plusieurs fois n'est pas encore disponible. Appelez-nous au 01 40 68 02 37." }, { status: 503 });

  const b = await request.json().catch(() => ({}));
  const montant = Math.round(Number(b.montant) * 100);
  const fois = b.fois === 4 || b.fois === "4" ? 4 : 3;
  const prenom = String(b.prenom || "").trim().slice(0, 60);
  const nom = String(b.nom || "").trim().slice(0, 60);
  const email = String(b.email || "").trim();
  const telephone = String(b.telephone || "").trim().slice(0, 30);
  const objet = String(b.objet || "").trim().slice(0, 80);
  if (!(montant >= 100)) return NextResponse.json({ message: "Montant invalide." }, { status: 400 });
  if (!prenom || !nom || !COURRIEL.test(email)) return NextResponse.json({ message: "Prénom, nom et courriel requis." }, { status: 400 });

  const origine = new URL(request.url).origin;
  const r = await alma("payments", {
    payment: {
      purchase_amount: montant,
      installments_count: fois,
      return_url: `${origine}/paiement/merci?alma=1`,
      customer_cancel_url: `${origine}/paiement/plusieurs-fois`,
      ipn_callback_url: `${adresseSite(request)}/api/alma/notification`,
      locale: "fr",
      custom_data: { objet, origine: "site fain-avocats.fr" },
    },
    customer: { first_name: prenom, last_name: nom, email, phone: telephone || undefined },
  });
  if (!r.ok || !r.j?.url) {
    console.error("[alma] création refusée", r.j?.message || r.j?.error_code);
    const detail = typeof r.j?.message === "string" ? ` (${r.j.message})` : "";
    return NextResponse.json({ message: `Alma n'a pas accepté ce paiement${detail}.` }, { status: 502 });
  }
  return NextResponse.json({ url: r.j.url });
}

export async function GET(request: Request) {
  const pid = new URL(request.url).searchParams.get("pid") || "";
  return NextResponse.json({ etat: (await verifierAlma(pid)).statut });
}
