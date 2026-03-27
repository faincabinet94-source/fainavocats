"use client";

import { Container } from "@/components/ui/Container";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ArrowLeft, Plus, Minus, CheckCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ExpertiseData } from "@/lib/expertises";

export function ExpertisePage({ data }: { data: ExpertiseData }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-[#F4F2EC]">
      {/* Hero */}
      <section className="pt-40 pb-20 border-b border-gray-200">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/#expertises"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-[#1A1A1A] transition-colors mb-10"
            >
              <ArrowLeft className="w-4 h-4" />
              Nos expertises
            </Link>

            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#362A24]/10 text-[#362A24] rounded-full mb-6">
                {data.title}
              </span>

              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#1A1A1A] leading-[1.1] mb-8">
                {data.heroTitle}
              </h1>

              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-10">
                {data.heroSubtitle}
              </p>

              <a
                href="tel:0140680237"
                className="inline-flex items-center gap-3 bg-[#362A24] text-white px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-[#2C221D] transition-all duration-300"
              >
                <Phone className="w-4 h-4" />
                Consultation gratuite — 01 40 68 02 37
              </a>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Introduction */}
      <section className="py-20">
        <Container>
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-normal">
              {data.intro}
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Problématique */}
      <section className="py-20 bg-[#131B16] text-white">
        <Container>
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
                {data.problemTitle}
              </h2>
              <p className="text-white/70 leading-relaxed">
                {data.problemText}
              </p>
            </motion.div>

            <div className="lg:col-span-7">
              <div className="space-y-4">
                {data.problemPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4 py-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <CheckCircle className="w-5 h-5 text-[#C2A679] shrink-0 mt-0.5" />
                    <p className="text-white/90 text-lg">{point}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Notre approche - Étapes */}
      <section className="py-24">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-4">
              {data.approachTitle}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              {data.approachText}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.steps.map((step, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-10 h-10 rounded-full bg-[#362A24] text-white flex items-center justify-center text-sm font-bold mb-6">
                  {index + 1}
                </div>
                <h3 className="font-serif text-xl text-[#1A1A1A] mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-24 border-t border-gray-200">
        <Container>
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-6">
                  Questions <br />
                  <span className="italic text-gray-500">fréquentes.</span>
                </h2>
                <p className="text-gray-700 text-base leading-relaxed">
                  Les réponses aux questions les plus courantes concernant{" "}
                  {data.title.toLowerCase()}.
                </p>
              </motion.div>
            </div>

            <div className="lg:col-span-8">
              <div className="space-y-4">
                {data.faq.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <button
                      onClick={() =>
                        setOpenFaq(openFaq === index ? null : index)
                      }
                      className="w-full flex items-center justify-between py-4 text-left group"
                    >
                      <span
                        className={cn(
                          "font-serif text-xl transition-colors duration-300 pr-4",
                          openFaq === index
                            ? "text-[#1A1A1A]"
                            : "text-gray-500 group-hover:text-[#1A1A1A]"
                        )}
                      >
                        {item.question}
                      </span>
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0",
                          openFaq === index
                            ? "border-[#362A24] bg-[#362A24] text-white"
                            : "border-gray-200 text-gray-400 group-hover:border-gray-400"
                        )}
                      >
                        {openFaq === index ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="pb-4 text-gray-700 leading-relaxed max-w-2xl">
                            {item.answer}
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

      {/* CTA Final */}
      <section className="py-20 bg-[#131B16]">
        <Container>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
              Besoin d'un avocat en{" "}
              <span className="italic text-[#C2A679]">
                {data.title.toLowerCase()}
              </span>{" "}
              ?
            </h2>
            <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
              Premier entretien téléphonique gratuit. Nous vous rappelons sous
              24h.
            </p>
            <a
              href="tel:0140680237"
              className="inline-flex items-center gap-3 bg-white text-[#1A1A1A] px-10 py-5 rounded-full text-lg font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              01 40 68 02 37
            </a>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-white/40">
              196 Avenue Victor Hugo, 75116 Paris
            </p>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
