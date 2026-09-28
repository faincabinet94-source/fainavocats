import { versN8n } from "@/lib/renseignements/n8n";

/* Paiements du site → table « 💲Règlements » (base Clients).
 *
 * Le site vérifie d'abord le paiement auprès du prestataire, puis transmet le
 * règlement à n8n (chemin « reglements », même webhook protégé que le devis).
 * n8n crée la ligne une seule fois, repérée par « Référence paiement », et la
 * rattache au client existant retrouvé par son courriel. Un même paiement peut
 * donc être signalé plusieurs fois (notification du prestataire et retour du
 * client) sans créer de doublon.
 *
 * La provision Stripe n'y passe pas : elle arrive déjà par l'automatisation
 * Airtable « Stripe » (webhook checkout.session.completed). Serveur uniquement. */

export type Reglement = {
  mode: "CB SUM UP" | "ALMA" | "Stripe abo" | "STANCER API"; // choix du champ Mode, à l'identique
  montant: number; // en euros
  email: string;
  nom: string;
  reference: string;
  date: string; // ISO
  detail: string;
};

export function signalerReglement(r: Reglement): Promise<boolean> {
  return versN8n({ action: "reglement", ...r }, "reglements");
}

/* ---------- SumUp ---------- */

async function sumup(chemin: string) {
  const r = await fetch(`https://api.sumup.com/v0.1/${chemin}`, {
    headers: { Authorization: `Bearer ${process.env.SUMUP_API_KEY}` },
  });
  return { ok: r.ok, j: await r.json().catch(() => ({})) };
}

/* Résultat d'une vérification : statut chez le prestataire, et transmission à
   n8n (null si rien à transmettre). Une notification dont la transmission a
   échoué répond en erreur, pour que le prestataire la renvoie. */
export type Verification = { statut: string; transmis: boolean | null };

/* Lit le checkout chez SumUp ; s'il est payé, le signale.
   La description est posée par /api/sumup : « Versement NOM - objet (courriel) ». */
export async function verifierSumup(id: string): Promise<Verification> {
  if (!process.env.SUMUP_API_KEY || !/^[A-Za-z0-9-]{8,64}$/.test(id)) return { statut: "inconnu", transmis: null };
  const r = await sumup(`checkouts/${id}`);
  if (!r.ok) return { statut: "inconnu", transmis: null };
  const c = r.j;
  let transmis: boolean | null = null;
  if (c.status === "PAID") {
    const description = String(c.description || "");
    const email = /\(([^()\s]+@[^()\s]+)\)\s*$/.exec(description)?.[1] || "";
    const nom = /^Versement (.+?)(?: - .*)? \(/.exec(description)?.[1] || "";
    const date = c.transactions?.[0]?.timestamp || c.date || new Date().toISOString();
    transmis = await signalerReglement({
      mode: "CB SUM UP",
      montant: Number(c.amount) || 0,
      email,
      nom,
      reference: `sumup:${c.id}`,
      date,
      detail: description,
    });
  }
  return { statut: String(c.status || "inconnu"), transmis };
}

/* ---------- Alma ---------- */

export function baseAlma() {
  return (process.env.ALMA_API_KEY || "").startsWith("sk_test")
    ? "https://api.sandbox.getalma.eu"
    : "https://api.getalma.eu";
}

/* Lit le paiement chez Alma ; s'il est accepté (première échéance réglée),
   le signale pour son montant total, qu'Alma verse au cabinet. */
export async function verifierAlma(pid: string): Promise<Verification> {
  if (!process.env.ALMA_API_KEY || !/^payment_[A-Za-z0-9]+$/.test(pid)) return { statut: "inconnu", transmis: null };
  const r = await fetch(`${baseAlma()}/v1/payments/${pid}`, {
    headers: { Authorization: `Alma-Auth ${process.env.ALMA_API_KEY}` },
  });
  const p = await r.json().catch(() => ({}));
  if (!r.ok) return { statut: "inconnu", transmis: null };
  let transmis: boolean | null = null;
  if (p.state === "in_progress" || p.state === "paid") {
    const client = p.customer || {};
    const objet = p.custom_data?.objet ? ` - ${p.custom_data.objet}` : "";
    transmis = await signalerReglement({
      mode: "ALMA",
      montant: (Number(p.purchase_amount) || 0) / 100,
      email: String(client.email || ""),
      nom: [client.first_name, client.last_name].filter(Boolean).join(" "),
      reference: `alma:${p.id}`,
      date: p.created ? new Date(p.created * 1000).toISOString() : new Date().toISOString(),
      detail: `Alma ${p.installments_count || ""} fois${objet}`,
    });
  }
  return { statut: String(p.state || "inconnu"), transmis };
}
