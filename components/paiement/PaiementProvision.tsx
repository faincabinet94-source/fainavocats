"use client";

import { useState } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROVISIONS, lienProvision, type Provision } from "@/lib/paiement";

/* Bouton de paiement de la provision. Au clic, le formulaire de paiement Stripe
   s'ouvre dans la page (Checkout intégré). Si le paiement intégré n'est pas
   configuré ou échoue, on bascule sur le lien de paiement Stripe habituel. */
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
  const [session, setSession] = useState<{ clientSecret: string; stripe: Promise<Stripe | null> } | null>(null);
  const [attente, setAttente] = useState(false);

  async function ouvrir() {
    avant?.();
    setAttente(true);
    try {
      const r = await fetch("/api/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ part, email }),
      });
      const j = await r.json();
      if (!r.ok || !j.clientSecret) throw new Error();
      setSession({ clientSecret: j.clientSecret, stripe: loadStripe(j.publishableKey) });
    } catch {
      window.location.href = lienProvision(part, email);
    } finally {
      setAttente(false);
    }
  }

  if (session) {
    return (
      <div className="mt-5 w-full overflow-hidden rounded-xl bg-white">
        <EmbeddedCheckoutProvider stripe={session.stripe} options={{ clientSecret: session.clientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={ouvrir}
      disabled={attente}
      className={cn(
        "mt-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-[#C2A679] px-7 py-3.5 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-[#B39566] disabled:opacity-60",
        className,
      )}
    >
      <CreditCard className="h-4 w-4" strokeWidth={1.8} />
      {attente ? "Ouverture du paiement…" : libelle || `Payer ${PROVISIONS[part].montant}`}
    </button>
  );
}
