import { completer, TARIFS_DEFAUT, type Tarifs } from "@/lib/tarifs";

/* Lecture de la grille auprès de n8n, côté serveur. Relue au plus une fois par
   heure (cache Next) : une modification dans Airtable s'applique sans
   redéploiement, donc sans crédit Netlify. En cas d'échec, valeurs de secours. */
const URL_TARIFS = process.env.N8N_TARIFS_URL || "https://n8n.voxagentis.com/webhook/tarifs";

export async function lireTarifs(): Promise<Tarifs> {
  try {
    const r = await fetch(URL_TARIFS, { next: { revalidate: 3600 } });
    if (!r.ok) throw new Error(String(r.status));
    const j = (await r.json()) as { tarifs?: unknown };
    return completer(j.tarifs);
  } catch (e) {
    console.error("[tarifs] lecture impossible, valeurs de secours", e);
    return { ...TARIFS_DEFAUT };
  }
}
