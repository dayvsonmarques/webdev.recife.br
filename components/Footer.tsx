import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { NAV_LINKS } from '@/lib/nav-links'

const COLUMNS = [
  { title: 'Navegação', links: NAV_LINKS },
  {
    title: 'Fale com a gente',
    links: [
      { href: '/orcamento', label: 'Pedir orçamento' },
      { href: '/fale-conosco', label: 'Mandar mensagem' },
    ],
  },
  { title: 'Legal', links: [{ href: '/privacidade', label: 'Política de Privacidade' }] },
] as const

export function Footer({ text }: { text: string }) {
  return (
    <footer className="border-t border-line pt-20 pb-10">
      <Container className="flex flex-col gap-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-4">
            <Link href="/" className="w-fit whitespace-pre font-mono text-2xl font-bold tracking-tight text-ink" aria-label="Web Dev Recife — início">
              <span className="text-gold-ink">&lt; </span>
              webdev
              <span className="text-gold-ink"> /&gt;</span>
            </Link>
            <p className="max-w-xs text-base text-muted">Lojas online, cardápios digitais e sites para o comércio local de Recife.</p>
          </div>
          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-col gap-4">
              <p className="text-eyebrow font-semibold uppercase tracking-[0.18em] text-gold-ink">{column.title}</p>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-base text-muted transition-colors hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="border-t border-line pt-8 text-center text-sm text-muted">{text}</p>
      </Container>
    </footer>
  )
}
