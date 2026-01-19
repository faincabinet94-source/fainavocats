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
  metadataBase: new URL("https://www.fain-avocats.fr"),
  title: "Fain Avocats | Avocat Droit de la Famille Paris 16 - Divorce & Patrimoine",
  description: "Cabinet d'avocats expert en droit de la famille à Paris 16ème (Avenue Victor Hugo). Divorce, garde d'enfants, pension alimentaire, successions. Premier entretien téléphonique gratuit. Intervention rapide et humaine.",
  keywords: ["Avocat divorce Paris 16", "Avocat droit famille Paris", "Meilleur avocat divorce Paris", "Cabinet avocat Victor Hugo", "Garde enfants Paris", "Pension alimentaire avocat"],
  authors: [{ name: "Fain Avocats" }],
  creator: "Fain Avocats",
  publisher: "Fain Avocats",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Fain Avocats | L'excellence en Droit de la Famille - Paris 16",
    description: "Cabinet spécialisé depuis 20 ans. Divorce, séparation, enfants. Une approche humaine et stratégique pour protéger vos intérêts.",
    url: "https://www.fain-avocats.fr",
    siteName: "Fain Avocats",
    images: [
      {
        url: "/DSC01907.webp", // Votre belle image de bureau
        width: 1200,
        height: 630,
        alt: "Cabinet Fain Avocats Paris 16",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
