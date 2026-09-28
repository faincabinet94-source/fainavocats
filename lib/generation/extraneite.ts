import type { Donnees, Personne } from "@/lib/renseignements/modele";

/* Compétence et loi applicable, quand le divorce présente un élément
 * d'extranéité : nationalité étrangère de l'un des époux (double nationalité
 * comprise) ou résidence de l'un d'eux hors de France. Deux Français résidant
 * en France : rien ne s'imprime.
 *
 * Objectif du cabinet : rattacher le divorce à la compétence et à la loi
 * françaises. Le moteur rédige les paragraphes quand le rattachement est acquis
 * et, sinon, imprime une alerte dans l'acte et dans le rapport de génération,
 * sans jamais écrire que la loi française s'applique quand elle ne s'applique
 * pas (deux Marocains : la convention franco-marocaine désigne la loi
 * marocaine).
 *
 * Analyse et sources : coffre, 30 - Notes juridiques/Divorce/
 * competence-internationale-et-loi-applicable-divorce.md et
 * reconnaissance-dcm-a-l-etranger.md. */

const sansAccents = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/* Radical de la nationalité → pays. `ue` : État membre de l'Union. */
const NATIONALITES: [string, string, boolean][] = [
  ["franc", "France", true], ["allemand", "Allemagne", true], ["autrichien", "Autriche", true],
  ["belge", "Belgique", true], ["bulgare", "Bulgarie", true], ["chypriot", "Chypre", true],
  ["croate", "Croatie", true], ["danois", "Danemark", true], ["espagnol", "Espagne", true],
  ["estonien", "Estonie", true], ["finlandais", "Finlande", true], ["grec", "Grèce", true],
  ["hongrois", "Hongrie", true], ["irlandais", "Irlande", true], ["italien", "Italie", true],
  ["leton", "Lettonie", true], ["letton", "Lettonie", true], ["lituanien", "Lituanie", true],
  ["luxembourgeois", "Luxembourg", true], ["maltais", "Malte", true], ["neerlandais", "Pays-Bas", true],
  ["hollandais", "Pays-Bas", true], ["polonais", "Pologne", true], ["portugais", "Portugal", true],
  ["roumain", "Roumanie", true], ["slovaque", "Slovaquie", true], ["slovene", "Slovénie", true],
  ["suedois", "Suède", true], ["tcheque", "Tchéquie", true],
  ["algerien", "Algérie", false], ["marocain", "Maroc", false], ["tunisien", "Tunisie", false],
  ["senegalais", "Sénégal", false], ["malien", "Mali", false], ["ivoirien", "Côte d'Ivoire", false],
  ["camerounais", "Cameroun", false], ["congolais", "Congo", false], ["guineen", "Guinée", false],
  ["mauritanien", "Mauritanie", false], ["comorien", "Comores", false], ["beninois", "Bénin", false],
  ["togolais", "Togo", false], ["burkinab", "Burkina Faso", false], ["gabonais", "Gabon", false],
  ["malgache", "Madagascar", false], ["mauricien", "Maurice", false], ["egyptien", "Égypte", false],
  ["libanais", "Liban", false], ["syrien", "Syrie", false], ["irakien", "Irak", false],
  ["iranien", "Iran", false], ["israelien", "Israël", false], ["turc", "Turquie", false],
  ["russe", "Russie", false], ["ukrainien", "Ukraine", false], ["moldave", "Moldavie", false],
  ["georgien", "Géorgie", false], ["armenien", "Arménie", false], ["serbe", "Serbie", false],
  ["albanais", "Albanie", false], ["kosovar", "Kosovo", false], ["suisse", "Suisse", false],
  ["britannique", "Royaume-Uni", false], ["anglais", "Royaume-Uni", false], ["norvegien", "Norvège", false],
  ["americain", "États-Unis", false], ["canadien", "Canada", false], ["bresilien", "Brésil", false],
  ["colombien", "Colombie", false], ["haitien", "Haïti", false], ["chinois", "Chine", false],
  ["japonais", "Japon", false], ["vietnamien", "Viêt Nam", false], ["indien", "Inde", false],
  ["pakistanais", "Pakistan", false], ["afghan", "Afghanistan", false], ["philippin", "Philippines", false],
  ["thailandais", "Thaïlande", false], ["cambodgien", "Cambodge", false], ["laotien", "Laos", false],
];
const MOTS_NEUTRES = new Set(["et", "double", "nationalite", "nationalites", "de", "la", "le", "binational", "binationale", "e", "es", "s", "o"]);
const UE_PAYS = new Set(NATIONALITES.filter(([, , ue]) => ue).map(([, p]) => p));

/* Noms de pays reconnus dans une adresse (« Casablanca (Maroc) », « 1000
   Bruxelles Belgique »). */
const PAYS_ADRESSE: [RegExp, string][] = Array.from(new Set(NATIONALITES.map(([, p]) => p)))
  .map((p): [RegExp, string] => [new RegExp(`(^|[^a-z])${sansAccents(p).replace(/[-' ]/g, "[-' ]?")}([^a-z]|$)`), p])
  .concat([[/(^|[^a-z])(usa|etats[- ]unis)([^a-z]|$)/, "États-Unis"], [/(^|[^a-z])(angleterre|uk)([^a-z]|$)/, "Royaume-Uni"]]);

export type Nationalites = { francais: boolean; pays: string[]; brut: string };

export function nationalites(p: Personne): Nationalites {
  const mots = sansAccents(p.nationalite || "").split(/[^a-z]+/).filter((m) => m && !MOTS_NEUTRES.has(m));
  const pays: string[] = [];
  let inconnue = false;
  for (const m of mots) {
    const n = NATIONALITES.find(([r]) => m.startsWith(r));
    if (n) pays.push(n[1]);
    else inconnue = true;
  }
  const liste = Array.from(new Set(pays));
  /* Nationalité non reconnue : traitée comme étrangère (pays inconnu). */
  if (inconnue && !liste.some((x) => x !== "France")) liste.push("?");
  return { francais: liste.includes("France"), pays: liste, brut: (p.nationalite || "").trim() };
}

/* Pays de résidence, déduit de l'adresse : le cabinet y écrit le pays quand
   l'époux vit à l'étranger. France à défaut. */
export function paysResidence(p: Personne): string {
  const texte = sansAccents([p.adresse, p.cp, p.ville].filter(Boolean).join(" "));
  for (const [re, pays] of PAYS_ADRESSE) if (re.test(texte)) return pays;
  return "France";
}

const designation = (p: Personne) => `${p.civilite} ${(p.nom || "").trim().toUpperCase()}`.trim();

type Epoux = { p: Personne; nom: string; nat: Nationalites; res: string; feminin: boolean };

const epoux = (p: Personne): Epoux => ({
  p,
  nom: designation(p),
  nat: nationalites(p),
  res: paysResidence(p),
  feminin: p.civilite === "Madame",
});

const memeAdresse = (a: Personne, b: Personne) => {
  const n = (p: Personne) => sansAccents(`${p.adresse} ${p.cp}`).replace(/[^a-z0-9]/g, "");
  return Boolean((a.adresse || "").trim()) && n(a) === n(b);
};

const liste = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} et ${xs[xs.length - 1]}`);

/* « le Maroc », « l'Algérie », « les Comores » */
const ARTICLES: Record<string, string> = {
  "Algérie": "l'Algérie", "Égypte": "l'Égypte", "Irak": "l'Irak", "Iran": "l'Iran", "Inde": "l'Inde",
  "Afghanistan": "l'Afghanistan", "Ukraine": "l'Ukraine", "Albanie": "l'Albanie", "Arménie": "l'Arménie",
  "Allemagne": "l'Allemagne", "Autriche": "l'Autriche", "Espagne": "l'Espagne", "Estonie": "l'Estonie",
  "Irlande": "l'Irlande", "Italie": "l'Italie", "Israël": "Israël", "Chypre": "Chypre", "Malte": "Malte",
  "Madagascar": "Madagascar", "Maurice": "Maurice", "Haïti": "Haïti", "Luxembourg": "le Luxembourg",
  "Comores": "les Comores", "Pays-Bas": "les Pays-Bas", "États-Unis": "les États-Unis", "Philippines": "les Philippines",
};
const FEMININS = new Set([
  "Belgique", "Bulgarie", "Croatie", "Finlande", "Grèce", "Hongrie", "Lettonie", "Lituanie", "Pologne",
  "Roumanie", "Slovaquie", "Slovénie", "Suède", "Tchéquie", "Tunisie", "Côte d'Ivoire", "Guinée", "Mauritanie",
  "Syrie", "Turquie", "Russie", "Moldavie", "Géorgie", "Serbie", "Suisse", "Norvège", "Colombie", "Chine", "Thaïlande",
]);
export const avecArticle = (pays: string) => ARTICLES[pays] ?? `${FEMININS.has(pays) ? "la" : "le"} ${pays}`;

/* « au Maroc », « en Algérie », « aux États-Unis », « à Madagascar » */
const ILES = new Set(["Madagascar", "Chypre", "Malte", "Maurice"]);
export function enPays(pays: string): string {
  if (pays === "?") return "à l'étranger";
  if (ILES.has(pays)) return `à ${pays}`;
  const x = avecArticle(pays);
  if (x.startsWith("le ")) return `au ${pays}`;
  if (x.startsWith("les ")) return `aux ${pays}`;
  return `en ${pays}`;
}

export type Extraneite = { valeurs: Record<string, string | null>; alertes: string[] };

const BXL = "du règlement (UE) 2019/1111 du Conseil du 25 juin 2019";
const CFM =
  "de la convention entre la République française et le Royaume du Maroc relative au statut des personnes et de la famille et à la coopération judiciaire du 10 août 1981 (décret n° 83-435 du 27 mai 1983)";
const ROME = "du règlement (UE) n° 1259/2010 du Conseil du 20 décembre 2010 dit « Rome III »";
const SAHYOUNI = "(CJUE, 20 décembre 2017, Sahyouni, aff. C-372/16)";

export function analyserExtraneite(d: Donnees): Extraneite {
  const a = epoux(d.client);
  const b = epoux(d.conjoint);
  const alertes: string[] = [];
  const v: Record<string, string | null> = {};

  const seulementFrancais = (e: Epoux) => e.nat.pays.length === 1 && e.nat.francais;
  const enFrance = (e: Epoux) => e.res === "France";
  const extraneite = !(seulementFrancais(a) && seulementFrancais(b) && enFrance(a) && enFrance(b));
  v.Extraneite = extraneite ? "Oui" : "Non";

  /* Pays étrangers en cause (nationalité ou résidence). */
  const paysEnCause = new Set<string>();
  for (const e of [a, b]) {
    e.nat.pays.filter((x) => x !== "France").forEach((x) => paysEnCause.add(x));
    if (!enFrance(e)) paysEnCause.add(e.res);
  }
  v.ReconnaissanceUE = Array.from(paysEnCause).some((x) => UE_PAYS.has(x)) ? "Oui" : "Non";
  v.ReconnaissanceMaroc = paysEnCause.has("Maroc") ? "Oui" : "Non";
  v.ReconnaissanceAlgerie = paysEnCause.has("Algérie") ? "Oui" : "Non";
  const autres = Array.from(paysEnCause).filter((x) => !UE_PAYS.has(x) && x !== "Maroc" && x !== "Algérie");
  v.EtrangerAutre = autres.length ? "Oui" : "Non";
  v.PaysAutres = autres.length
    ? liste(autres.map((x) => (x === "?" ? "le pays dont l'un des époux est ressortissant" : avecArticle(x))))
    : null;

  for (const k of ["ExtraAlerte", "ExtraCompetence", "ExtraLoiDivorce1", "ExtraLoiDivorce2", "ExtraRegime", "ExtraAliments"])
    v[k] = null;
  v.ExtraAlimentsPresent = "Non";
  if (!extraneite) return { valeurs: v, alertes };

  if (a.nat.pays.includes("?") || b.nat.pays.includes("?"))
    alertes.push(`Nationalité non reconnue (${[a, b].filter((e) => e.nat.pays.includes("?")).map((e) => `${e.nom} : ${e.nat.brut || "non renseignée"}`).join(" ; ")}) : bloc de loi applicable à vérifier.`);

  /* ---------- Compétence : règlement Bruxelles II ter, art. 3 ---------- */
  const deuxFrancais = a.nat.francais && b.nat.francais;
  const nationaliteFr = deuxFrancais ? " et sont tous deux de nationalité française" : "";
  const pointB = deuxFrancais ? " et b)" : "";
  if (enFrance(a) && enFrance(b)) {
    v.ExtraCompetence = `En l'espèce, ${a.nom} et ${b.nom} ont l'un et l'autre leur résidence habituelle en France${nationaliteFr}. Les juridictions françaises auraient donc été compétentes pour connaître de leur divorce en application de l'article 3, a), i)${pointB}, ${BXL}.`;
  } else if (enFrance(a) || enFrance(b)) {
    const r = enFrance(a) ? a : b;
    const x = enFrance(a) ? b : a;
    v.ExtraCompetence = `En l'espèce, ${r.nom} a sa résidence habituelle en France, ${x.nom} résidant ${enPays(x.res)}${deuxFrancais ? ", et les époux sont tous deux de nationalité française" : ""}. La présente convention étant conclue d'un commun accord, les juridictions françaises auraient été compétentes pour connaître de leur divorce en application de l'article 3, a), iv)${pointB}, ${BXL}, qui retient, en cas de demande conjointe, la résidence habituelle de l'un ou l'autre époux.`;
    if (!deuxFrancais)
      alertes.push("Compétence fondée sur la seule résidence en France de l'un des époux (art. 3, a), iv), « demande conjointe ») : application au DCM par analogie, à vérifier.");
  } else if (deuxFrancais) {
    v.ExtraCompetence = `En l'espèce, ${a.nom} et ${b.nom}, qui résident hors de France, sont tous deux de nationalité française. Les juridictions françaises auraient donc été compétentes pour connaître de leur divorce en application de l'article 3, b), ${BXL}.`;
  } else {
    v.ExtraCompetence = "ATTENTION : AUCUN CHEF DE COMPÉTENCE FRANÇAISE N'EST ÉTABLI (AUCUN ÉPOUX NE RÉSIDE EN FRANCE ET LES ÉPOUX N'ONT PAS TOUS DEUX LA NATIONALITÉ FRANÇAISE). LE CERTIFICAT DE L'ARTICLE 66 NE POURRA PAS ÊTRE DÉLIVRÉ.";
    alertes.push("Aucun chef de compétence française (art. 3 de Bruxelles II ter) : divorce par consentement mutuel déconseillé.");
  }

  /* ---------- Loi applicable au divorce ---------- */
  const franco = (e: Epoux) => e.nat.francais || e.nat.pays.includes("Maroc");
  const conventionFM =
    franco(a) && franco(b) && (a.nat.pays.includes("Maroc") || b.nat.pays.includes("Maroc")) &&
    a.nat.pays.every((x) => x === "France" || x === "Maroc") && b.nat.pays.every((x) => x === "France" || x === "Maroc");
  const art309 = (() => {
    const motifs: string[] = [];
    if (deuxFrancais) motifs.push("ayant l'un et l'autre la nationalité française");
    if (enFrance(a) && enFrance(b)) motifs.push("ayant l'un et l'autre leur domicile en France");
    return motifs.length ? `les époux ${motifs.join(" et ")}` : null;
  })();

  if (conventionFM) {
    const binationaux = [a, b].filter((e) => e.nat.francais && e.nat.pays.includes("Maroc"));
    /* « Monsieur X possède également la nationalité marocaine ; seule sa
       nationalité française est retenue par les autorités françaises. » */
    const precision = binationaux.length
      ? ` ${liste(binationaux.map((e) => e.nom))} ${binationaux.length > 1 ? "possèdent" : "possède"} également la nationalité marocaine ; seule ${binationaux.length > 1 ? "leur" : "sa"} nationalité française est retenue par les autorités françaises.`
      : "";
    if (deuxFrancais) {
      v.ExtraLoiDivorce1 = `Les époux ont l'un et l'autre la nationalité française.${precision} En application de l'article 9, alinéa 1er, ${CFM}, la dissolution de leur mariage est régie par la loi de l'État dont ils ont tous deux la nationalité, soit la loi française.`;
      v.ExtraLoiDivorce2 = art309 ? `La loi française est au surplus applicable en vertu de l'article 309 du Code civil, ${art309}.` : null;
    } else if (a.nat.francais || b.nat.francais) {
      const fr = a.nat.francais ? a : b;
      const ma = a.nat.francais ? b : a;
      let domicile: string;
      if (enFrance(a) && enFrance(b) && memeAdresse(a.p, b.p)) domicile = "ont leur domicile commun en France";
      else if (enFrance(a) && enFrance(b)) {
        domicile = "avaient leur dernier domicile commun en France";
        alertes.push("Convention franco-marocaine, art. 9, al. 2 : dernier domicile commun présumé en France (adresses différentes), à vérifier.");
      } else {
        domicile = "ont ou avaient leur dernier domicile commun en France [À VÉRIFIER]";
        alertes.push("Convention franco-marocaine, art. 9, al. 2 : l'un des époux réside hors de France ; vérifier que le dernier domicile commun était en France, sinon la loi de ce domicile s'applique.");
      }
      v.ExtraLoiDivorce1 = `${fr.nom} est de nationalité française et ${ma.nom} de nationalité marocaine.${precision} En application de l'article 9, alinéa 2, ${CFM}, la dissolution du mariage est régie par la loi de l'État sur le territoire duquel les époux ont leur domicile commun ou avaient leur dernier domicile commun, le domicile s'entendant du lieu de la résidence habituelle effective (article 2). Les époux ${domicile} : la loi française est applicable.`;
      v.ExtraLoiDivorce2 = art309 ? `La même solution résulte de l'article 309 du Code civil, ${art309}.` : null;
    } else {
      v.ExtraLoiDivorce1 =
        "ATTENTION : LES DEUX ÉPOUX SONT DE NATIONALITÉ MAROCAINE. L'ARTICLE 9, ALINÉA 1er, DE LA CONVENTION FRANCO-MAROCAINE DU 10 AOÛT 1981 SOUMET LA DISSOLUTION DU MARIAGE À LA LOI MAROCAINE. CLAUSE À RÉDIGER À LA MAIN, OU DIVORCE JUDICIAIRE À ENVISAGER.";
      alertes.push("Deux époux marocains : la convention franco-marocaine (art. 9, al. 1) désigne la loi marocaine. Aucune clause « loi française » n'a été rédigée.");
    }
  } else {
    /* Rome III, art. 5 : choix de la loi française, si elle est l'une des lois
       ouvertes au choix. */
    let base: string | null = null;
    if (enFrance(a) && enFrance(b)) base = "de l'État de leur résidence habituelle au moment de la conclusion de la présente convention";
    else if (a.nat.francais || b.nat.francais) {
      const fr = [a, b].filter((e) => e.nat.francais);
      base = `de l'État dont ${liste(fr.map((e) => e.nom))} ${fr.length > 1 ? "ont" : "a"} la nationalité`;
    } else if (enFrance(a) || enFrance(b)) {
      const r = enFrance(a) ? a : b;
      base = `de l'État de la dernière résidence habituelle des époux, où ${r.nom} réside encore [À VÉRIFIER]`;
      alertes.push("Rome III, art. 5 : ni résidence commune en France ni nationalité française ; le choix de la loi française suppose que la dernière résidence habituelle commune ait été en France. À vérifier.");
    }
    if (base) {
      v.ExtraLoiDivorce1 = `En application de l'article 5 ${ROME}, les époux conviennent expressément, par la présente convention établie par écrit, datée et signée par eux, de soumettre leur divorce à la loi française, loi ${base}.`;
      v.ExtraLoiDivorce2 = art309
        ? `En tant que de besoin, l'application de ce règlement au divorce sans juge étant discutée ${SAHYOUNI}, la loi française est également applicable en vertu de l'article 309 du Code civil, ${art309}.`
        : null;
    } else {
      v.ExtraLoiDivorce1 = "ATTENTION : LA LOI FRANÇAISE NE PEUT PAS ÊTRE CHOISIE (AUCUN ÉPOUX NE RÉSIDE EN FRANCE NI N'A LA NATIONALITÉ FRANÇAISE). CLAUSE À RÉDIGER À LA MAIN.";
      alertes.push("Loi française non accessible au choix (Rome III, art. 5).");
    }
  }

  /* ---------- Régime matrimonial ---------- */
  const m = d.mariage;
  /* Lieu du mariage saisi « Ville (Département) » ou « Ville (Pays) ». */
  const paysLieu = (() => {
    const x = /\(([^)]+)\)\s*$/.exec(m.lieu || "");
    if (!x) return "France";
    const t = sansAccents(x[1]);
    const trouve = PAYS_ADRESSE.find(([re]) => re.test(t));
    return trouve ? trouve[1] : "France";
  })();
  const date = m.date || "";
  const dateTexte = date ? dateCourte(date) : "[DATE DU MARIAGE]";
  if (m.contrat === "Oui") {
    v.ExtraRegime = `Les époux ont fait précéder leur union d'un contrat de mariage reçu${m.dateContrat ? ` le ${dateCourte(m.dateContrat)}` : ""} par Maître ${m.notaire || "[NOTAIRE]"}, notaire à ${(m.villeNotaire || "[VILLE]").toUpperCase()}, portant adoption du régime de la ${m.regime && m.regime !== "ne sait pas" ? m.regime : "[RÉGIME]"} du Code civil. Leur régime matrimonial est ainsi soumis à la loi française, désignée par ce contrat.`;
    alertes.push("Régime matrimonial : vérifier que le contrat de mariage désigne expressément la loi française.");
  } else {
    const premiere = paysLieu === "France" ? "la France" : null;
    if (!premiere)
      alertes.push(`Régime matrimonial : mariage célébré hors de France (${m.lieu || "lieu non renseigné"}) ; vérifier le pays de la première résidence habituelle commune après le mariage.`);
    const pays = premiere || "la France [À VÉRIFIER]";
    let regle: string;
    if (date >= "2019-01-29")
      regle = `la loi applicable à leur régime matrimonial est déterminée par le règlement (UE) 2016/1103 du Conseil du 24 juin 2016. À défaut de choix, l'article 26 de ce règlement la soumet à la loi de l'État de la première résidence habituelle commune des époux après la célébration du mariage, soit ${pays}`;
    else if (date >= "1992-09-01")
      regle = `la loi applicable à leur régime matrimonial est déterminée par la Convention de La Haye du 14 mars 1978 sur la loi applicable aux régimes matrimoniaux. À défaut de désignation, son article 4 la soumet à la loi interne de l'État sur le territoire duquel les époux ont établi leur première résidence habituelle après le mariage, soit ${pays}`;
    else if (date)
      regle = `la loi applicable à leur régime matrimonial est déterminée par la règle de conflit française antérieure à la Convention de La Haye du 14 mars 1978, qui retient la loi du premier domicile matrimonial, soit ${pays}`;
    else regle = `la loi applicable à leur régime matrimonial est celle de ${pays} [DATE DU MARIAGE À COMPLÉTER]`;
    v.ExtraRegime = `Les époux s'étant mariés le ${dateTexte} sans contrat de mariage, ${regle}. Ils sont donc soumis au régime légal français de la communauté de biens réduite aux acquêts${premiere ? "" : ", sous la même réserve"}.`;
  }

  /* ---------- Obligations alimentaires et autorité parentale ---------- */
  const phrases: string[] = [];
  const mineurs = d.enfants.filter((e) => e.garde && !/^Majeur/.test(e.garde));
  if (mineurs.length) {
    const residences = new Set<string>();
    for (const e of mineurs) {
      if (e.garde === "Moi") residences.add(a.res);
      else if (e.garde === "Mon époux(se)") residences.add(b.res);
      else { residences.add(a.res); residences.add(b.res); }
    }
    if (residences.size === 1 && residences.has("France")) {
      phrases.push(`${mineurs.length > 1 ? "Les enfants résidant" : "L'enfant résidant"} habituellement en France, la loi française régit la contribution à ${mineurs.length > 1 ? "leur" : "son"} entretien et à ${mineurs.length > 1 ? "leur" : "son"} éducation (article 3 du protocole de La Haye du 23 novembre 2007 sur la loi applicable aux obligations alimentaires) ainsi que l'exercice de l'autorité parentale (article 17 de la Convention de La Haye du 19 octobre 1996).`);
    } else {
      phrases.push("ATTENTION : RÉSIDENCE HABITUELLE D'UN ENFANT HORS DE FRANCE. LOI APPLICABLE À LA CONTRIBUTION ET À L'AUTORITÉ PARENTALE À DÉTERMINER.");
      alertes.push("Un enfant réside hors de France : loi de la contribution et de l'autorité parentale à déterminer ; convention parentale homologuée à envisager.");
    }
  }
  if (d.procedure === "Divorce" && d.pc.convenue === "Oui") {
    const creancier = d.pc.beneficiaire === "Moi" ? a : d.pc.beneficiaire === "Mon époux(se)" ? b : null;
    if (creancier && enFrance(creancier))
      phrases.push(`Quelle que soit sa qualification, la prestation compensatoire est soumise à la loi française, loi du divorce, qui est aussi celle de la résidence habituelle de ${creancier.nom}, ${creancier.feminin ? "créancière" : "créancier"} (article 3 du protocole de La Haye du 23 novembre 2007).`);
    else {
      phrases.push("ATTENTION : LE CRÉANCIER DE LA PRESTATION COMPENSATOIRE NE RÉSIDE PAS EN FRANCE OU N'EST PAS DÉSIGNÉ. LOI APPLICABLE À VÉRIFIER.");
      alertes.push("Prestation compensatoire : créancier hors de France ou non désigné, loi applicable à vérifier.");
    }
  }
  if (phrases.length) {
    v.ExtraAliments = phrases.join(" ");
    v.ExtraAlimentsPresent = "Oui";
  }

  v.ExtraAlerte = alertes.length ? `ATTENTION, POINTS À VÉRIFIER AVANT SIGNATURE : ${alertes.join(" ")}` : null;
  return { valeurs: v, alertes };
}

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
function dateCourte(iso: string): string {
  const x = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  if (!x) return iso;
  const j = Number(x[3]);
  return `${j === 1 ? "1er" : j} ${MOIS[Number(x[2]) - 1]} ${x[1]}`;
}

/* ---------- Profession ---------- */

export type Activite = { entete: string; phrase: string; participe: string };

/* « Officier d'état civil » → « exerce la profession d'officier d'état civil » ;
   « sans » → « est sans profession » ; « chômage » → « est actuellement à la
   recherche d'un emploi ». */
export function activite(brut: string | undefined, feminin: boolean): Activite | null {
  const t = (brut || "").trim().replace(/\s+/g, " ");
  if (!t) return null;
  const s = sansAccents(t).replace(/[.]/g, "").trim();
  const e = feminin ? "e" : "";
  if (/^(-+|sans|aucun|aucune|neant|nean|nc|inactif|inactive|sans profession|sans activite|sans activite professionnelle|au foyer|(mere|femme|pere|homme) au foyer)$/.test(s))
    return { entete: "Sans profession", phrase: "est sans profession", participe: "sans profession" };
  if (/chomage|chomeu|demandeu[rs]e? d.? ?emploi|recherche d.? ?emploi|sans emploi|en recherche/.test(s))
    return {
      entete: "En recherche d'emploi",
      phrase: "est actuellement à la recherche d'un emploi",
      participe: "actuellement à la recherche d'un emploi",
    };
  if (/^retraite?e?$/.test(s)) return { entete: `Retraité${e}`, phrase: `est retraité${e}`, participe: `retraité${e}` };
  if (/^etudiant(e)?$/.test(s)) return { entete: `Étudiant${e}`, phrase: `est étudiant${e}`, participe: `étudiant${e}` };
  if (/^(lyceen|lyceenne|collegien|collegienne|eleve|scolarise|scolarisee)$/.test(s)) {
    const x = minuscule(t);
    return { entete: t, phrase: `est ${x}`, participe: x };
  }
  const x = minuscule(t);
  const de = /^[aeiouyhâàäéèêëîïôöûùüœ]/i.test(x) ? `d'${x}` : `de ${x}`;
  return {
    entete: t.charAt(0).toUpperCase() + t.slice(1),
    phrase: `exerce la profession ${de}`,
    participe: `exerçant la profession ${de}`,
  };
}

/* Première lettre en minuscule, sauf sigle (« RH », « DRH »). */
function minuscule(t: string): string {
  const premier = t.split(" ")[0];
  if (premier.length > 1 && premier === premier.toUpperCase()) return t;
  return t.charAt(0).toLowerCase() + t.slice(1);
}
