/* Liens de paiement Stripe de la provision de départ (divorce par consentement
   mutuel). Liens directs buy.stripe.com : les alias pay.fain-avocat.fr/p1 & co
   (netlify.toml) mènent aux mêmes pages, mais passer par Stripe directement
   évite une redirection et conserve le courriel prérempli. */
export const PROVISIONS = {
  totale: { montant: "250 €", url: "https://buy.stripe.com/bIY16Y5h00MQ04o5kt" },
  moitie: { montant: "125 €", url: "https://buy.stripe.com/5kA7vm9xggLOcRa6op" },
} as const;

export type Provision = keyof typeof PROVISIONS;

/* Tarifs Stripe des mêmes liens, pour le paiement intégré au site
   (app/api/provision) : « Provision sur procédure de divorce » et « Chaque
   conjoint supporte sa provision ». */
export const PRIX_PROVISIONS: Record<Provision, string> = {
  totale: "price_1JyuXUF01Hy0M6yTcVAAUcRH",
  moitie: "price_1JotolF01Hy0M6yTlwdlvGsb",
};

/* Stripe préremplit le courriel du payeur avec prefilled_email. */
export function lienProvision(p: Provision, email?: string): string {
  const u = new URL(PROVISIONS[p].url);
  u.searchParams.set("locale", "fr");
  const e = (email || "").trim();
  if (e) u.searchParams.set("prefilled_email", e);
  return u.toString();
}

/* Courriel que le client adresse lui-même à son conjoint, depuis sa propre
   messagerie (lien mailto:), pour lui demander de régler sa part ou la
   totalité de la provision. Le cabinet n'écrit pas au conjoint. */
export type DemandeConjoint = {
  email: string;
  prenomClient: string;
  procedure: string;
  part: Provision;
};

export function courrielConjoint(x: DemandeConjoint): string {
  const objet = x.procedure === "Séparation de corps" ? "notre séparation de corps" : "notre divorce par consentement mutuel";
  const montant = PROVISIONS[x.part].montant;
  const lignes =
    x.part === "moitie"
      ? [
          "Bonjour,",
          "",
          `J'ai réglé ma part de la provision qui lance ${objet} auprès du cabinet Fain Avocats.`,
          `Il reste la seconde moitié, ${montant}, à régler par ce lien sécurisé :`,
          lienProvision("moitie", x.email),
          "",
          "La procédure commence dès réception des deux règlements.",
        ]
      : [
          "Bonjour,",
          "",
          `Pour lancer ${objet} auprès du cabinet Fain Avocats, la provision de ${montant} est à régler par ce lien sécurisé :`,
          lienProvision("totale", x.email),
          "",
          "La procédure commence dès sa réception.",
        ];
  if (x.prenomClient.trim()) lignes.push("", x.prenomClient.trim());
  const q = [
    `subject=${encodeURIComponent(`Provision pour ${objet}`)}`,
    `body=${encodeURIComponent(lignes.join("\r\n"))}`,
  ].join("&");
  return `mailto:${encodeURIComponent(x.email.trim()).replace("%40", "@")}?${q}`;
}

/* Mémorisé dans le navigateur au moment où le client part payer sa part : la
   page /provision-reglee, où Stripe le renvoie après paiement, s'en sert pour
   lui proposer d'écrire à son conjoint. */
export const CLE_DEMANDE = "fain-provision-conjoint";

export function memoriserDemande(x: DemandeConjoint) {
  try {
    localStorage.setItem(CLE_DEMANDE, JSON.stringify({ ...x, le: Date.now() }));
  } catch {
    /* navigation privée : la page de retour affichera un simple remerciement */
  }
}

export function lireDemande(): DemandeConjoint | null {
  try {
    const j = JSON.parse(localStorage.getItem(CLE_DEMANDE) || "null");
    if (!j || typeof j.email !== "string" || Date.now() - Number(j.le) > 30 * 24 * 3600 * 1000) return null;
    return { email: j.email, prenomClient: String(j.prenomClient || ""), procedure: String(j.procedure || ""), part: j.part === "totale" ? "totale" : "moitie" };
  } catch {
    return null;
  }
}
