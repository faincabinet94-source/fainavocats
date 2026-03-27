"use client";

import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

export function Welcome() {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-[#F4F2EC]" id="welcome">
      <Container>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1A1A1A] mb-8 leading-tight">
              {t.welcome.title}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <p className="text-gray-700 text-lg leading-relaxed">
                {t.welcome.p1}
              </p>
              
              <p className="text-gray-700 text-lg leading-relaxed">
                {t.welcome.p2}
              </p>
            </div>

            <a 
              href="tel:+33140680237" 
              className="inline-flex items-center gap-2 bg-[#362A24] text-white px-8 py-4 rounded-full text-sm font-semibold tracking-wide hover:bg-[#2C221D] transition-all duration-300"
            >
              {t.welcome.cta}
            </a>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
