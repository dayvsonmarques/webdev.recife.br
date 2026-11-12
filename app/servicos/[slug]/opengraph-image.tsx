import { notFound } from 'next/navigation'
import { getSiteContent, offerLine } from '@/lib/content'
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og'

export const alt = 'App da Web Dev Recife'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export async function generateStaticParams() {
  const { services } = await getSiteContent()
  return services.map(({ slug }) => ({ slug }))
}

/** Link preview of each app page (set via pageMetadata on the app and /testar pages). */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { config, plans, services } = await getSiteContent()
  const service = services.find((s) => s.slug === slug)
  if (!service) notFound()
  return ogImage({
    eyebrow: 'App por assinatura',
    title: service.title,
    subtitle: service.tagline,
    pills: offerLine(plans, config.trialDays).split(' · '),
  })
}
