"use client";

import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { Star } from "lucide-react";

export function Testimonials() {
  const { t } = useTranslation();

  return (
    <section className="py-32 bg-[#F4F2EC]" id="temoignages">
      <Container>
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-6">
              {t.testimonials.title}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-8">
              {t.testimonials.subtitle}
            </p>
            
            {/* Note Google */}
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2 text-[#1A1A1A]">
                <span className="text-3xl font-bold">{t.testimonials.googleRating}</span>
                <div className="flex text-[#FABB05]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
                {t.testimonials.googleReviews}
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {t.testimonials.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white p-10 shadow-sm border border-gray-100 flex flex-col justify-between h-full"
            >
              <div className="flex text-[#FABB05] mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="font-serif text-lg leading-relaxed text-[#1A1A1A] mb-8">
                "{item.text}"
              </p>
              
              <div className="mt-auto border-t border-gray-100 pt-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                  {item.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[#1A1A1A]">{item.author}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
