"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Plus, Trash2, Upload, FileText, AlertTriangle, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BENEFICIAIRES,
  CATEGORIES_PIECES,
  CIVILITES,
  DELAIS,
  DISTANCES,
  DOMICILES,
  FORMES_PC,
  GARDES,
  JOURS,
  OUI_NON,
  PLAFONDS,
  PROCEDURES,
  QUI_CREDIT,
  QUI_IMMO,
  QUI_VEHICULE,
  REGIMES,
  REPARTITIONS,
  SEXES,
  bienVide,
  completer,
  creditVide,
  donneesVides,
  enfantVide,
  estMajeur,
  manquants,
  recapitulatif,
  statutsLogement,
  vehiculeVide,
  type Donnees,
  type Manque,
  type Personne,
  type Piece,
} from "@/lib/renseignements/modele";

/* Formulaire de renseignements commun (divorce et séparation de corps), en
   12 étapes. Remplace les formulaires Cognito n° 3, 13 et 14.
   Paramètres d'adresse :
     procedure=sdc   présélectionne la séparation de corps
     interne=1       version cabinet (remplie pendant le rendez-vous)
     entry={…}       pré-remplissage envoyé par Airtable (NOM, Email, Téléphone, Civilité, Prénoms)
     reprise=<id>    rouvre une saisie enregistrée */

const ETAPES = [
  "Votre procédure",
  "Vous",
  "Votre conjoint",
  "Le mariage",
  "Le logement",
  "Les enfants",
  "Le patrimoine",
  "Prestation compensatoire",
  "Le nom d'usage",
  "Les honoraires",
  "Vos pièces",
  "Récapitulatif",
];

const inputCls =
  "w-full rounded-lg border border-[#D6D3CB] bg-white px-4 py-3 text-[15px] text-[#1A1A1A] outline-none transition-colors placeholder:text-gray-400 focus:border-[#362A24]";

const nouvelId = () => {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
};

/* Mise à jour immuable par chemin : « client.nom », « enfants.0.prenoms ». */
function avec<T>(obj: T, chemin: string, valeur: unknown): T {
  const [tete, ...reste] = chemin.split(".");
  const cle = Array.isArray(obj) ? Number(tete) : tete;
  const copie: any = Array.isArray(obj) ? [...obj] : { ...(obj as object) };
  copie[cle] = reste.length ? avec(copie[cle], reste.join("."), valeur) : valeur;
  return copie;
}

function Champ({
  label,
  aide,
  manque,
  children,
  id,
}: {
  label: string;
  aide?: string;
  manque?: boolean;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <div id={id} className="min-w-0">
      <div className={cn("text-[15px]", manque ? "text-[#B42318]" : "text-[#1A1A1A]")}>
        {label}
        {manque && <span className="ml-2 text-sm">(à renseigner)</span>}
      </div>
      {aide && <p className="mt-1 text-sm text-gray-500">{aide}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}

/* « 2 500,50 » → 2500.5 ; null si la saisie n'est pas un nombre. */
function enNombre(s: string): number | null {
  const t = (s || "").replace(/\s/g, "").replace(",", ".").replace(/[^0-9.]/g, "");
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function Choix({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(value === o ? "" : o)}
          className={cn(
            "rounded-full border px-5 py-2.5 text-sm transition-colors",
            value === o
              ? "border-[#362A24] bg-[#362A24] text-white"
              : "border-[#D6D3CB] bg-white text-gray-600 hover:border-gray-400",
          )}
        >
          {o.replace("*", "")}
        </button>
      ))}
    </div>
  );
}

function Liste({ options, value, onChange }: { options: readonly string[]; value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
      <option value="">Choisir…</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o.replace("*", "")}
        </option>
      ))}
    </select>
  );
}

function Grille({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{children}</div>;
}

function Bloc({ titre, onRetirer, children }: { titre: string; onRetirer: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#E5E2DA] bg-[#FAF9F6] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[15px] font-medium text-[#1A1A1A]">{titre}</div>
        <button type="button" onClick={onRetirer} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#B42318]">
          <Trash2 className="h-4 w-4" /> Retirer
        </button>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Ajouter({ libelle, onClick, desactive }: { libelle: string; onClick: () => void; desactive?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desactive}
      className="inline-flex items-center gap-2 rounded-full border border-[#362A24] px-5 py-2.5 text-sm text-[#362A24] transition-colors hover:bg-[#362A24] hover:text-white disabled:opacity-40"
    >
      <Plus className="h-4 w-4" /> {libelle}
    </button>
  );
}

/* Photos réduites avant l'envoi (2 000 px, JPEG) : une photo de téléphone passe
   de 4 ou 5 Mo à quelques centaines de Ko, et tient dans la limite de Netlify. */
async function reduire(f: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(f.type)) return f;
  try {
    const bitmap = await createImageBitmap(f);
    const echelle = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * echelle);
    canvas.height = Math.round(bitmap.height * echelle);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.85));
    if (!blob || blob.size >= f.size) return f;
    return new File([blob], f.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return f;
  }
}

export default function FormulaireRenseignements() {
  const params = useSearchParams();
  const [pret, setPret] = useState(false);
  const [id, setId] = useState("");
  const [interne, setInterne] = useState(false);
  const [d, setD] = useState<Donnees>(() => donneesVides());
  const [etape, setEtape] = useState(0);
  const [tentative, setTentative] = useState(false);
  const [envoi, setEnvoi] = useState<"idle" | "envoi" | "ok" | "erreur">("idle");
  const [erreur, setErreur] = useState("");
  const [reprise, setReprise] = useState<{ etat: "idle" | "envoi" | "ok" | "erreur"; message?: string; lien?: string }>({
    etat: "idle",
  });
  const [televersements, setTeleversements] = useState(0);
  const [categoriePiece, setCategoriePiece] = useState<string>(CATEGORIES_PIECES[0]);
  const [erreurPiece, setErreurPiece] = useState("");
  const haut = useRef<HTMLDivElement>(null);

  const maj = useCallback((chemin: string, valeur: unknown) => setD((x) => avec(x, chemin, valeur)), []);

  /* Démarrage : reprise d'une saisie, ou nouvelle saisie pré-remplie. */
  useEffect(() => {
    const repriseId = params.get("reprise");
    const estInterne = params.get("interne") === "1";
    (async () => {
      if (repriseId) {
        try {
          const r = await fetch(`/api/renseignements/saisie?id=${encodeURIComponent(repriseId)}`);
          const j = await r.json();
          if (r.ok && j.donnees) {
            setId(repriseId);
            setD(completer(j.donnees));
            setInterne(Boolean(j.interne));
            setPret(true);
            return;
          }
          setErreur(j.message || "Ce lien de reprise n'est plus valable.");
        } catch {
          setErreur("Ce lien de reprise n'a pas pu être ouvert.");
        }
      }
      const base = donneesVides(params.get("procedure") === "sdc" ? "Séparation de corps" : "Divorce");
      try {
        const e = JSON.parse(params.get("entry") || "{}") as Record<string, string>;
        const c: Personne = { ...base.client };
        if (e["Civilité"]) c.civilite = (CIVILITES as readonly string[]).includes(e["Civilité"]) ? e["Civilité"] : "";
        if (e.NOM) c.nom = e.NOM;
        if (e["Prénoms"]) c.prenoms = e["Prénoms"];
        if (e.Email) c.email = e.Email;
        if (e["Téléphone"]) c.telephone = e["Téléphone"];
        base.client = c;
      } catch {
        /* pré-remplissage illisible : on part d'un formulaire vide */
      }
      if (estInterne) base.distance = "Rendez-vous physique";
      setId(nouvelId());
      setInterne(estInterne);
      setD(base);
      setPret(true);
    })();
  }, [params]);

  /* Sauvegarde silencieuse à chaque changement d'étape : le lien de reprise
     rouvre toujours la dernière étape atteinte. */
  const sauver = useCallback(
    async (envoyerLien = false) => {
      if (!id) return null;
      const r = await fetch("/api/renseignements/saisie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, donnees: d, interne, envoyerLien }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.message || "Enregistrement impossible");
      return j as { lien: string };
    },
    [id, d, interne],
  );

  const aller = (n: number) => {
    setEtape(n);
    sauver().catch(() => {});
    haut.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const tousManquants = useMemo(() => manquants(d, interne), [d, interne]);
  const manque = (champ: string) => tentative && tousManquants.some((m) => m.champ === champ);

  async function enregistrerEtReprendre() {
    setReprise({ etat: "envoi" });
    try {
      const r = await sauver(!interne);
      setReprise({
        etat: "ok",
        lien: r?.lien,
        message: interne
          ? "Saisie enregistrée. Le lien ci-dessous la rouvre à l'identique."
          : "C'est enregistré. Nous venons de vous envoyer par courriel le lien pour reprendre plus tard.",
      });
    } catch (e) {
      setReprise({ etat: "erreur", message: e instanceof Error ? e.message : "Enregistrement impossible" });
    }
  }

  async function ajouterPiece(fichiers: FileList | null) {
    if (!fichiers?.length) return;
    setErreurPiece("");
    for (const brut of Array.from(fichiers)) {
      setTeleversements((n) => n + 1);
      try {
        const f = await reduire(brut);
        const form = new FormData();
        form.append("id", id);
        form.append("categorie", categoriePiece);
        form.append("fichier", f);
        const r = await fetch("/api/renseignements/piece", { method: "POST", body: form });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.message || "Envoi impossible");
        setD((x) => ({ ...x, pieces: [...x.pieces, j as Piece] }));
      } catch (e) {
        setErreurPiece(`${brut.name} : ${e instanceof Error ? e.message : "envoi impossible"}`);
      } finally {
        setTeleversements((n) => n - 1);
      }
    }
  }

  async function envoyer() {
    setTentative(true);
    if (tousManquants.length) {
      setErreur("");
      return;
    }
    setEnvoi("envoi");
    setErreur("");
    try {
      await sauver();
      const r = await fetch("/api/renseignements/envoi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, donnees: d, interne }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.message || "Envoi impossible");
      setEnvoi("ok");
      haut.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {
      setEnvoi("erreur");
      setErreur(e instanceof Error ? e.message : "Envoi impossible");
    }
  }

  if (!pret) {
    return <div className="py-16 text-center text-gray-500">{erreur || "Chargement du formulaire…"}</div>;
  }

  if (envoi === "ok") {
    return (
      <div ref={haut} className="rounded-2xl border border-[#E5E2DA] bg-white p-8 text-center sm:p-12">
        <CheckCircle2 className="mx-auto h-12 w-12 text-[#362A24]" strokeWidth={1.5} />
        <h2 className="mt-5 font-serif text-3xl text-[#1A1A1A]">Merci, votre formulaire est envoyé</h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600">
          {interne
            ? "La fiche est transmise au cabinet."
            : "Nous avons bien reçu vos informations et vos pièces. Le cabinet revient vers vous pour la suite de votre dossier."}
        </p>
      </div>
    );
  }

  const divorce = d.procedure === "Divorce";
  const P = (qui: "client" | "conjoint") => {
    const x = d[qui];
    const k = (c: keyof Personne) => `${qui}.${c}`;
    const lui = qui === "conjoint";
    return (
      <div className="space-y-5">
        <Champ label="Civilité" manque={manque(k("civilite"))}>
          <Choix options={CIVILITES} value={x.civilite} onChange={(v) => maj(k("civilite"), v)} />
        </Champ>
        <Grille>
          <Champ label={lui ? "Nom de famille" : "Nom"} aide={lui ? "Nom de naissance." : undefined} manque={manque(k("nom"))}>
            <input className={inputCls} value={x.nom} onChange={(e) => maj(k("nom"), e.target.value)} autoComplete={lui ? "off" : "family-name"} />
          </Champ>
          <Champ label="Prénoms" aide="Tous les prénoms, dans l'ordre de l'état civil." manque={manque(k("prenoms"))}>
            <input className={inputCls} value={x.prenoms} onChange={(e) => maj(k("prenoms"), e.target.value)} autoComplete={lui ? "off" : "given-name"} />
          </Champ>
          <Champ label="Date de naissance">
            <input type="date" className={inputCls} value={x.dateNaissance} onChange={(e) => maj(k("dateNaissance"), e.target.value)} />
          </Champ>
          <Champ label="Lieu de naissance" aide="Ville, et pays si ce n'est pas la France.">
            <input className={inputCls} value={x.lieuNaissance} onChange={(e) => maj(k("lieuNaissance"), e.target.value)} />
          </Champ>
          <Champ label="Nationalité">
            <input className={inputCls} value={x.nationalite} onChange={(e) => maj(k("nationalite"), e.target.value)} />
          </Champ>
          <Champ label="Profession">
            <input className={inputCls} value={x.profession} onChange={(e) => maj(k("profession"), e.target.value)} />
          </Champ>
        </Grille>
        <Champ label="Adresse">
          <input className={inputCls} value={x.adresse} onChange={(e) => maj(k("adresse"), e.target.value)} autoComplete={lui ? "off" : "street-address"} />
        </Champ>
        <Grille>
          <Champ label="Code postal">
            <input className={inputCls} value={x.cp} onChange={(e) => maj(k("cp"), e.target.value)} inputMode="numeric" />
          </Champ>
          <Champ label="Ville">
            <input className={inputCls} value={x.ville} onChange={(e) => maj(k("ville"), e.target.value)} />
          </Champ>
          <Champ label="Revenus mensuels nets (€)" aide="Remplissez l'un ou l'autre : le second se calcule seul.">
            <input
              className={inputCls}
              value={x.revenus}
              onChange={(e) => {
                maj(k("revenus"), e.target.value);
                const n = enNombre(e.target.value);
                maj(k("revenusAnnuels"), n === null ? "" : String(Math.round(n * 12)));
              }}
              inputMode="decimal"
            />
          </Champ>
          <Champ label={`Revenus annuels nets ${new Date().getFullYear() - 1} (€)`} aide="Le revenu net imposable de l'avis d'impôt.">
            <input
              className={inputCls}
              value={x.revenusAnnuels}
              onChange={(e) => {
                maj(k("revenusAnnuels"), e.target.value);
                const n = enNombre(e.target.value);
                maj(k("revenus"), n === null ? "" : String(Math.round(n / 12)));
              }}
              inputMode="decimal"
            />
          </Champ>
          <Champ label="Courriel" manque={manque(k("email"))}>
            <input type="email" className={inputCls} value={x.email} onChange={(e) => maj(k("email"), e.target.value)} autoComplete={lui ? "off" : "email"} />
          </Champ>
          <Champ label="Téléphone" manque={manque(k("telephone"))}>
            <input type="tel" className={inputCls} value={x.telephone} onChange={(e) => maj(k("telephone"), e.target.value)} autoComplete={lui ? "off" : "tel"} />
          </Champ>
        </Grille>
      </div>
    );
  };

  const contenu: React.ReactNode[] = [
    /* 1. Votre procédure */
    <div key="p" className="space-y-7">
      <Champ label="Quelle procédure ?" aide="La séparation de corps met fin à la vie commune sans dissoudre le mariage." manque={manque("procedure")}>
        <Choix options={PROCEDURES} value={d.procedure} onChange={(v) => maj("procedure", v || d.procedure)} />
      </Champ>
      <Champ label="Comment souhaitez-vous procéder ?">
        <Choix options={DISTANCES} value={d.distance} onChange={(v) => maj("distance", v)} />
      </Champ>
      <Champ label="Êtes-vous déjà client du cabinet ?">
        <Choix options={OUI_NON} value={d.dejaClient} onChange={(v) => maj("dejaClient", v)} />
      </Champ>
    </div>,
    /* 2. Vous */
    <div key="v">{P("client")}</div>,
    /* 3. Votre conjoint */
    <div key="c">{P("conjoint")}</div>,
    /* 4. Le mariage */
    <div key="m" className="space-y-5">
      <Grille>
        <Champ label="Date du mariage">
          <input type="date" className={inputCls} value={d.mariage.date} onChange={(e) => maj("mariage.date", e.target.value)} />
        </Champ>
        <Champ label="Lieu du mariage">
          <input className={inputCls} value={d.mariage.lieu} onChange={(e) => maj("mariage.lieu", e.target.value)} />
        </Champ>
      </Grille>
      <Champ label="Régime matrimonial" aide="Sans contrat de mariage, c'est en principe la communauté réduite aux acquêts.">
        <Liste options={REGIMES} value={d.mariage.regime} onChange={(v) => maj("mariage.regime", v)} />
      </Champ>
      <Champ label="Avez-vous signé un contrat de mariage chez un notaire ?">
        <Choix options={OUI_NON} value={d.mariage.contrat} onChange={(v) => maj("mariage.contrat", v)} />
      </Champ>
      {d.mariage.contrat === "Oui" && (
        <Grille>
          <Champ label="Nom du notaire">
            <input className={inputCls} value={d.mariage.notaire} onChange={(e) => maj("mariage.notaire", e.target.value)} />
          </Champ>
          <Champ label="Ville du notaire">
            <input className={inputCls} value={d.mariage.villeNotaire} onChange={(e) => maj("mariage.villeNotaire", e.target.value)} />
          </Champ>
          <Champ label="Date du contrat">
            <input type="date" className={inputCls} value={d.mariage.dateContrat} onChange={(e) => maj("mariage.dateContrat", e.target.value)} />
          </Champ>
        </Grille>
      )}
    </div>,
    /* 5. Le logement */
    <div key="l" className="space-y-6">
      <Champ label="Vivez-vous déjà séparément ?">
        <Choix options={OUI_NON} value={d.logement.separes} onChange={(v) => maj("logement.separes", v)} />
      </Champ>
      {d.logement.separes === "Oui" && (
        <Champ label="Depuis quand ?" aide="Date approximative si vous ne connaissez pas le jour exact.">
          <input type="date" className={cn(inputCls, "sm:max-w-xs")} value={d.logement.dateSeparation} onChange={(e) => maj("logement.dateSeparation", e.target.value)} />
        </Champ>
      )}
      <Champ label="Qui conservera le domicile conjugal ?">
        <Choix options={DOMICILES} value={d.logement.domicile} onChange={(v) => maj("logement.domicile", v)} />
      </Champ>
      <Champ
        label={d.logement.separes === "Oui" ? "Votre logement actuel (adresse indiquée à l'étape 2)" : "Le domicile conjugal"}
        aide="Le choix entre propriété en commun et indivise dépend du régime matrimonial indiqué à l'étape 4."
      >
        <Liste options={statutsLogement(d.mariage.regime)} value={d.client.statutLogement} onChange={(v) => maj("client.statutLogement", v)} />
      </Champ>
      {d.logement.separes === "Oui" && (
        <Champ label="Le logement actuel de votre conjoint (adresse indiquée à l'étape 3)">
          <Liste options={statutsLogement(d.mariage.regime)} value={d.conjoint.statutLogement} onChange={(v) => maj("conjoint.statutLogement", v)} />
        </Champ>
      )}
      {d.logement.separes !== "Oui" && (
        <Champ label="Délai de relogement de l'époux qui quittera le domicile">
          <Choix options={DELAIS} value={d.logement.delai} onChange={(v) => maj("logement.delai", v)} />
        </Champ>
      )}
    </div>,
    /* 6. Les enfants */
    <div key="e" className="space-y-5">
      {d.enfants.length > 0 && (
        <Champ label="Nom de famille des enfants">
          <input className={cn(inputCls, "sm:max-w-md")} value={d.nomFamilleEnfants} onChange={(e) => maj("nomFamilleEnfants", e.target.value)} />
        </Champ>
      )}
      {d.enfants.map((x, i) => (
        <Bloc key={i} titre={`Enfant n° ${i + 1}`} onRetirer={() => maj("enfants", d.enfants.filter((_, j) => j !== i))}>
          <Grille>
            <Champ label="Prénoms" manque={manque(`enfants.${i}.prenoms`)}>
              <input className={inputCls} value={x.prenoms} onChange={(e) => maj(`enfants.${i}.prenoms`, e.target.value)} />
            </Champ>
            <Champ label="Sexe">
              <Choix options={SEXES} value={x.sexe} onChange={(v) => maj(`enfants.${i}.sexe`, v)} />
            </Champ>
            <Champ label="Date de naissance">
              <input type="date" className={inputCls} value={x.dateNaissance} onChange={(e) => maj(`enfants.${i}.dateNaissance`, e.target.value)} />
            </Champ>
            <Champ label="Lieu de naissance">
              <input className={inputCls} value={x.lieuNaissance} onChange={(e) => maj(`enfants.${i}.lieuNaissance`, e.target.value)} />
            </Champ>
            <Champ label="Résidence de l'enfant">
              <Liste options={GARDES} value={x.garde} onChange={(v) => maj(`enfants.${i}.garde`, v)} />
            </Champ>
            <Champ label="Pension envisagée (€ par mois)">
              <input className={inputCls} value={x.pension} onChange={(e) => maj(`enfants.${i}.pension`, e.target.value)} inputMode="decimal" />
            </Champ>
            {estMajeur(x) && (
              <>
                <Champ label="Profession">
                  <input className={inputCls} value={x.profession} onChange={(e) => maj(`enfants.${i}.profession`, e.target.value)} />
                </Champ>
                <Champ label="Adresse">
                  <input className={inputCls} value={x.adresse} onChange={(e) => maj(`enfants.${i}.adresse`, e.target.value)} />
                </Champ>
              </>
            )}
          </Grille>
        </Bloc>
      ))}
      {d.enfants.some((x) => x.garde === "Alternée") && (
        <Champ label="Jour du changement de résidence en alternance" aide="Le jour, à 19 heures, où les enfants passent d'un parent à l'autre.">
          <Choix options={JOURS} value={d.jourAlternance} onChange={(v) => maj("jourAlternance", v)} />
        </Champ>
      )}
      {d.enfants.length >= PLAFONDS.enfants && (
        <p className="flex items-start gap-2 text-sm text-gray-600">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> Au-delà de {PLAFONDS.enfants} enfants, indiquez les suivants dans les commentaires : le cabinet les complétera.
        </p>
      )}
      <Ajouter
        libelle={d.enfants.length ? "Ajouter un enfant" : "Ajouter un enfant (mineur ou majeur à charge)"}
        onClick={() => maj("enfants", [...d.enfants, enfantVide()])}
        desactive={d.enfants.length >= PLAFONDS.enfants}
      />
      {d.enfants.length === 0 && <p className="text-sm text-gray-500">Pas d&apos;enfant : passez à l&apos;étape suivante.</p>}
    </div>,
    /* 7. Le patrimoine */
    <div key="pa" className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-[17px] font-medium text-[#1A1A1A]">Biens immobiliers en commun</h3>
        {d.immobilier.map((x, i) => (
          <Bloc key={i} titre={`Bien n° ${i + 1}`} onRetirer={() => maj("immobilier", d.immobilier.filter((_, j) => j !== i))}>
            <Champ label="Adresse">
              <input className={inputCls} value={x.adresse} onChange={(e) => maj(`immobilier.${i}.adresse`, e.target.value)} />
            </Champ>
            <Grille>
              <Champ label="Valeur estimée (€)">
                <input className={inputCls} value={x.valeur} onChange={(e) => maj(`immobilier.${i}.valeur`, e.target.value)} inputMode="decimal" />
              </Champ>
              <Champ label="Crédit restant (€)">
                <input className={inputCls} value={x.creditRestant} onChange={(e) => maj(`immobilier.${i}.creditRestant`, e.target.value)} inputMode="decimal" />
              </Champ>
            </Grille>
            <Champ label="Qui le conservera ?">
              <Choix options={QUI_IMMO} value={x.qui} onChange={(v) => maj(`immobilier.${i}.qui`, v)} />
            </Champ>
          </Bloc>
        ))}
        <Ajouter libelle="Ajouter un bien" onClick={() => maj("immobilier", [...d.immobilier, bienVide()])} desactive={d.immobilier.length >= PLAFONDS.immobilier} />
      </section>
      <section className="space-y-4">
        <h3 className="text-[17px] font-medium text-[#1A1A1A]">Véhicules en commun</h3>
        {d.vehicules.map((x, i) => (
          <Bloc key={i} titre={`Véhicule n° ${i + 1}`} onRetirer={() => maj("vehicules", d.vehicules.filter((_, j) => j !== i))}>
            <Grille>
              <Champ label="Marque">
                <input className={inputCls} value={x.marque} onChange={(e) => maj(`vehicules.${i}.marque`, e.target.value)} />
              </Champ>
              <Champ label="Modèle">
                <input className={inputCls} value={x.modele} onChange={(e) => maj(`vehicules.${i}.modele`, e.target.value)} />
              </Champ>
              <Champ label="Immatriculation">
                <input className={inputCls} value={x.immatriculation} onChange={(e) => maj(`vehicules.${i}.immatriculation`, e.target.value)} />
              </Champ>
              <Champ label="Valeur (€)">
                <input className={inputCls} value={x.valeur} onChange={(e) => maj(`vehicules.${i}.valeur`, e.target.value)} inputMode="decimal" />
              </Champ>
            </Grille>
            <Champ label="Qui le conservera ?">
              <Choix options={QUI_VEHICULE} value={x.qui} onChange={(v) => maj(`vehicules.${i}.qui`, v)} />
            </Champ>
          </Bloc>
        ))}
        <Ajouter libelle="Ajouter un véhicule" onClick={() => maj("vehicules", [...d.vehicules, vehiculeVide()])} desactive={d.vehicules.length >= PLAFONDS.vehicules} />
      </section>
      <section className="space-y-4">
        <h3 className="text-[17px] font-medium text-[#1A1A1A]">Crédits communs</h3>
        {d.credits.map((x, i) => (
          <Bloc key={i} titre={`Crédit n° ${i + 1}`} onRetirer={() => maj("credits", d.credits.filter((_, j) => j !== i))}>
            <Grille>
              <Champ label="Banque">
                <input className={inputCls} value={x.banque} onChange={(e) => maj(`credits.${i}.banque`, e.target.value)} />
              </Champ>
              <Champ label="Total emprunté (€)">
                <input className={inputCls} value={x.totalEmprunte} onChange={(e) => maj(`credits.${i}.totalEmprunte`, e.target.value)} inputMode="decimal" />
              </Champ>
              <Champ label="Restant dû (€)">
                <input className={inputCls} value={x.restantDu} onChange={(e) => maj(`credits.${i}.restantDu`, e.target.value)} inputMode="decimal" />
              </Champ>
              <Champ label="Mensualité (€)">
                <input className={inputCls} value={x.mensualite} onChange={(e) => maj(`credits.${i}.mensualite`, e.target.value)} inputMode="decimal" />
              </Champ>
              <Champ label="Dernière échéance">
                <input type="date" className={inputCls} value={x.derniereEcheance} onChange={(e) => maj(`credits.${i}.derniereEcheance`, e.target.value)} />
              </Champ>
            </Grille>
            <Champ label="Qui le supportera ?">
              <Choix options={QUI_CREDIT} value={x.qui} onChange={(v) => maj(`credits.${i}.qui`, v)} />
            </Champ>
          </Bloc>
        ))}
        <Ajouter libelle="Ajouter un crédit" onClick={() => maj("credits", [...d.credits, creditVide()])} desactive={d.credits.length >= PLAFONDS.credits} />
      </section>
      <section className="space-y-5">
        <h3 className="text-[17px] font-medium text-[#1A1A1A]">Dettes et impôts</h3>
        <Champ label="Avez-vous des arriérés de loyers ?">
          <Choix options={OUI_NON} value={d.arrieresLoyers} onChange={(v) => maj("arrieresLoyers", v)} />
        </Champ>
        {d.arrieresLoyers === "Oui" && (
          <Champ label="Montant total (€)">
            <input className={cn(inputCls, "sm:max-w-xs")} value={d.montantArrieresLoyers} onChange={(e) => maj("montantArrieresLoyers", e.target.value)} inputMode="decimal" />
          </Champ>
        )}
        <Champ label="Avez-vous des arriérés d'impôts ?">
          <Choix options={OUI_NON} value={d.arrieresImpots} onChange={(v) => maj("arrieresImpots", v)} />
        </Champ>
        {d.arrieresImpots === "Oui" && (
          <Champ label="Montant total (€)">
            <input className={cn(inputCls, "sm:max-w-xs")} value={d.montantArrieresImpots} onChange={(e) => maj("montantArrieresImpots", e.target.value)} inputMode="decimal" />
          </Champ>
        )}
        <Champ label="Faites-vous déjà des déclarations d'impôt séparées ?">
          <Choix options={OUI_NON} value={d.impotsSepares} onChange={(v) => maj("impotsSepares", v)} />
        </Champ>
      </section>
    </div>,
    /* 8. Prestation compensatoire ou devoir de secours */
    divorce ? (
      <div key="pc" className="space-y-6">
        <Champ
          label="Avez-vous convenu d'une prestation compensatoire ?"
          aide="Une somme versée par l'un des époux à l'autre pour compenser l'écart de niveau de vie que crée le divorce."
        >
          <Choix options={OUI_NON} value={d.pc.convenue} onChange={(v) => maj("pc.convenue", v)} />
        </Champ>
        {d.pc.convenue === "Oui" && (
          <>
            <Champ label="Qui la reçoit ?">
              <Choix options={BENEFICIAIRES} value={d.pc.beneficiaire} onChange={(v) => maj("pc.beneficiaire", v)} />
            </Champ>
            <Champ label="Sous quelle forme ?">
              <Choix options={FORMES_PC} value={d.pc.forme} onChange={(v) => maj("pc.forme", v)} />
            </Champ>
            <Champ label="Montant total (€)">
              <input className={cn(inputCls, "sm:max-w-xs")} value={d.pc.montant} onChange={(e) => maj("pc.montant", e.target.value)} inputMode="decimal" />
            </Champ>
          </>
        )}
      </div>
    ) : (
      <div key="ds" className="space-y-6">
        <Champ
          label="Avez-vous convenu d'un devoir de secours ?"
          aide="Une pension versée par l'un des époux à l'autre pendant la séparation de corps, le mariage n'étant pas dissous."
        >
          <Choix options={OUI_NON} value={d.ds.convenu} onChange={(v) => maj("ds.convenu", v)} />
        </Champ>
        {d.ds.convenu === "Oui" && (
          <>
            <Champ label="Qui le reçoit ?">
              <Choix options={BENEFICIAIRES} value={d.ds.beneficiaire} onChange={(v) => maj("ds.beneficiaire", v)} />
            </Champ>
            <Champ label="Montant mensuel (€)">
              <input className={cn(inputCls, "sm:max-w-xs")} value={d.ds.montant} onChange={(e) => maj("ds.montant", e.target.value)} inputMode="decimal" />
            </Champ>
          </>
        )}
      </div>
    ),
    /* 9. Le nom d'usage */
    <div key="n" className="space-y-6">
      <Champ label="L'un des époux utilise-t-il le nom de famille de l'autre ?">
        <Choix options={OUI_NON} value={d.nomUsage.utilise} onChange={(v) => maj("nomUsage.utilise", v)} />
      </Champ>
      {d.nomUsage.utilise === "Oui" && (
        <Champ label={divorce ? "Pourra-t-il continuer à l'utiliser après le divorce ?" : "Pourra-t-il continuer à l'utiliser pendant la séparation de corps ?"}>
          <Choix options={OUI_NON} value={d.nomUsage.conserve} onChange={(v) => maj("nomUsage.conserve", v)} />
        </Champ>
      )}
    </div>,
    /* 10. Les honoraires */
    <div key="h" className="space-y-6">
      <Champ label="Qui prendra en charge les honoraires ?">
        <Choix options={REPARTITIONS} value={d.repartition} onChange={(v) => maj("repartition", v)} />
      </Champ>
      <Champ label="Souhaitez-vous préciser quelque chose ?" aide="Facultatif.">
        <textarea rows={5} className={inputCls} value={d.commentaires} onChange={(e) => maj("commentaires", e.target.value)} />
      </Champ>
    </div>,
    /* 11. Vos pièces */
    <div key="pi" className="space-y-5">
      <p className="text-[15px] leading-relaxed text-gray-600">
        Livret de famille, actes d&apos;état civil récents, pièces d&apos;identité des deux époux. PDF ou photo,
        5 Mo au plus par fichier. Vous pouvez aussi les transmettre plus tard.
      </p>
      <Grille>
        <Champ label="Type de pièce">
          <Liste options={CATEGORIES_PIECES} value={categoriePiece} onChange={(v) => setCategoriePiece(v || CATEGORIES_PIECES[0])} />
        </Champ>
        <Champ label="Fichier">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#362A24] px-4 py-3 text-sm text-[#362A24] hover:bg-[#FAF9F6]">
            <Upload className="h-4 w-4" /> {televersements ? "Envoi en cours…" : "Choisir un ou plusieurs fichiers"}
            <input
              type="file"
              multiple
              accept="application/pdf,image/*"
              className="hidden"
              onChange={(e) => {
                ajouterPiece(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        </Champ>
      </Grille>
      {erreurPiece && <p className="text-sm text-[#B42318]">{erreurPiece}</p>}
      {d.pieces.length > 0 && (
        <ul className="divide-y divide-[#EDEDEA] rounded-xl border border-[#E5E2DA]">
          {d.pieces.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-gray-400" />
                <span className="shrink-0 text-gray-500">{p.categorie}</span>
                <span className="truncate text-[#1A1A1A]">{p.nom}</span>
              </span>
              <button type="button" onClick={() => maj("pieces", d.pieces.filter((x) => x.id !== p.id))} className="shrink-0 text-gray-400 hover:text-[#B42318]" aria-label="Retirer">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>,
    /* 12. Récapitulatif */
    <div key="r" className="space-y-6">
      {recapitulatif(d)
        .filter((s) => s.lignes.length)
        .map((s) => (
          <div key={s.titre}>
            <h3 className="mb-2 text-[16px] font-medium text-[#362A24]">{s.titre}</h3>
            <dl className="divide-y divide-[#EDEDEA] rounded-xl border border-[#E5E2DA] text-sm">
              {s.lignes.map(([k, v]) => (
                <div key={k} className="grid grid-cols-1 gap-1 px-4 py-2.5 sm:grid-cols-[200px_1fr]">
                  <dt className="text-gray-500">{k}</dt>
                  <dd className="whitespace-pre-line text-[#1A1A1A]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      {tentative && tousManquants.length > 0 && <ListeManquants m={tousManquants} aller={aller} />}
      {erreur && (
        <p className="rounded-lg border border-[#F3C7C7] bg-[#FDF2F2] px-4 py-3 text-sm text-[#7A1C12]">
          {erreur}. Vous pouvez réessayer ou nous appeler au 01 40 68 02 37.
        </p>
      )}
      {!interne && (
        <p className="text-xs leading-relaxed text-gray-500">
          Ces informations servent uniquement à préparer votre dossier et ne sont transmises à personne. Voir la{" "}
          <a href="/confidentialite" className="underline" target="_blank" rel="noopener">
            politique de confidentialité
          </a>
          .
        </p>
      )}
    </div>,
  ];

  const titreEtape = etape === 7 && !divorce ? "Devoir de secours" : ETAPES[etape];

  return (
    <div ref={haut} className="scroll-mt-28">
      <div className="mb-8">
        <div className="flex items-baseline justify-between gap-4 text-sm text-gray-500">
          <span>
            Étape {etape + 1} sur {ETAPES.length}
            {interne && <span className="ml-3 rounded-full bg-[#F4F2EC] px-2.5 py-0.5 text-xs text-[#362A24]">Version cabinet</span>}
          </span>
          <span>{d.procedure}</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#EDEDEA]">
          <div className="h-full rounded-full bg-[#362A24] transition-all" style={{ width: `${((etape + 1) / ETAPES.length) * 100}%` }} />
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {ETAPES.map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={() => aller(i)}
              className={cn(
                "rounded-full px-3 py-1 text-xs transition-colors",
                i === etape ? "bg-[#362A24] text-white" : "bg-[#F4F2EC] text-gray-600 hover:bg-[#E5E2DA]",
              )}
            >
              {i + 1}. {i === 7 && !divorce ? "Devoir de secours" : t}
            </button>
          ))}
        </div>
      </div>

      <h2 className="mb-6 font-serif text-3xl text-[#1A1A1A]">{titreEtape}</h2>
      {contenu[etape]}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#EDEDEA] pt-6">
        <div>
          {etape > 0 && (
            <button type="button" onClick={() => aller(etape - 1)} className="rounded-full border border-[#D6D3CB] px-6 py-3 text-sm text-gray-700 hover:border-gray-400">
              Précédent
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={enregistrerEtReprendre}
            disabled={reprise.etat === "envoi"}
            className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-[#362A24] underline-offset-4 hover:underline disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {reprise.etat === "envoi" ? "Enregistrement…" : "Enregistrer et reprendre plus tard"}
          </button>
          {etape < ETAPES.length - 1 ? (
            <button type="button" onClick={() => aller(etape + 1)} className="rounded-full bg-[#362A24] px-8 py-3 text-sm text-white hover:bg-[#2C221D]">
              Suivant
            </button>
          ) : (
            <button
              type="button"
              onClick={envoyer}
              disabled={envoi === "envoi" || televersements > 0}
              className="rounded-full bg-[#362A24] px-8 py-3 text-sm text-white hover:bg-[#2C221D] disabled:bg-[#C9C6BF]"
            >
              {envoi === "envoi" ? "Envoi en cours…" : "Envoyer le formulaire"}
            </button>
          )}
        </div>
      </div>
      {reprise.etat !== "idle" && reprise.message && (
        <div
          className={cn(
            "mt-4 rounded-lg px-4 py-3 text-sm",
            reprise.etat === "erreur" ? "border border-[#F3C7C7] bg-[#FDF2F2] text-[#7A1C12]" : "border border-[#E5E2DA] bg-[#FAF9F6] text-gray-700",
          )}
        >
          {reprise.message}
          {interne && reprise.lien && (
            <div className="mt-2 break-all">
              <a href={reprise.lien} className="text-[#362A24] underline">
                {reprise.lien}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ListeManquants({ m, aller }: { m: Manque[]; aller: (n: number) => void }) {
  return (
    <div className="rounded-lg border border-[#F3C7C7] bg-[#FDF2F2] px-4 py-3 text-sm text-[#7A1C12]">
      <strong>Il manque encore :</strong>{" "}
      {m.map((x, i) => (
        <span key={x.champ}>
          <button type="button" onClick={() => aller(x.etape)} className="underline">
            {x.libelle}
          </button>
          {i < m.length - 1 ? ", " : "."}
        </span>
      ))}
    </div>
  );
}
