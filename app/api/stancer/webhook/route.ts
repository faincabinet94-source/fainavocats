import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

/* Création, une seule fois, de l'endpoint de notification chez Stancer
 * (doc « Webhooks » : POST /v2/webhooks/ { url }, réponse { id, secret }).
 *
 * POST { code } → { id, secret }   réservé au cabinet (PAIEMENT_ADMIN_CODE).
 * Le secret est à enregistrer dans Netlify (STANCER_WEBHOOK_SECRET, secret,
 * production) puis à redéployer. Refusé si la variable existe déjà. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function codeValide(code: unknown): boolean {
  const attendu = process.env.PAIEMENT_ADMIN_CODE || "";
  if (!attendu || typeof code !== "string") return false;
  const a = Buffer.from(attendu);
  const b = Buffer.from(code);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const b = await request.json().catch(() => ({}));
  if (!codeValide(b.code)) return NextResponse.json({ message: "Code incorrect." }, { status: 403 });
  if (process.env.STANCER_WEBHOOK_SECRET)
    return NextResponse.json({ message: "La notification Stancer est déjà configurée (STANCER_WEBHOOK_SECRET)." }, { status: 409 });
  if (!process.env.STANCER_SECRET_KEY) return NextResponse.json({ message: "STANCER_SECRET_KEY manquante." }, { status: 503 });

  const origine = new URL(request.url).origin;
  const auth = Buffer.from(`${process.env.STANCER_SECRET_KEY}:`).toString("base64");
  const r = await fetch("https://api.stancer.com/v2/webhooks/", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({ url: `${origine}/api/stancer/notification` }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.secret) {
    const motif = typeof j?.error?.message === "string" ? j.error.message : `code ${r.status}`;
    return NextResponse.json({ message: `Stancer a refusé la création (${motif}).` }, { status: 502 });
  }
  return NextResponse.json({ id: j.id, secret: j.secret });
}
