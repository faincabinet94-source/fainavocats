import { Suspense } from "react";
import FormulaireRenseignements from "@/components/sections/FormulaireRenseignements";
import { guidesDisponibles } from "@/lib/renseignements/guides-serveur";

export default function FormulaireRenseignementsPage({
  searchParams,
}: {
  searchParams: { interne?: string; correction?: string; dossier?: string };
}) {
  const correction = Boolean(searchParams?.correction);
  const interne = correction || searchParams?.interne === "1";
  /* Fiche créée depuis un dossier existant (case « Créer le formulaire ») :
     ouverte par le lien de correction, mais c'est une première saisie. */
  const depuisDossier = correction && searchParams?.dossier === "1";
  return (
    <main className="mx-auto min-h-screen max-w-4xl bg-white px-4 pb-16 pt-28 sm:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Fain Avocats</p>
      <h1 className="mt-2 font-serif text-4xl text-[#1A1A1A] sm:text-5xl">
        {correction && !depuisDossier
          ? "Correction du formulaire de renseignements"
          : interne
            ? "Formulaire de renseignements interne"
            : "Formulaire de renseignements"}
      </h1>
      {/* Introduction adressée au client : absente de la version cabinet. */}
      {!interne && (
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-gray-600">
          Ces informations nous permettent de préparer votre convention. Répondez à ce que vous savez :
          ce qui manque sera complété avec vous. Vous pouvez vous arrêter à tout moment et reprendre plus tard.
        </p>
      )}
      <div className="mt-10">
        <Suspense fallback={<div className="py-16 text-center text-gray-500">Chargement du formulaire…</div>}>
          <FormulaireRenseignements guides={guidesDisponibles()} />
        </Suspense>
      </div>
    </main>
  );
}
