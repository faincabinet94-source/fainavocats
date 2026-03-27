import { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { BlogList } from "@/components/sections/BlogList";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Actualités Droit de la Famille | Fain Avocats Paris 16",
  description:
    "Retrouvez les dernières actualités juridiques en droit de la famille : divorce, garde d'enfants, pension alimentaire, prestation compensatoire.",
};

export default function ActualitesPage() {
  const posts = getAllPosts();

  return (
    <>
      <Navbar />
      <main className="relative pt-32 pb-20 bg-[#F4F2EC] min-h-screen">
        <BlogList posts={posts} />
      </main>
      <Footer />
    </>
  );
}
