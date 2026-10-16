"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Donnees } from "@/lib/renseignements/modele";

/*
 * Simulateur prérempli sous une rubrique du récapitulatif, version cabinet
 * seulement : prestation compensatoire sous « Prestation compensatoire »,
 * pension alimentaire sous « Les enfants ».
 *
 * Les chiffres du formulaire partent vers le simulateur (iframe de même
 * origine) par postMessage, jamais par l'adresse ; ils suivent les
 * corrections faites dans le formulaire. Les simulations s'enregistrent et se
 * relisent auprès du portail (/api/simulations), avec le jeton « cab » joint
 * au lien par /cabinet/formulaire. Sans jeton, ce composant n'est pas rendu.
 */

type Type = "pc" | "cee";
type Etat = { valeurs: unknown; resultat: Record<string, unknown>; resume: string };
type Simulation = {
  id: string;
  type: Type;
  date: string;
  auteur: string;
  montant: number | null;
  resultat: string;
  commentaire: string;
  valeurs: unknown;
};

const PORTAIL = process.env.NEXT_PUBLIC_PORTAIL_URL || "https://espace.fain-avocats.fr";
const SOURCES: Record<Type, string> = {
  pc: "/simulateur/index.html?embed=1&prerempli=1",
  cee: "/simulateur-pension/index.html?embed=1&prerempli=1",
};
const TITRES: Record<Type, string> = {
  pc: "Simulation de prestation compensatoire",
  cee: "Simulation de pension alimentaire",
};

/* Seuls les champs utiles aux simulateurs quittent le formulaire. */
function extrait(d: Donnees) {
  const p = (x: Donnees["client"]) => ({
    civilite: x.civilite,
    prenoms: x.prenoms,
    dateNaissance: x.dateNaissance,
    revenus: x.revenus,
    revenusAnnuels: x.revenusAnnuels,
  });
  return {
    procedure: d.procedure,
    client: p(d.client),
    conjoint: p(d.conjoint),
    mariage: { date: d.mariage.date },
    enfants: d.enfants.map((e) => ({ dateNaissance: e.dateNaissance, garde: e.garde, pension: e.pension })),
  };
}

const quand = (iso: string) =>
  iso ? new Date(iso).toLocaleString("fr-FR", { timeZone: "Europe/Paris", dateStyle: "short", timeStyle: "short" }) : "";
const euros = (n: number) => `${Math.round(n).toLocaleString("fr-FR")} €`;

function montantPrincipal(type: Type, r: Record<string, unknown>): number | null {
  const v = type === "pc" ? r.moyenne : r.differentielle ?? r.table;
  return typeof v === "number" && isFinite(v) ? v : null;
}

export function SimulateurCabinet({ type, d, jeton }: { type: Type; d: Donnees; jeton: string }) {
  const cadre = useRef<HTMLIFrameElement>(null);
  const [hauteur, setHauteur] = useState(type === "pc" ? 1300 : 2400);
  const [pret, setPret] = useState(false);
  const [etat, setEtat] = useState<Etat | null>(null);
  const [liste, setListe] = useState<Simulation[] | null>(null);
  const [erreur, setErreur] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [envoi, setEnvoi] = useState<"idle" | "envoi" | "ok">("idle");
  const donnees = useMemo(() => JSON.stringify(extrait(d)), [d]);

  const poster = useCallback((message: unknown) => {
    cadre.current?.contentWindow?.postMessage(message, window.location.origin);
  }, []);

  useEffect(() => {
    function recevoir(e: MessageEvent) {
      if (e.origin !== window.location.origin || e.source !== cadre.current?.contentWindow) return;
      const m = e.data as { fainSimHeight?: number; fainSim?: string; type?: string } & Partial<Etat>;
      if (typeof m.fainSimHeight === "number" && m.fainSimHeight > 100) setHauteur(m.fainSimHeight);
      if (m.type !== type) return;
      if (m.fainSim === "pret") setPret(true);
      if (m.fainSim === "etat" && m.resultat) setEtat({ valeurs: m.valeurs, resultat: m.resultat, resume: m.resume || "" });
    }
    window.addEventListener("message", recevoir);
    return () => window.removeEventListener("message", recevoir);
  }, [type]);

  /* Chiffres du formulaire, renvoyés à chaque correction (après une pause). */
  useEffect(() => {
    if (!pret) return;
    const t = setTimeout(() => poster({ fainSim: "remplir", formulaire: JSON.parse(donnees) }), 400);
    return () => clearTimeout(t);
  }, [pret, donnees, poster]);

  const charger = useCallback(async () => {
    try {
      const r = await fetch(`${PORTAIL}/api/simulations`, { headers: { Authorization: `Bearer ${jeton}` }, cache: "no-store" });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.message || "Les simulations n'ont pas pu être lues.");
      setListe((j.simulations as Simulation[]).filter((s) => s.type === type));
      setErreur("");
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Les simulations n'ont pas pu être lues.");
    }
  }, [jeton, type]);

  useEffect(() => {
    charger();
  }, [charger]);

  async function enregistrer() {
    if (!etat) return;
    setEnvoi("envoi");
    try {
      const r = await fetch(`${PORTAIL}/api/simulations`, {
        method: "POST",
        headers: { Authorization: `Bearer ${jeton}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          valeurs: etat.valeurs,
          resume: etat.resume,
          montant: montantPrincipal(type, etat.resultat),
          commentaire,
        }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.message || "La simulation n'a pas pu être enregistrée.");
      setCommentaire("");
      setEnvoi("ok");
      setErreur("");
      await charger();
    } catch (e) {
      setEnvoi("idle");
      setErreur(e instanceof Error ? e.message : "La simulation n'a pas pu être enregistrée.");
    }
  }

  return (
    <section className="mt-4 rounded-xl border border-[#E5E2DA] bg-white">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#EDEDEA] px-4 py-3">
        <h4 className="text-[15px] font-medium text-[#362A24]">{TITRES[type]}</h4>
        <span className="text-[12px] text-gray-500">Prérempli avec le formulaire, modifiable. Visible du cabinet seulement.</span>
      </div>
      <iframe
        ref={cadre}
        src={SOURCES[type]}
        title={TITRES[type]}
        className="block w-full"
        style={{ border: 0, height: hauteur }}
      />
      <div className="space-y-3 border-t border-[#EDEDEA] px-4 py-4 text-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="block flex-1">
            <span className="mb-1 block text-[13px] text-gray-500">Commentaire (facultatif)</span>
            <input
              type="text"
              value={commentaire}
              maxLength={2000}
              onChange={(e) => {
                setCommentaire(e.target.value);
                setEnvoi("idle");
              }}
              placeholder="Hypothèse retenue, origine des chiffres…"
              className="w-full rounded-lg border border-[#E5E2DA] px-3 py-2"
            />
          </label>
          <button
            type="button"
            onClick={enregistrer}
            disabled={!etat || envoi === "envoi"}
            className="shrink-0 rounded-full bg-[#362A24] px-5 py-2 text-white hover:bg-[#2C221D] disabled:opacity-50"
          >
            {envoi === "envoi" ? "Enregistrement…" : "Enregistrer cette simulation"}
          </button>
        </div>
        {etat && <p className="text-[13px] text-gray-500">Résultat affiché : {etat.resume}</p>}
        {envoi === "ok" && <p className="text-[13px] text-[#2d6a43]">Simulation enregistrée.</p>}
        {erreur && <p className="text-[13px] text-[#7A1C12]">{erreur}</p>}
        <div>
          <h5 className="mb-2 text-[13px] font-medium text-gray-700">Simulations enregistrées</h5>
          {liste === null ? (
            <p className="text-[13px] text-gray-500">Lecture…</p>
          ) : liste.length === 0 ? (
            <p className="text-[13px] text-gray-500">Aucune simulation enregistrée pour ce formulaire.</p>
          ) : (
            <ul className="divide-y divide-[#EDEDEA] rounded-lg border border-[#E5E2DA]">
              {liste.map((s) => (
                <li key={s.id} className="flex flex-col gap-1 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-[#1A1A1A]">
                      {s.montant !== null && <strong>{euros(s.montant)}</strong>} {s.resultat}
                    </p>
                    <p className="text-[12px] text-gray-500">
                      {quand(s.date)} · {s.auteur}
                      {s.commentaire && ` · ${s.commentaire}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => s.valeurs && poster({ fainSim: "charger", valeurs: s.valeurs })}
                    className="shrink-0 text-[13px] text-[#362A24] underline underline-offset-2 hover:no-underline"
                  >
                    Recharger
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
