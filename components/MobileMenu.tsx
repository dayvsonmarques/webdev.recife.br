'use client'

import { useEffect } from 'react'

const NAV_LINKS = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#contato', label: 'Contato' },
]

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navegação"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-300 md:hidden"
      style={{
        backgroundColor: 'var(--color-bg)',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center"
        style={{ color: 'var(--color-text-muted)' }}
        aria-label="Fechar menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <nav className="flex flex-col items-center gap-8">
        {NAV_LINKS.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="font-syne text-4xl font-bold transition-all duration-300"
            style={{
              color: 'var(--color-text-primary)',
              transform: isOpen ? 'translateY(0)' : 'translateY(16px)',
              opacity: isOpen ? 1 : 0,
              transitionDelay: isOpen ? `${i * 60}ms` : '0ms',
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  )
}
