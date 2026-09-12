import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PlanCard, IconCheck } from '@/components/Pricing'
import { SERVICE_ICONS } from '@/components/service-icons'
import { SERVICES } from '@/lib/services'
import { PLANS } from '@/lib/plans'

export async function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/servicos/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const service = SERVICES.find((s) => s.slug === slug)
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
  const service = SERVICES.find((s) => s.slug === slug)
  if (!service) notFound()

  const whatsappHref = `https://wa.me/55?text=${encodeURIComponent(service.whatsappMessage)}`

  return (
    <main>
      <Header />

      <section className="min-h-screen flex flex-col justify-center pt-28 pb-20">
        <div className="max-w-6xl mx-auto w-full px-6 md:px-8 lg:px-12">
          <Link
            href="/#servicos"
            className="inline-block text-sm font-bold tracking-widest uppercase mb-8"
            style={{ color: 'var(--color-accent)' }}
          >
            ← Serviços
          </Link>

          <div className="mb-8" style={{ color: 'var(--color-accent)' }}>
            {SERVICE_ICONS[service.icon]}
          </div>

          <h1
            className="font-syne text-5xl md:text-7xl font-extrabold leading-[1.05] mb-6"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {service.title}
          </h1>

          <p
            className="text-xl md:text-2xl leading-relaxed mb-10 max-w-2xl"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {service.tagline}
          </p>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
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
            className="text-sm font-bold tracking-widest uppercase mb-4"
            style={{ color: 'var(--color-accent)' }}
          >
            O que é
          </p>
          <p
            className="text-xl md:text-2xl leading-relaxed mb-10 max-w-2xl"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {service.description}
          </p>
          <p
            className="text-sm font-bold tracking-widest uppercase mb-4"
            style={{ color: 'var(--color-accent)' }}
          >
            Pra quem é
          </p>
          <p
            className="text-lg leading-relaxed max-w-2xl"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {service.forWhom}
          </p>
        </div>
      </section>

      <section className="py-28" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
          <h2
            className="font-syne text-4xl md:text-5xl font-bold mb-10"
            style={{ color: 'var(--color-text-primary)' }}
          >
            O que está incluso
          </h2>
          <ul className="grid md:grid-cols-2 gap-5">
            {service.features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <span style={{ color: 'var(--color-accent)', flexShrink: 0 }}>
                  <IconCheck />
                </span>
                <span className="text-lg" style={{ color: 'var(--color-text-primary)' }}>
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
            className="text-sm font-bold tracking-widest uppercase mb-4"
            style={{ color: 'var(--color-accent)' }}
          >
            Investimento
          </p>
          <h2
            className="font-syne text-4xl md:text-5xl font-bold mb-14"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Planos
          </h2>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                name={plan.name}
                price={plan.price}
                description={plan.description}
                features={plan.features}
                highlighted={plan.id === service.recommendedPlan}
                badgeLabel="Recomendado"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-32" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
          <h2
            className="font-syne text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 max-w-xl"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Pronto pra começar com {service.title}?
          </h2>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
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

      <Footer />
    </main>
  )
}
