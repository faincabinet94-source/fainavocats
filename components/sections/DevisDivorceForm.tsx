"use client";

import { useState } from "react";
import { Phone, Send, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

/* Formulaire de devis — remplace l'iframe Cognito.
   Les valeurs des listes correspondent exactement aux choix de la table
   Contacts (base Prospects). Ne pas les reformuler : Airtable les refuserait. */

type Tri = "Oui" | "Non" | "Ne sait pas";

const OUI_NON_SAIS: { label: string; value: Tri }[] = [
  { label: "Oui", value: "Oui" },
  { label: "Non", value: "Non" },
  { label: "Je ne sais pas", value: "Ne sait pas" },
];
const OUI_NON: { label: string; value: Tri }[] = [
  { label: "Oui", value: "Oui" },
  { label: "Non", value: "Non" },
];

function Champ({
  label,
  aide,
  children,
}: {
  label: string;
  aide?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[17px] text-[#1A1A1A]">{label}</div>
      {aide && <p className="mb-3 mt-1 text-sm text-gray-500">{aide}</p>}
      <div className={aide ? "" : "mt-3"}>{children}</div>
    </div>
  );
}

function Choix<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-full border px-6 py-3 text-sm transition-colors",
            value === o.value
              ? "border-[#362A24] bg-[#362A24] text-white"
              : "border-[#D6D3CB] bg-white text-gray-600 hover:border-gray-400"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-[#D6D3CB] bg-white px-4 py-3 text-[15px] text-[#1A1A1A] outline-none transition-colors placeholder:text-gray-400 focus:border-[#362A24]";

export function DevisDivorceForm() {
  const [civilite, setCivilite] = useState<"Monsieur" | "Madame" | null>(null);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [amiable, setAmiable] = useState<Tri | null>(null);
  const [conjointAvocat, setConjointAvocat] = useState<Tri | null>(null);
  const [enfants, setEnfants] = useState<Tri | null>(null);
  const [immo, setImmo] = useState<Tri | null>(null);
  const [presta, setPresta] = useState<Tri | null>(null);
  const [mode, setMode] = useState<"En ligne" | "Au cabinet" | null>(null);
  const [commentaires, setCommentaires] = useState("");
  const [consent, setConsent] = useState(false);
  const [piege, setPiege] = useState(""); // honeypot anti-robots

  const [envoi, setEnvoi] = useState<"idle" | "envoi" | "ok" | "erreur">("idle");
  const [erreur, setErreur] = useState("");

  const complet =
    civilite && prenom.trim() && nom.trim() && email.trim() && telephone.trim() && amiable && consent;

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    if (!complet || envoi === "envoi") return;
    setEnvoi("envoi");
    setErreur("");
    try {
      const r = await fetch("/api/devis-divorce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          civilite,
          prenom: prenom.trim(),
          nom: nom.trim(),
          email: email.trim(),
          telephone: telephone.trim(),
          amiable,
          conjointAvocat,
          enfants,
          immo,
          presta,
          mode,
          commentaires: commentaires.trim(),
          piege,
        }),
      });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).message || "Envoi impossible");
      setEnvoi("ok");
    } catch (err) {
      setEnvoi("erreur");
      setErreur(err instanceof Error ? err.message : "Envoi impossible");
    }
  }

  if (envoi === "ok") {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-10 md:p-12">
        <CheckCircle2 className="mb-5 h-9 w-9 text-[#362A24]" strokeWidth={1.5} />
        <h2 className="mb-4 font-serif text-3xl text-[#1A1A1A]">Votre demande est bien arrivée</h2>
        <p className="mb-6 text-left text-[17px] text-gray-600">
          Vous recevez un accusé de réception par courriel à l&apos;instant. Nous revenons vers
          vous sous 24 à 48 heures ouvrées avec un devis correspondant à votre situation.
        </p>
        <p className="text-left text-[15px] text-gray-600">
          Si votre situation est urgente, appelez-nous directement au{" "}
          <a href="tel:+33140680237" className="text-[#362A24] underline">
            +33 1 40 68 02 37
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={soumettre} className="rounded-lg border border-gray-200 bg-white p-7 md:p-10">
      <div className="flex flex-col gap-7">
        <Champ label="Vous êtes">
          <Choix
            value={civilite}
            onChange={setCivilite}
            options={[
              { label: "Madame", value: "Madame" as const },
              { label: "Monsieur", value: "Monsieur" as const },
            ]}
          />
        </Champ>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="prenom" className="text-[17px] text-[#1A1A1A]">
              Prénom
            </label>
            <input
              id="prenom"
              className={cn(inputCls, "mt-3")}
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              autoComplete="given-name"
              required
            />
          </div>
          <div>
            <label htmlFor="nom" className="text-[17px] text-[#1A1A1A]">
              Nom
            </label>
            <input
              id="nom"
              className={cn(inputCls, "mt-3")}
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              autoComplete="family-name"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="text-[17px] text-[#1A1A1A]">
              Courriel
            </label>
            <input
              id="email"
              type="email"
              className={cn(inputCls, "mt-3")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label htmlFor="tel" className="text-[17px] text-[#1A1A1A]">
              Téléphone
            </label>
            <input
              id="tel"
              type="tel"
              className={cn(inputCls, "mt-3")}
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              autoComplete="tel"
              required
            />
          </div>
        </div>

        <hr className="border-gray-200" />

        <Champ
          label="Votre conjoint accepte-t-il une procédure amiable ?"
          aide="Le divorce sans juge suppose son accord sur le principe de la rupture."
        >
          <Choix value={amiable} onChange={setAmiable} options={OUI_NON_SAIS} />
        </Champ>

        {amiable === "Oui" && (
          <Champ
            label="Votre conjoint a-t-il déjà son propre avocat ?"
            aide="Chacun des époux doit obligatoirement avoir le sien : l'avocat commun n'est plus possible."
          >
            <Choix value={conjointAvocat} onChange={setConjointAvocat} options={OUI_NON_SAIS} />
          </Champ>
        )}

        <Champ label="Avez-vous des enfants à charge ?" aide="Enfants communs, mineurs ou encore à votre charge.">
          <Choix value={enfants} onChange={setEnfants} options={OUI_NON} />
        </Champ>

        <Champ label="Un bien immobilier en commun ?" aide="Détenu en indivision ou en communauté, et à partager.">
          <Choix value={immo} onChange={setImmo} options={OUI_NON} />
        </Champ>

        <Champ
          label="Une prestation compensatoire est-elle envisagée ?"
          aide="Une somme versée par l'un des époux à l'autre pour compenser l'écart de niveau de vie que crée le divorce."
        >
          <Choix value={presta} onChange={setPresta} options={OUI_NON_SAIS} />
        </Champ>

        <Champ
          label="Comment préférez-vous procéder ?"
          aide="La procédure se mène entièrement à distance si vous le souhaitez."
        >
          <Choix
            value={mode}
            onChange={setMode}
            options={[
              { label: "En ligne", value: "En ligne" as const },
              { label: "Rendez-vous au cabinet", value: "Au cabinet" as const },
            ]}
          />
        </Champ>

        <div>
          <label htmlFor="comm" className="text-[17px] text-[#1A1A1A]">
            Souhaitez-vous préciser quelque chose ?
          </label>
          <p className="mb-3 mt-1 text-sm text-gray-500">Facultatif.</p>
          <textarea
            id="comm"
            rows={4}
            className={cn(inputCls, "resize-y")}
            value={commentaires}
            onChange={(e) => setCommentaires(e.target.value)}
          />
        </div>

        {/* piège à robots — invisible, jamais rempli par un humain */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="societe">Société</label>
          <input
            id="societe"
            tabIndex={-1}
            autoComplete="off"
            value={piege}
            onChange={(e) => setPiege(e.target.value)}
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-[15px] leading-relaxed text-gray-600">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-[#362A24]"
            required
          />
          <span>
            J&apos;accepte que ces informations soient utilisées pour établir mon devis et me
            recontacter. Elles ne servent à rien d&apos;autre et ne sont transmises à personne.
            Vous pouvez demander leur suppression à tout moment à{" "}
            <a href="mailto:contact@fain-avocats.fr" className="text-[#362A24] underline">
              contact@fain-avocats.fr
            </a>
            . Voir notre{" "}
            <a href="/confidentialite" className="text-[#362A24] underline">
              politique de confidentialité
            </a>
            .
          </span>
        </label>

        {envoi === "erreur" && (
          <div className="flex items-start gap-3 rounded-lg bg-[#131B16] p-5 text-[#C2A679]">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.7} />
            <div className="text-sm leading-relaxed">
              <div className="mb-1 font-bold">Votre demande n&apos;est pas partie</div>
              {erreur}. Appelez-nous au{" "}
              <a href="tel:+33140680237" className="underline">
                +33 1 40 68 02 37
              </a>
              .
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={!complet || envoi === "envoi"}
            className={cn(
              "inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm text-white transition-colors",
              complet && envoi !== "envoi"
                ? "bg-[#362A24] hover:bg-[#2C221D]"
                : "cursor-not-allowed bg-gray-300"
            )}
          >
            <Send className="h-4 w-4" strokeWidth={1.8} />
            {envoi === "envoi" ? "Envoi en cours…" : "Demander mon devis"}
          </button>
          <a
            href="tel:+33140680237"
            className="inline-flex items-center gap-2.5 rounded-full border border-[#D6D3CB] px-6 py-3.5 text-sm text-[#1A1A1A] transition-colors hover:border-gray-400"
          >
            <Phone className="h-4 w-4" />
            En parler au téléphone
          </a>
        </div>

        <p className="text-left text-[13px] text-gray-500">
          Le devis est gratuit et sans engagement.
        </p>
      </div>
    </form>
  );
}
