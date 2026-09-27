import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Versement libre | Fain Avocats",
  description: "Réglez par carte bancaire le montant convenu avec le cabinet Fain Avocats. Paiement sécurisé.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
