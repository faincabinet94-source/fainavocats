import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { RechercheClient, type ResultatRecherche } from "@/components/sections/RechercheClient";
import { getAllFiches } from "@/lib/fiches";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Rechercher un article | Fain Avocats",
  description:
    "Recherchez parmi les fiches pratiques et les actualités du cabinet Fain Avocats : divorce, garde d'enfants, pension alimentaire, liquidation du régime matrimonial.",
  robots: { index: false, follow: true },
};

// Retire le balisage markdown pour ne garder que du texte cherchable.
function texteBrut(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function RecherchePage() {
  const fiches: ResultatRecherche[] = getAllFiches().map((f) => ({
    slug: f.slug,
    titre: f.title,
    description: f.description || "",
    url: `/fiches/${f.slug}`,
    type: "Fiche pratique",
    texte: texteBrut(f.content).slice(0, 4000),
  }));

  const actualites: ResultatRecherche[] = getAllPosts().map((p) => ({
    slug: p.slug,
    titre: p.title,
    description: p.description || "",
    url: `/actualites/${p.slug}`,
    type: "Actualité",
    texte: texteBrut(p.content).slice(0, 4000),
  }));

  return (
    <>
      <Navbar />
      <main className="bg-[#F4F2EC] min-h-screen pt-32 pb-24">
        <RechercheClient documents={[...fiches, ...actualites]} />
      </main>
      <Footer />
    </>
  );
}
