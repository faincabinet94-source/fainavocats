import type { Metadata } from "next";

/* Page de paiement Stancer d'origine (montant au choix), remise en service le
   2026-09-27 à côté des pages Stripe, SumUp et Alma. Clés Netlify :
   STANCER_SECRET_KEY et STANCER_PUBLIC_KEY. */
export const metadata: Metadata = {
  title: "Paiement en ligne | Fain Avocats Paris",
  description: "Réglez votre acompte sur honoraires en ligne. Paiement sécurisé par Stancer. Cabinet Fain Avocats, PARIS 16.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
