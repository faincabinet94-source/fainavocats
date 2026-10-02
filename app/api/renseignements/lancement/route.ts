import { NextResponse } from "next/server";
import { ID_VALIDE, saisies } from "@/lib/renseignements/stockage";
import { versN8n } from "@/lib/renseignements/n8n";
import { dossier, type Donnees } from "@/lib/renseignements/modele";
import { CASES_IMMEDIAT, casesImmediat } from "@/lib/renseignements/lancement";

/* Choix de l'époux qui a envoyé le formulaire (fin du formulaire extérieur) :
 *  - « immediat » : il certifie l'accord de son époux, demande l'exécution
 *    immédiate et accepte que la provision ne soit pas remboursable une fois
 *    le projet de convention établi ; le paiement suit sur la page ;
 *  - « verification » : il ne paie rien ; n8n invite son époux, depuis
 *    contact@divorcefacil.com, à donner son avis (pages divorcefacil de
 *    l'espace client).
 *
 * Le choix et les cases cochées sont gardés avec la saisie (date et heure,
 * texte exact des cases) ; n8n les reporte sur la fiche « Formulaires
 * reçus » (champ « Lancement ») et, pour la vérification, envoie
 * l'invitation. Un choix déjà fait n'est pas modifiable ici.
 *
 * Webhook n8n : chemin « renseignements-lancement », même secret que le devis.
 * Voir le coffre : 50 - Projets/Espace client/espace-client-validation-conjoint.md */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COURRIEL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Saisie = { donnees: Donnees; interne?: boolean; envoye?: boolean; numero?: number; lancement?: unknown };

export async function POST(request: Request) {
  let corps: { id?: string; choix?: string; cases?: Record<string, boolean>; emailConjoint?: string };
  try {
    corps = await request.json();
  } catch {
    return NextResponse.json({ message: "Requête invalide" }, { status: 400 });
  }
  const id = corps.id || "";
  if (!ID_VALIDE.test(id)) return NextResponse.json({ message: "Requête invalide" }, { status: 400 });

  const s = (await saisies().get(id, { type: "json" })) as Saisie | null;
  if (!s?.envoye || !s.numero || s.interne) return NextResponse.json({ message: "Formulaire introuvable" }, { status: 404 });
  if (s.lancement) return NextResponse.json({ ok: true, deja: true });

  const d = s.donnees;
  const le = new Date().toISOString();
  let lancement: Record<string, unknown>;
  let charge: Record<string, unknown>;

  if (corps.choix === "immediat") {
    const cases = corps.cases || {};
    if (!Object.keys(CASES_IMMEDIAT).every((k) => cases[k] === true))
      return NextResponse.json({ message: "Les trois cases doivent être cochées" }, { status: 400 });
    const textes = casesImmediat(d.procedure);
    lancement = { choix: "Immédiat", le, cases: textes };
    charge = { action: "immediat", numero: s.numero, dossier: dossier(d), le, cases: textes };
  } else if (corps.choix === "verification") {
    const email = (corps.emailConjoint || d.conjoint.email || "").trim().toLowerCase();
    if (!COURRIEL.test(email)) return NextResponse.json({ message: "Indiquez l'adresse électronique de votre époux" }, { status: 400 });
    if (email === (d.client.email || "").trim().toLowerCase())
      return NextResponse.json({ message: "Indiquez l'adresse de votre époux, et non la vôtre" }, { status: 400 });
    lancement = { choix: "Vérification préalable", le, emailConjoint: email };
    charge = {
      action: "verification",
      numero: s.numero,
      dossier: dossier(d),
      procedure: d.procedure,
      le,
      client: { civilite: d.client.civilite, prenoms: d.client.prenoms, nom: d.client.nom, email: d.client.email },
      conjoint: { civilite: d.conjoint.civilite, prenoms: d.conjoint.prenoms, nom: d.conjoint.nom, email },
    };
  } else {
    return NextResponse.json({ message: "Choix inconnu" }, { status: 400 });
  }

  const ok = await versN8n(charge, "renseignements-lancement");
  if (!ok) return NextResponse.json({ message: "Votre choix n'a pas pu être transmis. Réessayez dans un instant." }, { status: 502 });
  await saisies().setJSON(id, { ...s, lancement });
  return NextResponse.json({ ok: true });
}
