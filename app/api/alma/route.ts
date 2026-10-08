import { NextResponse } from "next/server";
import { baseAlma, verifierAlma } from "@/lib/reglements";
import { adresseSite } from "@/lib/renseignements/n8n";

/* Paiement en 3 ou 4 fois par Alma (API Payments, page de paiement Alma).
 *
 * POST { montant, fois, prenom, nom, email, telephone, objet, retour? } → { url }
 *      retour « espace » : la page de confirmation ramène le client dans son espace
 * GET  ?pid=payment_…                                         → { etat }
 * GET  ?eligibilite=<montant en euros>                        → { eligible, minimum, maximum }
 *      Alma dit si ce montant est payable en 3 ou 4 fois, et ses bornes
 *      (en euros, absentes si Alma ne les renvoie pas). Sert à l'espace
 *      client pour masquer le bouton sous le seuil.
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
  const retour = b.retour === "espace" ? "&retour=espace" : "";
  if (!(montant >= 100)) return NextResponse.json({ message: "Montant invalide." }, { status: 400 });
  if (!prenom || !nom || !COURRIEL.test(email)) return NextResponse.json({ message: "Prénom, nom et courriel requis." }, { status: 400 });

  const origine = new URL(request.url).origin;
  const r = await alma("payments", {
    payment: {
      purchase_amount: montant,
      installments_count: fois,
      return_url: `${origine}/paiement/merci?alma=1${retour}`,
      customer_cancel_url: `${origine}/paiement/plusieurs-fois${retour ? "?retour=espace" : ""}`,
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
  const q = new URL(request.url).searchParams;
  const eligibilite = q.get("eligibilite");
  if (eligibilite !== null) return NextResponse.json(await eligibiliteAlma(Number(eligibilite.replace(",", "."))));
  const pid = q.get("pid") || "";
  return NextResponse.json({ etat: (await verifierAlma(pid)).statut });
}

/* Éligibilité d'un montant au paiement en 3 ou 4 fois (API v2 d'Alma,
   POST /v2/payments/eligibility). Sans clé, ou si Alma ne répond pas :
   eligible = null, le demandeur décide ; « motif » dit pourquoi, pour la
   recette. Montants en euros. */
type Eligibilite = { eligible: boolean | null; minimum: number | null; maximum: number | null; motif: string };
const indetermine = (motif: string): Eligibilite => ({ eligible: null, minimum: null, maximum: null, motif });

async function eligibiliteAlma(montant: number): Promise<Eligibilite> {
  if (!process.env.ALMA_API_KEY) return indetermine("clé Alma absente");
  if (!(montant > 0)) return indetermine("montant invalide");
  try {
    const r = await fetch(`${baseAlma()}/v2/payments/eligibility`, {
      method: "POST",
      headers: { Authorization: `Alma-Auth ${process.env.ALMA_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        purchase_amount: Math.round(montant * 100),
        queries: [{ installments_count: 3 }, { installments_count: 4 }],
        origin: "online",
      }),
    });
    const j = (await r.json().catch(() => null)) as unknown;
    if (!r.ok) {
      const detail = j && typeof j === "object" && "message" in j ? ` : ${String((j as { message: unknown }).message)}` : "";
      return indetermine(`Alma a répondu ${r.status}${detail}`);
    }
    if (!Array.isArray(j)) return indetermine("réponse d'Alma inattendue (pas une liste)");
    const plans = j as { eligible?: boolean; constraints?: { purchase_amount?: { minimum?: number; maximum?: number } } }[];
    const bornes = plans.map((p) => p.constraints?.purchase_amount).filter(Boolean) as { minimum?: number; maximum?: number }[];
    const minimum = bornes.length ? Math.min(...bornes.map((b) => b.minimum ?? Infinity)) : Infinity;
    const maximum = bornes.length ? Math.max(...bornes.map((b) => b.maximum ?? -Infinity)) : -Infinity;
    return {
      eligible: plans.some((p) => p.eligible === true),
      minimum: Number.isFinite(minimum) ? minimum / 100 : null,
      maximum: Number.isFinite(maximum) ? maximum / 100 : null,
      motif: "réponse d'Alma",
    };
  } catch (e) {
    return indetermine(`Alma injoignable : ${e instanceof Error ? e.message : "erreur"}`);
  }
}
