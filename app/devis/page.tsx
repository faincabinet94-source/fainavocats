import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devis Avocat en Ligne | Devis Gratuit Divorce & Famille - Fain Avocats Paris",
  description: "Obtenez un devis gratuit en ligne pour votre procédure de divorce ou droit de la famille. Cabinet Fain Avocats Paris 16ème. Intervention dans toute la France.",
  keywords: ["devis avocat divorce", "devis avocat en ligne", "devis divorce paris", "tarif avocat divorce", "devis gratuit avocat famille"],
};

export default function DevisPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#F4F2EC] min-h-screen pt-32 pb-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <a href="/" className="text-sm text-gray-500 hover:text-[#362A24] transition-colors mb-8 inline-block">
              &larr; Retour &agrave; l&apos;accueil
            </a>

            <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-8 leading-tight">
              Devis en ligne
            </h1>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Notre Cabinet d&apos;Avocats situé à Paris 16ème intervient dans la France entière. Nous disposons de postulants dans l&apos;ensemble des barreaux français, c&apos;est-à-dire de confrères avocats inscrits au barreau du Tribunal dont vous dépendez.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed mb-12">
              Nous vous proposons de remplir le formulaire suivant afin d&apos;obtenir un devis en ligne gratuit.
            </p>

            <h2 className="font-serif text-3xl text-[#1A1A1A] mb-8">Demander un devis</h2>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <Link
                href="/devis/divorce"
                className="group bg-white p-10 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 bg-[#362A24]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#362A24]/20 transition-colors">
                  <svg className="w-7 h-7 text-[#362A24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl text-[#1A1A1A] mb-3 group-hover:text-[#362A24] transition-colors">
                  Devis pour un divorce &rarr;
                </h3>
                <p className="text-gray-600">
                  Divorce par consentement mutuel, contentieux, séparation de corps. Obtenez une estimation précise et transparente.
                </p>
              </Link>

              <a
                href="tel:+33140680237"
                className="group bg-white p-10 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 bg-[#362A24]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#362A24]/20 transition-colors">
                  <svg className="w-7 h-7 text-[#362A24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl text-[#1A1A1A] mb-3 group-hover:text-[#362A24] transition-colors">
                  Autres demandes &rarr;
                </h3>
                <p className="text-gray-600">
                  Garde d&apos;enfants, pension alimentaire, succession, patrimoine. Contactez-nous pour une étude personnalisée.
                </p>
              </a>
            </div>

            <div className="bg-white p-10 rounded-lg text-center">
              <h2 className="font-serif text-3xl text-[#1A1A1A] mb-6">Prenez rendez-vous</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Réservez votre créneau de consultation directement en ligne via notre profil Avocat.fr.
              </p>
              <div id="avocat-widget-devis">
                <a
                  className="avocat-consultingwidget"
                  href="https://consultation.avocat.fr/avocat-1132-ea21.html"
                  data-widget-id="4b2b406fdc824ea8e64d"
                >
                  Consulter mon profil Avocat.fr
                </a>
              </div>
            </div>
          </div>
        </Container>
        <Script id="avocat-widget-devis-script" strategy="lazyOnload" src="https://consultation.avocat.fr/js/consultingwidget.js" />
      </main>
      <Footer />
    </>
  );
}
