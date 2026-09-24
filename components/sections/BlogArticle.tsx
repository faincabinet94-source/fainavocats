"use client";

import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function tableauHtml(lignes: string[]) {
  const cellules = (l: string) =>
    l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
  const estSeparateur = (l: string) => /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?$/.test(l.trim());
  const [entete, ...reste] = lignes;
  const corps = reste.filter((l) => !estSeparateur(l));
  const th = cellules(entete)
    .map((c) => `<th class="border-b-2 border-[#362A24] px-4 py-3 text-left align-bottom font-bold text-[#1A1A1A]">${c}</th>`)
    .join('');
  const tr = corps
    .map(
      (l) =>
        `<tr>${cellules(l)
          .map((c) => `<td class="border-b border-gray-200 px-4 py-3 align-top text-gray-700">${c}</td>`)
          .join('')}</tr>`
    )
    .join('');
  return `<div class="my-8 overflow-x-auto"><table class="w-full border-collapse text-[15px] leading-relaxed"><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table></div>`;
}

function MarkdownContent({ content }: { content: string }) {
  const html = content
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-serif font-bold mt-8 mb-3 text-[#1A1A1A]">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-serif font-bold mt-10 mb-4 text-[#1A1A1A]">$1</h2>')
    // Le titre de l'article est deja rendu en <h1> plus bas : un '# ' dans le
    // Markdown produisait un second H1 (audit SEO du 2026-08-15). Rendu en h2.
    .replace(/^# (.+)$/gm, '<h2 class="text-3xl font-serif font-bold mt-10 mb-4 text-[#1A1A1A]">$1</h2>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-[#362A24] pl-6 py-2 my-6 italic text-gray-700 bg-[#F4F2EC]">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li class="ml-6 mb-1 text-gray-700 list-disc">$1</li>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-[#1A1A1A]">$1</strong>')
    // Italique seulement pour *texte* isole : un asterisque colle a un chiffre ou
    // a une lettre (« Cerfa n° 17582*01 ») n'ouvre ni ne ferme une emphase. La
    // regle precedente, /\*(.+?)\*/, mettait en italique tout le passage compris
    // entre deux numeros Cerfa.
    .replace(/(^|[^\w*])\*(?![\s*])([^*\n]+?)\*(?![\w*])/g, '$1<em>$2</em>')
    // Liens Markdown, dans cet ordre : externes (nouvel onglet), mailto et tel
    // (meme onglet, sans target), puis internes (meme onglet).
    // Une regle unique posait target="_blank" sur TOUS les liens, internes
    // compris : le lecteur accumulait les onglets au lieu de circuler dans le
    // site, ce qui va contre le but meme du maillage interne. Le rendu des
    // fiches distinguait deja externes et internes, mais aucun des deux moteurs
    // ne traitait mailto: — la chaine Markdown restait affichee telle quelle.
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
    )
    .replace(/^---$/gm, '<hr class="my-8 border-gray-200" />')
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      // Les <li> etaient emis sans <ul> englobant : HTML invalide, meme si les
      // classes Tailwind donnaient le rendu attendu. Le rendu des fiches
      // enveloppe deja ses listes.
      // Tableaux Markdown (lignes « | a | b | »), jusqu'ici affiches tels quels,
      // barres verticales comprises.
      const lignes = trimmed.split('\n');
      if (lignes.length >= 2 && lignes.every((l) => l.trim().startsWith('|'))) {
        return tableauHtml(lignes);
      }
      if (trimmed.startsWith('<li')) {
        return `<ul class="mb-4">${trimmed}</ul>`;
      }
      if (trimmed.startsWith('<h') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<hr')) {
        return trimmed;
      }
      return `<p class="text-gray-700 leading-relaxed mb-4">${trimmed}</p>`;
    })
    .join('\n');

  return (
    <div
      className="prose-custom"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function BlogArticle({ post }: { post: BlogPost }) {
  return (
    <section className="py-12">
      <Container className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-[#1A1A1A] transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Toutes les actualités
          </Link>

          <div className="mb-8">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[#362A24]/10 text-[#362A24] rounded-full mb-4">
              {post.category}
            </span>

            <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] leading-tight mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </span>
            </div>
          </div>

          {post.image && (
            <div className="mb-10 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-auto max-h-[400px] object-cover"
              />
            </div>
          )}

          <div className="bg-white p-8 md:p-12 border border-gray-100 shadow-sm">
            <MarkdownContent content={post.content} />
          </div>

          {[
            "calcul-prestation-compensatoire-divorce",
            "la-prestation-compensatoire-n-a-pas-pour-objet-de-corriger-les-effets-du-choix-d",
            "prestation-compensatoire-nouveaux-criteres-de-fixation-fain-avocats",
            "prestation-compensatoire-pensions-alimentaires-et-allocation-tierce-personne-atp",
          ].includes(post.slug) && (
            <div className="mt-10 bg-white border border-[#E2DDD4] p-8 md:p-10 rounded-lg flex flex-col sm:flex-row sm:items-center gap-6">
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
                className="inline-flex items-center justify-center gap-2 bg-[#362A24] text-white px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-[#2C221D] transition-all duration-300 shrink-0"
              >
                Accéder au simulateur
              </Link>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Link
              href="/actualites"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-[#1A1A1A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux actualités
            </Link>

            <a
              href="tel:+33140680237"
              className="inline-flex items-center gap-3 bg-[#362A24] text-white px-6 py-3 rounded-full text-sm font-medium tracking-wide hover:bg-[#2C221D] transition-all duration-300"
            >
              Nous consulter : +33 1 40 68 02 37
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
