"use client";

import { Container } from "@/components/ui/Container";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Le Cabinet", href: "#cabinet" },
  { name: "Expertises", href: "#expertises" },
  { name: "Honoraires", href: "#honoraires" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-500 ease-in-out border-b",
          scrolled 
            ? "bg-[#F9F8F6]/95 backdrop-blur-md py-3 shadow-sm border-gray-200" 
            : "bg-[#F9F8F6]/80 backdrop-blur-sm py-6 border-transparent"
        )}
      >
        <Container>
          <div className="flex items-center justify-between">
            {/* Logo Typographique */}
            <a href="#" className="relative z-50 group">
              <span className="font-serif text-2xl font-bold tracking-tight text-foreground group-hover:opacity-80 transition-opacity">
                FAIN AVOCATS.
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-12">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="relative text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-foreground transition-colors py-2 group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
              
              {/* Bouton Appel Direct dans la Nav Desktop */}
              <a 
                href="tel:0140680237"
                className="bg-foreground text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
              >
                Prendre RDV
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden z-50 p-2 -mr-2 text-foreground hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </Container>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-[#F9F8F6] z-[60] flex flex-col justify-center items-center transition-all duration-500 md:hidden",
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
      >
        {/* Bouton de fermeture dédié pour mobile */}
        <button 
          className="absolute top-6 right-6 p-2 text-foreground hover:bg-gray-100 rounded-full transition-colors"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X className="h-8 w-8" />
        </button>

        <div className="flex flex-col items-center gap-8 p-8 text-center">
          {navigation.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "font-serif text-3xl text-foreground hover:text-gray-600 transition-all duration-500 transform",
                mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          
          <div className={cn(
            "mt-8 pt-8 border-t border-gray-200 w-full transition-all duration-700 delay-500",
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          )}>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Prendre rendez-vous</p>
            <a href="tel:0140680237" className="font-serif text-2xl text-foreground block bg-white border border-gray-200 py-4 px-6 mt-4 hover:bg-gray-50 transition-colors">
              Appeler le cabinet
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
