import { createHmac, timingSafeEqual } from "crypto";

/* Règlement d'honoraires en mensualités (abonnement Stripe à durée fixe).
 *
 * Le cabinet crée un lien pour un client : les conditions (nom, courriel,
 * mensualité, nombre d'échéances, objet) sont portées par le lien lui-même et
 * signées, pour que le client ne puisse pas modifier le montant. Rien n'est
 * stocké côté site. Serveur uniquement. */

export type Plan = {
  nom: string;
  email: string;
  mensualite: number; // en centimes
  echeances: number;
  objet: string;
};

const cle = () => `mensualites:${process.env.STRIPE_SECRET_KEY || ""}`;
const b64 = (s: string) => Buffer.from(s).toString("base64url");
const signe = (corps: string) => createHmac("sha256", cle()).update(corps).digest("base64url");

export function signerPlan(p: Plan): string {
  const corps = b64(JSON.stringify(p));
  return `${corps}.${signe(corps)}`;
}

export function lirePlan(jeton: string): Plan | null {
  const [corps, sig] = (jeton || "").split(".");
  if (!corps || !sig || !process.env.STRIPE_SECRET_KEY) return null;
  const attendu = Buffer.from(signe(corps));
  const recu = Buffer.from(sig);
  if (attendu.length !== recu.length || !timingSafeEqual(attendu, recu)) return null;
  try {
    const p = JSON.parse(Buffer.from(corps, "base64url").toString()) as Plan;
    if (!(p.mensualite >= 100 && p.echeances >= 2 && p.echeances <= 36)) return null;
    return p;
  } catch {
    return null;
  }
}

/* Fin de l'abonnement : un jour après la date de la dernière échéance, pour
   que Stripe en prélève exactement le nombre prévu. */
export function finAbonnement(debut: number, echeances: number): number {
  const d = new Date(debut * 1000);
  d.setUTCMonth(d.getUTCMonth() + echeances - 1);
  return Math.floor(d.getTime() / 1000) + 24 * 3600;
}
