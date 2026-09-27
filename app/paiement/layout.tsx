import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paiement de la provision | Fain Avocats Paris",
  description:
    "Réglez en ligne la provision qui lance votre procédure. Paiement sécurisé par Stripe. Cabinet Fain Avocats, PARIS 16.",
  keywords: [
    "paiement avocat en ligne",
    "paiement honoraires avocat",
    "paiement sécurisé avocat",
    "paiement cabinet avocat paris",
  ],
};

export default function PaiementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
