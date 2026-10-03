import type { ServiceIconId } from '@/components/service-icons'

/** Content served by the admin at GET /api/public/site (admin: src/lib/site/public-content.ts). */
export interface SiteContent {
  updatedAt: string
  config: {
    seoTitle: string
    seoDescription: string
    heroTitle: string
    heroHighlight: string
    heroSubtitle: string
    heroCta: string
    servicesEyebrow: string
    servicesTitle: string
    servicesIntro: string
    pricingEyebrow: string
    pricingTitle: string
    pricingNote: string
    aboutEyebrow: string
    aboutTitle: string
    aboutText: string
    aboutIndicators: string[]
    contactEyebrow: string
    contactTitle: string
    contactText: string
    contactCta: string
    whatsappNumber: string | null
    footerText: string
  }
  plans: Plan[]
  services: Service[]
}

export interface Plan {
  slug: string
  name: string
  price: number
  description: string
  featured: boolean
  features: string[]
}

export interface Service {
  slug: string
  icon: ServiceIconId
  title: string
  summary: string
  tagline: string
  description: string
  forWhom: string
  features: string[]
  recommendedPlan: string | null
  whatsappMessage: string
}

export const CONTENT_TAG = 'site-content'

/**
 * Cached until the admin calls /api/revalidate after an edit. If the admin is
 * unreachable at runtime, Next keeps serving the last good render.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const base = process.env.ADMIN_API_URL
  if (!base) throw new Error('ADMIN_API_URL is not set — the site reads its content from the admin API.')

  const res = await fetch(`${base.replace(/\/$/, '')}/api/public/site`, {
    cache: 'force-cache',
    next: { tags: [CONTENT_TAG] },
  })
  if (!res.ok) throw new Error(`Admin content API responded ${res.status}`)
  return res.json()
}

/** wa.me link, or null while no WhatsApp number is configured in the admin. */
export function whatsappLink(number: string | null, message?: string) {
  if (!number) return null
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}
