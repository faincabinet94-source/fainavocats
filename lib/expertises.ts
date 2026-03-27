export interface ExpertiseFAQ {
  question: string;
  answer: string;
}

export interface ExpertiseStep {
  title: string;
  description: string;
}

export interface ExpertiseData {
  slug: string;
  title: string;
  heroTitle: string;
  heroSubtitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  intro: string;
  problemTitle: string;
  problemText: string;
  problemPoints: string[];
  approachTitle: string;
  approachText: string;
  steps: ExpertiseStep[];
  faq: ExpertiseFAQ[];
  jsonLdType: string;
}

export const expertises: Record<string, ExpertiseData> = {
  divorce: {
    slug: "divorce",
    title: "Divorce & Séparation",
    heroTitle: "Avocat Divorce Paris 16",
    heroSubtitle:
      "Consentement mutuel, divorce contentieux, séparation de corps. Un accompagnement stratégique et humain pour protéger vos intérêts.",
    metaTitle:
      "Avocat Divorce Paris 16 | Consentement Mutuel & Contentieux - Fain Avocats",
    metaDescription:
      "Cabinet Fain Avocats, expert en divorce à Paris 16ème. Divorce par consentement mutuel, contentieux, séparation de corps. Premier entretien téléphonique gratuit. +33 1 40 68 02 37.",
    keywords: [
      "avocat divorce Paris",
      "avocat divorce Paris 16",
      "divorce consentement mutuel Paris",
      "divorce contentieux avocat",
      "meilleur avocat divorce Paris",
      "séparation de corps avocat",
    ],
    intro:
      "Le divorce est une étape majeure de la vie. Qu'il s'agisse d'un consentement mutuel ou d'une procédure contentieuse, chaque décision a des conséquences durables sur votre patrimoine, vos enfants et votre avenir. Depuis plus de 20 ans, le cabinet Fain Avocats accompagne ses clients avec rigueur et humanité dans toutes les formes de divorce.",
    problemTitle: "Les enjeux d'un divorce",
    problemText:
      "Un divorce mal préparé peut avoir des conséquences financières et familiales considérables. Les questions à résoudre sont nombreuses et interdépendantes :",
    problemPoints: [
      "Partage du patrimoine et liquidation du régime matrimonial",
      "Résidence des enfants et droit de visite",
      "Fixation de la pension alimentaire et de la prestation compensatoire",
      "Sort du logement familial et des biens immobiliers",
      "Gestion des dettes communes et des comptes joints",
    ],
    approachTitle: "Notre accompagnement",
    approachText:
      "Nous privilégions une approche sur mesure. Chaque dossier fait l'objet d'une analyse approfondie pour vous proposer la stratégie la plus adaptée à votre situation.",
    steps: [
      {
        title: "Entretien initial gratuit",
        description:
          "Un premier échange téléphonique pour comprendre votre situation et vous orienter vers la procédure adaptée.",
      },
      {
        title: "Analyse et stratégie",
        description:
          "Étude complète de votre dossier : patrimoine, enfants, revenus. Nous établissons une stratégie claire et un devis transparent.",
      },
      {
        title: "Négociation ou procédure",
        description:
          "En consentement mutuel, nous rédigeons la convention. En contentieux, nous défendons fermement vos intérêts devant le juge.",
      },
      {
        title: "Suivi post-divorce",
        description:
          "Nous restons disponibles pour toute question après le prononcé du divorce : exécution, modification des mesures.",
      },
    ],
    faq: [
      {
        question: "Combien coûte un divorce par consentement mutuel ?",
        answer:
          "Le coût varie selon la complexité du dossier (patrimoine, enfants). Nous proposons des forfaits à partir de 1 500€ TTC par époux. Une convention d'honoraires transparente vous est systématiquement remise avant toute démarche.",
      },
      {
        question: "Quelle est la durée d'une procédure de divorce ?",
        answer:
          "Un divorce par consentement mutuel peut être finalisé en 1 à 3 mois. Un divorce contentieux prend généralement entre 12 et 24 mois, selon la complexité des désaccords.",
      },
      {
        question:
          "Puis-je rester dans le logement familial pendant la procédure ?",
        answer:
          "Oui, le juge peut attribuer la jouissance du domicile conjugal à l'un des époux pendant la procédure, notamment si vous avez la garde des enfants. Nous vous conseillons sur les mesures provisoires à demander.",
      },
      {
        question:
          "Mon conjoint refuse le divorce, quelles sont mes options ?",
        answer:
          "Vous pouvez engager un divorce pour altération définitive du lien conjugal (après 1 an de séparation) ou un divorce pour faute. Nous évaluons ensemble la procédure la plus efficace pour votre cas.",
      },
    ],
    jsonLdType: "LegalService",
  },

  "garde-enfants": {
    slug: "garde-enfants",
    title: "Garde d'Enfants",
    heroTitle: "Avocat Garde d'Enfants Paris",
    heroSubtitle:
      "Résidence alternée, droit de visite, autorité parentale. Nous défendons l'intérêt de vos enfants avec détermination.",
    metaTitle:
      "Avocat Garde d'Enfants Paris 16 | Résidence Alternée & Autorité Parentale",
    metaDescription:
      "Avocat spécialisé en garde d'enfants à Paris 16. Résidence alternée, droit de visite, modification de garde. Cabinet Fain Avocats, 20 ans d'expérience. +33 1 40 68 02 37.",
    keywords: [
      "avocat garde enfants Paris",
      "résidence alternée avocat",
      "droit de visite avocat Paris",
      "autorité parentale avocat",
      "modification garde enfants",
      "avocat droit enfants Paris 16",
    ],
    intro:
      "La question de la garde des enfants est souvent le sujet le plus sensible lors d'une séparation. L'enjeu est considérable : il s'agit de préserver l'équilibre et le bien-être de vos enfants tout en faisant valoir vos droits parentaux. Le cabinet Fain Avocats vous accompagne avec fermeté et sensibilité dans toutes les procédures liées à l'autorité parentale.",
    problemTitle: "Les enjeux de la garde",
    problemText:
      "Chaque situation familiale est unique. Les décisions prises concernant vos enfants auront un impact durable sur leur vie quotidienne et leur développement :",
    problemPoints: [
      "Choix entre résidence alternée et résidence principale chez un parent",
      "Définition du droit de visite et d'hébergement",
      "Fixation de la contribution à l'entretien et l'éducation des enfants",
      "Déménagement d'un parent et impact sur la garde",
      "Situations d'urgence : violences, risque d'enlèvement",
    ],
    approachTitle: "Notre accompagnement",
    approachText:
      "Nous plaçons l'intérêt de l'enfant au centre de chaque décision, tout en défendant vos droits parentaux avec conviction.",
    steps: [
      {
        title: "Évaluation de la situation",
        description:
          "Analyse complète de votre contexte familial : âge des enfants, conditions de vie, emploi du temps, souhaits de chacun.",
      },
      {
        title: "Recherche d'un accord amiable",
        description:
          "Quand c'est possible, nous privilégions la négociation pour aboutir à un accord respectueux de tous, en particulier des enfants.",
      },
      {
        title: "Défense devant le juge",
        description:
          "Si un accord est impossible, nous constituons un dossier solide et défendons vos droits devant le juge aux affaires familiales.",
      },
      {
        title: "Suivi et adaptation",
        description:
          "Les besoins évoluent. Nous vous accompagnons pour toute modification de garde liée à un changement de situation.",
      },
    ],
    faq: [
      {
        question: "La résidence alternée est-elle systématiquement accordée ?",
        answer:
          "Non. Le juge décide en fonction de l'intérêt de l'enfant, en tenant compte de la proximité des domiciles, de l'âge de l'enfant, de la disponibilité des parents et de la qualité de leur communication. Nous vous aidons à constituer un dossier solide.",
      },
      {
        question:
          "Mon ex-conjoint veut déménager avec les enfants, que faire ?",
        answer:
          "Un parent ne peut pas modifier unilatéralement la résidence des enfants. Si un déménagement menace l'organisation de la garde, vous pouvez saisir le juge en urgence. Nous intervenons rapidement dans ces situations.",
      },
      {
        question: "À partir de quel âge l'enfant peut-il choisir ?",
        answer:
          "L'enfant capable de discernement peut être entendu par le juge, généralement à partir de 10-12 ans. Son avis est pris en compte mais n'est jamais déterminant à lui seul. Le juge décide toujours dans l'intérêt de l'enfant.",
      },
      {
        question:
          "L'autre parent ne respecte pas le droit de visite, que faire ?",
        answer:
          "Le non-respect du droit de visite ou la non-présentation d'enfant est un délit pénal. Nous pouvons saisir le juge pour faire respecter vos droits et, si nécessaire, engager des poursuites pénales.",
      },
    ],
    jsonLdType: "LegalService",
  },

  "pension-alimentaire": {
    slug: "pension-alimentaire",
    title: "Pension Alimentaire",
    heroTitle: "Avocat Pension Alimentaire Paris",
    heroSubtitle:
      "Fixation, révision, recouvrement. Nous veillons à ce que vos droits financiers soient pleinement respectés.",
    metaTitle:
      "Avocat Pension Alimentaire Paris 16 | Fixation & Révision - Fain Avocats",
    metaDescription:
      "Avocat spécialisé en pension alimentaire à Paris 16. Fixation, révision, recouvrement, prestation compensatoire. Cabinet Fain Avocats. +33 1 40 68 02 37.",
    keywords: [
      "avocat pension alimentaire Paris",
      "calcul pension alimentaire",
      "révision pension alimentaire avocat",
      "recouvrement pension alimentaire",
      "prestation compensatoire avocat Paris",
      "pension alimentaire divorce",
    ],
    intro:
      "La pension alimentaire est un droit fondamental destiné à assurer l'entretien et l'éducation des enfants après une séparation. Sa fixation, sa révision ou son recouvrement nécessitent une connaissance fine de la jurisprudence et des barèmes en vigueur. Le cabinet Fain Avocats vous accompagne pour obtenir ou défendre un montant juste et adapté.",
    problemTitle: "Les enjeux financiers",
    problemText:
      "La question de la pension alimentaire cristallise souvent les tensions. Un montant mal évalué peut pénaliser durablement l'un ou l'autre des parents :",
    problemPoints: [
      "Évaluation des revenus réels de chaque parent (y compris avantages en nature)",
      "Calcul selon le barème du Ministère de la Justice et les besoins de l'enfant",
      "Révision en cas de changement de situation (perte d'emploi, nouvelle union)",
      "Recouvrement en cas d'impayés (saisie, paiement direct, aide de la CAF)",
      "Articulation avec la prestation compensatoire entre ex-époux",
    ],
    approachTitle: "Notre accompagnement",
    approachText:
      "Nous analysons précisément votre situation financière et celle de votre ex-conjoint pour défendre un montant juste, qu'il s'agisse d'obtenir ou de contester une pension.",
    steps: [
      {
        title: "Analyse financière",
        description:
          "Étude détaillée des revenus, charges et patrimoine de chaque parent pour déterminer un montant équitable.",
      },
      {
        title: "Fixation ou révision",
        description:
          "Rédaction de la demande auprès du juge avec tous les justificatifs nécessaires pour obtenir le montant adapté.",
      },
      {
        title: "Négociation",
        description:
          "Quand un accord est possible, nous rédigeons une convention claire qui sera homologuée par le juge.",
      },
      {
        title: "Recouvrement",
        description:
          "En cas d'impayés, nous activons toutes les voies légales : paiement direct, saisie sur salaire, procédure pénale pour abandon de famille.",
      },
    ],
    faq: [
      {
        question: "Comment est calculée la pension alimentaire ?",
        answer:
          "Le juge se base sur les revenus du débiteur, les besoins de l'enfant, le mode de garde et le nombre d'enfants. Le barème indicatif du Ministère de la Justice sert de référence, mais le juge peut s'en écarter selon les circonstances.",
      },
      {
        question: "Mon ex ne paie plus la pension, que faire ?",
        answer:
          "Vous disposez de plusieurs recours : la procédure de paiement direct (prélèvement sur salaire), la saisie-attribution, l'aide au recouvrement par la CAF, et la plainte pénale pour abandon de famille. Nous choisissons la voie la plus efficace selon votre situation.",
      },
      {
        question:
          "Puis-je demander une révision de la pension alimentaire ?",
        answer:
          "Oui, en cas de changement significatif de situation : perte d'emploi, hausse de revenus, besoins accrus de l'enfant (études, santé). Nous constituons le dossier de demande de modification auprès du juge aux affaires familiales.",
      },
      {
        question:
          "Quelle est la différence entre pension alimentaire et prestation compensatoire ?",
        answer:
          "La pension alimentaire est versée pour les enfants. La prestation compensatoire est versée à l'ex-époux pour compenser la disparité de niveau de vie causée par le divorce. Elle peut être versée en capital ou sous forme de rente.",
      },
    ],
    jsonLdType: "LegalService",
  },

  "patrimoine-successions": {
    slug: "patrimoine-successions",
    title: "Patrimoine & Successions",
    heroTitle: "Avocat Patrimoine et Successions Paris",
    heroSubtitle:
      "Liquidation de régime matrimonial, indivision, héritage. Nous protégeons votre patrimoine familial.",
    metaTitle:
      "Avocat Succession Paris 16 | Patrimoine & Héritage - Fain Avocats",
    metaDescription:
      "Avocat spécialisé en successions et patrimoine à Paris 16. Liquidation de régime matrimonial, indivision, donation, héritage. Cabinet Fain Avocats. +33 1 40 68 02 37.",
    keywords: [
      "avocat succession Paris",
      "avocat patrimoine Paris 16",
      "liquidation régime matrimonial avocat",
      "indivision avocat Paris",
      "avocat héritage Paris",
      "partage succession avocat",
    ],
    intro:
      "Les questions de patrimoine et de succession sont souvent complexes et chargées d'émotion. Qu'il s'agisse de protéger vos biens lors d'un divorce, de régler une succession conflictuelle ou de sortir d'une indivision, chaque décision engage des sommes importantes. Fort de 20 ans d'expérience, le cabinet Fain Avocats vous accompagne avec expertise et discrétion.",
    problemTitle: "Les enjeux patrimoniaux",
    problemText:
      "Le patrimoine familial est souvent au centre des conflits. Une mauvaise anticipation ou un désaccord sur le partage peut avoir des conséquences financières majeures :",
    problemPoints: [
      "Liquidation du régime matrimonial lors d'un divorce",
      "Partage d'une succession bloquée par un désaccord entre héritiers",
      "Sortie d'indivision sur un bien immobilier",
      "Contestation de donations ou de testaments",
      "Protection du conjoint survivant et des enfants",
    ],
    approachTitle: "Notre accompagnement",
    approachText:
      "Nous travaillons en étroite collaboration avec des notaires et des experts-comptables pour vous apporter une solution globale et sécurisée.",
    steps: [
      {
        title: "Audit patrimonial",
        description:
          "Inventaire complet des biens, dettes, droits et obligations. Nous cartographions votre situation pour définir la meilleure stratégie.",
      },
      {
        title: "Stratégie juridique",
        description:
          "Élaboration d'un plan d'action : négociation amiable, médiation ou procédure judiciaire selon le contexte.",
      },
      {
        title: "Négociation ou contentieux",
        description:
          "Nous négocions un partage équitable ou, en cas de blocage, saisissons le tribunal pour faire valoir vos droits.",
      },
      {
        title: "Finalisation",
        description:
          "Rédaction des actes, coordination avec le notaire et suivi jusqu'à l'exécution complète du partage.",
      },
    ],
    faq: [
      {
        question: "Comment se passe la liquidation du régime matrimonial ?",
        answer:
          "C'est l'opération qui consiste à partager les biens du couple lors du divorce. Selon votre régime (communauté, séparation de biens, participation aux acquêts), les règles diffèrent. Nous analysons votre contrat de mariage et établissons un projet de liquidation avec le notaire.",
      },
      {
        question: "Un héritier bloque la succession, que faire ?",
        answer:
          "En cas de blocage, vous pouvez saisir le tribunal judiciaire pour demander le partage judiciaire de la succession. Le juge peut désigner un notaire pour procéder aux opérations de liquidation-partage. Nous vous accompagnons dans cette procédure.",
      },
      {
        question: "Comment sortir d'une indivision ?",
        answer:
          "Nul ne peut être contraint de rester en indivision. Vous pouvez demander le partage amiable ou, à défaut, saisir le tribunal. Nous négocions en priorité un accord et, si nécessaire, engageons la procédure judiciaire.",
      },
      {
        question: "Peut-on contester un testament ?",
        answer:
          "Oui, un testament peut être contesté pour vice de forme, insanité d'esprit du testateur, ou atteinte à la réserve héréditaire. Les délais pour agir sont stricts. Nous évaluons la solidité de votre contestation avant d'engager l'action.",
      },
    ],
    jsonLdType: "LegalService",
  },
};
