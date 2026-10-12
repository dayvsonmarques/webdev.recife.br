'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'
import { MobileMenu } from '@/components/MobileMenu'
import { NAV_LINKS } from '@/lib/nav-links'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }, [])

  // Floats transparent over the top of the page; gets a solid background and border once scrolled.
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40"
        style={{
          backgroundColor: scrolled ? 'var(--color-bg)' : 'transparent',
          borderBottom: `1px solid ${scrolled ? 'var(--color-border)' : 'transparent'}`,
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 flex items-center py-4">
          <Link
            href="/"
            className="font-mono text-2xl font-bold tracking-tight whitespace-pre"
            style={{ color: 'var(--color-text-primary)' }}
            aria-label="Web Dev Recife — início"
          >
            <span style={{ color: 'var(--color-accent-text)' }}>&lt; </span>
            webdev
            <span style={{ color: 'var(--color-accent-text)' }}> /&gt;</span>
          </Link>

          <div className="ml-auto flex items-center gap-8">
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-bold uppercase tracking-widest transition-colors text-[var(--color-text-primary)] hover:text-[var(--color-accent-text)] focus-visible:text-[var(--color-accent-text)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <ThemeToggle />

            {/* Hamburger — mobile only */}
            <button
              ref={menuButtonRef}
              className="flex md:hidden items-center justify-center w-11 h-11 -mr-2.5"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
            >
              <span className="flex flex-col gap-[7px] w-7" aria-hidden="true">
                <span className="block h-0.5 w-full rounded-full" style={{ backgroundColor: 'var(--color-text-primary)' }} />
                <span className="block h-0.5 w-full rounded-full" style={{ backgroundColor: 'var(--color-text-primary)' }} />
                <span className="block h-0.5 w-5 rounded-full" style={{ backgroundColor: 'var(--color-text-primary)' }} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={closeMenu} />
    </>
  )
}
