# Web Dev Recife Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page portfolio site for Web Dev Recife in Next.js 15 (App Router) with Tailwind CSS v3, TypeScript, dark/light mode, responsive mobile menu, and scroll-triggered fade-in animations.

**Architecture:** One route (`app/page.tsx`) composed of standalone section components. CSS custom properties handle theming (dark by default via `next-themes`). A `useInView` hook powers fade-in animations using the native Intersection Observer API. No component library — everything custom.

**Tech Stack:** Next.js 15 · React 18 · TypeScript (strict) · Tailwind CSS v3 · next-themes · pnpm · Google Fonts (Syne + DM Sans)

---

## File Map

| File | Responsibility |
|---|---|
| `app/globals.css` | CSS variable tokens (dark/light), Tailwind directives, base reset |
| `app/layout.tsx` | Font loading, metadata, `<html>` shell, renders `<Providers>` |
| `app/page.tsx` | Composes all section components in order |
| `components/Providers.tsx` | Client boundary wrapping `next-themes` ThemeProvider |
| `components/Header.tsx` | Fixed header: logo, desktop nav, ThemeToggle, hamburger trigger |
| `components/ThemeToggle.tsx` | Sun/moon button using `useTheme` from next-themes |
| `components/MobileMenu.tsx` | Fullscreen overlay with fade+slide CSS transition |
| `components/Hero.tsx` | Headline, subheadline, proposta de valor, CTA button |
| `components/Services.tsx` | 3-card grid with hover accent border |
| `components/Projects.tsx` | 3 placeholder cards with segmento/problema/solução/resultado |
| `components/About.tsx` | Studio paragraph + indicator badges |
| `components/Contact.tsx` | CTA phrase + WhatsApp button |
| `components/Footer.tsx` | Copyright line |
| `hooks/useInView.ts` | Intersection Observer wrapper — returns `{ ref, isInView }` |
| `tailwind.config.ts` | Font family extensions only; colors via CSS vars |

---

## Task 1: Bootstrap the Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts` (via create-next-app)

- [ ] **Step 1.1: Initialize Next.js app**

Run from `/home/m4rqu3s/Workspace/webdev.recife.br`:

```bash
pnpm dlx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

When prompted about existing files (`docs/`), choose **Yes** to continue. Accept defaults for all other options.

- [ ] **Step 1.2: Install next-themes**

```bash
pnpm add next-themes
```

- [ ] **Step 1.3: Verify dev server starts**

```bash
pnpm dev
```

Expected: server starts at `http://localhost:3000`, no errors in terminal. Stop with `Ctrl+C`.

- [ ] **Step 1.4: Create required directories**

```bash
mkdir -p hooks
```

- [ ] **Step 1.5: Commit**

```bash
git init
git add package.json pnpm-lock.yaml tsconfig.json next.config.ts next.config.mjs postcss.config.mjs tailwind.config.ts .eslintrc.json .gitignore
git commit -m "chore(deps): bootstrap next.js with tailwind and next-themes"
```

---

## Task 2: Design Tokens + Tailwind Config

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`

- [ ] **Step 2.1: Replace `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── Dark (default) ── */
:root {
  --color-bg: #0A0A0A;
  --color-surface: #141414;
  --color-border: #2A2A2A;
  --color-text-primary: #F0EEE8;
  --color-text-muted: #888580;
  --color-accent: #D4FF57;

  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
}

/* ── Light ── */
html.light {
  --color-bg: #F5F4F0;
  --color-surface: #FFFFFF;
  --color-border: #E0DED8;
  --color-text-primary: #0A0A0A;
  --color-text-muted: #6B6965;
  --color-accent: #D4FF57;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  transition: background-color 0.2s ease, color 0.2s ease;
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 2.2: Replace `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        dm: ['var(--font-dm-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2.3: Verify TypeScript is happy**

```bash
pnpm tsc --noEmit
```

Expected: no output (no errors).

- [ ] **Step 2.4: Commit**

```bash
git add app/globals.css tailwind.config.ts
git commit -m "feat(design): add css tokens and tailwind font config"
```

---

## Task 3: Root Layout + Providers

**Files:**
- Create: `components/Providers.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 3.1: Create `components/Providers.tsx`**

```tsx
'use client'

import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </ThemeProvider>
  )
}
```

- [ ] **Step 3.2: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import { Providers } from '@/components/Providers'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Web Dev Recife — Seu negócio no digital',
  description:
    'Lojas online, cardápios digitais e apps de agendamento para negócios locais. Rápido de entregar, fácil de usar.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${syne.variable} ${dmSans.variable} font-dm`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

- [ ] **Step 3.3: Verify TypeScript**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3.4: Commit**

```bash
git add components/Providers.tsx app/layout.tsx
git commit -m "feat(layout): add providers, fonts, and metadata"
```

---

## Task 4: useInView Hook

**Files:**
- Create: `hooks/useInView.ts`

- [ ] **Step 4.1: Create `hooks/useInView.ts`**

```typescript
import { useEffect, useRef, useState } from 'react'

export function useInView(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}
```

- [ ] **Step 4.2: Verify TypeScript**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4.3: Commit**

```bash
git add hooks/useInView.ts
git commit -m "feat(hooks): add useInView intersection observer hook"
```

---

## Task 5: ThemeToggle Component

**Files:**
- Create: `components/ThemeToggle.tsx`

- [ ] **Step 5.1: Create `components/ThemeToggle.tsx`**

```tsx
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="w-8 h-8" aria-hidden="true" />
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-8 h-8 flex items-center justify-center transition-colors"
      style={{ color: 'var(--color-text-muted)' }}
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
```

- [ ] **Step 5.2: Verify TypeScript**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5.3: Commit**

```bash
git add components/ThemeToggle.tsx
git commit -m "feat(ui): add theme toggle with sun/moon icons"
```

---

## Task 6: MobileMenu Component

**Files:**
- Create: `components/MobileMenu.tsx`

- [ ] **Step 6.1: Create `components/MobileMenu.tsx`**

```tsx
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
```

- [ ] **Step 6.2: Verify TypeScript**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6.3: Commit**

```bash
git add components/MobileMenu.tsx
git commit -m "feat(ui): add mobile fullscreen menu with fade+slide"
```

---

## Task 7: Header Component

**Files:**
- Create: `components/Header.tsx`

- [ ] **Step 7.1: Create `components/Header.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { MobileMenu } from '@/components/MobileMenu'

const NAV_LINKS = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#contato', label: 'Contato' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 md:px-12"
        style={{
          backgroundColor: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
          transition: 'background-color 0.2s ease',
        }}
      >
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
              className="text-sm font-medium transition-colors hover:opacity-100"
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
            className="flex md:hidden flex-col justify-center gap-[5px] w-6 h-6"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
          >
            <span className="block h-px w-full" style={{ backgroundColor: 'var(--color-text-primary)' }} />
            <span className="block h-px w-full" style={{ backgroundColor: 'var(--color-text-primary)' }} />
            <span className="block h-px w-4" style={{ backgroundColor: 'var(--color-text-primary)' }} />
          </button>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
```

- [ ] **Step 7.2: Verify TypeScript**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7.3: Commit**

```bash
git add components/Header.tsx
git commit -m "feat(layout): add fixed header with nav and mobile trigger"
```

---

## Task 8: Hero Section

**Files:**
- Create: `components/Hero.tsx`

- [ ] **Step 8.1: Create `components/Hero.tsx`**

```tsx
'use client'

import { useInView } from '@/hooks/useInView'

export function Hero() {
  const { ref, isInView } = useInView()

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col justify-center px-6 pt-24 pb-16 md:px-12 lg:px-24 transition-all duration-700"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <div className="max-w-4xl">
        <h1
          className="font-syne text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] mb-6"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Seu negócio no digital{' '}
          <br className="hidden md:block" />—{' '}
          <span style={{ color: 'var(--color-accent)' }}>sem complicação.</span>
        </h1>

        <p
          className="text-lg md:text-xl leading-relaxed mb-4 max-w-2xl"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Lojas online, cardápios digitais e apps de agendamento para negócios locais. Rápido de entregar, fácil de usar.
        </p>

        <p
          className="text-base leading-relaxed mb-10 max-w-2xl"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Negócio local não precisa esperar meses nem pagar por algo construído do zero. As soluções são baseadas em plataformas consolidadas, adaptadas pra realidade do seu negócio — você sai do papel rápido, com um sistema que já foi testado e funciona.
        </p>

        <a
          href="#contato"
          className="inline-block px-8 py-4 font-syne font-bold text-sm tracking-wide transition-opacity hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: '#0A0A0A',
            borderRadius: 'var(--radius-md)',
          }}
        >
          Falar pelo WhatsApp
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 8.2: Verify TypeScript**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 8.3: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat(home): add hero section with headline and CTA"
```

---

## Task 9: Services Section

**Files:**
- Create: `components/Services.tsx`

- [ ] **Step 9.1: Create `components/Services.tsx`**

```tsx
'use client'

import { useInView } from '@/hooks/useInView'

const SERVICES = [
  {
    title: 'Loja Online',
    description: 'Para comércio físico que quer vender pela internet.',
  },
  {
    title: 'Cardápio Digital',
    description: 'Para restaurantes e lanchonetes sem depender de papel.',
  },
  {
    title: 'App de Agendamento',
    description: 'Para salões, clínicas e prestadores de serviço.',
  },
]

function ServiceCard({ title, description }: { title: string; description: string }) {
  return (
    <div
      className="p-8 transition-all duration-200 hover:-translate-y-1 cursor-default"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-accent)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)'
      }}
    >
      <h3
        className="font-syne text-xl font-bold mb-3"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {title}
      </h3>
      <p style={{ color: 'var(--color-text-muted)' }}>{description}</p>
    </div>
  )
}

export function Services() {
  const { ref, isInView } = useInView()

  return (
    <section
      id="servicos"
      ref={ref}
      className="py-24 px-6 md:px-12 lg:px-24 transition-all duration-700"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <h2
        className="font-syne text-3xl md:text-4xl font-bold mb-12"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Serviços
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {SERVICES.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 9.2: Verify TypeScript**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 9.3: Commit**

```bash
git add components/Services.tsx
git commit -m "feat(home): add services section with 3 cards"
```

---

## Task 10: Projects Section

**Files:**
- Create: `components/Projects.tsx`

- [ ] **Step 10.1: Create `components/Projects.tsx`**

```tsx
'use client'

import { useInView } from '@/hooks/useInView'

const PROJECTS = [
  {
    segment: 'Restaurante',
    problem: 'Cardápio físico desatualizado e caro de reimprimir',
    solution: 'Cardápio digital com QR code, atualizável pelo celular',
    result: 'Redução de 80% em custos de reimpressão',
  },
  {
    segment: 'Salão de Beleza',
    problem: 'Agenda manual com alto índice de faltas',
    solution: 'App de agendamento com confirmação automática via WhatsApp',
    result: 'Redução de 40% em no-shows',
  },
  {
    segment: 'Loja de Roupas',
    problem: 'Sem presença online, dependendo apenas do ponto físico',
    solution: 'Loja virtual integrada ao catálogo da loja',
    result: 'Crescimento de 30% em vendas no primeiro mês',
  },
]

function ProjectCard({
  segment,
  problem,
  solution,
  result,
}: (typeof PROJECTS)[number]) {
  return (
    <div
      className="p-8 flex flex-col gap-6"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <span
        className="text-xs font-bold tracking-widest uppercase"
        style={{ color: 'var(--color-accent)' }}
      >
        {segment}
      </span>

      {[
        { label: 'Problema', value: problem, accent: false },
        { label: 'Solução', value: solution, accent: false },
        { label: 'Resultado', value: result, accent: true },
      ].map(({ label, value, accent }) => (
        <div key={label}>
          <p
            className="text-xs uppercase tracking-wide mb-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {label}
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: accent ? 'var(--color-accent)' : 'var(--color-text-primary)' }}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  )
}

export function Projects() {
  const { ref, isInView } = useInView()

  return (
    <section
      id="projetos"
      ref={ref}
      className="py-24 px-6 md:px-12 lg:px-24 transition-all duration-700"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <h2
        className="font-syne text-3xl md:text-4xl font-bold mb-12"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Projetos
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.segment} {...project} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 10.2: Verify TypeScript**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 10.3: Commit**

```bash
git add components/Projects.tsx
git commit -m "feat(home): add projects section with placeholder cards"
```

---

## Task 11: About Section

**Files:**
- Create: `components/About.tsx`

- [ ] **Step 11.1: Create `components/About.tsx`**

```tsx
'use client'

import { useInView } from '@/hooks/useInView'

const INDICATORS = ['Recife, PE', 'MEI', 'Desde 2024']

export function About() {
  const { ref, isInView } = useInView()

  return (
    <section
      id="sobre"
      ref={ref}
      className="py-24 px-6 md:px-12 lg:px-24 transition-all duration-700"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <div className="max-w-2xl">
        <h2
          className="font-syne text-3xl md:text-4xl font-bold mb-8"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Sobre
        </h2>

        <p
          className="text-lg leading-relaxed mb-10"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Web Dev Recife é um estúdio independente de desenvolvimento web com foco em comércio local. Cada projeto é acompanhado de perto — sem enrolação, com entrega ágil e suporte real. O objetivo é simples: uma solução que funciona de verdade pro seu negócio.
        </p>

        <div className="flex flex-wrap gap-3">
          {INDICATORS.map((indicator) => (
            <span
              key={indicator}
              className="px-4 py-2 text-sm"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {indicator}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 11.2: Verify TypeScript**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 11.3: Commit**

```bash
git add components/About.tsx
git commit -m "feat(home): add about section with studio bio"
```

---

## Task 12: Contact Section

**Files:**
- Create: `components/Contact.tsx`

- [ ] **Step 12.1: Create `components/Contact.tsx`**

```tsx
'use client'

import { useInView } from '@/hooks/useInView'

export function Contact() {
  const { ref, isInView } = useInView()

  return (
    <section
      id="contato"
      ref={ref}
      className="py-24 px-6 md:px-12 lg:px-24 transition-all duration-700"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <div className="max-w-2xl">
        <h2
          className="font-syne text-3xl md:text-4xl font-bold mb-4"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Tem um projeto em mente?
        </h2>
        <p
          className="text-lg mb-10"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Conta o que você precisa.
        </p>

        <a
          href="https://wa.me/55"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 font-syne font-bold text-sm tracking-wide transition-opacity hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: '#0A0A0A',
            borderRadius: 'var(--radius-md)',
          }}
        >
          Falar pelo WhatsApp
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 12.2: Verify TypeScript**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 12.3: Commit**

```bash
git add components/Contact.tsx
git commit -m "feat(home): add contact section with whatsapp cta"
```

---

## Task 13: Footer Component

**Files:**
- Create: `components/Footer.tsx`

- [ ] **Step 13.1: Create `components/Footer.tsx`**

```tsx
export function Footer() {
  return (
    <footer
      className="py-8 px-6 md:px-12 lg:px-24"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        © 2024 Web Dev Recife
      </p>
    </footer>
  )
}
```

- [ ] **Step 13.2: Verify TypeScript**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 13.3: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat(layout): add footer with copyright"
```

---

## Task 14: Page Composition + Final Build

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 14.1: Replace `app/page.tsx`**

```tsx
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Services } from '@/components/Services'
import { Projects } from '@/components/Projects'
import { About } from '@/components/About'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Services />
      <Projects />
      <About />
      <Contact />
      <Footer />
    </main>
  )
}
```

- [ ] **Step 14.2: Full TypeScript check**

```bash
pnpm tsc --noEmit
```

Expected: no output (zero errors).

- [ ] **Step 14.3: Production build check**

```bash
pnpm build
```

Expected: output ends with `✓ Compiled successfully` (or equivalent). Zero errors. Zero warnings about invalid HTML/CSS.

- [ ] **Step 14.4: Manual smoke test**

```bash
pnpm dev
```

Open `http://localhost:3000` and verify:
- Dark background loads immediately (no flash)
- Headline "Seu negócio no digital — sem complicação." visible
- Sun icon in header; clicking it switches to light theme
- On mobile width (< 768px): hamburger icon appears, clicking it opens fullscreen menu
- Scrolling down: each section fades in from below
- "Falar pelo WhatsApp" buttons link to `https://wa.me/55`
- Services cards show accent border on hover
- Footer shows copyright

Stop with `Ctrl+C`.

- [ ] **Step 14.5: Commit**

```bash
git add app/page.tsx
git commit -m "feat(home): compose full page with all sections"
```
