import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-lato)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      colors: {
        background: "#F9F8F6", // Papier d'art
        foreground: "#1A1A1A", // Noir encre
        border: "#E0DED9", // Gris chaud
        primary: {
          DEFAULT: "#1A1A1A", // Noir pour les actions principales (luxe sobre)
          hover: "#404040",
        },
        accent: {
          blue: "#2C3E50", // Bleu institutionnel
          gold: "#D4AF37", // Or mat (détails uniquement)
        },
      },
    },
  },
  plugins: [],
};

export default config;
