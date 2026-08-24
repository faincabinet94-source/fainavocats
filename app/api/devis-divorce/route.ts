import { NextResponse } from "next/server";

/* Réception du formulaire de devis.
 *
 * Le site ne détient aucun jeton Airtable : il relaie vers un webhook n8n,
 * qui écrit dans la base Prospects et envoie l'accusé de réception.
 * Variables attendues côté Netlify :
 *   N8N_DEVIS_WEBHOOK_URL    l'URL du webhook
 *   N8N_DEVIS_WEBHOOK_SECRET  (optionnel) valeur envoyée en en-tête X-Devis-Secret
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TRI = ["Oui", "Non", "Ne sait pas"] as const;
const CIVILITES = ["Monsieur", "Madame"] as const;
const MODES = ["En ligne", "Au cabinet"] as const;

type Corps = {
  civilite?: string;
  prenom?: string;
  nom?: string;
  email?: string;
  telephone?: string;
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
  let corps: Corps;
  try {
    corps = await request.json();
  } catch {
    return NextResponse.json({ message: "Requête illisible" }, { status: 400 });
  }

  /* Piège à robots : rempli = on répond OK sans rien transmettre.
     Un robot qui reçoit une erreur réessaie ; un robot qui reçoit OK passe. */
  if (propre(corps.piege)) {
    return NextResponse.json({ ok: true });
  }

  const prenom = propre(corps.prenom, 80);
  const nom = propre(corps.nom, 80);
  const email = propre(corps.email, 160);
  const telephone = propre(corps.telephone, 40);
  const civilite = dansListe(corps.civilite, CIVILITES);
  const amiable = dansListe(corps.amiable, TRI);

  if (!prenom || !nom || !email || !telephone || !civilite || !amiable) {
    return NextResponse.json({ message: "Des informations obligatoires manquent" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ message: "L'adresse de courriel n'est pas valide" }, { status: 400 });
  }

  const webhook = process.env.N8N_DEVIS_WEBHOOK_URL;
  if (!webhook) {
    console.error("[devis] N8N_DEVIS_WEBHOOK_URL absente");
    return NextResponse.json(
      { message: "Le formulaire n'est pas encore relié" },
      { status: 503 }
    );
  }

  /* Les libellés ci-dessous correspondent EXACTEMENT aux choix de la table
     Contacts (base Prospects). Ne pas les reformuler. */
  const charge = {
    source: "fain-avocats",
    statutDuLead: "DEVIS",
    domaine: "DIVORCE",
    genre: civilite,
    prenom,
    nom,
    email,
    telephone,
    amiable,
    conjointDejaAvocat: dansListe(corps.conjointAvocat, TRI),
    enfantsACharge: dansListe(corps.enfants, TRI),
    immo: dansListe(corps.immo, TRI),
    prestationCompensatoire: dansListe(corps.presta, TRI),
    mode: dansListe(corps.mode, MODES),
    commentaires: propre(corps.commentaires, 4000),
    recuLe: new Date().toISOString(),
    origine: "site/devis/divorce",
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
      return NextResponse.json(
        { message: "Votre demande n'a pas pu être enregistrée" },
        { status: 502 }
      );
    }
  } catch (e) {
    console.error("[devis] webhook injoignable", e);
    return NextResponse.json(
      { message: "Votre demande n'a pas pu être enregistrée" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
