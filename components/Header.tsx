'use client'

import { useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { MobileMenu } from '@/components/MobileMenu'
import { NAV_LINKS } from '@/lib/nav-links'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40"
        style={{
          backgroundColor: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
          transition: 'background-color 0.2s ease',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 flex items-center justify-between py-4">
          <a
            href="#"
            className="font-syne text-xl font-bold"
            style={{ color: 'var(--color-text-primary)' }}
            aria-label="Web Dev Recife — início"
          >
            WDR
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-opacity hover:opacity-100"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Hamburger — mobile only */}
            <button
              className="flex md:hidden flex-col justify-center gap-1.5 w-6 h-6"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
            >
              <span className="block h-px w-full" style={{ backgroundColor: 'var(--color-text-primary)' }} />
              <span className="block h-px w-full" style={{ backgroundColor: 'var(--color-text-primary)' }} />
              <span className="block h-px w-4" style={{ backgroundColor: 'var(--color-text-primary)' }} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
