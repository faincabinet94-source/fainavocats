"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CreditCard, Lock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { PROVISIONS, type Provision } from "@/lib/paiement";
import { CheckoutIntegre } from "@/components/paiement/PaiementProvision";

/* Règlement de la provision de départ, paiement Stripe intégré à la page.
   Paramètres facultatifs, pour les liens envoyés par le cabinet :
     email   courriel du client, prérempli
     part    « moitie » pour mettre en avant la demi-provision (honoraires partagés) */

const OPTIONS: { p: Provision; titre: string; texte: string }[] = [
  {
    p: "totale",
    titre: "Provision de 250 €",
    texte: "Vous réglez la provision en entier : la procédure commence dès sa réception.",
  },
  {
    p: "moitie",
    titre: "Demi-provision de 125 €",
    texte: "Vous partagez la provision avec votre conjoint : chacun règle sa moitié.",
  },
];

function PaiementContent() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const enAvant: Provision = params.get("part") === "moitie" ? "moitie" : "totale";
  const [choix, setChoix] = useState<Provision | null>(null);
  const marque = choix || enAvant;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F4F2EC] pb-24 pt-32">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 font-serif text-4xl leading-tight text-[#1A1A1A] md:text-5xl">
              Régler la provision
            </h1>
            <p className="mb-12 text-lg leading-relaxed text-gray-700">
              La provision lance la procédure. Elle vient en déduction des honoraires proposés
              dans votre devis : ce n&apos;est pas un supplément.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {OPTIONS.map((o) => (
                <div
                  key={o.p}
                  className={`flex flex-col rounded-lg bg-white p-8 ${o.p === marque ? "ring-2 ring-[#C2A679]" : ""}`}
                >
                  <h2 className="font-serif text-2xl text-[#1A1A1A]">{o.titre}</h2>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-gray-600">{o.texte}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setChoix(o.p);
                      setTimeout(() => document.getElementById("paiement")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
                    }}
                    aria-pressed={choix === o.p}
                    className={`mt-6 inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-medium transition-colors ${
                      o.p === marque
                        ? "bg-[#C2A679] text-[#1A1A1A] hover:bg-[#B39566]"
                        : "bg-[#362A24] text-white hover:bg-[#2C221D]"
                    }`}
                  >
                    <CreditCard className="h-4 w-4" strokeWidth={1.8} />
                    Payer {PROVISIONS[o.p].montant}
                  </button>
                </div>
              ))}
            </div>

            {choix && (
              <div id="paiement" className="mt-8 rounded-lg bg-white p-2 sm:p-6">
                <CheckoutIntegre key={choix} part={choix} email={email} />
              </div>
            )}

            <p className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Lock className="h-4 w-4" />
              Paiement sécurisé par Stripe.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

export default function PaiementPage() {
  return (
    <Suspense>
      <PaiementContent />
    </Suspense>
  );
}
