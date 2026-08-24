import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Lato } from "next/font/google";
import Script from "next/script";
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

export const viewport: Viewport = {
  themeColor: "#362A24",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://fain-avocats.fr"),
  // Canonique auto-referente : Next resout "./" contre metadataBase + le chemin de la page.
  alternates: { canonical: "./" },
  title: "Fain Avocats | Avocat Droit de la Famille Paris 16 - Divorce & Patrimoine",
  description: "Cabinet d'avocats intervenant principalement en droit de la famille à Paris 16ème (Avenue Victor Hugo). Divorce, garde d'enfants, pension alimentaire, liquidation du régime matrimonial. Premier entretien téléphonique gratuit. Intervention rapide et humaine.",
  keywords: ["Avocat divorce Paris 16", "Avocat droit famille Paris", "Avocat divorce consentement mutuel Paris", "Cabinet avocat Victor Hugo", "Garde enfants Paris", "Pension alimentaire avocat"],
  authors: [{ name: "Fain Avocats" }],
  creator: "Fain Avocats",
  publisher: "Fain Avocats",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Fain Avocats | L'excellence en Droit de la Famille - Paris 16",
    description: "Cabinet en droit de la famille depuis 20 ans. Divorce, séparation, enfants. Une approche humaine et stratégique pour protéger vos intérêts.",
    url: "https://fain-avocats.fr",
    siteName: "Fain Avocats",
    images: [
      {
        url: "https://fain-avocats.fr/DSC01907.webp",
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
    description: "Cabinet d'avocats en droit de la famille à Paris 16ème. Noté 4,7/5 sur plus de 400 avis Google. Premier entretien téléphonique gratuit.",
    images: ["https://fain-avocats.fr/DSC01907.webp"],
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
      "@id": "https://fain-avocats.fr/#attorney",
      name: "Fain Avocats",
      description: "Cabinet d'avocats en droit de la famille à Paris 16ème. Divorce, garde d'enfants, liquidation du régime matrimonial.",
      url: "https://fain-avocats.fr",
      telephone: "+33140680237",
      email: "contact@fain-avocats.fr",
      image: "https://fain-avocats.fr/DSC01907.webp",
      priceRange: "€€",
      address: {
        "@type": "PostalAddress",
        streetAddress: "196 avenue Victor Hugo",
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
      sameAs: [
        "https://maps.google.com/?cid=3809691522538758505",
        "https://www.linkedin.com/in/fainavocat/"
      ],
      areaServed: {
        "@type": "City",
        name: "Paris"
      },
      knowsAbout: [
        "Divorce", "Droit de la famille", "Garde d'enfants",
        "Pension alimentaire", "Liquidation du régime matrimonial"
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
        {/* Agent vocal IA IONOS (AI Frontdesk) */}
        <Script
          src="https://ionos.ai-voicereceptionist.com/widget/v1/embed.js"
          data-agent-id="a327e0a2-8464-4750-b1b2-ed7c15cce267"
          strategy="afterInteractive"
        />
        <Script src="https://identity.netlify.com/v1/netlify-identity-widget.js" strategy="lazyOnload" />
        <Script id="netlify-identity-redirect" strategy="lazyOnload">{`
          if (window.netlifyIdentity) {
            window.netlifyIdentity.on("init", function(user) {
              if (!user) {
                window.netlifyIdentity.on("login", function() {
                  document.location.href = "/admin/";
                });
              }
            });
          }
        `}</Script>
      </body>
    </html>
  );
}
