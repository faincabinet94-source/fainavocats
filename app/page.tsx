import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Fondateur } from "@/components/sections/Fondateur";
import { Features } from "@/components/sections/Features";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";
import { Gallery } from "@/components/sections/Gallery";
import { Footer } from "@/components/sections/Footer";
import { FloatingCTA } from "@/components/ui/FloatingCTA";
import { fr } from "@/lib/i18n/fr";

// FAQPage : uniquement ici, car la FAQ n'est visible que sur l'accueil.
// Genere depuis fr.ts, la meme source que le composant <FAQ /> : le balisage
// ne peut donc pas diverger du contenu affiche (exigence Google).
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: fr.faq.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <main className="relative">
        <Hero />
        <Features />
        <Fondateur />
        <Testimonials />
        <FAQ />
        <Contact />
        <Gallery />
        <Footer />
      </main>
      <FloatingCTA />
    </>
  );
}
