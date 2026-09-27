import { NextResponse } from "next/server";
import { verifierAlma } from "@/lib/reglements";

/* Notification Alma (ipn_callback_url) : GET ?pid=payment_…
   Le paiement est relu chez Alma avant d'être transmis à Airtable. Alma
   recommence tant qu'il ne reçoit pas de réponse 200. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const pid = new URL(request.url).searchParams.get("pid") || "";
  const v = await verifierAlma(pid).catch(() => null);
  if (v?.transmis === false) return NextResponse.json({ ok: false }, { status: 502 });
  return NextResponse.json({ ok: true });
}
