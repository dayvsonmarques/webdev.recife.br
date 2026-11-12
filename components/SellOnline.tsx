import { type IconId, icon } from '@/components/feature-icons'
import { cardClass } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'

// Why sell online, for the two kinds of small business owner we talk to.
const GROUPS: { title: string; items: [IconId, string][] }[] = [
  {
    title: 'Ainda não vende pela internet?',
    items: [
      ['clock', 'Sua loja aberta 24 horas, até com a porta fechada'],
      ['pin', 'Clientes de outras cidades e estados'],
      ['image', 'O cliente vê foto e preço sozinho, sem perguntar um por um'],
      ['list', 'Pedido chega organizado, com itens e endereço'],
      ['card', 'Receba por Pix e cartão, sem maquininha'],
      ['spark', 'Comece pequeno, sem gastar com estrutura'],
    ],
  },
  {
    title: 'Já tem loja online e quer trocar?',
    items: [
      ['tag', 'Preço fixo por mês, sem surpresa'],
      ['unlock', 'Sem fidelidade: cancele quando quiser'],
      ['chat', 'Atendimento de gente de verdade, pelo WhatsApp'],
      ['phone', 'Painel simples, que funciona no celular'],
      ['store', 'Loja com a cara da sua marca'],
      ['check', 'Teste antes de trocar, sem compromisso'],
    ],
  },
]

/** "Why sell online" block of the online store page. */
export function SellOnline() {
  return (
    <Section aria-label="Por que vender online">
      <Container className="flex flex-col gap-14">
        <SectionHeader eyebrow="Por que vender online" title="Mais vendas, menos trabalho" />
        <div className="grid gap-6 lg:grid-cols-2">
          {GROUPS.map((group) => (
            <div key={group.title} className={cardClass({ className: 'flex flex-col gap-7 p-7 md:p-10' })}>
              <h3 className="font-heading text-subheading font-bold text-ink">{group.title}</h3>
              <ul className="flex flex-col gap-5">
                {group.items.map(([id, text]) => (
                  <li key={text} className="flex items-start gap-4 text-base text-ink">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-surface-2 text-gold">{icon(id)}</span>
                    <span className="pt-2">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
