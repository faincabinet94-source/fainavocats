import { NextResponse } from "next/server";
import { verifierSumup } from "@/lib/reglements";

/* Notification SumUp (return_url du checkout) : { event_type, id }.
   Le contenu n'est pas cru sur parole : le checkout est relu chez SumUp avant
   d'être transmis à Airtable. Réponse 2xx rapide, sinon SumUp recommence. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const b = await request.json().catch(() => ({}));
  const id = typeof b?.id === "string" ? b.id : "";
  const v = id ? await verifierSumup(id).catch(() => null) : null;
  return new NextResponse(null, { status: v?.transmis === false ? 502 : 204 });
}
