# Service Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give each of the 3 services on the homepage (Loja Online, Cardápio Digital, Agenda Fácil) its own page at `/servicos/[slug]` describing it as a SaaS product — what it is, who it's for, features, pricing, and a "test it" link — and link the homepage cards to those pages.

**Architecture:** One dynamic route (`app/servicos/[slug]/page.tsx`) driven by a shared data module (`lib/services.ts`), pre-rendered for all 3 slugs via `generateStaticParams`. Pricing is not duplicated — the existing 3 plans move to `lib/plans.ts` and `PlanCard` (currently private to `components/Pricing.tsx`) is exported and reused on the detail pages. Icons move from being inline in `components/Services.tsx` to a shared `components/service-icons.tsx` module so both the homepage cards and the detail pages can render them from the same string id (`'bag' | 'phone' | 'calendar'`).

**Tech Stack:** Next.js 16.2.7 (App Router), React 19, TypeScript, Tailwind CSS v4, inline styles against the project's CSS custom properties (`--color-*`, `--radius-*` from `app/globals.scss`).

**No test framework exists in this project** (no Jest/Vitest/Playwright, `package.json` only has `lint`/`build`/`dev`/`start`). This plan does not add one — that would be new, unrequested scope. Instead each task is verified the way every other change in this codebase has been verified: `npx tsc --noEmit` (type check), `npm run lint`, and checking the actual rendered HTML from the dev server with `curl`/`grep` — plus a full `npm run build` at the end, which is the only way to catch a broken `generateStaticParams`.

**Dev server:** already running on `http://localhost:3210` (`npm run dev` → `next dev -p 3210`, see `package.json`). If it's not running when you start, run `npm run dev` in the background before Task 1's verification steps.

---

### Task 1: Extract service icons into a shared module

**Files:**
- Create: `components/service-icons.tsx`
- Modify: `components/Services.tsx`

Today the 3 icon components (`IconBag`, `IconPhone`, `IconCalendar`) are defined inline at the top of `components/Services.tsx`. The new detail pages need to render the same icons from a plain string id (`service.icon`), so they move to their own module with a lookup map.

- [ ] **Step 1: Create `components/service-icons.tsx`**

```tsx
import type { ReactNode } from 'react'

function IconBag() {
  return (
    <svg
      width="100" height="100" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M16 11V7a4 4 0 00-8 0v4" />
      <path d="M5 9h14l1 12H4L5 9z" />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg
      width="100" height="100" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="12" y2="16" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg
      width="100" height="100" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" strokeWidth="0" />
      <circle cx="8" cy="16" r="1.5" fill="currentColor" strokeWidth="0" opacity="0.4" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" strokeWidth="0" opacity="0.4" />
    </svg>
  )
}

export type ServiceIconId = 'bag' | 'phone' | 'calendar'

export const SERVICE_ICONS: Record<ServiceIconId, ReactNode> = {
  bag: <IconBag />,
  phone: <IconPhone />,
  calendar: <IconCalendar />,
}
```

- [ ] **Step 2: Remove the 3 inline icon functions from `components/Services.tsx`**

Delete the `IconBag`, `IconPhone`, and `IconCalendar` function declarations (lines 6–50 of the current file — the three `function Icon...() { return (<svg ...) }` blocks) and the `import type { ReactNode } from 'react'` line at the top, since `ReactNode` will no longer be used directly in this file after Task 3. Leave everything else in the file untouched for now — Task 3 handles the rest of `Services.tsx`.

- [ ] **Step 3: Add the import for the new module**

At the top of `components/Services.tsx`, add:

```tsx
import { SERVICE_ICONS } from '@/components/service-icons'
```

The file won't compile cleanly yet (the `SERVICES` array still constructs icons as JSX like `icon: <IconBag />`, which no longer exists) — that's expected and gets fixed in Task 3. Don't run the type checker yet.

- [ ] **Step 4: Commit**

```bash
git add components/service-icons.tsx
git commit -m "refactor(services): extract service icons into shared module"
```

(Don't add `components/Services.tsx` yet — it's mid-refactor and won't compile. It gets added and committed in Task 3.)

---

### Task 2: Add the shared service data module

**Files:**
- Create: `lib/services.ts`

This is the single source of truth for the 3 services — consumed by the homepage cards (Task 3) and the new detail pages (Task 8). Content below is a first draft (per the approved design spec, `docs/superpowers/specs/2026-09-11-service-detail-pages-design.md`) — the user will review and edit the copy later. The `summary` field is the exact short text already used on today's homepage cards, so the homepage content does not regress.

- [ ] **Step 1: Create `lib/services.ts`**

```ts
import type { ServiceIconId } from '@/components/service-icons'

export type PlanId = 'basico' | 'avancado' | 'expert'

export interface Service {
  slug: string
  icon: ServiceIconId
  title: string
  /** Short one-liner used on the homepage card. */
  summary: string
  /** Short subtitle used in the detail page hero. */
  tagline: string
  /** Longer "what it is" paragraph for the detail page. */
  description: string
  /** "Who it's for" paragraph for the detail page. */
  forWhom: string
  features: string[]
  recommendedPlan: PlanId
  /** Pre-filled WhatsApp message for the "test it" CTA. */
  whatsappMessage: string
}

export const SERVICES: Service[] = [
  {
    slug: 'loja-online',
    icon: 'bag',
    title: 'Loja Online',
    summary: 'Para comércio físico que quer vender pela internet.',
    tagline: 'Sua loja funcionando 24 horas, sem depender de ponto físico.',
    description:
      'Loja Online é o site de vendas do seu comércio: catálogo de produtos, carrinho e checkout, feito sob medida pro seu negócio — sem mensalidade de plataforma genérica nem limite de personalização.',
    forWhom:
      'Pra comércio físico — roupas, calçados, relojoaria, joalheria, ourives, comércio geral — que quer vender pela internet sem virar refém de marketplace.',
    features: [
      'Catálogo de produtos com fotos e ficha técnica',
      'Carrinho de compras e checkout integrado',
      'Painel pra você mesmo atualizar preço e estoque',
      'Design responsivo — funciona bem no celular',
      'Domínio próprio (.com.br)',
      'Certificado SSL (HTTPS) incluído',
    ],
    recommendedPlan: 'avancado',
    whatsappMessage: 'Olá! Quero testar a Loja Online.',
  },
  {
    slug: 'cardapio-digital',
    icon: 'phone',
    title: 'Cardápio Digital',
    summary: 'Para restaurantes e lanchonetes sem depender de papel.',
    tagline: 'Cardápio sempre atualizado, sem gastar com reimpressão.',
    description:
      'Cardápio Digital é um site de cardápio pra restaurantes, lanchonetes, fruteiras e mercados: o cliente acessa pelo celular — com QR code na mesa ou no balcão — e vê preço e disponibilidade atualizados na hora, sem esperar o cardápio de papel ficar pronto de novo.',
    forWhom:
      'Pra quem vende comida ou tem preço e estoque que mudam com frequência: restaurantes, lanchonetes, fruteiras, mercados, comida congelada e pronta.',
    features: [
      'QR code pra acesso rápido pelo celular',
      'Atualização de preço e disponibilidade na hora',
      'Categorias e fotos dos produtos',
      'Botão de pedido direto pelo WhatsApp',
      'Aviso de item em falta sem precisar reimprimir nada',
      'Funciona bem mesmo com internet fraca',
    ],
    recommendedPlan: 'basico',
    whatsappMessage: 'Olá! Quero testar o Cardápio Digital.',
  },
  {
    slug: 'agenda-facil',
    icon: 'calendar',
    title: 'Agenda Fácil',
    summary: 'Para salões, clínicas e prestadores de serviço.',
    tagline: 'Menos falta, mais horário ocupado — sem app complicado.',
    description:
      'Agenda Fácil é o sistema de agendamento pra quem vende horário: o cliente escolhe o serviço e o horário disponível sozinho, pelo celular, e você recebe a confirmação — sem trocar mensagem pra fechar cada agendamento.',
    forWhom:
      'Pra barbearia, salão de beleza, clínica odontológica, tatuador ou estúdio de tatuagem e qualquer prestador de serviço que agenda por horário.',
    features: [
      'Cliente marca o próprio horário, sem precisar ligar',
      'Confirmação automática via WhatsApp',
      'Agenda organizada por profissional e serviço',
      'Lembrete pro cliente, reduz falta',
      'Bloqueio de horário indisponível',
      'Histórico de agendamentos',
    ],
    recommendedPlan: 'avancado',
    whatsappMessage: 'Olá! Quero testar o Agenda Fácil.',
  },
]
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors from `lib/services.ts` itself. (`components/Services.tsx` will still show errors from Task 1's partial edit — ignore those for now, they're fixed in Task 3.)

- [ ] **Step 3: Commit**

```bash
git add lib/services.ts
git commit -m "feat(services): add shared service data module"
```

---

### Task 3: Refactor `Services.tsx` to consume the shared data and link to detail pages

**Files:**
- Modify: `components/Services.tsx`

**Full replacement content for `components/Services.tsx`:**

- [ ] **Step 1: Replace the entire file**

```tsx
'use client'

import Link from 'next/link'
import { useInView } from '@/hooks/useInView'
import { SERVICE_ICONS, type ServiceIconId } from '@/components/service-icons'
import { SERVICES } from '@/lib/services'

function ServiceCard({
  slug,
  title,
  summary,
  icon,
}: {
  slug: string
  title: string
  summary: string
  icon: ServiceIconId
}) {
  return (
    <Link
      href={`/servicos/${slug}`}
      className="p-14 flex flex-col items-center text-center gap-6 transition-all duration-200 hover:-translate-y-1"
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
      <div style={{ color: 'var(--color-accent)' }}>{SERVICE_ICONS[icon]}</div>

      <div>
        <h3
          className="font-syne text-5xl font-bold mb-3"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {title.split(' ').map((word) => (
            <span key={word} className="block">
              {word}
            </span>
          ))}
        </h3>
        <p className="text-xl leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          {summary}
        </p>
      </div>
    </Link>
  )
}

export function Services() {
  const { ref, isInView } = useInView()

  return (
    <section
      id="servicos"
      ref={ref}
      className="py-28 transition-all duration-700"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        <p
          className="text-sm font-bold tracking-widest uppercase mb-4"
          style={{ color: 'var(--color-accent)' }}
        >
          O que fazemos
        </p>
        <h2
          className="font-syne text-5xl md:text-6xl font-bold mb-6"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Serviços
        </h2>
        <p
          className="text-xl md:text-2xl leading-relaxed mb-14 max-w-xl"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Lojas online, cardápios digitais e apps de agendamento para negócios locais. Rápido de entregar, fácil de usar.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.slug}
              slug={service.slug}
              title={service.title}
              summary={service.summary}
              icon={service.icon}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Verify against the running dev server**

```bash
curl -s http://localhost:3210/ | grep -o 'href="/servicos/[a-z-]*"' | sort -u
```

Expected output (3 lines, one per service):
```
href="/servicos/agenda-facil"
href="/servicos/cardapio-digital"
href="/servicos/loja-online"
```

If the dev server needs a fresh pick-up of the change, wait a couple seconds for Turbopack's HMR/rebuild before re-running `curl`.

- [ ] **Step 4: Commit**

```bash
git add components/Services.tsx
git commit -m "refactor(services): link service cards to detail pages"
```

---

### Task 4: Add the shared plans data module

**Files:**
- Create: `lib/plans.ts`
- Modify: `lib/services.ts`

Extracts the `PLANS` array currently defined inside `components/Pricing.tsx`, unchanged in content, with an added `id` field so `Service.recommendedPlan` (Task 2) can reference a specific plan.

**Amendment from Task 2's code review:** `PlanId` was defined directly in `lib/services.ts` as a hand-written union (`'basico' | 'avancado' | 'expert'`) because `lib/plans.ts` didn't exist yet. That's backwards ownership — a plan's own id type should live with the plan data, and deriving it from `PLANS` (instead of hand-writing the union a second time) means adding a 4th plan later can't silently drift out of sync with `Service.recommendedPlan`. This task fixes that: `PlanId` now lives in `lib/plans.ts`, derived from `PLANS` itself, and `lib/services.ts` imports it from there instead of declaring it.

- [ ] **Step 1: Create `lib/plans.ts`**

```ts
export interface Plan {
  id: 'basico' | 'avancado' | 'expert'
  name: string
  price: number
  description: string
  featured: boolean
  features: string[]
}

export const PLANS: Plan[] = [
  {
    id: 'basico',
    name: 'Básico',
    price: 30,
    description: 'Para quem quer marcar presença online com o essencial.',
    featured: false,
    features: [
      'Site de 1 página',
      'Design responsivo (mobile)',
      'Hospedagem incluída',
      'Certificado SSL (HTTPS)',
      'Formulário de contato',
      'Suporte via WhatsApp',
    ],
  },
  {
    id: 'avancado',
    name: 'Avançado',
    price: 59,
    description: 'Para negócios que querem ir além e converter mais clientes.',
    featured: true,
    features: [
      'Site de até 5 páginas',
      'Cardápio digital ou agendamento',
      'Domínio personalizado (.com.br)',
      'Google Meu Negócio',
      'SEO básico',
      'Suporte prioritário',
    ],
  },
  {
    id: 'expert',
    name: 'Expert',
    price: 109,
    description: 'Para quem quer vender online com estrutura completa.',
    featured: false,
    features: [
      'Páginas ilimitadas',
      'Loja virtual completa',
      'Integração WhatsApp + Instagram',
      'Painel de controle próprio',
      'Relatórios de acesso',
      'Suporte dedicado',
    ],
  },
]

/** Every valid plan id, derived from `PLANS` itself so it can't drift out of sync. */
export type PlanId = (typeof PLANS)[number]['id']
```

- [ ] **Step 2: Update `lib/services.ts` to import `PlanId` from here instead of declaring it**

In `lib/services.ts`, replace:

```ts
import type { ServiceIconId } from '@/components/service-icons'

export type PlanId = 'basico' | 'avancado' | 'expert'
```

with:

```ts
import type { ServiceIconId } from '@/components/service-icons'
import type { PlanId } from '@/lib/plans'
```

Nothing else in `lib/services.ts` changes — `Service.recommendedPlan: PlanId` still works the same way, it just now points at the derived type instead of a hand-written duplicate of it.

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors from `lib/plans.ts` or `lib/services.ts`. (`components/Pricing.tsx` still has its own local `PLANS` at this point, so there's no conflict yet — that's resolved in Task 5.)

- [ ] **Step 4: Commit**

```bash
git add lib/plans.ts lib/services.ts
git commit -m "feat(pricing): add shared plans data module"
```

---

### Task 5: Refactor `Pricing.tsx` to consume the shared plans and export `PlanCard`

**Files:**
- Modify: `components/Pricing.tsx`

`PlanCard` and `IconCheck` need to be exported so the detail pages (Task 8) can reuse them. `PlanCard`'s highlight styling is driven by the plan's own `featured` flag today — that's renamed to a `highlighted` prop the caller controls, plus an optional `badgeLabel` (defaults to `"Mais popular"`), so a detail page can highlight a *different* plan (the service's recommended one) with different badge text. The CTA link changes from `#contato` to `/#contato` so it still works when `PlanCard` is rendered on a page other than the homepage.

- [ ] **Step 1: Replace the entire file**

```tsx
'use client'

import { useInView } from '@/hooks/useInView'
import { PLANS } from '@/lib/plans'

export function IconCheck() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16"
      fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="2 8 6 12 14 4" />
    </svg>
  )
}

export function PlanCard({
  name,
  price,
  description,
  features,
  highlighted,
  badgeLabel = 'Mais popular',
}: {
  name: string
  price: number
  description: string
  features: string[]
  highlighted: boolean
  badgeLabel?: string
}) {
  return (
    <div
      className="relative p-8 flex flex-col gap-8 transition-all duration-200 hover:-translate-y-1"
      style={{
        backgroundColor: highlighted ? 'var(--color-surface)' : 'var(--color-bg)',
        border: `1px solid ${highlighted ? 'var(--color-accent)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {highlighted && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold uppercase tracking-widest text-center"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-accent-fg)',
            borderRadius: '999px',
          }}
        >
          {badgeLabel}
        </div>
      )}

      <div>
        <p
          className="text-sm font-bold uppercase tracking-widest mb-4"
          style={{ color: highlighted ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
        >
          {name}
        </p>

        <div className="flex items-end gap-1 mb-3">
          <span
            className="text-sm font-medium"
            style={{ color: 'var(--color-text-muted)' }}
          >
            R$
          </span>
          <span
            className="font-syne text-5xl font-extrabold leading-none"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {price}
          </span>
          <span
            className="text-sm mb-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            /mês
          </span>
        </div>

        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {description}
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <span style={{ color: 'var(--color-accent)', flexShrink: 0 }}>
              <IconCheck />
            </span>
            <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <a
        href="/#contato"
        className="mt-auto block text-center px-6 py-3 font-syne font-bold text-sm uppercase tracking-widest transition-opacity hover:opacity-80"
        style={
          highlighted
            ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)', borderRadius: 'var(--radius-md)' }
            : { border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', borderRadius: 'var(--radius-md)' }
        }
      >
        Começar agora
      </a>
    </div>
  )
}

export function Pricing() {
  const { ref, isInView } = useInView()

  return (
    <section
      id="planos"
      ref={ref}
      className="py-28 transition-all duration-700"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        <p
          className="text-sm font-bold tracking-widest uppercase mb-4"
          style={{ color: 'var(--color-accent)' }}
        >
          Investimento
        </p>
        <h2
          className="font-syne text-5xl md:text-6xl font-bold mb-4"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Planos
        </h2>
        <p
          className="text-xl mb-14 max-w-md"
          style={{ color: 'var(--color-text-muted)' }}
        >
          15 dias grátis para testar. Sem contrato de fidelidade, cancele quando quiser.
        </p>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              name={plan.name}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              highlighted={plan.featured}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Verify against the running dev server**

```bash
curl -s http://localhost:3210/ | grep -o 'href="/#contato"' | wc -l
```

Expected: `3` (one per plan card — all 3 plan CTAs now point to `/#contato`).

```bash
curl -s http://localhost:3210/ | grep -o 'Mais popular'
```

Expected: `Mais popular` (still shows on the homepage's featured plan — confirms the default `badgeLabel` works).

- [ ] **Step 4: Commit**

```bash
git add components/Pricing.tsx
git commit -m "refactor(pricing): decouple plan card highlight from data"
```

---

### Task 6: Make nav anchor links absolute

**Files:**
- Modify: `lib/nav-links.ts`

Today's links (`#servicos`, `#projetos`, etc.) only work when already on the homepage. The new detail pages need the header nav to work from anywhere, so every link becomes root-relative.

- [ ] **Step 1: Replace the file**

```ts
export const NAV_LINKS = [
  { href: '/#servicos', label: 'Serviços' },
  { href: '/#projetos', label: 'Projetos' },
  { href: '/#planos', label: 'Planos' },
  { href: '/#sobre', label: 'Sobre' },
  { href: '/#contato', label: 'Contato' },
] as const
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify against the running dev server**

```bash
curl -s http://localhost:3210/ | grep -o 'href="/#[a-z]*"' | sort -u
```

Expected output (5 lines):
```
href="/#contato"
href="/#planos"
href="/#projetos"
href="/#servicos"
href="/#sobre"
```

- [ ] **Step 4: Commit**

```bash
git add lib/nav-links.ts
git commit -m "fix(nav): make anchor links absolute for cross-page use"
```

---

### Task 7: Point the header logo at the homepage

**Files:**
- Modify: `components/Header.tsx`

**Context:** the logo link is currently `href="#"`, which only makes sense on the homepage. Find this block near the top of the file (inside the `<header>`, before the `<nav>`):

```tsx
          <a
            href="#"
            className="font-mono text-xl font-bold tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
            aria-label="Web Dev Recife — início"
          >
```

- [ ] **Step 1: Change `href="#"` to `href="/"`**

```tsx
          <a
            href="/"
            className="font-mono text-xl font-bold tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
            aria-label="Web Dev Recife — início"
          >
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify against the running dev server**

```bash
curl -s http://localhost:3210/ | grep -o 'aria-label="Web Dev Recife — início"[^>]*' 
curl -s http://localhost:3210/ | grep -o '<a href="/" [^>]*aria-label="Web Dev Recife'
```

Expected: the second command returns a match (the logo anchor now has `href="/"`).

- [ ] **Step 4: Commit**

```bash
git add components/Header.tsx
git commit -m "fix(header): point logo link to homepage root"
```

---

### Task 8: Create the service detail page

**Files:**
- Create: `app/servicos/[slug]/page.tsx`

This is the main new page. It's a Server Component (needed for `generateStaticParams` and `generateMetadata`), and renders the site's existing `Header`/`Footer`, plus `PlanCard`/`IconCheck` reused from `components/Pricing.tsx`.

- [ ] **Step 1: Create `app/servicos/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PlanCard, IconCheck } from '@/components/Pricing'
import { SERVICE_ICONS } from '@/components/service-icons'
import { SERVICES } from '@/lib/services'
import { PLANS } from '@/lib/plans'

export async function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/servicos/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const service = SERVICES.find((s) => s.slug === slug)
  if (!service) return {}

  return {
    title: `${service.title} — Web Dev Recife`,
    description: service.tagline,
  }
}

export default async function ServicePage({
  params,
}: PageProps<'/servicos/[slug]'>) {
  const { slug } = await params
  const service = SERVICES.find((s) => s.slug === slug)
  if (!service) notFound()

  const whatsappHref = `https://wa.me/55?text=${encodeURIComponent(service.whatsappMessage)}`

  return (
    <main>
      <Header />

      <section className="min-h-screen flex flex-col justify-center pt-28 pb-20">
        <div className="max-w-4xl mx-auto w-full px-6 md:px-8 lg:px-12">
          <Link
            href="/#servicos"
            className="inline-block text-sm font-bold tracking-widest uppercase mb-8"
            style={{ color: 'var(--color-accent)' }}
          >
            ← Serviços
          </Link>

          <div className="mb-8" style={{ color: 'var(--color-accent)' }}>
            {SERVICE_ICONS[service.icon]}
          </div>

          <h1
            className="font-syne text-5xl md:text-7xl font-extrabold leading-[1.05] mb-6"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {service.title}
          </h1>

          <p
            className="text-xl md:text-2xl leading-relaxed mb-10 max-w-2xl"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {service.tagline}
          </p>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 font-syne font-bold text-base tracking-wide transition-opacity hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-accent-fg)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            Testar grátis
          </a>
        </div>
      </section>

      <section className="py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12">
          <p
            className="text-sm font-bold tracking-widest uppercase mb-4"
            style={{ color: 'var(--color-accent)' }}
          >
            O que é
          </p>
          <p
            className="text-xl md:text-2xl leading-relaxed mb-10 max-w-2xl"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {service.description}
          </p>
          <p
            className="text-sm font-bold tracking-widest uppercase mb-4"
            style={{ color: 'var(--color-accent)' }}
          >
            Pra quem é
          </p>
          <p
            className="text-lg leading-relaxed max-w-2xl"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {service.forWhom}
          </p>
        </div>
      </section>

      <section className="py-28" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12">
          <h2
            className="font-syne text-4xl md:text-5xl font-bold mb-10"
            style={{ color: 'var(--color-text-primary)' }}
          >
            O que está incluso
          </h2>
          <ul className="grid md:grid-cols-2 gap-5">
            {service.features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <span style={{ color: 'var(--color-accent)', flexShrink: 0 }}>
                  <IconCheck />
                </span>
                <span className="text-lg" style={{ color: 'var(--color-text-primary)' }}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-28">
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
          <p
            className="text-sm font-bold tracking-widest uppercase mb-4"
            style={{ color: 'var(--color-accent)' }}
          >
            Investimento
          </p>
          <h2
            className="font-syne text-4xl md:text-5xl font-bold mb-14"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Planos
          </h2>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                name={plan.name}
                price={plan.price}
                description={plan.description}
                features={plan.features}
                highlighted={plan.id === service.recommendedPlan}
                badgeLabel="Recomendado pra esse serviço"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-32" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
          <h2
            className="font-syne text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 max-w-xl"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Pronto pra começar com {service.title}?
          </h2>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 font-syne font-bold text-base tracking-wide transition-opacity hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-accent-fg)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            Testar grátis
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit`
Expected: no errors. (`PageProps<'/servicos/[slug]'>` is a global type Next.js generates from the route structure — it's picked up once the dev server has run against this new route. If `tsc` complains that `PageProps` is not defined, run `npm run dev` — or `npx next typegen` — once first, then re-run `tsc --noEmit`.)

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Verify all 3 pages render on the dev server**

```bash
for slug in loja-online cardapio-digital agenda-facil; do
  echo "=== $slug ==="
  curl -s -o /dev/null -w "HTTP %{http_code}\n" "http://localhost:3210/servicos/$slug"
done
```

Expected: `HTTP 200` for all three.

```bash
curl -s http://localhost:3210/servicos/loja-online | grep -o '<title>[^<]*</title>'
```

Expected: `<title>Loja Online — Web Dev Recife</title>`

```bash
curl -s http://localhost:3210/servicos/cardapio-digital | grep -o 'Recomendado pra esse serviço'
```

Expected: `Recomendado pra esse serviço` (confirms the recommended-plan highlight renders).

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" "http://localhost:3210/servicos/nao-existe"
```

Expected: `HTTP 404` (confirms `notFound()` fires for an unknown slug).

- [ ] **Step 4: Full production build**

This is the step that actually exercises `generateStaticParams` at build time — `next dev` alone won't catch every static-generation issue.

Run: `npm run build`
Expected: build succeeds, and the output lists all 3 static routes, e.g.:
```
○ /servicos/[slug]
├ ● /servicos/agenda-facil
├ ● /servicos/cardapio-digital
└ ● /servicos/loja-online
```

If the build fails, read the error — it will point at whichever line accesses something not safe at build time (there shouldn't be any here, since everything reads from the static `SERVICES`/`PLANS` arrays).

- [ ] **Step 5: Commit**

```bash
git add app/servicos/
git commit -m "feat(services): add service detail pages"
```

---

### Task 9: Final end-to-end check

**Files:** none (verification only).

- [ ] **Step 1: Confirm the dev server is still serving the updated homepage correctly**

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:3210/
```

Expected: `HTTP 200`

- [ ] **Step 2: Click-through check via screenshots (optional but recommended)**

If a headless browser is available in the environment, take a screenshot of `http://localhost:3210/servicos/loja-online` (and the other two slugs) to visually confirm the page looks right — icon, title, description, features, pricing with the highlighted plan, and the "Testar grátis" buttons. This project's dev server sits behind Turbopack HMR — allow a couple of seconds after the last file change before capturing.

- [ ] **Step 3: Confirm nothing else in the repo referenced the old APIs**

```bash
grep -rn "IconBag\|IconPhone\|IconCalendar" components/ app/ --include="*.tsx" | grep -v service-icons.tsx
grep -rn "featured={" components/ app/ --include="*.tsx"
```

Expected: both commands return nothing (confirms the old inline icons and the old `featured` prop name aren't referenced anywhere outside the files already updated).

- [ ] **Step 4: Review full diff one more time**

```bash
git log --oneline -9
git diff ee73ca8..HEAD --stat
```

Expected: 8 commits since the plan started (Tasks 1, 2, 3, 4, 5, 6, 7, 8), touching exactly the files listed in this plan's task list — no stray changes.

No commit needed for this task — it's verification only.

---

## Notes for review

- **Content is a first draft.** Every string in `lib/services.ts` (title aside — those 3 titles were already decided) was written for this plan and should be treated as provisional marketing copy, per the approved design spec.
- **The WhatsApp number is still incomplete** (`wa.me/55` has no phone number after the country code) — this was already true before this feature (see `components/Pricing.tsx`'s and `components/Contact.tsx`'s existing links) and is out of scope here, but every new "Testar grátis" button inherits the same gap.
- **No automated tests were added** — see the "Tech Stack" note at the top of this plan for why, and what verification is used instead.
