"use client";

import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";
import { ArrowRight, Trophy } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[90vh] flex flex-col pt-32 pb-12 overflow-hidden bg-[#F4F2EC]" id="cabinet">
      <Container className="flex-1 flex flex-col justify-center">
        
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Colonne Texte */}
          <motion.div 
            className="lg:col-span-7 z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#362A24]/10 text-[#362A24] mb-8">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-bold tracking-wide">{t.hero.badge}</span>
            </div>

            <h1 className="font-serif text-6xl md:text-7xl lg:text-[7.5rem] leading-[1.05] tracking-tight text-[#1A1A1A] mb-8">
              {t.hero.title1}<br/>
              {t.hero.title2}
            </h1>

            <p className="text-xl md:text-2xl text-gray-800 font-normal leading-relaxed max-w-2xl mb-12">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <a 
                href="tel:0140680237" 
                className="group inline-flex items-center gap-3 bg-[#362A24] text-white px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-[#2C221D] transition-all duration-300"
              >
                {t.hero.cta1}
              </a>
              
              <a 
                href="#expertises"
                className="flex items-center gap-3 px-4 py-2 text-[#1A1A1A]/80 hover:text-[#1A1A1A] transition-colors group"
              >
                <div className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-[#1A1A1A] transition-colors">
                  <ArrowRight className="h-4 w-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                </div>
                <span className="font-serif italic text-lg">{t.hero.cta2}</span>
              </a>
            </div>

            <p className="mt-8 text-xs font-bold uppercase tracking-widest text-gray-500">
              {t.hero.availability}
            </p>
          </motion.div>

          {/* Colonne Image */}
          <motion.div 
            className="hidden lg:block lg:col-span-5 relative lg:h-[700px] w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gray-200 rounded-lg overflow-hidden">
               <Image
                 src="/DSC01907.webp"
                 alt="Cabinet Fain Avocats - Bureau Paris 16"
                 fill
                 className="object-cover"
                 priority
               />
            </div>
          </motion.div>
        </div>

      </Container>
      
      {/* Bandeau Citation en bas */}
      <div className="mt-auto pt-12 border-t border-gray-300/60 mx-4 md:mx-12">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 text-xs font-bold tracking-widest uppercase text-gray-500">
          <span>{t.hero.address}</span>
          <span>{t.hero.barreau}</span>
        </div>
      </div>
    </section>
  );
}
