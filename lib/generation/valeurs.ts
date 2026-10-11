import { AVOCAT_PARTENAIRE, aDiscernement, questionDiscernement, CATEGORIES_ACTIFS, PLAFONDS, actifsDe, age, dateEffetsRetenue, dateLibreRetenable, debutCEERetenu, estFormalise, avocatRetenu, chargeCognito, estPartenaire, type Avocat, type Donnees } from "@/lib/renseignements/modele";
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

  /* Clause fiscale (art. 2.8) : chaque époux est imposé séparément pour toute
     l'année du divorce (CGI, art. 6, 6), déclarée l'année suivante. L'année du
     divorce est celle du dépôt chez le notaire, inconnue à la génération :
     estimée à la date de génération plus 45 jours (envoi du projet, délai de
     réflexion de quinze jours, signature, dépôt). Alerte en fin d'année. */
  const anneeDivorce = anneeDivorceEstimee(le);
  v.AnneeDivorce = anneeDivorce;
  v.AnneeDeclarationSeparee = anneeDivorce + 1;
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
  /* Par défaut, le vendredi à la sortie des classes (décision du 2026-10-11).
     HeureAlternance porte sa préposition : « à la sortie des classes », « à 19 heures ». */
  v.JourAlternance = d.jourAlternance || "vendredi";
  const heure = d.heureAlternance || "sortie des classes";
  v.HeureAlternance = { valeur: heure, texte: heure === "sortie des classes" ? "à la sortie des classes" : `à ${heure}` };

  /* Maintien du premier bien en indivision (DCM1AE 15.7, art. 2.5) : qui en a
     la jouissance, indemnité d'occupation, crédit, charges et taxe foncière. */
  const b1 = d.immobilier[0];
  const indiv = b1 && b1.qui === "maintien en indivision";
  const epoux = (x: string | undefined) =>
    x === "Moi" ? `${d.client.civilite} ${(d.client.nom || "").trim().toUpperCase()}`
    : x === "Mon époux(se)" ? `${d.conjoint.civilite} ${(d.conjoint.nom || "").trim().toUpperCase()}`
    : x === "Par moitié" ? "les deux époux, par moitié"
    : "[À COMPLÉTER]";
  const indemnite = indiv ? nombre(b1.indemniteOccupation || "") : null;
  v.ImmoJouissance1 = indiv ? epoux(b1.jouissance) : null;
  v.ImmoIndemnite1 = indemnite ? { valeur: indemnite, texte: montant(indemnite) } : null;
  v.ImmoCreditQui1 = indiv ? epoux(b1.creditQui) : null;
  v.ImmoChargesQui1 = indiv ? epoux(b1.chargesQui) : null;

  /* Allocations familiales en résidence alternée (DCM1AE 15.6, art. 3.6) :
     « Moi » ou « Mon époux(se) » désigne l'allocataire ; sinon le modèle
     imprime la demande conjointe de partage par moitié. */
  v.AllocationsFamiliales = d.allocationsFamiliales || null;

  /* Date des effets entre les époux (DCM1AE 15.6, art. 2.7) : "Dépôt" à
     défaut de choix ; DateSeparation en toutes lettres pour la variante
     « Séparation » ; DebutCEE, point de départ de la contribution. */
  v.DateEffets = dateEffetsRetenue(d, le);
  const enDate = (iso: string | undefined) => (/^\d{4}-\d{2}-\d{2}$/.test(iso || "") ? { valeur: iso as string, texte: dateLongue(iso as string) } : null);
  v.DateSeparation = enDate(d.logement.dateSeparation);
  v.DateEffetsLibre = v.DateEffets === "Libre" ? enDate(d.dateEffetsLibre) : null;
  v.DebutCEE = debutCEERetenu(d, le);
  v.DebutCEELibre = v.DebutCEE === "Libre" ? enDate(d.debutCEELibre) : null;

  /* Régime inconnu des époux : le régime légal, sous réserve de vérification
     (contrat de mariage, loi applicable) signalée au rapport. */
  v.RégimeMatrimonial = regimeConvention(d) || null;

  /* Comptes : partage déclaré déjà fait (« Verbal ») ou formalisé dans la
     convention (« Formalise »), avec état liquidatif chiffré. */
  v.PartageComptes = estFormalise(d) ? "Formalise" : d.partageComptes ? "Verbal" : null;

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

  /* Bordereau des pièces : formulaires d'information annexés, un par enfant
     mineur de 12 à 17 ans parmi les quatre que le modèle sait décrire
     (DCM1AE 15.3, mêmes bornes que les formulaires). */
  const informes = d.enfants.slice(0, 4).filter((e) => aDiscernement(e, le));
  /* FormulaireE{n} : formulaire d'information de l'enfant n annexé (DCM1AE 15.7). */
  for (let n = 1; n <= 4; n++) {
    const e = d.enfants[n - 1];
    v[`FormulaireE${n}`] = e && aDiscernement(e, le) ? "Oui" : "Non";
  }
  const prenoms = enumerer(informes.map((e) => (e.prenoms || "").trim().replace(/\s+/g, " ")));
  v.AnnexeFormulaires = !informes.length
    ? null
    : informes.length === 1
      ? `Formulaire d’information de l’enfant mineur ${prenoms}`
      : `Formulaires d’information des enfants mineurs ${prenoms}`;

  /* Crédits communs (DCM1AE 15.3) : qui supportera chacun, d'après la réponse
     du formulaire ; montants et date de dernière échéance non saisis signalés
     dans l'acte plutôt que laissés en blanc. */
  d.credits.slice(0, 6).forEach((c, i) => {
    const s = i === 0 ? "" : String(i + 1);
    const seul = (p: typeof d.client) => `par ${p.civilite} ${(p.nom || "").trim().toUpperCase()} seul${p.civilite === "Madame" ? "e" : ""}`;
    v[`CreditSupporte${s}`] =
      c.qui === "50/50" ? "par moitié par chacun des époux"
      : c.qui === "Moi" ? seul(d.client)
      : c.qui === "Conjoint(e)" ? seul(d.conjoint)
      : "[RÉPARTITION À COMPLÉTER]";
    for (const k of ["TotalEmprunté", "Mensualite", "RestantDû", "DateDernièreÉchéance"]) {
      if (v[`${k}${s}`] === null || v[`${k}${s}`] === undefined || v[`${k}${s}`] === "") v[`${k}${s}`] = "[À COMPLÉTER]";
    }
  });
  for (let n = d.credits.length + 1; n <= 6; n++) v[`CreditSupporte${n === 1 ? "" : n}`] = null;

  Object.assign(v, valeursActifs(d));
  Object.assign(v, liquidation(d).valeurs);

  /* Mention finale « Fait en … exemplaires » : trois, plus un pour la CAF si
     l'intermédiation financière est mise en place (le modèle la refuse
     aujourd'hui : « Non »), plus un pour l'administration fiscale quand la
     convention liquide elle-même le régime (partage formalisé, sans bien
     immobilier, donc droit de partage). */
  v.Intermediation = "Non";
  v.LiquidationNonNotariee = estFormalise(d) && !d.immobilier.length && actifsDe(d).length > 0 ? "Oui" : "Non";
  const exemplaires = 3 + (v.Intermediation === "Oui" ? 1 : 0) + (v.LiquidationNonNotariee === "Oui" ? 1 : 0);
  v.NbExemplaires = { valeur: exemplaires, texte: enLettres(exemplaires) };

  /* Nombre de crédits communs en lettres (« deux crédits à la consommation ») ;
     la valeur reste le nombre pour les conditions. */
  if (typeof v.CréditsCommuns === "number") v.CréditsCommuns = { valeur: v.CréditsCommuns, texte: enLettres(v.CréditsCommuns) };

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
     un autre avocat, la ligne disparaît du modèle. Avocat extérieur dont le
     nom n'est pas encore connu : mention à compléter, signalée au rapport. */
  const av: Avocat = avocatRetenu(d) ?? { ...AVOCAT_PARTENAIRE, id: "", prenom: "", nom: "[AVOCAT DU CONJOINT À COMPLÉTER]", barreau: "", adresse: "", cp: "", ville: "", email: "" };
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

function anneeDivorceEstimee(le: Date): number {
  return new Date(le.getTime() + 45 * 86_400_000).getFullYear();
}

/* Points à vérifier, repris dans le rapport de génération. */
export function alertesConvention(d: Donnees, le: Date = new Date()): string[] {
  const a = [...analyserExtraneite(d).alertes, ...informationEnfants(d, le).alertes, ...sansContribution(d).alertes];
  d.credits.slice(0, 6).forEach((c, i) => {
    const vides = [
      [c.totalEmprunte, "montant total"], [c.mensualite, "mensualité"], [c.restantDu, "restant dû"], [c.derniereEcheance, "dernière échéance"],
    ].filter(([x]) => !(x || "").trim()).map(([, l]) => l);
    if (!["50/50", "Moi", "Conjoint(e)"].includes(c.qui)) vides.push("répartition");
    if (vides.length) a.push(`Crédit n° ${i + 1} (${(c.banque || "").trim() || "banque non renseignée"}) : ${vides.join(", ")} à compléter dans l'acte.`);
  });
  if (d.impotsSepares !== "Oui" && le.getMonth() >= 10)
    a.push(
      `Clause fiscale : divorce supposé déposé en ${anneeDivorceEstimee(le)}, déclarations séparées en ${anneeDivorceEstimee(le) + 1}. À corriger si le dépôt chez le notaire intervient l'autre année.`,
    );
  if (d.mariage.regime === "ne sait pas")
    a.unshift(
      "Régime matrimonial inconnu des époux : la convention retient la communauté de biens réduite aux acquêts (régime légal, art. 1400 C. civ.). Vérifier l'absence de contrat de mariage et, en cas de mariage célébré ou de première résidence à l'étranger, la loi applicable au régime.",
    );
  const effets = dateEffetsRetenue(d, le);
  if (d.procedure === "Divorce" && d.dateEffets === "Séparation" && effets === "Dépôt")
    a.push("Date des effets « Séparation » choisie, mais date de séparation absente ou à venir : règle légale (dépôt chez le notaire) appliquée.");
  if (d.procedure === "Divorce" && d.dateEffets === "Libre" && effets === "Dépôt")
    a.push("Date des effets « Autre date » choisie, mais date absente ou à venir : règle légale (dépôt chez le notaire) appliquée.");
  if (d.procedure === "Divorce" && d.dateEffets === "Signature")
    a.push("Date des effets « Signature » (option retirée) : règle légale (dépôt chez le notaire) appliquée, à revoir avec les époux.");
  if (effets !== "Dépôt") {
    a.push(
      "Date des effets avancée : vérifier l'indemnité d'occupation (art. 815-9) et l'absence d'acte commun postérieur à la date retenue ; l'état liquidatif doit être arrêté à cette date.",
    );
    if (regimeConvention(d) === "séparation des biens")
      a.push("Régime de séparation de biens : la phrase sur les biens et revenus devenus personnels n'a d'objet qu'en régime communautaire, à retirer de la clause.");
  }
  if (d.enfants.some((e) => e.garde === "Alternée") && (d.heureAlternance || "sortie des classes") === "sortie des classes" && ["samedi", "dimanche"].includes(d.jourAlternance))
    a.push(`Alternance le ${d.jourAlternance} « à la sortie des classes » : jour sans classe, heure à préciser.`);
  if (!avocatRetenu(d)) a.unshift("Avocat du conjoint extérieur, nom pas encore connu : mention « [AVOCAT DU CONJOINT À COMPLÉTER] » à remplacer dans l'acte.");
  /* Partage formalisé : les attributions manquantes sont signalées par la liquidation. */
  if (!estFormalise(d)) actifsDe(d).slice(0, PLAFONDS.actifs).forEach((x, i) => {
    if (!["Moi", "Mon époux(se)", "Partage par moitié"].includes(x.qui))
      a.push(`Compte ou placement n° ${i + 1} (${x.categorie || "nature non renseignée"}) : attribution à compléter dans l'acte.`);
  });
  a.push(...liquidation(d).alertes);
  if (!d.immobilier.length && !actifsDe(d).length)
    a.push("Aucun bien immobilier ni compte ou placement déclaré : inventaire à vérifier avec les époux (articles 2.5 et 2.9 du modèle).");
  if (d.procedure !== "Séparation de corps" && !(d.pc.convenue || "").trim())
    a.unshift("Prestation compensatoire non renseignée dans le formulaire : clause « pas de prestation compensatoire » insérée par défaut, à vérifier.");
  return a;
}

/* ---------- Comptes, épargne et placements ---------- */

/* Inventaire saisi au formulaire, pour les articles 2.5 et 2.9 du modèle
 * DCM1AE (la clause elle-même reste à rédiger dans le modèle Word). Chaque
 * champ porte un code court pour les conditions ({if (ActifTitulaire1 =
 * "Joint")}) et un texte prêt pour l'acte :
 *
 *   NbActifs                   nombre (texte en lettres)
 *   ActifsDeclares             "Oui" / "Non"
 *   ActifsJoints               nombre d'actifs joints (texte en lettres)
 *   ActifCategorie{n}          Compte, Titres, AssuranceVie, EpargneSalariale, Autre
 *   ActifAccord{n}             "e" pour une catégorie au féminin (« une épargne… ouverte »)
 *   ActifTitulaire{n}          Client, Conjoint, Joint ; « Madame X », « les deux époux »
 *   ActifEtablissement{n}      texte saisi
 *   ActifValeur{n}             montant à la française
 *   ActifOrigine{n}            Avant, Pendant ; « avant le mariage »…
 *   ActifConservePar{n}        Client, Conjoint, Moitie, vide ; « par Madame X »…
 *   ListeActifs                énumération de tous les actifs, séparés par « ; »
 *
 * n va de 1 à PLAFONDS.actifs ; les rangs absents valent null. */
const CODES_ACTIFS = ["Compte", "Titres", "AssuranceVie", "EpargneSalariale", "Autre"];
const TEXTES_ACTIFS = [
  "un compte bancaire ou livret",
  "un compte-titres, PEA ou des parts sociales",
  "un contrat d’assurance-vie",
  "une épargne salariale ou retraite",
  "un autre actif",
];

export function valeursActifs(d: Donnees): Valeurs {
  const v: Valeurs = {};
  const actifs = actifsDe(d).slice(0, PLAFONDS.actifs);
  const nom = (p: typeof d.client) => `${p.civilite} ${(p.nom || "").trim().toUpperCase()}`.trim();
  type Code = { valeur: string; texte: string };
  const qui = (x: string, client: string, conjoint: string, autres: Record<string, Code>): Code =>
    x === "Moi"
      ? { valeur: "Client", texte: client }
      : x === "Mon époux(se)"
        ? { valeur: "Conjoint", texte: conjoint }
        : autres[x] || { valeur: "", texte: "[À COMPLÉTER]" };
  const morceaux: string[] = [];
  actifs.forEach((a, i) => {
    const n = i + 1;
    const k = (CATEGORIES_ACTIFS as readonly string[]).indexOf(a.categorie);
    const categorie = k < 0 ? null : { valeur: CODES_ACTIFS[k], texte: TEXTES_ACTIFS[k] };
    const titulaire = a.titulaire
      ? qui(a.titulaire, nom(d.client), nom(d.conjoint), { Joint: { valeur: "Joint", texte: "les deux époux" } })
      : null;
    const somme = nombre(a.valeur);
    const valeur = somme === null ? null : { valeur: somme, texte: montant(somme) };
    const origine =
      a.origine === "Avant le mariage" ? { valeur: "Avant", texte: "avant le mariage" }
      : a.origine === "Pendant le mariage" ? { valeur: "Pendant", texte: "pendant le mariage" }
      : null;
    const conserve = qui(a.qui, `par ${nom(d.client)}`, `par ${nom(d.conjoint)}`, {
      "Partage par moitié": { valeur: "Moitie", texte: "partagé par moitié entre les époux" },
    });
    const etablissement = (a.etablissement || "").trim();
    v[`ActifCategorie${n}`] = categorie;
    v[`ActifAccord${n}`] = categorie && categorie.texte.startsWith("une ") ? "e" : "";
    v[`ActifTitulaire${n}`] = titulaire;
    v[`ActifEtablissement${n}`] = etablissement || null;
    v[`ActifValeur${n}`] = valeur;
    v[`ActifOrigine${n}`] = origine;
    v[`ActifConservePar${n}`] = conserve;
    /* « une épargne salariale … ouverte, conservée » ; « auprès d’AXA ». */
    const e = categorie && categorie.texte.startsWith("une ") ? "e" : "";
    const de = (x: string) => (/^[aeiouyhàâéèêëîïôöûü]/i.test(x) ? `d’${x}` : `de ${x}`);
    morceaux.push(
      [
        categorie ? categorie.texte : "un actif de nature non renseignée",
        etablissement && `auprès ${de(etablissement)}`,
        titulaire && (titulaire.valeur === "Joint" ? "au nom des deux époux" : `au nom ${de(titulaire.texte)}`),
        valeur && `d’une valeur approximative de ${valeur.texte} Euros`,
        origine && `ouvert${e} ou acquis${e} ${origine.texte}`,
        conserve.valeur === "Moitie"
          ? `partagé${e} par moitié entre les époux`
          : conserve.valeur
            ? `conservé${e} ${conserve.texte}`
            : "attribution [À COMPLÉTER]",
      ]
        .filter(Boolean)
        .join(", "),
    );
  });
  for (let n = actifs.length + 1; n <= PLAFONDS.actifs; n++) {
    for (const c of ["ActifCategorie", "ActifAccord", "ActifTitulaire", "ActifEtablissement", "ActifValeur", "ActifOrigine", "ActifConservePar"]) v[`${c}${n}`] = null;
  }
  const joints = actifs.filter((a) => a.titulaire === "Joint").length;
  v.NbActifs = { valeur: actifs.length, texte: enLettres(actifs.length) };
  v.ActifsDeclares = actifs.length ? "Oui" : "Non";
  v.ActifsJoints = { valeur: joints, texte: enLettres(joints) };
  v.ListeActifs = morceaux.length ? morceaux.join(" ; ") : null;
  return v;
}

/* ---------- Liquidation : état liquidatif chiffré ---------- */

/* Régime retenu par la convention : le régime légal si les époux ne savent pas. */
export const regimeConvention = (d: Donnees) => (d.mariage.regime === "ne sait pas" ? "communauté de biens réduite aux acquêts" : d.mariage.regime);

const arrondi = (x: number) => Math.round(x * 100) / 100;

/* État liquidatif des comptes, placements, véhicules et crédits, sans bien
 * immobilier (sinon l'acte notarié). Communauté : masse commune (comptes
 * ouverts pendant le mariage ; avant le mariage, solde du jour moins solde au
 * mariage, présomption de communauté de l'art. 1402 à défaut). Séparation de
 * biens et participation aux acquêts : masse indivise (comptes joints,
 * véhicules et crédits communs), par moitié. Droits = moitié de l'actif net ;
 * soulte = droits − attributions nettes.
 *
 *   LiqCalcul          "Oui" si partage formalisé, sans immobilier, données complètes
 *   LiqMasseNature     "commune" / "indivise"
 *   LiqMasseActive, LiqMassePassive, LiqActifNet (valeur absolue), LiqNetPositif "Oui"/"Non"
 *   LiqDroits          droits de chacun (moitié de l'actif net, valeur absolue)
 *   LiqAttribClient, LiqAttribConjoint   attributions nettes (actif − passif pris en charge),
 *                      en valeur absolue ; LiqAttribClientPositif / LiqAttribConjointPositif "Oui"/"Non"
 *   LiqSoulte, LiqSoulteSens ("Aucune", "Client", "Conjoint" : celui qui la paie),
 *   LiqSoulteDebiteur, LiqSoulteCreancier   « Madame X »
 *   ActifCommun{n}     part du compte n entrant dans la masse ; ActifSoldeMariage{n}
 *
 * Participation aux acquêts (ébauche, comptes, véhicules et crédits seulement) :
 *   PartCalcul, PartOriginaireClient/Conjoint, PartFinalClient/Conjoint,
 *   PartAcquetsClient/Conjoint, PartCreance, PartCreanceSens (débiteur),
 *   PartCreanceDebiteur, PartCreanceCreancier. */
export function liquidation(d: Donnees) {
  const v: Valeurs = {};
  const alertes: string[] = [];
  const regime = regimeConvention(d);
  const communaute = regime === "communauté de biens réduite aux acquêts" || regime === "communauté universelle";
  const participation = regime === "participation aux acquêts";
  const formalise = estFormalise(d);
  const actifs = actifsDe(d).slice(0, PLAFONDS.actifs);
  const m = (x: number) => ({ valeur: arrondi(x), texte: montant(arrondi(x)) });
  const nom = (p: typeof d.client) => `${p.civilite} ${(p.nom || "").trim().toUpperCase()}`.trim();
  const signaler = formalise || participation;
  let complet = true;
  const manque = (t: string) => {
    complet = false;
    if (signaler) alertes.push(t);
  };
  const avecConjoint = (qui: string) => qui === "Mon époux(se)" || qui === "Mon époux (se)";

  let active = 0;
  let passive = 0;
  const attrib = { client: 0, conjoint: 0 };
  const attribuer = (qui: string, x: number, libelle: string) => {
    if (qui === "Moi") attrib.client += x;
    else if (avecConjoint(qui)) attrib.conjoint += x;
    else if (qui === "Partage par moitié") {
      attrib.client += x / 2;
      attrib.conjoint += x / 2;
    } else manque(`${libelle} : attribution à préciser pour l'état liquidatif.`);
  };

  /* Participation : patrimoines originaire et final de chacun. */
  const orig = { client: 0, conjoint: 0 };
  const fin = { client: 0, conjoint: 0 };
  const repartir = (cible: { client: number; conjoint: number }, titulaire: string, x: number) => {
    if (titulaire === "Moi") cible.client += x;
    else if (avecConjoint(titulaire)) cible.conjoint += x;
    else {
      cible.client += x / 2;
      cible.conjoint += x / 2;
    }
  };

  actifs.forEach((a, i) => {
    const n = i + 1;
    const val = nombre(a.valeur);
    const avant = a.origine === "Avant le mariage";
    const sm = nombre(a.soldeMariage || "");
    v[`ActifSoldeMariage${n}`] = avant && regime !== "séparation des biens" && sm !== null ? m(sm) : null;
    let part: number | null = null;
    if (val === null) manque(`Compte ou placement n° ${n} : solde non renseigné, état liquidatif incomplet.`);
    else if (communaute) {
      if (regime === "communauté universelle" || !avant) part = val;
      else if (sm === null) {
        part = val;
        if (signaler) alertes.push(`Compte ou placement n° ${n} ouvert avant le mariage, solde au mariage inconnu : totalité présumée commune (art. 1402 C. civ.), à vérifier.`);
      } else part = Math.max(val - sm, 0);
    } else part = a.titulaire === "Joint" ? val : 0;
    v[`ActifCommun${n}`] = part === null ? null : m(part);
    if (part) {
      active += part;
      attribuer(a.qui, part, `Compte ou placement n° ${n}`);
    }
    if (participation && val !== null) {
      repartir(fin, a.titulaire, val);
      if (avant) {
        if (sm === null) manque(`Compte ou placement n° ${n} : solde au mariage manquant pour le patrimoine originaire.`);
        else repartir(orig, a.titulaire, sm);
      }
    }
  });
  for (let n = actifs.length + 1; n <= PLAFONDS.actifs; n++) {
    v[`ActifSoldeMariage${n}`] = null;
    v[`ActifCommun${n}`] = null;
  }

  d.vehicules.slice(0, 3).forEach((x, i) => {
    const val = nombre(x.valeur);
    if (val === null) return manque(`Véhicule n° ${i + 1} : valeur non renseignée, état liquidatif incomplet.`);
    if (participation) repartir(fin, "Joint", val);
    if (x.qui === "en vente") return manque(`Véhicule n° ${i + 1} en vente : prix à partager, hors état liquidatif.`);
    active += val;
    attribuer(x.qui, val, `Véhicule n° ${i + 1}`);
  });

  d.credits.slice(0, 6).forEach((c, i) => {
    const r = nombre(c.restantDu);
    if (r === null) return manque(`Crédit n° ${i + 1} : restant dû non renseigné, état liquidatif incomplet.`);
    passive += r;
    if (participation) repartir(fin, "Joint", -r);
    if (c.qui === "50/50") {
      attrib.client -= r / 2;
      attrib.conjoint -= r / 2;
    } else if (c.qui === "Moi") attrib.client -= r;
    else if (c.qui === "Conjoint(e)") attrib.conjoint -= r;
    else manque(`Crédit n° ${i + 1} : répartition à préciser pour l'état liquidatif.`);
  });

  const net = active - passive;
  const droits = net / 2;
  const soulte = arrondi(droits - attrib.client);
  const sens = Math.abs(soulte) < 0.01 ? "Aucune" : soulte > 0 ? "Conjoint" : "Client";
  const calcul = formalise && complet && !d.immobilier.length && actifs.length > 0;
  v.LiqCalcul = calcul ? "Oui" : "Non";
  v.LiqMasseNature = communaute ? "commune" : "indivise";
  v.LiqMasseActive = m(active);
  v.LiqMassePassive = m(passive);
  v.LiqActifNet = m(Math.abs(net));
  v.LiqNetPositif = net >= 0 ? "Oui" : "Non";
  v.LiqDroits = m(Math.abs(droits));
  v.LiqAttribClient = m(Math.abs(attrib.client));
  v.LiqAttribConjoint = m(Math.abs(attrib.conjoint));
  v.LiqAttribClientPositif = attrib.client >= 0 ? "Oui" : "Non";
  v.LiqAttribConjointPositif = attrib.conjoint >= 0 ? "Oui" : "Non";
  v.LiqSoulte = m(Math.abs(soulte));
  v.LiqSoulteSens = sens;
  v.LiqSoulteDebiteur = sens === "Conjoint" ? nom(d.conjoint) : sens === "Client" ? nom(d.client) : null;
  v.LiqSoulteCreancier = sens === "Conjoint" ? nom(d.client) : sens === "Client" ? nom(d.conjoint) : null;
  if (formalise && d.immobilier.length)
    alertes.push("Partage formalisé avec bien immobilier : l'état liquidatif relève de l'acte notarié, aucun calcul dans la convention.");
  if (calcul)
    alertes.push(
      "État liquidatif calculé : vérifier les soldes à la date retenue, l'absence de récompense et de créance entre époux, et les modalités de paiement de la soulte.",
    );

  const acq = { client: Math.max(fin.client - orig.client, 0), conjoint: Math.max(fin.conjoint - orig.conjoint, 0) };
  const creance = arrondi(Math.abs(acq.client - acq.conjoint) / 2);
  const debiteur = creance < 0.01 ? "Aucune" : acq.client > acq.conjoint ? "Client" : "Conjoint";
  const part = participation && complet && !d.immobilier.length && actifs.length > 0;
  v.PartCalcul = part ? "Oui" : "Non";
  v.PartOriginaireClient = m(orig.client);
  v.PartOriginaireConjoint = m(orig.conjoint);
  v.PartFinalClient = m(fin.client);
  v.PartFinalConjoint = m(fin.conjoint);
  v.PartAcquetsClient = m(acq.client);
  v.PartAcquetsConjoint = m(acq.conjoint);
  v.PartCreance = m(creance);
  v.PartCreanceSens = debiteur;
  v.PartCreanceDebiteur = debiteur === "Client" ? nom(d.client) : debiteur === "Conjoint" ? nom(d.conjoint) : null;
  v.PartCreanceCreancier = debiteur === "Client" ? nom(d.conjoint) : debiteur === "Conjoint" ? nom(d.client) : null;
  if (participation)
    alertes.push(
      "Participation aux acquêts : ébauche de créance de participation établie sur les seuls comptes, placements, véhicules et crédits déclarés. Restent à intégrer : biens personnels hors comptes (immobilier, parts sociales, fonds de commerce), biens reçus par donation ou succession (patrimoine originaire, art. 1570 et suivants C. civ.), dettes personnelles, et vérification des estimations.",
    );

  return { valeurs: v, alertes };
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

/* Discernement : présumé de 12 à 17 ans ; de 10 à 11 ans, selon la réponse
   des parents au formulaire ; jamais avant 10 ans (aDiscernement, modele.ts). */

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
    if (questionDiscernement(e, le) && e.discernement !== "Oui" && e.discernement !== "Non")
      alertes.push(`Enfant ${prenom} (${ans} ans) : discernement non renseigné, traité comme non capable de discernement. À vérifier avec les parents.`);
    (aDiscernement(e, le) ? avec : sans).push({ prenom, feminin: e.sexe === "Féminin", age: texte });
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
