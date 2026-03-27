"use client";

import { Container } from "@/components/ui/Container";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export function Contact() {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-[#F4F2EC]" id="contact">
      <Container>
        <div className="grid lg:grid-cols-2 gap-0 border border-gray-200 shadow-sm bg-white overflow-hidden">
          
          {/* Gauche - Carte */}
          <div className="relative min-h-[400px] lg:min-h-full bg-gray-100 overflow-hidden group">
            <div className="absolute inset-0 z-0">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.588828691583!2d2.277567315674705!3d48.86603897928828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66f8a0e0e0e0f%3A0x0!2s196%20Av.%20Victor%20Hugo%2C%2075116%20Paris!5e0!3m2!1sfr!2sfr!4v1629898989898!5m2!1sfr!2sfr" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Marqueur stylisé */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <div className="relative flex h-8 w-8">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#362A24] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-8 w-8 bg-[#362A24] items-center justify-center text-white text-xs font-bold">FAIN</span>
              </div>
            </div>
          </div>

          {/* Droite - Infos + CTA Appel */}
          <div className="bg-white p-8 md:p-16 flex flex-col justify-center">
            <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-4">
              {t.contact.title1} <br/>
              <span className="italic text-gray-500">{t.contact.title2}</span>
            </h2>
            <p className="text-gray-600 mb-10">
              {t.contact.formSubtitle}
            </p>

            {/* Bouton d'appel principal */}
            <a 
              href="tel:+33140680237"
              className="flex items-center justify-center gap-3 bg-[#362A24] text-white py-5 rounded-full text-lg font-semibold tracking-wide hover:bg-[#2C221D] transition-all duration-300 mb-10"
            >
              <Phone className="w-5 h-5" />
              +33 1 40 68 02 37
            </a>

            {/* Infos pratiques */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#362A24]/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#362A24]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{t.contact.addressTitle}</h3>
                  <p className="text-[#1A1A1A] font-medium">196 avenue victor hugo, 75116 paris</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#362A24]/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#362A24]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{t.contact.fastResponse}</h3>
                  <p className="text-[#1A1A1A] font-medium">{t.hero.availability}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#362A24]/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#362A24]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Email</h3>
                  <a href="mailto:jf@fain-avocats.fr" className="text-[#1A1A1A] font-medium hover:text-[#362A24] transition-colors">jf@fain-avocats.fr</a>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 text-center mt-10">
              {t.contact.confidential}
            </p>
          </div>

        </div>
      </Container>
    </section>
  );
}
