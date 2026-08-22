import { NextResponse } from "next/server";
import { getAllFiches } from "@/lib/fiches";
import { getAllPosts } from "@/lib/blog";

// Liste des cibles de maillage interne, consommée par le pipeline n8n de
// publication SEO. Le modèle choisissait jusqu'ici ses liens sur le seul nom
// de fichier lu dans le sitemap, ce qui l'obligeait à deviner le sujet d'une
// page. Il dispose désormais du titre et de la description de chacune.
//
// Route statique : recalculée à chaque build, aucun coût à l'exécution.
export const dynamic = "force-static";

type Cible = {
  chemin: string;
  titre: string;
  description: string;
  categorie: string;
  type: "rubrique" | "fiche" | "actualite";
};

// Pages de rubrique. Elles ne viennent pas de content/, leur description est
// donc tenue ici. Toute rubrique ajoutée au site doit être ajoutée ici aussi,
// sinon le pipeline cessera de pointer vers elle.
const RUBRIQUES: Cible[] = [
  {
    chemin: "/divorce",
    titre: "Divorce",
    description:
      "Les quatre cas de divorce, le déroulement de la procédure, les mesures provisoires et les conséquences patrimoniales.",
    categorie: "divorce",
    type: "rubrique",
  },
  {
    chemin: "/garde-enfants",
    titre: "Garde d'enfants",
    description:
      "Résidence des enfants, droit de visite et d'hébergement, autorité parentale, déplacement du domicile.",
    categorie: "garde-enfants",
    type: "rubrique",
  },
  {
    chemin: "/pension-alimentaire",
    titre: "Pension alimentaire et prestation compensatoire",
    description:
      "Fixation, révision et recouvrement de la contribution à l'entretien des enfants, et prestation compensatoire entre époux.",
    categorie: "pension-alimentaire",
    type: "rubrique",
  },
  {
    chemin: "/liquidation-regime-matrimonial",
    titre: "Liquidation du régime matrimonial",
    description:
      "Partage des biens communs ou indivis, récompenses, créances entre époux, indemnité d'occupation, rôle du notaire.",
    categorie: "liquidation",
    type: "rubrique",
  },
  {
    chemin: "/filiation-adoption",
    titre: "Filiation et adoption",
    description:
      "Établissement et contestation de la filiation, reconnaissance, adoption simple et plénière.",
    categorie: "filiation-adoption",
    type: "rubrique",
  },
  {
    chemin: "/droit-penal-famille",
    titre: "Droit pénal de la famille",
    description:
      "Violences conjugales et ordonnance de protection, non-représentation d'enfant, abandon de famille.",
    categorie: "droit-penal-famille",
    type: "rubrique",
  },
  {
    chemin: "/annulation-mariage",
    titre: "Annulation de mariage",
    description:
      "Nullité absolue et nullité relative du mariage, mariage blanc, vice du consentement, effets de l'annulation.",
    categorie: "annulation-mariage",
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
    chemin: "/droit-de-la-famille",
    titre: "Droit de la famille",
    description:
      "Page d'ensemble des domaines d'intervention du cabinet en droit de la famille.",
    categorie: "general",
    type: "rubrique",
  },
  {
    chemin: "/outils/simulateur-prestation-compensatoire",
    titre: "Simulateur de prestation compensatoire",
    description:
      "Outil d'estimation du montant d'une prestation compensatoire à partir de la durée du mariage, de l'âge et des revenus.",
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

  const pages = [...RUBRIQUES, ...fiches, ...actualites];

  return NextResponse.json({
    total: pages.length,
    pages,
  });
}
