"use client";

import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";
import Image from "next/image";
import { Linkedin } from "lucide-react";

export function Fondateur() {
  return (
    <section className="py-24 bg-white" id="fondateur">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0 overflow-hidden">
              <Image
                src="/fondateur-fain.png"
                alt="Maître Joackim Fain - Avocat fondateur du Cabinet Fain Avocats"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">
              Le fondateur
            </p>

            <h2 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-4 leading-tight">
              Maître Joackim{" "}
              <span className="italic text-gray-500">Fain</span>
            </h2>

            <p className="text-sm font-bold uppercase tracking-wider text-[#362A24] mb-8">
              Avocat associé — Barreau de Paris
            </p>

            <div className="space-y-6 mb-10">
              <p className="text-gray-700 text-lg leading-relaxed">
                Avocat au Barreau de Paris depuis plus de 12 ans, Maître
                Joackim Fain a fondé le cabinet avec une conviction : offrir
                à chaque client un accompagnement d'excellence, alliant
                rigueur juridique et profonde humanité.
              </p>

              <p className="text-gray-700 text-lg leading-relaxed">
                Spécialisé en droit de la famille et du patrimoine, il
                intervient dans les dossiers les plus sensibles — divorces
                complexes, conflits de garde, liquidations patrimoniales —
                avec une approche stratégique et une écoute attentive.
              </p>

              <p className="text-gray-700 text-lg leading-relaxed">
                Son engagement : défendre vos intérêts avec détermination
                tout en préservant ce qui compte le plus pour vous.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <a
                href="tel:+33140680237"
                className="inline-flex items-center gap-3 bg-[#362A24] text-white px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-[#2C221D] transition-all duration-300"
              >
                Prendre rendez-vous
              </a>

              <a
                href="https://www.linkedin.com/in/fainavocat/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0A66C2] transition-colors group"
              >
                <Linkedin className="w-5 h-5" />
                <span className="text-sm font-medium group-hover:underline">
                  Profil LinkedIn
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
