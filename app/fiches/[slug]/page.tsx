import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { getAllFiches, getFicheBySlug } from "@/lib/fiches";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import type { Metadata } from "next";

const categoryLabels: Record<string, { label: string; href: string }> = {
  couple: { label: "Le couple", href: "/le-couple" },
  enfants: { label: "Les enfants", href: "/les-enfants" },
  divorce: { label: "Divorce", href: "/divorce" },
  liquidation: {
    label: "Liquidation du régime matrimonial",
    href: "/liquidation-regime-matrimonial",
  },
  "etat-civil": { label: "État civil", href: "/etat-civil" },
};

export async function generateStaticParams() {
  const fiches = getAllFiches();
  return fiches.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const fiche = getFicheBySlug(params.slug);
  if (!fiche) return {};

  // Suffixe raccourci de 28 a 15 caracteres : les titles depassaient 90 caracteres
  // et Google tronquait le debut, la partie utile (audit SEO du 2026-08-15).
  // `metaTitle` (frontmatter, optionnel) permet de surcharger un titre trop long.
  return {
    title: `${fiche.metaTitle || fiche.title} | Fain Avocats`,
    description: fiche.description,
  };
}

function markdownToHtml(md: string): string {
  let html = md
    .replace(/^### (.+)$/gm, '<h3 class="font-serif text-xl text-[#1A1A1A] mt-8 mb-3">$1</h3>')
    // Un '# ' en tete de fiche produirait un second H1 (le titre en est deja un).
    .replace(/^# (.+)$/gm, '<h2 class="font-serif text-2xl text-[#1A1A1A] mt-10 mb-4">$1</h2>')
    .replace(/^## (.+)$/gm, '<h2 class="font-serif text-2xl text-[#1A1A1A] mt-10 mb-4">$1</h2>')
    .replace(/^\- (.+)$/gm, '<li class="flex items-start gap-2 mb-2"><span class="text-[#362A24] mt-1 shrink-0">•</span><span>$1</span></li>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");

  const lines = html.split("\n");
  const result: string[] = [];
  let inList = false;

  for (const line of lines) {
    if (line.startsWith("<li")) {
      if (!inList) {
        result.push('<ul class="space-y-1 mb-6">');
        inList = true;
      }
      result.push(line);
    } else {
      if (inList) {
        result.push("</ul>");
        inList = false;
      }
      if (
        line.trim() &&
        !line.startsWith("<h") &&
        !line.startsWith("<ul") &&
        !line.startsWith("</ul")
      ) {
        result.push(
          `<p class="text-gray-700 leading-relaxed mb-4">${line}</p>`
        );
      } else {
        result.push(line);
      }
    }
  }
  if (inList) result.push("</ul>");

  return result.join("\n");
}

export default function FichePage({ params }: { params: { slug: string } }) {
  const fiche = getFicheBySlug(params.slug);
  if (!fiche) notFound();

  const cat = categoryLabels[fiche.category] || {
    label: fiche.category,
    href: "/droit-de-la-famille",
  };

  const htmlContent = markdownToHtml(fiche.content);

  // Le fil d'Ariane etait affiche sans balisage (audit SEO du 2026-08-15).
  // Construit depuis les memes valeurs que le fil visible, dans le meme ordre.
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://fain-avocats.fr" },
      { "@type": "ListItem", position: 2, name: "Droit de la Famille", item: "https://fain-avocats.fr/droit-de-la-famille" },
      { "@type": "ListItem", position: 3, name: cat.label, item: `https://fain-avocats.fr${cat.href}` },
      { "@type": "ListItem", position: 4, name: fiche.title },
    ],
  };

  // Photo dédiée de la fiche (bandeau) si elle existe
  const photoSrc = `/images/fiches/${fiche.slug}.jpg`;
  const hasPhoto =
    !!fiche.image ||
    fs.existsSync(path.join(process.cwd(), "public", photoSrc));
  const heroSrc = fiche.image || photoSrc;

  const fichesAvecSimulateur = [
    "calcul-prestation-compensatoire",
    "prestation-compensatoire",
    "condition-attribution-prestation-compensatoire",
    "formes-prestation-compensatoire",
    "prestation-compensatoire-fiscalite",
  ];
  const afficherSimulateur = fichesAvecSimulateur.includes(fiche.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />
      <main className="bg-[#F4F2EC] min-h-screen pt-32 pb-24">
        <Container>
          <div className="max-w-4xl mx-auto">
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
                href={cat.href}
                className="hover:text-[#362A24] transition-colors"
              >
                {cat.label}
              </Link>
              <span className="mx-2">&gt;</span>
              <span className="text-[#362A24]">{fiche.title}</span>
            </nav>

            {hasPhoto ? (
              <div className="relative rounded-lg overflow-hidden mb-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroSrc}
                  alt={fiche.title}
                  className="w-full h-56 md:h-80 object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 bg-gradient-to-t from-[#1A1A1A]/80 via-[#1A1A1A]/35 to-[#1A1A1A]/5">
                  <span className="inline-block self-start px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-white/15 text-white rounded-full mb-4">
                    {cat.label}
                  </span>
                  <h1 className="font-serif text-3xl md:text-4xl text-white leading-tight max-w-3xl">
                    {fiche.title}
                  </h1>
                </div>
              </div>
            ) : (
              <h1 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-8 leading-tight">
                {fiche.title}
              </h1>
            )}

            <div className="bg-white p-8 md:p-12 rounded-lg mb-12">
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>

            {afficherSimulateur && (
              <div className="bg-white border border-[#E2DDD4] p-8 md:p-10 rounded-lg mb-12 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-1">
                  <h2 className="font-serif text-2xl text-[#1A1A1A] mb-2">
                    Estimez le montant en ligne
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Notre simulateur gratuit calcule une fourchette indicative
                    selon six méthodes de calcul usuelles.
                  </p>
                </div>
                <Link
                  href="/outils/simulateur-prestation-compensatoire"
                  className="inline-flex items-center justify-center gap-2 bg-[#362A24] text-white px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-[#4a3a30] transition-all duration-300 shrink-0"
                >
                  Accéder au simulateur
                </Link>
              </div>
            )}

            <div className="bg-[#362A24] text-white p-10 rounded-lg text-center">
              <h2 className="font-serif text-3xl mb-4 text-white">
                Besoin d&apos;un conseil&nbsp;?
              </h2>
              <p className="text-white/70 mb-8">
                Contactez-nous pour une consultation personnalisée avec un
                avocat en droit de la famille.
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
