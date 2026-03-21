"use client";

import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a
      href="tel:0140680237"
      className={`fixed bottom-6 right-6 z-50 md:hidden flex items-center gap-2 bg-[#362A24] text-white px-5 py-3 rounded-full shadow-lg transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      }`}
      aria-label={t.hero.cta1}
    >
      <Phone className="w-5 h-5" />
      <span className="text-sm font-semibold">{t.nav.cta}</span>
    </a>
  );
}
