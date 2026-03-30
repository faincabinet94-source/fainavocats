/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
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
    ];
  },
}

module.exports = nextConfig
