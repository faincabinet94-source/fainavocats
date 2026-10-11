/* Lectures proposées sous chaque étape du formulaire de renseignements
 * (version client), pour aider à répondre. Rubriques du site réorganisées le
 * 2026-10-11 : guides sous /fiches/<slug>, actualités sous /actualites/<slug>.
 *
 * Comme l'encadré « Votre convention, point par point » de /divorce-sans-juge,
 * un guide pas encore publié n'apparaît pas (filtré côté serveur par
 * guidesDisponibles) : la liste se remplit seule au fil des publications, sans
 * lien mort. L'indice est celui de l'étape dans ETAPES (0 = « Votre procédure »). */

/* quand : n'afficher le guide que s'il concerne la situation déclarée
   (époux étranger, enfants, enfant de 10 ans et plus, résidence alternée). */
export type Quand = "etranger" | "enfants" | "enfant10" | "alternee";
export type Lecture = { type: "fiche" | "actualite"; slug: string; procedure?: "Divorce" | "Séparation de corps"; quand?: Quand };
export type Lien = { href: string; titre: string; procedure?: Lecture["procedure"]; quand?: Quand };

const f = (slug: string, procedure?: Lecture["procedure"], quand?: Quand): Lecture => ({ type: "fiche", slug, procedure, quand });
const a = (slug: string, procedure?: Lecture["procedure"], quand?: Quand): Lecture => ({ type: "actualite", slug, procedure, quand });

export const LECTURES_ETAPES: Record<number, Lecture[]> = {
  /* 1. Votre procédure */
  0: [
    a("divorce-sans-juge-le-nouveau-divorce-par-consentement-mutuel", "Divorce"),
    f("apres-signature-convention-divorce-etapes", "Divorce"),
    f("separation-corps-procedure", "Séparation de corps"),
    f("separation-corps-effets", "Séparation de corps"),
  ],
  /* 2. Vous / 3. Votre conjoint : nationalité étrangère */
  1: [f("reconnaissance-divorce-sans-juge-etranger", "Divorce", "etranger"), f("divorce-titre-sejour", undefined, "etranger")],
  2: [f("reconnaissance-divorce-sans-juge-etranger", "Divorce", "etranger")],
  /* 4. Le mariage */
  3: [f("regimes-matrimoniaux"), f("donations-avantages-matrimoniaux-divorce", "Divorce")],
  /* 5. Le logement */
  4: [
    f("domicile-conjugal-solidarite-epoux-divorce"),
    a("domicile-conjugal-divorce-droits-obligations"),
    a("solidarite-loyer-epoux-depart-domicile-conjugal"),
  ],
  /* 6. Les enfants */
  5: [
    f("divorce-sans-juge-audition-enfant", "Divorce", "enfant10"),
    f("residence-alternee-divorce-organisation", undefined, "alternee"),
    f("pension-alimentaire-enfants", undefined, "enfants"),
    f("frais-exceptionnels-enfants-divorce", undefined, "enfants"),
    f("intermediation-financiere-pension-alimentaire", undefined, "enfants"),
    f("transmission-nom-famille-enfant", undefined, "enfants"),
  ],
  /* 7. L'actif */
  6: [
    f("divorce-bien-immobilier-etat-liquidatif-notaire"),
    f("recompense-communaute-valeurs-mobilieres-divorce"),
    f("droit-de-partage-vendre-le-bien-avant-la-separation"),
  ],
  /* 8. Le passif */
  7: [f("credit-commun-apres-divorce-banque"), f("pret-commun-indemnite-occupation-neutraliser-creance-divorce"), f("impots-annee-divorce-solidarite-fiscale")],
  /* 9. Prestation compensatoire (devoir de secours en séparation de corps) */
  8: [
    f("condition-attribution-prestation-compensatoire", "Divorce"),
    f("calcul-prestation-compensatoire", "Divorce"),
    f("formes-prestation-compensatoire", "Divorce"),
    f("prestation-compensatoire-fiscalite", "Divorce"),
    f("separation-corps-effets", "Séparation de corps"),
  ],
  /* 10. Le nom d'usage */
  9: [f("nom-usage-apres-divorce", "Divorce"), f("reprendre-nom-premier-mari-apres-second-divorce", "Divorce")],
  /* 11. Les honoraires */
  10: [f("cout-procedure-divorce"), a("combien-coute-un-divorce-en-2026")],
};

/* Guide de l'info-bulle « Date des effets » (version cabinet). */
export const LECTURE_DATE_EFFETS: Lecture = f("date-effets-divorce-entre-epoux");

export type Guides = { etapes: Record<number, Lien[]>; dateEffets: Lien | null };
export const AUCUN_GUIDE: Guides = { etapes: {}, dateEffets: null };
