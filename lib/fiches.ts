import fs from "fs";
import path from "path";
import matter from "gray-matter";

const FICHES_DIR = path.join(process.cwd(), "content/fiches");

export interface Fiche {
  slug: string;
  title: string;
  category: string;
  description: string;
  content: string;
}

export function getAllFiches(): Fiche[] {
  if (!fs.existsSync(FICHES_DIR)) return [];

  const files = fs.readdirSync(FICHES_DIR).filter((f) => f.endsWith(".mdx"));

  return files.map((filename) => {
    const filepath = path.join(FICHES_DIR, filename);
    const raw = fs.readFileSync(filepath, "utf8");
    const { data, content } = matter(raw);

    return {
      slug: data.slug || filename.replace(/\.mdx$/, ""),
      title: data.title || "",
      category: data.category || "",
      description: data.description || "",
      content,
    };
  });
}

export function getFicheBySlug(slug: string): Fiche | undefined {
  return getAllFiches().find((f) => f.slug === slug);
}

export function getFichesByCategory(category: string): Fiche[] {
  return getAllFiches().filter((f) => f.category === category);
}
