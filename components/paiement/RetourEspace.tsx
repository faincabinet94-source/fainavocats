"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ESPACE_CLIENT_URL, oublierRetour } from "@/lib/paiement";

/* Après un paiement lancé depuis l'espace client : bouton « Retour à mon
   espace », et retour automatique après quelques secondes quand rien ne
   retient le client sur la page (`auto`). Ne rend rien si le paiement ne
   venait pas de l'espace. */
const DELAI = 6;

export function RetourEspace({ actif, auto = false }: { actif: boolean; auto?: boolean }) {
  const [reste, setReste] = useState(DELAI);

  useEffect(() => {
    if (!actif) return;
    oublierRetour();
    if (!auto) return;
    const t = setInterval(() => setReste((r) => r - 1), 1000);
    const fin = setTimeout(() => {
      window.location.href = ESPACE_CLIENT_URL;
    }, DELAI * 1000);
    return () => {
      clearInterval(t);
      clearTimeout(fin);
    };
  }, [actif, auto]);

  if (!actif) return null;
  return (
    <div className="mt-8">
      <a
        href={ESPACE_CLIENT_URL}
        className="inline-flex items-center gap-2.5 rounded-full bg-[#362A24] px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#2C221D]"
      >
        Retour à mon espace
        <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
      </a>
      {auto && reste > 0 && (
        <p className="mt-3 text-sm text-gray-500">Vous y serez ramené dans {reste} seconde{reste > 1 ? "s" : ""}.</p>
      )}
    </div>
  );
}
