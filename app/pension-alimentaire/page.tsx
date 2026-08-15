import { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FloatingCTA } from "@/components/ui/FloatingCTA";
import { ExpertisePage } from "@/components/sections/ExpertisePage";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { expertises } from "@/lib/expertises";
import { FichesCategorie } from "@/components/sections/FichesCategorie";

const articlesPension = [
  {
    title: "La pension alimentaire destinée aux enfants",
    slug: "pension-alimentaire-enfants",
    desc: "Comment fixer le montant ? Ressources et charges des parents, besoins de l'enfant, révision.",
  },
  {
    title: "Pension alimentaire : que faire en cas de non-paiement ?",
    slug: "non-paiement-pension-alimentaire",
    desc: "Paiement direct, recouvrement public (CAF, Trésor) et sanctions pénales.",
  },
  {
    title: "De la pension alimentaire à la prestation compensatoire",
    slug: "prestation-compensatoire",
    desc: "Comprendre la différence entre les deux notions et les critères de fixation.",
  },
];

const data = expertises["pension-alimentaire"];

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  keywords: data.keywords,
  openGraph: {
    title: data.metaTitle,
    description: data.metaDescription,
    url: "https://fain-avocats.fr/pension-alimentaire",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Fain Avocats - Avocat Pension Alimentaire Paris",
  description: data.metaDescription,
  url: "https://fain-avocats.fr/pension-alimentaire",
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
  serviceType: "Pension Alimentaire et Prestation Compensatoire",
};

export default function PensionAlimentairePage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ExpertisePage data={data} />
        <FichesCategorie category="pension-alimentaire" titre="Fiches pratiques sur la pension alimentaire et la prestation compensatoire" />

        <section className="bg-[#F4F2EC] py-20">
          <Container>
            <div className="max-w-5xl mx-auto">
              <h2 className="font-serif text-3xl text-[#1A1A1A] mb-8 text-center">
                Fiches pratiques sur la pension alimentaire
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {articlesPension.map((a) => (
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
