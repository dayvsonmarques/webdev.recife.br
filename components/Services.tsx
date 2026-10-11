'use client'

import { useInView } from '@/hooks/useInView'
import type { CatalogItem } from '@/lib/content'

interface ServicesProps {
  eyebrow: string
  title: string
  intro: string
  catalog: CatalogItem[]
}

/** Custom work the studio does (admin → Serviços catalog). No prices: each job is quoted. */
export function Services({ eyebrow, title, intro, catalog }: ServicesProps) {
  const { ref, isInView } = useInView()
  if (catalog.length === 0) return null

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
        <p className="text-eyebrow font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-accent-text)' }}>
          {eyebrow}
        </p>
        <h2 className="font-syne text-heading font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </h2>
        <p className="text-lead mb-14 max-w-xl" style={{ color: 'var(--color-text-muted)' }}>
          {intro}
        </p>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 p-8 border border-[var(--color-border)]"
              style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}
            >
              <span aria-hidden="true" className="block h-1 w-10 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }} />
              <h3 className="font-syne text-subheading font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {item.name}
              </h3>
              {item.description && (
                <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {item.description}
                </p>
              )}
            </li>
          ))}
        </ul>

        <a
          href="#contato"
          className="mt-12 inline-block px-8 py-4 font-syne font-bold text-base tracking-wide transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)', borderRadius: 'var(--radius-md)' }}
        >
          Pedir orçamento
        </a>
      </div>
    </section>
  )
}
