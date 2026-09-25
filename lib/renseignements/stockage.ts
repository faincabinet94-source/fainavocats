import { createHmac, timingSafeEqual } from "crypto";
import { getDeployStore, getStore } from "@netlify/blobs";

/* Saisies en cours et pièces du formulaire de renseignements.
 *
 * Netlify Blobs en production (magasin global, persistant d'un déploiement à
 * l'autre), magasin du déploiement pour les aperçus, pour que les essais ne se
 * mêlent pas aux vraies saisies. Hors Netlify (next dev), un magasin en
 * mémoire permet de tester le parcours en local. */

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
  const s = process.env.CONTEXT === "production" ? getStore({ name: nom, consistency: "strong" }) : getDeployStore(nom);
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
