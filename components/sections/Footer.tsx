"use client";

import { Container } from "@/components/ui/Container";
import { useTranslation } from "@/hooks/useTranslation";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#EAE8E3] py-20">
      <Container>
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          
          {/* Colonne 1 - Branding */}
          <div>
            <h3 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-4">
              Fain Avocats
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              {t.footer.desc}
            </p>
          </div>

          {/* Colonne 2 - Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] mb-4">
              {t.footer.contactTitle}
            </h4>
            <div className="space-y-3 text-gray-600">
              <p>196 Avenue Victor Hugo<br/>75116 Paris</p>
              <p>
                <a href="tel:0140680237" className="hover:text-[#362A24] transition-colors">
                  01 40 68 02 37
                </a>
              </p>
              <p>
                <a href="mailto:jf@fain-avocats.fr" className="hover:text-[#362A24] transition-colors">
                  jf@fain-avocats.fr
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
              <a href="#expertises" className="hover:text-[#362A24] transition-colors">
                {t.footer.links.expertises}
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
