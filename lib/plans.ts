export interface Plan {
  id: 'basico' | 'avancado' | 'expert'
  name: string
  /** Monthly price in BRL, shown as "R${price}/mês". */
  price: number
  description: string
  /** Whether this plan gets the "Mais popular" badge on the homepage Planos section. */
  featured: boolean
  features: string[]
}

export const PLANS: Plan[] = [
  {
    id: 'basico',
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
    id: 'avancado',
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
    id: 'expert',
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

/**
 * Every valid plan id. This is a re-export of `Plan['id']`, not a separate
 * hand-written union — adding a plan to `PLANS` first requires widening this
 * type, which then immediately propagates to anything typed against it (e.g.
 * `Service.recommendedPlan` in `lib/services.ts`).
 */
export type PlanId = Plan['id']
