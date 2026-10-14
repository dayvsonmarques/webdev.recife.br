import type { MetadataRoute } from 'next'
import { getSiteContent } from '@/lib/content'
import { SITE_URL } from '@/lib/site-url'

const STATIC_ROUTES = ['/', '/sobre', '/orcamento', '/fale-conosco', '/privacidade']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { services, updatedAt } = await getSiteContent()

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: updatedAt,
  }))

  const serviceEntries = services.map((service) => ({
    url: `${SITE_URL}/servicos/${service.slug}`,
    lastModified: updatedAt,
  }))

  return [...staticEntries, ...serviceEntries]
}
