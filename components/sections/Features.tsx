"use client";

import { Container } from "@/components/ui/Container";
import { ArrowRight } from "lucide-react";

const expertises = [
  {
    title: "Divorce & Séparation",
    desc: "Consentement mutuel, procédure contentieuse, rupture de PACS."
  },
  {
    title: "Garde d'Enfants",
    desc: "Résidence alternée, droit de visite, autorité parentale."
  },
  {
    title: "Patrimoine & Successions",
    desc: "Liquidation de régime matrimonial, indivision, héritage."
  },
  {
    title: "Filiation & Adoption",
    desc: "Recherche de paternité, adoption simple et plénière."
  },
  {
    title: "Droit Pénal de la Famille",
    desc: "Violences conjugales, non-présentation d'enfant, abandon."
  }
];

export function Features() {
  return (
    <section className="py-24 bg-[#F9F8F6]" id="expertises">
      <Container>
        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* Titre Section */}
          <div className="lg:col-span-4">
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6 leading-tight">
              Domaines <br/>
              <span className="italic text-gray-500">d'intervention.</span>
            </h2>
            <p className="text-gray-700 font-normal leading-relaxed mb-8 text-lg">
              Une expertise pointue exclusivement dédiée au droit de la famille et du patrimoine. Nous intervenons à chaque étape de votre vie personnelle.
            </p>
            <a href="#contact" className="inline-flex items-center text-xs font-bold uppercase tracking-widest border-b border-foreground pb-1 hover:text-gray-600 transition-colors">
              Tous nos services
            </a>
          </div>

          {/* Liste Expertises */}
          <div className="lg:col-span-8">
            <div className="border-t border-gray-300">
              {expertises.map((item, index) => (
                <div key={index} className="group border-b border-gray-300 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-default transition-all hover:bg-white/50 px-4 -mx-4">
                  <div>
                    <h3 className="font-serif text-2xl text-foreground mb-2 group-hover:pl-4 transition-all duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 font-normal text-base md:max-w-md group-hover:pl-4 transition-all duration-300">
                      {item.desc}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 duration-300" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
