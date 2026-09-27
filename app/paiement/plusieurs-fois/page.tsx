"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { PagePaiement, boutonCls, champCls, euros, lireMontant } from "@/components/paiement/PagePaiement";

/* Paiement en 3 ou 4 fois par carte, via Alma : le client est dirigé vers la
   page de paiement Alma, qui vérifie son éligibilité. */
export default function PlusieursFois() {
  const [montant, setMontant] = useState("");
  const [fois, setFois] = useState<3 | 4>(3);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [objet, setObjet] = useState("");
  const [attente, setAttente] = useState(false);
  const [erreur, setErreur] = useState("");
  const m = lireMontant(montant);

  async function continuer(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    if (!m) return setErreur("Indiquez le montant à régler.");
    setAttente(true);
    try {
      const r = await fetch("/api/alma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ montant: m, fois, prenom, nom, email, telephone, objet }),
      });
      const j = await r.json();
      if (!r.ok || !j.url) throw new Error(j.message || "Paiement indisponible.");
      window.location.href = j.url;
    } catch (x) {
      setAttente(false);
      setErreur(x instanceof Error ? x.message : "Paiement indisponible.");
    }
  }

  return (
    <PagePaiement
      titre="Paiement en 3 ou 4 fois"
      prestataire="Alma"
      intro={
        <p>
          Réglez vos honoraires en 3 ou 4 mensualités par carte bancaire. La première est prélevée aujourd&apos;hui,
          les suivantes chaque mois. Alma vérifie votre éligibilité avant de valider le paiement.
        </p>
      }
    >
      <form onSubmit={continuer} className="space-y-5 rounded-lg bg-white p-8">
        <label className="block">
          <span className="mb-2 block text-[15px] text-[#1A1A1A]">Montant total (€)</span>
          <input className={champCls} value={montant} onChange={(e) => setMontant(e.target.value)} inputMode="decimal" placeholder="Ex. : 1 200" />
        </label>
        <div>
          <span className="mb-2 block text-[15px] text-[#1A1A1A]">En combien de fois ?</span>
          <div className="flex flex-wrap gap-2">
            {([3, 4] as const).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setFois(n)}
                className={cn(
                  "rounded-full border px-5 py-2.5 text-sm transition-colors",
                  fois === n ? "border-[#362A24] bg-[#362A24] text-white" : "border-[#D6D3CB] bg-white text-gray-600 hover:border-gray-400",
                )}
              >
                {n} fois{m ? `, soit ${euros(m / n)} par mois environ` : ""}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-[15px] text-[#1A1A1A]">Prénom</span>
            <input className={champCls} value={prenom} onChange={(e) => setPrenom(e.target.value)} autoComplete="given-name" />
          </label>
          <label className="block">
            <span className="mb-2 block text-[15px] text-[#1A1A1A]">Nom</span>
            <input className={champCls} value={nom} onChange={(e) => setNom(e.target.value.toLocaleUpperCase("fr-FR"))} autoComplete="family-name" />
          </label>
          <label className="block">
            <span className="mb-2 block text-[15px] text-[#1A1A1A]">Courriel</span>
            <input type="email" className={champCls} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </label>
          <label className="block">
            <span className="mb-2 block text-[15px] text-[#1A1A1A]">Téléphone portable</span>
            <input type="tel" className={champCls} value={telephone} onChange={(e) => setTelephone(e.target.value)} autoComplete="tel" />
          </label>
        </div>
        <label className="block">
          <span className="mb-2 block text-[15px] text-[#1A1A1A]">Objet (facultatif)</span>
          <input className={champCls} value={objet} onChange={(e) => setObjet(e.target.value)} placeholder="Ex. : honoraires de divorce" />
        </label>
        {erreur && <p className="text-sm text-[#B42318]">{erreur}</p>}
        <button type="submit" disabled={attente} className={boutonCls}>
          <CreditCard className="h-4 w-4" strokeWidth={1.8} />
          {attente ? "Ouverture d'Alma…" : `Payer en ${fois} fois avec Alma`}
        </button>
      </form>
    </PagePaiement>
  );
}
