import { NextResponse } from "next/server";
import { appelN8n } from "@/lib/renseignements/n8n";
import { champsCorriges, lireLien, recomparer } from "@/lib/renseignements/correction";
import { manquants, type Donnees } from "@/lib/renseignements/modele";

/* Enregistrement des corrections d'un formulaire déjà envoyé :
 *   POST { c: "<fiche>.<jeton>", donnees }
 * n8n contrôle le jeton et met à jour la même fiche « Formulaires reçus ».
 * Rien ne passe par l'automatisation « Cognito -> AirTable » : pas de nouvelle
 * fiche, pas de message Slack, pas de tâche, pas de courriel.
 *
 * Avec revoir: true (désaccord sur l'accord du conjoint, lien du mail de
 * l'époux), le portail compare ensuite de nouveau les réponses du conjoint au
 * formulaire corrigé ; n8n envoie alors les messages. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TAILLE_MAX = 300_000;

export async function POST(request: Request) {
  const brut = await request.text();
  if (brut.length > TAILLE_MAX) return NextResponse.json({ message: "Saisie trop volumineuse" }, { status: 413 });
  let corps: { c?: string; donnees?: Donnees; revoir?: boolean };
  try {
    corps = JSON.parse(brut);
  } catch {
    return NextResponse.json({ message: "Requête invalide" }, { status: 400 });
  }
  const lien = lireLien(corps.c);
  const d = corps.donnees;
  if (!lien || !d || !d.client || !d.conjoint || !Array.isArray(d.enfants)) {
    return NextResponse.json({ message: "Requête invalide" }, { status: 400 });
  }
  const m = manquants(d, true);
  if (m.length) return NextResponse.json({ message: "Des informations obligatoires manquent", manquants: m }, { status: 400 });

  const { status, json } = await appelN8n({ action: "corriger", ...lien, complements: champsCorriges(d) }, "renseignements-correction");
  if (status !== 200 || !json.ok) {
    return NextResponse.json({ message: (json.message as string) || "La fiche n'a pas pu être mise à jour" }, { status: status === 200 ? 502 : status });
  }
  if (corps.revoir !== true) return NextResponse.json({ ok: true });
  const r = await recomparer(lien.fiche);
  return NextResponse.json({ ok: true, issue: r?.issue ?? null, limite: Boolean(r?.limite) });
}
