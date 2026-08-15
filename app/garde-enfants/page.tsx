import { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FloatingCTA } from "@/components/ui/FloatingCTA";
import { ExpertisePage } from "@/components/sections/ExpertisePage";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { expertises } from "@/lib/expertises";
import { FichesCategorie } from "@/components/sections/FichesCategorie";

const articlesGarde = [
  {
    title: "L'autorité parentale",
    slug: "autorite-parentale",
    desc: "Contenu, exercice conjoint ou unilatéral, résidence et droit de visite.",
  },
  {
    title: "La pension alimentaire destinée aux enfants",
    slug: "pension-alimentaire-enfants",
    desc: "Fixation du montant selon les ressources des parents et les besoins de l'enfant.",
  },
  {
    title: "Pension alimentaire : que faire en cas de non-paiement ?",
    slug: "non-paiement-pension-alimentaire",
    desc: "Paiement direct, recouvrement public (CAF, Trésor) et sanctions pénales.",
  },
];

const data = expertises["garde-enfants"];

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  keywords: data.keywords,
  openGraph: {
    title: data.metaTitle,
    description: data.metaDescription,
    url: "https://fain-avocats.fr/garde-enfants",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Fain Avocats - Avocat Garde d'Enfants Paris",
  description: data.metaDescription,
  url: "https://fain-avocats.fr/garde-enfants",
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
  serviceType: "Garde d'Enfants et Autorité Parentale",
};

export default function GardeEnfantsPage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ExpertisePage data={data} />
        <FichesCategorie category="garde-enfants" titre="Fiches pratiques sur la garde d'enfants" />

        <section className="bg-[#F4F2EC] pb-20">
          <Container>
            <div className="max-w-5xl mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/fiches/hero-garde-enfants.jpg"
                alt="Résidence alternée et garde partagée"
                className="w-full h-56 md:h-72 object-cover rounded-lg mb-14"
              />
              <h2 className="font-serif text-3xl text-[#1A1A1A] mb-8 text-center">
                Fiches pratiques sur la garde des enfants
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {articlesGarde.map((a) => (
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
