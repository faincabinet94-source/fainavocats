import { NextResponse } from "next/server";
import { ID_VALIDE, lireSaisie, saisies } from "@/lib/renseignements/stockage";
import { adresseSite, versN8n } from "@/lib/renseignements/n8n";
import { COURRIEL_VALIDE, type Donnees } from "@/lib/renseignements/modele";

/* Enregistrement d'une saisie en cours, et reprise par lien.
 *   GET  ?id=…   rend la saisie
 *   POST { id, donnees, interne, envoyerLien }   l'enregistre ; avec envoyerLien,
 *        n8n envoie le lien de reprise au client, copie au cabinet. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TAILLE_MAX = 300_000;

export async function GET(request: Request) {
  const u = new URL(request.url);
  const id = u.searchParams.get("id") || "";
  if (!ID_VALIDE.test(id)) return NextResponse.json({ message: "Lien invalide" }, { status: 400 });
  const s = await lireSaisie<{ donnees?: Donnees; interne?: boolean; envoye?: boolean; numero?: number; lancement?: unknown }>(
    id,
    u.searchParams.get("version") || undefined,
  );
  if (!s) {
    return NextResponse.json(
      {
        message:
          "Votre formulaire n'a pas pu être retrouvé. Écrivez-nous à contact@fain-avocats.fr ou appelez le cabinet au +33 1 40 68 02 37 : nous le retrouverons avec vous.",
      },
      { status: 404 },
    );
  }
  /* Envoyé mais convention et provision pas encore traitées (onglet fermé
     après l'envoi) : le lien rouvre directement cette étape. */
  if (s.envoye && !s.interne && s.numero && !s.lancement && s.donnees) {
    return NextResponse.json({ donnees: s.donnees, interne: false, aLancer: true });
  }
  if (s.envoye) return NextResponse.json({ message: "Ce formulaire a déjà été envoyé" }, { status: 410 });
  return NextResponse.json({ donnees: s.donnees, interne: Boolean(s.interne) });
}

export async function POST(request: Request) {
  const brut = await request.text();
  if (brut.length > TAILLE_MAX) return NextResponse.json({ message: "Saisie trop volumineuse" }, { status: 413 });
  let corps: { id?: string; donnees?: Donnees; interne?: boolean; envoyerLien?: boolean };
  try {
    corps = JSON.parse(brut);
  } catch {
    return NextResponse.json({ message: "Requête invalide" }, { status: 400 });
  }
  const id = corps.id || "";
  if (!ID_VALIDE.test(id) || !corps.donnees) return NextResponse.json({ message: "Requête invalide" }, { status: 400 });

  const precedente = (await saisies().get(id, { type: "json" })) as { envoye?: boolean } | null;
  if (precedente?.envoye) return NextResponse.json({ message: "Ce formulaire a déjà été envoyé" }, { status: 410 });
  await saisies().setJSON(id, { donnees: corps.donnees, interne: Boolean(corps.interne), maj: new Date().toISOString() });

  // Version cabinet : le lien rouvre la page avec son titre « interne ».
  const lien = `${adresseSite(request)}/formulaire-renseignements?reprise=${id}${corps.interne ? "&interne=1" : ""}`;
  if (corps.envoyerLien) {
    const c = corps.donnees.client;
    const email = (c.email || "").trim().toLowerCase();
    if (!COURRIEL_VALIDE.test(email)) {
      return NextResponse.json({ message: "Indiquez d'abord votre courriel, étape « Vous »" }, { status: 400 });
    }
    const ok = await versN8n({
      action: "reprise",
      lien,
      email,
      civilite: c.civilite || "",
      nom: (c.nom || "").trim().toUpperCase(),
      prenoms: (c.prenoms || "").trim(),
      procedure: corps.donnees.procedure,
    });
    if (!ok) return NextResponse.json({ message: "Le lien n'a pas pu être envoyé", lien }, { status: 502 });
  }
  return NextResponse.json({ ok: true, lien });
}
