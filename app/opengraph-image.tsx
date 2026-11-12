import { getSiteContent, offerLine } from '@/lib/content'
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og'

export const alt = 'Web Dev Recife — Apps prontos pro seu negócio'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

/** Site-wide link preview; pageMetadata points every page here unless it passes its own image. */
export default async function Image() {
  const { config, plans } = await getSiteContent()
  return ogImage({
    eyebrow: 'Apps por assinatura',
    title: 'Apps prontos pro seu negócio.',
    subtitle: 'Loja online, cardápio digital e agendamentos.',
    pills: offerLine(plans, config.trialDays).split(' · '),
  })
}
