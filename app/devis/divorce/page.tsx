import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devis Divorce en Ligne Gratuit | Avocat Divorce Paris - Fain Avocats",
  description:
    "Demandez votre devis gratuit en ligne pour un divorce : consentement mutuel, divorce contentieux, séparation de corps. Avocat spécialisé Paris 16ème. Intervention dans toute la France.",
  keywords: [
    "devis divorce en ligne",
    "devis gratuit divorce",
    "tarif avocat divorce paris",
    "prix divorce consentement mutuel",
    "devis divorce contentieux",
    "avocat divorce paris 16",
  ],
};

export default function DevisDivorcePage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#F4F2EC] min-h-screen pt-32 pb-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <nav className="text-sm text-gray-500 mb-8">
              <a href="/" className="hover:text-[#362A24] transition-colors">
                Accueil
              </a>
              <span className="mx-2">&gt;</span>
              <a
                href="/devis"
                className="hover:text-[#362A24] transition-colors"
              >
                Devis
              </a>
              <span className="mx-2">&gt;</span>
              <span className="text-[#362A24]">Devis Avocat Divorce</span>
            </nav>

            <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-8 leading-tight">
              Devis Divorce
            </h1>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Le cabinet Fain Avocats propose des honoraires adaptés et
              transparents pour chaque type de divorce. Remplissez le formulaire
              ci-dessous pour recevoir un devis personnalisé et gratuit.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed mb-12">
              Le formulaire est entièrement confidentiel. Vous recevrez une
              réponse sous 24 à 48 heures.
            </p>

            <div className="bg-white p-6 md:p-10 rounded-lg mb-12">
              <iframe
                src="https://www.cognitoforms.com/f/7odepi9SUkCmb7Yrf3m2Cg?id=12"
                style={{ border: 0, width: "100%" }}
                height="700"
                title="Formulaire de devis divorce"
              />
            </div>

            <div className="bg-[#362A24] text-white p-10 rounded-lg text-center">
              <h2 className="font-serif text-3xl mb-4">
                Besoin d&apos;aide&nbsp;?
              </h2>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                Si vous préférez nous contacter directement, appelez-nous ou
                envoyez-nous un e-mail.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+33140680237"
                  className="inline-flex items-center justify-center gap-3 bg-white text-[#362A24] px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-gray-100 transition-all duration-300"
                >
                  +33 1 40 68 02 37
                </a>
                <a
                  href="mailto:contact@fain-avocats.fr"
                  className="inline-flex items-center justify-center gap-3 border-2 border-white text-white px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-white hover:text-[#362A24] transition-all duration-300"
                >
                  contact@fain-avocats.fr
                </a>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
