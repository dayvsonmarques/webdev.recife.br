import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'

interface ContactProps {
  eyebrow: string
  title: string
  text: string
  cta: string
  /** wa.me link; the button is hidden until a WhatsApp number is set in the admin. */
  whatsappHref: string | null
}

export function Contact({ eyebrow, title, text, cta, whatsappHref }: ContactProps) {
  return (
    <Section id="contato" tone="surface" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full blur-[90px]"
        style={{ background: 'radial-gradient(circle, var(--c-glow) 0%, transparent 70%)' }}
      />
      <Container className="relative flex flex-col gap-12">
        <SectionHeader eyebrow={eyebrow} title={title} intro={text} size="title" />
        <div className="flex flex-wrap gap-4">
          <ButtonLink href="/orcamento" arrow>
            Solicitar orçamento
          </ButtonLink>
          {whatsappHref && (
            <ButtonLink href={whatsappHref} variant="secondary">
              {cta}
            </ButtonLink>
          )}
        </div>
      </Container>
    </Section>
  )
}
