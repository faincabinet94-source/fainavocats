// Référentiel unique des rubriques du site.
//
// Une rubrique = une page de compétence (`href`) + une catégorie de contenu
// (`key`, valeur du champ `category` des fichiers MDX). Guides et actualités
// portent tous une rubrique : elle fixe leur fil d'Ariane, leur maillage et la
// page qui les liste.
//
// ⚠️ Les clés doivent rester identiques, au caractère près, aux valeurs que
// produit la table DOMAINE_TO_CATEGORY du workflow n8n « SEO Auto-Publication
// via Airtable » (YZHjy2JCnxCUcjDD). Une clé inconnue n'empêche pas la
// publication : la page s'affiche, rattachée à « Droit de la famille ».
//
// Réorganisation du 11 octobre 2026 (audit d'organisation du site).

export interface Rubrique {
  key: string;
  label: string;
  href: string;
  emoji: string;
}

export const RUBRIQUES: Rubrique[] = [
  { key: "divorce", label: "Divorce", href: "/divorce", emoji: "⚖️" },
  {
    key: "divorce-sans-juge",
    label: "Divorce sans juge",
    href: "/divorce-sans-juge",
    emoji: "🤝",
  },
  {
    key: "liquidation",
    label: "Liquidation du régime matrimonial",
    href: "/liquidation-regime-matrimonial",
    emoji: "💶",
  },
  {
    key: "prestation-compensatoire",
    label: "Prestation compensatoire",
    href: "/prestation-compensatoire",
    emoji: "⚖️",
  },
  {
    key: "pension-alimentaire",
    label: "Pension alimentaire",
    href: "/pension-alimentaire",
    emoji: "💶",
  },
  {
    key: "autorite-parentale",
    label: "Autorité parentale et résidence de l'enfant",
    href: "/autorite-parentale-residence",
    emoji: "👨‍👧‍👦",
  },
  { key: "couple", label: "Le couple", href: "/le-couple", emoji: "💍" },
  {
    key: "filiation-adoption",
    label: "Filiation et adoption",
    href: "/filiation-adoption",
    emoji: "👶",
  },
  {
    key: "annulation-mariage",
    label: "Annulation de mariage",
    href: "/annulation-mariage",
    emoji: "📜",
  },
  {
    key: "droit-penal-famille",
    label: "Droit pénal de la famille",
    href: "/droit-penal-famille",
    emoji: "⚖️",
  },
  { key: "etat-civil", label: "État civil", href: "/etat-civil", emoji: "📋" },
];

// Anciennes valeurs encore produites par n8n ou présentes dans des fichiers
// anciens : elles sont ramenées à la rubrique actuelle.
const ALIAS: Record<string, string> = {
  "garde-enfants": "autorite-parentale",
  enfants: "autorite-parentale",
};

export const RUBRIQUE_GENERALE: Rubrique = {
  key: "general",
  label: "Droit de la famille",
  href: "/droit-de-la-famille",
  emoji: "⚖️",
};

export function normaliserCategorie(category: string): string {
  return ALIAS[category] || category;
}

export function getRubrique(category: string): Rubrique {
  const key = normaliserCategorie(category);
  return RUBRIQUES.find((r) => r.key === key) || RUBRIQUE_GENERALE;
}
