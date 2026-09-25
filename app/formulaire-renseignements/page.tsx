import { Suspense } from "react";
import FormulaireRenseignements from "@/components/sections/FormulaireRenseignements";

export default function FormulaireRenseignementsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl bg-white px-4 pb-16 pt-28 sm:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Fain Avocats</p>
      <h1 className="mt-2 font-serif text-4xl text-[#1A1A1A] sm:text-5xl">Formulaire de renseignements</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-gray-600">
        Ces informations nous permettent de préparer votre convention. Répondez à ce que vous savez :
        ce qui manque sera complété avec vous. Vous pouvez vous arrêter à tout moment et reprendre plus tard.
      </p>
      <div className="mt-10">
        <Suspense fallback={<div className="py-16 text-center text-gray-500">Chargement du formulaire…</div>}>
          <FormulaireRenseignements />
        </Suspense>
      </div>
    </main>
  );
}
