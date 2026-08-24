import { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FloatingCTA } from "@/components/ui/FloatingCTA";
import { ExpertisePage } from "@/components/sections/ExpertisePage";
import { expertises } from "@/lib/expertises";
import { FichesCategorie } from "@/components/sections/FichesCategorie";

const data = expertises["annulation-mariage"];

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  keywords: data.keywords,
  openGraph: {
    title: data.metaTitle,
    description: data.metaDescription,
    url: "https://fain-avocats.fr/annulation-mariage",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Fain Avocats - Avocat Annulation de Mariage Paris",
  description: data.metaDescription,
  url: "https://fain-avocats.fr/annulation-mariage",
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
  serviceType: "Annulation de Mariage - Nullité du Mariage",
};

export default function AnnulationMariagePage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ExpertisePage data={data} />
        <FichesCategorie category="annulation-mariage" titre="Fiches pratiques sur l'annulation de mariage" />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
