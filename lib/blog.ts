import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getAllFiches } from "./fiches";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  author: string;
  description: string;
  image: string;
  content: string;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const filepath = path.join(BLOG_DIR, filename);
    const raw = fs.readFileSync(filepath, "utf8");
    const { data, content } = matter(raw);

    return {
      slug: data.slug || filename.replace(/\.mdx$/, ""),
      title: data.title || "",
      date: data.date || "",
      category: data.category || "",
      author: data.author || "",
      description: data.description || "",
      image: data.image || "",
      content,
    };
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug);
}

// Élément du flux Actualités : un article de blog OU une fiche cochée « actualité ».
// `href` porte l'URL réelle (une fiche garde son unique URL /fiches/... → pas de doublon SEO).
export interface ActualiteItem extends BlogPost {
  href: string;
}

export function getActualitesFeed(): ActualiteItem[] {
  const posts: ActualiteItem[] = getAllPosts().map((p) => ({
    ...p,
    href: `/actualites/${p.slug}`,
  }));

  const ficheItems: ActualiteItem[] = getAllFiches()
    .filter((f) => f.actualite)
    .map((f) => ({
      slug: f.slug,
      title: f.title,
      date: f.date || "",
      category: f.category,
      author: "Fain Avocats",
      description: f.description,
      image: f.image || "",
      content: f.content,
      href: `/fiches/${f.slug}`,
    }));

  return [...posts, ...ficheItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
