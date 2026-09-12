import type { ServiceIconId } from '@/components/service-icons'
import type { PlanId } from '@/lib/plans'

export interface Service {
  slug: string
  icon: ServiceIconId
  title: string
  /** Short one-liner used on the homepage card. */
  summary: string
  /** Short subtitle used in the detail page hero. */
  tagline: string
  /** Longer "what it is" paragraph for the detail page. */
  description: string
  /** "Who it's for" paragraph for the detail page. */
  forWhom: string
  features: string[]
  /** Plan highlighted (with a "recomendado" badge) in the detail page's pricing grid. */
  recommendedPlan: PlanId
  /** Pre-filled WhatsApp message for the "test it" CTA. */
  whatsappMessage: string
}

export const SERVICES: Service[] = [
  {
    slug: 'loja-online',
    icon: 'bag',
    title: 'Loja Online',
    summary: 'Para comércio físico que quer vender pela internet.',
    tagline: 'Sua loja funcionando 24 horas, sem depender de ponto físico.',
    description:
      'Loja Online é o site de vendas do seu comércio: catálogo de produtos, carrinho e checkout, feito sob medida pro seu negócio — sem mensalidade de plataforma genérica nem limite de personalização.',
    forWhom:
      'Pra comércio físico — roupas, calçados, relojoaria, joalheria, ourives, comércio geral — que quer vender pela internet sem virar refém de marketplace.',
    features: [
      'Catálogo de produtos com fotos e ficha técnica',
      'Carrinho de compras e checkout integrado',
      'Painel pra você mesmo atualizar preço e estoque',
      'Design responsivo — funciona bem no celular',
      'Domínio próprio (.com.br)',
      'Certificado SSL (HTTPS) incluído',
    ],
    recommendedPlan: 'expert',
    whatsappMessage: 'Olá! Quero testar a Loja Online.',
  },
  {
    slug: 'cardapio-digital',
    icon: 'phone',
    title: 'Cardápio Digital',
    summary: 'Para restaurantes e lanchonetes sem depender de papel.',
    tagline: 'Cardápio sempre atualizado, sem gastar com reimpressão.',
    description:
      'Cardápio Digital é um site de cardápio pra restaurantes, lanchonetes, fruteiras e mercados: o cliente acessa pelo celular — com QR code na mesa ou no balcão — e vê preço e disponibilidade atualizados na hora, sem esperar o cardápio de papel ficar pronto de novo.',
    forWhom:
      'Pra quem vende comida ou tem preço e estoque que mudam com frequência: restaurantes, lanchonetes, fruteiras, mercados, comida congelada e pronta.',
    features: [
      'QR code pra acesso rápido pelo celular',
      'Atualização de preço e disponibilidade na hora',
      'Categorias e fotos dos produtos',
      'Botão de pedido direto pelo WhatsApp',
      'Aviso de item em falta sem precisar reimprimir nada',
      'Funciona bem mesmo com internet fraca',
    ],
    recommendedPlan: 'avancado',
    whatsappMessage: 'Olá! Quero testar o Cardápio Digital.',
  },
  {
    slug: 'agenda-facil',
    icon: 'calendar',
    title: 'Agenda Fácil',
    summary: 'Para salões, clínicas e prestadores de serviço.',
    tagline: 'Menos falta, mais horário ocupado — sem app complicado.',
    description:
      'Agenda Fácil é o sistema de agendamento pra quem vende horário: o cliente escolhe o serviço e o horário disponível sozinho, pelo celular, e você recebe a confirmação — sem trocar mensagem pra fechar cada agendamento.',
    forWhom:
      'Pra barbearia, salão de beleza, clínica odontológica, tatuador ou estúdio de tatuagem e qualquer prestador de serviço que agenda por horário.',
    features: [
      'Cliente marca o próprio horário, sem precisar ligar',
      'Confirmação automática via WhatsApp',
      'Agenda organizada por profissional e serviço',
      'Lembrete pro cliente, reduz falta',
      'Bloqueio de horário indisponível',
      'Histórico de agendamentos',
    ],
    recommendedPlan: 'avancado',
    whatsappMessage: 'Olá! Quero testar a Agenda Fácil.',
  },
]
