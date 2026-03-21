"use client";

import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const galleryImages = [
  {
    src: "/gallery-1.png",
    alt: "Cabinet Fain Avocats - Avocats en pleine préparation"
  },
  {
    src: "/gallery-2.png",
    alt: "Cabinet Fain Avocats - Détail robe d'avocat et codes"
  },
  {
    src: "/gallery-3.png",
    alt: "Cabinet Fain Avocats - Bureau de Maître Fain"
  }
];

export function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <section className="py-24 bg-[#F4F2EC]" id="gallery">
      <Container>
        <div className="max-w-6xl mx-auto">
          
          {/* Carousel */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-gray-200">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={galleryImages[currentIndex].src}
                alt={galleryImages[currentIndex].alt}
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Contrôles */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground p-3 rounded-full transition-all duration-300 shadow-lg"
              aria-label="Image précédente"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground p-3 rounded-full transition-all duration-300 shadow-lg"
              aria-label="Image suivante"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Indicateurs */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? "w-8 bg-white" 
                      : "w-2 bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Miniatures */}
          <div className="mt-6 grid grid-cols-5 gap-4">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative aspect-video overflow-hidden transition-all duration-300 ${
                  index === currentIndex 
                    ? "ring-2 ring-foreground opacity-100" 
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}
