"use client";

import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { liensMessagerie, type DemandeConjoint } from "@/lib/paiement";

/* « Écrire à mon conjoint » : le client envoie lui-même, depuis sa messagerie,
   le courriel prêt avec le lien de paiement. Choix de la messagerie, parce que
   le simple lien mailto: n'ouvre rien sans application de messagerie. */
export function EcrireConjoint({ demande, className }: { demande: DemandeConjoint; className?: string }) {
  const [ouvert, setOuvert] = useState(false);
  const [copie, setCopie] = useState(false);
  const l = liensMessagerie(demande);

  async function copier() {
    try {
      await navigator.clipboard.writeText(l.texte);
      setCopie(true);
      setTimeout(() => setCopie(false), 3000);
    } catch {
      /* presse-papiers refusé : les autres choix restent disponibles */
    }
  }

  const choix = "inline-flex items-center justify-center gap-2 rounded-full border border-[#D6D3CB] bg-white px-5 py-2.5 text-sm text-[#1A1A1A] transition-colors hover:border-gray-400";

  return (
    <div className={cn("mt-5", className)}>
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-expanded={ouvert}
        className="inline-flex items-center gap-2.5 rounded-full bg-[#C2A679] px-7 py-3.5 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-[#B39566]"
      >
        <Mail className="h-4 w-4" strokeWidth={1.8} />
        Écrire à mon conjoint
      </button>
      {ouvert && (
        <div className="mt-4">
          <p className="mb-3 text-sm text-gray-600">
            Avec quelle messagerie ? Le courriel est prêt, vous le relisez avant l&apos;envoi.
            {!demande.email.trim() && " Il vous restera à indiquer l'adresse de votre conjoint."}
          </p>
          <div className="flex flex-wrap gap-2">
            <a href={l.gmail} target="_blank" rel="noopener noreferrer" className={choix}>Gmail</a>
            <a href={l.outlook} target="_blank" rel="noopener noreferrer" className={choix}>Outlook</a>
            <a href={l.application} className={choix}>Application de messagerie</a>
            <button type="button" onClick={copier} className={choix}>
              {copie ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copie ? "Message copié" : "Copier le message"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
