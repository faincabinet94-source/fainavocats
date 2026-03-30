import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import Image from "next/image";
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consultation Avocat Divorce Paris | Consultation Juridique en Ligne - Fain Avocats",
  description: "Consultation juridique en ligne en droit de la famille et divorce. Consultation au cabinet, en visioconférence ou par téléphone. Avocat spécialisé Paris 16ème. Prenez rendez-vous en ligne.",
  keywords: ["consultation avocat divorce paris", "consultation juridique en ligne", "consultation avocat droit famille", "rendez-vous avocat paris 16", "consultation visio avocat divorce"],
};

export default function ConsultationsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#F4F2EC] min-h-screen pt-32 pb-24">
        <Container>
          <div className="max-w-5xl mx-auto">
            <a href="/" className="text-sm text-gray-500 hover:text-[#362A24] transition-colors mb-8 inline-block">
              &larr; Retour &agrave; l&apos;accueil
            </a>

            <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-8 leading-tight text-center">
              Consultation Juridique en Ligne en droit de la famille et Divorce
            </h1>

            <p className="text-gray-700 text-lg leading-relaxed mb-12 max-w-3xl mx-auto text-center">
              Réservez votre créneau de consultation directement en ligne. Choisissez le mode qui vous convient&nbsp;: au cabinet, en visioconférence ou par téléphone.
            </p>

            <div className="bg-white p-10 rounded-lg text-center mb-20">
              <div id="avocat-widget" className="mb-4">
                <a
                  className="avocat-consultingwidget"
                  href="https://consultation.avocat.fr/avocat-1132-ea21.html"
                  data-widget-id="4b2b406fdc824ea8e64d"
                >
                  Consulter mon profil Avocat.fr
                </a>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
              <div>
                <h2 className="font-serif text-3xl text-[#1A1A1A] mb-6">
                  Pourquoi prendre rendez-vous&nbsp;?
                </h2>

                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Notre service de prise de rendez-vous en ligne vous offre la possibilité de planifier une consultation avec un avocat spécialisé en droit de la famille et divorce.
                </p>

                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Durant cette consultation, posez toutes vos questions pour obtenir des conseils précis sur votre situation juridique familiale.
                </p>

                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  Maîtrisez votre budget en réglant votre consultation à l&apos;avance à un prix fixe. Besoin d&apos;aide sur le calcul de la pension alimentaire de vos enfants&nbsp;? Ou sur la prestation compensatoire&nbsp;? Profitez de l&apos;expertise d&apos;un avocat expérimenté.
                </p>
              </div>

              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src="/consultation-avocat.png"
                  alt="Consultation avocat droit de la famille Paris - Cabinet Fain Avocats"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg">
                <div className="w-12 h-12 bg-[#362A24]/10 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-[#362A24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl text-[#1A1A1A] mb-3">Au cabinet</h3>
                <p className="text-gray-600 leading-relaxed">
                  Consultation en face à face dans nos locaux au 196 avenue Victor Hugo, Paris 16ème. Un cadre confidentiel pour aborder votre situation en toute sérénité.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg">
                <div className="w-12 h-12 bg-[#362A24]/10 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-[#362A24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl text-[#1A1A1A] mb-3">En visioconférence</h3>
                <p className="text-gray-600 leading-relaxed">
                  Consultation par visioconférence depuis chez vous. Pratique et efficace, sans vous déplacer, avec le même niveau de conseil et de confidentialité.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg">
                <div className="w-12 h-12 bg-[#362A24]/10 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-[#362A24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl text-[#1A1A1A] mb-3">Par téléphone</h3>
                <p className="text-gray-600 leading-relaxed">
                  Consultation téléphonique rapide et confidentielle. Idéal pour une première évaluation de votre situation ou un suivi de dossier en cours.
                </p>
              </div>
            </div>

          </div>
        </Container>
        <Script
          id="avocat-widget-script"
          strategy="lazyOnload"
          src="https://consultation.avocat.fr/js/consultingwidget.js"
        />
      </main>
      <Footer />
    </>
  );
}
