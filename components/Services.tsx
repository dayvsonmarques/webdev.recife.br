import { ButtonLink } from '@/components/ui/Button'
import { cardClass } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { CatalogItem } from '@/lib/content'

interface ServicesProps {
  eyebrow: string
  title: string
  intro: string
  catalog: CatalogItem[]
}

/** Custom work the studio does (admin → Serviços catalog). No prices: each job is quoted. */
export function Services({ eyebrow, title, intro, catalog }: ServicesProps) {
  if (catalog.length === 0) return null

  return (
    <Section id="servicos">
      <Container className="flex flex-col gap-16">
        <SectionHeader eyebrow={eyebrow} title={title} intro={intro} />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.map((item) => (
            <li key={item.id} className={cardClass({ className: 'flex flex-col gap-4 p-8 md:p-10' })}>
              <span aria-hidden="true" className="block h-1 w-10 rounded-pill bg-brand" />
              <h3 className="font-heading text-subheading font-bold text-ink">{item.name}</h3>
              {item.description && <p className="text-base text-muted">{item.description}</p>}
            </li>
          ))}
        </ul>
        <ButtonLink href="/orcamento" arrow className="self-start">
          Solicitar orçamento
        </ButtonLink>
      </Container>
    </Section>
  )
}
