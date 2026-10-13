import { ButtonLink } from '@/components/ui/Button'
import { cn } from '@/components/ui/cn'

export function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="2 8 6 12 14 4" />
    </svg>
  )
}

export function PlanCard({
  name,
  price,
  description,
  features,
  highlighted,
  badgeLabel = 'Mais popular',
}: {
  name: string
  price: number
  description: string
  features: string[]
  highlighted: boolean
  badgeLabel?: string
}) {
  return (
    <div
      className={cn(
        'relative flex flex-col gap-8 rounded-lg border p-8 transition-transform duration-300 hover:-translate-y-1 md:p-10',
        highlighted ? 'border-gold bg-surface shadow-lift' : 'border-line bg-bg shadow-card',
      )}
    >
      {highlighted && (
        <span className="absolute -top-3.5 left-8 rounded-pill bg-gold px-4 py-1 text-sm font-bold text-[#0A0A0A]">{badgeLabel}</span>
      )}

      <div className="flex flex-col gap-4">
        <p className={cn('text-eyebrow font-semibold uppercase tracking-[0.18em]', highlighted ? 'text-gold-ink' : 'text-muted')}>{name}</p>
        <p className="flex items-baseline gap-1.5 text-muted">
          <span className="text-base font-medium">R$</span>
          <span className="font-heading text-heading font-extrabold leading-none tracking-tight text-ink">{price.toLocaleString('pt-BR')}</span>
          <span className="text-base">/mês</span>
        </p>
        <p className="text-base text-muted">{description}</p>
      </div>

      <ul className="flex flex-col gap-3.5 border-t border-line pt-8">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-base text-ink">
            <span className="mt-1 shrink-0 text-gold-ink">
              <IconCheck />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <ButtonLink href="/orcamento" variant={highlighted ? 'primary' : 'secondary'} arrow className="mt-auto w-full">
        Começar agora
      </ButtonLink>
    </div>
  )
}
