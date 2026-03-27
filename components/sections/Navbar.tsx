"use client";

import { Container } from "@/components/ui/Container";
import { Menu, X, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Gère le scroll vers une ancre, depuis n'importe quelle page
  const handleAnchorClick = (e: React.MouseEvent, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const anchor = href.slice(1);
    setMobileMenuOpen(false);

    if (pathname === "/") {
      // Déjà sur la homepage : scroll direct
      const el = document.getElementById(anchor);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      // Sur une autre page : retour homepage puis scroll
      router.push(`/#${anchor}`);
    }
  };

  // Scroll vers l'ancre après navigation (si URL contient un hash)
  useEffect(() => {
    if (pathname === "/" && window.location.hash) {
      const anchor = window.location.hash.slice(1);
      const el = document.getElementById(anchor);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [pathname]);

  const navigation = [
    { name: t.nav.cabinet, href: "#cabinet" },
    { name: t.nav.expertises, href: "#expertises" },
    { name: "Actualités", href: "/actualites" },
    { name: t.nav.honoraires, href: "#honoraires" },
    { name: t.nav.contact, href: "#contact" },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-500 ease-in-out border-b",
          scrolled
            ? "bg-[#F4F2EC]/95 backdrop-blur-md py-3 shadow-sm border-gray-200"
            : "bg-[#F4F2EC]/80 backdrop-blur-sm py-6 border-transparent"
        )}
      >
        <Container>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="relative z-50 group">
              <Image
                src="/logo-fain.png"
                alt="Fain Avocats"
                width={90}
                height={60}
                className="h-12 w-auto object-contain group-hover:opacity-80 transition-opacity"
                priority
              />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-12">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href.startsWith("#") ? `/#${item.href.slice(1)}` : item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  className="relative text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#1A1A1A] transition-colors py-2 group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-[#1A1A1A] transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}

              <a
                href="tel:0140680237"
                className="bg-[#362A24] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#2C221D] transition-colors"
              >
                {t.nav.cta}
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden z-50 p-2 -mr-2 text-[#1A1A1A] hover:bg-gray-100 rounded-full transition-colors"
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
          "fixed inset-0 bg-[#F4F2EC] z-[60] flex flex-col justify-between transition-all duration-500 md:hidden",
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Image
            src="/logo-fain.png"
            alt="Fain Avocats"
            width={80}
            height={54}
            className="h-10 w-auto object-contain"
          />
          <button
            className="p-2 text-[#1A1A1A] hover:bg-gray-200 rounded-full transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-7 w-7" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-7 px-8">
          {navigation.map((item, index) => (
            <a
              key={item.name}
              href={item.href.startsWith("#") ? `/#${item.href.slice(1)}` : item.href}
              onClick={(e) => handleAnchorClick(e, item.href)}
              className={cn(
                "font-serif text-4xl text-[#1A1A1A] hover:text-[#362A24] transition-all duration-500 transform",
                mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              )}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className={cn(
          "px-6 pb-10 transition-all duration-700 delay-500",
          mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <a
            href="tel:0140680237"
            className="flex items-center justify-center gap-3 w-full bg-[#362A24] text-white py-5 rounded-full text-lg font-semibold tracking-wide hover:bg-[#2C221D] transition-all duration-300 shadow-lg"
          >
            <Phone className="w-5 h-5" />
            {t.nav.cta} — 01 40 68 02 37
          </a>
          <p className="text-center text-xs text-gray-500 mt-3 font-medium">
            {t.hero.availability}
          </p>
        </div>
      </div>
    </>
  );
}
