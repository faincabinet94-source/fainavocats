import { NextResponse } from "next/server";
import { ID_VALIDE, saisies } from "@/lib/renseignements/stockage";
import { demanderN8n } from "@/lib/renseignements/n8n";
import { INTITULES, MODELES, empreinte, honoParAvocat, modeleConvention, remplirConvention, sansProvision, type CleModele } from "@/lib/renseignements/convention";
import { lireTarifs } from "@/lib/tarifs-serveur";
import type { Donnees } from "@/lib/renseignements/modele";

/* Convention d'honoraires à signer en fin de formulaire (lib/renseignements/convention.ts).
 * POST { id } -> { cle, intitule, texte, empreinte, provision } ou { cle: null }.
 *
 * Le texte du modèle et l'« Honoraire final » du devis viennent du workflow
 * n8n « Convention - site » (chemin « convention-site »). Le texte rempli est
 * gardé avec la saisie : c'est exactement lui que la signature engage. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Convention = { cle: CleModele; texte: string; empreinte: string; le: string };
type Saisie = { donnees: Donnees; interne?: boolean; envoye?: boolean; numero?: number; lancement?: unknown; convention?: Convention };

export async function POST(request: Request) {
  const corps = (await request.json().catch(() => ({}))) as { id?: string };
  const id = corps.id || "";
  if (!ID_VALIDE.test(id)) return NextResponse.json({ message: "Requête invalide" }, { status: 400 });

  let s: Saisie | null = null;
  for (let essai = 0; essai < 6; essai++) {
    s = (await saisies().get(id, { type: "json" })) as Saisie | null;
    if (s?.envoye && s.numero) break;
    await new Promise((r) => setTimeout(r, 800));
  }
  if (!s?.envoye || !s.numero || s.interne) return NextResponse.json({ message: "Formulaire introuvable" }, { status: 404 });

  const d = s.donnees;
  const cle = modeleConvention(d);
  if (!cle) return NextResponse.json({ cle: null });
  const reponse = (c: Convention) =>
    NextResponse.json({ cle: c.cle, intitule: INTITULES[c.cle], texte: c.texte, empreinte: c.empreinte, provision: !sansProvision(c.cle) });
  if (s.convention?.cle === cle) return reponse(s.convention);
  if (s.lancement) return NextResponse.json({ message: "Votre choix est déjà enregistré." }, { status: 409 });

  const [modele, tarifs] = await Promise.all([
    demanderN8n<{ texte?: string; honoraireFinal?: number | null }>({ modele: MODELES[cle], email: d.client.email }, "convention-site"),
    lireTarifs(),
  ]);
  if (!modele?.texte) return NextResponse.json({ message: "La convention ne peut pas être affichée pour le moment. Réessayez dans un instant." }, { status: 502 });
  const texte = remplirConvention(modele.texte, d, honoParAvocat(d, modele.honoraireFinal ?? null, tarifs));
  const convention: Convention = { cle, texte, empreinte: empreinte(texte), le: new Date().toISOString() };
  await saisies().setJSON(id, { ...s, convention });
  return reponse(convention);
}
