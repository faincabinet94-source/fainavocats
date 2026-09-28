import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { verifierStancer } from "@/lib/stancer";

/* Notification Stancer (webhook). Couvre le client qui ferme son navigateur
 * avant de revenir sur le site : le paiement est quand même relu, encaissé
 * s'il est resté « authorized », et transmis à Airtable (lib/stancer).
 *
 * Doc Stancer, « Webhooks » : corps { id, type, data }, data étant l'objet
 * (le paiement) ; signature dans l'en-tête Stancer-Signature, « t=…,v1=… »,
 * HMAC SHA-256 de « <t>.<corps> » avec la clé secrète de l'endpoint (en
 * hexadécimal). Réponse 200 ou 204, sinon Stancer recommence (15 essais).
 * Le contenu n'est pas cru sur parole : le paiement est relu chez Stancer.
 *
 * Variable Netlify : STANCER_WEBHOOK_SECRET (clé renvoyée à la création de
 * l'endpoint, voir /api/stancer/webhook). */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOLERANCE = 300; // secondes

function signatureValide(corps: string, entete: string, secret: string): boolean {
  const parties = entete.split(",").map((p) => p.trim().split("="));
  const t = parties.find(([k]) => k === "t")?.[1];
  const signatures = parties.filter(([k]) => k === "v1").map(([, v]) => v || "");
  if (!t || !signatures.length || Math.abs(Date.now() / 1000 - Number(t)) > TOLERANCE) return false;
  // Clé en hexadécimal selon la doc ; la chaîne brute est essayée aussi.
  const cles = /^[0-9a-f]+$/i.test(secret) && secret.length % 2 === 0 ? [Buffer.from(secret, "hex"), Buffer.from(secret)] : [Buffer.from(secret)];
  return cles.some((cle) => {
    const attendu = Buffer.from(createHmac("sha256", cle).update(`${t}.${corps}`).digest("hex"));
    return signatures.some((s) => {
      const recu = Buffer.from(s);
      return recu.length === attendu.length && timingSafeEqual(recu, attendu);
    });
  });
}

export async function POST(request: Request) {
  const secret = process.env.STANCER_WEBHOOK_SECRET || "";
  const corps = await request.text();
  if (!secret) return NextResponse.json({ ok: false }, { status: 503 });
  if (!signatureValide(corps, request.headers.get("stancer-signature") || "", secret))
    return NextResponse.json({ ok: false }, { status: 400 });

  let evenement: { type?: string; data?: { id?: string; payment?: string | { id?: string } } } = {};
  try {
    evenement = JSON.parse(corps);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const d = evenement.data || {};
  const lie = typeof d.payment === "string" ? d.payment : d.payment?.id;
  const id = [d.id, lie].find((x) => typeof x === "string" && x.startsWith("paym_"));
  if (!id) return new NextResponse(null, { status: 204 }); // autre objet (remboursement…)

  const v = await verifierStancer(id).catch(() => null);
  // Échec de lecture ou de transmission : 502, pour que Stancer renvoie.
  return new NextResponse(null, { status: !v || v.transmis === false ? 502 : 204 });
}
