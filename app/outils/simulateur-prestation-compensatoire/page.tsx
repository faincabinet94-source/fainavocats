import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SimulateurEmbed } from "@/components/SimulateurEmbed";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Simulateur de prestation compensatoire | Avocat Paris - Fain Avocats",
  description:
    "Estimez le montant d'une prestation compensatoire selon 6 méthodes de calcul indicatives (pension alimentaire, différentiel de revenus, durée du mariage, méthodes Saint Léon et Depondt). Outil gratuit du cabinet Fain Avocats.",
  alternates: {
    canonical: "/outils/simulateur-prestation-compensatoire",
  },
};

export default function SimulateurPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#F4F2EC] min-h-screen pt-32 pb-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <nav className="text-sm text-gray-500 mb-8">
              <a href="/" className="hover:text-[#362A24] transition-colors">
                Accueil
              </a>
              <span className="mx-2">&gt;</span>
              <Link
                href="/droit-de-la-famille"
                className="hover:text-[#362A24] transition-colors"
              >
                Droit de la Famille
              </Link>
              <span className="mx-2">&gt;</span>
              <Link
                href="/divorce"
                className="hover:text-[#362A24] transition-colors"
              >
                Divorce
              </Link>
              <span className="mx-2">&gt;</span>
              <span className="text-[#362A24]">
                Simulateur de prestation compensatoire
              </span>
            </nav>

            <h1 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-6 leading-tight">
              Simulateur de prestation compensatoire
            </h1>

            <p className="text-gray-700 leading-relaxed mb-4">
              Cet outil estime le montant d&apos;une éventuelle prestation
              compensatoire à partir de <strong>six méthodes de calcul</strong>{" "}
              couramment utilisées par les praticiens (pension alimentaire,
              différentiel de revenus, durée du mariage, pension actualisée, et
              les méthodes de MM.&nbsp;Saint&nbsp;Léon et Depondt). Renseignez
              votre situation&nbsp;: les résultats se calculent instantanément.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              Ces méthodes n&apos;ont{" "}
              <strong>aucune valeur contraignante</strong>. L&apos;octroi et le
              montant d&apos;une prestation compensatoire relèvent de
              l&apos;appréciation souveraine du juge aux affaires familiales,
              selon les critères de l&apos;article 271 du Code civil. Pour en
              comprendre les principes, consultez notre guide complet{" "}
              <Link
                href="/actualites/calcul-prestation-compensatoire-divorce"
                className="text-[#362A24] underline underline-offset-2 hover:no-underline"
              >
                Calcul de la prestation compensatoire : le guide complet
              </Link>
              .
            </p>

            <SimulateurEmbed />

            <div className="bg-[#362A24] text-white p-10 rounded-lg text-center mt-12">
              <h2 className="font-serif text-3xl mb-4">
                Besoin d&apos;une estimation fiable&nbsp;?
              </h2>
              <p className="text-white/70 mb-8">
                Chaque situation est unique. Contactez le cabinet pour une
                évaluation personnalisée par un avocat spécialisé en droit de la
                famille.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+33140680237"
                  className="inline-flex items-center justify-center gap-3 bg-white text-[#362A24] px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-gray-100 transition-all duration-300"
                >
                  +33 1 40 68 02 37
                </a>
                <Link
                  href="/consultations"
                  className="inline-flex items-center justify-center gap-3 border-2 border-white text-white px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-white hover:text-[#362A24] transition-all duration-300"
                >
                  Prendre rendez-vous
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
