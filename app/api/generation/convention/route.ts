import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { remplir } from "@/lib/generation/moteur";
import { valeursConvention } from "@/lib/generation/valeurs";
import type { Donnees } from "@/lib/renseignements/modele";

/* Génération d'une convention à partir d'un modèle Word Cognito.
 *
 * Appelée par n8n seulement (secret X-Devis-Secret, le même que le devis) :
 *   multipart/form-data, ou JSON avec le modèle en base64
 *     modele   le fichier .docx, lu par n8n dans Google Drive
 *     donnees  le JSON du champ « Données du formulaire » de la fiche
 *     date     facultatif, AAAA-MM-JJ : date de calcul des âges et de la durée
 *              du mariage (aujourd'hui par défaut)
 *
 * Les modèles ne sont pas dans ce dépôt, qui est public : ils restent dans
 * Drive, où Me FAIN les modifie dans Word comme pour Cognito.
 *
 * Réponse : { docx: base64, rapport } ; le rapport liste les champs que le
 * modèle attend et que la saisie ne fournit pas, et les conditions illisibles. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MODELE = 4 * 1024 * 1024;

function autorise(request: Request): boolean {
  const attendu = process.env.N8N_DEVIS_WEBHOOK_SECRET;
  const recu = request.headers.get("x-devis-secret");
  if (!attendu || !recu) return false;
  const a = Buffer.from(attendu);
  const b = Buffer.from(recu);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!autorise(request)) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  /* Deux formats : multipart (modele = fichier) ou JSON (modele = base64),
     plus simple à produire depuis un nœud Code de n8n. */
  let fichier: ArrayBuffer | Buffer;
  let brut: unknown;
  let date: unknown;
  try {
    if ((request.headers.get("content-type") || "").includes("application/json")) {
      const j = await request.json();
      if (typeof j.modele !== "string") throw new Error("modele");
      fichier = Buffer.from(j.modele, "base64");
      brut = typeof j.donnees === "string" ? j.donnees : JSON.stringify(j.donnees);
      date = j.date;
    } else {
      const form = await request.formData();
      const modele = form.get("modele");
      if (!(modele instanceof Blob)) throw new Error("modele");
      fichier = await modele.arrayBuffer();
      brut = form.get("donnees");
      date = form.get("date");
    }
  } catch {
    return NextResponse.json({ message: "Modèle ou données manquants" }, { status: 400 });
  }
  if (typeof brut !== "string") return NextResponse.json({ message: "Données manquantes" }, { status: 400 });
  if (fichier.byteLength > MAX_MODELE) return NextResponse.json({ message: "Modèle trop volumineux" }, { status: 413 });

  let donnees: Donnees;
  try {
    donnees = JSON.parse(brut);
  } catch {
    return NextResponse.json({ message: "Données illisibles" }, { status: 400 });
  }
  if (!donnees || !donnees.client || !donnees.conjoint || !Array.isArray(donnees.enfants)) {
    return NextResponse.json({ message: "Données incomplètes" }, { status: 400 });
  }

  const m = typeof date === "string" ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(date) : null;
  const le = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date();

  try {
    const { docx, rapport } = await remplir(fichier, valeursConvention(donnees, le));
    return NextResponse.json({ docx: docx.toString("base64"), rapport });
  } catch (e) {
    console.error("[generation] échec", e);
    return NextResponse.json({ message: "Le modèle n'a pas pu être lu" }, { status: 422 });
  }
}
