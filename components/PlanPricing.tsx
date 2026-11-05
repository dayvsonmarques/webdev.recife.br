import { type IconId, icon } from '@/components/feature-icons'
import { cardClass } from '@/components/ui/Card'
import { formatPrice, type Plan } from '@/lib/content'

// Why the price goes up from one plan to the next, in plain words for the store owner.
const REASONS: { icon: IconId; title: string; text: string }[] = [
  {
    icon: 'image',
    title: 'Mais produtos, mais fotos',
    text: 'Cada foto fica guardada e abre rápido pro seu cliente. Uma loja com centenas de itens ocupa muito mais espaço que uma com poucos.',
  },
  {
    icon: 'chart',
    title: 'Mais vendas, mais pedidos',
    text: 'Vender sem limite é ter muitos pedidos, avisos e clientes ao mesmo tempo, sem a loja ficar lenta nos dias de movimento.',
  },
  {
    icon: 'card',
    title: 'Pix, cartão e frete',
    text: 'Receber pelo site e calcular o frete na hora usa serviços extras, que a gente configura e acompanha pra você.',
  },
  {
    icon: 'chat',
    title: 'Mais atenção pra sua loja',
    text: 'Quem vende mais precisa de resposta rápida. No Expert, um especialista cuida da loja com você, por isso o preço é combinado.',
  },
]

/** "Why the price goes up" block under the plan cards; with sales tiers it opens with the free → Básico → Avançado ladder. */
export function PlanPricing({ plans, tiers }: { plans: Plan[]; tiers?: { free: number; basic: number } }) {
  const [basic, advanced] = plans.filter((plan) => plan.price !== null)
  const ladder =
    tiers && basic && advanced
      ? [
          { price: 'Grátis', when: `vendendo até ${formatPrice(tiers.free)} por mês` },
          { price: `${formatPrice(basic.price!)}/mês`, when: `vendendo até ${formatPrice(tiers.basic)} por mês`, plan: basic.name },
          { price: `${formatPrice(advanced.price!)}/mês`, when: `vendendo mais de ${formatPrice(tiers.basic)} por mês`, plan: advanced.name },
        ]
      : null

  return (
    <div className={cardClass({ className: 'flex flex-col gap-10 p-7 md:p-10' })}>
      <div className="flex max-w-3xl flex-col gap-4">
        <h3 className="font-heading text-subheading font-bold text-ink">Por que o preço sobe de um plano pro outro?</h3>
        <p className="text-base text-muted">
          {ladder
            ? 'Você só paga quando a loja vende, e o preço só sobe quando suas vendas sobem. Junto com elas, cresce também o que a gente faz pela sua loja:'
            : 'Uma loja pequena, com poucos produtos e poucas vendas, usa pouco da nossa estrutura, por isso o Básico custa pouco. Quando a loja cresce, cresce também o que a gente faz por ela:'}
        </p>
      </div>
      {ladder && (
        <ol className="grid gap-4 md:grid-cols-3">
          {ladder.map((step, i) => (
            <li key={step.price} className="flex flex-col gap-1 rounded-md border border-line bg-bg p-5">
              <span className="text-eyebrow font-semibold uppercase tracking-[0.18em] text-gold">{step.plan ?? 'Teste'} · passo {i + 1}</span>
              <span className="font-heading text-xl font-extrabold text-ink">{step.price}</span>
              <span className="text-base text-muted">{step.when}</span>
            </li>
          ))}
        </ol>
      )}
      <ul className="grid gap-8 md:grid-cols-2">
        {REASONS.map((reason) => (
          <li key={reason.title} className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-surface-2 text-gold">{icon(reason.icon)}</span>
            <div className="flex flex-col gap-1 pt-2">
              <p className="font-heading text-lg font-bold text-ink">{reason.title}</p>
              <p className="text-base text-muted">{reason.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="border-t border-line pt-6 text-base text-ink">
        Comece no Básico e mude de plano quando sua loja crescer. Você paga pelo tamanho que ela tem hoje.
      </p>
    </div>
  )
}
