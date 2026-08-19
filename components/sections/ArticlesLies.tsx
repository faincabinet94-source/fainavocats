import Link from "next/link";
import { getFichesByCategory, getFicheBySlug } from "@/lib/fiches";
import { getPostBySlug } from "@/lib/blog";

const IMAGE_PAR_DEFAUT = "/images/blog/article-droit-famille.jpg";
const NOMBRE_MAX = 4;

type Carte = {
  href: string;
  title: string;
  description: string;
  image: string;
};

/**
 * Bloc « À lire aussi » en fin de fiche.
 *
 * 1. Les autres fiches de la meme rubrique.
 * 2. Si elles ne suffisent pas, les cibles des liens internes du corps de
 *    l'article — fiches comme actualites. Une rubrique neuve n'a qu'une fiche :
 *    sans ce repli, le bloc serait vide.
 */
export function ArticlesLies({
  slug,
  category,
  content,
}: {
  slug: string;
  category: string;
  content: string;
}) {
  const cartes: Carte[] = getFichesByCategory(category)
    .filter((f) => f.slug !== slug)
    .slice(0, NOMBRE_MAX)
    .map((f) => ({
      href: `/fiches/${f.slug}`,
      title: f.title,
      description: f.description,
      image: f.image || `/images/fiches/${f.slug}.jpg`,
    }));

  if (cartes.length < NOMBRE_MAX) {
    const cibles = Array.from(
      new Set(
        Array.from(
          content.matchAll(/\]\((\/(?:fiches|actualites)\/[a-z0-9-]+)\)/g)
        ).map((m) => m[1])
      )
    );

    for (const chemin of cibles) {
      if (cartes.length >= NOMBRE_MAX) break;
      if (cartes.some((c) => c.href === chemin)) continue;

      const cible = chemin.split("/").pop() as string;

      if (chemin.startsWith("/fiches/")) {
        if (cible === slug) continue;
        const f = getFicheBySlug(cible);
        if (f) {
          cartes.push({
            href: chemin,
            title: f.title,
            description: f.description,
            image: f.image || `/images/fiches/${f.slug}.jpg`,
          });
        }
      } else {
        const p = getPostBySlug(cible);
        if (p) {
          cartes.push({
            href: chemin,
            title: p.title,
            description: p.description,
            image: p.image || IMAGE_PAR_DEFAUT,
          });
        }
      }
    }
  }

  if (cartes.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6">À lire aussi</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {cartes.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group bg-white p-4 rounded-lg hover:shadow-lg transition-all flex items-start gap-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.image}
              alt={c.title}
              className="w-20 h-20 object-cover rounded-md shrink-0 bg-[#F4F2EC]"
            />
            <div>
              <h3 className="font-serif text-lg text-[#1A1A1A] mb-1 group-hover:text-[#362A24] transition-colors">
                {c.title} &rarr;
              </h3>
              <p className="text-gray-500 text-sm text-justify">
                {c.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
