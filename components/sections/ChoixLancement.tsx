"use client";

import { useState } from "react";
import { AlertTriangle, ArrowLeft, Mail, ShieldCheck, Zap } from "lucide-react";
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
  /* Accords selon la civilité du conjoint ; neutre à défaut. */
  const fem = d.conjoint.civilite === "Madame";
  const masc = d.conjoint.civilite === "Monsieur";
  const epoux = fem ? "votre épouse" : masc ? "votre époux" : "votre époux(se)";
  const Epoux = epoux.charAt(0).toUpperCase() + epoux.slice(1);
  const e = fem ? "e" : masc ? "" : "(e)";
  const informe = d.client.civilite === "Madame" ? "informée" : "informé";
  const proc = sdc ? "la séparation de corps" : "le divorce";

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
          Nous vous écrivons dès sa réponse. Sans réponse, nous {fem ? "la" : "le"} relançons, et vous en êtes {informe} à chaque fois.
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
          Nous lui demandons {fem ? "si elle" : "s'il"} accepte {sdc ? "une séparation de corps" : "un divorce"} par consentement mutuel, et
          {fem ? "si elle" : "s'il"} est d&apos;accord sur chacun des points. Ses réponses ne vous sont pas communiquées : en cas de
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

  const Ligne = ({ titre, children }: { titre: string; children: React.ReactNode }) => (
    <li className="flex gap-3">
      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#362A24]" />
      <span>
        <strong className="font-semibold text-[#1A1A1A]">{titre} :</strong> {children}
      </span>
    </li>
  );

  return (
    <div className="mx-auto mt-10 max-w-2xl text-left">
      <h3 className="text-center font-serif text-3xl text-[#1A1A1A]">Comment souhaitez-vous poursuivre ?</h3>

      <div className="mt-8 space-y-6">
        <div className={cn(carte, "p-7 sm:p-8")}>
          <div className="flex items-center gap-3">
            <Zap className="h-6 w-6 text-[#362A24]" strokeWidth={1.5} />
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Option rapide</span>
          </div>
          <h4 className="mt-3 font-serif text-2xl text-[#1A1A1A]">Lancer la procédure maintenant</h4>
          <p className="mt-3 text-[15px] italic leading-relaxed text-gray-600">
            Vous nous confirmez que {epoux} et vous êtes d&apos;ores et déjà d&apos;accord sur toutes les conséquences de {proc}.
          </p>
          <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-gray-700">
            <Ligne titre="Action">Nous préparons votre projet de convention sans attendre.</Ligne>
            <Ligne titre="Frais immédiats">
              Vous réglez une provision de 250 € pour la rédaction. Si les honoraires sont partagés, cette somme est déduite
              de votre part.
            </Ligne>
            <Ligne titre="Étape suivante">
              {Epoux} est invité{e} à vérifier ses informations et à choisir son avocat.
            </Ligne>
          </ul>
          <div className="mt-5 flex gap-3 rounded-lg border border-[#E9D9B8] bg-[#FBF5E8] p-4 text-[14px] leading-relaxed text-gray-700">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#9A6B1F]" strokeWidth={1.75} />
            <p>
              <strong className="font-semibold text-[#1A1A1A]">Important :</strong> si {epoux} exprime un désaccord une fois
              le projet rédigé, la provision de 250 € reste due, le travail de rédaction ayant été accompli.
            </p>
          </div>
          <div className="pt-6">
            <button type="button" className={bouton} onClick={() => setEtape("immediat")}>
              Lancer la procédure
            </button>
          </div>
        </div>

        <div className={cn(carte, "p-7 sm:p-8")}>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-[#362A24]" strokeWidth={1.5} />
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Option prudente</span>
          </div>
          <h4 className="mt-3 font-serif text-2xl text-[#1A1A1A]">Vérifier d&apos;abord l&apos;accord de {epoux}</h4>
          <p className="mt-3 text-[15px] italic leading-relaxed text-gray-600">
            Nous nous assurons que {epoux} accepte {sdc ? "la séparation de corps" : "le divorce"} par consentement mutuel,
            sur tous les points, avant d&apos;engager des frais.
          </p>
          <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-gray-700">
            <Ligne titre="Action">Nous écrivons à {epoux} pour recueillir son accord.</Ligne>
            <Ligne titre="C'est gratuit">Vous ne réglez rien à ce stade.</Ligne>
            <Ligne titre="En cas d'accord sur tout">La procédure peut commencer.</Ligne>
            <Ligne titre="En cas de désaccord">
              Nous vous indiquons les points de divergence, sans vous transmettre le détail de ses réponses, et nous vous
              conseillons sur la marche à suivre.
            </Ligne>
          </ul>
          <div className="pt-6">
            <button type="button" className={bouton} onClick={() => setEtape("verification")}>
              Vérifier d&apos;abord son accord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
