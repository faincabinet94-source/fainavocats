"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { PagePaiement, boutonCls, champCls } from "@/components/paiement/PagePaiement";

/* Page du cabinet, à utiliser une seule fois : déclare chez Stancer l'adresse
   de notification du site (/api/stancer/notification) et affiche le secret de
   signature, à enregistrer dans Netlify (STANCER_WEBHOOK_SECRET). Protégée par
   le code d'accès PAIEMENT_ADMIN_CODE, comme la création des mensualités. */

const CLE = "fain-code-paiement";

export default function NotificationsStancer() {
  const [code, setCode] = useState("");
  const [secret, setSecret] = useState("");
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

  async function activer(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setAttente(true);
    try {
      const r = await fetch("/api/stancer/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const j = await r.json();
      if (!r.ok || !j.secret) throw new Error(j.message || "Activation impossible.");
      setSecret(j.secret);
    } catch (x) {
      setErreur(x instanceof Error ? x.message : "Activation impossible.");
    } finally {
      setAttente(false);
    }
  }

  return (
    <PagePaiement
      titre="Notifications Stancer"
      prestataire="Stancer"
      intro={
        <p>
          Page réservée au cabinet, à utiliser une seule fois. Stancer préviendra ensuite le site de chaque paiement, même si
          le client ferme la page avant d&apos;y revenir.
        </p>
      }
    >
      <form onSubmit={activer} className="space-y-5 rounded-lg bg-white p-8">
        <label className="block">
          <span className="mb-2 block text-[15px] text-[#1A1A1A]">Code d&apos;accès du cabinet</span>
          <input type="password" className={champCls} value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" />
        </label>
        {erreur && <p className="text-sm text-[#B42318]">{erreur}</p>}
        <button type="submit" disabled={attente || !!secret} className={boutonCls}>
          {attente ? "Activation…" : "Activer les notifications"}
        </button>
      </form>
      {secret && (
        <div className="mt-6 space-y-4 rounded-lg bg-white p-8 text-left">
          <p className="text-[15px] text-gray-700">
            Secret de signature, affiché une seule fois. Enregistrez-le dans Netlify, variable{" "}
            <strong>STANCER_WEBHOOK_SECRET</strong> (secret, production), puis redéployez le site.
          </p>
          <p className="break-all rounded-lg bg-[#F4F2EC] px-4 py-3 font-mono text-sm text-[#362A24]">{secret}</p>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(secret).then(() => setCopie(true)).catch(() => {})}
            className="inline-flex items-center gap-2 rounded-full border border-[#D6D3CB] px-5 py-2.5 text-sm"
          >
            {copie ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copie ? "Secret copié" : "Copier le secret"}
          </button>
        </div>
      )}
    </PagePaiement>
  );
}
