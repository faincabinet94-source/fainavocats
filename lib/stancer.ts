import { signalerReglement } from "@/lib/reglements";

/* Stancer (API v1) : appel de l'API et vérification d'un paiement.
 *
 * verifierStancer relit le paiement chez Stancer, demande l'encaissement d'un
 * paiement resté « authorized », puis transmet le règlement à Airtable
 * (mode STANCER API, lib/reglements). Appelée au retour du client
 * (GET /api/paiement) et à la notification de Stancer
 * (/api/stancer/notification). Un même paiement peut arriver par les deux :
 * n8n ne crée la ligne qu'une fois (Référence paiement). Serveur uniquement. */

const API = "https://api.stancer.com/v1";
// Doc v1, « Payment status codes ».
const OK = ["to_capture", "capture_sent", "captured"];
const ECHEC = ["refused", "failed", "canceled", "expired", "disputed"];

export async function stancer(chemin: string, corps?: unknown, methode?: "POST" | "PATCH") {
  const auth = Buffer.from(`${process.env.STANCER_SECRET_KEY || ""}:`).toString("base64");
  const r = await fetch(`${API}/${chemin}`, {
    method: corps === undefined ? "GET" : methode || "POST",
    headers: { Authorization: `Basic ${auth}`, ...(corps === undefined ? {} : { "Content-Type": "application/json" }) },
    body: corps === undefined ? undefined : JSON.stringify(corps),
  });
  return { ok: r.ok, statut: r.status, j: await r.json().catch(() => ({})) };
}

export type EtatStancer = {
  etat: "ok" | "echec" | "attente";
  /* transmission à n8n : null si rien à transmettre */
  transmis: boolean | null;
};

export async function verifierStancer(id: string): Promise<EtatStancer> {
  if (!process.env.STANCER_SECRET_KEY || !/^paym_[A-Za-z0-9]+$/.test(id)) return { etat: "attente", transmis: null };

  const r = await stancer(`checkout/${id}`);
  if (!r.ok) return { etat: "attente", transmis: null };
  let p = r.j;

  // Autorisé mais pas encore encaissé : on demande l'encaissement (doc v1,
  // PATCH /v1/checkout/<id> avec status « capture »).
  if (p.status === "authorized") {
    const c = await stancer(`checkout/${id}`, { status: "capture" }, "PATCH");
    if (c.ok && c.j?.status) p = c.j;
  }

  const statut = String(p.status || "");
  if (ECHEC.includes(statut)) return { etat: "echec", transmis: null };
  if (!OK.includes(statut)) return { etat: "attente", transmis: null };

  let email = "";
  let nom = "";
  const cust = p.customer;
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
  const transmis = await signalerReglement({
    mode: "STANCER API",
    montant: (Number(p.amount) || 0) / 100,
    email,
    nom,
    reference: `stancer:${p.id || id}`,
    date: p.created ? new Date(p.created * 1000).toISOString() : new Date().toISOString(),
    detail: String(p.description || ""),
  });
  return { etat: "ok", transmis };
}
