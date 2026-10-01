import { AVOCAT_PARTENAIRE, age, chargeCognito, estPartenaire, type Donnees } from "@/lib/renseignements/modele";
import type { Valeurs } from "./moteur";
import { activite, analyserExtraneite } from "./extraneite";

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

  /* Durée du mariage en toutes lettres (« douze ans ») ; la valeur reste le
     nombre pour les conditions. L'unité suit à part (DCM1AE 15.3) ; les
     modèles antérieurs écrivent « ans » en dur. */
  const duree = age(d.mariage.date, le);
  v.DuréeMariage = duree === null ? null : { valeur: duree, texte: enLettres(duree) };
  v.DuréeMariageAns = duree === null ? null : duree > 1 ? "ans" : "an";

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
    /* Fin de phrase après « il » ou « elle » (DCM1AE 15.3) : aucun revenu
       déclaré, revenus chiffrés, ou revenus à compléter. */
    v[`PhraseRevenus${s}`] =
      annuel === null || mensuel === null
        ? "a déclaré percevoir des revenus nets de [REVENUS À COMPLÉTER]"
        : annuel === 0 && mensuel === 0
          ? "n’a déclaré percevoir aucun revenu"
          : `a déclaré percevoir des revenus nets de ${montant(annuel)} Euros, soit ${montant(mensuel)} Euros mensuels`;
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
     reconnaissance du divorce à l'étranger (modèles jusqu'à DCM1AE 15.1). */
  const etrangers = etrangersHorsUE(d);
  v.EtrangerHorsUE = etrangers.length ? "Oui" : "Non";
  v.PaysEtEpouxEtrangers = etrangers.length ? phraseEtrangers(etrangers) : null;

  /* Compétence, loi applicable et reconnaissance à l'étranger (DCM1AE 15.2) :
     paragraphes rédigés selon les nationalités et les pays de résidence. */
  Object.assign(v, analyserExtraneite(d).valeurs);

  /* Profession : « exerce la profession d'officier d'état civil », « est sans
     profession », « est actuellement à la recherche d'un emploi ». */
  (["client", "conjoint"] as const).forEach((qui, i) => {
    const s = i === 0 ? "" : "2";
    const p = d[qui];
    const x = activite(p.profession, p.civilite === "Madame");
    v[`ProfessionEntete${s}`] = x ? x.entete : null;
    v[`PhraseProfession${s}`] = x ? x.phrase : "exerce la profession de [PROFESSION À COMPLÉTER]";
  });
  for (let n = 1; n <= 5; n++) {
    const e = d.enfants[n - 1];
    const x = e ? activite(e.profession, e.sexe === "Féminin") : null;
    v[`ActiviteEnfant${n}`] = x ? x.participe : e ? "exerçant la profession de [PROFESSION À COMPLÉTER]" : null;
  }

  /* Information des enfants mineurs (art. 229-2 1° C. civ.) : une phrase pour
     les enfants de moins de 12 ans, une pour ceux de 12 à 17 ans, chacune
     groupant tous les enfants concernés (DCM1AE 15.2). */
  Object.assign(v, informationEnfants(d, le).valeurs);

  /* Prestation compensatoire non renseignée (question laissée vide, possible
     dans la version cabinet du formulaire) : aucune branche du modèle ne
     s'imprimait. Clause « pas de prestation » par défaut, signalée dans l'acte
     (PCParDefaut) et dans le rapport. */
  v.PCParDefaut = "Non";
  if (d.procedure !== "Séparation de corps" && !(d.pc.convenue || "").trim()) {
    v.PC = "Non";
    v.PCParDefaut = "Oui";
  }

  /* Avocat du conjoint : le confrère partenaire à défaut d'autre choix. La
     mention « Exerçant à titre individuel » n'est connue que pour lui : pour
     un autre avocat, la ligne disparaît du modèle. */
  const av = d.avocatConjoint && d.avocatConjoint.nom ? d.avocatConjoint : AVOCAT_PARTENAIRE;
  const nomAv = (av.nom || "").trim().toUpperCase();
  v.AvocatConjoint = [av.prenom, nomAv].filter(Boolean).join(" ");
  v.NomAvocatConjoint = nomAv;
  v.BarreauAvocatConjoint = av.barreau || null;
  v.AdresseAvocatConjoint = [av.adresse, [av.cp, (av.ville || "").toUpperCase()].filter(Boolean).join(" ")].filter(Boolean).join(" - ") || null;
  v.EmailAvocatConjoint = av.email || null;
  v.ExerciceAvocatConjoint = estPartenaire(av) ? "Exerçant à titre individuel" : null;

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

  Object.assign(v, sansContribution(d).valeurs);

  return v;
}

/* Points à vérifier, repris dans le rapport de génération. */
export function alertesConvention(d: Donnees, le: Date = new Date()): string[] {
  const a = [...analyserExtraneite(d).alertes, ...informationEnfants(d, le).alertes, ...sansContribution(d).alertes];
  if (d.procedure !== "Séparation de corps" && !(d.pc.convenue || "").trim())
    a.unshift("Prestation compensatoire non renseignée dans le formulaire : clause « pas de prestation compensatoire » insérée par défaut, à vérifier.");
  return a;
}

/* ---------- Nombres en toutes lettres ---------- */

const UNITES = [
  "zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix",
  "onze", "douze", "treize", "quatorze", "quinze", "seize",
];
const DIZAINES = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante"];

/* 0 à 999, orthographe traditionnelle : « vingt et un », « soixante et
   onze », « quatre-vingts », « quatre-vingt-un », « deux cents ». */
export function enLettres(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 999) return String(n);
  if (n <= 16) return UNITES[n];
  if (n < 20) return `dix-${UNITES[n - 10]}`;
  if (n < 100) {
    let d = Math.floor(n / 10);
    let u = n % 10;
    if (d === 7 || d === 9) { d -= 1; u += 10; }
    const base = d === 8 ? "quatre-vingt" : DIZAINES[d];
    if (u === 0) return d === 8 ? "quatre-vingts" : base;
    if ((u === 1 || u === 11) && d < 8) return `${base} et ${enLettres(u)}`;
    return `${base}-${enLettres(u)}`;
  }
  const c = Math.floor(n / 100);
  const r = n % 100;
  const cent = c === 1 ? "cent" : `${UNITES[c]} cent${r ? "" : "s"}`;
  return r ? `${cent} ${enLettres(r)}` : cent;
}

/* ---------- Absence de contribution à l'entretien des enfants ---------- */

/* Aucune contribution chiffrée hors résidence alternée (pension 0 ou non
   saisie pour chaque enfant) : rien ne s'imprimait. Clause par défaut, en
   trois paragraphes (DCM1AE 15.3) : impécuniosité du parent chez qui les
   enfants ne résident pas, engagement de verser la contribution du barème dès
   qu'il aura retrouvé un emploi rémunéré au moins au SMIC, et partage par
   moitié des frais dans l'attente. */
const BAREME_CEE = "https://www.justice.fr/simulateurs/pension-alimentaire/bareme";

export function sansContribution(d: Donnees) {
  const vides = { SansCEE: "Non", SansCEE1: null, SansCEE2: null, SansCEE3: null } as Record<string, string | null>;
  const alertes: string[] = [];
  if (d.procedure === "Séparation de corps" || !d.enfants.length) return { valeurs: vides, alertes };
  if (d.enfants.some((e) => (nombre(e.pension) ?? 0) > 0)) return { valeurs: vides, alertes };
  const garde = d.enfants[0]?.garde;
  if (garde !== "Moi" && garde !== "Mon époux(se)") return { valeurs: vides, alertes };

  const debiteur = garde === "Mon époux(se)" ? d.client : d.conjoint;
  const creancier = garde === "Mon époux(se)" ? d.conjoint : d.client;
  const nom = (p: typeof d.client) => `${p.civilite} ${(p.nom || "").trim().toUpperCase()}`.trim();
  const il = debiteur.civilite === "Madame" ? "elle" : "il";
  const ses = (() => {
    const n = d.enfants.length;
    const filles = d.enfants.every((e) => e.sexe === "Féminin");
    const fils = d.enfants.every((e) => e.sexe === "Masculin");
    if (n === 1) return filles ? "sa fille" : fils ? "son fils" : "son enfant";
    return `ses ${enLettres(n)} ${filles ? "filles" : fils ? "fils" : "enfants"}`;
  })();
  const des = d.enfants.length > 1 ? "des enfants" : "de l’enfant";

  alertes.push(
    `Aucune contribution à l'entretien et à l'éducation des enfants saisie : clause « impécuniosité de ${nom(debiteur)} » insérée par défaut, à vérifier.`,
  );
  const revenus = nombre(debiteur.revenusAnnuels) ?? nombre(debiteur.revenus);
  if (revenus) alertes.push(`${nom(debiteur)} déclare des revenus : la clause d'impécuniosité est à revoir.`);

  return {
    valeurs: {
      SansCEE: "Oui",
      SansCEE1: `Compte tenu de l’impécuniosité de ${nom(debiteur)}, il ne sera mis à sa charge aucune contribution mensuelle à l’entretien et à l’éducation ${des}.`,
      SansCEE2: `${nom(debiteur)} s’engage à verser à ${nom(creancier)} une contribution mensuelle à l’entretien et à l’éducation de ${ses}, conforme au barème d’usage émis par le Ministère de la Justice (et disponible sur ce site : ${BAREME_CEE}) dès lors qu’${il} aura retrouvé un emploi rémunéré au moins au SMIC.`,
      SansCEE3: `Dans l’attente, ${il} s’engage à partager par moitié avec ${nom(creancier)} les frais de scolarité, d’activités extra-scolaires et les dépenses médicales non remboursées.`,
    } as Record<string, string | null>,
    alertes,
  };
}

/* ---------- Information des enfants mineurs ---------- */

/* Seuil retenu par le cabinet : discernement présumé à partir de 12 ans. */
const AGE_DISCERNEMENT = 12;

type Mineur = { prenom: string; feminin: boolean; age: string };

/* « Elya, Milhane et Hanaé » */
const enumerer = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} et ${xs[xs.length - 1]}`);

/* « âgés respectivement de 10, 6 et 4 ans » ; unités répétées dès qu'un âge
   s'exprime en mois (« de 7 ans et de 7 mois »). */
function ages(es: Mineur[]): string {
  const enMois = es.some((e) => e.age.endsWith("mois"));
  if (es.length === 1) return es[0].age;
  if (enMois) return enumerer(es.map((e, i) => (i ? `de ${e.age}` : e.age)));
  return `${enumerer(es.map((e) => e.age.replace(/ ans?$/, "")))} ans`;
}

export function informationEnfants(d: Donnees, le: Date = new Date()) {
  const alertes: string[] = [];
  const sans: Mineur[] = [];
  const avec: Mineur[] = [];
  d.enfants.forEach((e, i) => {
    const prenom = (e.prenoms || "").trim().replace(/\s+/g, " ") || `n° ${i + 1}`;
    const ans = age(e.dateNaissance, le);
    if (ans === null) {
      alertes.push(`Date de naissance de l'enfant ${prenom} non renseignée : information prévue à l'article 229-2 1° à rédiger à la main.`);
      return;
    }
    if (ans >= 18) return;
    const mois = moisRevolus(e.dateNaissance, le);
    const texte = ans < 1 && mois !== null ? `${mois} mois` : `${ans} an${ans > 1 ? "s" : ""}`;
    (ans < AGE_DISCERNEMENT ? sans : avec).push({ prenom, feminin: e.sexe === "Féminin", age: texte });
  });

  const phrase = (es: Mineur[], discernement: boolean): string | null => {
    if (!es.length) return null;
    const pl = es.length > 1;
    const fem = es.every((e) => e.feminin);
    const accord = (fem ? "e" : "") + (pl ? "s" : "");
    const noms = enumerer(es.map((e) => e.prenom));
    if (!discernement) {
      return pl
        ? `Les enfants mineur${accord} ${noms} n’ont pu bénéficier de l’information prévue à l’article 229-2 1°, les parents ayant déclaré qu’âgé${accord} respectivement de ${ages(es)}, ${fem ? "elles" : "ils"} ne sont pas doté${accord} du discernement nécessaire.`
        : `L’enfant mineur${accord} ${noms} n’a pu bénéficier de l’information prévue à l’article 229-2 1°, les parents ayant déclaré qu’âgé${accord} de ${ages(es)}, ${fem ? "elle" : "il"} n’est pas doté${accord} du discernement nécessaire.`;
    }
    return pl
      ? `Les enfants mineur${accord} ${noms}, âgé${accord} respectivement de ${ages(es)}, ont été informé${accord} par leurs parents de leur droit à être entendu${accord} par le juge dans les conditions prévues à l'article 388-1 du Code civil. ${fem ? "Elles" : "Ils"} ne souhaitent pas faire usage de cette faculté. La copie des formulaires d'information mentionnant leur droit à être entendu${accord} dans les conditions de l'article 388-1 du Code civil est annexée à la présente convention de divorce.`
      : `L’enfant mineur${accord} ${noms}, âgé${accord} de ${ages(es)}, a été informé${accord} par ses parents de son droit à être entendu${accord} par le juge dans les conditions prévues à l'article 388-1 du Code civil. ${fem ? "Elle" : "Il"} ne souhaite pas faire usage de cette faculté. La copie du formulaire d'information mentionnant son droit à être entendu${accord} dans les conditions de l'article 388-1 du Code civil est annexée à la présente convention de divorce.`;
  };

  return {
    valeurs: {
      InfoEnfantsSansDiscernement: phrase(sans, false),
      InfoEnfantsDiscernement: phrase(avec, true),
    } as Record<string, string | null>,
    alertes,
  };
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
