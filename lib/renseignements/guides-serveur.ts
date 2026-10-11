import { getFicheBySlug } from "@/lib/fiches";
import { getPostBySlug } from "@/lib/blog";
import { LECTURES_ETAPES, LECTURE_DATE_EFFETS, type Guides, type Lecture, type Lien } from "./guides";

/* Ne garde que les guides et actualités publiés, avec leur titre actuel. */
function lien(l: Lecture): Lien | null {
  const x = l.type === "fiche" ? getFicheBySlug(l.slug) : getPostBySlug(l.slug);
  if (!x) return null;
  return { href: `/${l.type === "fiche" ? "fiches" : "actualites"}/${x.slug}`, titre: x.title, procedure: l.procedure, quand: l.quand };
}

export function guidesDisponibles(): Guides {
  const etapes: Record<number, Lien[]> = {};
  for (const [i, lectures] of Object.entries(LECTURES_ETAPES)) {
    const liens = lectures.map(lien).filter((x): x is Lien => Boolean(x));
    if (liens.length) etapes[Number(i)] = liens;
  }
  return { etapes, dateEffets: lien(LECTURE_DATE_EFFETS) };
}
