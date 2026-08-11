import { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FloatingCTA } from "@/components/ui/FloatingCTA";
import { ExpertisePage } from "@/components/sections/ExpertisePage";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { expertises } from "@/lib/expertises";

const articlesPatrimoine = [
  {
    title: "Les régimes matrimoniaux",
    slug: "regimes-matrimoniaux",
    desc: "Communauté légale, séparation de biens, participation aux acquêts : quel régime pour votre patrimoine ?",
  },
  {
    title: "Achat d'un bien immobilier pendant le divorce",
    slug: "achat-immobilier-pendant-divorce",
    desc: "Ce que permet le régime matrimonial des époux pendant la procédure.",
  },
  {
    title: "Prestation compensatoire et fiscalité",
    slug: "prestation-compensatoire-fiscalite",
    desc: "Régime fiscal selon la forme : capital, rente, impôt sur le revenu et droits d'enregistrement.",
  },
];

const data = expertises["patrimoine-successions"];

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  keywords: data.keywords,
  openGraph: {
    title: data.metaTitle,
    description: data.metaDescription,
    url: "https://fain-avocats.fr/patrimoine-successions",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Fain Avocats - Avocat Patrimoine et Successions Paris",
  description: data.metaDescription,
  url: "https://fain-avocats.fr/patrimoine-successions",
  provider: {
    "@type": "Attorney",
    name: "Fain Avocats",
    telephone: "+33140680237",
    address: {
      "@type": "PostalAddress",
      streetAddress: "196 Avenue Victor Hugo",
      addressLocality: "Paris",
      postalCode: "75116",
      addressCountry: "FR",
    },
  },
  areaServed: { "@type": "City", name: "Paris" },
  serviceType: "Patrimoine, Successions et Indivision",
};

export default function PatrimoineSuccessionsPage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ExpertisePage data={data} />

        <section className="bg-[#F4F2EC] py-20">
          <Container>
            <div className="max-w-5xl mx-auto">
              <h2 className="font-serif text-3xl text-[#1A1A1A] mb-8 text-center">
                Fiches pratiques sur le patrimoine
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {articlesPatrimoine.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/fiches/${a.slug}`}
                    className="group bg-white p-4 rounded-lg hover:shadow-lg transition-all flex items-start gap-4"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/images/fiches/${a.slug}.jpg`}
                      alt=""
                      className="w-20 h-20 object-cover rounded-md shrink-0 bg-[#F4F2EC]"
                    />
                    <div>
                      <h3 className="font-serif text-lg text-[#1A1A1A] mb-1 group-hover:text-[#362A24] transition-colors">
                        {a.title} &rarr;
                      </h3>
                      <p className="text-gray-500 text-sm text-justify">
                        {a.desc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
