'use client'

import { useInView } from '@/hooks/useInView'

const INDICATORS = ['Recife, PE', 'MEI', 'Desde 2024']

export function About() {
  const { ref, isInView } = useInView()

  return (
    <section
      id="sobre"
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
          O estúdio
        </p>

        <div className="max-w-2xl">
          <h2
            className="font-syne text-3xl md:text-4xl font-bold mb-8"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Sobre
          </h2>

          <p
            className="text-lg leading-relaxed mb-10"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Web Dev Recife é um estúdio independente de desenvolvimento web com foco em comércio
            local. Cada projeto é acompanhado de perto — sem enrolação, com entrega ágil e suporte
            real. O objetivo é simples: uma solução que funciona de verdade pro seu negócio.
          </p>

          <div className="flex flex-wrap gap-3">
            {INDICATORS.map((indicator) => (
              <span
                key={indicator}
                className="px-4 py-2 text-sm"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-muted)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                {indicator}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
