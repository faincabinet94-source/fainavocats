import type { Metadata } from "next";

// Formulaire d'intake client : accessible par lien direct seulement, hors de
// l'index Google, comme /formulaire-divorce.
export const metadata: Metadata = {
  title: "Formulaire de renseignements | Fain Avocats",
  robots: { index: false, follow: false },
};

export default function FormulaireRenseignementsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
