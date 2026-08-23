import { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FloatingCTA } from "@/components/ui/FloatingCTA";
import { DivorceSansJuge } from "@/components/sections/DivorceSansJuge";
import { FAQ_ITEMS } from "@/lib/divorce-sans-juge";

const URL = "https://fain-avocats.fr/divorce-sans-juge";

export const metadata: Metadata = {
  title: "Divorce sans juge à Paris | Avocat divorce par consentement mutuel",
  description:
    "Divorce par consentement mutuel sans juge : convention contresignée par avocats, délai de réflexion de quinze jours, dépôt chez le notaire. Estimez vos honoraires en ligne. Cabinet Fain Avocats, Paris 16.",
  keywords: [
    "divorce sans juge",
    "avocat divorce sans juge Paris",
    "divorce par consentement mutuel Paris",
    "divorce par acte d'avocat",
    "divorce amiable Paris 16",
    "convention de divorce notaire",
  ],
  openGraph: {
    title: "Divorce sans juge à Paris | Avocat divorce par consentement mutuel",
    description:
      "La convention rédigée par vos avocats et déposée chez un notaire suffit à dissoudre le mariage. Estimez vos honoraires en ligne.",
    url: URL,
    type: "website",
  },
};

/* LegalService + FAQPage : la FAQ est reprise du composant, pour que le balisage
   et ce qui est affiché ne puissent pas diverger. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LegalService",
      "@id": `${URL}#service`,
      name: "Fain Avocats — Divorce sans juge, Paris",
      description:
        "Divorce par consentement mutuel par acte d'avocat, sans passage devant le juge : rédaction de la convention, délai de réflexion, dépôt au rang des minutes du notaire.",
      url: URL,
      serviceType: "Divorce par consentement mutuel sans juge",
      areaServed: { "@type": "City", name: "Paris" },
      provider: {
        "@type": "Attorney",
        name: "Fain Avocats",
        telephone: "+33140680237",
        email: "contact@fain-avocats.fr",
        address: {
          "@type": "PostalAddress",
          streetAddress: "196 Avenue Victor Hugo",
          addressLocality: "Paris",
          postalCode: "75116",
          addressCountry: "FR",
        },
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${URL}#faq`,
      mainEntity: FAQ_ITEMS.map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: { "@type": "Answer", text: q.answer },
      })),
    },
  ],
};

export default function DivorceSansJugePage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <DivorceSansJuge />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
