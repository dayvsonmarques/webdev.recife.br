'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'
import { MobileMenu } from '@/components/MobileMenu'
import { ButtonLink } from '@/components/ui/Button'
import { cn } from '@/components/ui/cn'
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
        className={cn(
          'fixed inset-x-0 top-0 z-40 border-b transition-colors duration-200',
          scrolled ? 'border-line bg-bg' : 'border-transparent bg-transparent',
        )}
      >
        <div className="mx-auto flex max-w-container items-center gap-8 px-6 py-4 md:px-10">
          <Link href="/" className="whitespace-pre font-mono text-2xl font-bold tracking-tight text-ink" aria-label="Web Dev Recife — início">
            <span className="text-gold-ink">&lt; </span>
            webdev
            <span className="text-gold-ink"> /&gt;</span>
          </Link>

          <nav className="ml-auto hidden items-center gap-9 md:flex" aria-label="Navegação principal">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-base font-medium text-muted transition-colors hover:text-ink focus-visible:text-ink">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3 md:ml-0">
            <ThemeToggle />
            <ButtonLink href="/orcamento" size="md" className="hidden lg:inline-flex">
              Pedir orçamento
            </ButtonLink>
            {/* Hamburger — mobile only */}
            <button
              ref={menuButtonRef}
              className="-mr-2.5 flex h-11 w-11 items-center justify-center md:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
            >
              <span className="flex w-7 flex-col gap-[7px]" aria-hidden="true">
                <span className="block h-0.5 w-full rounded-full bg-ink" />
                <span className="block h-0.5 w-full rounded-full bg-ink" />
                <span className="block h-0.5 w-5 rounded-full bg-ink" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={closeMenu} />
    </>
  )
}
