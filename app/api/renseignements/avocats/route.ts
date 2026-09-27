import { NextResponse } from "next/server";

/* Recherche d'un avocat dans la table « 👔Pro » d'Airtable, pour la version
   cabinet du formulaire. Le site relaie à n8n (webhook « avocats », même secret
   que le devis), qui interroge Airtable : aucune clé Airtable sur le site.
   Réponse : { avocats: Avocat[] }, dix au plus. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const q = (new URL(request.url).searchParams.get("q") || "")
    .normalize("NFC")
    .replace(/[^\p{L}\s'-]/gu, "")
    .trim()
    .slice(0, 40);
  if (q.length < 2) return NextResponse.json({ avocats: [] });

  const devis = process.env.N8N_DEVIS_WEBHOOK_URL;
  if (!devis) return NextResponse.json({ avocats: [], message: "Recherche indisponible" }, { status: 503 });
  const url = `${devis.replace(/devis-divorce\/?$/, "avocats")}?q=${encodeURIComponent(q)}`;
  const secret = process.env.N8N_DEVIS_WEBHOOK_SECRET;
  try {
    const r = await fetch(url, {
      headers: secret ? { "X-Devis-Secret": secret } : {},
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });
    if (!r.ok) return NextResponse.json({ avocats: [], message: "Recherche indisponible" }, { status: 502 });
    const j = await r.json();
    return NextResponse.json({ avocats: Array.isArray(j.avocats) ? j.avocats.slice(0, 10) : [] });
  } catch {
    return NextResponse.json({ avocats: [], message: "Recherche indisponible" }, { status: 502 });
  }
}
