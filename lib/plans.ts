export interface Plan {
  id: 'basico' | 'avancado' | 'expert'
  name: string
  price: number
  description: string
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

/** Every valid plan id, derived from `PLANS` itself so it can't drift out of sync. */
export type PlanId = (typeof PLANS)[number]['id']
