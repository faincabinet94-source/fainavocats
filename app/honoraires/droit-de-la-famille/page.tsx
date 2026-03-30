import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Honoraires Droit de la Famille | Tarifs Divorce Avocat Paris - Fain Avocats",
  description:
    "Tarifs et honoraires en droit de la famille : divorce par consentement mutuel à partir de 500€, consultation 120€, taux horaire 200€. Facilités de paiement. Cabinet Fain Avocats Paris 16ème.",
  keywords: [
    "honoraires avocat divorce",
    "tarif divorce consentement mutuel",
    "prix avocat divorce paris",
    "coût consultation avocat famille",
    "honoraires avocat famille paris",
    "tarif divorce avocat",
  ],
};

export default function HonorairesFamillePage() {
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
                href="/honoraires"
                className="hover:text-[#362A24] transition-colors"
              >
                Honoraires
              </Link>
              <span className="mx-2">&gt;</span>
              <span className="text-[#362A24]">Droit de la famille</span>
            </nav>

            <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-8 leading-tight">
              Les honoraires en droit de la famille
            </h1>

            <p className="text-gray-700 text-lg leading-relaxed mb-12">
              Les honoraires en droit de la famille peuvent être fixés de trois
              manières, selon la nature et la complexité de votre dossier.
            </p>

            <div className="space-y-8 mb-16">
              <div className="bg-white p-8 rounded-lg">
                <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">
                  1. Honoraire forfaitaire
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Pour certaines procédures les honoraires sont fixés à
                  l&apos;avance dès le début de la procédure. Leur montant est
                  ferme et définitif. Il s&apos;agit généralement de procédures
                  simples dans lesquelles il est possible de déterminer à
                  l&apos;avance le temps qui devra être consacré au traitement du
                  dossier.
                </p>
                <div className="bg-[#F4F2EC] p-6 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#1A1A1A] font-medium">
                      Divorce par consentement mutuel
                    </span>
                    <span className="font-serif text-xl text-[#362A24] font-semibold">
                      à partir de 500 €
                    </span>
                  </div>
                  <div className="h-px bg-gray-300" />
                  <div className="flex items-center justify-between">
                    <span className="text-[#1A1A1A] font-medium">
                      1ère consultation en droit de la famille
                    </span>
                    <span className="font-serif text-xl text-[#362A24] font-semibold">
                      120 €
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg">
                <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">
                  2. Honoraires au temps passé
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Le taux horaire est appliqué pour les dossiers dont la durée et
                  la complexité ne permettent pas de fixer un forfait.
                </p>
                <div className="bg-[#F4F2EC] p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[#1A1A1A] font-medium">
                      Taux horaire pratiqué
                    </span>
                    <span className="font-serif text-xl text-[#362A24] font-semibold">
                      200 € / heure
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg">
                <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">
                  3. Honoraire complémentaire de résultat
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  La rémunération peut être accompagnée d&apos;un honoraire
                  complémentaire dit de résultat, conformément à nos règles
                  déontologiques. Cet honoraire complémentaire de résultat
                  s&apos;établit en fonction d&apos;un pourcentage, préalablement
                  fixé en accord avec le client, des sommes tant recouvrées
                  qu&apos;économisées par celui-ci à l&apos;issue d&apos;une
                  décision de justice ou d&apos;une transaction.
                </p>
                <div className="bg-[#F4F2EC] p-6 rounded-lg mt-6">
                  <p className="text-gray-600 italic">
                    Exemple&nbsp;: dans le cadre d&apos;un divorce contentieux,
                    les honoraires pourront être fixés de la manière
                    suivante&nbsp;: <strong>2 000 € d&apos;honoraires fixe + 5 %
                    du montant de la prestation compensatoire</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg">
                <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">
                  4. Facilités de paiement
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Il est possible de régler les honoraires en plusieurs fois,
                  selon des modalités adaptées à votre situation. Nous mettons
                  également à votre disposition un système de paiement en ligne
                  sécurisé.
                </p>
              </div>
            </div>

            <div className="bg-[#362A24] text-white p-10 rounded-lg text-center">
              <h2 className="font-serif text-3xl mb-4">
                Obtenir un devis personnalisé
              </h2>
              <p className="text-white/70 mb-8">
                Demandez un devis gratuit pour votre procédure de divorce ou toute
                autre affaire en droit de la famille.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/devis/divorce"
                  className="inline-flex items-center justify-center gap-3 bg-white text-[#362A24] px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-gray-100 transition-all duration-300"
                >
                  Devis divorce
                </Link>
                <Link
                  href="/paiement"
                  className="inline-flex items-center justify-center gap-3 border-2 border-white text-white px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-white hover:text-[#362A24] transition-all duration-300"
                >
                  Paiement en ligne
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
