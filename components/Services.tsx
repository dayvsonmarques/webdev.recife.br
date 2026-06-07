'use client'

import { useInView } from '@/hooks/useInView'

const SERVICES = [
  {
    title: 'Loja Online',
    description: 'Para comércio físico que quer vender pela internet.',
  },
  {
    title: 'Cardápio Digital',
    description: 'Para restaurantes e lanchonetes sem depender de papel.',
  },
  {
    title: 'App de Agendamento',
    description: 'Para salões, clínicas e prestadores de serviço.',
  },
]

function ServiceCard({ title, description }: { title: string; description: string }) {
  return (
    <div
      className="p-8 transition-all duration-200 hover:-translate-y-1 cursor-default"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-accent)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)'
      }}
    >
      <h3
        className="font-syne text-xl font-bold mb-3"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {title}
      </h3>
      <p style={{ color: 'var(--color-text-muted)' }}>{description}</p>
    </div>
  )
}

export function Services() {
  const { ref, isInView } = useInView()

  return (
    <section
      id="servicos"
      ref={ref}
      className="py-24 px-6 md:px-12 lg:px-24 transition-all duration-700"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <h2
        className="font-syne text-3xl md:text-4xl font-bold mb-12"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Serviços
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {SERVICES.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </section>
  )
}
