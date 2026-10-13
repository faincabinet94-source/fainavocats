"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

/* Convention d'honoraires à lire et signer avant le paiement (route
   /api/renseignements/convention ; lib/renseignements/convention.ts). Le
   parent reçoit l'état de la signature : null tant que la convention n'est pas
   chargée ou le nom pas saisi ; { cle: null } quand aucune convention en ligne
   ne s'applique (séparation de corps, assurance…) : les cases suffisent. */

export type EtatSignature =
  | null
  | { cle: null }
  | { cle: string; empreinte: string; nom: string; provision: boolean };

const echapper = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const enLigne = (s: string) =>
  echapper(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])_([^_\n]+?)_(?=[\s.,;:)]|$)/g, "$1<em>$2</em>");

/** Markdown restreint des modèles Airtable : paragraphes, listes « - », gras, italique. */
function enHtml(texte: string): string {
  const puce = /^\s*\\?-\s+/;
  return texte
    .split(/\n{2,}/)
    .map((bloc) => {
      const lignes = bloc.split("\n").filter((l) => l.trim());
      let html = "";
      let p: string[] = [];
      let ul: string[] = [];
      const vider = () => {
        if (p.length) html += `<p>${p.join("<br>")}</p>`;
        if (ul.length) html += `<ul>${ul.join("")}</ul>`;
        p = [];
        ul = [];
      };
      for (const l of lignes) {
        if (puce.test(l)) {
          if (p.length) {
            html += `<p>${p.join("<br>")}</p>`;
            p = [];
          }
          ul.push(`<li>${enLigne(l.replace(puce, ""))}</li>`);
        } else {
          if (ul.length) vider();
          p.push(enLigne(l));
        }
      }
      vider();
      return html;
    })
    .join("");
}

export function ConventionASigner({
  id,
  nomAttendu,
  onChange,
}: {
  id: string;
  nomAttendu: string;
  onChange: (e: EtatSignature) => void;
}) {
  const [conv, setConv] = useState<{ cle: string | null; intitule?: string; texte?: string; empreinte?: string; provision?: boolean } | null>(null);
  const [erreur, setErreur] = useState("");
  const [nom, setNom] = useState("");

  useEffect(() => {
    let fini = false;
    (async () => {
      try {
        const r = await fetch("/api/renseignements/convention", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.message || "La convention ne peut pas être affichée pour le moment.");
        if (!fini) setConv(j);
      } catch (e) {
        if (!fini) setErreur(e instanceof Error ? e.message : "La convention ne peut pas être affichée pour le moment.");
      }
    })();
    return () => {
      fini = true;
    };
  }, [id]);

  useEffect(() => {
    if (!conv) return onChange(null);
    if (!conv.cle) return onChange({ cle: null });
    onChange(
      nom.trim().length >= 3 && conv.empreinte
        ? { cle: conv.cle, empreinte: conv.empreinte, nom: nom.trim(), provision: conv.provision !== false }
        : null,
    );
    // onChange est stable chez le parent (setState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conv, nom]);

  if (erreur) return <p className="mt-4 text-sm text-red-700">{erreur}</p>;
  if (!conv)
    return (
      <p className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Préparation de votre convention d&apos;honoraires…
      </p>
    );
  if (!conv.cle) return null;

  return (
    <div className="mt-6">
      <h4 className="font-serif text-lg text-[#1A1A1A]">{conv.intitule}</h4>
      <p className="mt-1 text-sm text-gray-500">Lisez la convention en entier avant de la signer.</p>
      <div
        className="mt-3 max-h-[60vh] space-y-3 overflow-y-auto rounded-lg border border-[#E5E2DA] bg-white p-5 text-[13px] leading-relaxed text-gray-800 [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-[#1A1A1A] [&_ul]:space-y-1"
        dangerouslySetInnerHTML={{ __html: enHtml(conv.texte || "") }}
      />
      <label className="mt-5 block text-sm font-medium text-[#1A1A1A]">
        Vos prénom et nom
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          maxLength={200}
          autoComplete="name"
          placeholder={nomAttendu}
          className="mt-2 w-full rounded-lg border border-[#E5E2DA] bg-white px-4 py-3 text-[15px] font-normal"
        />
        <span className="mt-1 block text-xs font-normal text-gray-500">
          La saisie de votre nom vaut signature électronique de la convention. L&apos;exemplaire signé vous sera adressé par courriel.
        </span>
      </label>
    </div>
  );
}
