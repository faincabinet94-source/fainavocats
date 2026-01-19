import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fain Avocats - Cabinet d'avocats en droit de la famille à Paris",
  description: "Cabinet parisien spécialisé en droit de la famille depuis plus de 20 ans. Divorce, garde d'enfants, pension alimentaire. Excellence juridique et accompagnement sur-mesure. Paris 16ème.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${lato.variable}`}>
      <body className="font-sans bg-[#F9F8F6] text-[#1A1A1A] antialiased selection:bg-[#1A1A1A] selection:text-white">
        {children}
      </body>
    </html>
  );
}
