"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { CreditCard } from "lucide-react";
import { PagePaiement, boutonCls, champCls, euros, lireMontant } from "@/components/paiement/PagePaiement";
import { memoriserRetour } from "@/lib/paiement";

/* Règlement d'honoraires d'un montant libre, par carte, Stripe intégré à la
   page (solde, acompte, montant au choix).
   Paramètres facultatifs (liens de l'espace client ou du cabinet) :
     montant  montant en euros, prérempli
     email    courriel, prérempli
     objet    libellé du règlement, prérempli (« Solde d'honoraires »)
     retour   « espace » : la page de confirmation ramène le client dans son espace */

let stripePromesse: Promise<Stripe | null> | null = null;

function Checkout({ montant, email, objet, retour }: { montant: number; email: string; objet: string; retour: string | null }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    let actif = true;
    fetch("/api/honoraires", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ montant, email, objet, retour }),
    })
      .then((r) => r.json().then((j) => ({ ok: r.ok, j })))
      .then(({ ok, j }) => {
        if (!ok || !j.clientSecret) throw new Error(j.message || "Paiement indisponible.");
        if (!stripePromesse) stripePromesse = loadStripe(j.publishableKey);
        if (actif) setClientSecret(j.clientSecret);
      })
      .catch((x) => {
        if (actif) setErreur(x instanceof Error ? x.message : "Paiement indisponible. Appelez-nous au 01 40 68 02 37.");
      });
    return () => {
      actif = false;
    };
  }, [montant, email, objet, retour]);

  if (erreur) return <p className="py-6 text-center text-sm text-[#B42318]">{erreur}</p>;
  if (!clientSecret || !stripePromesse) return <p className="py-10 text-center text-sm text-gray-500">Ouverture du paiement sécurisé…</p>;
  return (
    <div className="w-full min-w-0">
      <EmbeddedCheckoutProvider stripe={stripePromesse} options={{ clientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

function HonorairesContent() {
  const params = useSearchParams();
  const retour = params.get("retour");
  const [montant, setMontant] = useState(() => {
    const m = lireMontant(params.get("montant") || "");
    return m ? String(m).replace(".", ",") : "";
  });
  const [email, setEmail] = useState(params.get("email") || "");
  const [objet, setObjet] = useState(params.get("objet") || "");
  const [valide, setValide] = useState<{ montant: number; email: string; objet: string } | null>(null);
  const [erreur, setErreur] = useState("");
  const m = lireMontant(montant);
  useEffect(() => memoriserRetour(retour), [retour]);

  function continuer(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    if (!m) return setErreur("Indiquez le montant à régler.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setErreur("Indiquez un courriel valide : le reçu vous y sera adressé.");
    setValide({ montant: m, email: email.trim(), objet: objet.trim() });
    setTimeout(() => document.getElementById("paiement")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }

  return (
    <PagePaiement
      titre="Règlement d'honoraires"
      prestataire="Stripe"
      intro={
        <p>
          Réglez votre solde ou un acompte sur honoraires par carte bancaire. Le montant indiqué peut
          être modifié avant le paiement. Stripe vous adresse un reçu par courriel.
        </p>
      }
    >
      <form onSubmit={continuer} className="space-y-5 rounded-lg bg-white p-8">
        <label className="block">
          <span className="mb-2 block text-[15px] text-[#1A1A1A]">Montant (€)</span>
          <input
            className={champCls}
            value={montant}
            onChange={(e) => {
              setMontant(e.target.value);
              setValide(null);
            }}
            inputMode="decimal"
            placeholder="Ex. : 750"
          />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-[15px] text-[#1A1A1A]">Courriel</span>
            <input
              type="email"
              className={champCls}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValide(null);
              }}
              autoComplete="email"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[15px] text-[#1A1A1A]">Objet (facultatif)</span>
            <input
              className={champCls}
              value={objet}
              onChange={(e) => {
                setObjet(e.target.value);
                setValide(null);
              }}
              placeholder="Ex. : solde d'honoraires"
            />
          </label>
        </div>
        {erreur && <p className="text-sm text-[#B42318]">{erreur}</p>}
        {!valide && (
          <button type="submit" className={boutonCls}>
            <CreditCard className="h-4 w-4" strokeWidth={1.8} />
            {m ? `Régler ${euros(m)}` : "Régler"}
          </button>
        )}
      </form>
      {valide && (
        <div id="paiement" className="mt-6 rounded-lg bg-white p-2 sm:p-6">
          <Checkout key={`${valide.montant}-${valide.email}-${valide.objet}`} {...valide} retour={retour} />
        </div>
      )}
    </PagePaiement>
  );
}

export default function Honoraires() {
  return (
    <Suspense>
      <HonorairesContent />
    </Suspense>
  );
}
