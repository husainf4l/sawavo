import { MetadataRoute } from 'next'
import { productsService } from '@/services/productsService'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skinior.com'
const locales = ['en', 'ar']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = []

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/products', 
    '/shop',
    '/blog',
    '/routines',
    '/skin-analysis',
    '/faq',
    '/privacy',
    '/terms'
  ]

  // Add static routes for both locales
  for (const locale of locales) {
    for (const route of staticRoutes) {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' || route === '/products' || route === '/blog' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : route === '/products' || route === '/blog' ? 0.9 : 0.7,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route}`,
            ar: `${baseUrl}/ar${route}`,
          },
        },
      })
    }
  }

  try {
    // Get ALL products for sitemap - use a large limit to get all products
    const result = await productsService.getProducts({ 
      limit: 10000, // Set a high limit to get all products
      isActive: true // Only include active products in sitemap
    })
    const products = result.products
    
    for (const product of products) {
      for (const locale of locales) {
        sitemap.push({
          url: `${baseUrl}/${locale}/products/${product.slug}`,
          lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: {
            languages: {
              en: `${baseUrl}/en/products/${product.slug}`,
              ar: `${baseUrl}/ar/products/${product.slug}`,
            },
          },
        })
      }
    }
  } catch (error) {
    console.error('Error generating product sitemap entries:', error)
  }

  // Add blog routes if blog service exists
  try {
    // This would be dynamically generated based on your blog posts
    // Add blog post URLs here when you have a blog service
  } catch (error) {
    console.error('Error generating blog sitemap entries:', error)
  }

  return sitemap
}