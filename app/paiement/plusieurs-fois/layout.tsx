import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paiement en 3 ou 4 fois | Fain Avocats",
  description: "Réglez vos honoraires en 3 ou 4 fois par carte bancaire avec Alma. Cabinet Fain Avocats, PARIS 16.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
