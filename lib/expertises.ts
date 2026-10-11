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
  /** Titre décliné avec son article, pour insertion dans une phrase.
   *  Ex. « les réponses aux questions concernant LA PENSION ALIMENTAIRE ». */
  titreInline?: string;
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
    titreInline: "le divorce et la séparation",
    heroTitle: "Avocat Divorce Paris 16",
    heroSubtitle:
      "Consentement mutuel, divorce contentieux, séparation de corps. Un accompagnement stratégique et humain pour protéger vos intérêts.",
    metaTitle:
      "Avocat Divorce Paris 16 | Consentement Mutuel & Contentieux - Fain Avocats",
    metaDescription:
      "Cabinet Fain Avocats, avocat en droit du divorce à Paris 16ème. Divorce par consentement mutuel, contentieux, séparation de corps. Premier entretien téléphonique gratuit. +33 1 40 68 02 37.",
    keywords: [
      "avocat divorce Paris",
      "avocat divorce Paris 16",
      "divorce consentement mutuel Paris",
      "divorce contentieux avocat",
      "avocat liquidation régime matrimonial Paris",
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
          "Le coût varie selon la complexité du dossier (enfants, bien immobilier, prestation compensatoire). Nous proposons des forfaits qui comprennent les honoraires des deux avocats ; le simulateur de la page « Divorce sans juge » donne le montant exact selon votre situation. Une convention d'honoraires vous est systématiquement remise avant toute démarche.",
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
          "Oui, le juge peut attribuer la jouissance du domicile conjugal à l'un des époux pendant la procédure, notamment si les enfants résident principalement chez vous. Nous vous conseillons sur les mesures provisoires à demander.",
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

  // Rubrique renommée le 11 octobre 2026 : « garde » n'est plus le mot des
  // textes, qui parlent d'autorité parentale et de résidence de l'enfant.
  // Ancienne URL /garde-enfants, redirigée en 301 (next.config.js).
  "autorite-parentale-residence": {
    slug: "autorite-parentale-residence",
    title: "Autorité parentale et résidence de l'enfant",
    titreInline: "l'autorité parentale et la résidence de l'enfant",
    heroTitle: "Avocat Autorité parentale et Résidence de l'Enfant Paris",
    heroSubtitle:
      "Résidence alternée, droit de visite, autorité parentale. Nous défendons l'intérêt de vos enfants avec détermination.",
    metaTitle:
      "Avocat Garde des Enfants Paris 16 | Résidence et Autorité parentale",
    metaDescription:
      "Avocat à Paris 16 pour la garde des enfants, au sens juridique la résidence de l'enfant et l'autorité parentale : résidence alternée, droit de visite et d'hébergement. Cabinet Fain Avocats, 20 ans d'expérience. +33 1 40 68 02 37.",
    keywords: [
      "avocat garde enfants Paris",
      "résidence alternée avocat",
      "droit de visite avocat Paris",
      "autorité parentale avocat",
      "modification résidence enfant",
      "avocat droit enfants Paris 16",
    ],
    intro:
      "La résidence des enfants, ce que l'on appelle couramment la « garde », est souvent le sujet le plus sensible lors d'une séparation. L'enjeu est considérable : il s'agit de préserver l'équilibre et le bien-être de vos enfants tout en faisant valoir vos droits parentaux. Le cabinet Fain Avocats vous accompagne avec fermeté et sensibilité dans toutes les procédures liées à l'autorité parentale.",
    problemTitle: "Les enjeux pour l'enfant",
    problemText:
      "Chaque situation familiale est unique. Les décisions prises concernant vos enfants auront un impact durable sur leur vie quotidienne et leur développement :",
    problemPoints: [
      "Choix entre résidence alternée et résidence principale chez un parent",
      "Définition du droit de visite et d'hébergement",
      "Fixation de la contribution à l'entretien et l'éducation des enfants",
      "Déménagement d'un parent et impact sur la résidence de l'enfant",
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
          "Les besoins évoluent. Nous vous accompagnons pour toute modification de la résidence ou du droit de visite liée à un changement de situation.",
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
          "Un parent ne peut pas modifier unilatéralement la résidence des enfants. Si un déménagement remet en cause l'organisation de la résidence, vous pouvez saisir le juge en urgence. Nous intervenons rapidement dans ces situations.",
      },
      {
        question: "L'enfant peut-il choisir chez quel parent il vit ?",
        answer:
          "Non. L'enfant capable de discernement peut demander à être entendu par le juge. La loi ne fixe aucun âge minimum : le discernement s'apprécie in concreto, et il est en général retenu vers 10 ou 11 ans. Son avis est pris en compte mais n'est jamais déterminant à lui seul. Le juge décide toujours dans l'intérêt de l'enfant.",
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
    title: "Pension alimentaire",
    titreInline: "la pension alimentaire",
    heroTitle: "Avocat Pension Alimentaire Paris",
    heroSubtitle:
      "Fixation, révision, recouvrement. Nous veillons à ce que vos droits financiers soient pleinement respectés.",
    metaTitle:
      "Avocat Pension Alimentaire Paris 16 | Fixation & Révision - Fain Avocats",
    metaDescription:
      "Avocat en droit de la famille pour la pension alimentaire à Paris 16. Fixation, révision, recouvrement, prestation compensatoire. Cabinet Fain Avocats. +33 1 40 68 02 37.",
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
          "Le juge se base sur les revenus du débiteur, les besoins de l'enfant, son mode de résidence et le nombre d'enfants. Le barème indicatif du Ministère de la Justice sert de référence, mais le juge peut s'en écarter selon les circonstances.",
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
      {
        question:
          "Le devoir de secours entre époux est-il une pension alimentaire ?",
        answer:
          "Oui. Pendant la procédure de divorce, le devoir de secours prend la forme d'une pension alimentaire due entre époux, distincte de celle versée pour les enfants. Au prononcé du divorce, ce devoir cesse et la prestation compensatoire prend le relais pour compenser la disparité de niveau de vie. En quelque sorte, le devoir de secours se transforme en prestation compensatoire une fois le divorce prononcé.",
      },
    ],
    jsonLdType: "LegalService",
  },

  // Rubrique créée le 11 octobre 2026 (plan de dédoublement pension /
  // prestation approuvé le 16 août 2026). ⚠️ Textes à relire par Me FAIN avant
  // fusion : aucune référence de texte ni de jurisprudence n'y figure.
  "prestation-compensatoire": {
    slug: "prestation-compensatoire",
    title: "Prestation compensatoire",
    titreInline: "la prestation compensatoire",
    heroTitle: "Avocat Prestation compensatoire Paris",
    heroSubtitle:
      "Demande, évaluation, contestation. Nous défendons un montant juste, fondé sur une analyse précise de la situation de chacun des époux.",
    metaTitle:
      "Avocat Prestation compensatoire Paris 16 | Calcul, Demande, Contestation",
    metaDescription:
      "Avocat en droit de la famille à Paris 16 pour la prestation compensatoire : évaluation, demande, contestation, capital ou rente, fiscalité. Cabinet Fain Avocats. +33 1 40 68 02 37.",
    keywords: [
      "avocat prestation compensatoire Paris",
      "calcul prestation compensatoire",
      "prestation compensatoire divorce",
      "contester prestation compensatoire",
      "prestation compensatoire capital ou rente",
    ],
    intro:
      "La prestation compensatoire est versée par un époux à l'autre au moment du divorce pour compenser, autant que possible, la disparité que la rupture du mariage crée dans leurs conditions de vie respectives. Son montant, sa forme et sa fiscalité se préparent avec soin : une fois fixée, elle est très difficile à remettre en cause. Le cabinet Fain Avocats vous accompagne, que vous la demandiez ou qu'elle vous soit réclamée.",
    problemTitle: "Les enjeux de la prestation compensatoire",
    problemText:
      "La prestation compensatoire est souvent la question financière la plus lourde du divorce. Plusieurs éléments doivent être établis et chiffrés :",
    problemPoints: [
      "Revenus, charges et patrimoine réels de chacun des époux",
      "Durée du mariage, âge et situation professionnelle de chacun",
      "Choix professionnels faits pendant la vie commune et leurs conséquences",
      "Forme du versement : capital, capital échelonné ou, exceptionnellement, rente",
      "Fiscalité du versement et articulation avec la liquidation du régime matrimonial",
    ],
    approachTitle: "Notre accompagnement",
    approachText:
      "Nous établissons la disparité sur pièces, la chiffrons selon plusieurs méthodes et défendons le montant et la forme les plus adaptés à votre situation.",
    steps: [
      {
        title: "Analyse des situations",
        description:
          "Étude des revenus, charges, patrimoine et droits à la retraite de chaque époux, avec les justificatifs nécessaires.",
      },
      {
        title: "Chiffrage",
        description:
          "Application de plusieurs méthodes de calcul usuelles pour situer le montant dans une fourchette argumentée.",
      },
      {
        title: "Négociation",
        description:
          "Dans un divorce amiable, le montant et la forme sont fixés par la convention : nous les négocions et les rédigeons.",
      },
      {
        title: "Défense devant le juge",
        description:
          "En cas de désaccord, nous présentons au juge aux affaires familiales un dossier chiffré et documenté.",
      },
    ],
    faq: [
      {
        question: "Comment est fixé le montant de la prestation compensatoire ?",
        answer:
          "Il n'existe pas de barème officiel. Le juge apprécie les besoins de l'un et les ressources de l'autre, en tenant compte notamment de la durée du mariage, de l'âge, de la situation professionnelle et du patrimoine de chacun. Plusieurs méthodes de calcul usuelles donnent une première fourchette : notre simulateur en ligne en applique six.",
      },
      {
        question: "La prestation compensatoire est-elle versée en capital ou en rente ?",
        answer:
          "En principe en capital, versé en une fois ou échelonné. La rente reste exceptionnelle. Le choix de la forme a des conséquences fiscales qu'il faut mesurer avant de signer ou de plaider.",
      },
      {
        question:
          "Quelle est la différence entre pension alimentaire et prestation compensatoire ?",
        answer:
          "La pension alimentaire est versée pour les enfants, ou entre époux pendant la procédure au titre du devoir de secours. La prestation compensatoire est versée à l'ex-époux au moment du divorce, pour compenser la disparité de conditions de vie que crée la rupture.",
      },
    ],
    jsonLdType: "LegalService",
  },

  "filiation-adoption": {
    slug: "filiation-adoption",
    title: "Filiation & Adoption",
    titreInline: "la filiation et l'adoption",
    heroTitle: "Avocat Filiation et Adoption Paris 16",
    heroSubtitle:
      "Établir, contester ou créer un lien de filiation. Des procédures encadrées par des délais stricts, où chaque mois compte.",
    metaTitle:
      "Avocat Filiation et Adoption Paris 16 | Reconnaissance, Contestation - Fain Avocats",
    metaDescription:
      "Avocat en droit de la famille à Paris 16 : établissement et contestation de filiation, recherche de paternité, adoption simple et plénière, adoption de l'enfant du conjoint. +33 1 40 68 02 37.",
    keywords: [
      "avocat filiation Paris",
      "recherche de paternité avocat",
      "contestation de paternité avocat Paris",
      "avocat adoption Paris 16",
      "adoption de l'enfant du conjoint",
      "adoption simple adoption plénière",
    ],
    intro:
      "La filiation est le lien juridique qui unit un enfant à ses parents. Elle emporte l'autorité parentale, l'obligation d'entretien et les droits successoraux. L'établir, la contester ou la créer par l'adoption relève de procédures distinctes, toutes soumises à des délais que l'écoulement du temps rend souvent irréversibles. Le cabinet Fain Avocats vous accompagne dans ces démarches, du premier examen de recevabilité jusqu'à la transcription du jugement.",
    problemTitle: "Un lien qui ne se répare pas toujours",
    problemText:
      "Ces dossiers ont un point commun : le temps y joue contre celui qui attend. Les principales situations rencontrées :",
    problemPoints: [
      "Établir la paternité d'un père qui n'a pas reconnu l'enfant, ou qui refuse de le faire",
      "Contester une filiation établie, lorsque la réalité biologique ne correspond pas à l'état civil",
      "Faire reconnaître une filiation par la possession d'état, quand l'enfant a toujours été traité comme celui de la personne concernée",
      "Adopter l'enfant de son conjoint, de son partenaire ou de son concubin, en choisissant entre adoption simple et adoption plénière",
      "Sécuriser une adoption prononcée à l'étranger et sa transcription sur les registres français",
    ],
    approachTitle: "Notre accompagnement",
    approachText:
      "Nous commençons par vérifier la recevabilité de l'action, car un délai expiré ferme définitivement la voie judiciaire, quelle que soit la réalité des faits. Cette vérification conditionne tout le reste.",
    steps: [
      {
        title: "Examen de la recevabilité",
        description:
          "Identification de l'action ouverte, du titulaire du droit d'agir et du délai applicable. C'est l'étape déterminante : elle décide de ce qui est encore possible.",
      },
      {
        title: "Constitution du dossier",
        description:
          "Actes d'état civil, éléments de possession d'état, correspondances, témoignages. Nous réunissons ce qui permettra au juge de statuer.",
      },
      {
        title: "Procédure devant le tribunal judiciaire",
        description:
          "Rédaction de l'assignation ou de la requête, représentation à l'audience, et demande d'expertise biologique lorsque la filiation est en cause.",
      },
      {
        title: "Conséquences et transcription",
        description:
          "Nom de l'enfant, autorité parentale, contribution à l'entretien, droits successoraux : nous traitons les effets du jugement et veillons à sa transcription sur les registres d'état civil.",
      },
    ],
    faq: [
      {
        question: "Le père de mon enfant refuse de le reconnaître, que puis-je faire ?",
        answer:
          "Une action en recherche de paternité peut être engagée devant le tribunal judiciaire. L'expertise biologique y est très largement admise, le juge ne pouvant l'écarter que pour un motif légitime. L'action obéit toutefois à un délai : plus elle est engagée tôt, plus la situation est simple à traiter.",
      },
      {
        question: "Quelle différence entre adoption simple et adoption plénière ?",
        answer:
          "L'adoption plénière substitue un nouveau lien de filiation à celui d'origine, qu'elle efface, et elle est irrévocable. L'adoption simple ajoute un lien sans supprimer le précédent : l'adopté conserve ses droits dans sa famille d'origine, et l'adoption peut être révoquée pour motifs graves. Le choix dépend de la situation de l'enfant et de l'effet recherché.",
      },
      {
        question: "Puis-je adopter l'enfant de mon conjoint ?",
        answer:
          "C'est l'une des situations les plus fréquentes. Les conditions varient selon votre lien avec le parent de l'enfant, selon que l'autre parent est ou non encore présent dans la filiation, et selon l'âge de l'enfant, qui doit consentir passé un certain seuil. Ces conditions ont évolué ces dernières années et méritent d'être vérifiées au cas par cas.",
      },
      {
        question: "Peut-on contester une filiation déjà établie ?",
        answer:
          "Oui, mais les conditions sont strictes. Le droit d'agir dépend de la qualité du demandeur et de la manière dont la filiation a été établie ; surtout, une filiation confortée par une possession d'état prolongée devient très difficile à remettre en cause. Un examen préalable de recevabilité est indispensable avant toute démarche.",
      },
    ],
    jsonLdType: "LegalService",
  },
  "droit-penal-famille": {
    slug: "droit-penal-famille",
    title: "Droit Pénal de la Famille",
    titreInline: "le droit pénal de la famille",
    heroTitle: "Avocat Droit Pénal de la Famille Paris 16",
    heroSubtitle:
      "Violences conjugales, non-représentation d'enfant, abandon de famille. Le cabinet intervient aux côtés des victimes comme des personnes mises en cause.",
    metaTitle:
      "Avocat Droit Pénal de la Famille Paris 16 | Violences, Non-représentation - Fain Avocats",
    metaDescription:
      "Avocat en droit de la famille à Paris 16 pour les infractions familiales : violences conjugales, non-représentation d'enfant, abandon de famille, ordonnance de protection. +33 1 40 68 02 37.",
    keywords: [
      "avocat violences conjugales Paris",
      "ordonnance de protection avocat",
      "non-représentation d'enfant avocat",
      "abandon de famille avocat Paris",
      "avocat droit pénal de la famille Paris 16",
      "plainte violences conjugales avocat",
    ],
    intro:
      "Le conflit familial bascule parfois sur le terrain pénal. Violences au sein du couple, enfant non représenté à l'issue d'un droit de visite, pension impayée depuis plusieurs mois : ces situations relèvent du code pénal autant que du code civil, et les deux procédures avancent en parallèle. Le cabinet Fain Avocats intervient de part et d'autre de la barre, aux côtés des personnes qui subissent ces faits comme de celles qui en sont accusées.",
    problemTitle: "Quand le civil rencontre le pénal",
    problemText:
      "Une même situation familiale peut se jouer devant deux juridictions en même temps, avec des logiques et des calendriers différents :",
    problemPoints: [
      "Violences au sein du couple : la qualification et la peine encourue varient selon l'incapacité de travail constatée, le statut de conjoint étant une circonstance aggravante",
      "Ordonnance de protection : mesure civile obtenue en urgence devant le juge aux affaires familiales, indépendante de toute plainte pénale",
      "Non-représentation d'enfant : délit qui suppose une décision de justice fixant le droit de visite, et dont l'appréciation dépend étroitement des circonstances",
      "Abandon de famille : le défaut de paiement d'une pension pendant plus de deux mois est pénalement réprimé",
      "Accusations formulées en pleine procédure de divorce : elles appellent une défense méthodique, fondée sur les pièces",
    ],
    approachTitle: "Notre accompagnement",
    approachText:
      "Nous articulons la stratégie pénale avec la procédure familiale en cours, car ce qui se décide devant l'une pèse souvent devant l'autre. Chaque dossier est apprécié sur ses pièces, sans position de principe.",
    steps: [
      {
        title: "Analyse de la situation",
        description:
          "Examen des faits, des pièces disponibles et des procédures déjà engagées, pour identifier les qualifications en jeu et les délais applicables.",
      },
      {
        title: "Mesures d'urgence",
        description:
          "Lorsque la situation l'exige : requête en ordonnance de protection devant le juge aux affaires familiales, dépôt de plainte, demande de mesures d'éloignement.",
      },
      {
        title: "Défense ou constitution de partie civile",
        description:
          "Assistance en garde à vue, devant le juge d'instruction ou le tribunal correctionnel ; ou constitution de partie civile pour faire reconnaître le préjudice et en obtenir réparation.",
      },
      {
        title: "Coordination avec le dossier familial",
        description:
          "Nous veillons à la cohérence entre l'instance pénale et la procédure de divorce ou celle qui concerne les enfants, notamment sur l'exercice de l'autorité parentale.",
      },
    ],
    faq: [
      {
        question: "Faut-il déposer plainte pour obtenir une ordonnance de protection ?",
        answer:
          "Non. L'ordonnance de protection est une mesure civile, demandée au juge aux affaires familiales, qui peut être obtenue indépendamment de toute plainte pénale. Le juge statue à bref délai après avoir entendu les deux parties. Il peut notamment attribuer la jouissance du logement et interdire tout contact.",
      },
      {
        question: "Mon ex-conjoint ne me rend pas les enfants, que puis-je faire ?",
        answer:
          "La non-représentation d'enfant suppose une décision de justice fixant les modalités de résidence ou de visite. Les faits se constatent utilement par un dépôt de plainte immédiat. Selon les circonstances, la voie pénale peut être engagée en parallèle d'une demande de modification devant le juge aux affaires familiales.",
      },
      {
        question: "Que risque-t-on en cas de pension alimentaire impayée ?",
        answer:
          "Le défaut de paiement d'une pension fixée par décision de justice, pendant plus de deux mois, constitue le délit d'abandon de famille. Il existe par ailleurs des voies civiles de recouvrement, souvent plus rapides. Le choix entre les deux dépend de la situation du débiteur.",
      },
      {
        question: "Je suis accusé à tort dans le cadre de mon divorce. Comment me défendre ?",
        answer:
          "Une accusation formulée pendant une séparation se combat sur les pièces : chronologie des faits, échanges écrits, témoignages, éléments matériels. Nous constituons le dossier de défense et assurons l'assistance à chaque étape, de l'audition libre ou de la garde à vue jusqu'à l'audience.",
      },
    ],
    jsonLdType: "LegalService",
  },
  "annulation-mariage": {
    slug: "annulation-mariage",
    title: "Annulation de Mariage",
    titreInline: "l'annulation de mariage",
    heroTitle: "Avocat Annulation de Mariage Paris 16",
    heroSubtitle:
      "Vice du consentement, mariage de complaisance, bigamie. Faire juger qu'un mariage n'a jamais valablement existé.",
    metaTitle:
      "Avocat Annulation de Mariage Paris 16 | Nullité du Mariage - Fain Avocats",
    metaDescription:
      "Avocat en droit de la famille à Paris 16 pour l'annulation de mariage : vice du consentement, erreur sur les qualités essentielles, mariage de complaisance, bigamie. +33 1 40 68 02 37.",
    keywords: [
      "avocat annulation mariage Paris",
      "nullité du mariage avocat",
      "annulation mariage vice du consentement",
      "mariage de complaisance annulation",
      "erreur sur les qualités essentielles mariage",
      "avocat nullité mariage Paris 16",
    ],
    intro:
      "L'annulation diffère profondément du divorce. Le divorce met fin à un mariage valable ; l'annulation fait juger que ce mariage n'a jamais valablement existé, faute d'une condition exigée au jour de sa célébration. Les cas sont limitativement prévus par la loi et les délais sont stricts. Le cabinet Fain Avocats examine si votre situation entre dans l'un de ces cas et vous accompagne devant le tribunal judiciaire.",
    problemTitle: "Annulation ou divorce ?",
    problemText:
      "Le choix n'est pas libre : l'annulation suppose un vice existant au jour du mariage, et les conditions en sont strictement encadrées.",
    problemPoints: [
      "Vice du consentement : erreur sur la personne ou sur ses qualités essentielles, violence ou contrainte exercée sur l'un des époux",
      "Absence de consentement réel : mariage contracté sans intention de fonder une union, dit mariage de complaisance",
      "Empêchements tenant à l'état des personnes : mariage antérieur non dissous, lien de parenté ou d'alliance prohibé",
      "Irrégularités de célébration : défaut de publicité, incompétence de l'officier d'état civil",
      "Délais : cinq ans pour les nullités dites relatives, trente ans pour les nullités absolues : deux régimes qu'il faut identifier tôt",
    ],
    approachTitle: "Notre accompagnement",
    approachText:
      "Nous vérifions d'abord si l'annulation est juridiquement ouverte, car elle ne l'est pas dans la majorité des situations. Lorsqu'elle ne l'est pas, nous vous orientons vers la voie du divorce plutôt que d'engager une procédure vouée à l'échec.",
    steps: [
      {
        title: "Qualification du vice",
        description:
          "Analyse des circonstances de la célébration et des éléments dont vous disposez, pour déterminer si un cas de nullité est caractérisé et lequel.",
      },
      {
        title: "Vérification du délai",
        description:
          "Le régime de la nullité commande le délai pour agir. Cette vérification conditionne la recevabilité même de la demande.",
      },
      {
        title: "Constitution du dossier de preuve",
        description:
          "Réunion des pièces : échanges, témoignages, actes d'état civil, éléments établissant l'absence d'intention matrimoniale ou l'erreur invoquée.",
      },
      {
        title: "Procédure devant le tribunal judiciaire",
        description:
          "Rédaction de l'assignation, représentation à l'audience, et traitement des conséquences de l'annulation à l'égard des époux et des enfants.",
      },
    ],
    faq: [
      {
        question: "Quelle différence entre annulation et divorce ?",
        answer:
          "Le divorce dissout un mariage valablement formé, pour l'avenir. L'annulation fait constater que le mariage n'a jamais valablement existé, en raison d'un vice présent au jour de la célébration. Les conditions de l'annulation sont limitativement prévues par la loi, ce qui la rend beaucoup plus rare que le divorce.",
      },
      {
        question: "Un mensonge de mon conjoint suffit-il à annuler le mariage ?",
        answer:
          "Pas n'importe lequel. L'erreur doit porter sur la personne elle-même ou sur une qualité que l'on peut tenir pour essentielle, et il faut établir que cette erreur a été déterminante du consentement. Les tribunaux en font une appréciation stricte, au cas par cas.",
      },
      {
        question: "Quel est le délai pour demander l'annulation ?",
        answer:
          "Il dépend du fondement invoqué. Les nullités relatives, qui protègent un époux, se prescrivent par cinq ans ; les nullités absolues, qui protègent l'ordre public, obéissent à un délai de trente ans. Identifier le bon fondement est donc la première étape, car un délai expiré rend la demande irrecevable.",
      },
      {
        question: "Quelles conséquences pour les enfants ?",
        answer:
          "L'annulation est sans effet sur la filiation : les enfants conservent leur lien avec chacun de leurs parents, et les questions d'autorité parentale, de résidence et de contribution à l'entretien se règlent comme après une séparation. La loi protège par ailleurs l'époux de bonne foi, qui conserve le bénéfice des effets du mariage.",
      },
    ],
    jsonLdType: "LegalService",
  },
  "liquidation-regime-matrimonial": {
    slug: "liquidation-regime-matrimonial",
    title: "Liquidation du régime matrimonial",
    titreInline: "la liquidation du régime matrimonial",
    heroTitle: "Avocat Liquidation du Régime Matrimonial à Paris",
    heroSubtitle:
      "Partage des biens, récompenses, indemnité d'occupation, sortie d'indivision : nous sécurisons la liquidation de votre régime matrimonial lors du divorce.",
    metaTitle:
      "Avocat Liquidation du Régime Matrimonial Paris 16 - Fain Avocats",
    metaDescription:
      "Avocat en liquidation du régime matrimonial à Paris 16 : partage des biens, récompenses, indemnité d'occupation, indivision post-communautaire. Cabinet Fain Avocats. +33 1 40 68 02 37.",
    keywords: [
      "liquidation régime matrimonial avocat",
      "partage des biens divorce",
      "récompenses communauté",
      "indemnité d'occupation divorce",
      "indivision post-communautaire avocat Paris",
      "avocat divorce patrimoine Paris 16",
    ],
    intro:
      "Lors d'un divorce, la liquidation du régime matrimonial règle le partage du patrimoine des époux. C'est souvent l'étape la plus technique et la plus disputée : évaluation des biens, sort du logement, récompenses dues à la communauté ou à un époux, créances entre conjoints. Fort de plus de 20 ans d'expérience en droit de la famille, le cabinet Fain Avocats vous accompagne pour défendre vos intérêts patrimoniaux.",
    problemTitle: "Les enjeux de la liquidation",
    problemText:
      "Un partage mal préparé peut avoir des conséquences financières durables. Les principaux points de tension :",
    problemPoints: [
      "Détermination du régime applicable (communauté, séparation de biens, participation aux acquêts)",
      "Qualification des biens : propres ou communs",
      "Récompenses dues entre un époux et la communauté",
      "Indemnité d'occupation du logement pendant la procédure",
      "Sortie de l'indivision post-communautaire sur un bien immobilier",
      "Évaluation des biens et prise en compte du passif (emprunts en cours)",
    ],
    approachTitle: "Notre accompagnement",
    approachText:
      "Nous travaillons en lien étroit avec le notaire chargé des opérations pour établir un projet de liquidation clair et défendre votre position, à l'amiable comme devant le juge.",
    steps: [
      {
        title: "Audit patrimonial",
        description:
          "Inventaire des biens, dettes et flux financiers du couple. Nous cartographions la masse à partager et identifions les récompenses et créances potentielles.",
      },
      {
        title: "Projet de liquidation",
        description:
          "Élaboration, avec le notaire, d'un état liquidatif chiffré : qualification des biens, calcul des récompenses, valorisation des lots.",
      },
      {
        title: "Négociation ou contentieux",
        description:
          "Nous recherchons un partage amiable équilibré. En cas de blocage, nous saisissons le juge pour un partage judiciaire.",
      },
      {
        title: "Finalisation",
        description:
          "Signature de l'acte de partage devant notaire et suivi jusqu'à l'exécution complète.",
      },
    ],
    faq: [
      {
        question: "En quoi consiste la liquidation du régime matrimonial ?",
        answer:
          "C'est l'opération qui partage les biens du couple à l'occasion du divorce. Selon votre régime (communauté, séparation de biens, participation aux acquêts), les règles de qualification et de partage diffèrent. Nous analysons votre contrat de mariage, le cas échéant, et établissons un projet de liquidation avec le notaire.",
      },
      {
        question: "Qu'est-ce qu'une récompense ?",
        answer:
          "C'est une somme due entre un époux et la communauté lorsque des fonds propres ont profité à la communauté, ou l'inverse. Le calcul des récompenses est souvent un point clé, et litigieux, de la liquidation.",
      },
      {
        question: "Qu'est-ce que l'indemnité d'occupation ?",
        answer:
          "Lorsqu'un époux occupe seul, pendant la procédure, un logement dépendant de l'indivision, il peut être redevable d'une indemnité d'occupation envers l'indivision. Son montant et sa date de départ se discutent et peuvent peser lourd dans le partage final.",
      },
      {
        question: "Comment sortir d'une indivision après le divorce ?",
        answer:
          "Nul ne peut être contraint de rester en indivision. À défaut d'accord amiable (rachat de part, vente), vous pouvez demander le partage judiciaire. Nous privilégions la négociation et, si nécessaire, engageons la procédure.",
      },
    ],
    jsonLdType: "LegalService",
  },
};
