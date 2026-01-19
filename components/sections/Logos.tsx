"use client";

import { Container } from "@/components/ui/Container";

const logos = [
  "Barreau de Paris",
  "Conseil National des Barreaux",
  "Droit de la Famille",
  "Avocats.fr",
  "JurisData",
];

export function Logos() {
  return (
    <section className="py-10 border-b border-gray-100 bg-white">
      <Container>
        <p className="text-center text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">
          Membres et partenaires institutionnels
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Remplacer par de vrais logos SVG si possible, ici texte stylisé pour l'instant */}
          {logos.map((logo, index) => (
            <div key={index} className="text-lg font-serif font-bold text-gray-400 hover:text-primary transition-colors cursor-default">
              {logo}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
