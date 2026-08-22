import { NextResponse } from "next/server";
import { getAllFiches } from "@/lib/fiches";
import { getAllPosts } from "@/lib/blog";
import { expertises } from "@/lib/expertises";

// Liste des cibles de maillage interne, consommée par le pipeline n8n de
// publication SEO (workflow « SEO Auto-Publication via Airtable »).
//
// Le modèle choisissait jusqu'ici ses liens sur le seul nom de fichier lu dans
// le sitemap, ce qui l'obligeait à deviner le sujet d'une page. Il dispose
// désormais du titre et de la description de chacune.
//
// N'expose que des données déjà publiques : titres et descriptions meta.
// Route statique : recalculée à chaque build, aucun coût à l'exécution.
export const dynamic = "force-static";

type Cible = {
  chemin: string;
  titre: string;
  description: string;
  categorie: string;
  type: "rubrique" | "fiche" | "actualite";
};

// Les sept rubriques de compétence sont décrites dans lib/expertises.ts : on
// les lit là-bas plutôt que de recopier leur description ici, sinon les deux
// finissent par diverger et le modèle travaille sur un texte périmé.
const RUBRIQUES_EXPERTISES: Cible[] = Object.values(expertises).map((e) => ({
  chemin: `/${e.slug}`,
  titre: e.title,
  description: e.heroSubtitle,
  categorie: e.slug,
  type: "rubrique",
}));

// Pages de fond qui ne sont décrites ni dans content/ ni dans lib/expertises.ts.
// C'est la seule liste à tenir à jour à la main : une page ajoutée ici devient
// une cible de maillage, une page oubliée cesse d'en être une.
const RUBRIQUES_HORS_EXPERTISES: Cible[] = [
  {
    chemin: "/droit-de-la-famille",
    titre: "Droit de la famille",
    description:
      "Page d'ensemble : divorce, enfants, pensions, liquidation du régime matrimonial, filiation, état civil.",
    categorie: "general",
    type: "rubrique",
  },
  {
    chemin: "/le-couple",
    titre: "Le couple",
    description:
      "Mariage, PACS et concubinage : formation, effets patrimoniaux et rupture de chacune des trois unions.",
    categorie: "couple",
    type: "rubrique",
  },
  {
    chemin: "/les-enfants",
    titre: "Les enfants",
    description:
      "Autorité parentale, résidence, entretien et éducation de l'enfant, audition du mineur.",
    categorie: "enfants",
    type: "rubrique",
  },
  {
    chemin: "/etat-civil",
    titre: "État civil",
    description:
      "Changement de prénom et de nom, rectification des actes, transcription des actes étrangers.",
    categorie: "etat-civil",
    type: "rubrique",
  },
  {
    chemin: "/outils/simulateur-prestation-compensatoire",
    titre: "Simulateur de prestation compensatoire",
    description:
      "Outil de calcul indicatif du montant d'une prestation compensatoire selon plusieurs méthodes usuelles.",
    categorie: "pension-alimentaire",
    type: "rubrique",
  },
  {
    chemin: "/honoraires/droit-de-la-famille",
    titre: "Honoraires en droit de la famille",
    description:
      "Modes de facturation du cabinet, montants pratiqués et convention d'honoraires.",
    categorie: "cabinet",
    type: "rubrique",
  },
];

export function GET() {
  const fiches: Cible[] = getAllFiches().map((f) => ({
    chemin: `/fiches/${f.slug}`,
    titre: f.title,
    description: f.description,
    categorie: f.category,
    type: "fiche",
  }));

  const actualites: Cible[] = getAllPosts().map((p) => ({
    chemin: `/actualites/${p.slug}`,
    titre: p.title,
    description: p.description,
    categorie: p.category,
    type: "actualite",
  }));

  const pages = [
    ...RUBRIQUES_EXPERTISES,
    ...RUBRIQUES_HORS_EXPERTISES,
    ...fiches,
    ...actualites,
  ];

  return NextResponse.json({
    total: pages.length,
    pages,
  });
}
