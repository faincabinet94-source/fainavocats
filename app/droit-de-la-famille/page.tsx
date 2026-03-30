import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avocat Droit de la Famille Paris 16 | Divorce, Garde, Pension - Fain Avocats",
  description:
    "Cabinet d'avocats spécialisé en droit de la famille à Paris 16ème. Divorce, garde d'enfants, pension alimentaire, PACS, succession. Maître Fain, avocat expérimenté depuis 2004.",
  keywords: [
    "avocat droit de la famille paris",
    "avocat divorce paris 16",
    "avocat garde enfants paris",
    "avocat pension alimentaire",
    "avocat PACS paris",
    "avocat spécialisé famille",
    "droit de la famille avocat",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Fain Avocats - Droit de la Famille",
  description: "Cabinet d'avocats spécialisé en droit de la famille à Paris",
  url: "https://www.fain-avocats.fr/droit-de-la-famille",
  telephone: "+33140680237",
  address: {
    "@type": "PostalAddress",
    streetAddress: "196 avenue Victor Hugo",
    addressLocality: "Paris",
    postalCode: "75116",
    addressCountry: "FR",
  },
  areaServed: "France",
  priceRange: "€€",
};

export default function DroitDeLaFamillePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="bg-[#F4F2EC] min-h-screen pt-32 pb-24">
        <Container>
          <div className="max-w-5xl mx-auto">
            <a
              href="/"
              className="text-sm text-gray-500 hover:text-[#362A24] transition-colors mb-8 inline-block"
            >
              &larr; Retour &agrave; l&apos;accueil
            </a>

            <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-8 leading-tight">
              L&apos;avocat en droit de la famille
            </h1>

            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              Le <strong>droit de la famille</strong> est une branche essentielle
              du droit privé, encadrant les relations et les obligations entre les
              membres d&apos;une famille. Ses principales dispositions concernent&nbsp;:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {[
                {
                  title: "Mariage et PACS",
                  desc: "Le droit de la famille encadre les conditions du mariage, définit les différents régimes matrimoniaux, ainsi que les partenariats civils de solidarité. Il définit les droits et les obligations des conjoints.",
                },
                {
                  title: "Divorce et Séparation",
                  desc: "Lors d'une séparation ou d'un divorce, le droit de la famille va permettre de régler la répartition des biens, la garde des enfants, la pension alimentaire et les éventuelles prestations compensatoires.",
                },
                {
                  title: "Filiation et Parentalité",
                  desc: "Il s'agit de la reconnaissance juridique des liens de parenté, incluant les procédures d'adoption, la reconnaissance de paternité et les droits des grands-parents.",
                },
                {
                  title: "Garde des Enfants",
                  desc: "Le droit de la famille détermine les modalités de garde et de visite des enfants, en s'assurant que leur bien-être et leur intérêt supérieur sont respectés.",
                },
                {
                  title: "Pension Alimentaire",
                  desc: "Ce volet régule les obligations alimentaires entre parents et enfants, ainsi qu'entre ex-conjoints, afin d'assurer un soutien financier adapté.",
                },
                {
                  title: "Protection des Mineurs",
                  desc: "Il comprend des mesures pour protéger les mineurs en situation de danger, incluant les procédures d'assistance éducative et de placement.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-white p-6 rounded-lg">
                  <h3 className="font-serif text-xl text-[#1A1A1A] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white p-10 rounded-lg mb-16">
              <h2 className="font-serif text-3xl text-[#1A1A1A] mb-8">
                Les finalités du droit de la famille
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    title: "Protection Juridique",
                    desc: "Le droit de la famille offre une protection juridique essentielle aux individus, garantissant leurs droits et obligations au sein du cadre familial.",
                  },
                  {
                    title: "Résolution des Conflits",
                    desc: "Il propose des mécanismes de médiation et de résolution des conflits, favorisant des solutions amiables et équitables.",
                  },
                  {
                    title: "Soutien aux Familles",
                    desc: "Le droit de la famille soutient les familles dans des moments difficiles, en offrant des solutions juridiques adaptées à chaque situation.",
                  },
                  {
                    title: "Sécurité des Enfants",
                    desc: "En priorisant le bien-être des enfants, le droit de la famille s'assure qu'ils bénéficient de la protection et des ressources nécessaires pour leur développement.",
                  },
                ].map((item) => (
                  <div key={item.title}>
                    <h3 className="font-serif text-xl text-[#1A1A1A] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#362A24] text-white p-10 rounded-lg mb-16 text-center">
              <h2 className="font-serif text-3xl mb-4">Nos fiches pratiques</h2>
              <p className="text-white/70 mb-8">
                Retrouvez nos guides juridiques détaillés pour comprendre vos droits.
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
                <Link
                  href="/le-couple"
                  className="bg-white/10 hover:bg-white/20 transition-colors p-4 rounded-lg text-white font-medium"
                >
                  Le couple &rarr;
                </Link>
                <Link
                  href="/divorce"
                  className="bg-white/10 hover:bg-white/20 transition-colors p-4 rounded-lg text-white font-medium"
                >
                  Divorce &rarr;
                </Link>
                <Link
                  href="/les-enfants"
                  className="bg-white/10 hover:bg-white/20 transition-colors p-4 rounded-lg text-white font-medium"
                >
                  Les enfants &rarr;
                </Link>
                <Link
                  href="/etat-civil"
                  className="bg-white/10 hover:bg-white/20 transition-colors p-4 rounded-lg text-white font-medium"
                >
                  État civil &rarr;
                </Link>
                <Link
                  href="/fiches"
                  className="bg-white/10 hover:bg-white/20 transition-colors p-4 rounded-lg text-white font-medium"
                >
                  Toutes les fiches &rarr;
                </Link>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src="/fondateur-fain.png"
                  alt="Maître Fain - Avocat spécialisé en droit de la famille à Paris"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="font-serif text-3xl text-[#1A1A1A] mb-6">
                  L&apos;apport de l&apos;avocat spécialiste du droit de la famille
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Le recours à un avocat spécialisé est essentiel compte tenu des
                  règles complexes qui régissent le droit de la famille. Que vous soyez
                  confronté à un divorce, à une question de garde d&apos;enfants, à une
                  adoption ou à toute autre problématique familiale, un avocat
                  expérimenté fera le plus souvent la différence.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-2">
                      Expertise Juridique et Compétence
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Un avocat en droit de la famille possède une connaissance
                      approfondie des lois et règlements spécifiques à ce domaine.
                      Son expertise couvrira tous les aspects du droit familial.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-2">
                      Assistance Personnalisée
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Chaque situation familiale étant unique, un avocat spécialisé
                      vous offrira une assistance personnalisée, prenant en
                      considération les particularités de votre situation.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-2">
                      Négociation et Médiation
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Un avocat spécialisé est formé à la médiation et à la
                      négociation, cherchant des solutions amiables pour éviter les
                      litiges prolongés.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-2">
                      Représentation et Défense
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      En cas de litige, un avocat spécialisé vous représentera devant
                      les tribunaux, assurant une défense solide de vos intérêts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-lg text-center">
              <h2 className="font-serif text-3xl text-[#1A1A1A] mb-4">
                Contactez-nous
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Contactez-nous dès aujourd&apos;hui et découvrez comment nous pouvons
                vous aider à résoudre vos problématiques familiales avec
                professionnalisme et compassion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+33140680237"
                  className="inline-flex items-center justify-center gap-3 bg-[#362A24] text-white px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-[#2C221D] transition-all duration-300"
                >
                  +33 1 40 68 02 37
                </a>
                <Link
                  href="/devis"
                  className="inline-flex items-center justify-center gap-3 border-2 border-[#362A24] text-[#362A24] px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-[#362A24] hover:text-white transition-all duration-300"
                >
                  Obtenir un devis gratuitement
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
