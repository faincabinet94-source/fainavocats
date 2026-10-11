import { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FloatingCTA } from "@/components/ui/FloatingCTA";
import { ExpertisePage } from "@/components/sections/ExpertisePage";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { expertises } from "@/lib/expertises";
import { FichesCategorie } from "@/components/sections/FichesCategorie";

const data = expertises["prestation-compensatoire"];

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  keywords: data.keywords,
  openGraph: {
    title: data.metaTitle,
    description: data.metaDescription,
    url: "https://fain-avocats.fr/prestation-compensatoire",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Fain Avocats - Avocat Prestation Compensatoire Paris",
  description: data.metaDescription,
  url: "https://fain-avocats.fr/prestation-compensatoire",
  provider: {
    "@type": "Attorney",
    name: "Fain Avocats",
    telephone: "+33140680237",
    address: {
      "@type": "PostalAddress",
      streetAddress: "196 avenue Victor Hugo",
      addressLocality: "Paris",
      postalCode: "75116",
      addressCountry: "FR",
    },
  },
  areaServed: { "@type": "City", name: "Paris" },
  serviceType: "Prestation Compensatoire",
};

export default function PrestationCompensatoirePage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ExpertisePage data={data} />
        <FichesCategorie category="prestation-compensatoire" titre="Guides sur la prestation compensatoire" />

        <section className="bg-[#F4F2EC] pb-20">
          <Container>
            <div className="max-w-5xl mx-auto bg-white border border-[#E2DDD4] p-8 md:p-10 rounded-lg flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex-1">
                <h2 className="font-serif text-2xl text-[#1A1A1A] mb-2">
                  Estimez le montant en ligne
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Notre simulateur gratuit calcule une fourchette indicative
                  selon six méthodes de calcul usuelles.
                </p>
              </div>
              <Link
                href="/outils/simulateur-prestation-compensatoire"
                className="inline-flex items-center justify-center gap-2 bg-[#362A24] text-white px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-[#4a3a30] transition-all duration-300 shrink-0"
              >
                Accéder au simulateur
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
