import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://www.fain-avocats.fr/actualites/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  const expertisePages = [
    'divorce',
    'garde-enfants',
    'pension-alimentaire',
    'patrimoine-successions',
  ]

  const expertiseEntries: MetadataRoute.Sitemap = expertisePages.map((slug) => ({
    url: `https://www.fain-avocats.fr/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  return [
    {
      url: 'https://www.fain-avocats.fr',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...expertiseEntries,
    {
      url: 'https://www.fain-avocats.fr/consultations',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.fain-avocats.fr/devis',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.fain-avocats.fr/devis/divorce',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.fain-avocats.fr/paiement',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://www.fain-avocats.fr/actualites',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogEntries,
    {
      url: 'https://www.fain-avocats.fr/mentions-legales',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://www.fain-avocats.fr/confidentialite',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
