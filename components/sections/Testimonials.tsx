"use client";

import { Container } from "@/components/ui/Container";

export function Testimonials() {
  return (
    <section className="py-32 bg-foreground text-[#F9F8F6] overflow-hidden" id="temoignages">
      <Container>
        <div className="max-w-4xl mx-auto text-center relative">
          
          {/* Guillemet décoratif géant */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 text-[12rem] font-serif text-white/5 leading-none select-none pointer-events-none">
            &rdquo;
          </div>

          <p className="font-serif text-3xl md:text-5xl leading-tight mb-12 relative z-10">
            Une écoute rare et une stratégie implacable. Me Fain a su transformer une situation inextricable en un accord équilibré.
          </p>

          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
              Sophie L.
            </span>
            <span className="text-sm font-light text-white/40 italic">
              Divorce contentieux — Paris 16
            </span>
            
            <div className="mt-8 pt-8 border-t border-white/10 w-full flex justify-center gap-8">
               <div className="text-center">
                 <div className="text-2xl font-serif">4.7/5</div>
                 <div className="text-[10px] uppercase tracking-wider text-white/40">Google Avis</div>
               </div>
               <div className="w-px bg-white/10 h-10"></div>
               <div className="text-center">
                 <div className="text-2xl font-serif">20+</div>
                 <div className="text-[10px] uppercase tracking-wider text-white/40">Années d'expérience</div>
               </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
