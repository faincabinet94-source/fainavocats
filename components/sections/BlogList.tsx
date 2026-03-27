"use client";

import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, User } from "lucide-react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogList({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="py-12">
      <Container>
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">
            Actualités juridiques
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-[#1A1A1A] mb-6">
            Droit de la famille
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Retrouvez nos publications sur le divorce, la garde d'enfants, la
            pension alimentaire et le patrimoine familial.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link
                href={`/actualites/${post.slug}`}
                className="group block bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full"
              >
                {post.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-8 flex flex-col h-full">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                  </div>

                  <h2 className="font-serif text-xl text-[#1A1A1A] mb-3 group-hover:text-[#362A24] transition-colors leading-tight">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6">
                    {post.description}
                  </p>

                  <div className="mt-auto flex items-center gap-2 text-sm font-medium text-[#362A24] opacity-0 group-hover:opacity-100 transition-opacity">
                    Lire l'article
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-[#1A1A1A] transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
