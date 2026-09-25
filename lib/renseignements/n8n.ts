/* Relais vers n8n. Même webhook protégé que le devis (secret en en-tête
   X-Devis-Secret), sur le chemin « renseignements » : aucune nouvelle variable
   d'environnement à créer sur Netlify. */
export async function versN8n(charge: unknown): Promise<boolean> {
  const devis = process.env.N8N_DEVIS_WEBHOOK_URL;
  if (!devis) {
    console.error("[renseignements] N8N_DEVIS_WEBHOOK_URL absente");
    return false;
  }
  const url = devis.replace(/devis-divorce\/?$/, "renseignements");
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
