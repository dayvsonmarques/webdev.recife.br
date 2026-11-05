import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { NAV_LINKS } from '@/lib/nav-links'
import { Logo } from '@/components/Logo'
import { InstagramLink } from '@/components/InstagramLink'

const COLUMNS = [
  { title: 'Navegação', links: NAV_LINKS },
  {
    title: 'Fale com a gente',
    links: [
      { href: '/orcamento', label: 'Solicitar orçamento' },
      { href: '/fale-conosco', label: 'Mandar mensagem' },
    ],
  },
  { title: 'Legal', links: [{ href: '/privacidade', label: 'Política de Privacidade' }] },
] as const

export function Footer({ text }: { text: string }) {
  return (
    <footer className="border-t border-line pt-20 pb-10">
      <Container className="flex flex-col gap-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Link href="/" className="w-fit text-[1.75rem]" aria-label="Web Dev Recife — início">
              <Logo />
            </Link>
            <p className="max-w-xs text-base text-muted">Lojas online, cardápios digitais e sites para o comércio local de Recife.</p>
            <InstagramLink className="-mt-1 w-fit" />
          </div>
          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-col gap-4">
              <p className="text-eyebrow font-semibold uppercase tracking-[0.24em] text-gold">{column.title}</p>
              <ul className="-mt-2 flex flex-col">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="inline-flex min-h-11 items-center text-base text-muted transition-colors hover:text-ink">
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
