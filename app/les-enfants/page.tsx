import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avocat Droit des Enfants Paris | Garde, Pension, Adoption - Fain Avocats",
  description:
    "Avocat spécialisé en droit des enfants à Paris : garde, pension alimentaire, autorité parentale, adoption, nom de famille. Cabinet Fain Avocats, Paris 16ème.",
  keywords: [
    "avocat garde enfants paris",
    "avocat pension alimentaire enfants",
    "autorité parentale avocat",
    "avocat adoption paris",
    "droit de visite avocat",
    "nom famille enfant divorce",
    "avocat enfants divorce paris",
  ],
};

const fichesDivorceEnfants = [
  {
    title: "Le nom de famille de l'enfant en cas de divorce",
    desc: "Le divorce des parents n'a pas d'incidence sur le nom de famille des enfants, même s'il peut ajouter le nom d'usage de sa mère.",
  },
  {
    title: "La transmission du nom de famille des parents à l'enfant",
    desc: "Les parents peuvent choisir, comme nom de famille de leur enfant, le nom du père suivi de celui de la mère ou inversement.",
  },
  {
    title: "La pension alimentaire destinée aux enfants",
    desc: "Comment fixer le montant de la pension alimentaire ? Le juge prend en compte les ressources et charges des parents, ainsi que les besoins de l'enfant.",
  },
  {
    title: "L'autorité parentale",
    desc: "Le contenu de l'autorité parentale est défini comme le pouvoir d'éducation, de surveillance, de protection et de garde des enfants.",
  },
];

export default function LesEnfantsPage() {
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
              <span className="text-[#362A24]">Les enfants</span>
            </nav>

            <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-8 leading-tight">
              Les enfants
            </h1>

            <p className="text-gray-700 text-lg leading-relaxed mb-12">
              Les enfants sont à l&apos;origine d&apos;un important contentieux.
              Compte tenu de leur vulnérabilité, le législateur et le Juge aux
              Affaires Familiales veillent tout particulièrement à la protection
              de leurs intérêts. S&apos;il s&apos;agit le plus souvent de
              problèmes relatifs au droit de garde ou à la fixation du montant de
              la pension alimentaire, on constate aujourd&apos;hui une
              augmentation des actions en contestation de paternité.
            </p>

            <div className="mb-16">
              <h2 className="font-serif text-3xl text-[#1A1A1A] mb-6">
                1. Divorce et enfants
              </h2>
              <div className="bg-white p-8 rounded-lg mb-8">
                <p className="text-gray-700 text-lg leading-relaxed">
                  L&apos;enfant est au cœur du droit de la famille qui veille à
                  la préservation de son intérêt. Lors d&apos;une séparation, il
                  conviendra de rechercher ce que recommande l&apos;intérêt de
                  l&apos;enfant, et non celui de ses parents. La fixation du droit
                  de garde et les modalités d&apos;exercice du droit de visite et
                  d&apos;hébergement devront correspondre à cet impératif. Les
                  besoins d&apos;un enfant évoluent. C&apos;est la raison pour
                  laquelle il sera toujours possible de solliciter une
                  modification du droit de garde ou une révision du montant de la
                  pension alimentaire.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {fichesDivorceEnfants.map((fiche) => (
                  <div key={fiche.title} className="bg-white p-6 rounded-lg">
                    <h3 className="font-serif text-xl text-[#1A1A1A] mb-3">
                      {fiche.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{fiche.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-16">
              <h2 className="font-serif text-3xl text-[#1A1A1A] mb-6">
                2. L&apos;adoption
              </h2>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-serif text-xl text-[#1A1A1A] mb-3">
                  L&apos;adoption simple
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Les conditions de l&apos;adoption sont relatives à
                  l&apos;adoptant et à l&apos;adopté. L&apos;adoption simple
                  crée un lien de filiation entre l&apos;adoptant et
                  l&apos;adopté tout en maintenant les liens avec la famille
                  d&apos;origine. Elle peut concerner aussi bien un mineur
                  qu&apos;un majeur.
                </p>
              </div>
            </div>

            <div className="mb-16">
              <h2 className="font-serif text-3xl text-[#1A1A1A] mb-6">
                3. Le non-paiement de la pension alimentaire
              </h2>
              <div className="bg-white p-6 rounded-lg">
                <p className="text-gray-600 leading-relaxed mb-4">
                  Le non-paiement de la pension alimentaire constitue un délit
                  d&apos;abandon de famille, puni de deux ans
                  d&apos;emprisonnement et de 15 000 euros d&apos;amende.
                  Plusieurs recours sont possibles&nbsp;:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#362A24] mt-1">•</span>
                    <span>
                      Le paiement direct par l&apos;intermédiaire d&apos;un
                      huissier de justice
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#362A24] mt-1">•</span>
                    <span>
                      Le recouvrement par la CAF (Caisse d&apos;Allocations
                      Familiales)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#362A24] mt-1">•</span>
                    <span>
                      Le recouvrement par le Trésor Public
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#362A24] mt-1">•</span>
                    <span>La plainte pénale pour abandon de famille</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-[#362A24] text-white p-10 rounded-lg text-center">
              <h2 className="font-serif text-3xl mb-4">
                Protégez les droits de vos enfants
              </h2>
              <p className="text-white/70 mb-8">
                Un avocat spécialisé vous accompagne pour défendre au mieux
                l&apos;intérêt supérieur de vos enfants.
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
