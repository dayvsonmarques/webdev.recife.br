import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PlanCard, IconCheck } from '@/components/PlanCard'
import { SERVICE_ICONS } from '@/components/service-icons'
import { ProductGallery } from '@/components/ProductGallery'
import { ButtonLink } from '@/components/ui/Button'
import { cardClass } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getSiteContent, offerLine, whatsappLink } from '@/lib/content'
import { PRODUCT_GALLERIES } from '@/lib/product-gallery'
import { pageMetadata } from '@/lib/seo'
import { SITE_URL } from '@/lib/site-url'

export async function generateStaticParams() {
  const { services } = await getSiteContent()
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/servicos/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const { services } = await getSiteContent()
  const service = services.find((s) => s.slug === slug)
  if (!service) return {}

  return pageMetadata({
    title: `${service.title} — Web Dev Recife`,
    description: service.tagline,
    path: `/servicos/${service.slug}`,
  })
}

export default async function ServicePage({
  params,
}: PageProps<'/servicos/[slug]'>) {
  const { slug } = await params
  const { config, services, plans } = await getSiteContent()
  const service = services.find((s) => s.slug === slug)
  if (!service) notFound()

  // Until a WhatsApp number is set in the admin, CTAs point to the contact section.
  const ctaHref = whatsappLink(config.whatsappNumber, service.whatsappMessage) ?? '/#contato'
  const ctaLabel = config.trialDays > 0 ? `Testar grátis por ${config.trialDays} dias` : 'Quero contratar'

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: service.title,
            name: service.title,
            description: service.description,
            url: `${SITE_URL}/servicos/${service.slug}`,
            areaServed: { '@type': 'City', name: 'Recife' },
            provider: { '@type': 'ProfessionalService', name: 'Web Dev Recife', url: SITE_URL },
            ...(plans.length > 0 && {
              offers: plans.map((plan) => ({
                '@type': 'Offer',
                name: plan.name,
                price: plan.price,
                priceCurrency: 'BRL',
                url: `${SITE_URL}/servicos/${service.slug}#planos`,
              })),
            }),
          }),
        }}
      />
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <section className="relative flex min-h-[80svh] flex-col justify-center overflow-hidden pb-20 pt-36">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 top-10 h-[34rem] w-[34rem] rounded-full blur-[90px]"
            style={{ background: 'radial-gradient(circle, var(--c-glow) 0%, transparent 70%)' }}
          />
          <Container className="relative flex flex-col items-start gap-8">
            <Link href="/#produtos" className="text-eyebrow font-semibold uppercase tracking-[0.18em] text-gold-ink hover:underline">
              ← Produtos
            </Link>
            <span className="flex h-20 w-20 items-center justify-center rounded-lg border border-line bg-surface text-gold-ink [&_svg]:h-11 [&_svg]:w-11">
              {SERVICE_ICONS[service.icon]}
            </span>
            <h1 className="font-heading text-display font-extrabold tracking-[-0.03em] text-ink">{service.title}</h1>
            <p className="max-w-2xl text-lead text-muted">{service.tagline}</p>
            <p className="rounded-pill border border-gold/50 px-4 py-2 text-base font-semibold text-ink">{offerLine(plans, config.trialDays)}</p>
            <div className="flex flex-wrap gap-4 pt-2">
              <ButtonLink href={ctaHref} arrow>
                {ctaLabel}
              </ButtonLink>
              <ButtonLink href="#planos" variant="secondary">
                Ver planos
              </ButtonLink>
            </div>
          </Container>
        </section>

        <Section>
          <Container className="grid gap-6 md:grid-cols-2">
            <div className={cardClass({ className: 'flex flex-col gap-5 p-8 md:p-12' })}>
              <Eyebrow>O que é</Eyebrow>
              <p className="text-lead text-ink">{service.description}</p>
            </div>
            <div className={cardClass({ className: 'flex flex-col gap-5 p-8 md:p-12' })}>
              <Eyebrow>Pra quem é</Eyebrow>
              <p className="text-lead text-muted">{service.forWhom}</p>
            </div>
          </Container>
        </Section>

        <Section tone="surface">
          <Container className="flex flex-col gap-14">
            <SectionHeader title="O que está incluso" />
            <ul className="grid gap-x-10 gap-y-5 md:grid-cols-2">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-4 border-b border-line pb-5 text-base text-ink">
                  <span className="mt-1 shrink-0 text-gold-ink">
                    <IconCheck />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </Container>
        </Section>

        {PRODUCT_GALLERIES[service.slug] && <ProductGallery gallery={PRODUCT_GALLERIES[service.slug]} />}

        <Section id="planos">
          <Container className="flex flex-col gap-16">
            <SectionHeader
              eyebrow={config.pricingEyebrow}
              title={config.pricingTitle}
              intro={`${config.trialDays > 0 ? `${config.trialDays} dias grátis para testar. ` : ''}${config.pricingNote}`}
            />
            <div className="grid items-start gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.slug}
                  name={plan.name}
                  price={plan.price}
                  description={plan.description}
                  features={plan.features}
                  highlighted={plan.slug === service.recommendedPlan}
                  badgeLabel="Recomendado"
                />
              ))}
            </div>
          </Container>
        </Section>

        <Section tone="surface">
          <Container className="flex flex-col items-start gap-10">
            <h2 className="max-w-3xl font-heading text-title font-extrabold text-ink">Pronto pra começar com {service.title}?</h2>
            <ButtonLink href={ctaHref} arrow>
              {ctaLabel}
            </ButtonLink>
          </Container>
        </Section>
      </main>

      <Footer text={config.footerText} />
    </>
  )
}
