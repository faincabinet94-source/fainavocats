import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Provision réglée | Fain Avocats",
  robots: { index: false, follow: false },
};

export default function ProvisionRegleeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
