import { type IconId, icon } from '@/components/feature-icons'
import { cardClass } from '@/components/ui/Card'
import { formatPrice, type Plan } from '@/lib/content'

// Why the price goes up from one plan to the next, in as few words as possible.
const REASONS: { icon: IconId; title: string; text: string }[] = [
  { icon: 'image', title: 'Mais produtos', text: 'Mais fotos guardadas.' },
  { icon: 'chart', title: 'Mais pedidos', text: 'Loja rápida mesmo lotada.' },
  { icon: 'card', title: 'Pix, cartão e frete', text: 'A gente configura.' },
  { icon: 'chat', title: 'Mais atenção', text: 'Especialista no Expert.' },
]

/** "Why the price goes up" block under the plan cards; with sales tiers it opens with the Básico → Avançado → Expert ladder. */
export function PlanPricing({ plans, tiers }: { plans: Plan[]; tiers?: { basic: number; advanced: number } }) {
  const [basic, advanced] = plans.filter((plan) => plan.price !== null)
  const custom = plans.find((plan) => plan.price === null)
  const ladder =
    tiers && basic && advanced
      ? [
          { plan: basic.name, price: formatPrice(basic.price!), per: '/mês', when: `Vendas até ${formatPrice(tiers.basic)}/mês` },
          { plan: advanced.name, price: formatPrice(advanced.price!), per: '/mês', when: `Vendas até ${formatPrice(tiers.advanced)}/mês` },
          ...(custom
            ? [{ plan: custom.name, price: custom.priceFrom ? `A partir de ${formatPrice(custom.priceFrom)}` : 'A combinar', per: custom.priceFrom ? '/mês' : '', when: `Vendas acima de ${formatPrice(tiers.advanced)}/mês` }]
            : []),
        ]
      : null

  return (
    <div className={cardClass({ className: 'flex flex-col gap-12 p-7 md:p-12' })}>
      <div className="flex flex-col gap-4">
        <h3 className="font-heading text-heading font-extrabold tracking-[-0.03em] text-ink">
          Por que o preço <span className="text-accent-ink">sobe?</span>
        </h3>
        <p className="text-lead text-muted">Sua loja cresce. A gente faz mais por ela.</p>
      </div>

      {ladder && (
        <ol className="grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-3">
          {ladder.map((step, i) => (
            <li key={step.plan} className="relative flex flex-col gap-3 bg-bg p-6 md:p-8">
              <span className="text-eyebrow font-semibold uppercase tracking-[0.18em] text-gold">
                {String(i + 1).padStart(2, '0')} · {step.plan}
              </span>
              <span className="font-heading text-subheading font-extrabold tracking-[-0.02em] text-ink">
                {step.price}
                {step.per && <span className="text-lg font-semibold text-muted">{step.per}</span>}
              </span>
              <span className="text-base text-muted">{step.when}</span>
              {i < ladder.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-4 left-1/2 z-10 flex h-8 w-8 -translate-x-1/2 rotate-90 items-center justify-center rounded-pill border border-line bg-bg text-accent-ink md:-right-4 md:bottom-auto md:left-auto md:top-1/2 md:translate-x-0 md:-translate-y-1/2 md:rotate-0"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ol>
      )}

      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map((reason) => (
          <li key={reason.title} className="flex flex-col gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-pill bg-surface-2 text-gold">{icon(reason.icon)}</span>
            <p className="font-heading text-xl font-bold text-ink">{reason.title}</p>
            <p className="text-base text-muted">{reason.text}</p>
          </li>
        ))}
      </ul>

      <p className="border-t border-line pt-8 font-heading text-xl font-bold text-ink md:text-2xl">
        Comece no Básico. Mude quando crescer.
      </p>
    </div>
  )
}
