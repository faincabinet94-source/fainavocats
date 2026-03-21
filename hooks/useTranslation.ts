"use client";

import { useState, useEffect } from "react";
import { fr } from "@/lib/i18n/fr";
import { en } from "@/lib/i18n/en";

export function useTranslation() {
  const [lang, setLang] = useState<"fr" | "en">("fr");

  useEffect(() => {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("en")) {
      setLang("en");
    }
  }, []);

  const t = lang === "en" ? en : fr;

  return { t, lang };
}
