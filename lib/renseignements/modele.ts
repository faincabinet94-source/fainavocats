/* Formulaire de renseignements commun (divorce et séparation de corps).
 *
 * Remplace les formulaires Cognito n° 3, 13 et 14. Les libellés des listes
 * reprennent EXACTEMENT les valeurs de Cognito : l'automatisation Airtable
 * « Cognito -> AirTable » (base Clients) les reçoit telles quelles, et la
 * future génération des actes s'appuiera dessus. Ne pas les reformuler.
 * Voir le coffre : 50 - Projets/Génération documentaire/formulaire-renseignements-commun.md
 */

export const VERSION = "site v1";

export const PROCEDURES = ["Divorce", "Séparation de corps"] as const;
export const CIVILITES = ["Madame", "Monsieur"] as const;
export const OUI_NON = ["Oui", "Non"] as const;
export const DISTANCES = ["Commencer à distance", "Rendez-vous physique"] as const;
export const REGIMES = [
  "communauté de biens réduite aux acquêts",
  "séparation des biens",
  "participation aux acquêts",
  "communauté universelle",
  "ne sait pas",
] as const;
export const DOMICILES = ["Moi", "Mon conjoint", "Nous avons donné congé*", "En vente"] as const;
export const DELAIS = ["15 jours", "1 mois", "2 mois", "3 mois", "6 mois"] as const;
export const SEXES = ["Féminin", "Masculin"] as const;
export const GARDES = [
  "Moi",
  "Mon époux(se)",
  "Alternée",
  "Majeur à charge",
  "Majeur plus à charge",
  "Autre",
] as const;
/* Statut du logement occupé à l'adresse indiquée. « en commun » pour un régime
   communautaire, « indivis » pour un régime séparatiste (voir statutsLogement). */
export const STATUTS_LOGEMENT = [
  "Location",
  "Hébergement",
  "Propriétaire en commun",
  "Propriétaire indivis",
  "Propriétaire à titre personnel",
] as const;
export const JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"] as const;

/* Propriété en commun proposée sans contrat de mariage (communauté légale) ou
   en communauté universelle, propriété indivise en séparation de biens ou
   participation aux acquêts ; les deux si le régime n'est pas connu. */
export function statutsLogement(regime: string): string[] {
  const separatiste = regime === "séparation des biens" || regime === "participation aux acquêts";
  const communautaire = regime === "communauté de biens réduite aux acquêts" || regime === "communauté universelle";
  return STATUTS_LOGEMENT.filter(
    (s) => !(s === "Propriétaire en commun" && separatiste) && !(s === "Propriétaire indivis" && communautaire),
  );
}

export const QUI_IMMO = ["Moi", "Mon époux (se)", "en vente", "maintien en indivision"] as const;
export const QUI_VEHICULE = ["Moi", "Mon époux (se)", "en vente"] as const;
export const QUI_CREDIT = ["50/50", "Moi", "Conjoint(e)", "Autre"] as const;
export const BENEFICIAIRES = ["Moi", "Mon époux(se)"] as const;
export const FORMES_PC = ["Capital", "Abandon de soulte", "Rente mensuelle", "Rente viagère"] as const;
export const REPARTITIONS = [
  "Partage par moitié",
  "Je les prendrai à ma charge",
  "Mon conjoint les prendra à charge",
  "Assurance juridique",
  "Je ne sais pas encore",
] as const;
/* Honoraires partagés : la provision de 250 € est soit partagée, soit avancée
   en entier par l'époux qui remplit le formulaire, pour lancer la procédure
   sans attendre le règlement de l'autre. */
export const PROVISIONS_PARTAGE = [
  "Nous la partageons (125 € chacun)",
  "Je l'avance en entier (250 €)",
] as const;
export const CATEGORIES_PIECES = [
  "Livret de famille",
  "Acte d'état civil",
  "Pièce d'identité",
  "Autre pièce",
] as const;

export type Personne = {
  civilite: string;
  nom: string;
  prenoms: string;
  dateNaissance: string;
  lieuNaissance: string;
  nationalite: string;
  adresse: string;
  cp: string;
  ville: string;
  profession: string;
  revenus: string;
  revenusAnnuels: string;
  statutLogement: string;
  email: string;
  telephone: string;
};

export type Enfant = {
  prenoms: string;
  sexe: string;
  dateNaissance: string;
  lieuNaissance: string;
  garde: string;
  pension: string;
  profession: string;
  adresse: string;
};

export type Bien = { adresse: string; valeur: string; creditRestant: string; qui: string };
export type Vehicule = { marque: string; modele: string; immatriculation: string; valeur: string; qui: string };
export type Credit = {
  banque: string;
  totalEmprunte: string;
  restantDu: string;
  mensualite: string;
  derniereEcheance: string;
  qui: string;
};
/* Avocat du conjoint. Par défaut le confrère partenaire ; en version cabinet,
   un autre avocat de la table « 👔Pro » d'Airtable (id renseigné) ou un
   nouvel avocat saisi à la main (id vide, créé dans Airtable à l'envoi). */
export type Avocat = {
  id: string;
  civilite: string;
  prenom: string;
  nom: string;
  barreau: string;
  adresse: string;
  cp: string;
  ville: string;
  email: string;
  telephone: string;
};
export const AVOCAT_PARTENAIRE: Avocat = {
  id: "recWfzDbvlHzPcemk",
  civilite: "Madame",
  prenom: "Jeanne",
  nom: "TRAN",
  barreau: "Paris",
  adresse: "10 rue Emilio Castelar",
  cp: "75012",
  ville: "PARIS",
  email: "jt@tran-avocats.fr",
  telephone: "",
};
export const avocatVide = (): Avocat => ({
  id: "", civilite: "", prenom: "", nom: "", barreau: "", adresse: "", cp: "", ville: "", email: "", telephone: "",
});
export const estPartenaire = (a: Avocat) => a.id === AVOCAT_PARTENAIRE.id;

export const texteAvocat = (a: Avocat) =>
  [
    ["Maître", a.prenom, (a.nom || "").trim().toUpperCase()].filter(Boolean).join(" "),
    a.barreau && `Barreau de ${a.barreau}`,
    [a.adresse, [a.cp, a.ville].filter(Boolean).join(" ")].filter(Boolean).join(", "),
    a.email,
    a.id ? "" : "(nouvel avocat, créé dans Airtable à l'envoi)",
  ]
    .filter(Boolean)
    .join(", ");

export type Piece = { id: string; nom: string; type: string; taille: number; categorie: string };

export type Donnees = {
  procedure: string;
  distance: string;
  dejaClient: string;
  client: Personne;
  conjoint: Personne;
  mariage: {
    date: string;
    lieu: string;
    regime: string;
    contrat: string;
    notaire: string;
    villeNotaire: string;
    dateContrat: string;
  };
  logement: { separes: string; dateSeparation: string; domicile: string; delai: string };
  nomFamilleEnfants: string;
  jourAlternance: string;
  avocatConjoint: Avocat;
  enfants: Enfant[];
  immobilier: Bien[];
  vehicules: Vehicule[];
  credits: Credit[];
  arrieresLoyers: string;
  montantArrieresLoyers: string;
  arrieresImpots: string;
  montantArrieresImpots: string;
  impotsSepares: string;
  /* accordMontant : les époux sont-ils d'accord sur le montant (décision de
     Me FAIN du 2026-10-03) ; le montant n'est demandé qu'en cas d'accord. */
  pc: { convenue: string; beneficiaire: string; forme: string; accordMontant?: string; montant: string };
  ds: { convenu: string; beneficiaire: string; montant: string };
  nomUsage: { utilise: string; conserve: string };
  repartition: string;
  provisionPartage: string;
  commentaires: string;
  pieces: Piece[];
};

const personneVide = (): Personne => ({
  civilite: "",
  nom: "",
  prenoms: "",
  dateNaissance: "",
  lieuNaissance: "",
  nationalite: "",
  adresse: "",
  cp: "",
  ville: "",
  profession: "",
  revenus: "",
  revenusAnnuels: "",
  statutLogement: "",
  email: "",
  telephone: "",
});

export const enfantVide = (): Enfant => ({
  prenoms: "",
  sexe: "",
  dateNaissance: "",
  lieuNaissance: "",
  garde: "",
  pension: "",
  profession: "",
  adresse: "",
});
export const bienVide = (): Bien => ({ adresse: "", valeur: "", creditRestant: "", qui: "" });
export const vehiculeVide = (): Vehicule => ({ marque: "", modele: "", immatriculation: "", valeur: "", qui: "" });
export const creditVide = (): Credit => ({
  banque: "",
  totalEmprunte: "",
  restantDu: "",
  mensualite: "",
  derniereEcheance: "",
  qui: "",
});

export const donneesVides = (procedure = "Divorce"): Donnees => ({
  procedure,
  distance: "",
  dejaClient: "",
  client: personneVide(),
  conjoint: personneVide(),
  mariage: { date: "", lieu: "", regime: "", contrat: "", notaire: "", villeNotaire: "", dateContrat: "" },
  logement: { separes: "", dateSeparation: "", domicile: "", delai: "" },
  nomFamilleEnfants: "",
  jourAlternance: "",
  avocatConjoint: { ...AVOCAT_PARTENAIRE },
  enfants: [],
  immobilier: [],
  vehicules: [],
  credits: [],
  arrieresLoyers: "",
  montantArrieresLoyers: "",
  arrieresImpots: "",
  montantArrieresImpots: "",
  impotsSepares: "",
  pc: { convenue: "", beneficiaire: "", forme: "", accordMontant: "", montant: "" },
  ds: { convenu: "", beneficiaire: "", montant: "" },
  nomUsage: { utilise: "", conserve: "" },
  repartition: "",
  provisionPartage: "",
  commentaires: "",
  pieces: [],
});

/* Saisie enregistrée avant l'ajout d'un champ (reprise d'un brouillon) :
   complétée champ par champ, pour que chaque zone de saisie ait une valeur. */
export function completer(x: Partial<Donnees>): Donnees {
  const v = donneesVides(x.procedure || "Divorce");
  return {
    ...v,
    ...x,
    client: { ...v.client, ...(x.client || {}) },
    conjoint: { ...v.conjoint, ...(x.conjoint || {}) },
    mariage: { ...v.mariage, ...(x.mariage || {}) },
    logement: { ...v.logement, ...(x.logement || {}) },
    pc: { ...v.pc, ...(x.pc || {}) },
    ds: { ...v.ds, ...(x.ds || {}) },
    nomUsage: { ...v.nomUsage, ...(x.nomUsage || {}) },
    avocatConjoint: { ...v.avocatConjoint, ...(x.avocatConjoint || {}) },
    enfants: (x.enfants || []).map((e) => ({ ...enfantVide(), ...e })),
  } as Donnees;
}

/* Au-delà, les modèles de convention actuels ne suivent plus (voir la fiche
   modele-convention-dcm-cognito : le 5e enfant est complété à la main). */
export const PLAFONDS = { enfants: 5, immobilier: 3, vehicules: 3, credits: 6 };

export const COURRIEL_VALIDE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Âge en années révolues à une date donnée (aujourd'hui par défaut). */
export function age(dateIso: string, le: Date = new Date()): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateIso || "");
  if (!m) return null;
  const n = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  let a = le.getFullYear() - n.getFullYear();
  const avant = le.getMonth() < n.getMonth() || (le.getMonth() === n.getMonth() && le.getDate() < n.getDate());
  if (avant) a -= 1;
  return a;
}

export const estMajeur = (e: Enfant) => {
  const a = age(e.dateNaissance);
  return a !== null && a >= 18;
};

export type Manque = { etape: number; champ: string; libelle: string };

/* Champs obligatoires, repris des formulaires Cognito : n° 3 (divorce) et
   n° 13 (séparation de corps) pour la version client, n° 14 pour la version
   cabinet, plus légère parce que remplie pendant le rendez-vous. Les champs
   conditionnels suivent les mêmes conditions que dans Cognito. */
/* Version cabinet : les libellés parlent « du client » et « du conjoint »
   plutôt qu'au client lui-même. */
const CABINET: [RegExp, string][] = [
  [/^votre civilité$/, "la civilité du client"],
  [/^votre nom$/, "le nom du client"],
  [/^vos prénoms$/, "les prénoms du client"],
  [/^votre date de naissance$/, "la date de naissance du client"],
  [/^votre lieu de naissance$/, "le lieu de naissance du client"],
  [/^votre nationalité$/, "la nationalité du client"],
  [/^votre profession$/, "la profession du client"],
  [/^votre courriel$/, "le courriel du client"],
  [/^votre téléphone$/, "le téléphone du client"],
  [/^vos revenus$/, "les revenus du client"],
  [/^votre adresse$/, "l'adresse du client"],
  [/^votre code postal$/, "le code postal du client"],
  [/^votre ville$/, "la ville du client"],
  [/^un courriel valide$/, "un courriel valide pour le client"],
  [/^si vous vivez déjà séparément$/, "si les époux vivent déjà séparément"],
  [/ de votre conjoint/g, " du conjoint"],
  [/ pour votre conjoint/g, " pour le conjoint"],
];
const pourCabinet = (m: Manque[]): Manque[] =>
  m.map((x) => ({ ...x, libelle: CABINET.reduce((l, [re, par]) => l.replace(re, par), x.libelle) }));

export function manquants(d: Donnees, interne: boolean): Manque[] {
  const m = manquantsBruts(d, interne);
  return interne ? pourCabinet(m) : m;
}

function manquantsBruts(d: Donnees, interne: boolean): Manque[] {
  const m: Manque[] = [];
  const v = (x: string | undefined) => !x || !x.trim();
  const exiger = (etape: number, champ: string, valeur: string | undefined, libelle: string) => {
    if (v(valeur)) m.push({ etape, champ, libelle });
  };
  const divorce = d.procedure !== "Séparation de corps";

  exiger(0, "procedure", d.procedure, "la procédure");
  for (const [qui, etape] of [["client", 1], ["conjoint", 2]] as const) {
    const x = d[qui];
    /* « votre nationalité » ou « la nationalité de votre conjoint » */
    const de = (article: string, l: string) => (qui === "client" ? `votre ${l}` : `${article}${l} de votre conjoint`);
    exiger(etape, `${qui}.civilite`, x.civilite, de("la ", "civilité"));
    exiger(etape, `${qui}.nom`, x.nom, de("le ", "nom"));
    exiger(etape, `${qui}.prenoms`, x.prenoms, qui === "client" ? "vos prénoms" : "les prénoms de votre conjoint");
    if (!interne) {
      exiger(etape, `${qui}.dateNaissance`, x.dateNaissance, de("la ", "date de naissance"));
      exiger(etape, `${qui}.lieuNaissance`, x.lieuNaissance, de("le ", "lieu de naissance"));
      exiger(etape, `${qui}.nationalite`, x.nationalite, de("la ", "nationalité"));
      exiger(etape, `${qui}.profession`, x.profession, de("la ", "profession"));
      exiger(etape, `${qui}.email`, x.email, qui === "client" ? "votre courriel" : "le courriel de votre conjoint");
      exiger(etape, `${qui}.telephone`, x.telephone, qui === "client" ? "votre téléphone" : "le téléphone de votre conjoint");
      if (qui === "client" || divorce) {
        if (v(x.revenus) && v(x.revenusAnnuels)) m.push({ etape, champ: `${qui}.revenus`, libelle: qui === "client" ? "vos revenus" : "les revenus de votre conjoint" });
      }
      /* L'adresse du conjoint n'est demandée que s'il vit déjà ailleurs. */
      if (qui === "client" || d.logement.separes === "Oui") {
        exiger(etape, `${qui}.adresse`, x.adresse, qui === "client" ? "votre adresse" : "l'adresse de votre conjoint");
        exiger(etape, `${qui}.cp`, x.cp, qui === "client" ? "votre code postal" : "le code postal de votre conjoint");
        exiger(etape, `${qui}.ville`, x.ville, qui === "client" ? "votre ville" : "la ville de votre conjoint");
      }
    }
  }
  if (d.client.email && !COURRIEL_VALIDE.test(d.client.email.trim()))
    m.push({ etape: 1, champ: "client.email", libelle: "un courriel valide" });
  if (d.conjoint.email && !COURRIEL_VALIDE.test(d.conjoint.email.trim()))
    m.push({ etape: 2, champ: "conjoint.email", libelle: "un courriel valide pour votre conjoint" });
  /* Deux adresses distinctes : la même pour les deux époux empêchait de savoir
     qui est qui (espace client, courriels à chacun). Version cabinet comprise. */
  if (
    d.client.email &&
    d.conjoint.email &&
    d.client.email.trim().toLowerCase() === d.conjoint.email.trim().toLowerCase()
  )
    m.push({ etape: 2, champ: "conjoint.email", libelle: "un courriel propre à votre conjoint, différent du vôtre" });

  exiger(3, "mariage.regime", d.mariage.regime, "le régime matrimonial");
  if (d.enfants.length) exiger(5, "nomFamilleEnfants", d.nomFamilleEnfants, "le nom de famille des enfants");
  d.enfants.forEach((e, i) => {
    exiger(5, `enfants.${i}.prenoms`, e.prenoms, `les prénoms de l'enfant n° ${i + 1}`);
  });
  if (interne) return m;

  exiger(0, "distance", d.distance, "la façon de procéder (à distance ou au cabinet)");
  exiger(3, "mariage.date", d.mariage.date, "la date du mariage");
  exiger(3, "mariage.lieu", d.mariage.lieu, "le lieu du mariage");

  exiger(4, "logement.separes", d.logement.separes, "si vous vivez déjà séparément");
  if (d.logement.separes === "Non") {
    exiger(4, "logement.domicile", d.logement.domicile, "qui conservera le domicile conjugal");
    if (d.logement.domicile === "Moi" || d.logement.domicile === "Mon conjoint")
      exiger(4, "logement.delai", d.logement.delai, "le délai de relogement");
  }

  d.enfants.forEach((e, i) => {
    const n = `de l'enfant n° ${i + 1}`;
    exiger(5, `enfants.${i}.sexe`, e.sexe, `le sexe ${n}`);
    exiger(5, `enfants.${i}.dateNaissance`, e.dateNaissance, `la date de naissance ${n}`);
    exiger(5, `enfants.${i}.lieuNaissance`, e.lieuNaissance, `le lieu de naissance ${n}`);
    exiger(5, `enfants.${i}.garde`, e.garde, `la résidence ${n}`);
    if (e.garde === "Majeur plus à charge") {
      exiger(5, `enfants.${i}.profession`, e.profession, `la profession ${n}`);
      exiger(5, `enfants.${i}.adresse`, e.adresse, `l'adresse ${n}`);
    } else if (divorce && e.garde) {
      exiger(5, `enfants.${i}.pension`, e.pension, `la pension envisagée pour l'enfant n° ${i + 1} (0 si aucune)`);
    }
  });

  d.immobilier.forEach((b, i) => exiger(6, `immobilier.${i}.adresse`, b.adresse, `l'adresse du bien n° ${i + 1}`));
  d.vehicules.forEach((x, i) => {
    exiger(6, `vehicules.${i}.marque`, x.marque, `la marque du véhicule n° ${i + 1}`);
    if (divorce) {
      exiger(6, `vehicules.${i}.modele`, x.modele, `le modèle du véhicule n° ${i + 1}`);
      exiger(6, `vehicules.${i}.qui`, x.qui, `qui conservera le véhicule n° ${i + 1}`);
    }
  });
  d.credits.forEach((c, i) => {
    exiger(6, `credits.${i}.banque`, c.banque, `la banque du crédit n° ${i + 1}`);
    if (divorce) {
      exiger(6, `credits.${i}.totalEmprunte`, c.totalEmprunte, `le total emprunté du crédit n° ${i + 1}`);
      exiger(6, `credits.${i}.restantDu`, c.restantDu, `le restant dû du crédit n° ${i + 1}`);
      exiger(6, `credits.${i}.mensualite`, c.mensualite, `la mensualité du crédit n° ${i + 1}`);
      exiger(6, `credits.${i}.qui`, c.qui, `qui supportera le crédit n° ${i + 1}`);
    }
  });
  if (d.arrieresLoyers === "Oui") exiger(6, "montantArrieresLoyers", d.montantArrieresLoyers, "le montant des arriérés de loyers");
  if (d.arrieresImpots === "Oui") exiger(6, "montantArrieresImpots", d.montantArrieresImpots, "le montant des arriérés d'impôts");

  if (divorce) {
    exiger(7, "pc.convenue", d.pc.convenue, "si une prestation compensatoire est convenue");
    if (d.pc.convenue === "Oui") {
      exiger(7, "pc.beneficiaire", d.pc.beneficiaire, "qui reçoit la prestation compensatoire");
      exiger(7, "pc.forme", d.pc.forme, "la forme de la prestation compensatoire");
      exiger(7, "pc.accordMontant", d.pc.accordMontant, "si vous êtes d'accord sur le montant de la prestation compensatoire");
      if (d.pc.accordMontant === "Oui") exiger(7, "pc.montant", d.pc.montant, "le montant de la prestation compensatoire");
    }
  }

  exiger(9, "repartition", d.repartition, "qui prendra en charge les honoraires");
  if (d.repartition === "Partage par moitié") exiger(9, "provisionPartage", d.provisionPartage, "le règlement de la provision");
  return m;
}

/* Informations facultatives encore vides, rappelées avant l'envoi (avec
   « Envoyer quand même »). Version cabinet : tout ce que la version client
   exige et que la version cabinet n'exige pas. S'y ajoutent, dans les deux
   versions, quelques informations utiles à la convention. */
export function facultatifs(d: Donnees, interne: boolean): Manque[] {
  const obligatoires = new Set(manquants(d, interne).map((x) => x.champ));
  const m: Manque[] = interne ? manquantsBruts(d, false).filter((x) => !obligatoires.has(x.champ)) : [];
  const vide = (x: string | undefined) => !x || !x.trim();
  const ajouter = (etape: number, champ: string, libelle: string) => {
    if (!obligatoires.has(champ) && !m.some((x) => x.champ === champ)) m.push({ etape, champ, libelle });
  };
  const divorce = d.procedure !== "Séparation de corps";
  if (d.logement.separes === "Oui" && vide(d.logement.dateSeparation)) ajouter(4, "logement.dateSeparation", "la date de séparation");
  if (!divorce && d.ds.convenu === "Oui" && vide(d.ds.montant)) ajouter(7, "ds.montant", "le montant du devoir de secours");
  if (divorce && vide(d.nomUsage.utilise)) ajouter(8, "nomUsage.utilise", "l'usage du nom de l'autre époux");
  if (!d.pieces.length) ajouter(10, "pieces", "les pièces justificatives");
  return interne ? pourCabinet(m) : m;
}

/* ---------- Saisie : majuscules et noms de lieux ---------- */

/* Noms de famille et villes des adresses : en capitales, accents conservés
   (CRÉTEIL, non CRETEIL). */
export const enCapitales = (s: string) => (s || "").toLocaleUpperCase("fr-FR");

/* Lieux de naissance et de mariage : capitale initiale à chaque mot, sauf les
   petits mots à l'intérieur d'un nom composé (Magny-en-Vexin,
   Soisy-sous-Montmorency, Villeneuve-d'Ascq, L'Haÿ-les-Roses). Un sigle saisi
   en capitales entre parenthèses, « (USA) », est conservé. */
const PETITS_MOTS = new Set(["en", "sous", "sur", "le", "la", "les", "de", "du", "des", "et", "aux", "au", "lès", "lez", "l", "d"]);
export function nomDeLieu(s: string): string {
  const morceaux = (s || "").replace(/\s+/g, " ").trim().split(/([\s\-'’()]+)/);
  let premier = true;
  let parenthese = false;
  return morceaux
    .map((t) => {
      if (!t) return t;
      if (/^[\s\-'’()]+$/.test(t)) {
        if (t.includes("(")) {
          premier = true;
          parenthese = true;
        }
        if (t.includes(")")) parenthese = false;
        return t;
      }
      const bas = t.toLocaleLowerCase("fr-FR");
      let r: string;
      if (!premier && PETITS_MOTS.has(bas)) r = bas;
      else if (parenthese && /^[A-ZÀ-Þ]{2,3}$/.test(t)) r = t;
      else r = bas.charAt(0).toLocaleUpperCase("fr-FR") + bas.slice(1);
      premier = false;
      return r;
    })
    .join("");
}

/* Adresses : le type de voie en minuscules, le nom propre avec ses capitales
   (15 rue Paul Vaillant Couturier, 196 avenue Victor Hugo, place de la
   République, rue du Faubourg-Saint-Honoré). Une lettre seule saisie en
   capitale (bâtiment A) est conservée. */
const VOIES = new Set([
  "rue", "avenue", "av", "boulevard", "bd", "bld", "place", "allée", "allee", "chemin", "impasse", "route",
  "quai", "cours", "square", "passage", "villa", "cité", "cite", "résidence", "residence", "voie", "sentier",
  "rond-point", "esplanade", "parvis", "promenade", "sente", "ruelle", "hameau", "lieu-dit", "lotissement",
  "chaussée", "chaussee", "carrefour", "clos", "domaine", "mail", "montée", "port", "traverse", "bâtiment",
  "batiment", "bât", "bat", "appartement", "appt", "apt", "étage", "etage", "escalier", "esc", "porte",
  "bis", "ter", "quater",
]);
export function adresse(s: string): string {
  const morceaux = (s || "").replace(/\s+/g, " ").trim().split(/([\s\-'’(),]+)/);
  let premier = true;
  return morceaux
    .map((t) => {
      if (!t || /^[\s\-'’(),]+$/.test(t)) return t;
      const bas = t.toLocaleLowerCase("fr-FR");
      let r: string;
      if (/\d/.test(t)) r = bas;
      else if (VOIES.has(bas)) r = bas;
      else if (!premier && PETITS_MOTS.has(bas)) r = bas;
      else if (t.length === 1 && t === t.toLocaleUpperCase("fr-FR")) r = t;
      else r = bas.charAt(0).toLocaleUpperCase("fr-FR") + bas.slice(1);
      if (!/\d/.test(t)) premier = false;
      return r;
    })
    .join("");
}

/* Appliquée à l'envoi, pour les saisies faites avant ces règles ou reprises. */
export function normaliser(d: Donnees): Donnees {
  const p = (x: Personne): Personne => ({
    ...x,
    nom: enCapitales(x.nom).trim(),
    ville: enCapitales(x.ville).trim(),
    adresse: adresse(x.adresse),
    lieuNaissance: nomDeLieu(x.lieuNaissance),
  });
  return {
    ...d,
    client: p(d.client),
    conjoint: p(d.conjoint),
    nomFamilleEnfants: enCapitales(d.nomFamilleEnfants).trim(),
    mariage: { ...d.mariage, lieu: nomDeLieu(d.mariage.lieu) },
    enfants: d.enfants.map((e) => ({ ...e, lieuNaissance: nomDeLieu(e.lieuNaissance), adresse: adresse(e.adresse) })),
    immobilier: d.immobilier.map((b) => ({ ...b, adresse: adresse(b.adresse) })),
  };
}

/* ---------- Mise en forme ---------- */

const nomMaj = (s: string) => (s || "").trim().toUpperCase();
const nombre = (s: string): number | null => {
  const t = (s || "").replace(/\s/g, "").replace(",", ".").replace(/[^0-9.]/g, "");
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
};
const ouiNon = (s: string): boolean | null => (s === "Oui" ? true : s === "Non" ? false : null);
const vide = (s: string) => (s && s.trim() ? s.trim() : null);

export function dateFr(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
}

export function dossier(d: Donnees): string {
  return [nomMaj(d.client.nom), nomMaj(d.conjoint.nom)].filter(Boolean).join(" - ");
}

/* Charge au format Cognito, destinée à l'automatisation « Cognito -> AirTable ».
   Seules les clés que cette automatisation lit sont indispensables ; les autres
   sont transmises pour garder la saisie complète et lisible au même format. */
export function chargeCognito(d: Donnees, opts: { interne: boolean; numero: number; date: string }) {
  const c = d.client;
  const j = d.conjoint;
  const e = (i: number) => d.enfants[i];
  const charge: Record<string, unknown> = {
    Form: {
      Id: "site",
      InternalName: "FormulaireRenseignementsSite",
      Name: opts.interne ? "Formulaire de renseignements interne" : "Formulaire de renseignements",
    },
    Entry: { Number: opts.numero, DateCreated: opts.date, DateSubmitted: opts.date, ViewLink: "", AdminLink: "" },
    Dossier: dossier(d),
    Civilité: vide(c.civilite),
    NOM: vide(c.nom),
    Prénoms: vide(c.prenoms),
    Email: vide(c.email) ? c.email.trim().toLowerCase() : null,
    Téléphone: vide(c.telephone),
    DateDeNaissance: vide(c.dateNaissance),
    LieuDeNaissance: vide(c.lieuNaissance),
    Nationalité: vide(c.nationalite),
    Adresse: vide(c.adresse),
    CodePostal: vide(c.cp),
    Ville: vide(c.ville),
    Profession: vide(c.profession),
    Revenus: nombre(c.revenus),
    VivezvousDéjàSéparément: ouiNon(d.logement.separes),
    QuiConserveraLeDomicileConjugal: vide(d.logement.domicile),
    DélaiRelogement: vide(d.logement.delai),
    CivilitéConjoint: vide(j.civilite),
    NOMDEFAMILLEDUCONJOINT: vide(j.nom),
    Prénomsconjoint: vide(j.prenoms),
    DateNaissanceConjoint: vide(j.dateNaissance),
    LieuDeNaissanceDuConjoint: vide(j.lieuNaissance),
    NationalitéDuConjoint: vide(j.nationalite),
    EmailDuConjoint: vide(j.email) ? j.email.trim().toLowerCase() : null,
    TéléphoneConjoint: vide(j.telephone),
    AdresseDuConjoint: vide(j.adresse),
    CodePostalConjoint: vide(j.cp),
    VilleConjoint: vide(j.ville),
    Profession2: vide(j.profession),
    Revenus2: nombre(j.revenus),
    DateDuMariage: vide(d.mariage.date),
    LieuDuMariage: vide(d.mariage.lieu),
    RégimeMatrimonial: vide(d.mariage.regime),
    NomDuNotaire: vide(d.mariage.notaire),
    VilleNotaire: vide(d.mariage.villeNotaire),
    DateDuContratDeMariage: vide(d.mariage.dateContrat),
    UsageNomConjoint: ouiNon(d.nomUsage.utilise),
    UsageNomConjointDivorce: d.procedure === "Divorce" ? ouiNon(d.nomUsage.conserve) : null,
    UsageNomConjointSDC: d.procedure === "Séparation de corps" ? ouiNon(d.nomUsage.conserve) : null,
    PC: d.procedure === "Divorce" ? vide(d.pc.convenue) : null,
    BénéficiairePC: d.procedure === "Divorce" ? vide(d.pc.beneficiaire) : null,
    FormePC: d.procedure === "Divorce" ? vide(d.pc.forme) : null,
    MontantPC: d.procedure === "Divorce" && d.pc.accordMontant !== "Non" ? nombre(d.pc.montant) : null,
    DS: d.procedure === "Séparation de corps" ? vide(d.ds.convenu) : null,
    BénéficiaireDS: d.procedure === "Séparation de corps" ? vide(d.ds.beneficiaire) : null,
    MontantDS: d.procedure === "Séparation de corps" ? nombre(d.ds.montant) : null,
    BiensImmobiliersAcquisEnCommun: d.immobilier.length,
    VéhiculesAutomobiles: d.vehicules.length,
    CréditsCommuns: d.credits.length,
    Arriérésloyer: ouiNon(d.arrieresLoyers),
    MontantArriérésLoyers: nombre(d.montantArrieresLoyers),
    AvezvousDesArriérésDimpôts: ouiNon(d.arrieresImpots),
    MontantArriérésImpôts: nombre(d.montantArrieresImpots),
    Impotssepares: ouiNon(d.impotsSepares),
    Nbenfants: d.enfants.length,
    NomDeFamilleDesEnfants: vide(d.nomFamilleEnfants),
    VosCommentaires: vide(d.commentaires),
    Distance: vide(d.distance),
    RépartitonDesHonoraires: vide(d.repartition),
    DéjàClient: vide(d.dejaClient) || "Non",
    InterneExterne: opts.interne ? "Interne" : "Externe",
  };

  d.immobilier.slice(0, 3).forEach((b, i) => {
    const n = i === 0 ? "" : String(i + 1);
    charge[`AdresseImmo${n}`] = vide(b.adresse);
    charge[`ValeurImmo${i + 1}`] = vide(b.valeur);
    charge[`CréditImmoRestant${i + 1}`] = nombre(b.creditRestant);
    charge[`QuiConserveraImmo${i + 1}`] = vide(b.qui);
  });
  d.vehicules.slice(0, 3).forEach((v, i) => {
    const n = i === 0 ? "" : String(i + 1);
    charge[`Marque${n}`] = vide(v.marque);
    charge[`Modèle${n}`] = vide(v.modele);
    charge[`Immatriculation${n}`] = vide(v.immatriculation);
    charge[`Valeur${n}`] = vide(v.valeur);
    charge[`QuiLeConservera${n}`] = vide(v.qui);
  });
  d.credits.slice(0, 6).forEach((k, i) => {
    const n = i === 0 ? "" : String(i + 1);
    charge[`Banque${n}`] = vide(k.banque);
    charge[`TotalEmprunté${n}`] = vide(k.totalEmprunte);
    charge[`RestantDû${n}`] = nombre(k.restantDu);
    charge[`Mensualite${n}`] = nombre(k.mensualite);
    charge[`DateDernièreÉchéance${n}`] = vide(k.derniereEcheance);
    charge[`QuiLeSupportera${n}`] = vide(k.qui);
  });
  const rangs = ["1er", "2e", "3e", "4e", "5e"];
  for (let i = 0; i < 5; i++) {
    const x = e(i);
    if (!x) break;
    const n = i + 1;
    charge[`PrénomsEnfant${n}`] = vide(x.prenoms);
    charge[`Sexe${n}`] = vide(x.sexe);
    charge[`DateDeNaissanceEnfant${n}`] = vide(x.dateNaissance);
    charge[`LieuDeNaissanceEnfant${n}`] = vide(x.lieuNaissance);
    charge[`Garde${n}`] = vide(x.garde);
    charge[`Pension${n}`] = nombre(x.pension);
    charge[`Profession${rangs[i]}Enfant`] = vide(x.profession);
    charge[`Adresse${rangs[i]}Enfant`] = vide(x.adresse);
  }
  return charge;
}

const beneficiaire = (s: string) => (s === "Moi" ? "Le client" : s ? "Le conjoint" : null);

/* Champs ajoutés le 2026-09-25 dans « Formulaires reçus », écrits par n8n une
   fois la fiche créée par l'automatisation. Noms de champs Airtable exacts. */
export function champsComplementaires(d: Donnees, lienReprise: string) {
  const divorce = d.procedure === "Divorce";
  const domicile = [d.logement.domicile, d.logement.delai ? `relogement sous ${d.logement.delai}` : ""]
    .filter(Boolean)
    .join(", ");
  return {
    Procédure: d.procedure,
    "Version du formulaire": VERSION,
    "Données du formulaire": JSON.stringify(d),
    "Nombre d'enfants": d.enfants.length,
    Enfants: texteEnfants(d) || null,
    "Biens immobiliers": d.immobilier.length,
    "Crédits communs": d.credits.length,
    "Vivent séparément": vide(d.logement.separes),
    "Date de séparation": vide(d.logement.dateSeparation),
    "Domicile conjugal": domicile || null,
    "Prestation compensatoire": divorce ? vide(d.pc.convenue) : null,
    "PC bénéficiaire": divorce && d.pc.convenue === "Oui" ? beneficiaire(d.pc.beneficiaire) : null,
    "PC forme": divorce && d.pc.convenue === "Oui" ? vide(d.pc.forme) : null,
    "PC montant": divorce && d.pc.convenue === "Oui" && d.pc.accordMontant !== "Non" ? nombre(d.pc.montant) : null,
    "Devoir de secours": divorce ? null : vide(d.ds.convenu),
    "DS bénéficiaire": !divorce && d.ds.convenu === "Oui" ? beneficiaire(d.ds.beneficiaire) : null,
    "DS montant mensuel": !divorce && d.ds.convenu === "Oui" ? nombre(d.ds.montant) : null,
    "Usage du nom": texteNom(d) || null,
    "Arriérés de loyers": d.arrieresLoyers === "Oui" ? nombre(d.montantArrieresLoyers) : null,
    "Arriérés d'impôts": d.arrieresImpots === "Oui" ? nombre(d.montantArrieresImpots) : null,
    "Lien de reprise": lienReprise,
  };
}

export function texteEnfants(d: Donnees): string {
  return d.enfants
    .map((e) => {
      const a = age(e.dateNaissance);
      const morceaux = [
        e.prenoms.trim() || "(prénoms non renseignés)",
        e.dateNaissance ? `né(e) le ${dateFr(e.dateNaissance)}${a !== null ? `, ${a} ans` : ""}` : "",
        e.garde ? `résidence : ${e.garde}` : "",
        e.pension ? `pension : ${e.pension} €` : "",
      ].filter(Boolean);
      return morceaux.join(", ");
    })
    .join("\n");
}

function texteNom(d: Donnees): string {
  if (!d.nomUsage.utilise) return "";
  if (d.nomUsage.utilise === "Non") return "Non utilisé";
  const suite = d.nomUsage.conserve === "Oui" ? "pourra le conserver" : d.nomUsage.conserve === "Non" ? "ne le conservera pas" : "";
  return ["Utilisé", suite].filter(Boolean).join(", ");
}

/* ---------- Récapitulatif (courriel au cabinet et écran final) ---------- */

export type Section = { titre: string; lignes: [string, string][] };

export function recapitulatif(d: Donnees): Section[] {
  const p = (x: Personne): [string, string][] => [
    ["Identité", [x.civilite, x.prenoms, nomMaj(x.nom)].filter(Boolean).join(" ")],
    ["Naissance", [dateFr(x.dateNaissance), x.lieuNaissance && `à ${x.lieuNaissance}`].filter(Boolean).join(" ")],
    ["Nationalité", x.nationalite],
    ["Adresse", [x.adresse, [x.cp, x.ville].filter(Boolean).join(" ")].filter(Boolean).join(", ")],
    ["Profession", x.profession],
    ["Revenus mensuels", x.revenus && `${x.revenus} €`],
    ["Revenus annuels", x.revenusAnnuels && `${x.revenusAnnuels} €`],
    ["Logement actuel", x.statutLogement],
    ["Courriel", x.email],
    ["Téléphone", x.telephone],
  ];
  const s: Section[] = [
    {
      titre: "Procédure",
      lignes: [
        ["Procédure", d.procedure],
        ["Déroulé", d.distance],
        ["Déjà client", d.dejaClient],
      ],
    },
    { titre: "Le client", lignes: p(d.client) },
    {
      titre: "Le conjoint",
      lignes: [
        ...p(d.conjoint),
        ...(d.avocatConjoint && !estPartenaire(d.avocatConjoint)
          ? ([["Avocat du conjoint", texteAvocat(d.avocatConjoint)]] as [string, string][])
          : []),
      ],
    },
    {
      titre: "Le mariage",
      lignes: [
        ["Date et lieu", [dateFr(d.mariage.date), d.mariage.lieu && `à ${d.mariage.lieu}`].filter(Boolean).join(" ")],
        ["Régime", d.mariage.regime],
        ["Contrat de mariage", d.mariage.contrat],
        [
          "Notaire",
          [d.mariage.notaire, d.mariage.villeNotaire, d.mariage.dateContrat && `contrat du ${dateFr(d.mariage.dateContrat)}`]
            .filter(Boolean)
            .join(", "),
        ],
      ],
    },
    {
      titre: "Le logement",
      lignes: [
        ["Vivent séparément", d.logement.separes],
        ["Depuis le", dateFr(d.logement.dateSeparation)],
        ["Domicile conjugal", d.logement.domicile],
        ["Délai de relogement", d.logement.delai],
      ],
    },
    {
      titre: `Les enfants (${d.enfants.length})`,
      lignes: [
        ["Nom de famille", d.nomFamilleEnfants],
        ["Jour de l'alternance", d.jourAlternance],
        ...d.enfants.map((e, i): [string, string] => [
          `Enfant n° ${i + 1}`,
          [
            e.prenoms,
            e.sexe,
            e.dateNaissance && `né(e) le ${dateFr(e.dateNaissance)}`,
            e.lieuNaissance && `à ${e.lieuNaissance}`,
            e.garde && `résidence : ${e.garde}`,
            e.pension && `pension : ${e.pension} €`,
            e.profession && `profession : ${e.profession}`,
            e.adresse && `adresse : ${e.adresse}`,
          ]
            .filter(Boolean)
            .join(", "),
        ]),
      ],
    },
    {
      titre: "Le patrimoine",
      lignes: [
        ...d.immobilier.map((b, i): [string, string] => [
          `Bien immobilier n° ${i + 1}`,
          [b.adresse, b.valeur && `valeur ${b.valeur} €`, b.creditRestant && `crédit restant ${b.creditRestant} €`, b.qui && `conservé : ${b.qui}`]
            .filter(Boolean)
            .join(", "),
        ]),
        ...d.vehicules.map((v, i): [string, string] => [
          `Véhicule n° ${i + 1}`,
          [[v.marque, v.modele].filter(Boolean).join(" "), v.immatriculation, v.valeur && `valeur ${v.valeur} €`, v.qui && `conservé : ${v.qui}`]
            .filter(Boolean)
            .join(", "),
        ]),
        ...d.credits.map((k, i): [string, string] => [
          `Crédit n° ${i + 1}`,
          [
            k.banque,
            k.totalEmprunte && `emprunté ${k.totalEmprunte} €`,
            k.restantDu && `restant ${k.restantDu} €`,
            k.mensualite && `mensualité ${k.mensualite} €`,
            k.derniereEcheance && `fin le ${dateFr(k.derniereEcheance)}`,
            k.qui && `supporté : ${k.qui}`,
          ]
            .filter(Boolean)
            .join(", "),
        ]),
        ["Arriérés de loyers", d.arrieresLoyers === "Oui" ? `Oui, ${d.montantArrieresLoyers || "?"} €` : d.arrieresLoyers],
        ["Arriérés d'impôts", d.arrieresImpots === "Oui" ? `Oui, ${d.montantArrieresImpots || "?"} €` : d.arrieresImpots],
        ["Impôts déjà séparés", d.impotsSepares],
      ],
    },
    d.procedure === "Divorce"
      ? {
          titre: "Prestation compensatoire",
          lignes: [
            ["Convenue", d.pc.convenue],
            ["Bénéficiaire", d.pc.beneficiaire],
            ["Forme", d.pc.forme],
            ["Accord sur le montant", d.pc.accordMontant || ""],
            ["Montant total", d.pc.montant && `${d.pc.montant} €`],
          ],
        }
      : {
          titre: "Devoir de secours",
          lignes: [
            ["Convenu", d.ds.convenu],
            ["Bénéficiaire", d.ds.beneficiaire],
            ["Montant mensuel", d.ds.montant && `${d.ds.montant} €`],
          ],
        },
    {
      titre: "Nom d'usage",
      lignes: [
        ["Utilisé", d.nomUsage.utilise],
        ["Pourra le conserver", d.nomUsage.conserve],
      ],
    },
    {
      titre: "Honoraires et commentaires",
      lignes: [
        ["Répartition des honoraires", d.repartition],
        ...(d.repartition === "Partage par moitié"
          ? ([["Provision de 250 €", d.provisionPartage]] as [string, string][])
          : []),
        ["Commentaires", d.commentaires],
      ],
    },
    {
      titre: `Pièces (${d.pieces.length})`,
      lignes: d.pieces.map((x): [string, string] => [x.categorie, x.nom]),
    },
  ];
  return s.map((x) => ({ ...x, lignes: x.lignes.filter(([, v]) => v && String(v).trim()) }));
}

const echap = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function recapitulatifHtml(d: Donnees): string {
  return recapitulatif(d)
    .filter((s) => s.lignes.length)
    .map(
      (s) =>
        `<h3 style="margin:22px 0 8px;font-family:Arial,sans-serif;font-size:15px;color:#362a24;">${echap(s.titre)}</h3>` +
        `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">` +
        s.lignes
          .map(
            ([k, v]) =>
              `<tr><td style="padding:5px 12px 5px 0;font-family:Arial,sans-serif;font-size:13px;color:#8d8a84;vertical-align:top;width:190px;">${echap(k)}</td>` +
              `<td style="padding:5px 0;font-family:Arial,sans-serif;font-size:13px;color:#1a1a1a;">${echap(v).replace(/\n/g, "<br>")}</td></tr>`,
          )
          .join("") +
        `</table>`,
    )
    .join("");
}

/* Mode test (?test=1) : saisie fictive complète, pour essayer le parcours
   sans tout remplir. Divorce amiable sans enfant ni bien, conjoint assisté par
   l'avocat partenaire, honoraires et provision partagés par moitié. Les deux
   courriels sont ceux de la personne qui teste. */
export function donneesDeTest(emailA: string, emailB: string): Donnees {
  const d = donneesVides("Divorce");
  const personne = (civilite: string, prenoms: string, email: string, naissance: string): Personne => ({
    civilite,
    nom: "TEST",
    prenoms,
    dateNaissance: naissance,
    lieuNaissance: "Paris",
    nationalite: "Française",
    adresse: "1 rue de l'Essai",
    cp: "75016",
    ville: "Paris",
    profession: "Salarié",
    revenus: "2500",
    revenusAnnuels: "",
    statutLogement: "Location",
    email,
    telephone: "0600000000",
  });
  return {
    ...d,
    distance: "Commencer à distance",
    dejaClient: "Non",
    client: personne("Madame", "Alice", emailA, "1985-04-12"),
    conjoint: personne("Monsieur", "Bruno", emailB, "1983-09-30"),
    mariage: { ...d.mariage, date: "2015-06-20", lieu: "Paris", regime: "communauté de biens réduite aux acquêts" },
    logement: { separes: "Oui", dateSeparation: "2026-01-01", domicile: "", delai: "" },
    arrieresLoyers: "Non",
    arrieresImpots: "Non",
    impotsSepares: "Oui",
    pc: { convenue: "Non", beneficiaire: "", forme: "", accordMontant: "", montant: "" },
    nomUsage: { utilise: "Non", conserve: "" },
    repartition: "Partage par moitié",
    provisionPartage: "Nous la partageons (125 € chacun)",
    commentaires: "Formulaire de test, à supprimer.",
  };
}
