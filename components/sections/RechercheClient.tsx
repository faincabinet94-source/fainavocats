"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Container } from "@/components/ui/Container";

export interface ResultatRecherche {
  slug: string;
  titre: string;
  description: string;
  url: string;
  type: string;
  texte: string;
}

// Minuscules sans accents : « pension » trouve « Pension », « regime » trouve « régime ».
function normaliser(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function RechercheClient({ documents }: { documents: ResultatRecherche[] }) {
  const [requete, setRequete] = useState("");

  const index = useMemo(
    () =>
      documents.map((d) => ({
        doc: d,
        titreN: normaliser(d.titre),
        descN: normaliser(d.description),
        texteN: normaliser(d.texte),
      })),
    [documents]
  );

  const resultats = useMemo(() => {
    const mots = normaliser(requete).split(/\s+/).filter((m) => m.length >= 3);
    if (mots.length === 0) return [];
    return index
      .map((e) => {
        let score = 0;
        for (const m of mots) {
          if (e.titreN.includes(m)) score += 10;
          else if (e.descN.includes(m)) score += 4;
          else if (e.texteN.includes(m)) score += 1;
          else return null;
        }
        return { doc: e.doc, score };
      })
      .filter((r): r is { doc: ResultatRecherche; score: number } => r !== null)
      .sort((a, b) => b.score - a.score);
  }, [requete, index]);

  const troisCaracteres = normaliser(requete).trim().length > 0 && resultats.length === 0;

  return (
    <Container>
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl text-[#1A1A1A] mb-2">Rechercher</h1>
        <p className="text-gray-500 mb-8">
          {documents.length} articles et fiches pratiques.
        </p>

        <div className="relative mb-10">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="search"
            autoFocus
            value={requete}
            onChange={(e) => setRequete(e.target.value)}
            placeholder="Divorce, pension alimentaire, prestation compensatoire…"
            aria-label="Rechercher un article"
            className="w-full bg-white border border-gray-200 rounded-full py-4 pl-12 pr-4 text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#362A24] transition-colors"
          />
        </div>

        {resultats.length > 0 && (
          <p className="text-sm text-gray-500 mb-4">
            {resultats.length} résultat{resultats.length > 1 ? "s" : ""}
          </p>
        )}

        <div className="space-y-3">
          {resultats.map(({ doc }) => (
            <Link
              key={doc.url}
              href={doc.url}
              className="group block bg-white p-5 rounded-lg hover:shadow-lg transition-all"
            >
              <span className="text-[11px] uppercase tracking-widest text-gray-400">
                {doc.type}
              </span>
              <h2 className="font-serif text-xl text-[#1A1A1A] mt-1 mb-1 group-hover:text-[#362A24] transition-colors">
                {doc.titre} &rarr;
              </h2>
              <p className="text-gray-500 text-sm text-justify">{doc.description}</p>
            </Link>
          ))}
        </div>

        {troisCaracteres && (
          <p className="text-gray-500 text-center py-10">
            Aucun résultat. Essayez un autre mot, ou vérifiez qu&apos;il fait au moins
            trois lettres.
          </p>
        )}
      </div>
    </Container>
  );
}
