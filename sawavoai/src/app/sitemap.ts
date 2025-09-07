import { MetadataRoute } from 'next'
import { productsService } from '@/services/productsService'
import { BlogService } from '@/services/blogService'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://Sawavo.com'
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
    '/terms',
    '/account',
    '/dashboard',
    '/checkout',
    '/login',
    '/signup'
  ]

  // Add static routes for both locales
  for (const locale of locales) {
    for (const route of staticRoutes) {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : route === '/products' || route === '/blog' || route === '/shop' ? 'daily' : route === '/skin-analysis' || route === '/routines' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : route === '/products' || route === '/shop' ? 0.9 : route === '/blog' || route === '/skin-analysis' ? 0.8 : route === '/about' || route === '/routines' ? 0.7 : 0.5,
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

  // Add blog routes
  try {
    const blogResult = await BlogService.getPosts({ 
      limit: 1000, // Get all published blog posts
      published: true
    })
    const blogPosts = blogResult.posts || []
    
    for (const post of blogPosts) {
      for (const locale of locales) {
        sitemap.push({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
          alternates: {
            languages: {
              en: `${baseUrl}/en/blog/${post.slug}`,
              ar: `${baseUrl}/ar/blog/${post.slug}`,
            },
          },
        })
      }
    }
  } catch (error) {
    console.error('Error generating blog sitemap entries:', error)
  }

  return sitemap
}