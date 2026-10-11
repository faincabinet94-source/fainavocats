// Moteur de rendu Markdown des actualités, extrait de BlogArticle.tsx
// (réorganisation du 11 octobre 2026 : un seul gabarit d'article).
// Sans état ni effet : composant serveur.

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

export function MarkdownContent({ content }: { content: string }) {
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
