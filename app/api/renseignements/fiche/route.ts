import { NextResponse } from "next/server";
import { appelN8n } from "@/lib/renseignements/n8n";
import { lireLien } from "@/lib/renseignements/correction";

/* Lecture d'un formulaire déjà envoyé, pour le corriger :
 *   GET ?c=<fiche>.<jeton>  rend { donnees, dossier } si le jeton correspond.
 * n8n lit la fiche « Formulaires reçus » et contrôle le jeton. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const lien = lireLien(new URL(request.url).searchParams.get("c"));
  if (!lien) return NextResponse.json({ message: "Lien de correction invalide" }, { status: 400 });
  const { status, json } = await appelN8n({ action: "lire", ...lien }, "renseignements-correction");
  if (status !== 200 || !json.donnees) {
    return NextResponse.json({ message: (json.message as string) || "La fiche n'a pas pu être lue" }, { status: status === 200 ? 502 : status });
  }
  return NextResponse.json({ donnees: json.donnees, dossier: json.dossier || "" }, { headers: { "Cache-Control": "no-store" } });
}
