import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Honoraires Avocat Paris | Tarifs Transparents - Fain Avocats",
  description:
    "Honoraires et tarifs du Cabinet Fain Avocats à Paris 16ème. Honoraires forfaitaires, au temps passé, de résultat. Transparence et facilités de paiement.",
  keywords: [
    "honoraires avocat paris",
    "tarif avocat divorce",
    "prix avocat famille",
    "honoraires avocat forfait",
    "coût avocat paris 16",
  ],
};

export default function HonorairesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#F4F2EC] min-h-screen pt-32 pb-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <a
              href="/"
              className="text-sm text-gray-500 hover:text-[#362A24] transition-colors mb-8 inline-block"
            >
              &larr; Retour &agrave; l&apos;accueil
            </a>

            <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-8 leading-tight">
              Honoraires
            </h1>

            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Le mode de rémunération de nos diligences varie selon le domaine
              juridique.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-12">
              Il existe plusieurs modes de rémunération, selon la nature et la
              difficulté du dossier, fixés en accord avec le Client.
            </p>

            <div className="space-y-6 mb-16">
              <div className="bg-white p-8 rounded-lg">
                <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">
                  L&apos;honoraire au temps passé
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  À un taux horaire convenu au préalable. Ce mode de
                  rémunération est adapté aux dossiers complexes dont la durée
                  et l&apos;étendue des diligences sont difficiles à évaluer à
                  l&apos;avance.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg">
                <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">
                  L&apos;honoraire forfaitaire
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Pour les procédures « standard » dans lesquelles il y a peu
                  d&apos;aléa (type divorce par consentement mutuel). Ce mode de
                  paiement consiste à déterminer, dès le début de la relation, un
                  montant fixe d&apos;honoraires pour une procédure déterminée.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg">
                <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">
                  L&apos;honoraire fixe assorti d&apos;un honoraire de résultat
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Il consiste en un pourcentage sur le résultat obtenu.
                  L&apos;honoraire de résultat « pur » est interdit en droit
                  français. Il doit toujours être accompagné d&apos;un honoraire
                  fixe (art. 10 de la loi du 31/12/1971).
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg">
                <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">
                  L&apos;abonnement
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Il s&apos;agit d&apos;un mode de facturation avantageux et
                  adapté aux entreprises qui ont souvent besoin de faire appel à
                  un avocat.
                </p>
              </div>
            </div>

            <div className="mb-16">
              <h2 className="font-serif text-3xl text-[#1A1A1A] mb-8">
                Par domaines d&apos;activités
              </h2>
              <div className="grid md:grid-cols-1 gap-4">
                <Link
                  href="/honoraires/droit-de-la-famille"
                  className="group bg-white p-8 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-between"
                >
                  <h3 className="font-serif text-2xl text-[#1A1A1A] group-hover:text-[#362A24] transition-colors">
                    Honoraires droit de la famille
                  </h3>
                  <span className="text-[#362A24] text-2xl">&rarr;</span>
                </Link>
              </div>
            </div>

            <div className="bg-[#362A24] text-white p-10 rounded-lg text-center">
              <h2 className="font-serif text-3xl mb-4">
                Demander un devis
              </h2>
              <p className="text-white/70 mb-8">
                Obtenez un devis gratuit et personnalisé pour votre affaire.
              </p>
              <Link
                href="/devis"
                className="inline-flex items-center justify-center gap-3 bg-white text-[#362A24] px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-gray-100 transition-all duration-300"
              >
                Demander un devis &rarr;
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
