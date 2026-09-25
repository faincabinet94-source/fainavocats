import { NextResponse } from "next/server";
import { ID_VALIDE, saisies, signer } from "@/lib/renseignements/stockage";
import { adresseSite, versN8n } from "@/lib/renseignements/n8n";
import {
  champsComplementaires,
  chargeCognito,
  dossier,
  manquants,
  recapitulatifHtml,
  type Donnees,
} from "@/lib/renseignements/modele";

/* Envoi définitif du formulaire de renseignements.
 *
 * Le site prépare tout, n8n exécute :
 *  1. « cognito » : charge au format Cognito, que n8n transmet telle quelle à
 *     l'automatisation Airtable « Cognito -> AirTable » (fiche, statut, Slack,
 *     tâche de provision : rien ne change en aval) ;
 *  2. « numero » : écrit dans #cognito, il permet à n8n de retrouver la fiche ;
 *  3. « complements » et « pieces » : n8n les ajoute ensuite à la fiche ;
 *  4. « recapitulatif » : corps du courriel au cabinet, pièces jointes. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let corps: { id?: string; donnees?: Donnees; interne?: boolean };
  try {
    corps = await request.json();
  } catch {
    return NextResponse.json({ message: "Requête invalide" }, { status: 400 });
  }
  const id = corps.id || "";
  const d = corps.donnees;
  if (!ID_VALIDE.test(id) || !d) return NextResponse.json({ message: "Requête invalide" }, { status: 400 });
  const interne = Boolean(corps.interne);

  const m = manquants(d, interne);
  if (m.length) {
    return NextResponse.json({ message: "Des informations obligatoires manquent", manquants: m }, { status: 400 });
  }
  const precedente = (await saisies().get(id, { type: "json" })) as { envoye?: boolean } | null;
  if (precedente?.envoye) return NextResponse.json({ ok: true, deja: true });

  const base = adresseSite(request);
  const maintenant = new Date().toISOString();
  const numero = Math.floor(Date.now() / 1000);
  const lienReprise = `${base}/formulaire-renseignements?reprise=${id}`;
  const pieces = (d.pieces || []).map((p) => {
    const cle = `${id}/${p.id}`;
    return {
      nom: `${p.categorie} - ${p.nom}`,
      type: p.type,
      url: `${base}/api/renseignements/piece?cle=${encodeURIComponent(cle)}&s=${signer(cle)}`,
    };
  });

  const ok = await versN8n({
    action: "envoi",
    numero,
    interne,
    dossier: dossier(d),
    procedure: d.procedure,
    cognito: chargeCognito(d, { interne, numero, date: maintenant }),
    complements: champsComplementaires(d, lienReprise),
    pieces,
    recapitulatif: recapitulatifHtml(d),
  });
  if (!ok) return NextResponse.json({ message: "Votre formulaire n'a pas pu être transmis" }, { status: 502 });

  await saisies().setJSON(id, { donnees: d, interne, envoye: true, envoyeLe: maintenant, numero });
  return NextResponse.json({ ok: true });
}
