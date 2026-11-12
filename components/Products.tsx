import Link from 'next/link'
import { PhoneVideo } from '@/components/PhoneVideo'
import { SERVICE_ICONS, type ServiceIconId } from '@/components/service-icons'
import { ButtonLink } from '@/components/ui/Button'
import { cardClass } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { Service } from '@/lib/content'

const SELLING_POINTS = ['Teste grátis, sem cartão de crédito', 'Sem fidelidade: cancele quando quiser', 'Hospedagem, segurança e atualizações inclusas']

function FromPrice({ price, large = false }: { price: string; large?: boolean }) {
  return (
    <p className={large ? 'text-base text-muted' : 'text-sm text-muted'}>
      a partir de{' '}
      <strong className={large ? 'font-heading text-subheading font-extrabold text-ink' : 'font-heading text-xl font-extrabold text-ink'}>{price}</strong>
      /mês
    </p>
  )
}

function ProductCard({ slug, title, summary, icon }: { slug: string; title: string; summary: string; icon: ServiceIconId }) {
  return (
    <Link href={`/servicos/${slug}`} className={cardClass({ interactive: true, className: 'group flex flex-col gap-8 p-8 md:p-10' })}>
      <span className="flex h-16 w-16 items-center justify-center rounded-md bg-surface-2 text-accent-ink [&_svg]:h-9 [&_svg]:w-9">{SERVICE_ICONS[icon]}</span>
      <div className="flex flex-col gap-3">
        <h3 className="font-heading text-subheading font-bold text-ink">{title}</h3>
        <p className="text-base text-muted">{summary}</p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-6">
        <span className="text-sm font-semibold text-ink">Ver planos</span>
        <span aria-hidden="true" className="text-accent-ink transition-transform duration-200 group-hover:translate-x-1">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

function FeaturedCard({ product, price }: { product: Service; price?: string }) {
  return (
    <div className={cardClass({ className: 'relative flex flex-col gap-6 overflow-hidden p-6 sm:p-8 md:p-10' })}>
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
      <Eyebrow>Em destaque</Eyebrow>
      <div className="flex flex-col gap-3">
        <h3 className="font-heading text-subheading font-bold text-ink">{product.title}</h3>
        <p className="text-lead font-semibold text-ink">Sua loja online por assinatura. Sem instalar nada.</p>
      </div>
      {price && <FromPrice price={price} large />}
      <ul className="flex flex-col gap-3">
        {SELLING_POINTS.map((point) => (
          <li key={point} className="flex items-start gap-3 text-base text-muted">
            <svg className="mt-1.5 shrink-0 text-accent" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12l5 5L20 7" />
            </svg>
            {point}
          </li>
        ))}
      </ul>
      <ButtonLink href={`/servicos/${product.slug}`} arrow className="self-start">
        Ver planos e testar
      </ButtonLink>
    </div>
  )
}

const RENT_STEPS = [
  { title: 'Escolha o app', text: 'Já vem pronto.' },
  { title: 'Pague por mês', text: 'Sem fidelidade.' },
  { title: 'A gente cuida', text: 'Do site no ar ao suporte.' },
]

/** Plain-language explanation of the subscription model (avoids jargon like "SaaS"). */
function HowRentWorks() {
  return (
    <div className="flex flex-col gap-10 border-y border-line py-14">
      <div className="flex max-w-3xl flex-col gap-5">
        <Eyebrow>Como funciona</Eyebrow>
        <h3 className="font-heading text-heading font-bold text-ink">Você aluga o app, como quem aluga um ponto comercial.</h3>
        <p className="text-lead text-muted">Sem pagar caro pra construir. Você só paga a mensalidade.</p>
      </div>
      <ol className="grid gap-8 md:grid-cols-3">
        {RENT_STEPS.map((step, i) => (
          <li key={step.title} className="flex flex-col gap-3">
            <span className="font-heading text-subheading font-extrabold text-accent-ink">{String(i + 1).padStart(2, '0')}</span>
            <p className="text-lg font-semibold text-ink">{step.title}</p>
            <p className="text-base text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

interface ProductsProps {
  eyebrow: string
  title: string
  intro: string
  services: Service[]
  /** Product pitched next to the phone video (the video shows an online store). */
  featured?: Service
  /** Cheapest plan, formatted (e.g. "R$ 35"). */
  startingPrice?: string
}

/** Ready-made products sold by subscription (admin → Produtos SaaS); each has its own page. */
export function Products({ eyebrow, title, intro, services, featured, startingPrice }: ProductsProps) {
  return (
    <Section id="produtos">
      <Container className="flex flex-col gap-20">
        {featured ? (
          <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col gap-12">
              <SectionHeader eyebrow={eyebrow} title={title} intro={intro} />
              <FeaturedCard product={featured} price={startingPrice} />
            </div>
            <PhoneVideo />
          </div>
        ) : (
          <SectionHeader eyebrow={eyebrow} title={title} intro={intro} />
        )}

        <HowRentWorks />

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <ProductCard key={service.slug} slug={service.slug} title={service.title} summary={service.summary} icon={service.icon} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
