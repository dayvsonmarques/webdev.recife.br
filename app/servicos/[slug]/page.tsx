import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PlanCard, IconCheck } from '@/components/PlanCard'
import { SERVICE_ICONS } from '@/components/service-icons'
import { getSiteContent, whatsappLink } from '@/lib/content'

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

  return {
    title: `${service.title} — Web Dev Recife`,
    description: service.tagline,
  }
}

export default async function ServicePage({
  params,
}: PageProps<'/servicos/[slug]'>) {
  const { slug } = await params
  const { config, services, plans } = await getSiteContent()
  const service = services.find((s) => s.slug === slug)
  if (!service) notFound()

  // Until a WhatsApp number is set in the admin, CTAs point to the contact section.
  const whatsappHref = whatsappLink(config.whatsappNumber, service.whatsappMessage)
  const ctaProps = whatsappHref
    ? { href: whatsappHref, target: '_blank', rel: 'noopener noreferrer' }
    : { href: '/#contato' }

  return (
    <>
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">

        <section className="min-h-screen flex flex-col justify-center pt-28 pb-20">
          <div className="max-w-6xl mx-auto w-full px-6 md:px-8 lg:px-12">
            <Link
              href="/#servicos"
              className="inline-block text-eyebrow font-bold tracking-widest uppercase mb-8"
              style={{ color: 'var(--color-accent-text)' }}
            >
              ← Serviços
            </Link>

            <div className="mb-8" style={{ color: 'var(--color-accent-text)' }}>
              {SERVICE_ICONS[service.icon]}
            </div>

            <h1
              className="font-syne text-display font-extrabold leading-[1.05] mb-6"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {service.title}
            </h1>

            <p
              className="text-lead mb-10 max-w-2xl"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {service.tagline}
            </p>

            <a
              {...ctaProps}
              className="inline-block px-8 py-4 font-syne font-bold text-base tracking-wide transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-accent-fg)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              Testar grátis
            </a>
          </div>
        </section>

        <section className="py-28">
          <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
            <p
              className="text-eyebrow font-bold tracking-widest uppercase mb-4"
              style={{ color: 'var(--color-accent-text)' }}
            >
              O que é
            </p>
            <p
              className="text-lead mb-10 max-w-2xl"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {service.description}
            </p>
            <p
              className="text-eyebrow font-bold tracking-widest uppercase mb-4"
              style={{ color: 'var(--color-accent-text)' }}
            >
              Pra quem é
            </p>
            <p
              className="text-lead max-w-2xl"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {service.forWhom}
            </p>
          </div>
        </section>

        <section className="py-28" style={{ backgroundColor: 'var(--color-surface)' }}>
          <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
            <h2
              className="font-syne text-heading font-bold mb-10"
              style={{ color: 'var(--color-text-primary)' }}
            >
              O que está incluso
            </h2>
            <ul className="grid md:grid-cols-2 gap-5">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <span style={{ color: 'var(--color-accent-text)', flexShrink: 0 }}>
                    <IconCheck />
                  </span>
                  <span className="text-base" style={{ color: 'var(--color-text-primary)' }}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-28">
          <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
            <p
              className="text-eyebrow font-bold tracking-widest uppercase mb-4"
              style={{ color: 'var(--color-accent-text)' }}
            >
              {config.pricingEyebrow}
            </p>
            <h2
              className="font-syne text-heading font-bold mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {config.pricingTitle}
            </h2>
            <p className="text-lead mb-14 max-w-md" style={{ color: 'var(--color-text-muted)' }}>
              {config.pricingNote}
            </p>
            <div className="grid md:grid-cols-3 gap-6 items-start">
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
          </div>
        </section>

        <section className="py-32" style={{ backgroundColor: 'var(--color-surface)' }}>
          <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
            <h2
              className="font-syne text-title font-extrabold leading-tight mb-6 max-w-xl"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Pronto pra começar com {service.title}?
            </h2>
            <a
              {...ctaProps}
              className="inline-block px-8 py-4 font-syne font-bold text-base tracking-wide transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-accent-fg)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              Testar grátis
            </a>
          </div>
        </section>

      </main>

      <Footer text={config.footerText} />
    </>
  )
}
