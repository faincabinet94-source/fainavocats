"use client";

import { useState } from "react";
import { Phone, Send, CheckCircle2, AlertTriangle, CalendarDays } from "lucide-react";
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
  id,
  label,
  aide,
  manque,
  children,
}: {
  id?: string;
  label: string;
  aide?: string;
  manque?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div id={id}>
      <div className={cn("text-[17px]", manque ? "text-[#B42318]" : "text-[#1A1A1A]")}>
        {label}
        {manque && <span className="ml-2 text-sm">(à renseigner)</span>}
      </div>
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
const inputManqueCls = "border-[#B42318]";

/* Réservation de l'entretien téléphonique gratuit, proposée juste après l'envoi.
   AGENDA_INTEGRE : l'adresse d'intégration de l'agenda de réservation Google
   (Agenda > page de réservation > Partager > Site Web, attribut src de l'iframe,
   qui se termine par « ?gv=true »). Vide : seul le bouton vers RDV_URL s'affiche. */
const RDV_URL = "https://rdv.fain-avocats.fr/call";
const AGENDA_INTEGRE = "";

const COURRIEL_VALIDE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function DevisDivorceForm() {
  const [civilite, setCivilite] = useState<"Monsieur" | "Madame" | null>(null);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [entretien, setEntretien] = useState<"Oui" | "Non">("Oui");
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

  const [tentative, setTentative] = useState(false);
  const [envoi, setEnvoi] = useState<"idle" | "envoi" | "ok" | "erreur">("idle");
  const [erreur, setErreur] = useState("");

  /* Le téléphone n'est exigé que si le prospect demande l'entretien téléphonique :
     sans entretien, le devis part quand même par courriel. */
  const manquants: { id: string; label: string }[] = [];
  if (!civilite) manquants.push({ id: "devis-civilite", label: "votre civilité" });
  if (!prenom.trim()) manquants.push({ id: "prenom", label: "votre prénom" });
  if (!nom.trim()) manquants.push({ id: "nom", label: "votre nom" });
  if (!email.trim()) manquants.push({ id: "email", label: "votre courriel" });
  else if (!COURRIEL_VALIDE.test(email.trim()))
    manquants.push({ id: "email", label: "un courriel valide" });
  if (entretien === "Oui" && !telephone.trim())
    manquants.push({ id: "tel", label: "votre téléphone (pour l'entretien)" });
  if (!amiable) manquants.push({ id: "devis-amiable", label: "la réponse sur la procédure amiable" });
  if (!consent) manquants.push({ id: "devis-consent", label: "votre accord en bas du formulaire" });
  const manque = (id: string) => tentative && manquants.some((m) => m.id === id);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    if (envoi === "envoi") return;
    setTentative(true);
    if (manquants.length) {
      document.getElementById(manquants[0].id)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
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
          entretien,
          telephone: entretien === "Oui" ? telephone.trim() : "",
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
          Votre devis vous est envoyé par courriel dans quelques instants. Si rien n&apos;arrive,
          pensez à regarder dans vos indésirables.
        </p>
        {entretien === "Oui" ? (
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="mb-3 font-serif text-2xl text-[#1A1A1A]">
              Choisissez dès maintenant votre entretien téléphonique
            </h3>
            <p className="mb-6 text-left text-[15px] text-gray-600">
              L&apos;entretien est gratuit et sans engagement. Réservez le créneau qui vous
              convient : nous vous appelons au numéro indiqué.
            </p>
            {AGENDA_INTEGRE ? (
              <iframe
                src={AGENDA_INTEGRE}
                title="Réserver un entretien téléphonique"
                className="h-[700px] w-full rounded-lg border border-gray-200"
              />
            ) : (
              <a
                href={RDV_URL}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#362A24] px-8 py-4 text-sm text-white transition-colors hover:bg-[#2C221D]"
              >
                <CalendarDays className="h-4 w-4" strokeWidth={1.8} />
                Choisir mon créneau
              </a>
            )}
          </div>
        ) : (
          <p className="text-left text-[15px] text-gray-600">
            Pour en parler de vive voix, appelez-nous au{" "}
            <a href="tel:+33140680237" className="text-[#362A24] underline">
              +33 1 40 68 02 37
            </a>
            .
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={soumettre} noValidate className="rounded-lg border border-gray-200 bg-white p-7 md:p-10">
      <div className="flex flex-col gap-7">
        <Champ id="devis-civilite" label="Vous êtes" manque={manque("devis-civilite")}>
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
            <label htmlFor="prenom" className={cn("text-[17px]", manque("prenom") ? "text-[#B42318]" : "text-[#1A1A1A]")}>
              Prénom
            </label>
            <input
              id="prenom"
              className={cn(inputCls, "mt-3", manque("prenom") && inputManqueCls)}
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              autoComplete="given-name"
            />
          </div>
          <div>
            <label htmlFor="nom" className={cn("text-[17px]", manque("nom") ? "text-[#B42318]" : "text-[#1A1A1A]")}>
              Nom
            </label>
            <input
              id="nom"
              className={cn(inputCls, "mt-3", manque("nom") && inputManqueCls)}
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              autoComplete="family-name"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="email" className={cn("text-[17px]", manque("email") ? "text-[#B42318]" : "text-[#1A1A1A]")}>
              Courriel
            </label>
            <p className="mt-1 text-sm text-gray-500">Votre devis vous est envoyé à cette adresse.</p>
            <input
              id="email"
              type="email"
              className={cn(inputCls, "mt-3", manque("email") && inputManqueCls)}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
        </div>

        <Champ
          label="Je souhaite bénéficier d'un entretien téléphonique gratuit"
          aide="Vous choisissez votre créneau juste après l'envoi du formulaire."
        >
          <Choix
            value={entretien}
            onChange={setEntretien}
            options={[
              { label: "Oui", value: "Oui" as const },
              { label: "Non", value: "Non" as const },
            ]}
          />
        </Champ>

        {entretien === "Oui" && (
          <div>
            <label htmlFor="tel" className={cn("text-[17px]", manque("tel") ? "text-[#B42318]" : "text-[#1A1A1A]")}>
              Téléphone
            </label>
            <input
              id="tel"
              type="tel"
              className={cn(inputCls, "mt-3", manque("tel") && inputManqueCls)}
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              autoComplete="tel"
            />
          </div>
        )}

        <hr className="border-gray-200" />

        <Champ
          id="devis-amiable"
          label="Votre conjoint accepte-t-il une procédure amiable ?"
          aide="Le divorce sans juge suppose son accord sur le principe de la rupture."
          manque={manque("devis-amiable")}
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

        <label
          id="devis-consent"
          className={cn(
            "flex cursor-pointer items-start gap-3 text-[15px] leading-relaxed",
            manque("devis-consent") ? "text-[#B42318]" : "text-gray-600"
          )}
        >
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-[#362A24]"
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

        {tentative && manquants.length > 0 && (
          <div className="flex items-start gap-3 rounded-lg border border-[#F3C7C7] bg-[#FDF2F2] p-5 text-[#7A1C12]">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.7} />
            <div className="text-sm leading-relaxed">
              <div className="mb-1 font-bold">Il manque encore :</div>
              {manquants.map((m) => m.label).join(", ")}.
            </div>
          </div>
        )}

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
            disabled={envoi === "envoi"}
            className={cn(
              "inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm text-white transition-colors",
              envoi !== "envoi" ? "bg-[#362A24] hover:bg-[#2C221D]" : "cursor-not-allowed bg-gray-300"
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
