import Link from "next/link";
import fs from "fs";
import path from "path";
import { Container } from "@/components/ui/Container";
import { ArticlesLies } from "@/components/sections/ArticlesLies";
import { getRubrique } from "@/lib/rubriques";

// Gabarit unique des articles du site, guides (/fiches) comme actualités
// (/actualites). Réorganisation du 11 octobre 2026 : jusque-là, un guide publié
// en actualité n'avait ni fil d'Ariane, ni lien vers sa rubrique, ni bandeau
// titré, et la même image n'était jamais recadrée deux fois de la même façon.
//
// Fil d'Ariane : Accueil > Droit de la Famille | Actualités > Rubrique > Titre.
// Bandeau : 2,8:1 (896 x 320 au plus large), titre en surimpression en bas à
// gauche, d'où le quart inférieur gauche sombre exigé par la charte image.

export type TypeArticle = "guide" | "actualite";

// Pages qui affichent l'encart du simulateur de prestation compensatoire.
const AVEC_SIMULATEUR = new Set([
  "calcul-prestation-compensatoire",
  "prestation-compensatoire",
  "condition-attribution-prestation-compensatoire",
  "formes-prestation-compensatoire",
  "prestation-compensatoire-fiscalite",
]);

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Image du bandeau : `image` du frontmatter, sinon la photo nommée d'après le slug. */
export function imageBandeau(slug: string, image?: string): string | null {
  if (image) return image;
  const parDefaut = `/images/fiches/${slug}.jpg`;
  return fs.existsSync(path.join(process.cwd(), "public", parDefaut))
    ? parDefaut
    : null;
}

export function fildArianeJsonLd(
  type: TypeArticle,
  category: string,
  title: string
) {
  const rubrique = getRubrique(category);
  const parent =
    type === "actualite"
      ? { name: "Actualités", item: "https://fain-avocats.fr/actualites" }
      : { name: "Droit de la Famille", item: "https://fain-avocats.fr/droit-de-la-famille" };
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://fain-avocats.fr" },
      { "@type": "ListItem", position: 2, ...parent },
      { "@type": "ListItem", position: 3, name: rubrique.label, item: `https://fain-avocats.fr${rubrique.href}` },
      { "@type": "ListItem", position: 4, name: title },
    ],
  };
}

export function ArticleGabarit({
  type,
  slug,
  title,
  category,
  image,
  date,
  content,
  children,
}: {
  type: TypeArticle;
  slug: string;
  title: string;
  category: string;
  image?: string;
  date?: string;
  content: string;
  children: React.ReactNode;
}) {
  const rubrique = getRubrique(category);
  const bandeau = imageBandeau(slug, image);
  const dateAffichee = type === "actualite" && date ? formatDate(date) : "";

  return (
    <Container>
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-[#362A24] transition-colors">
            Accueil
          </a>
          <span className="mx-2">&gt;</span>
          {type === "actualite" ? (
            <Link href="/actualites" className="hover:text-[#362A24] transition-colors">
              Actualités
            </Link>
          ) : (
            <Link href="/droit-de-la-famille" className="hover:text-[#362A24] transition-colors">
              Droit de la Famille
            </Link>
          )}
          <span className="mx-2">&gt;</span>
          <Link href={rubrique.href} className="hover:text-[#362A24] transition-colors">
            {rubrique.label}
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-[#362A24]">{title}</span>
        </nav>

        {bandeau ? (
          <div className="relative rounded-lg overflow-hidden mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bandeau}
              alt={title}
              className="w-full h-56 md:h-80 object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 bg-gradient-to-t from-[#1A1A1A]/80 via-[#1A1A1A]/35 to-[#1A1A1A]/5">
              <span className="inline-block self-start px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-white/15 text-white rounded-full mb-4">
                {rubrique.label}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-white leading-tight max-w-3xl">
                {title}
              </h1>
            </div>
          </div>
        ) : (
          <h1 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-6 leading-tight">
            {title}
          </h1>
        )}

        {dateAffichee ? (
          <p className="text-sm text-gray-500 mb-8">Publié le {dateAffichee}</p>
        ) : (
          <div className="mb-4" />
        )}

        <div className="bg-white p-8 md:p-12 rounded-lg mb-12">{children}</div>

        {AVEC_SIMULATEUR.has(slug) && (
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

        <ArticlesLies slug={slug} category={category} content={content} />

        <div className="bg-[#362A24] text-white p-10 rounded-lg text-center">
          <h2 className="font-serif text-3xl mb-4 text-white">
            Besoin d&apos;un conseil&nbsp;?
          </h2>
          <p className="text-white/70 mb-8">
            Contactez-nous pour une consultation personnalisée avec un avocat
            en droit de la famille.
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
  );
}
