/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Liquidation du régime matrimonial : ancienne page patrimoine-successions
      // et variante plurielle → URL canonique /liquidation-regime-matrimonial
      {
        source: '/patrimoine-successions',
        destination: '/liquidation-regime-matrimonial',
        permanent: true,
      },
      {
        source: '/liquidation-regimes-matrimoniaux',
        destination: '/liquidation-regime-matrimonial',
        permanent: true,
      },
      // Articles déplacés d'Actualités vers Compétence (fiche liquidation)
      {
        source: '/actualites/pret-commun-indemnite-occupation-neutraliser-creance-divorce',
        destination: '/fiches/pret-commun-indemnite-occupation-neutraliser-creance-divorce',
        permanent: true,
      },
      {
        source: '/actualites/partage-2eme-pilier-suisse-divorce',
        destination: '/fiches/partage-2eme-pilier-suisse-divorce',
        permanent: true,
      },
      // Doublons et slugs horodates corriges (audit SEO du 2026-08-15)
      {
        source: '/actualites/recompense-communaute-valeurs-mobilieres-divorce',
        destination: '/fiches/recompense-communaute-valeurs-mobilieres-divorce',
        permanent: true,
      },
      {
        source: '/actualites/creance-concubin-refection-toiture-droits-recours-1780773629662',
        destination: '/actualites/creance-concubin-refection-toiture-droits-recours',
        permanent: true,
      },
      {
        source: '/actualites/domicile-conjugal-divorce-droits-obligations-1780771227228',
        destination: '/actualites/domicile-conjugal-divorce-droits-obligations',
        permanent: true,
      },
      // Anciennes URLs Squarespace → nouvelles URLs
      {
        source: '/devis-avocat-divorce',
        destination: '/devis/divorce',
        permanent: true,
      },
      {
        source: '/honoraires-droit-de-la-famille',
        destination: '/honoraires/droit-de-la-famille',
        permanent: true,
      },
      {
        source: '/avocat-droit-de-la-famille',
        destination: '/droit-de-la-famille',
        permanent: true,
      },
      {
        source: '/consultation-avocat-en-ligne',
        destination: '/consultations',
        permanent: true,
      },
      {
        source: '/consultation-avocat-en-ligne-divorce',
        destination: '/consultations',
        permanent: true,
      },
      {
        source: '/famille/:path*',
        destination: '/fiches',
        permanent: true,
      },
      {
        source: '/droit-de-la-famille/divorce',
        destination: '/divorce',
        permanent: true,
      },
      {
        source: '/droit-de-la-famille/pension-alimentaire',
        destination: '/pension-alimentaire',
        permanent: true,
      },
      {
        source: '/droit-de-la-famille/garde-enfants',
        destination: '/garde-enfants',
        permanent: true,
      },
      {
        source: '/droit-de-la-famille/bareme-pension-alimentaire-2011.html',
        destination: '/fiches/pension-alimentaire-enfants',
        permanent: true,
      },
      {
        source: '/presse',
        destination: '/actualites',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/#contact',
        permanent: true,
      },
      // Anciennes URLs Squarespace (404 Search Console) -> equivalents actuels
      {
        source: '/actualites/divorce-consentement-mutuel-audience-juge',
        destination: '/actualites/divorce-sans-juge-le-nouveau-divorce-par-consentement-mutuel',
        permanent: true,
      },
      {
        source: '/actualites/droit-de-la-famille/la-prestation-compensatoire-na-pas-pour-objet-de-corriger-les-effets-du-choix-du-regime-de-la-separation-de-biens.html',
        destination: '/fiches/condition-attribution-prestation-compensatoire',
        permanent: true,
      },
      {
        source: '/actualites/droit-de-la-famille/pension-alimentaire-bareme-2013.html',
        destination: '/fiches/pension-alimentaire-enfants',
        permanent: true,
      },
      {
        source: '/actualites/droit-de-la-famille/futurs-maries-reflechissez-bien.html',
        destination: '/actualites/futurs-maries-reflechissez-bien-fain-avocats',
        permanent: true,
      },
      {
        source: '/actualites/divorce-sans-juge-le-nouveau-divorce-par-consentement-mutuel-est-arriv.html',
        destination: '/actualites/divorce-sans-juge-le-nouveau-divorce-par-consentement-mutuel',
        permanent: true,
      },
      {
        source: '/actualites/droit-de-la-famille/divorce-attention-a-belle-maman.html',
        destination: '/actualites/divorce-attention-a-belle-maman-fain-avocats',
        permanent: true,
      },
      {
        source: '/actualites/droit-de-la-famille/les-divorces-ne-financeront-plus-la-baisse-de-lisf.html',
        destination: '/fiches/cout-procedure-divorce',
        permanent: true,
      },
      {
        source: '/actualites/droit-de-la-famille/divorce-labstinence-sexuelle-peut-couter-cher.html',
        destination: '/actualites/divorce-l-abstinence-sexuelle-peut-couter-cher-fain-avocats',
        permanent: true,
      },
      {
        source: '/actualites/droit-de-la-famille/adultere-evitez-la-saint-valentin.html',
        destination: '/actualites/adultere-interdit-le-jour-de-la-saint-valentin-fain-avocats',
        permanent: true,
      },
      {
        source: '/actualites/droit-de-la-famille/bareme-pension-alimentaire-2011.html',
        destination: '/fiches/pension-alimentaire-enfants',
        permanent: true,
      },
      {
        source: '/actualites/droit-de-la-famille/adaptation-droit-visite-aux-horaires-travail-pere.html',
        destination: '/actualites/l-adaptation-du-droit-de-visite-aux-horaires-de-travail-du-pere',
        permanent: true,
      },
      {
        source: '/actualites/droit-de-la-famille/prestation-compensatoire-nouveaux-criteres-de-fixation.html',
        destination: '/fiches/calcul-prestation-compensatoire',
        permanent: true,
      },
      {
        source: '/actualites/droit-de-la-famille/droit-garde-reconnu-compagne-homosexuelle.html',
        destination: '/actualites/droit-de-garde-reconnu-a-la-compagne-homosexuelle-fain-avocats',
        permanent: true,
      },
      {
        source: '/actualites/droit-de-la-famille/prestation-compensatoire-allocation-tierce-personne.html',
        destination: '/fiches/prestation-compensatoire',
        permanent: true,
      },
      {
        source: '/actualites/droit-de-la-famille/annulation-mariage-escort-girl.html',
        destination: '/actualites/annulation-du-mariage-d-une-escort-girl-fain-avocats',
        permanent: true,
      },
      {
        source: '/actualites/droit-de-la-famille/divorce-faute-preuve-sms.html',
        destination: '/actualites/divorce-pour-faute-cas-pertinents',
        permanent: true,
      },
      {
        source: '/actualites/droit-de-la-famille/le-prenom-titeuf-contraire-a-linteret-de-lenfant.html',
        destination: '/actualites/le-prenom-titeuf-contraire-a-l-interet-de-l-enfant-fain-avocats',
        permanent: true,
      },
      {
        source: '/actualites/droit-de-la-famille/le-bien-propre-dun-epoux-peut-etre-attribue-a-titre-de-prestation-compensatoire.html',
        destination: '/fiches/formes-prestation-compensatoire',
        permanent: true,
      },
      {
        source: '/actualites/droit-de-la-famille/prestation-compensatoire-et-modalites-de-versement.html',
        destination: '/fiches/formes-prestation-compensatoire',
        permanent: true,
      },
      {
        source: '/actualites/droit-de-la-famille/prestation-compensatoire-vie-commune-duree-mariage.html',
        destination: '/fiches/condition-attribution-prestation-compensatoire',
        permanent: true,
      },
      {
        source: '/actualites/droit-de-la-famille/divorces-maries-pacses-fin-de-la-triple-declaration-de-revenus.html',
        destination: '/fiches/divorce-impots',
        permanent: true,
      },
      {
        source: '/formulaire-separation-corps',
        destination: '/fiches/separation-corps-procedure',
        permanent: true,
      },
      {
        source: '/modification-de-ltat-civil',
        destination: '/etat-civil',
        permanent: true,
      },
      {
        source: '/droit-de-la-famille/le-couple',
        destination: '/le-couple',
        permanent: true,
      },
      {
        source: '/plan-du-site',
        destination: '/',
        permanent: true,
      },
      {
        source: '/presse-1',
        destination: '/actualites',
        permanent: true,
      },
      {
        source: '/accueil',
        destination: '/',
        permanent: true,
      },
      {
        source: '/paiement-en-ligne-fain-avocats',
        destination: '/paiement',
        permanent: true,
      },
      {
        source: '/mentions-lgales',
        destination: '/mentions-legales',
        permanent: true,
      },
      {
        source: '/formulaire-de-renseignements-rc',
        destination: '/consultations',
        permanent: true,
      },
      {
        source: '/dernires-actualits',
        destination: '/actualites',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
