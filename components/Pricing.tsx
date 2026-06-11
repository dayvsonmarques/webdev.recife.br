'use client'

import { useInView } from '@/hooks/useInView'

function IconCheck() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16"
      fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="2 8 6 12 14 4" />
    </svg>
  )
}

const PLANS = [
  {
    name: 'Básico',
    price: 30,
    description: 'Para quem quer marcar presença online com o essencial.',
    featured: false,
    features: [
      'Site de 1 página',
      'Design responsivo (mobile)',
      'Hospedagem incluída',
      'Certificado SSL (HTTPS)',
      'Formulário de contato',
      'Suporte via WhatsApp',
    ],
  },
  {
    name: 'Avançado',
    price: 59,
    description: 'Para negócios que querem ir além e converter mais clientes.',
    featured: true,
    features: [
      'Site de até 5 páginas',
      'Cardápio digital ou agendamento',
      'Domínio personalizado (.com.br)',
      'Google Meu Negócio',
      'SEO básico',
      'Suporte prioritário',
    ],
  },
  {
    name: 'Expert',
    price: 109,
    description: 'Para quem quer vender online com estrutura completa.',
    featured: false,
    features: [
      'Páginas ilimitadas',
      'Loja virtual completa',
      'Integração WhatsApp + Instagram',
      'Painel de controle próprio',
      'Relatórios de acesso',
      'Suporte dedicado',
    ],
  },
]

function PlanCard({
  name,
  price,
  description,
  featured,
  features,
}: (typeof PLANS)[number]) {
  return (
    <div
      className="relative p-8 flex flex-col gap-8 transition-all duration-200 hover:-translate-y-1"
      style={{
        backgroundColor: featured ? 'var(--color-surface)' : 'var(--color-bg)',
        border: `1px solid ${featured ? 'var(--color-accent)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {featured && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold uppercase tracking-widest"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-accent-fg)',
            borderRadius: '999px',
          }}
        >
          Mais popular
        </div>
      )}

      <div>
        <p
          className="text-sm font-bold uppercase tracking-widest mb-4"
          style={{ color: featured ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
        >
          {name}
        </p>

        <div className="flex items-end gap-1 mb-3">
          <span
            className="text-sm font-medium"
            style={{ color: 'var(--color-text-muted)' }}
          >
            R$
          </span>
          <span
            className="font-syne text-5xl font-extrabold leading-none"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {price}
          </span>
          <span
            className="text-sm mb-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            /mês
          </span>
        </div>

        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {description}
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <span style={{ color: 'var(--color-accent)', flexShrink: 0 }}>
              <IconCheck />
            </span>
            <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <a
        href="#contato"
        className="mt-auto block text-center px-6 py-3 font-syne font-bold text-sm uppercase tracking-widest transition-opacity hover:opacity-80"
        style={
          featured
            ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)', borderRadius: 'var(--radius-md)' }
            : { border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', borderRadius: 'var(--radius-md)' }
        }
      >
        Começar agora
      </a>
    </div>
  )
}

export function Pricing() {
  const { ref, isInView } = useInView()

  return (
    <section
      id="planos"
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
          Investimento
        </p>
        <h2
          className="font-syne text-4xl md:text-5xl font-bold mb-4"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Planos
        </h2>
        <p
          className="text-xl mb-14 max-w-md"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Sem contrato de fidelidade. Cancele quando quiser.
        </p>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => (
            <PlanCard key={plan.name} {...plan} />
          ))}
        </div>
      </div>
    </section>
  )
}
