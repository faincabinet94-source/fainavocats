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

  /* Séparation de corps : le modèle SDC décrit le devoir de secours avec les
     champs de la prestation compensatoire (PC, BénéficiairePC, MontantPC). */
  if (d.procedure === "Séparation de corps") {
    v.PC = v.DS ?? null;
    v.BénéficiairePC = v.BénéficiaireDS ?? null;
    v.MontantPC = v.MontantDS ?? null;
    if (v.UsageNomConjointSDC !== undefined) v.UsageNomConjointDivorce = v.UsageNomConjointSDC;
  }

  /* Revenus : l'année de référence est l'année civile précédente ; mensuels
     et annuels se déduisent l'un de l'autre si un seul est connu (saisies
     antérieures au double champ). */
  v.AnneeRevenus = le.getFullYear() - 1;
  (["client", "conjoint"] as const).forEach((qui, i) => {
    const s = i === 0 ? "" : "2";
    const p = d[qui];
    const m = nombre(p.revenus);
    const a = nombre(p.revenusAnnuels);
    const mensuel = m ?? (a !== null ? Math.round(a / 12) : null);
    const annuel = a ?? (m !== null ? Math.round(m * 12) : null);
    v[`Revenus${s}`] = mensuel === null ? null : { valeur: mensuel, texte: montant(mensuel) };
    v[`RevenusAnnuels${s}`] = annuel === null ? null : { valeur: annuel, texte: montant(annuel) };
  });

  /* Logement et accords : statut du logement de chaque époux, pronoms. */
  v.StatutLogement = d.client.statutLogement || null;
  v.StatutLogementConjoint = d.conjoint.statutLogement || null;
  v.Pronom = d.client.civilite === "Madame" ? "elle" : "il";
  v.PronomConjoint = d.conjoint.civilite === "Madame" ? "elle" : "il";
  v.AccordE = d.client.civilite === "Madame" ? "e" : "";
  v.AccordEConjoint = d.conjoint.civilite === "Madame" ? "e" : "";

  /* Alternance : jour du changement de résidence, le dimanche à défaut. */
  v.JourAlternance = d.jourAlternance || "dimanche";

  /* Nationalité étrangère hors Union européenne : conditionne la clause sur la
     reconnaissance du divorce à l'étranger. */
  const etrangers = etrangersHorsUE(d);
  v.EtrangerHorsUE = etrangers.length ? "Oui" : "Non";
  v.PaysEtEpouxEtrangers = etrangers.length ? phraseEtrangers(etrangers) : null;

  /* Champs propres à Cognito : date du jour (page de garde) et rôle de la
     saisie ; TypeDCM (DCM1AE…) vient du code tarif de la fiche, transmis par
     n8n dans les compléments. */
  const jour = `${le.getFullYear()}-${String(le.getMonth() + 1).padStart(2, "0")}-${String(le.getDate()).padStart(2, "0")}`;
  v.DateJour = { valeur: jour, texte: dateLongue(jour) };
  v["Entry.Role"] = null;
  v.TypeDCM = null;

  const pensions = d.enfants.map((e) => nombre(e.pension)).filter((n): n is number => n !== null);
  const total = pensions.reduce((s, n) => s + n, 0);
  v.TotalPensions = { valeur: total, texte: montant(total) };
  const p1 = nombre(d.enfants[0]?.pension);
  v.Pension1 = p1 === null ? null : { valeur: p1, texte: montant(p1) };

  return v;
}

/* ---------- Nationalités ---------- */

const sansAccents = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/* Radicaux des nationalités des 27 États membres de l'Union européenne. */
const UE = [
  "franc", "allemand", "autrichien", "belge", "bulgare", "chypriot", "croate", "danois", "espagnol",
  "estonien", "finlandais", "grec", "hongrois", "irlandais", "italien", "leton", "letton", "lituanien",
  "luxembourgeois", "maltais", "neerlandais", "hollandais", "polonais", "portugais", "roumain", "slovaque",
  "slovene", "suedois", "tcheque",
];

/* Radical de la nationalité → nom du pays avec son article. */
const PAYS: [string, string][] = [
  ["algerien", "l'Algérie"], ["marocain", "le Maroc"], ["tunisien", "la Tunisie"], ["senegalais", "le Sénégal"],
  ["malien", "le Mali"], ["ivoirien", "la Côte d'Ivoire"], ["camerounais", "le Cameroun"], ["congolais", "le Congo"],
  ["guineen", "la Guinée"], ["mauritanien", "la Mauritanie"], ["comorien", "les Comores"], ["beninois", "le Bénin"],
  ["togolais", "le Togo"], ["burkinab", "le Burkina Faso"], ["gabonais", "le Gabon"], ["malgache", "Madagascar"],
  ["mauricien", "Maurice"], ["egyptien", "l'Égypte"], ["libanais", "le Liban"], ["syrien", "la Syrie"],
  ["irakien", "l'Irak"], ["iranien", "l'Iran"], ["israelien", "Israël"], ["turc", "la Turquie"], ["russe", "la Russie"],
  ["ukrainien", "l'Ukraine"], ["moldave", "la Moldavie"], ["georgien", "la Géorgie"], ["armenien", "l'Arménie"],
  ["serbe", "la Serbie"], ["albanais", "l'Albanie"], ["kosovar", "le Kosovo"], ["suisse", "la Suisse"],
  ["britannique", "le Royaume-Uni"], ["anglais", "le Royaume-Uni"], ["norvegien", "la Norvège"],
  ["americain", "les États-Unis"], ["canadien", "le Canada"], ["bresilien", "le Brésil"], ["colombien", "la Colombie"],
  ["haitien", "Haïti"], ["chinois", "la Chine"], ["japonais", "le Japon"], ["vietnamien", "le Viêt Nam"],
  ["indien", "l'Inde"], ["pakistanais", "le Pakistan"], ["afghan", "l'Afghanistan"], ["philippin", "les Philippines"],
  ["thailandais", "la Thaïlande"], ["sri", "le Sri Lanka"], ["cambodgien", "le Cambodge"], ["laotien", "le Laos"],
];
const MOTS_NEUTRES = new Set(["et", "double", "nationalite", "nationalites", "de", "la", "le", "binational", "binationale", "e", "es", "s"]);

type Etranger = { epoux: string; feminin: boolean; pays: string[]; brut: string };

function etrangersHorsUE(d: Donnees): Etranger[] {
  const res: Etranger[] = [];
  for (const p of [d.client, d.conjoint]) {
    const mots = sansAccents(p.nationalite || "").split(/[^a-z]+/).filter((m) => m && !MOTS_NEUTRES.has(m));
    const horsUE = mots.filter((m) => !UE.some((r) => m.startsWith(r)));
    if (!horsUE.length) continue;
    const pays = horsUE.map((m) => PAYS.find(([r]) => m.startsWith(r))?.[1]).filter((x): x is string => Boolean(x));
    res.push({
      epoux: `${p.civilite} ${(p.nom || "").trim().toUpperCase()}`.trim(),
      feminin: p.civilite === "Madame",
      pays: Array.from(new Set(pays)),
      brut: (p.nationalite || "").trim(),
    });
  }
  return res;
}

const liste = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} et ${xs[xs.length - 1]}`);

/* « l'Algérie, pays dont Madame ESSAI est ressortissante » ; nationalité non
   reconnue : « le pays dont Madame ESSAI est ressortissante (nationalité
   déclarée : …) », à compléter à la relecture. */
function phraseEtrangers(es: Etranger[]): string {
  return es
    .map((e) => {
      const ressortissant = "ressortissant" + (e.feminin ? "e" : "");
      if (!e.pays.length) return `le pays dont ${e.epoux} est ${ressortissant} (nationalité déclarée : ${e.brut})`;
      return `${liste(e.pays)}, pays dont ${e.epoux} est ${ressortissant}`;
    })
    .join(", et ");
}
