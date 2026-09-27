"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { CalendarClock } from "lucide-react";
import { PagePaiement, boutonCls, euros } from "@/components/paiement/PagePaiement";

/* Règlement des honoraires en mensualités, par un lien créé par le cabinet
   (/paiement/mensualites/creer). Le lien porte les conditions, signées : le
   client les relit, puis souscrit l'abonnement Stripe, qui s'arrête seul après
   la dernière échéance. */

type Plan = { nom: string; mensualite: number; echeances: number; objet: string };

function Contenu() {
  const p = useSearchParams().get("p") || "";
  const [plan, setPlan] = useState<Plan | null>(null);
  const [erreur, setErreur] = useState("");
  const [session, setSession] = useState<{ clientSecret: string; stripe: Promise<Stripe | null> } | null>(null);
  const [attente, setAttente] = useState(false);

  useEffect(() => {
    if (!p) return;
    fetch(`/api/mensualites?p=${encodeURIComponent(p)}`)
      .then((r) => r.json())
      .then((j) => (j.plan ? setPlan(j.plan) : setErreur(j.message || "Lien de paiement invalide.")))
      .catch(() => setErreur("Le lien n'a pas pu être vérifié."));
  }, [p]);

  async function souscrire() {
    setAttente(true);
    setErreur("");
    try {
      const r = await fetch("/api/mensualites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "session", p }),
      });
      const j = await r.json();
      if (!r.ok || !j.clientSecret) throw new Error(j.message || "Paiement indisponible.");
      setSession({ clientSecret: j.clientSecret, stripe: loadStripe(j.publishableKey) });
    } catch (x) {
      setErreur(x instanceof Error ? x.message : "Paiement indisponible.");
    } finally {
      setAttente(false);
    }
  }

  return (
    <PagePaiement
      titre="Règlement en mensualités"
      prestataire="Stripe"
      intro={<p>Vos honoraires sont réglés par prélèvement mensuel sur votre carte, pour la durée convenue avec le cabinet.</p>}
    >
      {!p && (
        <p className="rounded-lg bg-white p-8 text-[15px] leading-relaxed text-gray-700">
          Le règlement en mensualités se met en place sur un lien personnel que le cabinet vous adresse, après
          accord sur le montant et la durée. Pour en bénéficier, parlez-en à votre avocat ou appelez-nous au 01 40 68
          02 37.
        </p>
      )}
      {erreur && <p className="rounded-lg bg-white p-6 text-[15px] text-[#B42318]">{erreur}</p>}
      {plan && !session && (
        <div className="rounded-lg bg-white p-8">
          <div className="flex items-start gap-4">
            <CalendarClock className="mt-1 h-6 w-6 shrink-0 text-[#362A24]" strokeWidth={1.5} />
            <div>
              <p className="text-sm uppercase tracking-wider text-gray-500">{plan.objet}</p>
              <p className="mt-1 font-serif text-3xl text-[#1A1A1A]">
                {plan.echeances} × {euros(plan.mensualite)}
              </p>
              <p className="mt-1 text-[15px] text-gray-600">
                soit {euros(plan.mensualite * plan.echeances)} au total, pour {plan.nom}
              </p>
            </div>
          </div>
          <p className="mt-6 text-[15px] leading-relaxed text-gray-600">
            La première mensualité est prélevée aujourd&apos;hui, les suivantes le même jour de chaque mois. Le
            prélèvement s&apos;arrête automatiquement après la {plan.echeances}
            <sup>e</sup> échéance.
          </p>
          <button type="button" onClick={souscrire} disabled={attente} className={`${boutonCls} mt-6`}>
            {attente ? "Ouverture du paiement…" : "Mettre en place les mensualités"}
          </button>
        </div>
      )}
      {session && (
        <div className="rounded-lg bg-white p-2 sm:p-6">
          <EmbeddedCheckoutProvider stripe={session.stripe} options={{ clientSecret: session.clientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      )}
    </PagePaiement>
  );
}

export default function Mensualites() {
  return (
    <Suspense>
      <Contenu />
    </Suspense>
  );
}
