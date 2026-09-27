"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { PagePaiement, boutonCls, champCls, euros, lireMontant } from "@/components/paiement/PagePaiement";

/* Page du cabinet : crée le lien de règlement en mensualités d'un client
   (divorce contentieux, par exemple). Protégée par le code d'accès
   PAIEMENT_ADMIN_CODE, mémorisé dans ce navigateur. */

const CLE = "fain-code-paiement";

export default function CreerMensualites() {
  const [code, setCode] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [total, setTotal] = useState("");
  const [echeances, setEcheances] = useState("10");
  const [objet, setObjet] = useState("Honoraires de divorce");
  const [lien, setLien] = useState("");
  const [erreur, setErreur] = useState("");
  const [attente, setAttente] = useState(false);
  const [copie, setCopie] = useState(false);

  useEffect(() => {
    try {
      setCode(localStorage.getItem(CLE) || "");
    } catch {
      /* stockage indisponible */
    }
  }, []);

  const t = lireMontant(total);
  const n = Math.round(Number(echeances));
  const mensualite = t && n >= 2 ? Math.round((t / n) * 100) / 100 : null;

  async function creer(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setLien("");
    if (!mensualite) return setErreur("Indiquez le total et un nombre d'échéances d'au moins 2.");
    setAttente(true);
    try {
      const r = await fetch("/api/mensualites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "lien", code, nom, email, mensualite, echeances: n, objet }),
      });
      const j = await r.json();
      if (!r.ok || !j.url) throw new Error(j.message || "Création impossible.");
      try {
        localStorage.setItem(CLE, code);
      } catch {
        /* stockage indisponible */
      }
      setLien(j.url);
    } catch (x) {
      setErreur(x instanceof Error ? x.message : "Création impossible.");
    } finally {
      setAttente(false);
    }
  }

  const corps = lien
    ? `Bonjour,\r\n\r\nComme convenu, voici le lien pour régler vos honoraires en ${n} mensualités de ${mensualite ? euros(mensualite) : ""} :\r\n${lien}\r\n\r\nLe prélèvement s'arrête automatiquement après la dernière échéance.\r\n\r\nVotre bien dévoué,\r\n\r\nJoackim FAIN\r\nAvocat au Barreau de Paris`
    : "";
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent("Règlement de vos honoraires en mensualités")}&body=${encodeURIComponent(corps)}`;

  return (
    <PagePaiement
      titre="Créer des mensualités"
      prestataire="Stripe"
      intro={<p>Page réservée au cabinet. Le lien créé est à adresser au client ; les conditions y sont signées et ne peuvent pas être modifiées.</p>}
    >
      <form onSubmit={creer} className="space-y-5 rounded-lg bg-white p-8">
        <label className="block">
          <span className="mb-2 block text-[15px] text-[#1A1A1A]">Code d&apos;accès du cabinet</span>
          <input type="password" className={champCls} value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-[15px] text-[#1A1A1A]">Client (prénom et NOM)</span>
            <input className={champCls} value={nom} onChange={(e) => setNom(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-2 block text-[15px] text-[#1A1A1A]">Courriel du client</span>
            <input type="email" className={champCls} value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-2 block text-[15px] text-[#1A1A1A]">Total des honoraires (€ TTC)</span>
            <input className={champCls} value={total} onChange={(e) => setTotal(e.target.value)} inputMode="decimal" placeholder="Ex. : 3 000" />
          </label>
          <label className="block">
            <span className="mb-2 block text-[15px] text-[#1A1A1A]">Nombre de mensualités</span>
            <input className={champCls} value={echeances} onChange={(e) => setEcheances(e.target.value)} inputMode="numeric" />
          </label>
        </div>
        <label className="block">
          <span className="mb-2 block text-[15px] text-[#1A1A1A]">Objet</span>
          <input className={champCls} value={objet} onChange={(e) => setObjet(e.target.value)} />
        </label>
        {mensualite && (
          <p className="text-[15px] text-gray-700">
            {n} mensualités de <strong>{euros(mensualite)}</strong>, soit {euros(mensualite * n)} au total
            {Math.abs(mensualite * n - (t || 0)) >= 0.01 ? " (arrondi au centime)" : ""}.
          </p>
        )}
        {erreur && <p className="text-sm text-[#B42318]">{erreur}</p>}
        <button type="submit" disabled={attente} className={boutonCls}>
          {attente ? "Création…" : "Créer le lien"}
        </button>
      </form>
      {lien && (
        <div className="mt-6 space-y-4 rounded-lg bg-white p-8">
          <p className="break-all rounded-lg bg-[#F4F2EC] px-4 py-3 text-sm text-[#362A24]">{lien}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(lien).then(() => setCopie(true)).catch(() => {})}
              className="inline-flex items-center gap-2 rounded-full border border-[#D6D3CB] px-5 py-2.5 text-sm"
            >
              {copie ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copie ? "Lien copié" : "Copier le lien"}
            </button>
            <a href={gmail} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full border border-[#D6D3CB] px-5 py-2.5 text-sm">
              Préparer le courriel dans Gmail
            </a>
          </div>
        </div>
      )}
    </PagePaiement>
  );
}
