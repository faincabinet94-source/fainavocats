import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FloatingCTA } from "@/components/ui/FloatingCTA";
import { Container } from "@/components/ui/Container";
import { getFichesByCategory } from "@/lib/fiches";

const metaTitle =
  "Liquidation du régime matrimonial | Avocat divorce Paris — Fain Avocats";
const metaDescription =
  "Partage des biens, récompenses, indemnité d'occupation, indivision : comprendre la liquidation du régime matrimonial lors d'un divorce. Fain Avocats, Paris 16.";

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  keywords: [
    "liquidation régime matrimonial",
    "partage des biens divorce",
    "récompenses communauté",
    "indemnité d'occupation",
    "indivision post-communautaire",
    "avocat divorce paris",
  ],
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    url: "https://fain-avocats.fr/liquidation-regimes-matrimoniaux",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Fain Avocats — Liquidation du régime matrimonial",
  description: metaDescription,
  url: "https://fain-avocats.fr/liquidation-regimes-matrimoniaux",
  provider: {
    "@type": "Attorney",
    name: "Fain Avocats",
    telephone: "+33140680237",
    address: {
      "@type": "PostalAddress",
      streetAddress: "196 Avenue Victor Hugo",
      addressLocality: "Paris",
      postalCode: "75116",
      addressCountry: "FR",
    },
  },
  areaServed: { "@type": "City", name: "Paris" },
  serviceType: "Liquidation du régime matrimonial",
};

// Articles associés (peuvent pointer vers /actualites ou /fiches) — complètent les fiches
// de la catégorie tant que celle-ci se remplit.
const articlesAssocies = [
  {
    title: "Prêt commun et indemnité d'occupation : neutraliser la créance",
    href: "/actualites/pret-commun-indemnite-occupation-neutraliser-creance-divorce",
    image:
      "/images/blog/pret-commun-indemnite-occupation-neutraliser-creance-divorce-1786495187448.jpg",
    desc: "Peut-on compenser la créance de l'époux qui rembourse seul le prêt avec l'indemnité d'occupation ? Conditions de validité et conséquences fiscales.",
  },
];

// Photos dédiées disponibles dans public/images/fiches (nommées par slug)
const fichePhotoDir = path.join(process.cwd(), "public/images/fiches");
const fichePhotos = new Set(
  fs.existsSync(fichePhotoDir)
    ? fs
        .readdirSync(fichePhotoDir)
        .filter((f) => f.endsWith(".jpg"))
        .map((f) => f.replace(/\.jpg$/, ""))
    : []
);

export default function LiquidationPage() {
  const fiches = getFichesByCategory("liquidation");

  return (
    <>
      <Navbar />
      <main className="relative bg-[#F4F2EC]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Hero */}
        <section className="pt-40 pb-16 border-b border-gray-200">
          <Container>
            <Link
              href="/droit-de-la-famille"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-[#1A1A1A] transition-colors mb-10"
            >
              ← Droit de la famille
            </Link>
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#362A24]/10 text-[#362A24] rounded-full mb-6">
                Patrimoine
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1A1A1A] leading-[1.1] mb-8">
                Liquidation du régime matrimonial
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed mb-10">
                Lors d&apos;un divorce, la liquidation du régime matrimonial
                règle le partage des biens : masse commune, biens propres,
                récompenses, indemnité d&apos;occupation et sortie
                d&apos;indivision. Nos fiches pratiques éclairent chaque étape.
              </p>
              <a
                href="tel:+33140680237"
                className="inline-flex items-center gap-3 bg-[#362A24] text-white px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-[#2C221D] transition-all duration-300"
              >
                Consultation — +33 1 40 68 02 37
              </a>
            </div>
          </Container>
        </section>

        {/* Fiches de la catégorie */}
        <section className="py-16">
          <Container>
            <div className="max-w-5xl mx-auto">
              <div className="relative rounded-lg overflow-hidden mb-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/fiches/hero-liquidation-regimes.jpg"
                  alt=""
                  className="w-full h-48 md:h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-[#1A1A1A]/40 to-[#1A1A1A]/20 flex flex-col items-center justify-center text-center px-6">
                  <h2 className="font-serif text-3xl md:text-4xl text-white leading-tight">
                    Fiches pratiques
                  </h2>
                </div>
              </div>

              {fiches.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {fiches.map((f) => (
                    <Link
                      key={f.slug}
                      href={`/fiches/${f.slug}`}
                      className="group bg-white p-4 rounded-lg hover:shadow-lg transition-all flex items-start gap-4"
                    >
                      {(f.image || fichePhotos.has(f.slug)) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={f.image || `/images/fiches/${f.slug}.jpg`}
                          alt=""
                          className="w-20 h-20 object-cover rounded-md shrink-0 bg-[#F4F2EC]"
                        />
                      )}
                      <div>
                        <h3 className="font-serif text-lg text-[#1A1A1A] mb-1 group-hover:text-[#362A24] transition-colors">
                          {f.title} &rarr;
                        </h3>
                        <p className="text-gray-500 text-sm text-justify">
                          {f.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">
                  De nouvelles fiches sur la liquidation du régime matrimonial
                  seront publiées prochainement.
                </p>
              )}
            </div>
          </Container>
        </section>

        {/* Articles associés */}
        {articlesAssocies.length > 0 && (
          <section className="bg-white py-16">
            <Container>
              <div className="max-w-5xl mx-auto">
                <h2 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] mb-8">
                  Articles associés
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {articlesAssocies.map((a) => (
                    <Link
                      key={a.href}
                      href={a.href}
                      className="group bg-[#F4F2EC] p-4 rounded-lg hover:shadow-lg transition-all flex items-start gap-4"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={a.image}
                        alt=""
                        className="w-20 h-20 object-cover rounded-md shrink-0 bg-white"
                      />
                      <div>
                        <h3 className="font-serif text-lg text-[#1A1A1A] mb-1 group-hover:text-[#362A24] transition-colors">
                          {a.title} &rarr;
                        </h3>
                        <p className="text-gray-500 text-sm text-justify">
                          {a.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* CTA */}
        <section className="py-16">
          <Container>
            <div className="max-w-5xl mx-auto bg-[#362A24] text-white p-10 rounded-lg text-center">
              <h2 className="font-serif text-3xl mb-4 text-white">
                Un partage à sécuriser&nbsp;?
              </h2>
              <p className="text-white/70 mb-8">
                Récompenses, indemnité d&apos;occupation, indivision : chaque
                situation est spécifique. Prenez rendez-vous pour une analyse
                adaptée à votre dossier.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+33140680237"
                  className="inline-flex items-center justify-center gap-3 bg-white text-[#362A24] px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-gray-100 transition-all duration-300"
                >
                  +33 1 40 68 02 37
                </a>
                <Link
                  href="/consultations"
                  className="inline-flex items-center justify-center gap-3 border-2 border-white text-white px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-white hover:text-[#362A24] transition-all duration-300"
                >
                  Prendre rendez-vous
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
