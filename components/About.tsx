'use client'

import Link from 'next/link'
import { useInView } from '@/hooks/useInView'

interface AboutProps {
  eyebrow: string
  title: string
  text: string
  indicators: string[]
  /** Optional link under the text (the home links to the full /sobre page). */
  cta?: { href: string; label: string }
}

export function About({ eyebrow, title, text, indicators, cta }: AboutProps) {
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
            className="font-heading text-heading font-bold mb-8"
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
          {cta && (
            <Link
              href={cta.href}
              className="mt-10 inline-block px-8 py-4 font-heading font-bold text-base tracking-wide border transition-colors hover:border-[var(--color-accent-2)]"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', borderRadius: 'var(--radius-md)' }}
            >
              {cta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
