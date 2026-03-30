"use client";

import { Container } from "@/components/ui/Container";
import { useTranslation } from "@/hooks/useTranslation";
import { LogoFain } from "@/components/ui/LogoFain";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#EAE8E3] py-20">
      <Container>
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          
          {/* Colonne 1 - Branding */}
          <div>
            <LogoFain size="md" className="mb-6 items-start" />
            <p className="text-gray-600 leading-relaxed mb-6">
              {t.footer.desc}
            </p>
            <a
              href="https://www.linkedin.com/in/fainavocat/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0A66C2] transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
          </div>

          {/* Colonne 2 - Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] mb-4">
              {t.footer.contactTitle}
            </h4>
            <div className="space-y-3 text-gray-600">
              <p>196 avenue victor hugo<br/>75116 Paris</p>
              <p>
                <a href="tel:+33140680237" className="hover:text-[#362A24] transition-colors">
                  +33 1 40 68 02 37
                </a>
              </p>
              <p>
                <a href="mailto:contact@fain-avocats.fr" className="hover:text-[#362A24] transition-colors">
                  contact@fain-avocats.fr
                </a>
              </p>
            </div>
          </div>

          {/* Colonne 3 - Liens */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] mb-4">
              {t.footer.linksTitle}
            </h4>
            <div className="flex flex-col gap-3 text-gray-600">
              <a href="/droit-de-la-famille" className="hover:text-[#362A24] transition-colors">
                Droit de la famille
              </a>
              <a href="/fiches" className="hover:text-[#362A24] transition-colors">
                Fiches pratiques
              </a>
              <a href="/consultations" className="hover:text-[#362A24] transition-colors">
                Consultations
              </a>
              <a href="/devis" className="hover:text-[#362A24] transition-colors">
                Devis
              </a>
              <a href="/honoraires" className="hover:text-[#362A24] transition-colors">
                Honoraires
              </a>
              <a href="/paiement" className="hover:text-[#362A24] transition-colors">
                Paiement
              </a>
              <a href="/actualites" className="hover:text-[#362A24] transition-colors">
                Actualités
              </a>
              <a href="#contact" className="hover:text-[#362A24] transition-colors">
                {t.footer.links.contact}
              </a>
              <a href="/mentions-legales" className="hover:text-[#362A24] transition-colors">
                {t.footer.links.legal}
              </a>
              <a href="/confidentialite" className="hover:text-[#362A24] transition-colors">
                {t.footer.links.privacy}
              </a>
            </div>
          </div>

        </div>
        
        {/* Barre de copyright */}
        <div className="pt-8 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {t.footer.rights}</p>
          <p>{t.hero.barreau}</p>
        </div>
      </Container>
    </footer>
  );
}
