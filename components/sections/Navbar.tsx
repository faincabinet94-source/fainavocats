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
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500 ease-in-out",
        scrolled ? "bg-[#F9F8F6]/95 backdrop-blur-sm py-4 shadow-sm" : "bg-transparent py-8"
      )}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo Typographique */}
          <a href="#" className="flex flex-col z-50">
            <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
              FAIN AVOCATS.
            </span>
          </a>

          {/* Desktop Navigation - Centrée et Minimaliste */}
          <div className="hidden md:flex items-center gap-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-foreground transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden z-50 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 bg-[#F9F8F6] z-40 flex items-center justify-center md:hidden">
              <div className="flex flex-col items-center gap-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="font-serif text-3xl text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </nav>
  );
}
