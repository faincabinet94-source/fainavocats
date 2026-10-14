import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { ID_VALIDE, lireSaisie, saisies } from "@/lib/renseignements/stockage";
import { versN8n } from "@/lib/renseignements/n8n";
import { avocatChoisi, conseilDuConjoint, destinataireUsage, dossier, texteAvocat, avocatRetenu, type Avocat, type Donnees } from "@/lib/renseignements/modele";
import { CASES_IMMEDIAT, CASES_USAGE, casesImmediat, casesUsage } from "@/lib/renseignements/lancement";
import { INTITULES, empreinte, modeleConvention, pdfSigne, type CleModele } from "@/lib/renseignements/convention";

/* Choix de l'époux qui a envoyé le formulaire (fin du formulaire extérieur) :
 *  - « immediat » : il certifie l'accord de son époux, demande l'exécution
 *    immédiate et accepte que la provision ne soit pas remboursable une fois
 *    le projet de convention établi ; le paiement suit sur la page ;
 *  - « verification » : il ne paie rien ; n8n invite son époux, depuis
 *    contact@divorcefacil.com, à donner son avis (pages divorcefacil de
 *    l'espace client) ;
 *  - « usage » (2A seulement, conjoint assisté ou à assister par un avocat
 *    extérieur) : il accepte la convention CH CU et demande l'exécution
 *    immédiate ; le paiement suit ; une fois la provision réglée, le cabinet
 *    adresse un courrier d'usage au confrère ou au conjoint. En 2A, les deux
 *    autres choix sont refusés : le cabinet n'écrit pas au conjoint pour
 *    recueillir son avis.
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

type Saisie = {
  donnees: Donnees;
  interne?: boolean;
  envoye?: boolean;
  numero?: number;
  lancement?: unknown;
  convention?: { cle: CleModele; texte: string; empreinte: string; le: string };
};

const sansAccents = (x: string) => x.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z]/g, "");

export async function POST(request: Request) {
  let corps: {
    id?: string;
    choix?: string;
    cases?: Record<string, boolean>;
    emailConjoint?: string;
    transmission?: boolean;
    signature?: { empreinte?: string; nom?: string };
  };
  try {
    corps = await request.json();
  } catch {
    return NextResponse.json({ message: "Requête invalide" }, { status: 400 });
  }
  const id = corps.id || "";
  if (!ID_VALIDE.test(id)) return NextResponse.json({ message: "Requête invalide" }, { status: 400 });

  /* L'écran de choix s'affiche dès la fin de l'envoi : la saisie marquée
     « envoyée » peut ne pas être encore lisible (Netlify Blobs). On relit
     quelques secondes avant de conclure. */
  let s: Saisie | null = null;
  for (let essai = 0; essai < 6; essai++) {
    s = await lireSaisie<Saisie>(id);
    if (s?.envoye && s.numero) break;
    await new Promise((r) => setTimeout(r, 800));
  }
  if (!s?.envoye || !s.numero || s.interne) return NextResponse.json({ message: "Formulaire introuvable" }, { status: 404 });
  if (s.lancement) return NextResponse.json({ ok: true, deja: true });

  const d = s.donnees;
  const le = new Date().toISOString();
  let lancement: Record<string, unknown>;
  let charge: Record<string, unknown>;

  const usage = destinataireUsage(d);
  if (usage && corps.choix !== "usage")
    return NextResponse.json({ message: "Votre conjoint a son propre avocat : le cabinet lui adresse un courrier d'usage." }, { status: 400 });

  if (corps.choix === "usage") {
    if (!usage) return NextResponse.json({ message: "Choix inconnu" }, { status: 400 });
    const cases = corps.cases || {};
    if (!Object.keys(CASES_USAGE).every((k) => cases[k] === true))
      return NextResponse.json({ message: "Les deux cases doivent être cochées" }, { status: 400 });
    const textes = casesUsage(d.procedure, usage, avocatChoisi(d) === "Oui");
    const avocat = avocatRetenu(d);
    lancement = { choix: "Courrier d'usage", le, cases: textes, destinataire: usage };
    charge = {
      action: "usage",
      numero: s.numero,
      dossier: dossier(d),
      procedure: d.procedure,
      le,
      cases: textes,
      destinataire: usage,
      avocatDejaChoisi: avocatChoisi(d) === "Oui",
      avocatConjoint: avocat ? texteAvocat(avocat as Avocat) : "",
    };
  } else if (corps.choix === "immediat") {
    const cases = corps.cases || {};
    if (!Object.keys(CASES_IMMEDIAT).every((k) => cases[k] === true))
      return NextResponse.json({ message: "Les deux cases doivent être cochées" }, { status: 400 });
    const textes = casesImmediat(d.procedure);
    lancement = { choix: "Immédiat", le, cases: textes };
    charge = { action: "immediat", numero: s.numero, dossier: dossier(d), le, cases: textes };
  } else if (corps.choix === "verification") {
    /* Conjoint déjà assisté d'un avocat : pas d'écrit direct (RIN art. 8.3). */
    if (conseilDuConjoint(d) === "exterieur")
      return NextResponse.json({ message: "Votre époux étant assisté d'un avocat, nous ne pouvons pas lui écrire directement." }, { status: 400 });
    if (typeof corps.transmission !== "boolean")
      return NextResponse.json({ message: "Indiquez si vos réponses peuvent être présentées à votre époux" }, { status: 400 });
    const email = (corps.emailConjoint || d.conjoint.email || "").trim().toLowerCase();
    if (!COURRIEL.test(email)) return NextResponse.json({ message: "Indiquez l'adresse électronique de votre époux" }, { status: 400 });
    if (email === (d.client.email || "").trim().toLowerCase())
      return NextResponse.json({ message: "Indiquez l'adresse de votre époux, et non la vôtre" }, { status: 400 });
    lancement = { choix: "Vérification préalable", le, emailConjoint: email, transmission: corps.transmission };
    charge = {
      action: "verification",
      numero: s.numero,
      /* Jeton du lien envoyé au conjoint (champ « Jeton conjoint ») : tiré
         ici, n8n se contente de l'écrire et de l'envoyer. */
      jeton: randomBytes(16).toString("hex"),
      dossier: dossier(d),
      procedure: d.procedure,
      le,
      /* Réponses présentées au conjoint (case « Réponses transmises au conjoint »). */
      transmission: corps.transmission,
      client: { civilite: d.client.civilite, prenoms: d.client.prenoms, nom: d.client.nom, email: d.client.email },
      conjoint: { civilite: d.conjoint.civilite, prenoms: d.conjoint.prenoms, nom: d.conjoint.nom, email },
    };
  } else {
    return NextResponse.json({ message: "Choix inconnu" }, { status: 400 });
  }

  /* Signature de la convention d'honoraires avant le paiement (2026-10-13) :
     le texte signé est celui que la route « convention » a gardé avec la
     saisie, vérifié par son empreinte. Le PDF signé part vers n8n
     (« convention-signee »), qui le range sur la fiche dès sa création ; la
     déclaration de signature rejoint les cases de la « Certification ». */
  let signature: Record<string, unknown> | null = null;
  const cle = corps.choix === "immediat" || corps.choix === "usage" ? modeleConvention(d) : null;
  if (cle) {
    const conv = s.convention;
    const sig = corps.signature || {};
    if (!conv || conv.cle !== cle || conv.empreinte !== empreinte(conv.texte) || sig.empreinte !== conv.empreinte)
      return NextResponse.json({ message: "La convention a changé depuis son affichage. Rechargez la page et relisez-la avant de signer." }, { status: 409 });
    const saisie = String(sig.nom || "").trim().slice(0, 200);
    const nom = sansAccents(d.client.nom);
    if (saisie.length < 3 || (nom && !sansAccents(saisie).includes(nom)))
      return NextResponse.json({ message: "Saisissez vos prénom et nom pour signer la convention." }, { status: 400 });
    const quand = new Date();
    const signataire = [d.client.civilite, d.client.prenoms, d.client.nom.trim().toUpperCase()].filter(Boolean).join(" ");
    const ip = (request.headers.get("x-nf-client-connection-ip") || request.headers.get("x-forwarded-for") || "").split(",")[0].trim();
    const navigateur = (request.headers.get("user-agent") || "").slice(0, 400);
    const declaration = `J'ai lu la convention d'honoraires affichée ci-dessus et je la signe électroniquement en saisissant mon nom (« ${saisie} »).`;
    const textesCases = Object.values((lancement as { cases: Record<string, string> }).cases);
    const pdf = await pdfSigne(conv.texte, {
      intitule: INTITULES[cle],
      reference: `formulaire n° ${s.numero}`,
      signataire,
      saisie,
      courriel: d.client.email,
      quand,
      ip,
      navigateur,
      empreinteTexte: conv.empreinte,
      cases: [...textesCases, declaration],
    });
    const preuve = [
      `Convention : ${INTITULES[cle]} (modèle ${cle}), signée sur fain-avocats.fr avant le paiement`,
      `Signataire : ${signataire} ; nom saisi : ${saisie}`,
      `Courriel déclaré : ${d.client.email}`,
      `Date : ${quand.toISOString()} (UTC)`,
      `Adresse IP : ${ip || "non transmise"}`,
      `Navigateur : ${navigateur || "non transmis"}`,
      `Empreinte SHA-256 du texte affiché : ${conv.empreinte}`,
      `Empreinte SHA-256 du PDF signé : ${empreinte(pdf)}`,
      "Cases cochées :",
      ...[...textesCases, declaration].map((t) => `[x] ${t}`),
    ].join("\n");
    const nomFichier = `${INTITULES[cle]} - ${d.client.nom.trim().toUpperCase()} - signée le ${quand.toISOString().slice(0, 10)}.pdf`.replace(/[/\\:*?"<>|]/g, "-");
    const envoye = await versN8n(
      {
        numero: s.numero,
        dossier: dossier(d),
        cle,
        nomFichier,
        pdf: Buffer.from(pdf).toString("base64"),
        preuve,
        le: quand.toISOString(),
        client: { civilite: d.client.civilite, nom: d.client.nom.trim().toUpperCase(), email: d.client.email },
      },
      "convention-signee",
    );
    if (!envoye) return NextResponse.json({ message: "Votre signature n'a pas pu être enregistrée. Réessayez dans un instant." }, { status: 502 });
    signature = { cle, le: quand.toISOString(), saisie, ip, empreinteTexte: conv.empreinte, empreintePdf: empreinte(pdf) };
    (charge.cases as Record<string, string>).signature =
      `Convention d'honoraires (${cle}) signée électroniquement par ${signataire} (nom saisi : « ${saisie} »), empreinte ${conv.empreinte.slice(0, 16)}.`;
    lancement.signature = signature;
  }

  const ok = await versN8n(charge, "renseignements-lancement");
  if (!ok) return NextResponse.json({ message: "Votre choix n'a pas pu être transmis. Réessayez dans un instant." }, { status: 502 });
  await saisies().setJSON(id, { ...s, lancement });
  return NextResponse.json({ ok: true });
}
