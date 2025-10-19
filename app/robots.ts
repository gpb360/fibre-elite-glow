import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/checkout/', '/cart/', '/account/'],
    },
    sitemap: 'https://lbve.ca/sitemap.xml',
  }
}