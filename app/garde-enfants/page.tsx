import { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FloatingCTA } from "@/components/ui/FloatingCTA";
import { ExpertisePage } from "@/components/sections/ExpertisePage";
import { expertises } from "@/lib/expertises";

const data = expertises["garde-enfants"];

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  keywords: data.keywords,
  openGraph: {
    title: data.metaTitle,
    description: data.metaDescription,
    url: "https://www.fain-avocats.fr/garde-enfants",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Fain Avocats - Avocat Garde d'Enfants Paris",
  description: data.metaDescription,
  url: "https://www.fain-avocats.fr/garde-enfants",
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
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
