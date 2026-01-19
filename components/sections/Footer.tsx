"use client";

import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="bg-[#F9F8F6] border-t border-gray-200 py-16">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          
          <div>
            <h3 className="font-serif text-2xl font-bold text-foreground mb-2">FAIN AVOCATS.</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Droit de la famille & Patrimoine
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-xs font-bold uppercase tracking-widest text-gray-500">
            <a href="#" className="hover:text-foreground transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-foreground transition-colors">Honoraires</a>
            <a href="#" className="hover:text-foreground transition-colors">Confidentialité</a>
            <a href="https://www.linkedin.com" target="_blank" className="hover:text-foreground transition-colors">LinkedIn</a>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 text-[10px] uppercase tracking-widest text-gray-400 text-center md:text-left">
          © {new Date().getFullYear()} Fain Avocats — Paris 16ème
        </div>
      </Container>
    </footer>
  );
}
