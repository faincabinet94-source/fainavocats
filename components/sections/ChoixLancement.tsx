"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, Mail, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROVISIONS } from "@/lib/paiement";
import { casesImmediat } from "@/lib/renseignements/lancement";
import type { Donnees } from "@/lib/renseignements/modele";
import { PaiementProvision } from "@/components/paiement/PaiementProvision";

/* Fin du formulaire extérieur : l'époux qui a rempli le formulaire choisit
   entre lancer la procédure tout de suite (certification, provision de
   250 € non remboursable une fois le projet établi) ou faire vérifier
   d'abord l'accord de son époux (rien à régler à ce stade).
   Textes validés : coffre, textes-parcours-conjoint.md, sections 1 et 2. */

type Etape = "choix" | "immediat" | "paiement" | "verification" | "invite";

const carte = "rounded-xl border border-[#E5E2DA] bg-[#F9F8F6] p-6 text-left";
const bouton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#362A24] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-40";
const retour = "mt-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#362A24]";

export function ChoixLancement({ id, d }: { id: string; d: Donnees }) {
  const [etape, setEtape] = useState<Etape>("choix");
  const [cases, setCases] = useState({ certification: false, provision: false });
  const [email, setEmail] = useState(d.conjoint.email || "");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const textes = casesImmediat(d.procedure);
  const sdc = d.procedure === "Séparation de corps";
  const epoux = "votre époux(se)";

  async function transmettre(choix: "immediat" | "verification") {
    setEnvoi(true);
    setErreur("");
    try {
      const r = await fetch("/api/renseignements/lancement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(choix === "immediat" ? { id, choix, cases } : { id, choix, emailConjoint: email }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.message || "Votre choix n'a pas pu être transmis.");
      setEtape(choix === "immediat" ? "paiement" : "invite");
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Votre choix n'a pas pu être transmis.");
    } finally {
      setEnvoi(false);
    }
  }

  if (etape === "paiement")
    return (
      <div className={cn("mx-auto mt-8 max-w-xl", carte)}>
        <h3 className="font-serif text-xl text-[#1A1A1A]">Provision de {PROVISIONS.totale.montant}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
          Elle couvre l&apos;établissement du projet de convention et vient en déduction de votre part si les honoraires sont
          partagés. Le cabinet commence dès réception.
        </p>
        <div className="flex flex-col items-start">
          <PaiementProvision part="totale" email={d.client.email} libelle={`Régler la provision de ${PROVISIONS.totale.montant}`} />
        </div>
        <p className="mt-4 text-xs text-gray-500">Paiement sécurisé par Stripe.</p>
      </div>
    );

  if (etape === "invite")
    return (
      <div className={cn("mx-auto mt-8 max-w-xl", carte)}>
        <Mail className="h-8 w-8 text-[#362A24]" strokeWidth={1.5} />
        <h3 className="mt-3 font-serif text-xl text-[#1A1A1A]">Nous écrivons à {epoux}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
          Un message part à l&apos;adresse {email.trim()}, pour recueillir son avis. Vous n&apos;avez rien à régler à ce stade.
          Nous vous écrivons dès sa réponse. Sans réponse, nous le relançons, et vous en êtes informé à chaque fois.
        </p>
      </div>
    );

  if (etape === "immediat")
    return (
      <div className={cn("mx-auto mt-8 max-w-xl", carte)}>
        <h3 className="font-serif text-xl text-[#1A1A1A]">Lancer la procédure maintenant</h3>
        <p className="mt-2 text-sm text-gray-500">Les deux cases sont nécessaires.</p>
        <div className="mt-4 space-y-4">
          {(["certification", "provision"] as const).map((k) => (
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
          <button
            type="button"
            className={bouton}
            disabled={envoi || !Object.values(cases).every(Boolean)}
            onClick={() => transmettre("immediat")}
          >
            Continuer vers le paiement
          </button>
        </div>
        <button type="button" className={retour} onClick={() => setEtape("choix")}>
          <ArrowLeft className="h-4 w-4" /> Revenir au choix
        </button>
      </div>
    );

  if (etape === "verification")
    return (
      <div className={cn("mx-auto mt-8 max-w-xl", carte)}>
        <h3 className="font-serif text-xl text-[#1A1A1A]">Vérifier d&apos;abord l&apos;accord de {epoux}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
          Nous lui demandons s&apos;il accepte {sdc ? "une séparation de corps" : "un divorce"} par consentement mutuel, et
          s&apos;il est d&apos;accord sur chacun des points. Ses réponses ne vous sont pas communiquées : en cas de
          désaccord, vous saurez seulement sur quels points.
        </p>
        <label className="mt-5 block text-sm font-medium text-[#1A1A1A]">
          Adresse électronique de {epoux}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-lg border border-[#E5E2DA] bg-white px-4 py-3 text-[15px] font-normal"
            autoComplete="off"
          />
        </label>
        {erreur && <p className="mt-4 text-sm text-red-700">{erreur}</p>}
        <div className="mt-6">
          <button type="button" className={bouton} disabled={envoi || !email.trim()} onClick={() => transmettre("verification")}>
            Écrire à {epoux}
          </button>
        </div>
        <button type="button" className={retour} onClick={() => setEtape("choix")}>
          <ArrowLeft className="h-4 w-4" /> Revenir au choix
        </button>
      </div>
    );

  return (
    <div className="mx-auto mt-8 max-w-2xl text-left">
      <h3 className="text-center font-serif text-2xl text-[#1A1A1A]">Comment souhaitez-vous poursuivre ?</h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className={cn(carte, "flex flex-col")}>
          <Zap className="h-6 w-6 text-[#362A24]" strokeWidth={1.5} />
          <h4 className="mt-3 font-serif text-lg text-[#1A1A1A]">Lancer la procédure maintenant</h4>
          <p className="mt-2 text-[14px] leading-relaxed text-gray-600">
            Vous nous confirmez que {epoux} et vous êtes d&apos;accord sur l&apos;ensemble des conséquences de votre{" "}
            {sdc ? "séparation de corps" : "divorce"}. Nous préparons sans attendre le projet de convention à partir des
            informations que vous avez fournies.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14px] leading-relaxed text-gray-600">
            <li>
              Vous réglez une provision de 250 €, qui couvre l&apos;établissement du projet de convention. Si les honoraires
              sont partagés, elle vient en déduction de votre part.
            </li>
            <li>Votre époux(se) est ensuite invité(e) à vérifier les informations qui le concernent et à choisir son avocat.</li>
            <li>Si {epoux} se révèle en désaccord une fois le projet établi, la provision reste due : le travail aura été accompli.</li>
          </ul>
          <div className="mt-auto pt-5">
            <button type="button" className={bouton} onClick={() => setEtape("immediat")}>
              Lancer la procédure
            </button>
          </div>
        </div>
        <div className={cn(carte, "flex flex-col")}>
          <CheckCircle2 className="h-6 w-6 text-[#362A24]" strokeWidth={1.5} />
          <h4 className="mt-3 font-serif text-lg text-[#1A1A1A]">Vérifier d&apos;abord l&apos;accord de {epoux}</h4>
          <p className="mt-2 text-[14px] leading-relaxed text-gray-600">
            Nous écrivons à {epoux} pour lui demander s&apos;il accepte {sdc ? "une séparation de corps" : "un divorce"} par
            consentement mutuel, et s&apos;il est d&apos;accord sur chacun des points. Vous ne réglez rien à ce stade.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14px] leading-relaxed text-gray-600">
            <li>Si vous êtes d&apos;accord sur tout, la procédure peut commencer.</li>
            <li>
              Sinon, nous vous indiquons sur quels points vous divergez, sans le détail de ses réponses, et nous vous
              proposons la suite.
            </li>
          </ul>
          <div className="mt-auto pt-5">
            <button type="button" className={bouton} onClick={() => setEtape("verification")}>
              Vérifier d&apos;abord son accord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
