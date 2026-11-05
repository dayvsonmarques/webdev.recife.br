'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/lib/nav-links'
import { Logo } from '@/components/Logo'
import { InstagramLink } from '@/components/InstagramLink'
import { ThemeToggle } from '@/components/ThemeToggle'
import { buttonClass } from '@/components/ui/Button'
import { cn } from '@/components/ui/cn'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

/** Bars icon that turns into an X: same three-bar button in the header (closed) and in the menu (open). */
export function MenuIcon({ open }: { open: boolean }) {
  const bar = 'absolute left-0 block h-0.5 w-full rounded-full bg-current transition-[transform,opacity,top] duration-300 ease-out'
  return (
    <span className="relative block h-4 w-6" aria-hidden="true">
      <span className={cn(bar, open ? 'top-[7px] rotate-45' : 'top-0')} />
      <span className={cn(bar, 'top-[7px]', open && 'opacity-0')} />
      <span className={cn(bar, open ? 'top-[7px] -rotate-45' : 'top-[14px]')} />
    </span>
  )
}

/** Full-screen navigation for phones and tablets (below lg). */
export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()

  // Trava a rolagem da página por trás (html e body, para o iOS também).
  useEffect(() => {
    const root = document.documentElement
    root.style.overflow = isOpen ? 'hidden' : ''
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      root.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Fecha sozinho se a tela crescer para o layout de desktop com o menu aberto.
  useEffect(() => {
    if (!isOpen) return
    const desktop = window.matchMedia('(min-width: 1024px)')
    const onChange = () => desktop.matches && onClose()
    desktop.addEventListener('change', onChange)
    return () => desktop.removeEventListener('change', onChange)
  }, [isOpen, onClose])

  // Ao abrir: foco no botão de fechar, Esc fecha e o Tab fica preso dentro do menu.
  useEffect(() => {
    if (!isOpen) return
    // Espera o menu deixar de ser inert/invisível antes de mover o foco.
    const frame = requestAnimationFrame(() => closeRef.current?.focus())
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose()
      if (e.key !== 'Tab' || !dialogRef.current) return
      const items = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button')
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onClose])

  // Entrada em cascata dos itens; some sem atraso ao fechar.
  const reveal = (i: number) => ({
    transform: isOpen ? 'none' : 'translateY(12px)',
    opacity: isOpen ? 1 : 0,
    transitionDelay: isOpen ? `${80 + i * 50}ms` : '0ms',
  })

  return (
    <div
      ref={dialogRef}
      id="menu-mobile"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navegação"
      inert={!isOpen}
      className={cn(
        'fixed inset-0 z-[60] flex flex-col overflow-y-auto overscroll-contain bg-bg duration-300 lg:hidden',
        // Abre já visível (o foco precisa entrar no 1º quadro); ao fechar, some depois do fade.
        isOpen ? 'visible opacity-100 transition-opacity' : 'invisible opacity-0 transition-[opacity,visibility]',
      )}
    >
      {/* Mesma barra do topo do site: o logo e o botão não "pulam" ao abrir. */}
      <div className="mx-auto flex w-full max-w-container items-center gap-3 border-b border-line px-6 py-4 md:px-10">
        <Link href="/" onClick={onClose} className="mr-auto flex min-h-11 items-center text-[1.75rem]" aria-label="Web Dev Recife — início">
          <Logo />
        </Link>
        <ThemeToggle />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="-mr-2.5 flex h-11 w-11 items-center justify-center text-ink"
          aria-label="Fechar menu"
        >
          <MenuIcon open={isOpen} />
        </button>
      </div>

      <nav className="mx-auto w-full max-w-container flex-1 px-6 pt-4 md:px-10" aria-label="Navegação principal">
        <ul>
          {NAV_LINKS.map((link, i) => {
            const current = link.href === pathname
            return (
              <li key={link.href} className="border-b border-line transition-[transform,opacity] duration-300 ease-out" style={reveal(i)}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  aria-current={current ? 'page' : undefined}
                  className="group flex min-h-[4.5rem] items-center gap-5 py-3"
                >
                  <span className="w-7 font-heading text-sm font-medium tabular-nums text-accent-ink">{String(i + 1).padStart(2, '0')}</span>
                  <span className={cn('font-heading text-subheading font-bold transition-colors', current ? 'text-ink' : 'text-ink/85 group-hover:text-ink')}>
                    {link.label}
                  </span>
                  {current && <span className="h-1.5 w-1.5 rounded-pill bg-accent" aria-hidden="true" />}
                  <svg className="ml-auto text-muted transition-transform duration-200 group-hover:translate-x-1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Ações sempre ao alcance do polegar, respeitando a área segura do iPhone. */}
      <div
        className="mx-auto flex w-full max-w-container flex-col gap-3 px-6 pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] transition-[transform,opacity] duration-300 ease-out sm:flex-row md:px-10"
        style={reveal(NAV_LINKS.length)}
      >
        <Link href="/orcamento" onClick={onClose} className={buttonClass({ className: 'w-full sm:w-auto sm:flex-1' })}>
          Solicitar orçamento
        </Link>
        <Link href="/fale-conosco" onClick={onClose} className={buttonClass({ variant: 'secondary', className: 'w-full sm:w-auto sm:flex-1' })}>
          Mandar mensagem
        </Link>
        <InstagramLink className="justify-center sm:hidden" />
      </div>
    </div>
  )
}
