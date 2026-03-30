import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paiement Sécurisé | Acompte Honoraires - Fain Avocats Paris",
  description:
    "Réglez votre acompte sur honoraires en toute sécurité. Paiement en ligne sécurisé par Stancer, agréé ACPR (Banque de France). Cabinet Fain Avocats Paris 16ème.",
  keywords: [
    "paiement avocat en ligne",
    "acompte honoraires avocat",
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
