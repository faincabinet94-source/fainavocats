import { Lock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

/* Gabarit commun des pages de paiement en ligne (provision, versement libre,
   paiement en plusieurs fois, mensualités). */
export function PagePaiement({
  titre,
  intro,
  prestataire,
  children,
}: {
  titre: string;
  intro: React.ReactNode;
  prestataire: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F4F2EC] pb-24 pt-32">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 font-serif text-4xl leading-tight text-[#1A1A1A] md:text-5xl">{titre}</h1>
            <div className="mb-10 text-lg leading-relaxed text-gray-700">{intro}</div>
            {children}
            <p className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Lock className="h-4 w-4" />
              Paiement sécurisé par {prestataire}.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

export const champCls =
  "w-full rounded-lg border border-[#D6D3CB] bg-white px-4 py-3 text-[15px] text-[#1A1A1A] focus:border-[#362A24] focus:outline-none";
export const boutonCls =
  "inline-flex items-center justify-center gap-2.5 rounded-full bg-[#C2A679] px-7 py-3.5 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-[#B39566] disabled:opacity-60";

/* Montant saisi en euros (« 1 250,50 ») → nombre, ou null. */
export function lireMontant(s: string): number | null {
  const t = (s || "").replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(t)) return null;
  const n = Number(t);
  return n > 0 ? n : null;
}

export const euros = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
