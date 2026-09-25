import { NextResponse } from "next/server";
import { ID_VALIDE, saisies } from "@/lib/renseignements/stockage";
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
  const id = new URL(request.url).searchParams.get("id") || "";
  if (!ID_VALIDE.test(id)) return NextResponse.json({ message: "Lien invalide" }, { status: 400 });
  const s = (await saisies().get(id, { type: "json" })) as { donnees?: Donnees; interne?: boolean; envoye?: boolean } | null;
  if (!s) return NextResponse.json({ message: "Saisie introuvable" }, { status: 404 });
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

  const lien = `${adresseSite(request)}/formulaire-renseignements?reprise=${id}`;
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
