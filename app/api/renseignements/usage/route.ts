import { NextResponse } from "next/server";
import { appelN8n, demanderN8n, versN8n } from "@/lib/renseignements/n8n";
import { lireLien } from "@/lib/renseignements/correction";
import { casesUsage } from "@/lib/renseignements/lancement";
import { INTITULES, MODELES, empreinte, pdfSigne, remplirConvention } from "@/lib/renseignements/convention";
import { dossier, type Donnees } from "@/lib/renseignements/modele";

/* Convention CH CU après la réponse du conjoint dans l'espace client (2026-10-13) :
 * le conjoint a, ou choisira, son propre avocat (ou refuse, ou le désaccord persiste) ;
 * le courriel de n8n porte /courrier-usage?c=<fiche>.<jeton de correction>.
 *
 *   GET  ?c=…  -> { intitule, texte, empreinte, cases, email, nomAttendu }
 *   POST { c, empreinte, nom, cases: { convention, execution } } -> { ok, email }
 *
 * n8n (« renseignements-correction », action « lire ») contrôle le jeton et rend la
 * saisie. Le texte est recalculé à la signature et comparé, par son empreinte, à
 * celui qui a été affiché. Le PDF signé part vers « convention-signee » avec
 * l'identifiant de la fiche ; le paiement suit sur la page. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sansAccents = (x: string) => x.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z]/g, "");

async function preparer(c: unknown) {
  const lien = lireLien(c);
  if (!lien) return { erreur: "Lien invalide.", status: 400 } as const;
  const { status, json } = await appelN8n({ action: "lire", ...lien }, "renseignements-correction");
  const d = json.donnees as Donnees | undefined;
  if (status !== 200 || !d?.client) return { erreur: "Ce lien n'est plus valable.", status: status === 200 ? 404 : status } as const;
  const modele = await demanderN8n<{ texte?: string }>({ modele: MODELES.CU, email: d.client.email }, "convention-site");
  if (!modele?.texte) return { erreur: "La convention ne peut pas être affichée pour le moment. Réessayez dans un instant.", status: 502 } as const;
  const texte = remplirConvention(modele.texte, d, 0);
  return { lien, d, texte, empreinte: empreinte(texte), cases: casesUsage(d.procedure, "indetermine") } as const;
}

export async function GET(request: Request) {
  const p = await preparer(new URL(request.url).searchParams.get("c"));
  if ("erreur" in p) return NextResponse.json({ message: p.erreur }, { status: p.status });
  return NextResponse.json(
    {
      intitule: INTITULES.CU,
      texte: p.texte,
      empreinte: p.empreinte,
      cases: p.cases,
      email: p.d.client.email,
      nomAttendu: [p.d.client.prenoms, p.d.client.nom.trim().toUpperCase()].filter(Boolean).join(" "),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const corps = (await request.json().catch(() => ({}))) as {
    c?: string;
    empreinte?: string;
    nom?: string;
    cases?: Record<string, boolean>;
  };
  const p = await preparer(corps.c);
  if ("erreur" in p) return NextResponse.json({ message: p.erreur }, { status: p.status });
  if (corps.empreinte !== p.empreinte)
    return NextResponse.json({ message: "La convention a changé depuis son affichage. Rechargez la page et relisez-la avant de signer." }, { status: 409 });
  if (!corps.cases?.convention || !corps.cases?.execution)
    return NextResponse.json({ message: "Les deux cases doivent être cochées." }, { status: 400 });
  const d = p.d;
  const saisie = String(corps.nom || "").trim().slice(0, 200);
  const nom = sansAccents(d.client.nom);
  if (saisie.length < 3 || (nom && !sansAccents(saisie).includes(nom)))
    return NextResponse.json({ message: "Saisissez vos prénom et nom pour signer la convention." }, { status: 400 });

  const quand = new Date();
  const signataire = [d.client.civilite, d.client.prenoms, d.client.nom.trim().toUpperCase()].filter(Boolean).join(" ");
  const ip = (request.headers.get("x-nf-client-connection-ip") || request.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  const navigateur = (request.headers.get("user-agent") || "").slice(0, 400);
  const declaration = `J'ai lu la convention d'honoraires affichée ci-dessus et je la signe électroniquement en saisissant mon nom (« ${saisie} »).`;
  const cases = [p.cases.convention, p.cases.execution, declaration];
  const pdf = await pdfSigne(p.texte, {
    intitule: INTITULES.CU,
    reference: `fiche ${p.lien.fiche}`,
    signataire,
    saisie,
    courriel: d.client.email,
    quand,
    ip,
    navigateur,
    empreinteTexte: p.empreinte,
    cases,
  });
  const preuve = [
    `Convention : ${INTITULES.CU} (modèle CU), signée sur fain-avocats.fr après la réponse du conjoint, avant le paiement`,
    `Signataire : ${signataire} ; nom saisi : ${saisie}`,
    `Courriel du formulaire : ${d.client.email} (lien personnel adressé à cette adresse)`,
    `Date : ${quand.toISOString()} (UTC)`,
    `Adresse IP : ${ip || "non transmise"}`,
    `Navigateur : ${navigateur || "non transmis"}`,
    `Empreinte SHA-256 du texte affiché : ${p.empreinte}`,
    `Empreinte SHA-256 du PDF signé : ${empreinte(pdf)}`,
    "Cases cochées :",
    ...cases.map((t) => `[x] ${t}`),
  ].join("\n");
  const ok = await versN8n(
    {
      fiche: p.lien.fiche,
      dossier: dossier(d),
      cle: "CU",
      nomFichier: `${INTITULES.CU} - ${d.client.nom.trim().toUpperCase()} - signée le ${quand.toISOString().slice(0, 10)}.pdf`.replace(/[/\\:*?"<>|]/g, "-"),
      pdf: Buffer.from(pdf).toString("base64"),
      preuve,
      le: quand.toISOString(),
      client: { civilite: d.client.civilite, nom: d.client.nom.trim().toUpperCase(), email: d.client.email },
    },
    "convention-signee",
  );
  if (!ok) return NextResponse.json({ message: "Votre signature n'a pas pu être enregistrée. Réessayez dans un instant." }, { status: 502 });
  return NextResponse.json({ ok: true, email: d.client.email });
}
