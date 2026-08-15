import type { Metadata } from "next";

// Formulaire d'intake client : utile aux clients par lien direct, mais
// n'a rien a faire dans l'index Google (audit SEO du 2026-08-15).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function FormDcmLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
