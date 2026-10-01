/* Relais vers n8n. Même webhook protégé que le devis (secret en en-tête
   X-Devis-Secret), sur le chemin « renseignements » : aucune nouvelle variable
   d'environnement à créer sur Netlify. */
export async function versN8n(charge: unknown, chemin = "renseignements"): Promise<boolean> {
  const devis = process.env.N8N_DEVIS_WEBHOOK_URL;
  if (!devis) {
    console.error("[renseignements] N8N_DEVIS_WEBHOOK_URL absente");
    return false;
  }
  const url = devis.replace(/devis-divorce\/?$/, chemin);
  const secret = process.env.N8N_DEVIS_WEBHOOK_SECRET;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(secret ? { "X-Devis-Secret": secret } : {}) },
      body: JSON.stringify(charge),
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) console.error("[renseignements] n8n a répondu", r.status);
    return r.ok;
  } catch (e) {
    console.error("[renseignements] n8n injoignable", e);
    return false;
  }
}

export const adresseSite = (request: Request) =>
  (process.env.URL && process.env.CONTEXT === "production" ? process.env.URL : new URL(request.url).origin).replace(/\/$/, "");

/* Appel à n8n dont on attend la réponse (lecture d'une fiche, correction) :
   statut HTTP et corps JSON, ou statut 502 si n8n est injoignable. */
export async function appelN8n(charge: unknown, chemin: string): Promise<{ status: number; json: Record<string, unknown> }> {
  const devis = process.env.N8N_DEVIS_WEBHOOK_URL;
  if (!devis) {
    console.error("[renseignements] N8N_DEVIS_WEBHOOK_URL absente");
    return { status: 502, json: { message: "Service indisponible" } };
  }
  const url = devis.replace(/devis-divorce\/?$/, chemin);
  const secret = process.env.N8N_DEVIS_WEBHOOK_SECRET;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(secret ? { "X-Devis-Secret": secret } : {}) },
      body: JSON.stringify(charge),
      signal: AbortSignal.timeout(30000),
    });
    const json = (await r.json().catch(() => ({}))) as Record<string, unknown>;
    if (!r.ok) console.error("[renseignements] n8n a répondu", r.status, chemin);
    return { status: r.status, json };
  } catch (e) {
    console.error("[renseignements] n8n injoignable", e);
    return { status: 502, json: { message: "Service indisponible" } };
  }
}
