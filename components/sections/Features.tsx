"use client";

import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const MotionLink = motion(Link);
import { useTranslation } from "@/hooks/useTranslation";

// Liens par index (indépendant de la langue)
const expertiseLinks = [
  "/divorce",
  "/garde-enfants",
  "/patrimoine-successions",
  "#contact",
  "#contact",
  "#contact",
];

export function Features() {
  const { t } = useTranslation();

  return (
    <section className="py-32 bg-[#131B16] text-white" id="expertises">
      <Container>
        <div className="grid lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-sm font-medium tracking-wider text-white/80 mb-6 uppercase">
                {t.expertises.subtitle}
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-8">
            <div className="flex flex-col gap-4">
              {t.expertises.items.map((item, index) => {
                const href = expertiseLinks[index] || "#contact";
                const isPage = href.startsWith("/");

                return isPage ? (
                  <MotionLink
                    key={index}
                    href={href}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group flex items-center gap-4 py-2"
                  >
                    <h3 className="text-3xl md:text-5xl font-serif text-white/80 group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                    <ArrowRight className="w-6 h-6 text-white/0 group-hover:text-[#C2A679] -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  </MotionLink>
                ) : (
                  <motion.h3
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-3xl md:text-5xl font-serif text-white/80 hover:text-white transition-colors cursor-default py-2"
                  >
                    {item.title}
                  </motion.h3>
                );
              })}
              
              <MotionLink
                href="/pension-alimentaire"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: t.expertises.items.length * 0.1 }}
                className="group flex items-center gap-4 mt-4"
              >
                <h3 className="text-3xl md:text-5xl font-serif text-[#C2A679] italic group-hover:text-white transition-colors">
                  Pension alimentaire
                </h3>
                <ArrowRight className="w-6 h-6 text-white/0 group-hover:text-[#C2A679] -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
              </MotionLink>
            </div>

            <motion.div 
              className="mt-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <a 
                href="tel:0140680237" 
                className="inline-flex items-center justify-center bg-white text-[#1A1A1A] px-8 py-3 rounded-full text-sm font-bold hover:bg-gray-200 transition-all duration-300"
              >
                {t.expertises.cta}
              </a>
            </motion.div>
          </div>

        </div>
      </Container>
    </section>
  );
}
