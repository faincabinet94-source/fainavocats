import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { ArticleGabarit, fildArianeJsonLd } from "@/components/sections/ArticleGabarit";
import { MarkdownContent } from "@/components/sections/MarkdownContent";
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(fildArianeJsonLd("actualite", post.category, post.title)),
        }}
      />
      <Navbar />
      <main className="bg-[#F4F2EC] min-h-screen pt-32 pb-24">
        <ArticleGabarit
          type="actualite"
          slug={post.slug}
          title={post.title}
          category={post.category}
          image={post.image}
          date={post.date}
          content={post.content}
        >
          <MarkdownContent content={post.content} />
        </ArticleGabarit>
      </main>
      <Footer />
    </>
  );
}
