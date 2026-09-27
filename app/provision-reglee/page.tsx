"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { courrielConjoint, lireDemande, type DemandeConjoint } from "@/lib/paiement";

/* Page de retour après paiement de la provision (redirection réglée dans Stripe,
   sur chaque lien de paiement : « Après le paiement », « Rediriger vers votre
   site web »). Quand le client vient de régler sa moitié, on lui propose
   d'écrire lui-même à son conjoint, depuis sa messagerie. */
export default function ProvisionReglee() {
  const [demande, setDemande] = useState<DemandeConjoint | null>(null);
  useEffect(() => setDemande(lireDemande()), []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F4F2EC] pb-24 pt-32">
        <Container>
          <div className="mx-auto max-w-2xl rounded-2xl border border-[#E5E2DA] bg-white p-8 text-center sm:p-12">
            <CheckCircle2 className="mx-auto h-12 w-12 text-[#362A24]" strokeWidth={1.5} />
            <h1 className="mt-5 font-serif text-3xl text-[#1A1A1A]">Merci, votre règlement est bien reçu</h1>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600">
              Stripe vous adresse un reçu par courriel. Le cabinet revient vers vous pour la suite de
              votre dossier.
            </p>
            {demande && (
              <div className="mx-auto mt-8 max-w-xl rounded-xl border border-[#E5E2DA] bg-[#F9F8F6] p-6 text-left">
                <h2 className="font-serif text-xl text-[#1A1A1A]">Reste la part de votre conjoint</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
                  La procédure commence dès réception des deux règlements. Vous pouvez lui écrire depuis
                  votre messagerie : le courriel est prêt, avec le lien de paiement de sa part. Vous le
                  relisez avant de l&apos;envoyer.
                </p>
                <a
                  href={courrielConjoint(demande)}
                  className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-[#C2A679] px-7 py-3.5 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-[#B39566]"
                >
                  <Mail className="h-4 w-4" strokeWidth={1.8} />
                  Écrire à mon conjoint
                </a>
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
