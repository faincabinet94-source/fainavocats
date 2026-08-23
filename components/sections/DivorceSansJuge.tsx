"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  ArrowRight,
  Plus,
  Minus,
  FileText,
  Users,
  Stamp,
  Info,
  AlertTriangle,
  CheckCircle2,
  Star,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { FAQ_ITEMS } from "@/lib/divorce-sans-juge";
import { useTranslation } from "@/hooks/useTranslation";

/* ------------------------------------------------------------------ *
 * Grille tarifaire — base Prospects, table « Produits ».
 * DCM 1A : le conjoint passe par le confrère partenaire, le prix couvre
 *          LES DEUX avocats (champ Avocats = 2) → divisé par deux par époux.
 * DCM 2A : le conjoint a son propre avocat, le prix ne couvre que notre client.
 * DC     : divorce contentieux, toujours deux avocats distincts.
 * RC     : requête conjointe, lue comme les 1A.
 * Airtable fait foi : toute évolution se répercute ici.
 * ------------------------------------------------------------------ */
/* DCM 1A — le conjoint passe par le confrère partenaire : tarif additif, le socle
   couvre déjà LES DEUX avocats. Honoraires en cours de révision (2026-08-23). */
const DCM1A_SOCLE = 650;
const SUP_CABINET = 120; // premier rendez-vous au cabinet plutôt qu'en ligne
const SUP_ENFANTS = 250;
const SUP_IMMO = 250;
const SUP_PRESTA = 250;

/* DCM 2A — le conjoint a son propre avocat : le prix ne couvre que notre client.
   Grille inchangée pour l'instant. */
const GRID_DCM2A: Record<string, number> = { "": 1200, E: 1500, B: 1800, EB: 2000 };

const GRID_DC: Record<string, number> = { "": 2000, E: 3000, B: 3000, EB: 4000 };
const GRID_RC: Record<string, number> = { "": 1800, E: 2000, B: 2200, EB: 2400 };
const DEPOT = 49.44;   // 41,20 € HT, tarif réglementé du notaire
const CERTIF_66 = 300; // certificat européen, TTC, hors forfait

const eur = (n: number) => n.toLocaleString("fr-FR") + " €";
const eur2 = (n: number) =>
  n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

type NatKey = "FR" | "UE" | "MA" | "DZ" | "TN" | "XX";

const HERO_FACTS = [
  { value: "2", label: "avocats obligatoires, un par époux" },
  { value: "15 j", label: "de réflexion avant signature" },
  { value: "49,44 €", label: "de dépôt chez le notaire, TTC" },
  { value: "4–6 sem.", label: "pour un dossier simple" },
];

const CHANGES = [
  {
    Icon: FileText,
    title: "Une convention, pas un jugement",
    text: "L'accord des époux est rédigé et contresigné par les avocats. Il n'y a ni audience, ni homologation judiciaire.",
  },
  {
    Icon: Users,
    title: "Un avocat par époux",
    text: "L'avocat commun n'est plus possible : chacun des époux doit obligatoirement avoir son propre avocat.",
  },
  {
    Icon: Stamp,
    title: "Le dépôt fait le divorce",
    text: "C'est le dépôt au rang des minutes du notaire qui donne date certaine et force exécutoire, et qui dissout le mariage.",
  },
];

const STEPS = [
  {
    num: "01",
    short: "Rédaction de la convention",
    title: "Les avocats négocient et rédigent la convention",
    body: "La convention règle l'ensemble des conséquences du divorce : résidence des enfants, droit de visite et d'hébergement, contribution à l'entretien et à l'éducation des enfants, prestation compensatoire éventuelle, sort du logement et liquidation du régime matrimonial. En présence d'un bien immobilier, l'état liquidatif établi par un notaire doit être annexé avant la signature.",
    delay: "Variable",
    ref: "Article 229-1 du Code civil",
  },
  {
    num: "02",
    short: "Délai de réflexion",
    title: "Quinze jours de réflexion, incompressibles",
    body: "Le projet de convention est adressé à chaque époux par lettre recommandée avec demande d'avis de réception. Un délai de réflexion de quinze jours court à compter de la réception. La convention ne peut pas être signée avant l'expiration de ce délai, à peine de nullité.",
    delay: "15 jours",
    ref: "Article 229-4 du Code civil",
  },
  {
    num: "03",
    short: "Dépôt chez le notaire",
    title: "La convention est déposée au rang des minutes",
    body: "Après signature, l'avocat transmet la convention au notaire, qui dispose de quinze jours pour procéder au dépôt. Ce dépôt donne à l'acte date certaine et force exécutoire : c'est lui qui dissout le mariage.",
    delay: "15 jours",
    ref: "Article 229-1 du Code civil",
  },
  {
    num: "04",
    short: "Mention à l'état civil",
    title: "La mention est portée en marge des actes",
    body: "Après le dépôt, la mention du divorce est portée en marge de l'acte de mariage et des actes de naissance des époux. Cette formalité conditionne l'opposabilité du divorce aux tiers.",
    delay: "Quelques semaines",
    ref: "Formalité d'état civil, postérieure au dépôt",
  },
];

const EXCEPTIONS = [
  {
    num: "01",
    title: "L'enfant mineur demande à être entendu",
    text: "Les parents doivent informer l'enfant de son droit à être entendu par le juge, et un formulaire signé est annexé à la convention. S'il demande son audition, la voie extrajudiciaire se ferme et la convention doit être homologuée par le juge aux affaires familiales.",
  },
  {
    num: "02",
    title: "Un époux fait l'objet d'une mesure de protection",
    text: "Tutelle, curatelle, sauvegarde de justice avec mandat spécial, habilitation familiale : le divorce par consentement mutuel extrajudiciaire est fermé à l'époux protégé.",
  },
];

const LINKS = [
  {
    kind: "Article",
    href: "/actualites/divorce-sans-juge-le-nouveau-divorce-par-consentement-mutuel",
    title: "Divorce sans juge : comment ça marche, neuf ans après",
    desc: "Le détail de la procédure, des délais et des deux cas où le juge reste compétent.",
  },
  {
    kind: "Fiche pratique",
    href: "/fiches/cout-procedure-divorce",
    title: "Le coût d'une procédure de divorce",
    desc: "Chaque poste de dépense, honoraires, émoluments et droits, poste par poste.",
  },
  {
    kind: "Domaine",
    href: "/liquidation-regime-matrimonial",
    title: "La liquidation du régime matrimonial",
    desc: "Ce qu'il faut avoir réglé avant de signer, surtout en présence d'un bien immobilier.",
  },
];

/* ------------------------------------------------------------------ */

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string | boolean }[];
  value: string | boolean;
  onChange: (v: never) => void;
}) {
  return (
    <div className="flex gap-2.5">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          onClick={() => onChange(o.value as never)}
          className={cn(
            "flex-1 rounded-lg border px-4 py-3.5 text-sm leading-snug transition-colors",
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

export function DivorceSansJuge() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [conjointOk, setConjointOk] = useState(true);
  const [accord, setAccord] = useState(true);
  const [avocatChoisi, setAvocatChoisi] = useState<"1A" | "2A">("1A");
  const [mode, setMode] = useState<"ligne" | "cabinet">("ligne");
  const [nats, setNats] = useState<Record<NatKey, boolean>>({
    FR: true,
    UE: false,
    MA: false,
    DZ: false,
    TN: false,
    XX: false,
  });
  const [transcrit, setTranscrit] = useState(false);
  const [enfants, setEnfants] = useState(false);
  const [immo, setImmo] = useState(false);
  const [presta, setPresta] = useState(false);

  const foreign = (["UE", "MA", "DZ", "TN", "XX"] as NatKey[]).filter((k) => nats[k]);
  const hasForeign = foreign.length > 0;
  const suffix = (enfants ? "E" : "") + (immo ? "B" : "");

  /* Des négociations à mener excluent le recours au confrère partenaire :
     le conjoint doit alors être conseillé par un avocat indépendant. */
  const avocat: "1A" | "2A" = accord ? avocatChoisi : "2A";
  const partenaire = conjointOk && accord && avocat === "1A";

  const lines: { label: string; note: string; amount: string }[] = [];
  let headline: string;
  let amount: string;
  let sub: string;
  let sideNote: string;

  if (!conjointOk) {
    const hono = GRID_DC[suffix];
    headline = "Pour vous, votre avocat seul";
    amount = eur(hono);
    sub = "hors honoraires de l'avocat de votre conjoint";
    lines.push({
      label: "Vos honoraires",
      note: "Divorce contentieux devant le juge aux affaires familiales",
      amount: eur(hono),
    });
    lines.push({
      label: "Frais de procédure",
      note: "Significations par commissaire de justice, selon le déroulé",
      amount: "en sus",
    });
    sideNote =
      "Ordre de grandeur. Un divorce contentieux se chiffre au cas par cas, selon les points en litige et la durée de la procédure — nous l'affinons avec vous lors du premier entretien.";
  } else if (partenaire) {
    let hono = DCM1A_SOCLE;
    lines.push({
      label: "Honoraires des deux avocats",
      note: "Le vôtre et celui de votre conjoint, procédure en ligne",
      amount: eur(DCM1A_SOCLE),
    });
    if (mode === "cabinet") {
      hono += SUP_CABINET;
      lines.push({
        label: "Premier rendez-vous au cabinet",
        note: "196 avenue Victor Hugo, Paris 16",
        amount: eur(SUP_CABINET),
      });
    }
    if (enfants) {
      hono += SUP_ENFANTS;
      lines.push({
        label: "Enfants à charge",
        note: "Résidence, droit de visite, contribution à l'entretien et à l'éducation",
        amount: eur(SUP_ENFANTS),
      });
    }
    if (immo) {
      hono += SUP_IMMO;
      lines.push({
        label: "Bien immobilier en commun",
        note: "Coordination de l'état liquidatif avec le notaire",
        amount: eur(SUP_IMMO),
      });
    }
    if (presta) {
      hono += SUP_PRESTA;
      lines.push({
        label: "Prestation compensatoire",
        note: "Évaluation et rédaction de la clause",
        amount: eur(SUP_PRESTA),
      });
    }
    lines.push({
      label: "Dépôt de la convention",
      note: "Tarif réglementé du notaire, 41,20 € HT — soit 24,72 € par époux",
      amount: "49,44 €",
    });
    const total = hono + DEPOT;
    headline = "Pour le couple, les deux avocats compris";
    amount = eur2(total);
    sub = `soit ${eur2(total / 2)} par époux${immo ? ", hors frais liés au bien" : ""}`;
    sideNote = accord
      ? "Vous êtes d'accord sur tout : la convention peut être rédigée sans phase de négociation, c'est le chemin le plus court."
      : "";
  } else {
    const hono = GRID_DCM2A[suffix];
    headline = "Pour vous, votre avocat seul";
    amount = eur2(hono + DEPOT / 2);
    sub = `hors honoraires de l'avocat de votre conjoint${immo ? " et frais liés au bien" : ""}`;
    lines.push({
      label: "Vos honoraires",
      note: "Votre conjoint règle séparément ceux de son propre avocat",
      amount: eur(hono),
    });
    lines.push({
      label: "Votre part du dépôt",
      note: "Moitié du tarif réglementé du notaire",
      amount: "24,72 €",
    });
    sideNote = accord
      ? "Votre conjoint ayant son propre avocat, chacun règle le sien."
      : "Des points restent à négocier : votre conjoint doit être conseillé par un avocat indépendant du nôtre. Le recours à notre confrère partenaire n'est ouvert que lorsque tout est déjà arrêté.";
  }

  if (conjointOk && nats.UE && transcrit) {
    lines.push({
      label: "Certificat européen, article 66",
      note: "Hors forfait — délivré par le président du tribunal judiciaire",
      amount: eur(CERTIF_66),
    });
  }

  if (conjointOk && !sideNote) {
    sideNote =
      "C'est la configuration la plus directe : la convention, les quinze jours de réflexion, puis le dépôt chez le notaire.";
  }

  /* Reconnaissance à l'étranger — l'orientation suit le régime le plus exigeant.
     Voir la note du coffre « reconnaissance-dcm-a-l-etranger ». */
  let advice: { warn: boolean; title: string; text: string; alt?: string } | null = null;
  if (conjointOk && hasForeign) {
    const multi =
      foreign.length > 1
        ? " Plusieurs pays sont en présence : l'orientation ci-dessus suit le plus exigeant."
        : "";
    if (!transcrit) {
      advice = {
        warn: false,
        title: "Pas de difficulté de reconnaissance",
        text: "Vous n'avez pas d'état civil à mettre à jour hors de France : la question de la reconnaissance du divorce à l'étranger ne se pose pas. La voie sans juge vous reste ouverte.",
      };
    } else if (nats.TN) {
      advice = {
        warn: true,
        title: "Tunisie : la requête conjointe est la voie sûre",
        text:
          "Aucun texte tunisien n'organise la reconnaissance des actes étrangers non judiciaires, et la pratique des tribunaux reste incertaine. Nous ne promettons pas une issue que nous ne maîtrisons pas : tant que la convention n'est pas déposée, le divorce sur requête conjointe lève la difficulté." +
          multi,
      };
    } else if (nats.XX) {
      advice = {
        warn: true,
        title: "Un divorce sur requête conjointe serait plus sûr",
        text:
          "Hors Union européenne et hors pays ayant organisé la question, la reconnaissance d'un divorce sans juge n'est pas acquise. Le divorce sur requête conjointe, rendu par un juge aux affaires familiales, est reconnu sans cette incertitude." +
          multi,
      };
    } else if (nats.DZ) {
      advice = {
        warn: true,
        title: "Algérie : une procédure d'exequatur à prévoir",
        text:
          "La convention n'est pas reconnue de plein droit en Algérie : il faut la faire déclarer exécutoire par le tribunal du lieu. Le cabinet a obtenu cette décision pour un dossier ; comptez un ordre de grandeur de deux à trois mois, et les honoraires d'un confrère sur place. L'issue n'est jamais garantie — l'ordre public local reste un motif de refus. Si vous préférez l'éviter, la requête conjointe le permet." +
          multi,
      };
    } else if (nats.MA) {
      advice = {
        warn: false,
        title: "Maroc : transcription directe à l'état civil",
        text:
          "Des circulaires marocaines permettent de transcrire le divorce sans juge à l'état civil sans passer par une procédure d'exequatur, et le consulat du Royaume à Paris l'a confirmé par écrit au cabinet. Réserve à connaître : cette ouverture est administrative. Devant un juge marocain saisi d'une succession ou d'un remariage contesté, la question resterait ouverte." +
          multi,
      };
    } else {
      advice = {
        warn: false,
        title: "Union européenne : un certificat à obtenir",
        text:
          "Depuis le 1er août 2022, le divorce sans juge français circule dans l'Union européenne. Un certificat est obligatoire : sans lui, l'administration étrangère n'a rien à transcrire. Il se demande au président du tribunal judiciaire du lieu de dépôt, et suppose que les juridictions françaises étaient compétentes — un point à vérifier avant de signer, pas après. Le Danemark n'est pas concerné par ce régime." +
          multi,
      };
    }
    if (advice.warn) {
      advice.alt =
        partenaire
          ? `Requête conjointe : ${eur(GRID_RC[suffix])} pour le couple, soit ${eur(
              GRID_RC[suffix] / 2
            )} par époux.`
          : "Nous chiffrons la requête conjointe avec vous.";
    }
  }

  const active = STEPS[step];

  return (
    <div className="bg-[#F4F2EC]">
      {/* ---------------- HERO ---------------- */}
      <section className="pt-32 md:pt-40">
        <Container>
          <div className="flex items-baseline justify-between border-b border-[#DFDCD3] pb-10 md:pb-14">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">
              Fain Avocats — Paris 16
            </span>
            <span className="hidden text-xs font-bold uppercase tracking-[0.14em] text-gray-500 sm:block">
              Divorce par consentement mutuel
            </span>
          </div>
        </Container>

        <Container>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-[1180px] pb-12 pt-12 font-serif text-5xl font-normal leading-[0.98] tracking-tight text-[#1A1A1A] sm:text-6xl md:pb-14 md:pt-16 md:text-7xl lg:text-[7.4rem]"
          >
            Divorcer <span className="italic text-[#362A24]">sans juge,</span>
            <br />
            sans y perdre l&apos;essentiel.
          </motion.h1>
        </Container>

        <Container>
          <div className="flex flex-col items-start gap-8 pb-12 lg:flex-row lg:items-end lg:gap-16">
            <p className="max-w-xl flex-1 text-lg leading-relaxed text-gray-700 md:text-xl">
              Depuis 2017, la convention rédigée par vos avocats et déposée chez un notaire
              suffit à dissoudre le mariage. Ce qui n&apos;y figure pas ne se rattrape plus :
              tout se joue avant la signature.
            </p>
            <div className="flex shrink-0 flex-wrap gap-3">
              <a
                href="tel:+33140680237"
                className="inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-[#362A24] px-8 py-4 text-sm text-white transition-colors hover:bg-[#2C221D]"
              >
                <Phone className="h-4 w-4" />
                Consultation gratuite — +33 1 40 68 02 37
              </a>
              <a
                href="#honoraires"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#D6D3CB] px-7 py-4 text-sm text-[#1A1A1A] transition-colors hover:border-gray-400"
              >
                Estimer vos honoraires
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Container>

        <div className="border-y border-[#DFDCD3] bg-white/50">
          <Container>
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {HERO_FACTS.map((f, i) => (
                <div
                  key={f.label}
                  className={cn(
                    "px-0 py-7 md:py-8",
                    i > 0 && "lg:border-l lg:border-[#DFDCD3] lg:pl-8",
                    i % 2 === 1 && "border-l border-[#DFDCD3] pl-6 lg:pl-8"
                  )}
                >
                  <div className="font-serif text-3xl leading-none text-[#362A24] md:text-4xl">
                    {f.value}
                  </div>
                  <div className="mt-2 text-[13px] leading-snug text-gray-500">{f.label}</div>
                </div>
              ))}
            </div>
          </Container>
        </div>
      </section>

      {/* ---------------- EN BREF ---------------- */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-20">
            <div className="lg:w-72 lg:shrink-0">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                En bref
              </span>
            </div>
            <p className="max-w-3xl text-left text-xl leading-relaxed text-gray-700 md:text-[1.375rem]">
              Le divorce sans juge est un divorce amiable : le divorce par consentement mutuel
              réglé par acte d&apos;avocat. Chaque époux a son propre avocat. La convention est
              signée après un délai de réflexion de quinze jours, puis déposée au rang des
              minutes d&apos;un notaire — c&apos;est ce dépôt qui dissout le mariage, sans
              audience ni jugement.
            </p>
          </div>
        </Container>
      </section>

      {/* ---------------- CE QUE LA RÉFORME A CHANGÉ ---------------- */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-24">
            <div className="lg:w-80 lg:shrink-0">
              <h2 className="font-serif text-3xl leading-tight text-[#1A1A1A] md:text-4xl">
                Ce que la réforme
                <br />
                <span className="italic text-gray-500">a réellement changé</span>
              </h2>
            </div>
            <div className="flex-1">
              <p className="max-w-3xl text-lg text-gray-600">
                La loi du 18 novembre 2016 a retiré le juge de la procédure lorsque les époux
                s&apos;entendent. L&apos;article 229-1 du Code civil permet de divorcer par acte
                sous signature privée contresigné par avocats. Le contrôle judiciaire disparaît :
                tout le travail se déplace en amont, sur la rédaction de la convention.
              </p>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {CHANGES.map(({ Icon, title, text }) => (
                  <div
                    key={title}
                    className="rounded-lg border border-gray-200 bg-white p-7 transition-shadow hover:shadow-lg"
                  >
                    <Icon className="mb-4 h-6 w-6 text-[#362A24]" strokeWidth={1.6} />
                    <h3 className="mb-2.5 font-serif text-xl text-[#1A1A1A]">{title}</h3>
                    <p className="text-[15px] text-gray-600">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- ÉTAPES ---------------- */}
      <section className="border-y border-gray-200 bg-[#EFEDE6] py-16 md:py-20">
        <Container>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-serif text-3xl leading-tight text-[#1A1A1A] md:text-4xl">
              Le déroulé,
              <br />
              <span className="italic text-gray-500">étape par étape</span>
            </h2>
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
              4 à 6 semaines pour un dossier simple
            </span>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(i)}
                className={cn(
                  "rounded-lg border p-5 text-left transition-colors",
                  i === step
                    ? "border-[#362A24] bg-[#362A24] text-white"
                    : "border-gray-200 bg-white text-[#1A1A1A] hover:border-gray-400"
                )}
              >
                <div className="mb-2 text-[11px] font-bold tracking-[0.1em] opacity-60">
                  ÉTAPE {s.num}
                </div>
                <div className="font-serif text-lg leading-snug md:text-xl">{s.short}</div>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-10 rounded-lg border border-gray-200 bg-white p-8 md:p-11 lg:flex-row lg:gap-14">
            <div className="flex-1">
              <h3 className="mb-4 font-serif text-2xl text-[#1A1A1A] md:text-3xl">
                {active.title}
              </h3>
              <p className="max-w-2xl text-[17px] text-gray-600">{active.body}</p>
            </div>
            <div className="lg:w-64 lg:shrink-0 lg:border-l lg:border-gray-200 lg:pl-8">
              <div className="text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                Délai
              </div>
              <div className="mb-5 mt-2 font-serif text-3xl leading-none text-[#362A24]">
                {active.delay}
              </div>
              <div className="text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                Texte applicable
              </div>
              <div className="mt-2 text-sm leading-relaxed text-gray-600">{active.ref}</div>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- CALCULATEUR ---------------- */}
      <section id="honoraires" className="scroll-mt-24 py-16 md:py-20">
        <Container>
          <div className="mb-10 max-w-2xl">
            <h2 className="mb-4 font-serif text-3xl leading-tight text-[#1A1A1A] md:text-4xl">
              Estimer vos honoraires,
              <br />
              <span className="italic text-gray-500">en quelques questions</span>
            </h2>
            <p className="text-left text-[17px] text-gray-600">
              Les honoraires d&apos;un divorce par consentement mutuel tiennent à quelques
              éléments. Répondez, le montant s&apos;affiche.
            </p>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Questions */}
            <div className="flex flex-col gap-7 lg:w-[30rem] lg:shrink-0">
              <div>
                <div className="text-[17px] text-[#1A1A1A]">
                  Votre conjoint accepte-t-il une procédure amiable ?
                </div>
                <p className="mb-3.5 mt-1 text-sm text-gray-500">
                  Le divorce sans juge suppose son accord sur le principe de la rupture.
                </p>
                <Segmented
                  value={conjointOk}
                  onChange={(v) => setConjointOk(v)}
                  options={[
                    { label: "Oui", value: true },
                    { label: "Non", value: false },
                  ]}
                />
              </div>

              {conjointOk && (
                <>
                  <div>
                    <div className="text-[17px] text-[#1A1A1A]">
                      Êtes-vous d&apos;accord sur tous les termes ?
                    </div>
                    <p className="mb-3.5 mt-1 text-sm text-gray-500">
                      Résidence des enfants, pension, sort du logement, partage des biens :
                      tout est-il déjà arrêté entre vous, ou reste-t-il des points à négocier ?
                    </p>
                    <Segmented
                      value={accord}
                      onChange={(v) => setAccord(v)}
                      options={[
                        { label: "Oui, sur tout", value: true },
                        { label: "Des points à négocier", value: false },
                      ]}
                    />
                  </div>

                  {accord && (
                    <div>
                      <div className="text-[17px] text-[#1A1A1A]">
                        L&apos;avocat de votre conjoint
                      </div>
                      <p className="mb-3.5 mt-1 text-sm text-gray-500">
                        Chacun des époux doit obligatoirement avoir le sien : l&apos;avocat
                        commun n&apos;est plus possible. Tout étant arrêté entre vous, votre
                        conjoint peut être conseillé par notre confrère partenaire, d&apos;un
                        cabinet distinct.
                      </p>
                      <Segmented
                        value={avocatChoisi}
                        onChange={(v) => setAvocatChoisi(v)}
                        options={[
                          { label: "Notre confrère partenaire", value: "1A" },
                          { label: "Son propre avocat", value: "2A" },
                        ]}
                      />
                    </div>
                  )}

                  {partenaire && (
                    <div>
                      <div className="text-[17px] text-[#1A1A1A]">
                        En ligne, ou un premier rendez-vous au cabinet ?
                      </div>
                      <p className="mb-3.5 mt-1 text-sm text-gray-500">
                        La procédure se mène entièrement à distance si vous le souhaitez.
                      </p>
                      <Segmented
                        value={mode}
                        onChange={(v) => setMode(v)}
                        options={[
                          { label: "En ligne", value: "ligne" },
                          { label: "Rendez-vous au cabinet", value: "cabinet" },
                        ]}
                      />
                    </div>
                  )}

                  <div>
                    <div className="text-[17px] text-[#1A1A1A]">Les nationalités du couple</div>
                    <p className="mb-3.5 mt-1 text-sm text-gray-500">
                      Cochez toutes celles qui sont présentes, doubles nationalités comprises. La
                      reconnaissance du divorce sans juge n&apos;obéit pas aux mêmes règles selon
                      les pays.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          ["FR", "France"],
                          ["UE", "Autre pays de l'Union européenne"],
                          ["MA", "Maroc"],
                          ["DZ", "Algérie"],
                          ["TN", "Tunisie"],
                          ["XX", "Hors Union européenne"],
                        ] as [NatKey, string][]
                      ).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setNats((n) => ({ ...n, [key]: !n[key] }))}
                          className={cn(
                            "rounded-full border px-5 py-3 text-sm transition-colors",
                            nats[key]
                              ? "border-[#362A24] bg-[#362A24] text-white"
                              : "border-[#D6D3CB] bg-white text-gray-600 hover:border-gray-400"
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {hasForeign && (
                    <div>
                      <div className="text-[17px] text-[#1A1A1A]">
                        Un état civil à mettre à jour à l&apos;étranger ?
                      </div>
                      <p className="mb-3.5 mt-1 text-sm text-gray-500">
                        Mariage transcrit dans l&apos;un des pays cochés, ou divorce à y faire
                        enregistrer.
                      </p>
                      <Segmented
                        value={transcrit}
                        onChange={(v) => setTranscrit(v)}
                        options={[
                          { label: "Non", value: false },
                          { label: "Oui", value: true },
                        ]}
                      />
                    </div>
                  )}
                </>
              )}

              <div>
                <div className="text-[17px] text-[#1A1A1A]">Des enfants à charge</div>
                <p className="mb-3.5 mt-1 text-sm text-gray-500">
                  Enfants communs, mineurs ou encore à votre charge.
                </p>
                <Segmented
                  value={enfants}
                  onChange={(v) => setEnfants(v)}
                  options={[
                    { label: "Non", value: false },
                    { label: "Oui", value: true },
                  ]}
                />
              </div>

              <div>
                <div className="text-[17px] text-[#1A1A1A]">Un bien immobilier en commun</div>
                <p className="mb-3.5 mt-1 text-sm text-gray-500">
                  Détenu en indivision ou en communauté, et à partager.
                </p>
                <Segmented
                  value={immo}
                  onChange={(v) => setImmo(v)}
                  options={[
                    { label: "Non", value: false },
                    { label: "Oui", value: true },
                  ]}
                />
              </div>

              {partenaire && (
                <div>
                  <div className="text-[17px] text-[#1A1A1A]">Une prestation compensatoire</div>
                  <p className="mb-3.5 mt-1 text-sm text-gray-500">
                    Une somme versée par l&apos;un des époux à l&apos;autre pour compenser
                    l&apos;écart de niveau de vie que crée le divorce.
                  </p>
                  <Segmented
                    value={presta}
                    onChange={(v) => setPresta(v)}
                    options={[
                      { label: "Non", value: false },
                      { label: "Oui", value: true },
                    ]}
                  />
                </div>
              )}
            </div>

            {/* Résultat */}
            <div className="flex-1 rounded-lg border border-gray-200 bg-white p-8 md:p-10">
              <div className="text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                {headline}
              </div>
              <div className="mt-2.5 text-sm text-gray-500">À partir de</div>
              <div className="font-serif text-5xl leading-none text-[#362A24] md:text-6xl">
                {amount}
              </div>
              <div className="mb-6 mt-1.5 text-[15px] text-gray-500">{sub}</div>

              {advice && (
                <div
                  className={cn(
                    "mb-6 rounded-lg p-5",
                    advice.warn ? "bg-[#131B16] text-[#C2A679]" : "bg-[#362A24]/10 text-[#362A24]"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {advice.warn ? (
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.7} />
                    ) : (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.7} />
                    )}
                    <div>
                      <div className="mb-1.5 text-[15px] font-bold">{advice.title}</div>
                      <div className="text-sm leading-relaxed">{advice.text}</div>
                      {advice.alt && (
                        <div className="mt-3 text-sm font-bold">{advice.alt}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200">
                {lines.map((l) => (
                  <div
                    key={l.label}
                    className="flex items-baseline justify-between gap-6 border-b border-gray-200 py-3.5"
                  >
                    <div>
                      <div className="text-[15px] text-[#1A1A1A]">{l.label}</div>
                      <div className="mt-0.5 text-[13px] leading-snug text-gray-500">{l.note}</div>
                    </div>
                    <div className="whitespace-nowrap font-serif text-xl">{l.amount}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-3 pb-1 pt-5">
                <Info className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#362A24]" strokeWidth={1.6} />
                <p className="text-left text-sm leading-relaxed text-gray-600">{sideNote}</p>
              </div>

              <p className="mt-5 text-left text-[13px] text-gray-500">
                Un point de départ, pas un devis. Le montant définitif dépend de votre situation
                et fait l&apos;objet d&apos;une convention d&apos;honoraires écrite, signée avant
                toute intervention.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/devis/divorce"
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#362A24] px-7 py-3.5 text-sm text-white transition-colors hover:bg-[#2C221D]"
                >
                  <FileText className="h-4 w-4" strokeWidth={1.8} />
                  Demander un devis personnalisé
                </Link>
                <a
                  href="tel:+33140680237"
                  className="inline-flex items-center gap-2.5 rounded-full border border-[#D6D3CB] px-6 py-3.5 text-sm text-[#1A1A1A] transition-colors hover:border-gray-400"
                >
                  <Phone className="h-4 w-4" />
                  En parler au téléphone
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- LES DEUX EXCEPTIONS ---------------- */}
      <section className="bg-[#131B16] py-16 text-white md:py-20">
        <Container>
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-24">
            <div className="lg:w-[26rem] lg:shrink-0">
              <h2 className="mb-5 font-serif text-3xl leading-tight text-white md:text-4xl">
                Les deux cas où
                <br />
                <span className="italic text-[#C2A679]">le juge reste compétent</span>
              </h2>
              <p className="text-left text-white/70">
                La procédure sans juge n&apos;est pas ouverte dans toutes les situations. Deux
                exceptions la referment, et il vaut mieux les identifier avant d&apos;engager la
                rédaction.
              </p>
            </div>
            <div className="grid flex-1 gap-6 md:grid-cols-2">
              {EXCEPTIONS.map((ex) => (
                <div key={ex.num} className="rounded-lg border border-white/15 p-8">
                  <div className="mb-4 font-serif text-4xl leading-none text-[#C2A679]">
                    {ex.num}
                  </div>
                  <h3 className="mb-3 font-serif text-xl leading-snug text-white md:text-[1.4rem]">
                    {ex.title}
                  </h3>
                  <p className="text-[15px] text-white/70">{ex.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-24">
            <div className="lg:w-80 lg:shrink-0">
              <h2 className="mb-5 font-serif text-3xl leading-tight text-[#1A1A1A] md:text-4xl">
                Questions
                <br />
                <span className="italic text-gray-500">fréquentes</span>
              </h2>
              <p className="text-left text-gray-600">
                Les questions que l&apos;on nous pose au téléphone, dans l&apos;ordre où elles
                viennent.
              </p>
            </div>
            <div className="flex-1">
              {FAQ_ITEMS.map((q, i) => (
                <div key={q.question} className="border-b border-gray-200 pb-1">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span
                      className={cn(
                        "font-serif text-xl leading-snug transition-colors md:text-[1.4rem]",
                        openFaq === i ? "text-[#1A1A1A]" : "text-gray-500 group-hover:text-[#1A1A1A]"
                      )}
                    >
                      {q.question}
                    </span>
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all",
                        openFaq === i
                          ? "border-[#362A24] bg-[#362A24] text-white"
                          : "border-gray-200 text-gray-400 group-hover:border-gray-400"
                      )}
                    >
                      {openFaq === i ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </div>
                  </button>
                  {openFaq === i && (
                    <p className="max-w-3xl pb-6 text-base text-gray-600">{q.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- POUR ALLER PLUS LOIN ---------------- */}
      <section className="border-t border-gray-200 py-14 md:py-16">
        <Container>
          <h2 className="mb-8 font-serif text-3xl text-[#1A1A1A]">
            Pour aller <span className="italic text-gray-500">plus loin</span>
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group rounded-lg border border-gray-200 bg-white p-7 transition-shadow hover:shadow-lg"
              >
                <div className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                  {l.kind}
                </div>
                <h3 className="mb-2.5 font-serif text-xl leading-snug text-[#1A1A1A] transition-colors group-hover:text-[#362A24]">
                  {l.title}
                </h3>
                <p className="text-left text-sm text-gray-600">{l.desc}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- AVIS GOOGLE ----------------
           Avis réels, tirés de la même source que la page d'accueil (lib/i18n)
           pour qu'ils ne puissent pas diverger. Pas de balisage aggregateRating :
           Google n'affiche plus les étoiles auto-déclarées pour le type Attorney
           et l'auto-déclaration est contraire à ses consignes. */}
      <section className="border-t border-gray-200 bg-[#EFEDE6] py-16 md:py-20">
        <Container>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-serif text-3xl text-[#1A1A1A] md:text-4xl">
              Ce qu&apos;en disent <span className="italic text-gray-500">nos clients</span>
            </h2>
            <a
              href="https://maps.google.com/?cid=3809691522538758505"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3"
            >
              <span className="font-serif text-3xl leading-none text-[#1A1A1A]">
                {t.testimonials.googleRating}
              </span>
              <span className="flex text-[#FABB05]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-gray-500 transition-colors group-hover:text-[#1A1A1A]">
                {t.testimonials.googleReviews}
              </span>
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {t.testimonials.items.map((item) => (
              <figure
                key={item.author}
                className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-8"
              >
                <div>
                  <div className="mb-5 flex text-[#FABB05]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mb-6 text-left font-serif text-lg leading-relaxed text-[#1A1A1A]">
                    {item.text}
                  </blockquote>
                </div>
                <figcaption className="text-[13px] text-gray-500">
                  {item.author} — {item.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- CTA FINAL ---------------- */}
      <section className="border-t border-gray-200 py-16 md:py-24">
        <Container>
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">
            <div className="max-w-2xl flex-1">
              <h2 className="mb-5 font-serif text-4xl leading-tight text-[#1A1A1A] md:text-[2.9rem]">
                Un premier entretien téléphonique,{" "}
                <span className="italic text-gray-500">sans frais</span>
              </h2>
              <p className="mb-8 text-left text-lg text-gray-600">
                Nous examinons votre situation et vous disons si la voie sans juge vous est
                ouverte. Cette page délivre une information générale : elle ne remplace pas
                l&apos;examen de votre dossier.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="tel:+33140680237"
                  className="inline-flex items-center gap-3 rounded-full bg-[#362A24] px-8 py-4 text-sm text-white transition-colors hover:bg-[#2C221D]"
                >
                  <Phone className="h-4 w-4" />
                  +33 1 40 68 02 37
                </a>
                <a
                  href="mailto:contact@fain-avocats.fr"
                  className="inline-flex items-center gap-2.5 rounded-full border border-[#D6D3CB] px-7 py-4 text-sm text-[#1A1A1A] transition-colors hover:border-gray-400"
                >
                  <Mail className="h-4 w-4" strokeWidth={1.8} />
                  contact@fain-avocats.fr
                </a>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-9 lg:w-96 lg:shrink-0">
              <div className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                Le cabinet
              </div>
              <div className="mb-2 font-serif text-2xl text-[#1A1A1A]">Fain Avocats</div>
              <p className="mb-5 text-left text-[15px] text-gray-600">
                Cabinet intervenant principalement en droit de la famille, au barreau de Paris.
              </p>
              <div className="border-t border-gray-200 pt-5 text-[15px] leading-relaxed text-gray-600">
                196 avenue Victor Hugo
                <br />
                75116 Paris
                <br />
                Du lundi au vendredi, 9h – 19h
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
