/* Liens de paiement Stripe de la provision de départ (divorce par consentement
   mutuel). Liens directs buy.stripe.com : les alias pay.fain-avocat.fr/p1 & co
   (netlify.toml) mènent aux mêmes pages, mais passer par Stripe directement
   évite une redirection et conserve le courriel prérempli. */
export const PROVISIONS = {
  totale: { montant: "250 €", url: "https://buy.stripe.com/bIY16Y5h00MQ04o5kt" },
  moitie: { montant: "125 €", url: "https://buy.stripe.com/5kA7vm9xggLOcRa6op" },
} as const;

export type Provision = keyof typeof PROVISIONS;

/* Stripe préremplit le courriel du payeur avec prefilled_email. */
export function lienProvision(p: Provision, email?: string): string {
  const u = new URL(PROVISIONS[p].url);
  u.searchParams.set("locale", "fr");
  const e = (email || "").trim();
  if (e) u.searchParams.set("prefilled_email", e);
  return u.toString();
}
