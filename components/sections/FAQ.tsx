"use client";

import { Container } from "@/components/ui/Container";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-[#F4F2EC] border-t border-gray-200" id="honoraires">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
          
          <div className="lg:col-span-4">
            <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-6">
              {t.faq.title} <br/>
              <span className="italic text-gray-500">{t.faq.titleItalic}</span>
            </h2>
            <p className="text-gray-700 font-normal text-base leading-relaxed">
              {t.faq.subtitle}
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="space-y-4">
              {t.faq.items.map((faq, index) => (
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
                      openIndex === index ? "text-[#1A1A1A]" : "text-gray-500 group-hover:text-[#1A1A1A]"
                    )}>
                      {faq.question}
                    </span>
                    <div className={cn(
                      "h-8 w-8 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 ml-4",
                      openIndex === index ? "border-[#362A24] bg-[#362A24] text-white" : "border-gray-200 text-gray-400 group-hover:border-gray-400"
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
