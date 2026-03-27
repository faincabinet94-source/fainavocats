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

  return [
    {
      url: 'https://www.fain-avocats.fr',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
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
