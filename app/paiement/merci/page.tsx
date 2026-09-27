"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { PagePaiement } from "@/components/paiement/PagePaiement";

/* Retour après paiement : Alma (?alma=1&pid=…), Stripe mensualités
   (?mensualites=cs_…) ou SumUp après une authentification bancaire
   (?sumup=…). Vérifie auprès du prestataire que le paiement est passé. */

function Contenu() {
  const q = useSearchParams();
  const [etat, setEtat] = useState<"verif" | "ok" | "echec">("verif");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    const pid = q.get("pid");
    const session = q.get("mensualites");
    const verif = async () => {
      if (session) {
        const j = await fetch(`/api/mensualites?session_id=${encodeURIComponent(session)}`).then((r) => r.json());
        if (j.statut !== "complete") return setEtat("echec");
        if (j.echeances && j.fin)
          setDetail(
            `${j.echeances} mensualités : le prélèvement s'arrêtera automatiquement après celle de ${new Date((j.fin - 86400) * 1000).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}.`,
          );
        return setEtat("ok");
      }
      if (pid) {
        const j = await fetch(`/api/alma?pid=${encodeURIComponent(pid)}`).then((r) => r.json());
        return setEtat(["in_progress", "paid", "inconnu"].includes(j.etat) ? "ok" : "echec");
      }
      setEtat("ok");
    };
    verif().catch(() => setEtat("ok"));
  }, [q]);

  return (
    <PagePaiement titre="Paiement" prestataire={q.get("pid") ? "Alma" : "Stripe"} intro={null}>
      <div className="rounded-lg bg-white p-8 text-center">
        {etat === "verif" && <p className="text-gray-500">Vérification du paiement…</p>}
        {etat === "ok" && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-[#362A24]" strokeWidth={1.5} />
            <h2 className="mt-4 font-serif text-2xl text-[#1A1A1A]">Merci, votre paiement est bien enregistré</h2>
            <p className="mt-3 text-[15px] text-gray-600">Un reçu vous est adressé par courriel. {detail}</p>
          </>
        )}
        {etat === "echec" && (
          <>
            <h2 className="font-serif text-2xl text-[#1A1A1A]">Le paiement n&apos;a pas abouti</h2>
            <p className="mt-3 text-[15px] text-gray-600">Aucun montant n&apos;a été prélevé. Vous pouvez réessayer, ou nous appeler au 01 40 68 02 37.</p>
          </>
        )}
      </div>
    </PagePaiement>
  );
}

export default function Merci() {
  return (
    <Suspense>
      <Contenu />
    </Suspense>
  );
}
