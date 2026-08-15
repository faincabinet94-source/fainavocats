import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { BlogArticle } from "@/components/sections/BlogArticle";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: `${post.title} | Fain Avocats`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : [],
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default function ArticlePage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  // Balisage Article : absent jusqu'ici (audit SEO du 2026-08-15).
  // Tous les champs proviennent du frontmatter, rien n'est invente.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "fr-FR",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://fain-avocats.fr/actualites/${post.slug}`,
    },
    author: { "@type": "Organization", name: post.author || "Fain Avocats" },
    publisher: { "@id": "https://fain-avocats.fr/#attorney" },
    ...(post.image ? { image: `https://fain-avocats.fr${post.image}` } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Navbar />
      <main className="relative pt-32 pb-20 bg-[#F4F2EC] min-h-screen">
        <BlogArticle post={post} />
      </main>
      <Footer />
    </>
  );
}
