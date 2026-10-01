import { chargeCognito, champsComplementaires, type Donnees } from "@/lib/renseignements/modele";

/* Correction d'un formulaire déjà envoyé, depuis le champ « Lien formulaire »
 * de la table Dossiers : /formulaire-renseignements?correction=<fiche>.<jeton>.
 *
 * Le jeton est tiré au hasard par l'automatisation Airtable « Dossier -> lien
 * du formulaire » et rangé dans « Jeton de correction » ; n8n le compare avant
 * de lire ou de modifier la fiche. Sans lui, l'identifiant de la fiche ne
 * suffit pas. */

export const LIEN_CORRECTION = /^(rec[A-Za-z0-9]{14})\.([a-f0-9]{32})$/;

export function lireLien(c: unknown): { fiche: string; jeton: string } | null {
  const m = typeof c === "string" ? LIEN_CORRECTION.exec(c) : null;
  return m ? { fiche: m[1], jeton: m[2] } : null;
}

/* Champs de la fiche que l'automatisation « Cognito -> AirTable » remplit à la
   création, sous leurs noms Airtable, à partir des mêmes valeurs. Ne sont pas
   repris : le nom de la fiche (#CF, qui sert à retrouver le dossier), le
   statut, la date, « Déjà client », la distance, interne ou externe. Un champ
   laissé vide dans le formulaire n'efface pas ce que la fiche contient (une
   note ajoutée dans Airtable, par exemple). */
export function champsIdentite(d: Donnees): Record<string, unknown> {
  return Object.fromEntries(Object.entries(identite(d)).filter(([, v]) => v !== null && v !== undefined && v !== ""));
}

function identite(d: Donnees): Record<string, unknown> {
  const c = chargeCognito(d, { interne: true, numero: 0, date: "" });
  const t = (x: unknown) => (x === null || x === undefined ? null : String(x));
  const maj = (x: unknown) => (typeof x === "string" ? x.toUpperCase() : null);
  const min = (x: unknown) => (typeof x === "string" ? x.toLowerCase() : null);
  return {
    Genre: c["Civilité"] ?? null,
    NOM: maj(c.NOM),
    Prénoms: c["Prénoms"] ?? null,
    Mail: min(c.Email),
    Genre2: c["CivilitéConjoint"] ?? null,
    NOM2: maj(c.NOMDEFAMILLEDUCONJOINT),
    Prénoms2: c["Prénomsconjoint"] ?? null,
    Mail2: min(c.EmailDuConjoint),
    "Répartition hono": c["RépartitonDesHonoraires"] ?? null,
    Commentaires: c.VosCommentaires ?? null,
    Adresse: c.Adresse ?? null,
    CP: t(c.CodePostal),
    Ville: c.Ville ?? null,
    Adresse2: c.AdresseDuConjoint ?? null,
    CP2: t(c.CodePostalConjoint),
    Ville2: c.VilleConjoint ?? null,
    "Date naissance1": c.DateDeNaissance ?? null,
    "Lieu naissance1": c.LieuDeNaissance ?? null,
    Profession1: c.Profession ?? null,
    Revenus1: t(c.Revenus),
    nationalité1: c["Nationalité"] ?? null,
    "Date naissance2": c.DateNaissanceConjoint ?? null,
    "Lieu naissance2": c.LieuDeNaissanceDuConjoint ?? null,
    Profession2: c.Profession2 ?? null,
    Revenus2: t(c.Revenus2),
    nationalité2: c["NationalitéDuConjoint"] ?? null,
    "Date mariage": c.DateDuMariage ?? null,
    "Lieu mariage": c.LieuDuMariage ?? null,
    "Régime matrimonial": c["RégimeMatrimonial"] ?? null,
    "Tél.": c["Téléphone"] ?? null,
    "Tél.2": c["TéléphoneConjoint"] ?? null,
  };
}

/* Colonnes du formulaire du site (saisie complète comprise), sans le lien de
   reprise ni la version, que n8n complète (« corrigée le … »). */
export function champsCorriges(d: Donnees): Record<string, unknown> {
  const { "Lien de reprise": _lien, "Version du formulaire": _version, ...reste } = champsComplementaires(d, "");
  void _lien;
  void _version;
  return { ...champsIdentite(d), ...reste };
}
