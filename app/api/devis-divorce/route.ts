import { NextResponse } from "next/server";

/* Réception du formulaire de devis.
 *
 * Le site ne détient aucun jeton Airtable : il relaie vers un webhook n8n,
 * qui écrit dans la base Prospects et envoie l'accusé de réception.
 * Variables attendues côté Netlify :
 *   N8N_DEVIS_WEBHOOK_URL    l'URL du webhook
 *   N8N_DEVIS_WEBHOOK_SECRET  (optionnel) valeur envoyée en en-tête X-Devis-Secret
 *
 * Les deux sont enregistrées en « secret », contexte production. Ce n'est pas un
 * choix : le connecteur Netlify accepte une variable non secrète, répond
 * « upserted », et ne l'enregistre pas. Constaté le 2026-08-24, le formulaire est
 * resté en panne en production sans que rien ne le signale — le build passait,
 * la page s'affichait, seul l'envoi échouait. Vérifier après toute création.
 *
 * Une variable d'environnement ne s'applique qu'après un nouveau déploiement.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Le formulaire de divorcefacil.co (Squarespace) envoie ici, depuis le navigateur
   du visiteur : il ne peut pas appeler n8n directement, le secret du webhook ne
   pouvant pas figurer dans une page publique. Seules ces origines sont admises en
   CORS, et c'est l'origine, jamais le corps de la requête, qui fixe la source
   enregistrée dans Airtable. divorce-facil.squarespace.com sert à l'aperçu dans
   l'éditeur Squarespace. */
const ORIGINES_DIVORCEFACIL = [
  "https://divorcefacil.co",
  "https://www.divorcefacil.co",
  "https://divorce-facil.squarespace.com",
];

const enTetesCors = (origine: string | null): Record<string, string> =>
  origine && ORIGINES_DIVORCEFACIL.includes(origine)
    ? {
        "Access-Control-Allow-Origin": origine,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
        Vary: "Origin",
      }
    : {};

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: enTetesCors(request.headers.get("origin")) });
}

const TRI = ["Oui", "Non", "Ne sait pas"] as const;
const CIVILITES = ["Monsieur", "Madame"] as const;
const MODES = ["En ligne", "Au cabinet"] as const;

type Corps = {
  civilite?: string;
  prenom?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  entretien?: string;
  amiable?: string;
  conjointAvocat?: string;
  enfants?: string;
  immo?: string;
  presta?: string;
  mode?: string;
  commentaires?: string;
  piege?: string;
};

const propre = (v: unknown, max = 200) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const dansListe = <T extends readonly string[]>(v: unknown, liste: T) =>
  typeof v === "string" && (liste as readonly string[]).includes(v) ? v : null;

export async function POST(request: Request) {
  const origine = request.headers.get("origin");
  const depuisDivorcefacil = !!origine && ORIGINES_DIVORCEFACIL.includes(origine);
  const cors = enTetesCors(origine);
  const repondre = (corpsReponse: object, status = 200) =>
    NextResponse.json(corpsReponse, { status, headers: cors });

  let corps: Corps;
  try {
    corps = await request.json();
  } catch {
    return repondre({ message: "Requête illisible" }, 400);
  }

  /* Piège à robots : rempli = on répond OK sans rien transmettre.
     Un robot qui reçoit une erreur réessaie ; un robot qui reçoit OK passe. */
  if (propre(corps.piege)) {
    return repondre({ ok: true });
  }

  const prenom = propre(corps.prenom, 80);
  const nom = propre(corps.nom, 80);
  const email = propre(corps.email, 160);
  const telephone = propre(corps.telephone, 40);
  const civilite = dansListe(corps.civilite, CIVILITES);
  const amiable = dansListe(corps.amiable, TRI);
  /* Entretien téléphonique gratuit : « Oui » par défaut, y compris pour un
     formulaire plus ancien qui n'envoie pas la question. Le téléphone n'est
     obligatoire que dans ce cas ; sans entretien, le devis part quand même. */
  const entretien = corps.entretien === "Non" ? "Non" : "Oui";

  if (!prenom || !nom || !email || !civilite || !amiable || (entretien === "Oui" && !telephone)) {
    return repondre({ message: "Des informations obligatoires manquent" }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return repondre({ message: "L'adresse de courriel n'est pas valide" }, 400);
  }

  const webhook = process.env.N8N_DEVIS_WEBHOOK_URL;
  if (!webhook) {
    console.error("[devis] N8N_DEVIS_WEBHOOK_URL absente");
    return repondre({ message: "Le formulaire n'est pas encore relié" }, 503);
  }

  /* Les libellés ci-dessous correspondent EXACTEMENT aux choix de la table
     Contacts (base Prospects). Ne pas les reformuler. */
  const charge = {
    source: depuisDivorcefacil ? "divorcefacil" : "fain-avocats",
    statutDuLead: "DEVIS",
    domaine: "DIVORCE",
    genre: civilite,
    prenom,
    nom,
    email,
    telephone,
    rdvTel: entretien,
    amiable,
    conjointDejaAvocat: dansListe(corps.conjointAvocat, TRI),
    enfantsACharge: dansListe(corps.enfants, TRI),
    immo: dansListe(corps.immo, TRI),
    prestationCompensatoire: dansListe(corps.presta, TRI),
    mode: dansListe(corps.mode, MODES),
    commentaires: propre(corps.commentaires, 4000),
    recuLe: new Date().toISOString(),
    origine: depuisDivorcefacil ? "divorcefacil.co" : "site/devis/divorce",
  };

  try {
    const secret = process.env.N8N_DEVIS_WEBHOOK_SECRET;
    const reponse = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { "X-Devis-Secret": secret } : {}),
      },
      body: JSON.stringify(charge),
      signal: AbortSignal.timeout(15000),
    });
    if (!reponse.ok) {
      console.error("[devis] webhook n8n a répondu", reponse.status);
      return repondre({ message: "Votre demande n'a pas pu être enregistrée" }, 502);
    }
  } catch (e) {
    console.error("[devis] webhook injoignable", e);
    return repondre({ message: "Votre demande n'a pas pu être enregistrée" }, 502);
  }

  return repondre({ ok: true });
}
