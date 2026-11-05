import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { TrialForm } from '@/components/TrialForm'
import { iconFor } from '@/components/feature-icons'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getSiteContent } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'
import { STORE_DOMAIN, TRIAL_PRODUCTS } from '@/lib/trial'

const PROMISES = ['Loja pronta pra você mexer', 'Sem cartão de crédito', 'Sem compromisso']

export async function generateMetadata({ params }: PageProps<'/servicos/[slug]/testar'>): Promise<Metadata> {
  const { slug } = await params
  const { services } = await getSiteContent()
  const service = services.find((s) => s.slug === slug)
  if (!service || !TRIAL_PRODUCTS.has(slug)) return {}
  return pageMetadata({
    title: `Testar ${service.title} — Web Dev Recife`,
    description: `Conte sobre seu negócio e receba uma loja de teste em seunegocio.${STORE_DOMAIN}.`,
    path: `/servicos/${slug}/testar`,
  })
}

export default async function TrialPage({ params, searchParams }: PageProps<'/servicos/[slug]/testar'>) {
  const { slug } = await params
  const { plano } = await searchParams
  const { config, services, plans } = await getSiteContent()
  const service = services.find((s) => s.slug === slug)
  if (!service || !TRIAL_PRODUCTS.has(slug)) notFound()

  // "A combinar" plans are talked through on WhatsApp, not tested.
  const testable = plans.filter((p) => p.price !== null).map(({ slug, name }) => ({ slug, name }))
  const defaultPlan = testable.find((p) => p.slug === plano)?.slug ?? service.recommendedPlan ?? undefined

  return (
    <>
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none pb-section pt-40">
        <Container narrow>
          <Link href={`/servicos/${slug}`} className="-my-3 mb-8 inline-block py-3 text-eyebrow font-semibold uppercase tracking-[0.18em] text-accent-ink hover:underline">
            ← {service.title}
          </Link>
          <SectionHeader
            as="h1"
            eyebrow={`Testar ${service.title}`}
            title="Peça sua loja de teste"
            intro={`Conte um pouco do seu negócio. A gente libera uma loja de teste em seunegocio.${STORE_DOMAIN} pra você cadastrar produtos e ver como fica${config.trialDays > 0 ? ` — ${config.trialDays} dias grátis` : ''}.`}
          />
          <ul className="mb-16 mt-8 flex flex-wrap gap-3">
            {PROMISES.map((item) => (
              <li key={item} className="flex items-center gap-2 rounded-pill border border-line px-4 py-2 text-sm font-medium text-ink [&_svg]:h-5 [&_svg]:w-5 [&_svg]:text-gold">
                {iconFor(item, 'check')}
                {item}
              </li>
            ))}
          </ul>
          <TrialForm product={slug} plans={testable} defaultPlan={typeof defaultPlan === 'string' ? defaultPlan : undefined} />
        </Container>
      </main>
      <Footer text={config.footerText} />
    </>
  )
}
