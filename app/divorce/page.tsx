import { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FloatingCTA } from "@/components/ui/FloatingCTA";
import { ExpertisePage } from "@/components/sections/ExpertisePage";
import { Container } from "@/components/ui/Container";
import { expertises } from "@/lib/expertises";

const data = expertises["divorce"];

const divorceArticles = [
  { title: "Le coût d'une procédure de divorce", slug: "cout-procedure-divorce", desc: "Honoraires avocat, frais notaire et droits de partage selon le type de procédure." },
  { title: "De la pension alimentaire à la prestation compensatoire", slug: "prestation-compensatoire", desc: "Comprendre la différence et les critères de fixation." },
  { title: "Achat d'un bien immobilier pendant le divorce", slug: "achat-immobilier-pendant-divorce", desc: "L'achat est possible selon le régime matrimonial des époux." },
  { title: "Divorce et impôts", slug: "divorce-impots", desc: "Déclaration de revenus et fiscalité en cas de divorce." },
  { title: "Divorce et titre de séjour", slug: "divorce-titre-sejour", desc: "Conséquences du divorce sur le titre de séjour." },
];

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  keywords: data.keywords,
  openGraph: {
    title: data.metaTitle,
    description: data.metaDescription,
    url: "https://www.fain-avocats.fr/divorce",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Fain Avocats - Avocat Divorce Paris",
  description: data.metaDescription,
  url: "https://www.fain-avocats.fr/divorce",
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
  serviceType: "Divorce et Séparation",
};

export default function DivorcePage() {
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
                Articles &amp; fiches pratiques sur le divorce
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {divorceArticles.map((a) => (
                  <Link key={a.slug} href={`/fiches/${a.slug}`} className="group bg-white p-6 rounded-lg hover:shadow-lg transition-all">
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-2 group-hover:text-[#362A24] transition-colors">{a.title} &rarr;</h3>
                    <p className="text-gray-500 text-sm text-justify">{a.desc}</p>
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
