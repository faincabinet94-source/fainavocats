import { createHmac, timingSafeEqual } from "crypto";
import { getDeployStore, getStore } from "@netlify/blobs";

/* Saisies en cours et pièces du formulaire de renseignements.
 *
 * Netlify Blobs en production (magasin global, persistant d'un déploiement à
 * l'autre), magasin du déploiement pour les aperçus, pour que les essais ne se
 * mêlent pas aux vraies saisies. Hors Netlify (next dev), un magasin en
 * mémoire permet de tester le parcours en local.
 *
 * Le contexte Netlify (« production », « deploy-preview »…) n'existe qu'au
 * moment de la construction : next.config.js le fige dans CONTEXTE_NETLIFY.
 * Jusqu'au 14/10/2026, le code lisait CONTEXT à l'exécution, où il est vide :
 * tout partait dans le magasin du déploiement, et chaque mise en ligne du site
 * rendait introuvables les saisies en cours. lireSaisie et lirePiece les
 * retrouvent dans les magasins des déploiements précédents. */

type Magasin = {
  get(cle: string, o: { type: "json" }): Promise<unknown>;
  get(cle: string, o: { type: "arrayBuffer" }): Promise<ArrayBuffer | null>;
  getMetadata(cle: string): Promise<{ metadata: Record<string, unknown> } | null>;
  set(cle: string, valeur: ArrayBuffer | string, o?: { metadata?: Record<string, unknown> }): Promise<unknown>;
  setJSON(cle: string, valeur: unknown): Promise<unknown>;
};

const memoire = new Map<string, { v: unknown; meta?: Record<string, unknown> }>();
const magasinMemoire = (nom: string): Magasin => ({
  get: (async (cle: string) => memoire.get(`${nom}/${cle}`)?.v ?? null) as Magasin["get"],
  getMetadata: async (cle) => {
    const x = memoire.get(`${nom}/${cle}`);
    return x ? { metadata: x.meta || {} } : null;
  },
  set: async (cle, v, o) => {
    memoire.set(`${nom}/${cle}`, { v, meta: o?.metadata });
  },
  setJSON: async (cle, v) => {
    memoire.set(`${nom}/${cle}`, { v });
  },
});

const surNetlify = () => Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT);

function magasin(nom: string): Magasin {
  if (!surNetlify()) return magasinMemoire(nom);
  const s = process.env.CONTEXTE_NETLIFY === "production" ? getStore({ name: nom, consistency: "strong" }) : getDeployStore(nom);
  return s as unknown as Magasin;
}

export const saisies = () => magasin("renseignements-saisies");
export const pieces = () => magasin("renseignements-pieces");

/* Identifiants : aléatoires, 32 caractères hexadécimaux. Tout ce qui vient du
   navigateur est contrôlé contre ce format avant de servir de clé. */
export const ID_VALIDE = /^[a-f0-9]{32}$/;

/* Signature des adresses de pièces transmises à n8n et à Airtable : sans elle,
   personne ne peut télécharger une pièce, même en connaissant son adresse. */
const secret = () => process.env.N8N_DEVIS_WEBHOOK_SECRET || "local";

export const signer = (cle: string) => createHmac("sha256", secret()).update(cle).digest("hex").slice(0, 40);

export function signatureValide(cle: string, s: string | null): boolean {
  if (!s) return false;
  const a = Buffer.from(signer(cle));
  const b = Buffer.from(s);
  return a.length === b.length && timingSafeEqual(a, b);
}

/* Récupération dans les magasins des déploiements précédents (voir plus haut).
 * Liste des magasins par l'API de Netlify Blobs, avec le jeton que Netlify
 * fournit à la fonction : « deploy:<déploiement>:<nom> ». Du plus récent au
 * plus ancien (l'identifiant d'un déploiement commence par sa date). */
type ContexteBlobs = { edgeURL?: string; apiURL?: string; token?: string; siteID?: string; deployID?: string };

function contexteBlobs(): ContexteBlobs | null {
  /* Mêmes sources que @netlify/blobs : variable globale, Netlify.env (fonctions
     Netlify), puis process.env. */
  const g = globalThis as { netlifyBlobsContext?: string; Netlify?: { env?: { get(k: string): string | undefined } } };
  const brut = g.netlifyBlobsContext || g.Netlify?.env?.get("NETLIFY_BLOBS_CONTEXT") || process.env.NETLIFY_BLOBS_CONTEXT;
  if (!brut) return null;
  try {
    return JSON.parse(Buffer.from(brut, "base64").toString("utf8")) as ContexteBlobs;
  } catch {
    return null;
  }
}

let deploiements: { nom: string; ids: string[]; le: number }[] = [];

async function deploiementsAnterieurs(nom: string): Promise<string[]> {
  const memo = deploiements.find((x) => x.nom === nom && Date.now() - x.le < 10 * 60_000);
  if (memo) return memo.ids;
  const ctx = contexteBlobs();
  if (!ctx?.token || !ctx.siteID) {
    console.log("[recuperation] contexte Netlify Blobs absent", { contexte: Boolean(ctx) });
    return [];
  }
  const ids: string[] = [];
  let curseur = "";
  for (let page = 0; page < 50; page++) {
    const url = ctx.edgeURL
      ? new URL(`/${ctx.siteID}`, ctx.edgeURL)
      : new URL(`/api/v1/blobs/${ctx.siteID}`, ctx.apiURL || "https://api.netlify.com");
    url.searchParams.set("prefix", "deploy:");
    if (curseur) url.searchParams.set("cursor", curseur);
    const r = await fetch(url, { headers: { authorization: `Bearer ${ctx.token}` } });
    if (!r.ok) {
      console.log("[recuperation] liste des magasins refusée", { statut: r.status, edge: Boolean(ctx.edgeURL) });
      break;
    }
    const j = (await r.json()) as { stores?: string[]; next_cursor?: string };
    for (const magasin of j.stores || []) {
      const m = /^deploy:(\w{1,24}):(.+)$/.exec(magasin);
      if (m && m[2] === nom && m[1] !== ctx.deployID) ids.push(m[1]);
    }
    if (!j.next_cursor) break;
    curseur = j.next_cursor;
  }
  ids.sort().reverse();
  console.log("[recuperation] déploiements antérieurs", { nom, nombre: ids.length });
  deploiements = [...deploiements.filter((x) => x.nom !== nom), { nom, ids, le: Date.now() }];
  return ids;
}

async function chercher<T>(nom: string, lire: (m: Magasin) => Promise<T | null>): Promise<T | null> {
  if (!surNetlify() || process.env.CONTEXTE_NETLIFY !== "production") return null;
  let ids: string[] = [];
  try {
    ids = await deploiementsAnterieurs(nom);
  } catch {
    return null;
  }
  /* Par lots de dix, dans l'ordre : le déploiement le plus récent l'emporte. */
  const liste = ids.slice(0, 150);
  for (let i = 0; i < liste.length; i += 10) {
    const lot = await Promise.all(
      liste.slice(i, i + 10).map((deployID) =>
        lire(getDeployStore({ name: nom, deployID }) as unknown as Magasin).catch(() => null),
      ),
    );
    const v = lot.find((x) => x);
    if (v) return v;
  }
  return null;
}

/** Pièce du formulaire ; retrouvée au besoin dans un déploiement précédent, puis recopiée. */
export async function lirePiece(
  cle: string,
  deployID?: string,
): Promise<{ donnees: ArrayBuffer; metadata: Record<string, unknown> } | null> {
  const meta = await pieces().getMetadata(cle);
  const donnees = meta ? await pieces().get(cle, { type: "arrayBuffer" }) : null;
  if (meta && donnees) return { donnees, metadata: meta.metadata };
  const lire = async (m: Magasin) => {
    const md = await m.getMetadata(cle);
    const d = md ? await m.get(cle, { type: "arrayBuffer" }) : null;
    return md && d ? { donnees: d, metadata: md.metadata } : null;
  };
  const designee =
    deployID && surNetlify()
      ? await lire(getDeployStore({ name: "renseignements-pieces", deployID }) as unknown as Magasin).catch(() => null)
      : null;
  const trouvee = designee || (await chercher("renseignements-pieces", lire));
  if (!trouvee) console.log("[recuperation] pièce introuvable", { cle });
  if (trouvee) await pieces().set(cle, trouvee.donnees, { metadata: trouvee.metadata }).catch(() => {});
  return trouvee;
}

/** Saisie du formulaire ; retrouvée au besoin dans un déploiement précédent,
 *  puis recopiée dans le magasin global avec ses pièces. */
export async function lireSaisie<T = Record<string, unknown>>(id: string, deployID?: string): Promise<T | null> {
  const s = (await saisies().get(id, { type: "json" })) as T | null;
  if (s) return s;
  const lire = (m: Magasin) => m.get(id, { type: "json" }) as Promise<T | null>;
  /* Déploiement désigné (lien de reprise + &version=<identifiant Netlify>) :
     lu directement, sans passer par la liste des magasins. */
  const designee =
    deployID && /^\w{1,24}$/.test(deployID) && surNetlify()
      ? await lire(getDeployStore({ name: "renseignements-saisies", deployID }) as unknown as Magasin).catch((e) => {
          console.log("[recuperation] lecture du déploiement désigné impossible", { deployID, erreur: String(e) });
          return null;
        })
      : null;
  const ancienne = designee || (await chercher("renseignements-saisies", lire));
  if (!ancienne) return null;
  const listePieces = ((ancienne as { donnees?: { pieces?: { id?: string }[] } }).donnees?.pieces || []).filter((p) => p?.id);
  for (const p of listePieces) await lirePiece(`${id}/${p.id}`, deployID).catch(() => null);
  await saisies().setJSON(id, ancienne);
  return ancienne;
}
