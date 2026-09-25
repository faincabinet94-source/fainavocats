import { age, chargeCognito, type Donnees } from "@/lib/renseignements/modele";
import type { Valeurs } from "./moteur";

/* Valeurs des modèles de convention, sous les noms de champs de Cognito.
 *
 * Point de départ : la charge au format Cognito déjà produite pour Airtable, à
 * laquelle on applique la mise en forme d'un acte (dates en toutes lettres,
 * montants à la française, noms en capitales) et on ajoute les champs que
 * Cognito calculait : âges, durée du mariage, pensions. */

const MOIS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

export function dateLongue(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  if (!m) return iso || "";
  const j = Number(m[3]);
  return `${j === 1 ? "1er" : j} ${MOIS[Number(m[2]) - 1]} ${m[1]}`;
}

/* 1500 → « 1 500 », 1500.5 → « 1 500,50 » (espace insécable). */
export function montant(n: number): string {
  const entier = Math.trunc(Math.abs(n));
  const cents = Math.round((Math.abs(n) - entier) * 100);
  const groupes = String(entier).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (n < 0 ? "-" : "") + groupes + (cents ? "," + String(cents).padStart(2, "0") : "");
}

const nombre = (s: string | number | null | undefined): number | null => {
  if (typeof s === "number") return Number.isFinite(s) ? s : null;
  const t = (s || "").replace(/\s/g, "").replace(",", ".").replace(/[^0-9.]/g, "");
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
};

/* Âge en mois révolus, pour le nourrisson (« âgé de 7 mois »). */
function moisRevolus(iso: string, le: Date): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  if (!m) return null;
  let mois = (le.getFullYear() - Number(m[1])) * 12 + (le.getMonth() + 1 - Number(m[2]));
  if (le.getDate() < Number(m[3])) mois -= 1;
  return mois;
}

const EN_CAPITALES = new Set(["NOM", "NOMDEFAMILLEDUCONJOINT", "NomDeFamilleDesEnfants"]);
const COMPTEURS = new Set(["Nbenfants", "BiensImmobiliersAcquisEnCommun", "VéhiculesAutomobiles", "CréditsCommuns"]);

export function valeursConvention(d: Donnees, le: Date = new Date()): Valeurs {
  const brut = chargeCognito(d, { interne: false, numero: 0, date: "" });
  const v: Valeurs = {};
  for (const [cle, x] of Object.entries(brut)) {
    if (x === null || x === undefined) v[cle] = null;
    else if (typeof x === "boolean") v[cle] = x ? "Oui" : "Non";
    else if (typeof x === "number") v[cle] = COMPTEURS.has(cle) ? x : { valeur: x, texte: montant(x) };
    else if (typeof x === "string") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(x)) v[cle] = { valeur: x, texte: dateLongue(x) };
      else if (EN_CAPITALES.has(cle)) v[cle] = x.toUpperCase();
      else v[cle] = x;
    }
  }

  /* Montants saisis en texte libre dans le formulaire (valeur d'un véhicule,
     total emprunté) : mis en forme s'ils sont numériques. */
  for (const cle of Object.keys(v)) {
    if (!/^(Valeur|TotalEmprunté|ValeurImmo)\d*$/.test(cle)) continue;
    const x = v[cle];
    const n = typeof x === "string" ? nombre(x) : null;
    if (n !== null && /^[\d\s.,€]+$/.test(String(x).trim())) v[cle] = { valeur: n, texte: montant(n) };
  }

  const a1 = age(d.client.dateNaissance, le);
  const a2 = age(d.conjoint.dateNaissance, le);
  v.Age1 = a1;
  v.Age2 = a2;
  v.DuréeMariage = age(d.mariage.date, le);

  /* AgeE : âge en années pour les conditions ; affiché en mois avant un an,
     comme le suppose la clause du nourrisson (« âgé de {AgeE1} mois »). */
  d.enfants.slice(0, 5).forEach((e, i) => {
    const ans = age(e.dateNaissance, le);
    const mois = moisRevolus(e.dateNaissance, le);
    v[`AgeE${i + 1}`] = ans === null ? null : { valeur: ans, texte: String(ans < 1 && mois !== null ? mois : ans) };
  });

  /* Rangs absents (3e enfant d'un couple qui en a deux, 2e véhicule…) : champs
     déclarés vides, pour que le rapport ne signale que les vrais inconnus,
     c'est-à-dire un nom de champ que le modèle écrit et que le moteur ignore. */
  const rangs = ["1er", "2e", "3e", "4e", "5e"];
  for (let n = 1; n <= 5; n++) {
    for (const c of ["PrénomsEnfant", "Sexe", "DateDeNaissanceEnfant", "LieuDeNaissanceEnfant", "Garde", "Pension", "AgeE"]) {
      if (!(`${c}${n}` in v)) v[`${c}${n}`] = null;
    }
    for (const c of [`Profession${rangs[n - 1]}Enfant`, `Adresse${rangs[n - 1]}Enfant`]) if (!(c in v)) v[c] = null;
  }
  for (let n = 1; n <= 6; n++) {
    const s = n === 1 ? "" : String(n);
    for (const c of ["Banque", "TotalEmprunté", "RestantDû", "Mensualite", "DateDernièreÉchéance", "QuiLeSupportera"]) {
      if (!(`${c}${s}` in v)) v[`${c}${s}`] = null;
    }
    if (n <= 3) {
      for (const c of ["Marque", "Modèle", "Immatriculation", "Valeur", "QuiLeConservera", "AdresseImmo"]) {
        if (!(`${c}${s}` in v)) v[`${c}${s}`] = null;
      }
      for (const c of ["ValeurImmo", "CréditImmoRestant", "QuiConserveraImmo"]) if (!(`${c}${n}` in v)) v[`${c}${n}`] = null;
    }
  }

  const pensions = d.enfants.map((e) => nombre(e.pension)).filter((n): n is number => n !== null);
  const total = pensions.reduce((s, n) => s + n, 0);
  v.TotalPensions = { valeur: total, texte: montant(total) };
  const p1 = nombre(d.enfants[0]?.pension);
  v.Pension1 = p1 === null ? null : { valeur: p1, texte: montant(p1) };

  return v;
}
