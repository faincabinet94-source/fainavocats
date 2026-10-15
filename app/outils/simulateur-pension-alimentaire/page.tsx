import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SimulateurEmbed } from "@/components/SimulateurEmbed";
import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import type { Metadata } from "next";

// Articles affichés sous le simulateur, dès qu'ils sont publiés dans content/blog.
const ARTICLES_PENSION = ["pension-alimentaire-garde-alternee-calcul-simulateur"];

export const metadata: Metadata = {
  title: "Simulateur de pension alimentaire | Avocat Paris - Fain Avocats",
  description:
    "Estimez la pension alimentaire des enfants selon le barème du ministère de la Justice. En garde alternée, comparez avec un calcul qui tient compte des deux revenus. Outil gratuit.",
  alternates: {
    canonical: "/outils/simulateur-pension-alimentaire",
  },
};

export default function SimulateurPensionPage() {
  const articles = getAllPosts()
    .filter((p) => ARTICLES_PENSION.includes(p.slug))
    .map((p) => ({
      slug: p.slug,
      image: p.image,
      title: p.title.replace(/\s*-\s*Fain Avocats\s*$/i, "").trim(),
    }));

  return (
    <>
      <Navbar />
      <main className="bg-[#F4F2EC] min-h-screen pt-32 pb-24">
        <Container>
          <div className="max-w-5xl mx-auto">
            <nav className="text-sm text-gray-500 mb-8">
              <a href="/" className="hover:text-[#362A24] transition-colors">
                Accueil
              </a>
              <span className="mx-2">&gt;</span>
              <Link
                href="/droit-de-la-famille"
                className="hover:text-[#362A24] transition-colors"
              >
                Droit de la Famille
              </Link>
              <span className="mx-2">&gt;</span>
              <Link
                href="/pension-alimentaire"
                className="hover:text-[#362A24] transition-colors"
              >
                Pension alimentaire
              </Link>
              <span className="mx-2">&gt;</span>
              <span className="text-[#362A24]">
                Simulateur de pension alimentaire
              </span>
            </nav>

            <h1 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-6 leading-tight">
              Simulateur de pension alimentaire pour les enfants
            </h1>

            <p className="text-gray-700 leading-relaxed mb-4">
              Cet outil estime la contribution à l&apos;entretien et à
              l&apos;éducation des enfants (CEE, ou pension alimentaire) selon la{" "}
              <strong>table de référence du ministère de la Justice</strong>. En
              droit de visite réduit ou classique, seul le revenu du parent qui
              verse la pension entre dans le calcul. En{" "}
              <strong>résidence alternée</strong>, le simulateur compare le
              barème avec une méthode qui tient compte des revenus des deux
              parents.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              Le barème n&apos;a <strong>aucune valeur contraignante</strong>. Le
              juge aux affaires familiales fixe la pension au vu des ressources
              de chacun des parents et des besoins de l&apos;enfant (article
              371-2 du Code civil). Les règles générales sont présentées dans
              notre fiche{" "}
              <Link
                href="/fiches/pension-alimentaire-enfants"
                className="text-[#362A24] underline underline-offset-2 hover:no-underline"
              >
                la pension alimentaire des enfants
              </Link>
              . Aucune donnée saisie n&apos;est conservée.
            </p>

            <SimulateurEmbed
              src="/simulateur-pension/index.html?embed=1"
              title="Simulateur de pension alimentaire"
              hauteurInitiale={2400}
            />

            {articles.length > 0 && (
              <section className="mt-14">
                <h2 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] mb-6">
                  Pour aller plus loin
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {articles.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/actualites/${a.slug}`}
                      className="group flex items-center gap-4 bg-white border border-[#E2DDD4] rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      {a.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={a.image}
                          alt={a.title}
                          className="w-24 h-20 object-cover rounded-md shrink-0"
                        />
                      )}
                      <span className="text-[15px] font-medium text-[#1A1A1A] leading-snug group-hover:text-[#362A24] transition-colors">
                        {a.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <div className="bg-[#362A24] text-white p-10 rounded-lg text-center mt-12">
              <h2 className="font-serif text-3xl mb-4 text-white">
                Faire chiffrer votre situation
              </h2>
              <p className="text-white/70 mb-8">
                Le simulateur donne un ordre de grandeur. Contactez le cabinet
                pour un examen de votre situation par un avocat en droit de la
                famille.
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
