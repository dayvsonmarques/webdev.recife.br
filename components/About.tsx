import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'

interface AboutProps {
  eyebrow: string
  title: string
  text: string
  indicators: string[]
  /** Optional link under the text (the home links to the full /sobre page). */
  cta?: { href: string; label: string }
  /** h1 when About opens its own page (/sobre). */
  as?: 'h1' | 'h2'
}

export function About({ eyebrow, title, text, indicators, cta, as = 'h2' }: AboutProps) {
  return (
    <Section id="sobre" className={as === 'h1' ? 'pt-40' : undefined}>
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <SectionHeader eyebrow={eyebrow} title={title} as={as} />
        <div className="flex flex-col gap-10 lg:pt-14">
          <p className="text-lead text-muted">{text}</p>
          {indicators.length > 0 && (
            <ul className="flex flex-wrap gap-3">
              {indicators.map((indicator) => (
                <li key={indicator} className="rounded-pill border border-line bg-bg px-4 py-2 text-base text-muted">
                  {indicator}
                </li>
              ))}
            </ul>
          )}
          {cta && (
            <ButtonLink href={cta.href} variant="secondary" arrow className="self-start">
              {cta.label}
            </ButtonLink>
          )}
        </div>
      </Container>
    </Section>
  )
}
