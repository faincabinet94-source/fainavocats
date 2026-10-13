"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROVISIONS } from "@/lib/paiement";
import { CASES_USAGE, casesUsage } from "@/lib/renseignements/lancement";
import { avocatChoisi, avocatRetenu, texteAvocat, type Avocat, type Donnees } from "@/lib/renseignements/modele";
import { PaiementProvision } from "@/components/paiement/PaiementProvision";

/* Fin du formulaire extérieur en 2A : le conjoint a ou aura son propre avocat.
   Le cabinet n'écrit pas au conjoint pour recueillir son avis (il est ou sera
   assisté) : le client confie au cabinet un courrier d'usage, sur provision de
   250 €. Décision de Me FAIN du 2026-10-12. */

const carte = "rounded-xl border border-[#E5E2DA] bg-[#F9F8F6] p-6 text-left";
const bouton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#362A24] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-40";

export function ChoixUsage({ id, d, destinataire }: { id: string; d: Donnees; destinataire: "confrere" | "conjoint" }) {
  const [cases, setCases] = useState<Record<keyof typeof CASES_USAGE, boolean>>({ convention: false, execution: false });
  const [paiement, setPaiement] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const dejaChoisi = avocatChoisi(d) === "Oui";
  const textes = casesUsage(d.procedure, destinataire, dejaChoisi);
  const sdc = d.procedure === "Séparation de corps";
  const fem = d.conjoint.civilite === "Madame";
  const masc = d.conjoint.civilite === "Monsieur";
  const epoux = fem ? "votre épouse" : masc ? "votre époux" : "votre conjoint";
  const proc = sdc ? "une séparation de corps" : "un divorce";
  const avocat = avocatRetenu(d);

  async function transmettre() {
    setEnvoi(true);
    setErreur("");
    try {
      const r = await fetch("/api/renseignements/lancement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, choix: "usage", cases }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.message || "Votre choix n'a pas pu être transmis.");
      setPaiement(true);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Votre choix n'a pas pu être transmis.");
    } finally {
      setEnvoi(false);
    }
  }

  if (paiement)
    return (
      <div className={cn("mx-auto mt-8 max-w-xl", carte)}>
        <h3 className="font-serif text-xl text-[#1A1A1A]">Provision de {PROVISIONS.totale.montant}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
          Dès réception, nous préparons le courrier. Me FAIN le relit et le signe avant son envoi.
        </p>
        <div className="flex flex-col items-start">
          <PaiementProvision part="totale" email={d.client.email} libelle={`Régler la provision de ${PROVISIONS.totale.montant}`} />
        </div>
        <p className="mt-4 text-xs text-gray-500">Paiement sécurisé par Stripe.</p>
      </div>
    );

  return (
    <div className={cn("mx-auto mt-10 max-w-2xl", carte, "p-7 sm:p-8")}>
      <div className="flex items-center gap-3">
        <Mail className="h-6 w-6 text-[#362A24]" strokeWidth={1.5} />
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Étape suivante</span>
      </div>
      <h3 className="mt-3 font-serif text-2xl text-[#1A1A1A]">Le courrier d&apos;usage</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-gray-700">
        {destinataire === "confrere" ? (
          <>
            {avocat ? texteAvocat(avocat as Avocat) : "L'avocat de " + epoux} assistera {epoux}. Nous lui écrivons pour
            ouvrir les échanges et vérifier qu&apos;un accord est possible sur {proc} par consentement mutuel.
          </>
        ) : (
          <>
            Chaque époux doit avoir son propre avocat. Nous écrivons à {epoux}, par courrier et par courriel,
            {dejaChoisi
              ? ` en lui demandant de remettre notre courrier à son avocat, en vue d'${proc} par consentement mutuel.`
              : ` pour l'inviter à choisir son avocat dans un délai de quinze jours, en vue d'${proc} par consentement mutuel.`}{" "}
            Nous échangeons ensuite avec cet avocat pour vérifier qu&apos;un accord est possible.
          </>
        )}
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-gray-700">
        Cette première étape fait l&apos;objet d&apos;une provision de 250 €. Si la procédure amiable peut être engagée,
        une seconde convention d&apos;honoraires vous sera adressée, et ces 250 € s&apos;imputeront sur son forfait.
      </p>
      <div className="mt-6 space-y-4">
        {(Object.keys(CASES_USAGE) as (keyof typeof CASES_USAGE)[]).map((k) => (
          <label key={k} className="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-gray-700">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 shrink-0 accent-[#362A24]"
              checked={cases[k]}
              onChange={(e) => setCases((c) => ({ ...c, [k]: e.target.checked }))}
            />
            <span>{textes[k]}</span>
          </label>
        ))}
      </div>
      {erreur && <p className="mt-4 text-sm text-red-700">{erreur}</p>}
      <div className="mt-6">
        <button type="button" className={bouton} disabled={envoi || !Object.values(cases).every(Boolean)} onClick={transmettre}>
          Continuer vers le paiement
        </button>
      </div>
    </div>
  );
}
