import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { ID_VALIDE, pieces, signatureValide } from "@/lib/renseignements/stockage";
import { CATEGORIES_PIECES } from "@/lib/renseignements/modele";

/* Pièces du formulaire de renseignements.
 *   POST (multipart : id, categorie, fichier)  enregistre une pièce
 *   GET  ?cle=…&s=…  la rend, sur signature seulement (lue par n8n et Airtable) */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Netlify limite le corps d'une requête à 6 Mo : les photos sont réduites dans
   le navigateur avant l'envoi, les PDF doivent tenir sous cette limite. */
const TAILLE_MAX = 5 * 1024 * 1024;
const TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ message: "Envoi invalide" }, { status: 400 });
  }
  const id = String(form.get("id") || "");
  const categorie = String(form.get("categorie") || "");
  const fichier = form.get("fichier");
  if (!ID_VALIDE.test(id) || !(CATEGORIES_PIECES as readonly string[]).includes(categorie) || !(fichier instanceof File)) {
    return NextResponse.json({ message: "Envoi invalide" }, { status: 400 });
  }
  if (fichier.size > TAILLE_MAX) {
    return NextResponse.json({ message: "Fichier trop lourd (5 Mo au plus)" }, { status: 413 });
  }
  if (!TYPES.includes(fichier.type)) {
    return NextResponse.json({ message: "Format accepté : PDF, JPEG, PNG ou photo" }, { status: 415 });
  }
  const pieceId = randomBytes(8).toString("hex");
  const nom = fichier.name.replace(/[^\p{L}\p{N}._ -]/gu, "_").slice(0, 120) || "piece";
  await pieces().set(`${id}/${pieceId}`, await fichier.arrayBuffer(), {
    metadata: { nom, type: fichier.type, taille: fichier.size, categorie },
  });
  return NextResponse.json({ id: pieceId, nom, type: fichier.type, taille: fichier.size, categorie });
}

export async function GET(request: Request) {
  const u = new URL(request.url);
  const cle = u.searchParams.get("cle") || "";
  const [id, pieceId] = cle.split("/");
  if (!ID_VALIDE.test(id || "") || !/^[a-f0-9]{16}$/.test(pieceId || "") || !signatureValide(cle, u.searchParams.get("s"))) {
    return new NextResponse("Introuvable", { status: 404 });
  }
  const meta = await pieces().getMetadata(cle);
  const donnees = await pieces().get(cle, { type: "arrayBuffer" });
  if (!meta || !donnees) return new NextResponse("Introuvable", { status: 404 });
  const m = meta.metadata as { nom?: string; type?: string };
  return new NextResponse(donnees, {
    headers: {
      "Content-Type": m.type || "application/octet-stream",
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(m.nom || "piece")}`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
