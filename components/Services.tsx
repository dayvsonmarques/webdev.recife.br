'use client'

import Link from 'next/link'
import { useInView } from '@/hooks/useInView'
import { SERVICE_ICONS, type ServiceIconId } from '@/components/service-icons'
import { SERVICES } from '@/lib/services'

function ServiceCard({
  slug,
  title,
  summary,
  icon,
}: {
  slug: string
  title: string
  summary: string
  icon: ServiceIconId
}) {
  return (
    <Link
      href={`/servicos/${slug}`}
      className="p-14 flex flex-col items-center text-center gap-6 border border-[var(--color-border)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-accent)] focus-visible:border-[var(--color-accent)]"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div style={{ color: 'var(--color-accent)' }}>{SERVICE_ICONS[icon]}</div>

      <div>
        <h3
          className="font-syne text-subheading font-bold mb-3"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {title.split(' ').map((word) => (
            <span key={word} className="block">
              {word}
            </span>
          ))}
        </h3>
        <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          {summary}
        </p>
      </div>
    </Link>
  )
}

export function Services() {
  const { ref, isInView } = useInView()

  return (
    <section
      id="servicos"
      ref={ref}
      className="py-28 transition-all duration-700"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        <p
          className="text-eyebrow font-bold tracking-widest uppercase mb-4"
          style={{ color: 'var(--color-accent)' }}
        >
          O que fazemos
        </p>
        <h2
          className="font-syne text-heading font-bold mb-6"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Serviços
        </h2>
        <p
          className="text-lead mb-14 max-w-xl"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Lojas online, cardápios digitais e apps de agendamento para negócios locais. Rápido de entregar, fácil de usar.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.slug}
              slug={service.slug}
              title={service.title}
              summary={service.summary}
              icon={service.icon}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
