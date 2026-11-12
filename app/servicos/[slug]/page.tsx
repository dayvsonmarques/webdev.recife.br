import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { iconFor } from '@/components/feature-icons'
import { PlanCard } from '@/components/PlanCard'
import { PlanPricing } from '@/components/PlanPricing'
import { SERVICE_ICONS } from '@/components/service-icons'
import { PanelVideo } from '@/components/PanelVideo'
import { ProductGallery } from '@/components/ProductGallery'
import { SellOnline } from '@/components/SellOnline'
import { ButtonLink } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getSiteContent, offerLine, whatsappLink } from '@/lib/content'
import { PANEL_VIDEOS, PRODUCT_GALLERIES } from '@/lib/product-gallery'
import { pageMetadata } from '@/lib/seo'
import { SITE_URL } from '@/lib/site-url'
import { SALES_TIERS, STORE_DOMAIN, TRIAL_PRODUCTS, trialHref } from '@/lib/trial'

const STEPS = [
  { title: 'Peça seu teste', text: 'Conte sobre seu negócio. A gente cria sua loja e manda o acesso por e-mail.' },
  { title: 'Cadastre seus produtos', text: 'Fotos, preços e estoque, direto do celular.' },
  { title: 'Divulgue e venda', text: 'Mande o link pros clientes e receba os pedidos.' },
]
const WHATSAPP_STEPS = [{ title: 'Chame no WhatsApp', text: 'A gente cria sua loja e te manda o acesso.' }, ...STEPS.slice(1)]

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

  // Products on the stores app get a trial request form; the others (and "a combinar" plans) go to
  // WhatsApp. Until a WhatsApp number is set in the admin, those point to the contact section.
  const hasTrial = TRIAL_PRODUCTS.has(service.slug)
  const whatsapp = (message: string) => whatsappLink(config.whatsappNumber, message) ?? '/#contato'
  const ctaHref = hasTrial ? trialHref(service.slug) : whatsapp(service.whatsappMessage)
  const tiers = SALES_TIERS[service.slug]
  const ctaLabel = config.trialDays > 0 ? `Testar grátis por ${config.trialDays} dias` : 'Quero testar'
  const offer = offerLine(plans, config.trialDays)
  const pricingIntro = `${config.trialDays > 0 ? `${config.trialDays} dias grátis para testar. ` : ''}${config.pricingNote}`
  const planHref = (plan: { slug: string; name: string; price: number | null }) =>
    plan.price === null
      ? whatsapp(`Oi! Vi ${service.title} no site e quero saber mais do plano ${plan.name}.`)
      : hasTrial
        ? trialHref(service.slug, plan.slug)
        : whatsapp(`Oi! Vi ${service.title} no site e quero testar o plano ${plan.name}. Como começo?`)
  const steps = hasTrial ? STEPS : WHATSAPP_STEPS
  const panelVideo = PANEL_VIDEOS[service.slug]
  // Short comma-separated list → icon chips; a longer sentence stays as text.
  const audience = service.forWhom.split(/\s*,\s*/)
  const audienceAsChips = audience.length > 1 && audience.every((item) => item.length <= 24)

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
            areaServed: { '@type': 'Country', name: 'Brasil' },
            provider: { '@type': 'ProfessionalService', name: 'Web Dev Recife', url: SITE_URL },
            ...(plans.length > 0 && {
              offers: plans.filter((plan) => plan.price !== null).map((plan) => ({
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
            <Link href="/#produtos" className="-my-3 py-3 text-eyebrow font-semibold uppercase tracking-[0.18em] text-accent-ink hover:underline">
              ← Apps
            </Link>
            <span className="flex h-20 w-20 items-center justify-center rounded-lg border border-line bg-surface text-accent-ink [&_svg]:h-11 [&_svg]:w-11">
              {SERVICE_ICONS[service.icon]}
            </span>
            <h1 className="font-heading text-display font-extrabold tracking-[-0.03em] text-ink">{service.title}</h1>
            <p className="max-w-2xl text-lead text-muted">{service.tagline}</p>
            <p className="flex flex-wrap gap-x-2 rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink sm:rounded-pill sm:text-base">
              {offer.split(' · ').map((part, i) => (
                <span key={part} className="whitespace-nowrap">
                  {i > 0 && <span className="mr-2 text-muted" aria-hidden="true">·</span>}
                  {part}
                </span>
              ))}
            </p>
            <div className="flex w-full flex-wrap gap-3 pt-2 sm:w-auto sm:gap-4">
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
          <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div className="flex flex-col gap-6 lg:sticky lg:top-32 lg:self-start">
              <Eyebrow>Vantagens</Eyebrow>
              <h2 className="font-heading text-title font-extrabold tracking-[-0.03em] text-ink">
                Tudo já vem <span className="text-accent-ink">pronto.</span>
              </h2>
            </div>
            <ul className="flex flex-col border-t border-line">
              {service.features.map((feature) => (
                <li key={feature} className="group flex items-center gap-5 border-b border-line py-6 md:gap-7 md:py-7">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-pill bg-surface-2 text-accent-ink transition-colors duration-200 group-hover:bg-ink group-hover:text-bg [&_svg]:h-6 [&_svg]:w-6">
                    {iconFor(feature)}
                  </span>
                  <span className="font-heading text-2xl font-bold leading-tight tracking-[-0.01em] text-ink md:text-3xl">{feature}</span>
                </li>
              ))}
            </ul>
          </Container>
        </Section>

        <Section tone="surface">
          <Container className="flex flex-col gap-12">
            <div className="flex flex-col gap-6">
              <Eyebrow>Pra quem é</Eyebrow>
              <h2 className="font-heading text-heading font-extrabold tracking-[-0.03em] text-ink">{service.summary}</h2>
            </div>
            {audienceAsChips && (
              <ul className="flex flex-wrap gap-3 md:gap-4">
                {audience.map((item) => (
                  <li key={item} className="flex items-center gap-3 rounded-pill border border-line bg-bg px-6 py-4 font-heading text-lg font-bold text-ink md:text-xl [&_svg]:h-6 [&_svg]:w-6 [&_svg]:text-accent-ink">
                    {iconFor(item, 'store')}
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </Container>
        </Section>

        {service.slug === 'loja-online' && <SellOnline />}

        {panelVideo && <PanelVideo clip={panelVideo} />}

        {PRODUCT_GALLERIES[service.slug] && <ProductGallery gallery={PRODUCT_GALLERIES[service.slug]} />}

        <Section id="planos">
          <Container className="flex flex-col gap-16">
            <SectionHeader
              eyebrow={config.pricingEyebrow}
              title={config.pricingTitle}
              intro={pricingIntro}
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
                  ctaHref={planHref(plan)}
                  ctaLabel={plan.price === null ? 'Falar com a gente' : 'Quero testar'}
                />
              ))}
            </div>
            <PlanPricing plans={plans} tiers={tiers} />
          </Container>
        </Section>

        <Section tone="surface">
          <Container className="flex flex-col gap-14">
            <SectionHeader title="Como começar" />
            <ol className="grid gap-6 md:grid-cols-3">
              {steps.map((step, i) => (
                <li key={step.title} className="flex flex-col gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-pill bg-accent font-heading text-xl font-extrabold text-on-accent">{i + 1}</span>
                  <p className="font-heading text-lg font-bold text-ink">{step.title}</p>
                  <p className="text-base text-muted">{step.text}</p>
                </li>
              ))}
            </ol>
          </Container>
        </Section>

        <Section>
          <Container className="flex flex-col items-start gap-10">
            <h2 className="max-w-3xl font-heading text-title font-extrabold text-ink">Pronto pra testar {service.title}?</h2>
            {hasTrial && (
              <p className="-mt-4 max-w-2xl wrap-anywhere text-lead text-muted">
                Conte sobre seu negócio e a gente libera uma loja de teste em seunegocio.{STORE_DOMAIN}.
              </p>
            )}
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
