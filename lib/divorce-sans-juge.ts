/* Source unique de la FAQ « divorce sans juge ».
   Partagée entre la page (serveur, pour le balisage FAQPage) et le composant
   interactif (client) : le balisage et l'affiché ne peuvent pas diverger. */
export const FAQ_ITEMS = [
  {
    question: "Peut-on avoir un seul avocat pour les deux époux ?",
    answer:
      "Non. Chacun des époux doit obligatoirement avoir son propre avocat. L'avocat commun, possible dans l'ancienne procédure, ne l'est plus depuis 2017.",
  },
  {
    question: "Faut-il passer devant un juge ?",
    answer:
      "Non, sauf dans les deux cas d'exception : lorsqu'un enfant mineur demande à être entendu, et lorsqu'un époux fait l'objet d'une mesure de protection. En dehors de ces situations, il n'y a ni audience ni jugement.",
  },
  {
    question: "Combien de temps faut-il compter ?",
    answer:
      "Pour un dossier simple, sans bien immobilier à partager, il faut souvent compter quatre à six semaines. S'y ajoutent, de façon incompressible, les quinze jours de réflexion puis le délai de dépôt chez le notaire. La présence d'un bien immobilier ou un désaccord ponctuel sur la prestation compensatoire allonge sensiblement cette durée.",
  },
  {
    question: "Peut-on revenir sur la convention après le dépôt ?",
    answer:
      "La convention est intangible une fois déposée. Ce qui n'y a pas été prévu, ou ce qui y a été mal évalué, ne se rattrape pas facilement — c'est particulièrement vrai de la liquidation du régime matrimonial. C'est la raison pour laquelle le travail se concentre en amont de la signature.",
  },
  {
    question: "Que se passe-t-il si nous ne sommes pas d'accord sur un point ?",
    answer:
      "Le divorce sans juge repose entièrement sur l'accord des époux. Dès qu'un point reste en litige, il n'y a plus de convention possible et la voie judiciaire s'impose. Un désaccord ponctuel peut toutefois se négocier : c'est une part importante du travail des avocats.",
  },
  {
    question: "Et s'il y a un bien immobilier ?",
    answer:
      "Un état liquidatif établi par un notaire doit être annexé à la convention avant la signature. S'ajoutent alors les émoluments du notaire sur cet état et le droit de partage, de 1,10 % de l'actif net depuis le 1er janvier 2022.",
  },
  {
    question: "Le divorce sans juge est-il reconnu à l'étranger ?",
    answer:
      "Dans l'Union européenne, oui depuis le 1er août 2022, à condition de faire délivrer un certificat par le président du tribunal judiciaire. Hors de l'Union, cela dépend du pays : la question se pose dès lors que votre mariage y est transcrit, et elle doit être tranchée avant la signature, pas après.",
  },
];
