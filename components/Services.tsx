'use client'

import type { ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'

function IconBag() {
  return (
    <svg
      width="100" height="100" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M16 11V7a4 4 0 00-8 0v4" />
      <path d="M5 9h14l1 12H4L5 9z" />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg
      width="100" height="100" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="12" y2="16" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg
      width="100" height="100" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" strokeWidth="0" />
      <circle cx="8" cy="16" r="1.5" fill="currentColor" strokeWidth="0" opacity="0.4" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" strokeWidth="0" opacity="0.4" />
    </svg>
  )
}

const SERVICES: Array<{ title: string; description: string; icon: ReactNode }> = [
  {
    title: 'Loja Online',
    description: 'Para comércio físico que quer vender pela internet.',
    icon: <IconBag />,
  },
  {
    title: 'Cardápio Digital',
    description: 'Para restaurantes e lanchonetes sem depender de papel.',
    icon: <IconPhone />,
  },
  {
    title: 'Agenda Fácil',
    description: 'Para salões, clínicas e prestadores de serviço.',
    icon: <IconCalendar />,
  },
]

function ServiceCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: ReactNode
}) {
  return (
    <div
      className="p-14 flex flex-col items-center text-center gap-6 transition-all duration-200 hover:-translate-y-1 cursor-default"
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
      <div style={{ color: 'var(--color-accent)' }}>{icon}</div>

      <div>
        <h3
          className="font-syne text-5xl font-bold mb-3"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {title.split(' ').map((word) => (
            <span key={word} className="block">
              {word}
            </span>
          ))}
        </h3>
        <p className="text-xl leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
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
      className="py-28 transition-all duration-700"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        <p
          className="text-sm font-bold tracking-widest uppercase mb-4"
          style={{ color: 'var(--color-accent)' }}
        >
          O que fazemos
        </p>
        <h2
          className="font-syne text-5xl md:text-6xl font-bold mb-6"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Serviços
        </h2>
        <p
          className="text-xl md:text-2xl leading-relaxed mb-14 max-w-xl"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Lojas online, cardápios digitais e apps de agendamento para negócios locais. Rápido de entregar, fácil de usar.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  )
}
