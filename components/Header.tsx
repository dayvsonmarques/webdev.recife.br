'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'
import { MenuIcon, MobileMenu } from '@/components/MobileMenu'
import { ButtonLink } from '@/components/ui/Button'
import { cn } from '@/components/ui/cn'
import { NAV_LINKS } from '@/lib/nav-links'
import { Logo } from '@/components/Logo'

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
          <Link href="/" className="flex min-h-11 items-center text-[1.75rem]" aria-label="Web Dev Recife — início">
            <Logo />
          </Link>

          <nav className="ml-auto hidden items-center gap-9 lg:flex" aria-label="Navegação principal">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-base font-medium text-muted transition-colors hover:text-ink focus-visible:text-ink">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3 lg:ml-0">
            <ThemeToggle />
            {/* Wrapper carries the breakpoint: the button's own inline-flex would override "hidden". */}
            <span className="hidden lg:block">
              <ButtonLink href="/orcamento" size="md">
                Solicitar orçamento
              </ButtonLink>
            </span>
            {/* Menu de barras — celular e tablet */}
            <button
              ref={menuButtonRef}
              type="button"
              className="-mr-2.5 flex h-11 w-11 items-center justify-center text-ink lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
            >
              <MenuIcon open={false} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={closeMenu} />
    </>
  )
}
