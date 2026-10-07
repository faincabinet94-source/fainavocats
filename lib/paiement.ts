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

export function messageConjoint(x: DemandeConjoint): { a: string; objet: string; corps: string } {
  const quoi = x.procedure === "Séparation de corps" ? "notre séparation de corps" : "notre divorce par consentement mutuel";
  const montant = PROVISIONS[x.part].montant;
  const lignes =
    x.part === "moitie"
      ? [
          "Bonjour,",
          "",
          `J'ai réglé ma part de la provision qui lance ${quoi} auprès du cabinet Fain Avocats.`,
          `Il reste la seconde moitié, ${montant}, à régler par ce lien sécurisé :`,
          lienProvision("moitie", x.email),
          "",
          "La procédure commence dès réception des deux règlements.",
        ]
      : [
          "Bonjour,",
          "",
          `Pour lancer ${quoi} auprès du cabinet Fain Avocats, la provision de ${montant} est à régler par ce lien sécurisé :`,
          lienProvision("totale", x.email),
          "",
          "La procédure commence dès sa réception.",
        ];
  if (x.prenomClient.trim()) lignes.push("", x.prenomClient.trim());
  return { a: x.email.trim(), objet: `Provision pour ${quoi}`, corps: lignes.join("\r\n") };
}

/* Le lien mailto: n'ouvre rien quand l'ordinateur n'a pas d'application de
   messagerie (Gmail ou Outlook dans le navigateur) : on propose aussi les
   pages de rédaction de Gmail et d'Outlook, et la copie du message. */
export function liensMessagerie(x: DemandeConjoint) {
  const m = messageConjoint(x);
  const e = encodeURIComponent;
  return {
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${e(m.a)}&su=${e(m.objet)}&body=${e(m.corps)}`,
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${e(m.a)}&subject=${e(m.objet)}&body=${e(m.corps)}`,
    application: `mailto:${e(m.a).replace("%40", "@")}?subject=${e(m.objet)}&body=${e(m.corps)}`,
    texte: `À : ${m.a}\r\nObjet : ${m.objet}\r\n\r\n${m.corps}`,
  };
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

/* Retour vers l'espace client après un paiement lancé depuis celui-ci.
   Les pages de paiement reçoivent « ?retour=espace » ; elles le transmettent
   à la page de confirmation (par l'adresse de retour du prestataire quand
   c'est possible, par le navigateur sinon), qui propose « Retour à mon
   espace » et y renvoie d'elle-même. */
export const RETOUR_ESPACE = "espace";
export const ESPACE_CLIENT_URL =
  process.env.NEXT_PUBLIC_ESPACE_CLIENT_URL || "https://espace.fain-avocats.fr/espace/honoraires";
const CLE_RETOUR = "fain-paiement-retour";

/* À l'arrivée sur une page de paiement : garde la demande de retour le temps
   du passage chez le prestataire (même onglet). */
export function memoriserRetour(retour: string | null | undefined) {
  try {
    if (retour === RETOUR_ESPACE) sessionStorage.setItem(CLE_RETOUR, RETOUR_ESPACE);
  } catch {
    /* navigation privée : l'adresse de retour du prestataire suffit en général */
  }
}

/* Sur une page de confirmation : l'adresse d'abord, le navigateur ensuite. */
export function retourEspaceDemande(q?: { get(nom: string): string | null } | null): boolean {
  if (q?.get("retour") === RETOUR_ESPACE) return true;
  try {
    return sessionStorage.getItem(CLE_RETOUR) === RETOUR_ESPACE;
  } catch {
    return false;
  }
}

export function oublierRetour() {
  try {
    sessionStorage.removeItem(CLE_RETOUR);
  } catch {}
}
