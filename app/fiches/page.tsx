import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { getAllFiches } from "@/lib/fiches";

export const metadata: Metadata = {
  title: "Fiches pratiques en droit de la famille | Fain Avocats Paris",
  description:
    "Retrouvez nos fiches pratiques en droit de la famille : couple, enfants, divorce, état civil. Informations juridiques claires par Maître Fain, avocat à Paris.",
  keywords: [
    "fiches pratiques droit famille",
    "avocat paris famille",
    "information juridique divorce",
    "droit couple",
    "droit enfants",
  ],
};

const categoryConfig: Record<
  string,
  { label: string; emoji: string; href: string }
> = {
  couple: { label: "Le Couple", emoji: "💍", href: "/le-couple" },
  enfants: { label: "Les Enfants", emoji: "👨‍👧‍👦", href: "/les-enfants" },
  divorce: { label: "Divorce", emoji: "⚖️", href: "/divorce" },
  "etat-civil": { label: "État Civil", emoji: "📋", href: "/etat-civil" },
};

export default function FichesPage() {
  const fiches = getAllFiches();

  const grouped = fiches.reduce(
    (acc, f) => {
      if (!acc[f.category]) acc[f.category] = [];
      acc[f.category].push(f);
      return acc;
    },
    {} as Record<string, typeof fiches>
  );

  return (
    <>
      <Navbar />
      <main className="bg-[#F4F2EC] min-h-screen pt-32 pb-24">
        <Container>
          <div className="max-w-5xl mx-auto">
            <Link
              href="/droit-de-la-famille"
              className="text-sm text-gray-500 hover:text-[#362A24] transition-colors mb-8 inline-block"
            >
              &larr; Droit de la famille
            </Link>

            <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-6 leading-tight text-center">
              Fiches pratiques
            </h1>
            <p className="text-gray-600 text-lg mb-16 text-center max-w-3xl mx-auto text-justify">
              Nos fiches pratiques vous informent sur les grandes questions du
              droit de la famille. Elles sont rédigées par des avocats et
              constituent un premier niveau d&apos;information.
            </p>

            {Object.entries(categoryConfig).map(([key, config]) => {
              const items = grouped[key];
              if (!items || items.length === 0) return null;
              return (
                <section key={key} className="mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">{config.emoji}</span>
                    <h2 className="font-serif text-2xl text-[#1A1A1A]">
                      {config.label}
                    </h2>
                    <Link
                      href={config.href}
                      className="text-sm text-gray-400 hover:text-[#362A24] ml-auto transition-colors"
                    >
                      Voir la page &rarr;
                    </Link>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {items.map((f) => (
                      <Link
                        key={f.slug}
                        href={`/fiches/${f.slug}`}
                        className="group bg-white p-6 rounded-lg hover:shadow-lg transition-all"
                      >
                        <h3 className="font-serif text-lg text-[#1A1A1A] mb-2 group-hover:text-[#362A24] transition-colors">
                          {f.title} &rarr;
                        </h3>
                        <p className="text-gray-500 text-sm text-justify">
                          {f.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}

            <div className="bg-[#362A24] text-white p-10 rounded-lg text-center">
              <h2 className="font-serif text-3xl mb-4">
                Besoin d&apos;un conseil personnalisé&nbsp;?
              </h2>
              <p className="text-white/70 mb-8 text-justify">
                Nos fiches pratiques constituent un premier niveau
                d&apos;information. Pour une analyse adaptée à votre situation,
                prenez rendez-vous avec un avocat.
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
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
