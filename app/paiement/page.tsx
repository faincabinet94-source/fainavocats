"use client";

import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const amounts = [
  { label: "500 €", value: 50000 },
  { label: "1 000 €", value: 100000 },
  { label: "1 500 €", value: 150000 },
  { label: "2 000 €", value: 200000 },
  { label: "2 500 €", value: 250000 },
  { label: "3 000 €", value: 300000 },
];

function PaiementContent() {
  const searchParams = useSearchParams();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [dossierRef, setDossierRef] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchParams.get("status") === "done") {
      setPaymentSuccess(true);
    }
  }, [searchParams]);

  const getAmountInCents = () => {
    if (selectedAmount) return selectedAmount;
    const parsed = parseFloat(customAmount.replace(",", "."));
    if (!isNaN(parsed) && parsed > 0) return Math.round(parsed * 100);
    return 0;
  };

  const formatAmount = (cents: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const amountCents = getAmountInCents();
    if (amountCents < 100) {
      setError("Le montant minimum est de 1 €.");
      return;
    }
    if (!clientName.trim()) {
      setError("Veuillez indiquer votre nom.");
      return;
    }
    if (!clientEmail.trim() || !clientEmail.includes("@")) {
      setError("Veuillez indiquer un email valide.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/paiement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountCents,
          currency: "eur",
          description: `Acompte honoraires - ${dossierRef || "Sans référence"} - ${clientName}`,
          customer: {
            name: clientName,
            email: clientEmail,
          },
        }),
      });

      const data = await response.json();

      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else if (data.error) {
        setError(data.error);
      } else {
        setPaymentSuccess(true);
      }
    } catch {
      setError(
        "Une erreur est survenue. Veuillez réessayer ou nous contacter directement."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <>
        <Navbar />
        <main className="bg-[#F4F2EC] min-h-screen pt-32 pb-24">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="font-serif text-4xl text-[#1A1A1A] mb-6">
                Paiement confirmé
              </h1>
              <p className="text-gray-700 text-lg mb-8">
                Votre paiement a été effectué avec succès. Vous recevrez un
                e-mail de confirmation à l&apos;adresse indiquée.
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-3 bg-[#362A24] text-white px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-[#2C221D] transition-all duration-300"
              >
                Retour à l&apos;accueil
              </a>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#F4F2EC] min-h-screen pt-32 pb-24">
        <Container>
          <div className="max-w-3xl mx-auto">
            <a
              href="/"
              className="text-sm text-gray-500 hover:text-[#362A24] transition-colors mb-8 inline-block"
            >
              &larr; Retour à l&apos;accueil
            </a>

            <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-6 leading-tight">
              Paiement en ligne
            </h1>

            <p className="text-gray-700 text-lg leading-relaxed mb-12">
              Réglez votre acompte sur honoraires en toute sécurité. Le paiement
              est sécurisé par Stancer, prestataire de services de paiement agréé
              par l&apos;ACPR (Banque de France).
            </p>

            <form onSubmit={handlePayment} className="space-y-8">
              <div className="bg-white p-8 rounded-lg">
                <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6">
                  1. Vos informations
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="clientName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nom complet *
                    </label>
                    <input
                      id="clientName"
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#362A24] focus:border-transparent transition-all"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="clientEmail"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email *
                    </label>
                    <input
                      id="clientEmail"
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#362A24] focus:border-transparent transition-all"
                      placeholder="jean.dupont@email.com"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label
                    htmlFor="dossierRef"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Référence dossier (optionnel)
                  </label>
                  <input
                    id="dossierRef"
                    type="text"
                    value={dossierRef}
                    onChange={(e) => setDossierRef(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#362A24] focus:border-transparent transition-all"
                    placeholder="Votre référence de dossier"
                  />
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg">
                <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6">
                  2. Montant de l&apos;acompte
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {amounts.map((a) => (
                    <button
                      key={a.value}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(a.value);
                        setCustomAmount("");
                      }}
                      className={`py-4 px-6 rounded-lg text-center font-medium transition-all duration-200 ${
                        selectedAmount === a.value
                          ? "bg-[#362A24] text-white"
                          : "bg-gray-50 text-[#1A1A1A] hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
                <div>
                  <label
                    htmlFor="customAmount"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Ou saisissez un montant personnalisé (€)
                  </label>
                  <input
                    id="customAmount"
                    type="text"
                    inputMode="decimal"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#362A24] focus:border-transparent transition-all"
                    placeholder="Ex : 750"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                  {error}
                </div>
              )}

              <div className="bg-white p-8 rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-gray-600">Montant à payer</span>
                  <span className="font-serif text-3xl text-[#1A1A1A]">
                    {getAmountInCents() > 0
                      ? formatAmount(getAmountInCents())
                      : "—"}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || getAmountInCents() < 100}
                  className="w-full bg-[#362A24] text-white py-4 rounded-full text-sm font-medium tracking-wide hover:bg-[#2C221D] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Traitement en cours..." : "Procéder au paiement sécurisé"}
                </button>
                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Paiement sécurisé par Stancer (agréé ACPR - Banque de France)
                </div>
              </div>
            </form>
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
