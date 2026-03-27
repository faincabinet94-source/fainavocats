import type { Metadata } from "next";
import { Cormorant_Garamond, Lato } from "next/font/google";
import "./globals.css";

const playfair = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
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
        url: "https://www.fain-avocats.fr/DSC01907.webp",
        width: 1200,
        height: 630,
        alt: "Cabinet Fain Avocats Paris 16",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fain Avocats | Avocat Droit de la Famille Paris 16",
    description: "Cabinet expert en droit de la famille à Paris 16ème. Noté 4,7/5 sur 416 avis Google. Premier entretien téléphonique gratuit.",
    images: ["https://www.fain-avocats.fr/DSC01907.webp"],
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Attorney",
      "@id": "https://www.fain-avocats.fr/#attorney",
      name: "Fain Avocats",
      description: "Cabinet d'avocats expert en droit de la famille à Paris 16ème. Divorce, garde d'enfants, patrimoine, successions.",
      url: "https://www.fain-avocats.fr",
      telephone: "+33140680237",
      email: "contact@fain-avocats.fr",
      image: "https://www.fain-avocats.fr/DSC01907.webp",
      priceRange: "€€",
      address: {
        "@type": "PostalAddress",
        streetAddress: "196 Avenue Victor Hugo",
        addressLocality: "Paris",
        postalCode: "75116",
        addressCountry: "FR"
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 48.866039,
        longitude: 2.279567
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "19:00"
        }
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.7",
        reviewCount: "416",
        bestRating: "5"
      },
      areaServed: {
        "@type": "City",
        name: "Paris"
      },
      knowsAbout: [
        "Divorce", "Droit de la famille", "Garde d'enfants",
        "Pension alimentaire", "Patrimoine", "Successions"
      ]
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Comment fonctionne la première prise de contact ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Nous proposons un premier entretien téléphonique gratuit. Cela nous permet de comprendre votre situation et de vous confirmer si nous sommes le bon cabinet pour vous accompagner."
          }
        },
        {
          "@type": "Question",
          name: "Quel est le coût d'une consultation au cabinet ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Si une analyse approfondie de votre dossier est nécessaire, nous vous proposons une consultation au cabinet facturée 120€ TTC. Ce montant est déductible de nos honoraires si vous nous confiez votre dossier."
          }
        },
        {
          "@type": "Question",
          name: "Quels sont les délais pour obtenir un rendez-vous ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Nous nous engageons à vous proposer un créneau sous 24 à 48h ouvrées. En cas d'urgence (violences, enlèvement d'enfant), nous vous recevons dans la journée."
          }
        },
        {
          "@type": "Question",
          name: "Comment sont fixés vos honoraires ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Nous privilégions la transparence totale. Une convention d'honoraires écrite vous est systématiquement proposée avant toute démarche, le plus souvent sous forme de forfait pour que vous maîtrisiez votre budget."
          }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${lato.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-[#F4F2EC] text-[#1A1A1A] antialiased selection:bg-[#1A1A1A] selection:text-white">
        {children}
      </body>
    </html>
  );
}
