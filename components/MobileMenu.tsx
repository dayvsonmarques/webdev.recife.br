'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { NAV_LINKS } from '@/lib/nav-links'
import { ButtonLink } from '@/components/ui/Button'
import { cn } from '@/components/ui/cn'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Ao abrir: foco no botão de fechar, Esc fecha e o Tab fica preso dentro do menu.
  useEffect(() => {
    if (!isOpen) return
    closeRef.current?.focus()
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
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  return (
    <div
      ref={dialogRef}
      id="menu-mobile"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navegação"
      inert={!isOpen}
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center gap-12 bg-bg transition-opacity duration-300 md:hidden',
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <button
        ref={closeRef}
        onClick={onClose}
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center text-muted"
        aria-label="Fechar menu"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <nav className="flex flex-col items-center gap-8" aria-label="Navegação principal">
        {NAV_LINKS.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="font-heading text-heading font-bold text-ink transition-all duration-300"
            style={{
              transform: isOpen ? 'translateY(0)' : 'translateY(16px)',
              opacity: isOpen ? 1 : 0,
              transitionDelay: isOpen ? `${i * 60}ms` : '0ms',
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <ButtonLink href="/orcamento" onClick={onClose} arrow>
        Pedir orçamento
      </ButtonLink>
    </div>
  )
}
