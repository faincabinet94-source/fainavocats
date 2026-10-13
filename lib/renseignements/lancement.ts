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

/* 2A (le conjoint a ou aura son propre avocat) : pas d'invitation du conjoint
   par le cabinet. Le client confie au cabinet un courrier d'usage, sur
   convention d'honoraires CH CU et provision de 250 € (décision de Me FAIN du
   2026-10-12). Destinataire : l'avocat du conjoint si son courriel est connu,
   sinon le conjoint lui-même. Coffre : espace-client-validation-conjoint.md. */
export const CASES_USAGE = { convention: "", execution: "" } as const;

export function casesUsage(
  procedure: string,
  destinataire: "confrere" | "conjoint",
  avocatDejaChoisi = false,
): Record<keyof typeof CASES_USAGE, string> {
  const proc = procedure === "Séparation de corps" ? "une séparation de corps par consentement mutuel" : "un divorce par consentement mutuel";
  const cetteProc = procedure === "Séparation de corps" ? "cette séparation de corps" : "ce divorce";
  const a =
    destinataire === "confrere"
      ? "à l'avocat de mon conjoint"
      : avocatDejaChoisi
        ? "à mon conjoint, à remettre à son avocat"
        : "à mon conjoint, l'invitant à choisir son avocat";
  return {
    convention:
      `J'ai pris connaissance de la convention d'honoraires. La provision de 250 € TTC rémunère l'envoi d'un courrier ${a}, ` +
      `une première consultation et les premiers échanges avec son avocat, afin de déterminer si ${proc} est possible. ` +
      `Si ${cetteProc} peut être engagé, une nouvelle convention d'honoraires me sera adressée et ces 250 € s'imputeront sur son forfait.`,
    execution:
      "Je demande au cabinet de commencer sa mission sans attendre la fin du délai de rétractation de quatorze jours. " +
      "Si je me rétracte ensuite, je reste redevable des diligences déjà accomplies.",
  };
}
