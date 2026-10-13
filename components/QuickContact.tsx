import { ButtonLink } from '@/components/ui/Button'
import { cardClass } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'

/** Lightweight alternative to the full quote form — just send a message. */
export function QuickContact() {
  return (
    <Section aria-label="Contato rápido" className="!py-20">
      <Container>
        <div className={cardClass({ className: 'flex flex-col items-start justify-between gap-8 p-8 md:flex-row md:items-center md:p-12' })}>
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-subheading font-bold text-ink">Prefere só mandar uma mensagem?</h2>
            <p className="max-w-xl text-base text-muted">Sem compromisso — conta o que você precisa e a gente te responde rapidinho.</p>
          </div>
          <ButtonLink href="/fale-conosco" variant="secondary" arrow className="shrink-0">
            Enviar mensagem
          </ButtonLink>
        </div>
      </Container>
    </Section>
  )
}
