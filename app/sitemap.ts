import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'
import { getAllFiches } from '@/lib/fiches'

// `new Date()` faisait changer la date de TOUTES les URLs a chaque deploiement :
// Google apprend alors a ignorer le signal (audit SEO du 2026-08-15).
// Date de derniere refonte structurelle du site, a mettre a jour a la main.
const SITE_LAST_MODIFIED = new Date('2026-08-15')
 
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://fain-avocats.fr/actualites/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  const expertisePages = [
    'divorce',
    'garde-enfants',
    'pension-alimentaire',
    'liquidation-regime-matrimonial',
    'filiation-adoption',
    'droit-penal-famille',
    'annulation-mariage',
  ]

  const expertiseEntries: MetadataRoute.Sitemap = expertisePages.map((slug) => ({
    url: `https://fain-avocats.fr/${slug}`,
    lastModified: SITE_LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  const fichesPages = [
    'droit-de-la-famille',
    'le-couple',
    'les-enfants',
    'etat-civil',
  ]

  const fichesEntries: MetadataRoute.Sitemap = fichesPages.map((slug) => ({
    url: `https://fain-avocats.fr/${slug}`,
    lastModified: SITE_LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: 0.85,
  }))

  const fiches = getAllFiches()
  const ficheArticles: MetadataRoute.Sitemap = fiches.map((f) => ({
    url: `https://fain-avocats.fr/fiches/${f.slug}`,
    lastModified: SITE_LAST_MODIFIED,
    changeFrequency: 'yearly',
    priority: 0.7,
  }))

  return [
    {
      url: 'https://fain-avocats.fr',
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...expertiseEntries,
    ...fichesEntries,
    ...ficheArticles,
    {
      url: 'https://fain-avocats.fr/divorce-sans-juge',
      lastModified: new Date('2026-08-23'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://fain-avocats.fr/outils/simulateur-prestation-compensatoire',
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://fain-avocats.fr/consultations',
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://fain-avocats.fr/devis',
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://fain-avocats.fr/devis/divorce',
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://fain-avocats.fr/honoraires',
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://fain-avocats.fr/honoraires/droit-de-la-famille',
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://fain-avocats.fr/paiement',
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://fain-avocats.fr/fiches',
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: 'https://fain-avocats.fr/actualites',
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogEntries,
    {
      url: 'https://fain-avocats.fr/mentions-legales',
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://fain-avocats.fr/confidentialite',
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
