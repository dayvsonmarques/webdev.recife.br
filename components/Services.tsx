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

function ServiceCard({
  title,
  description,
  index,
}: {
  title: string
  description: string
  index: number
}) {
  return (
    <div
      className="p-8 flex flex-col gap-6 transition-all duration-200 hover:-translate-y-1 cursor-default"
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
      <span
        className="font-syne text-xs tracking-widest"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <div>
        <h3
          className="font-syne text-xl font-bold mb-3"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          {description}
        </p>
      </div>
    </div>
  )
}

export function Services() {
  const { ref, isInView } = useInView()

  return (
    <section
      id="servicos"
      ref={ref}
      className="py-24 transition-all duration-700"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        <p
          className="text-xs font-bold tracking-widest uppercase mb-4"
          style={{ color: 'var(--color-accent)' }}
        >
          O que fazemos
        </p>
        <h2
          className="font-syne text-3xl md:text-4xl font-bold mb-12"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Serviços
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.title} index={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  )
}
