import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paiement en Ligne Sécurisé | Honoraires Avocat - Fain Avocats Paris",
  description:
    "Réglez vos honoraires en toute sécurité. Paiement en ligne sécurisé par Stancer, agréé ACPR (Banque de France). Cabinet Fain Avocats Paris 16ème.",
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
