"use client";

import { Container } from "@/components/ui/Container";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Comment fonctionne la première prise de contact ?",
    answer: "Nous proposons un premier entretien téléphonique gratuit. Cela nous permet de comprendre votre situation et de vous confirmer si nous sommes le bon cabinet pour vous accompagner."
  },
  {
    question: "Quel est le coût d'une consultation au cabinet ?",
    answer: "Si une analyse approfondie de votre dossier est nécessaire, nous vous proposons une consultation au cabinet facturée 120€ TTC. Ce montant est déductible de nos honoraires si vous nous confiez votre dossier."
  },
  {
    question: "Quels sont les délais pour obtenir un rendez-vous ?",
    answer: "Nous nous engageons à vous proposer un créneau sous 24 à 48h ouvrées. En cas d'urgence (violences, enlèvement d'enfant), nous vous recevons dans la journée."
  },
  {
    question: "Comment sont fixés vos honoraires ?",
    answer: "Nous privilégions la transparence totale. Une convention d'honoraires écrite vous est systématiquement proposée avant toute démarche, le plus souvent sous forme de forfait pour que vous maîtrisiez votre budget."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-[#F9F8F6] border-t border-gray-200" id="honoraires">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
          
          <div className="lg:col-span-4">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">
              Questions <br/>
              <span className="italic text-gray-500">fréquentes.</span>
            </h2>
            <p className="text-gray-700 font-normal text-base leading-relaxed">
              Nous savons que les démarches juridiques peuvent être source d&apos;anxiété. Voici des réponses claires pour avancer sereinement.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="border-b border-gray-200 pb-4"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between py-4 text-left group"
                  >
                    <span className={cn(
                      "font-serif text-xl transition-colors duration-300",
                      openIndex === index ? "text-foreground" : "text-gray-500 group-hover:text-foreground"
                    )}>
                      {faq.question}
                    </span>
                    <div className={cn(
                      "h-8 w-8 rounded-full border flex items-center justify-center transition-all duration-300",
                      openIndex === index ? "border-foreground bg-foreground text-white" : "border-gray-200 text-gray-400 group-hover:border-gray-400"
                    )}>
                      {openIndex === index ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="pb-4 text-gray-700 font-normal leading-relaxed max-w-2xl">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
