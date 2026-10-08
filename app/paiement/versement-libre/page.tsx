"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, CreditCard } from "lucide-react";
import { PagePaiement, boutonCls, champCls, euros, lireMontant } from "@/components/paiement/PagePaiement";
import { RetourEspace } from "@/components/paiement/RetourEspace";
import { memoriserRetour } from "@/lib/paiement";

/* Versement libre par carte, via SumUp : le client saisit le montant convenu,
   le formulaire de carte SumUp s'affiche dans la page.
   Paramètres facultatifs (liens de l'espace client) :
     montant  montant en euros, prérempli
     email    courriel, prérempli
     objet    libellé, prérempli
     retour   « espace » : après paiement, retour dans l'espace client */

declare global {
  interface Window {
    SumUpCard?: { mount: (o: Record<string, unknown>) => { unmount?: () => void } };
  }
}

function chargerSumUp(): Promise<void> {
  if (window.SumUpCard) return Promise.resolve();
  return new Promise((ok, ko) => {
    const s = document.createElement("script");
    s.src = "https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js";
    s.onload = () => ok();
    s.onerror = () => ko(new Error("script"));
    document.head.appendChild(s);
  });
}

function VersementLibreContent() {
  const params = useSearchParams();
  const retour = params.get("retour");
  const [montant, setMontant] = useState(() => {
    const m = lireMontant(params.get("montant") || "");
    return m ? String(m).replace(".", ",") : "";
  });
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState(params.get("email") || "");
  const [objet, setObjet] = useState(params.get("objet") || "");
  useEffect(() => memoriserRetour(retour), [retour]);
  const [etat, setEtat] = useState<"saisie" | "attente" | "carte" | "ok">("saisie");
  const [erreur, setErreur] = useState("");
  const checkout = useRef("");

  const m = lireMontant(montant);

  async function continuer(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    if (!m) return setErreur("Indiquez le montant à régler.");
    setEtat("attente");
    try {
      const r = await fetch("/api/sumup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ montant: m, nom, email, objet, retour }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Paiement indisponible.");
      checkout.current = j.id;
      await chargerSumUp();
      setEtat("carte");
    } catch (x) {
      setEtat("saisie");
      setErreur(x instanceof Error ? x.message : "Paiement indisponible.");
    }
  }

  useEffect(() => {
    if (etat !== "carte" || !window.SumUpCard) return;
    const widget = window.SumUpCard.mount({
      id: "sumup-card",
      checkoutId: checkout.current,
      locale: "fr-FR",
      onResponse: async (type: string) => {
        if (type !== "success") return;
        const r = await fetch(`/api/sumup?id=${encodeURIComponent(checkout.current)}`).then((x) => x.json()).catch(() => ({}));
        if (r.statut === "PAID" || r.statut === "inconnu") setEtat("ok");
      },
    });
    return () => widget?.unmount?.();
  }, [etat]);

  return (
    <PagePaiement
      titre="Versement libre"
      prestataire="SumUp"
      intro={<p>Réglez par carte bancaire le montant convenu avec le cabinet : honoraires, solde, frais de procédure.</p>}
    >
      {etat === "ok" ? (
        <div className="rounded-lg bg-white p-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-[#362A24]" strokeWidth={1.5} />
          <h2 className="mt-4 font-serif text-2xl text-[#1A1A1A]">Merci, votre versement de {m ? euros(m) : ""} est bien reçu</h2>
          <p className="mt-3 text-[15px] text-gray-600">Un reçu vous est adressé par courriel.</p>
          <RetourEspace actif={retour === "espace"} auto />
        </div>
      ) : etat === "carte" ? (
        <div className="rounded-lg bg-white p-6">
          <p className="mb-4 text-[15px] text-gray-700">
            Montant : <strong>{m ? euros(m) : ""}</strong>
          </p>
          <div id="sumup-card" />
        </div>
      ) : (
        <form onSubmit={continuer} className="space-y-5 rounded-lg bg-white p-8">
          <label className="block">
            <span className="mb-2 block text-[15px] text-[#1A1A1A]">Montant (€)</span>
            <input className={champCls} value={montant} onChange={(e) => setMontant(e.target.value)} inputMode="decimal" placeholder="Ex. : 500" />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[15px] text-[#1A1A1A]">Nom et prénom</span>
              <input className={champCls} value={nom} onChange={(e) => setNom(e.target.value)} autoComplete="name" />
            </label>
            <label className="block">
              <span className="mb-2 block text-[15px] text-[#1A1A1A]">Courriel</span>
              <input type="email" className={champCls} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </label>
          </div>
          <label className="block">
            <span className="mb-2 block text-[15px] text-[#1A1A1A]">Objet (facultatif)</span>
            <input className={champCls} value={objet} onChange={(e) => setObjet(e.target.value)} placeholder="Ex. : solde d'honoraires, dossier DUPONT" />
          </label>
          {erreur && <p className="text-sm text-[#B42318]">{erreur}</p>}
          <button type="submit" disabled={etat === "attente"} className={boutonCls}>
            <CreditCard className="h-4 w-4" strokeWidth={1.8} />
            {etat === "attente" ? "Préparation du paiement…" : m ? `Payer ${euros(m)}` : "Continuer"}
          </button>
        </form>
      )}
    </PagePaiement>
  );
}

export default function VersementLibre() {
  return (
    <Suspense>
      <VersementLibreContent />
    </Suspense>
  );
}
