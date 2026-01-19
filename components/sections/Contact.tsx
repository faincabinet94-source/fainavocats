"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function Contact() {
  return (
    <section className="py-24 bg-[#F9F8F6]" id="contact">
      <Container>
        <div className="grid lg:grid-cols-2 gap-0 border border-gray-200 shadow-sm bg-white">
          
          {/* Info Gauche + Carte */}
          <div className="relative min-h-[500px] lg:min-h-full bg-gray-100 p-8 flex flex-col justify-between overflow-hidden group">
            
            {/* Carte Stylisée (CSS only pour l'instant) */}
            <div className="absolute inset-0 z-0 grayscale opacity-80 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-100 group-hover:grayscale-0">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.588828691583!2d2.277567315674705!3d48.86603897928828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66f8a0e0e0e0f%3A0x0!2s196%20Av.%20Victor%20Hugo%2C%2075116%20Paris!5e0!3m2!1sfr!2sfr!4v1629898989898!5m2!1sfr!2sfr" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'grayscale(100%) contrast(1.1)' }} 
                allowFullScreen={true} 
                loading="lazy"
                className="w-full h-full object-cover"
              ></iframe>
            </div>
            
            {/* Overlay Gradient pour lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-transparent z-10 pointer-events-none"></div>

            <div className="relative z-20">
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">
                  Prenons le temps <br/>
                  <span className="italic text-gray-500">d'échanger.</span>
                </h2>
                
                <div className="space-y-8">
                  <div className="bg-white/80 backdrop-blur-sm p-6 border border-gray-100 shadow-sm inline-block min-w-[280px]">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Adresse</h3>
                    <p className="font-serif text-xl text-foreground">196 avenue Victor Hugo<br/>75116 Paris</p>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm p-6 border border-gray-100 shadow-sm inline-block min-w-[280px]">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Contact Direct</h3>
                    <a href="tel:0140680237" className="font-serif text-2xl text-foreground hover:text-blue-900 transition-colors">01 40 68 02 37</a>
                    <p className="text-gray-600 font-light mt-1 text-sm">Appel gratuit de 15 min</p>
                  </div>
                </div>
            </div>

            {/* Marqueur stylisé */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                 <div className="relative flex h-8 w-8">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-8 w-8 bg-foreground items-center justify-center text-white text-xs font-bold">FAIN</span>
                </div>
            </div>
          </div>

          {/* Formulaire Droite */}
          <div className="bg-white p-8 md:p-16 flex flex-col justify-center">
            <h3 className="font-serif text-2xl text-foreground mb-8">
              Demande de rappel
            </h3>
            
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="firstname" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-foreground transition-colors">Prénom</label>
                  <input type="text" id="firstname" className="w-full border-b border-gray-200 py-2 focus:border-foreground focus:outline-none bg-transparent transition-colors" />
                </div>
                <div className="group">
                  <label htmlFor="lastname" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-foreground transition-colors">Nom</label>
                  <input type="text" id="lastname" className="w-full border-b border-gray-200 py-2 focus:border-foreground focus:outline-none bg-transparent transition-colors" />
                </div>
              </div>

              <div className="group">
                <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-foreground transition-colors">Téléphone</label>
                <input type="tel" id="phone" className="w-full border-b border-gray-200 py-2 focus:border-foreground focus:outline-none bg-transparent transition-colors" />
              </div>

              <div className="group">
                <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-foreground transition-colors">Message (optionnel)</label>
                <textarea id="message" rows={2} className="w-full border-b border-gray-200 py-2 focus:border-foreground focus:outline-none bg-transparent transition-colors resize-none"></textarea>
              </div>

              <button className="w-full bg-foreground text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors mt-6">
                Être rappelé gratuitement
              </button>
              
              <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                Vos informations restent strictement confidentielles.
              </p>
            </form>
          </div>

        </div>
      </Container>
    </section>
  );
}
