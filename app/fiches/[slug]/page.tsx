import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { getAllFiches, getFicheBySlug } from "@/lib/fiches";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const categoryLabels: Record<string, { label: string; href: string }> = {
  couple: { label: "Le couple", href: "/le-couple" },
  enfants: { label: "Les enfants", href: "/les-enfants" },
  divorce: { label: "Divorce", href: "/divorce" },
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

  return {
    title: `${fiche.title} | Avocat Paris - Fain Avocats`,
    description: fiche.description,
  };
}

function markdownToHtml(md: string): string {
  let html = md
    .replace(/^### (.+)$/gm, '<h3 class="font-serif text-xl text-[#1A1A1A] mt-8 mb-3">$1</h3>')
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

  return (
    <>
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

            <h1 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-8 leading-tight">
              {fiche.title}
            </h1>

            <div className="bg-white p-8 md:p-12 rounded-lg mb-12">
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>

            <div className="bg-[#362A24] text-white p-10 rounded-lg text-center">
              <h2 className="font-serif text-3xl mb-4">
                Besoin d&apos;un conseil&nbsp;?
              </h2>
              <p className="text-white/70 mb-8">
                Contactez-nous pour une consultation personnalisée avec un
                avocat spécialisé en droit de la famille.
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
