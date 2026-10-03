'use client'

import { useInView } from '@/hooks/useInView'

interface AboutProps {
  eyebrow: string
  title: string
  text: string
  indicators: string[]
}

export function About({ eyebrow, title, text, indicators }: AboutProps) {
  const { ref, isInView } = useInView()

  return (
    <section
      id="sobre"
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
          style={{ color: 'var(--color-accent-text)' }}
        >
          {eyebrow}
        </p>

        <div className="max-w-2xl">
          <h2
            className="font-syne text-heading font-bold mb-8"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {title}
          </h2>

          <p
            className="text-lead mb-10"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {text}
          </p>

          {indicators.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {indicators.map((indicator) => (
              <span
                key={indicator}
                className="px-4 py-2 text-base"
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
          )}
        </div>
      </div>
    </section>
  )
}
