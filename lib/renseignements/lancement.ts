/* Choix de lancement en fin de formulaire (option 1 « lancer maintenant »,
   option 2 « vérifier d'abord l'accord de mon époux »). Partagé entre la page
   et la route app/api/renseignements/lancement. */

/* Textes exacts des cases (coffre, textes-parcours-conjoint.md, section 2), alignés
   sur les conventions d'honoraires CH DCM1A M et T d'Airtable (article 9). Pas de
   case sur le délai de rétractation : décision de Me FAIN du 2026-10-02. */
export const CASES_IMMEDIAT = {
  certification:
    "Je certifie que mon époux et moi sommes d'accord sur l'ensemble des conséquences de notre divorce, et notamment : l'usage du nom de famille après le divorce ; le sort du logement familial ; le partage de nos biens communs ou indivis et de nos dettes ; la prestation compensatoire, ou l'absence de prestation compensatoire ; la résidence des enfants et le droit de visite et d'hébergement ; la contribution à l'entretien et à l'éducation des enfants.",
  provision:
    "J'ai pris connaissance de la convention d'honoraires. La provision de 250 € rémunère l'analyse de ma situation et l'établissement du projet de convention de divorce. Elle reste acquise une fois ce projet établi, même si le divorce par consentement mutuel ne peut aboutir. Elle s'impute sur mes honoraires.",
} as const;


/** Les mêmes textes pour la procédure du formulaire (séparation de corps : « de notre séparation de corps »). */
export function casesImmediat(procedure: string): Record<keyof typeof CASES_IMMEDIAT, string> {
  if (procedure !== "Séparation de corps") return { ...CASES_IMMEDIAT };
  const r = (t: string) =>
    t
      .replace("de notre divorce", "de notre séparation de corps")
      .replace("après le divorce", "pendant la séparation de corps")
      .replace("la prestation compensatoire, ou l'absence de prestation compensatoire", "le devoir de secours, ou l'absence de devoir de secours")
      .replace(/convention de divorce/g, "convention de séparation de corps")
      .replace("le divorce par consentement mutuel", "la séparation de corps par consentement mutuel");
  return {
    certification: r(CASES_IMMEDIAT.certification),
    provision: r(CASES_IMMEDIAT.provision),
  };
}
