import { NextRequest, NextResponse } from "next/server";
import { stancer, verifierStancer } from "@/lib/stancer";

/* Paiement Stancer (API v1, page de paiement hébergée).
 *
 * POST { amount (centimes), description, customer: { name, email } }
 *      → { redirect_url, id }  page https://payment.stancer.com/<clé publique>/<paym_…>
 * GET  ?id=paym_…  → { etat: "ok" | "echec" | "attente" }  au retour du client :
 *      relit le paiement chez Stancer, encaisse un paiement resté
 *      « authorized », et transmet le règlement à Airtable (lib/stancer).
 *      Les notifications de Stancer font de même (/api/stancer/notification).
 *
 * 3-D Secure : jusqu'au 2026-09-28 le paiement était créé sans auth ; la
 * banque le refusait (DSP2). Doc v1, « Authenticated payments » : avec la
 * page de paiement, pas d'objet device, Stancer gère l'authentification.
 *
 * Variables Netlify : STANCER_SECRET_KEY (sprod_…), STANCER_PUBLIC_KEY (pprod_…). */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!process.env.STANCER_SECRET_KEY)
    return NextResponse.json({ error: "Configuration de paiement manquante." }, { status: 500 });

  const body = await request.json().catch(() => ({}));
  const amount = Math.round(Number(body.amount));
  if (!(amount >= 100)) return NextResponse.json({ error: "Le montant minimum est de 1 €." }, { status: 400 });

  const origin = request.headers.get("origin") || "https://fain-avocats.fr";
  const description = String(body.description || "Acompte honoraires - Fain Avocats").slice(0, 64);
  const nom = String(body.customer?.name || "").trim();
  const email = String(body.customer?.email || "").trim();
  const retour = `${origin}/paiement/stancer?status=done`;

  const r = await stancer("checkout/", {
    amount,
    currency: "eur",
    description: description.length >= 3 ? description : "Acompte honoraires",
    return_url: retour,
    capture: true,
    // Forme exacte de la bibliothèque officielle (lib-php, Payment::setAuth(true)
    // puis Auth::jsonSerialize en v1) : { status: "request" }, sans return_url.
    // Un return_url dans auth rend l'objet device obligatoire : c'est ce qui
    // faisait refuser la création le 2026-09-28.
    auth: { status: "request" },
    ...(nom || email ? { customer: { ...(nom && { name: nom }), ...(email && { email }) } } : {}),
  });
  const id = r.j?.id;
  if (!r.ok || typeof id !== "string") {
    console.error("[stancer] paiement refusé à la création", r.statut, r.j?.error || r.j);
    // Motif renvoyé par Stancer, affiché pour le diagnostic (pas de donnée sensible).
    const motif = typeof r.j?.error?.message === "string" ? r.j.error.message : typeof r.j?.error === "string" ? r.j.error : "";
    const detail = motif ? ` (Stancer : ${String(motif).slice(0, 200)})` : ` (code ${r.statut})`;
    return NextResponse.json({ error: `Erreur lors de la création du paiement${detail}. Veuillez réessayer.` }, { status: 502 });
  }
  const url =
    r.j.payment_page_url ||
    (process.env.STANCER_PUBLIC_KEY ? `https://payment.stancer.com/${process.env.STANCER_PUBLIC_KEY}/${id}?lang=fr` : "");
  if (!url) return NextResponse.json({ error: "Impossible de générer le lien de paiement." }, { status: 500 });
  return NextResponse.json({ redirect_url: url, id });
}

export async function GET(request: NextRequest) {
  const id = new URL(request.url).searchParams.get("id") || "";
  return NextResponse.json({ etat: (await verifierStancer(id)).etat });
}
