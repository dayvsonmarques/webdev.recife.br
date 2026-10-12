'use client'

import Link from 'next/link'
import { useInView } from '@/hooks/useInView'
import { PhoneVideo } from '@/components/PhoneVideo'
import { SERVICE_ICONS, type ServiceIconId } from '@/components/service-icons'
import type { Service } from '@/lib/content'

function ProductCard({
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
      <div style={{ color: 'var(--color-accent-text)' }}>{SERVICE_ICONS[icon]}</div>

      <div>
        <h3
          className="font-heading text-subheading font-bold mb-3"
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

interface ProductsProps {
  eyebrow: string
  title: string
  intro: string
  services: Service[]
  /** Product pitched next to the phone video (the video shows an online store). */
  featured?: Service
}

/** Ready-made products sold by subscription (admin → Produtos SaaS); each has its own page. */
export function Products({ eyebrow, title, intro, services, featured }: ProductsProps) {
  const { ref, isInView } = useInView()

  return (
    <section
      id="produtos"
      ref={ref}
      className="py-28 transition-all duration-700"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        <div className={featured ? 'grid lg:grid-cols-2 gap-14 items-center mb-20' : ''}>
          <div>
            <p
              className="text-eyebrow font-bold tracking-widest uppercase mb-4"
              style={{ color: 'var(--color-accent-text)' }}
            >
              {eyebrow}
            </p>
            <h2
              className="font-heading text-heading font-bold mb-6"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {title}
            </h2>
            <p
              className={`text-lead max-w-xl ${featured ? 'mb-8' : 'mb-14'}`}
              style={{ color: 'var(--color-text-muted)' }}
            >
              {intro}
            </p>
            {featured && (
              <div
                className="p-8 border"
                style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-surface)' }}
              >
                <p className="text-eyebrow font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--color-accent-text)' }}>
                  Em destaque
                </p>
                <h3 className="font-heading text-subheading font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  {featured.title}
                </h3>
                <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--color-text-muted)' }}>
                  {featured.tagline}
                </p>
                <Link
                  href={`/servicos/${featured.slug}`}
                  className="inline-block px-6 py-3 font-heading font-bold text-base transition-opacity hover:opacity-90"
                  style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)', borderRadius: 'var(--radius-md)' }}
                >
                  Conheça a {featured.title}
                </Link>
              </div>
            )}
          </div>
          {featured && <PhoneVideo />}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => (
            <ProductCard
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
