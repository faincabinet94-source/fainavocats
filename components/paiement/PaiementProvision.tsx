"use client";

import { useEffect, useState } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROVISIONS, lienProvision, type Provision } from "@/lib/paiement";

/* Stripe n'autorise qu'un formulaire de paiement intégré à la fois sur une page :
   pour changer de montant, on démonte l'ancien (clé React = montant) avant de
   monter le nouveau. Une session par montant, créée à la demande. */
let stripePromesse: Promise<Stripe | null> | null = null;

export function CheckoutIntegre({ part, email }: { part: Provision; email?: string }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    let actif = true;
    fetch("/api/provision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ part, email }),
    })
      .then((r) => r.json().then((j) => ({ ok: r.ok, j })))
      .then(({ ok, j }) => {
        if (!ok || !j.clientSecret) throw new Error();
        if (!stripePromesse) stripePromesse = loadStripe(j.publishableKey);
        if (actif) setClientSecret(j.clientSecret);
      })
      .catch(() => {
        /* paiement intégré indisponible : lien de paiement Stripe */
        if (actif) window.location.href = lienProvision(part, email);
      });
    return () => {
      actif = false;
    };
  }, [part, email]);

  if (!clientSecret || !stripePromesse) {
    return <p className="py-10 text-center text-sm text-gray-500">Ouverture du paiement sécurisé…</p>;
  }
  return (
    <div className="w-full min-w-0">
      <EmbeddedCheckoutProvider stripe={stripePromesse} options={{ clientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

/* Bouton qui déplie le paiement intégré sous lui (fin du formulaire de
   renseignements, où un seul montant est proposé). */
export function PaiementProvision({
  part,
  email,
  libelle,
  avant,
  className,
}: {
  part: Provision;
  email?: string;
  libelle?: string;
  avant?: () => void;
  className?: string;
}) {
  const [ouvert, setOuvert] = useState(false);

  if (ouvert) {
    return (
      <div className="mt-5 w-full rounded-xl bg-white p-2 sm:p-4">
        <CheckoutIntegre part={part} email={email} />
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={() => {
        avant?.();
        setOuvert(true);
      }}
      className={cn(
        "mt-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-[#C2A679] px-7 py-3.5 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-[#B39566]",
        className,
      )}
    >
      <CreditCard className="h-4 w-4" strokeWidth={1.8} />
      {libelle || `Payer ${PROVISIONS[part].montant}`}
    </button>
  );
}
