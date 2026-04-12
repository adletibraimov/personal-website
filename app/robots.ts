import { MetadataRoute } from 'next'

const siteUrl = 'https://adletibraimov.cv'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}