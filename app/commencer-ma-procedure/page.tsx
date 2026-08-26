import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commencer votre divorce par consentement mutuel | Fain Avocats",
  description:
    "Les dix étapes d'un divorce par consentement mutuel, du formulaire de renseignements à la transcription à l'état civil. Le déroulement complet, étape par étape.",
  keywords: [
    "étapes divorce par consentement mutuel",
    "déroulement divorce sans juge",
    "procédure divorce amiable",
    "délai de réflexion 15 jours divorce",
    "dépôt convention divorce notaire",
  ],
  alternates: { canonical: "https://fain-avocats.fr/commencer-ma-procedure" },
};

/* Les dix étapes de la procédure, telles que le cabinet la conduit.
   Cette page est la cible du bouton « Commencer la procédure » du courriel de
   devis envoyé par le workflow n8n : ne pas changer l'URL sans mettre à jour
   le nœud « Preparer les donnees et le courriel ». */
const ETAPES: {
  titre: string;
  texte: string;
  lien?: { href: string; label: string; externe?: boolean };
}[] = [
  {
    titre: "Vous remplissez le formulaire de renseignements",
    texte:
      "Il rassemble ce dont nous avons besoin pour rédiger votre convention : votre état civil et celui de votre époux, votre mariage, vos enfants, votre patrimoine et les termes de votre accord.",
    lien: { href: "/formulaire-divorce", label: "Ouvrir le formulaire" },
  },
  {
    titre: "Vous réglez la provision de 250 €",
    texte:
      "Elle vient en déduction des honoraires proposés dans votre devis : ce n'est pas un supplément. Elle couvre les premières diligences, le temps que votre dossier soit ouvert et étudié.",
    lien: { href: "/paiement", label: "Régler la provision" },
  },
  {
    titre: "Vous choisissez un créneau d'entretien téléphonique",
    texte:
      "Cet entretien avec votre avocat sert à arrêter les termes de la convention de divorce : résidence des enfants, contribution à leur entretien et à leur éducation, sort du logement, prestation compensatoire s'il y a lieu.",
    lien: {
      href: "https://rdv.fain-avocats.fr/call",
      label: "Choisir un créneau",
      externe: true,
    },
  },
  {
    titre: "L'accord est vérifié auprès de votre époux",
    texte:
      "Son propre avocat s'assure qu'il a compris et accepte chacun des termes retenus. Chacun des époux doit obligatoirement avoir le sien : l'avocat commun n'est plus possible depuis 2017.",
  },
  {
    titre: "Vous validez l'accord définitif",
    texte:
      "La convention vous est adressée dans sa version aboutie. Vous la relisez et vous confirmez qu'elle correspond à ce dont vous êtes convenus.",
  },
  {
    titre: "La convention vous est notifiée par recommandé électronique",
    texte:
      "Cette notification, adressée par AR24, fait courir le délai légal de réflexion de quinze jours. Vous ne pouvez pas signer avant son terme : ce délai est d'ordre public.",
  },
  {
    titre: "Un rendez-vous de signature vous est fixé",
    texte:
      "Il se tient au cabinet de Maître FAIN, 196 avenue Victor Hugo, PARIS 16. La convention y est signée par les époux et leurs avocats réunis à cet effet.",
  },
  {
    titre: "La convention est transmise au notaire",
    texte:
      "Le dépôt au rang de ses minutes donne à la convention date certaine et force exécutoire. C'est ce dépôt qui dissout le mariage.",
  },
  {
    titre: "Vous recevez l'acte de dépôt du notaire",
    texte:
      "Il atteste du dépôt et constitue le titre dont vous disposerez pour faire valoir votre divorce.",
  },
  {
    titre: "Le divorce est transcrit à l'état civil",
    texte:
      "L'attestation de dépôt est transmise à la mairie du lieu de mariage, qui porte la mention du divorce en marge de l'acte de mariage et des actes de naissance.",
  },
];

export default function CommencerMaProcedurePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F4F2EC] pb-24 pt-32">
        <Container>
          <div className="mx-auto max-w-4xl">
            <Link
              href="/divorce-sans-juge"
              className="mb-8 inline-block text-sm text-gray-500 transition-colors hover:text-[#362A24]"
            >
              &larr; Le divorce sans juge
            </Link>

            <h1 className="mb-8 font-serif text-4xl leading-tight text-[#1A1A1A] md:text-5xl">
              Commencer votre procédure
            </h1>

            <p className="mb-4 text-lg leading-relaxed text-gray-700">
              Voici le déroulement complet d&apos;un divorce par consentement mutuel, de votre
              première démarche jusqu&apos;à la transcription du divorce à l&apos;état civil.
            </p>
            <p className="mb-14 text-lg leading-relaxed text-gray-700">
              Les trois premières étapes vous appartiennent. Les suivantes sont conduites par le
              cabinet, et vous en êtes informé à chaque fois.
            </p>

            <ol className="space-y-4">
              {ETAPES.map((etape, i) => (
                <li
                  key={etape.titre}
                  className="rounded-lg bg-white p-7 transition-shadow duration-300 hover:shadow-lg md:p-8"
                >
                  <div className="flex gap-5 md:gap-7">
                    <div
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D6D3CB] font-serif text-lg text-[#362A24]"
                    >
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-serif text-xl text-[#1A1A1A] md:text-2xl">
                        {etape.titre}
                      </h2>
                      <p className="mt-3 leading-relaxed text-gray-600">{etape.texte}</p>
                      {etape.lien && (
                        <a
                          href={etape.lien.href}
                          {...(etape.lien.externe
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#D6D3CB] px-6 py-3 text-sm text-[#1A1A1A] transition-colors hover:border-gray-400"
                        >
                          {etape.lien.label}
                          <span aria-hidden="true">&rarr;</span>
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-14 rounded-lg bg-[#362A24] p-10 text-center text-white">
              <h2 className="mb-4 font-serif text-3xl text-white">Une question avant de vous lancer ?</h2>
              <p className="mx-auto mb-8 max-w-xl text-white/70">
                Un entretien téléphonique avec votre avocat permet de faire le point sur votre
                situation avant tout engagement.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="https://rdv.fain-avocats.fr/call"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-medium tracking-wide text-[#362A24] transition-colors hover:bg-gray-100"
                >
                  Choisir un créneau
                </a>
                <a
                  href="tel:+33140680237"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-4 text-sm tracking-wide text-white transition-colors hover:border-white/60"
                >
                  +33 1 40 68 02 37
                </a>
              </div>
            </div>

            <p className="mt-10 text-left text-[13px] leading-relaxed text-gray-500">
              Cette page décrit le déroulement habituel d&apos;un divorce par consentement mutuel.
              Elle délivre une information générale et ne remplace pas l&apos;examen de votre
              dossier. Les délais dépendent notamment de la date de notification de la convention
              et de la disponibilité du notaire.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
