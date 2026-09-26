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
export const FORMES_PC = ["Capital", "Abandon de soulte", "Rente mensuelle", "Rente viagère", "Ne sait pas encore"] as const;
export const REPARTITIONS = [
  "Partage par moitié",
  "Je les prendrai à ma charge",
  "Mon conjoint les prendra à charge",
  "Assurance juridique",
  "Je ne sais pas encore",
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
  enfants: Enfant[];
  immobilier: Bien[];
  vehicules: Vehicule[];
  credits: Credit[];
  arrieresLoyers: string;
  montantArrieresLoyers: string;
  arrieresImpots: string;
  montantArrieresImpots: string;
  impotsSepares: string;
  pc: { convenue: string; beneficiaire: string; forme: string; montant: string };
  ds: { convenu: string; beneficiaire: string; montant: string };
  nomUsage: { utilise: string; conserve: string };
  repartition: string;
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
  enfants: [],
  immobilier: [],
  vehicules: [],
  credits: [],
  arrieresLoyers: "",
  montantArrieresLoyers: "",
  arrieresImpots: "",
  montantArrieresImpots: "",
  impotsSepares: "",
  pc: { convenue: "", beneficiaire: "", forme: "", montant: "" },
  ds: { convenu: "", beneficiaire: "", montant: "" },
  nomUsage: { utilise: "", conserve: "" },
  repartition: "",
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

/* Champs indispensables à l'envoi. Le reste peut être complété au rendez-vous :
   le formulaire ne doit pas bloquer un client qui n'a pas tout sous la main. */
export function manquants(d: Donnees, interne: boolean): Manque[] {
  const m: Manque[] = [];
  const v = (x: string) => !x || !x.trim();
  if (v(d.procedure)) m.push({ etape: 0, champ: "procedure", libelle: "la procédure" });
  if (v(d.client.civilite)) m.push({ etape: 1, champ: "client.civilite", libelle: "votre civilité" });
  if (v(d.client.nom)) m.push({ etape: 1, champ: "client.nom", libelle: "votre nom" });
  if (v(d.client.prenoms)) m.push({ etape: 1, champ: "client.prenoms", libelle: "vos prénoms" });
  if (!interne) {
    if (v(d.client.email)) m.push({ etape: 1, champ: "client.email", libelle: "votre courriel" });
    if (v(d.client.telephone)) m.push({ etape: 1, champ: "client.telephone", libelle: "votre téléphone" });
  }
  if (d.client.email && !COURRIEL_VALIDE.test(d.client.email.trim()))
    m.push({ etape: 1, champ: "client.email", libelle: "un courriel valide" });
  if (d.conjoint.email && !COURRIEL_VALIDE.test(d.conjoint.email.trim()))
    m.push({ etape: 2, champ: "conjoint.email", libelle: "un courriel valide pour votre conjoint" });
  if (v(d.conjoint.civilite)) m.push({ etape: 2, champ: "conjoint.civilite", libelle: "la civilité de votre conjoint" });
  if (v(d.conjoint.nom)) m.push({ etape: 2, champ: "conjoint.nom", libelle: "le nom de votre conjoint" });
  if (v(d.conjoint.prenoms)) m.push({ etape: 2, champ: "conjoint.prenoms", libelle: "les prénoms de votre conjoint" });
  d.enfants.forEach((e, i) => {
    if (v(e.prenoms)) m.push({ etape: 5, champ: `enfants.${i}.prenoms`, libelle: `les prénoms de l'enfant n° ${i + 1}` });
  });
  return m;
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
    MontantPC: d.procedure === "Divorce" ? nombre(d.pc.montant) : null,
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
    "PC montant": divorce && d.pc.convenue === "Oui" ? nombre(d.pc.montant) : null,
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
    { titre: "Le conjoint", lignes: p(d.conjoint) },
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
