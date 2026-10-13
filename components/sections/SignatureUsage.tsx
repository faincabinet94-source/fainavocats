"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { PROVISIONS } from "@/lib/paiement";
import { PaiementProvision } from "@/components/paiement/PaiementProvision";
import { enHtml } from "@/components/sections/ConventionASigner";

/* Signature de la convention CH CU depuis le lien du courriel (après la réponse
   du conjoint dans l'espace client), puis règlement de la provision de 250 €.
   Route : /api/renseignements/usage. */

const carte = "rounded-xl border border-[#E5E2DA] bg-[#F9F8F6] p-6 text-left sm:p-8";
const bouton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#362A24] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-40";

type Convention = {
  intitule: string;
  texte: string;
  empreinte: string;
  cases: { convention: string; execution: string };
  email: string;
  nomAttendu: string;
};

export function SignatureUsage({ c }: { c: string }) {
  const [conv, setConv] = useState<Convention | null>(null);
  const [erreur, setErreur] = useState("");
  const [cases, setCases] = useState({ convention: false, execution: false });
  const [nom, setNom] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [signee, setSignee] = useState(false);

  useEffect(() => {
    let fini = false;
    (async () => {
      try {
        const r = await fetch(`/api/renseignements/usage?c=${encodeURIComponent(c)}`, { cache: "no-store" });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.message || "Ce lien n'est plus valable.");
        if (!fini) setConv(j);
      } catch (e) {
        if (!fini) setErreur(e instanceof Error ? e.message : "Ce lien n'est plus valable.");
      }
    })();
    return () => {
      fini = true;
    };
  }, [c]);

  async function signer() {
    if (!conv) return;
    setEnvoi(true);
    setErreur("");
    try {
      const r = await fetch("/api/renseignements/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ c, empreinte: conv.empreinte, nom, cases }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.message || "Votre signature n'a pas pu être enregistrée.");
      setSignee(true);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Votre signature n'a pas pu être enregistrée.");
    } finally {
      setEnvoi(false);
    }
  }

  if (!conv)
    return erreur ? (
      <p className="mt-8 text-[15px] text-red-700">
        {erreur} Pour toute question, écrivez à contact@fain-avocats.fr.
      </p>
    ) : (
      <p className="mt-8 inline-flex items-center gap-2 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Préparation de votre convention d&apos;honoraires…
      </p>
    );

  if (signee)
    return (
      <div className={`mt-8 ${carte}`}>
        <h2 className="font-serif text-xl text-[#1A1A1A]">Provision de {PROVISIONS.totale.montant}</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
          Votre convention est signée ; l&apos;exemplaire signé vous est adressé par courriel. Dès réception de la provision,
          nous préparons le courrier. Me FAIN le relit et le signe avant son envoi.
        </p>
        <div className="flex flex-col items-start">
          <PaiementProvision part="totale" email={conv.email} libelle={`Régler la provision de ${PROVISIONS.totale.montant}`} />
        </div>
        <p className="mt-4 text-xs text-gray-500">Paiement sécurisé par Stripe.</p>
      </div>
    );

  return (
    <div className={`mt-8 ${carte}`}>
      <p className="text-[15px] leading-relaxed text-gray-700">
        Chaque époux doit avoir son propre avocat. Nous écrivons à l&apos;avocat de votre conjoint ou, s&apos;il n&apos;en a pas
        encore, à votre conjoint lui-même pour l&apos;inviter à en choisir un, en vue d&apos;une procédure par consentement mutuel.
        Cette première étape fait l&apos;objet de la convention d&apos;honoraires ci-dessous et d&apos;une provision de 250 €.
      </p>
      <h2 className="mt-6 font-serif text-lg text-[#1A1A1A]">{conv.intitule}</h2>
      <p className="mt-1 text-sm text-gray-500">Lisez la convention en entier avant de la signer.</p>
      <div
        className="mt-3 max-h-[60vh] space-y-3 overflow-y-auto rounded-lg border border-[#E5E2DA] bg-white p-5 text-[13px] leading-relaxed text-gray-800 [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-[#1A1A1A] [&_ul]:space-y-1"
        dangerouslySetInnerHTML={{ __html: enHtml(conv.texte) }}
      />
      <div className="mt-6 space-y-4">
        {(["convention", "execution"] as const).map((k) => (
          <label key={k} className="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-gray-700">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 shrink-0 accent-[#362A24]"
              checked={cases[k]}
              onChange={(e) => setCases((x) => ({ ...x, [k]: e.target.checked }))}
            />
            <span>{conv.cases[k]}</span>
          </label>
        ))}
      </div>
      <label className="mt-5 block text-sm font-medium text-[#1A1A1A]">
        Vos prénom et nom
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          maxLength={200}
          autoComplete="name"
          placeholder={conv.nomAttendu}
          className="mt-2 w-full rounded-lg border border-[#E5E2DA] bg-white px-4 py-3 text-[15px] font-normal"
        />
        <span className="mt-1 block text-xs font-normal text-gray-500">La saisie de votre nom vaut signature électronique de la convention.</span>
      </label>
      {erreur && <p className="mt-4 text-sm text-red-700">{erreur}</p>}
      <div className="mt-6">
        <button
          type="button"
          className={bouton}
          disabled={envoi || !cases.convention || !cases.execution || nom.trim().length < 3}
          onClick={signer}
        >
          {envoi && <Loader2 className="h-4 w-4 animate-spin" />}
          Signer et continuer vers le paiement
        </button>
      </div>
    </div>
  );
}
