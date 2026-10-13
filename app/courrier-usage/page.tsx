import type { Metadata } from "next";
import { Suspense } from "react";
import { SignatureUsage } from "@/components/sections/SignatureUsage";

export const metadata: Metadata = {
  title: "Votre convention d'honoraires",
  robots: { index: false, follow: false },
};

/* Lien du courriel envoyé après la réponse du conjoint dans l'espace client :
   /courrier-usage?c=<fiche>.<jeton>. Signature de la CH CU, puis provision. */
export default function PageCourrierUsage({ searchParams }: { searchParams: { c?: string } }) {
  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-white px-4 pb-16 pt-28 sm:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Fain Avocats</p>
      <h1 className="mt-2 font-serif text-4xl text-[#1A1A1A] sm:text-5xl">Le courrier d&apos;usage</h1>
      <Suspense fallback={<div className="py-16 text-center text-gray-500">Chargement…</div>}>
        <SignatureUsage c={searchParams?.c ?? ""} />
      </Suspense>
    </main>
  );
}
