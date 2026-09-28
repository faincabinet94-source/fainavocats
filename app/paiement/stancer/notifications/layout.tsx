import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications Stancer | Fain Avocats",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
