import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le Couple : Mariage, PACS, Concubinage | Avocat Paris - Fain Avocats",
  description:
    "Guide juridique complet sur le couple : mariage, PACS, concubinage, régimes matrimoniaux, séparation de corps. Avocat spécialisé en droit de la famille Paris 16ème.",
  keywords: [
    "avocat mariage paris",
    "avocat PACS paris",
    "régime matrimonial avocat",
    "rupture PACS avocat",
    "concubinage droits",
    "séparation de corps avocat",
    "changement régime matrimonial",
  ],
};

const sections = [
  {
    title: "Le mariage",
    items: [
      {
        title: "Les régimes matrimoniaux",
        desc: "En l'absence de contrat de mariage, le régime matrimonial est celui de la communauté légale réduite aux acquêts. Les époux peuvent également choisir la séparation de biens ou la participation aux acquêts.",
      },
      {
        title: "Le changement de régime matrimonial",
        desc: "Comment changer de régime matrimonial ? Il faut passer devant le notaire. Une homologation judiciaire sera nécessaire en présence d'enfants mineurs.",
      },
      {
        title: "L'opposition au mariage",
        desc: "En cas d'opposition au mariage, il est possible de demander la mainlevée de l'opposition par l'intermédiaire de son avocat.",
      },
    ],
  },
  {
    title: "Le PACS",
    items: [
      {
        title: "Le PACS : définition et formation",
        desc: "Le Pacte Civil de Solidarité est un contrat entre deux personnes majeures, de sexe différent ou de même sexe, pour organiser leur vie commune. Il est enregistré au greffe du tribunal.",
      },
      {
        title: "Les effets du PACS",
        desc: "Le PACS entraîne certaines obligations et devoirs entre les partenaires. Ils s'engagent à une vie commune et à une assistance et aide matérielle mutuelle.",
      },
      {
        title: "Rupture du PACS",
        desc: "La dissolution du PACS s'effectue par déclaration au greffe du tribunal d'instance. Ses effets peuvent être fixés dans une convention de rupture du PACS.",
      },
    ],
  },
  {
    title: "Le concubinage",
    items: [
      {
        title: "Définition et droits",
        desc: "La définition du concubinage impose une vie commune en couple présentant stabilité et continuité. Les concubins notoires bénéficient d'avantages sociaux et fiscaux limités par rapport au mariage ou au PACS.",
      },
    ],
  },
  {
    title: "La séparation de corps",
    items: [
      {
        title: "La procédure de séparation de corps",
        desc: "La procédure de séparation de corps est identique à celle du divorce. Elle met fin à l'obligation de vie commune tout en maintenant le lien matrimonial.",
      },
      {
        title: "Les effets de la séparation de corps",
        desc: "La séparation de corps pourra être convertie en divorce après deux années de séparation. Elle entraîne la séparation de biens entre les époux.",
      },
    ],
  },
];

export default function LeCouplePage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#F4F2EC] min-h-screen pt-32 pb-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <nav className="text-sm text-gray-500 mb-8">
              <a href="/" className="hover:text-[#362A24] transition-colors">
                Accueil
              </a>
              <span className="mx-2">&gt;</span>
              <Link
                href="/droit-de-la-famille"
                className="hover:text-[#362A24] transition-colors"
              >
                Droit de la Famille
              </Link>
              <span className="mx-2">&gt;</span>
              <span className="text-[#362A24]">Le couple</span>
            </nav>

            <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-8 leading-tight">
              Le couple
            </h1>

            <p className="text-gray-700 text-lg leading-relaxed mb-12">
              Le droit de la famille encadre les différentes formes d&apos;union
              entre personnes&nbsp;: mariage, PACS et concubinage. Chaque statut
              juridique comporte des droits, des obligations et des conséquences
              patrimoniales spécifiques. Un avocat spécialisé vous accompagne
              dans toutes les étapes de la vie de couple.
            </p>

            {sections.map((section) => (
              <div key={section.title} className="mb-12">
                <h2 className="font-serif text-3xl text-[#1A1A1A] mb-6">
                  {section.title}
                </h2>
                <div className="space-y-6">
                  {section.items.map((item) => (
                    <div key={item.title} className="bg-white p-6 rounded-lg">
                      <h3 className="font-serif text-xl text-[#1A1A1A] mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="mb-12">
              <h2 className="font-serif text-3xl text-[#1A1A1A] mb-6">
                Nos articles détaillés
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Les régimes matrimoniaux", slug: "regimes-matrimoniaux", desc: "Communauté, séparation de biens, participation aux acquêts..." },
                  { title: "Le PACS : définition et formation", slug: "pacs-definition-formation", desc: "Conditions, procédure et enregistrement du PACS." },
                  { title: "Les effets du PACS", slug: "effets-pacs", desc: "Vie commune, aide matérielle, régime des biens et effets fiscaux." },
                  { title: "Rupture du PACS", slug: "rupture-pacs", desc: "Causes de dissolution, procédure et effets patrimoniaux." },
                  { title: "Le concubinage", slug: "concubinage", desc: "Définition légale, éléments constitutifs et effets juridiques." },
                  { title: "L'opposition au mariage", slug: "opposition-mariage", desc: "Qui peut s'opposer, quels motifs, quelle procédure ?" },
                  { title: "La séparation de corps : effets", slug: "separation-corps-effets", desc: "Relâchement du lien conjugal, issues possibles et conversion en divorce." },
                  { title: "La séparation de corps : procédure", slug: "separation-corps-procedure", desc: "Requête, demande reconventionnelle et cas de séparation." },
                ].map((a) => (
                  <Link key={a.slug} href={`/fiches/${a.slug}`} className="group bg-white p-6 rounded-lg hover:shadow-lg transition-all">
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-2 group-hover:text-[#362A24] transition-colors">{a.title} &rarr;</h3>
                    <p className="text-gray-500 text-sm">{a.desc}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-[#362A24] text-white p-10 rounded-lg text-center">
              <h2 className="font-serif text-3xl mb-4">
                Besoin d&apos;un conseil&nbsp;?
              </h2>
              <p className="text-white/70 mb-8">
                Contactez-nous pour une consultation personnalisée sur votre
                situation matrimoniale ou de couple.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+33140680237"
                  className="inline-flex items-center justify-center gap-3 bg-white text-[#362A24] px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-gray-100 transition-all duration-300"
                >
                  +33 1 40 68 02 37
                </a>
                <Link
                  href="/consultations"
                  className="inline-flex items-center justify-center gap-3 border-2 border-white text-white px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-white hover:text-[#362A24] transition-all duration-300"
                >
                  Prendre rendez-vous
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
