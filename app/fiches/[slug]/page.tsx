import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { getAllFiches, getFicheBySlug } from "@/lib/fiches";
import { ArticleGabarit, fildArianeJsonLd } from "@/components/sections/ArticleGabarit";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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
    // Séparateur « --- » : présent dans les guides venus des actualités
    // (réorganisation du 11 octobre 2026), il s'affichait en texte brut.
    .replace(/^---$/gm, '<hr class="my-8 border-gray-200" />')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-[#362A24] pl-6 py-2 my-6 italic text-gray-700 bg-[#F4F2EC]">$1</blockquote>')
    .replace(/^\- (.+)$/gm, '<li class="flex items-start gap-2 mb-2"><span class="text-[#362A24] mt-1 shrink-0">•</span><span>$1</span></li>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italique seulement pour *texte* isole : « Cerfa n° 15458*05 » n'ouvre pas d'emphase.
    .replace(/(^|[^\w*])\*(?![\s*])([^*\n]+?)\*(?![\w*])/g, "$1<em>$2</em>")
    // Liens Markdown : externes d'abord (nouvel onglet), puis mailto et tel,
    // puis internes (meme onglet). mailto: n'etait traite par aucune des deux
    // regles : la chaine Markdown restait affichee telle quelle sur la page.
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#362A24] underline hover:text-[#1A1A1A] transition-colors">$1</a>'
    )
    .replace(
      /\[([^\]]+)\]\(((?:mailto|tel):[^)\s]+)\)/g,
      '<a href="$2" class="text-[#362A24] underline hover:text-[#1A1A1A] transition-colors">$1</a>'
    )
    .replace(
      /\[([^\]]+)\]\((\/[^)\s]*)\)/g,
      '<a href="$2" class="text-[#362A24] underline hover:text-[#1A1A1A] transition-colors">$1</a>'
    );

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
        !line.startsWith("<blockquote") &&
        !line.startsWith("<hr") &&
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

  const htmlContent = markdownToHtml(fiche.content);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(fildArianeJsonLd("guide", fiche.category, fiche.title)),
        }}
      />
      <Navbar />
      <main className="bg-[#F4F2EC] min-h-screen pt-32 pb-24">
        <ArticleGabarit
          type="guide"
          slug={fiche.slug}
          title={fiche.title}
          category={fiche.category}
          image={fiche.image}
          content={fiche.content}
        >
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </ArticleGabarit>
      </main>
      <Footer />
    </>
  );
}
