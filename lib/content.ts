import type { ServiceIconId } from '@/components/service-icons'

/** Content served by the admin at GET /api/public/site (admin: src/lib/site/public-content.ts). */
export interface SiteContent {
  updatedAt: string
  config: {
    seoTitle: string
    seoDescription: string
    heroSlides: HeroSlide[]
    servicesEyebrow: string
    servicesTitle: string
    servicesIntro: string
    productsEyebrow: string
    productsTitle: string
    productsIntro: string
    pricingEyebrow: string
    pricingTitle: string
    pricingNote: string
    /** Free-trial length in days; 0 = no trial. */
    trialDays: number
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
  /** Custom-work catalog (admin → Serviços), active items only. */
  catalog: CatalogItem[]
  plans: Plan[]
  /** Ready-made subscription products (admin → Produtos SaaS). */
  services: Service[]
}

/** Banner carousel slide; highlight is shown in the accent color right after the title. */
export interface HeroSlide {
  title: string
  highlight?: string
  subtitle?: string
}

export interface CatalogItem {
  id: number
  name: string
  description: string | null
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

  const url = `${base.replace(/\/$/, '')}/api/public/site`
  let res: Response
  try {
    res = await fetch(url, { cache: 'force-cache', next: { tags: [CONTENT_TAG] } })
  } catch (error) {
    // Most common in local dev: the panel isn't running. Say so instead of a bare "fetch failed".
    throw new Error(
      `Não consegui buscar o conteúdo em ${url}. O painel está rodando? ` +
        'Em desenvolvimento use `pnpm dev:all` (sobe banco, painel e site).',
      { cause: error },
    )
  }
  if (!res.ok) throw new Error(`O painel respondeu ${res.status} em ${url}.`)
  const data = (await res.json()) as SiteContent
  // Tolerate a panel deployed before a field existed (and stale cached payloads).
  return { ...data, catalog: data.catalog ?? [], config: { ...data.config, trialDays: data.config.trialDays ?? 0, heroSlides: data.config.heroSlides ?? [] } }
}

/** wa.me link, or null while no WhatsApp number is configured in the admin. */
export function whatsappLink(number: string | null, message?: string) {
  if (!number) return null
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}

/** Cheapest visible plan, for "a partir de" messages; null when no plan is published. */
export function startingPrice(plans: Plan[]) {
  return plans.length ? Math.min(...plans.map((p) => p.price)) : null
}

/** "R$ 30" or "R$ 30,90" (Brazilian format, cents only when present). */
export function formatPrice(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
  })
}

/** Short offer line, e.g. "7 dias grátis · A partir de R$ 30/mês · Sem fidelidade". */
export function offerLine(plans: Plan[], trialDays: number) {
  const from = startingPrice(plans)
  return [trialDays > 0 && `${trialDays} dias grátis`, from !== null && `A partir de ${formatPrice(from)}/mês`, 'Sem fidelidade']
    .filter(Boolean)
    .join(' · ')
}
