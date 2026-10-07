import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Règlement d'honoraires | Fain Avocats",
  description: "Réglez vos honoraires ou votre solde en ligne, par carte bancaire, paiement sécurisé par Stripe.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
