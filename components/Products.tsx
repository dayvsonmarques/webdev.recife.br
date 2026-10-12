'use client'

import Link from 'next/link'
import { useInView } from '@/hooks/useInView'
import { PhoneVideo } from '@/components/PhoneVideo'
import { SERVICE_ICONS, type ServiceIconId } from '@/components/service-icons'
import type { Service } from '@/lib/content'

const SELLING_POINTS = ['Pronta para vender em poucos dias', 'Sem fidelidade: cancele quando quiser', 'Você cuida do negócio, a gente da tecnologia']

function FromPrice({ price, large = false }: { price: string; large?: boolean }) {
  return (
    <p style={{ color: 'var(--color-text-muted)' }} className={large ? 'text-base' : 'text-sm'}>
      a partir de{' '}
      <strong className={`font-heading font-extrabold ${large ? 'text-subheading' : 'text-lg'}`} style={{ color: 'var(--color-text-primary)' }}>
        {price}
      </strong>
      /mês
    </p>
  )
}

function ProductCard({
  slug,
  title,
  summary,
  icon,
  price,
}: {
  slug: string
  title: string
  summary: string
  icon: ServiceIconId
  price?: string
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
      {price && (
        <div className="mt-auto">
          <FromPrice price={price} />
        </div>
      )}
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
  /** Cheapest plan, formatted (e.g. "R$ 30"). */
  startingPrice?: string
}

/** Ready-made products sold by subscription (admin → Produtos SaaS); each has its own page. */
export function Products({ eyebrow, title, intro, services, featured, startingPrice }: ProductsProps) {
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
                className="relative p-8 border overflow-hidden shadow-sm"
                style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-surface)' }}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: 'var(--color-accent-2)' }}
                />
                <p
                  className="inline-flex items-center gap-2 text-eyebrow font-bold tracking-widest uppercase mb-3"
                  style={{ color: 'var(--color-accent-text)' }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-accent-2)' }} aria-hidden="true" />
                  Em destaque
                </p>
                <h3 className="font-heading text-subheading font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  {featured.title}
                </h3>
                <p className="text-lead font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                  Comece a vender online rápido e sem burocracia.
                </p>
                {startingPrice && (
                  <div className="mb-5">
                    <FromPrice price={startingPrice} large />
                  </div>
                )}
                <ul className="flex flex-col gap-2 mb-7">
                  {SELLING_POINTS.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-base" style={{ color: 'var(--color-text-muted)' }}>
                      <svg className="mt-1 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent-2)' }} aria-hidden="true">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                      {point}
                    </li>
                  ))}
                </ul>
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
              price={startingPrice}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
