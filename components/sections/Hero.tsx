"use client";

import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col pt-32 pb-12 overflow-hidden">
      <Container className="flex-1 flex flex-col justify-center">
        
        {/* En-tête éditorial */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Colonne Texte (7 colonnes) */}
          <motion.div 
            className="lg:col-span-7 z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-gray-400"></div>
              <span className="text-sm font-bold tracking-widest uppercase text-gray-500">Depuis 2003 • Paris 16</span>
            </div>

            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl leading-[1.1] text-foreground mb-8">
              Avocat <br/>
              <span className="italic text-gray-500">Droit de la famille.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-2xl mb-12">
              Cabinet expert à Paris 16ème (Victor Hugo). Divorce, garde d'enfants, patrimoine. Une défense d'excellence pour protéger vos intérêts.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <a 
                href="#contact" 
                className="group inline-flex items-center gap-3 bg-foreground text-white px-8 py-4 text-sm font-bold tracking-wider uppercase hover:bg-gray-800 transition-all duration-300"
              >
                Prendre rendez-vous
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a 
                href="tel:0140680237"
                className="flex items-center gap-3 px-4 py-2 text-foreground/80 hover:text-foreground transition-colors group"
              >
                <div className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-foreground transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="font-serif italic text-lg">01 40 68 02 37</span>
              </a>
            </div>
          </motion.div>

          {/* Colonne Image (5 colonnes) - La vraie photo */}
          <motion.div 
            className="lg:col-span-5 relative h-[500px] lg:h-[700px] w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gray-200">
               {/* Image Principale */}
               <Image
                 src="/DSC01907.webp"
                 alt="Cabinet Fain Avocats - Bureau Paris 16"
                 fill
                 className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-out"
                 priority
               />
               
               {/* Cadre décoratif "Boutique" */}
               <div className="absolute -bottom-6 -left-6 w-full h-full border border-foreground/10 z-[-1] hidden lg:block"></div>
            </div>
          </motion.div>
        </div>

      </Container>
      
      {/* Bandeau Citation en bas */}
      <div className="mt-auto pt-12 border-t border-gray-200/60 mx-4 md:mx-12">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 text-xs font-bold tracking-widest uppercase text-gray-400">
          <span>196 Avenue Victor Hugo, 75116 Paris</span>
          <span>Avocats au Barreau de Paris</span>
        </div>
      </div>
    </section>
  );
}
