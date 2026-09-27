import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { finAbonnement, lirePlan, signerPlan, type Plan } from "@/lib/mensualites";

/* Honoraires réglés en mensualités (abonnement Stripe à durée fixe).
 *
 * POST { action: "lien", code, nom, email, mensualite, echeances, objet }
 *      → { url }   (réservé au cabinet : code = PAIEMENT_ADMIN_CODE)
 * POST { action: "session", p } → { clientSecret, publishableKey, plan }
 * GET  ?p=…            → { plan }  (conditions affichées au client)
 * GET  ?session_id=…   → { statut, echeances, fin }
 *
 * Stripe Checkout ne sait pas limiter un abonnement à N échéances : la date
 * de fin (cancel_at) est posée au retour du client, et rattrapée à chaque
 * création de lien pour les abonnements qui n'en auraient pas encore.
 * Variables Netlify : STRIPE_SECRET_KEY (clé restreinte : Checkout Sessions et
 * Subscriptions en écriture), STRIPE_PUBLISHABLE_KEY, PAIEMENT_ADMIN_CODE. */

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

function codeValide(code: unknown): boolean {
  const attendu = process.env.PAIEMENT_ADMIN_CODE || "";
  if (!attendu || typeof code !== "string") return false;
  const a = Buffer.from(attendu);
  const b = Buffer.from(code);
  return a.length === b.length && timingSafeEqual(a, b);
}

/* Pose la date de fin d'un abonnement créé par ce site, s'il n'en a pas. */
async function fixerFin(sub: { id: string; cancel_at: number | null; billing_cycle_anchor: number; start_date: number; metadata?: Record<string, string> }) {
  const n = Number(sub.metadata?.echeances);
  if (!n || sub.cancel_at) return sub.cancel_at;
  const fin = finAbonnement(sub.billing_cycle_anchor || sub.start_date, n);
  const r = await stripe(`subscriptions/${sub.id}`, new URLSearchParams({ cancel_at: String(fin), proration_behavior: "none" }));
  return r.ok ? fin : null;
}

async function rattraper() {
  const r = await stripe("subscriptions?status=active&limit=100");
  for (const s of r.j?.data || []) if (s.metadata?.echeances && !s.cancel_at) await fixerFin(s);
}

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PUBLISHABLE_KEY)
    return NextResponse.json({ message: "Paiement en mensualités non configuré." }, { status: 503 });
  const b = await request.json().catch(() => ({}));

  if (b.action === "lien") {
    if (!codeValide(b.code)) return NextResponse.json({ message: "Code d'accès incorrect." }, { status: 401 });
    const plan: Plan = {
      nom: String(b.nom || "").trim().slice(0, 80),
      email: String(b.email || "").trim(),
      mensualite: Math.round(Number(b.mensualite) * 100),
      echeances: Math.round(Number(b.echeances)),
      objet: String(b.objet || "").trim().slice(0, 80) || "Honoraires",
    };
    if (!plan.nom || !COURRIEL.test(plan.email)) return NextResponse.json({ message: "Nom et courriel du client requis." }, { status: 400 });
    if (!(plan.mensualite >= 100 && plan.echeances >= 2 && plan.echeances <= 36))
      return NextResponse.json({ message: "Mensualité d'au moins 1 € et de 2 à 36 échéances." }, { status: 400 });
    await rattraper().catch(() => {});
    return NextResponse.json({ url: `${new URL(request.url).origin}/paiement/mensualites?p=${signerPlan(plan)}` });
  }

  if (b.action === "session") {
    const plan = lirePlan(String(b.p || ""));
    if (!plan) return NextResponse.json({ message: "Lien de paiement invalide ou modifié." }, { status: 400 });
    const origine = new URL(request.url).origin;
    const parametres = (uiMode: string) =>
      new URLSearchParams({
        mode: "subscription",
        ui_mode: uiMode,
        locale: "fr",
        customer_email: plan.email,
        "line_items[0][quantity]": "1",
        "line_items[0][price_data][currency]": "eur",
        "line_items[0][price_data][unit_amount]": String(plan.mensualite),
        "line_items[0][price_data][recurring][interval]": "month",
        "line_items[0][price_data][product_data][name]": `${plan.objet}, règlement en ${plan.echeances} mensualités`,
        "subscription_data[metadata][echeances]": String(plan.echeances),
        "subscription_data[metadata][client]": plan.nom,
        "subscription_data[metadata][origine]": "site, mensualités",
        "subscription_data[description]": `${plan.objet} - ${plan.nom} - ${plan.echeances} mensualités`,
        return_url: `${origine}/paiement/merci?mensualites={CHECKOUT_SESSION_ID}`,
      });
    let r = await stripe("checkout/sessions", parametres("embedded_page"));
    if (!r.ok && /ui_mode/.test(JSON.stringify(r.j))) r = await stripe("checkout/sessions", parametres("embedded"));
    if (!r.ok || !r.j.client_secret) {
      console.error("[mensualites] session refusée", r.j?.error?.message);
      return NextResponse.json({ message: "Paiement indisponible pour le moment." }, { status: 502 });
    }
    return NextResponse.json({ clientSecret: r.j.client_secret, publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
  }

  return NextResponse.json({ message: "Action inconnue." }, { status: 400 });
}

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams;
  const p = q.get("p");
  if (p) {
    const plan = lirePlan(p);
    return plan
      ? NextResponse.json({ plan: { nom: plan.nom, mensualite: plan.mensualite / 100, echeances: plan.echeances, objet: plan.objet } })
      : NextResponse.json({ message: "Lien de paiement invalide ou modifié." }, { status: 400 });
  }
  const id = q.get("session_id") || "";
  if (!process.env.STRIPE_SECRET_KEY || !/^cs_[A-Za-z0-9_]+$/.test(id)) return NextResponse.json({ statut: "inconnu" });
  const r = await stripe(`checkout/sessions/${id}?expand[]=subscription`);
  if (!r.ok) return NextResponse.json({ statut: "inconnu" });
  const sub = r.j.subscription;
  const fin = r.j.status === "complete" && sub && typeof sub === "object" ? await fixerFin(sub) : null;
  return NextResponse.json({ statut: r.j.status, echeances: Number(sub?.metadata?.echeances) || null, fin });
}
