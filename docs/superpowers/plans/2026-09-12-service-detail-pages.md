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

**Amendment from this task's code review:** turning the card from a plain `<div>` into a `<Link>` puts it in the tab order for the first time, but the original hover border-color effect was bound only to `onMouseEnter`/`onMouseLeave` — a keyboard user tabbing to a card would never see it. The fix moves the border color to Tailwind's `hover:` and `focus-visible:` variants (matching the convention already used elsewhere in this codebase, e.g. `Contact.tsx`, `Hero.tsx`, `Pricing.tsx`) instead of imperative DOM mutation, so both input methods get the same affordance. The code block below already reflects this fix.

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
      className="p-14 flex flex-col items-center text-center gap-6 border border-[var(--color-border)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-accent)] focus-visible:border-[var(--color-accent)]"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
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

**Amendment from Task 2's code review:** `PlanId` was defined directly in `lib/services.ts` as a hand-written union (`'basico' | 'avancado' | 'expert'`) because `lib/plans.ts` didn't exist yet. That's backwards ownership — a plan's own id type should live with the plan data. This task fixes that: `PlanId` now lives in `lib/plans.ts` as `Plan['id']` (a re-export of the interface's own field type, not a second hand-written copy of the union), and `lib/services.ts` imports it from there instead of declaring it. This still solves the original drift problem — adding a plan to `PLANS` requires widening `Plan['id']` first, which immediately propagates to `Service.recommendedPlan` — it just does it by having one union instead of two, not by "deriving" the type from the array data (a `(typeof PLANS)[number]['id']` phrasing was tried and rejected here: since `PLANS` is typed as `Plan[]`, that expression resolves back to `Plan['id']` anyway, so it added indirection without adding safety).

- [ ] **Step 1: Create `lib/plans.ts`**

```ts
export interface Plan {
  id: 'basico' | 'avancado' | 'expert'
  name: string
  /** Monthly price in BRL, shown as "R${price}/mês". */
  price: number
  description: string
  /** Whether this plan gets the "Mais popular" badge on the homepage Planos section. */
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

/**
 * Every valid plan id. This is a re-export of `Plan['id']`, not a separate
 * hand-written union — adding a plan to `PLANS` first requires widening this
 * type, which then immediately propagates to anything typed against it (e.g.
 * `Service.recommendedPlan` in `lib/services.ts`).
 */
export type PlanId = Plan['id']
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

**Amendment from this task's implementation:** an `<a href="/#contato">` trips Next's `@next/next/no-html-link-for-pages` lint rule (`recommended: true`) — any plain `<a>` whose href is a static string literal resolving to a real app route, including a hash on the root route, is flagged in favor of `next/link`. The code below already uses `<Link>` for this reason. (`<Link>` also gives client-side/prefetched navigation instead of a full document reload when this CTA is clicked from a page other than the homepage, e.g. a `/servicos/[slug]` detail page from Task 8 — a real but separate benefit from the lint fix.) Note this is unrelated to the fixed-header-covers-the-target-section issue also found during this plan's execution — that turned out to need a CSS fix (`scroll-padding-top`), not a `<Link>` conversion; see the amendment note on Task 6.

- [ ] **Step 1: Replace the entire file**

```tsx
'use client'

import Link from 'next/link'
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

      <Link
        href="/#contato"
        className="mt-auto block text-center px-6 py-3 font-syne font-bold text-sm uppercase tracking-widest transition-opacity hover:opacity-80"
        style={
          highlighted
            ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)', borderRadius: 'var(--radius-md)' }
            : { border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', borderRadius: 'var(--radius-md)' }
        }
      >
        Começar agora
      </Link>
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
git commit -m "refactor(pricing): decouple plan card highlight from data

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
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

### Task 7: Point the header logo at the homepage and fix nav link lint errors

**Files:**
- Modify: `components/Header.tsx`
- Modify: `components/MobileMenu.tsx`
- Modify: `app/layout.tsx`

**Context:** the logo link is currently `href="#"`, which only makes sense on the homepage.

**Second amendment, from this task's code review:** Next.js 16 changed how it handles a globally-set `scroll-behavior: smooth` (which `app/globals.scss` sets on `html`, and which Task 6 depends on for the hash-anchor jump to be smooth rather than instant). Per `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` § "Scroll Behavior Override": in Next 15 and earlier, Next automatically neutralized `scroll-behavior: smooth` during route transitions (so navigating to a new page didn't animate a long scroll before snapping to the top); in Next 16, it no longer does this **unless** the `<html>` element carries `data-scroll-behavior="smooth"` — without it, a cross-page navigation whose target page renders below the top of the viewport (e.g. clicking "Contato" in the header from a `/servicos/[slug]` detail page, once Task 8 lands) animates a visible smooth-scroll on top of the page transition, and logs a dev-mode warning. Add the attribute to `app/layout.tsx`:

```tsx
<html lang="pt-BR" data-scroll-behavior="smooth" suppressHydrationWarning>
```

This is the only change to `app/layout.tsx` — everything else in that file stays as-is.

**Amendment from Task 5's implementation:** Task 6 makes every `NAV_LINKS` entry an absolute path (`/#servicos`, etc.), and this task was going to make only the logo `href="/"`. Both `components/Header.tsx` (desktop nav + logo) and `components/MobileMenu.tsx` (mobile nav) render these as plain `<a>` tags — that's now the same shape Task 5 had for `PlanCard`'s CTA before converting it to `next/link`'s `<Link>`.

One detail that turned out *not* to apply here: the `@next/next/no-html-link-for-pages` lint rule that caught Task 5's `<a href="/#contato">` only inspects JSX attributes with a static string literal value — it bails out immediately on a dynamic `href={link.href}` expression like these, so `npm run lint` will NOT flag `Header.tsx`/`MobileMenu.tsx` even after Task 6 lands. So this isn't a lint fix. The reason to still convert these: once `/servicos/[slug]` pages exist (Task 8), clicking a nav link from a detail page becomes a real cross-page navigation, and `next/link` gives that a client-side transition (prefetched, no full document reload) instead of a hard navigation — a real but modest UX win, not a correctness fix.

**A second, separate bug surfaced during this task's implementation and code review, unrelated to `<Link>` vs `<a>`:** this site's `fixed` header covers the top of the viewport, and neither a plain `<a href="#id">` nor `next/link`'s hash navigation accounts for that on their own — per `node_modules/next/dist/docs/01-app/03-api-reference/02-components/link.md` § "Scroll offset with sticky headers", Next.js **skips** fixed/sticky elements when computing the scroll target, so the target section lands **partially hidden underneath the header**, and the docs' own prescribed fix is CSS (`scroll-padding-top` on `html`), not a component choice. This was a **pre-existing bug already reachable on the homepage today** (e.g. clicking "Contato" in the nav) — Task 6 didn't introduce it, but going into Task 8 it would have become more visible (cross-page nav landing under the header on a page that's supposed to look finished). Fixed directly in `app/globals.scss` as part of this task's own commit, since it's a one-line, low-risk, unambiguous correction:

```scss
html {
  scroll-behavior: smooth;
  scroll-padding-top: 5rem;
}
```

This fixes hash-anchor scrolling for every `<a href="#id">` and `<Link href="/#id">` in the site, present and future — nothing about it is specific to this plan's own links.

- [ ] **Step 1: Replace `components/Header.tsx` entirely**

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
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
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 flex items-center py-4">
          <Link
            href="/"
            className="font-mono text-xl font-bold tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
            aria-label="Web Dev Recife — início"
          >
            <span style={{ color: 'var(--color-accent)' }}>&lt;</span>
            webdev
            <span style={{ color: 'var(--color-accent)' }}> /&gt;</span>
          </Link>

          <div className="ml-auto flex items-center gap-8">
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-bold uppercase tracking-widest transition-colors"
                  style={{ color: 'var(--color-text-primary)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

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
```

The only changes from the current file: the new `import Link from 'next/link'` line, the logo `<a href="#" ...>` becoming `<Link href="/" ...>` (and its matching closing tag), and the desktop nav's `<a key={link.href} href={link.href} ...>` becoming `<Link key={link.href} href={link.href} ...>` (and its matching closing tag). Everything else — including the `onMouseEnter`/`onMouseLeave` inline handlers on the nav links — stays exactly as it is; that pre-existing hover pattern is not part of this task's scope.

- [ ] **Step 2: Replace `components/MobileMenu.tsx` entirely**

```tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { NAV_LINKS } from '@/lib/nav-links'

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
      aria-hidden={!isOpen}
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
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="font-syne text-4xl font-bold uppercase tracking-widest transition-all duration-300"
            style={{
              color: 'var(--color-text-primary)',
              transform: isOpen ? 'translateY(0)' : 'translateY(16px)',
              opacity: isOpen ? 1 : 0,
              transitionDelay: isOpen ? `${i * 60}ms` : '0ms',
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
```

The only changes from the current file: the new `import Link from 'next/link'` line, and `<a key={link.href} href={link.href} onClick={onClose} ...>` becoming `<Link key={link.href} href={link.href} onClick={onClose} ...>` (and its matching closing tag). `Link` forwards `onClick` to the underlying `<a>` exactly like a plain anchor, so tapping a link still closes the mobile menu.

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors from either file. (The known, pre-existing, unrelated `components/Hero.tsx` `react-hooks/set-state-in-effect` error may still appear — that's not yours to fix.)

- [ ] **Step 4: Verify against the running dev server**

```bash
curl -s http://localhost:3210/ | grep -oE '<a [^>]*aria-label="Web Dev Recife — início"[^>]*>'
```

Expected: one match, and it contains `href="/"` somewhere in the attribute list (`next/link`'s `<Link>` doesn't necessarily render attributes in the same order you wrote them in JSX — `href` may come before or after `aria-label` in the output — so check the whole matched tag for `href="/"` rather than assuming a fixed order).

```bash
curl -s http://localhost:3210/ | grep -o 'href="/#[a-z]*"' | sort -u
```

Expected output (5 lines, same as Task 6's check — confirms the desktop nav links still carry the right hrefs after becoming `<Link>`):
```
href="/#contato"
href="/#planos"
href="/#projetos"
href="/#servicos"
href="/#sobre"
```

- [ ] **Step 5: Commit**

```bash
git add components/Header.tsx components/MobileMenu.tsx
git commit -m "fix(nav): use next/link for internal header and menu links

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 8: Create the service detail page

**Files:**
- Create: `app/servicos/[slug]/page.tsx`
- Create: `app/not-found.tsx`

This is the main new page. It's a Server Component (needed for `generateStaticParams` and `generateMetadata`), and renders the site's existing `Header`/`Footer`, plus `PlanCard`/`IconCheck` reused from `components/Pricing.tsx`.

**Amendment from this task's code review** (verified with a real headless-browser render, not just by reading the code — two of these were genuine visible defects, not just style preferences):

1. **Badge text was too long for its box.** The original `badgeLabel="Recomendado pra esse serviço"` (28 characters, vs. `PlanCard`'s default `"Mais popular"` at 12) wrapped to 3 lines in the badge's absolutely-positioned box between roughly 768–950px viewport width, overlapping the plan name below it. Fixed by shortening to `badgeLabel="Recomendado"` — the code block below already reflects this. (In context, on a page that's already about one specific service, "Recomendado" alone reads fine — the visitor doesn't need "...pra esse serviço" spelled out.)
2. **Container width was inconsistent with the rest of the site.** The hero, "O que é", and features sections used `max-w-4xl` while the pricing grid, closing CTA, `Header`, `Footer`, and every homepage section use `max-w-6xl` — producing a ~128px misalignment partway down the page (the `<h1>` didn't line up under the site logo). Fixed by using `max-w-6xl` on every section's outer container, matching the rest of the site; the paragraphs inside that were already explicitly narrowed with their own `max-w-2xl` stay just as readable. The code block below already reflects this.
3. **No `app/not-found.tsx` existed anywhere in the repo.** This is the first route in the project where a user-typed or stale URL can realistically miss (`/servicos/<anything-else>`), and without a custom `not-found.tsx`, Next's stock fallback renders — English text on a pt-BR site, no `Header`/`Footer`, and a hardcoded white/black color scheme that ignores the `html.light` theme choice. Step 2 below adds a minimal branded one.

Two more findings from that review were **not** applied — noted in "Notes for review" at the end of this plan as deliberate scope decisions, not oversights: the plan-card CTA on this page still goes to `/#contato` rather than carrying the service's WhatsApp context, and there's no Open Graph/canonical metadata yet.

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
        <div className="max-w-6xl mx-auto w-full px-6 md:px-8 lg:px-12">
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
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
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
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
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
                badgeLabel="Recomendado"
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

- [ ] **Step 2: Create `app/not-found.tsx`**

```tsx
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function NotFound() {
  return (
    <main>
      <Header />

      <section className="min-h-screen flex flex-col justify-center items-center text-center pt-28 pb-20 px-6">
        <p
          className="text-sm font-bold tracking-widest uppercase mb-4"
          style={{ color: 'var(--color-accent)' }}
        >
          404
        </p>
        <h1
          className="font-syne text-4xl md:text-5xl font-extrabold mb-6"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Página não encontrada
        </h1>
        <p
          className="text-lg leading-relaxed mb-10 max-w-md"
          style={{ color: 'var(--color-text-muted)' }}
        >
          O endereço que você tentou acessar não existe ou foi movido.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 font-syne font-bold text-base tracking-wide transition-opacity hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-accent-fg)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          Voltar para a página inicial
        </Link>
      </section>

      <Footer />
    </main>
  )
}
```

Next.js picks this up automatically for any unmatched route and for explicit `notFound()` calls (like the one in `page.tsx` above) — no wiring needed beyond the file existing at `app/not-found.tsx`.

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc --noEmit`
Expected: no errors. (`PageProps<'/servicos/[slug]'>` is a global type Next.js generates from the route structure — it's picked up once the dev server has run against this new route. If `tsc` complains that `PageProps` is not defined, run `npm run dev` — or `npx next typegen` — once first, then re-run `tsc --noEmit`.)

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Verify all 3 pages render on the dev server, and the 404 page**

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
curl -s http://localhost:3210/servicos/cardapio-digital | grep -o 'Recomendado'
```

Expected: `Recomendado` (confirms the recommended-plan highlight renders — check it visually too if you can, at a ~800px viewport width, since a too-long badge label wrapping into the plan name below it was a real bug found in this task's own review; `"Recomendado"` alone is short enough not to repeat it).

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" "http://localhost:3210/servicos/nao-existe"
curl -s http://localhost:3210/servicos/nao-existe | grep -o 'Página não encontrada'
```

Expected: `HTTP 404`, and the branded `app/not-found.tsx` page (not Next's stock English fallback).

- [ ] **Step 5: Full production build**

This is the step that actually exercises `generateStaticParams` at build time — `next dev` alone won't catch every static-generation issue.

Run: `npm run build`
Expected: build succeeds, and the output lists all 3 static routes plus `/_not-found`, e.g.:
```
Route (app)
┌ ○ /
├ ○ /_not-found
└ ● /servicos/[slug]
  ├ /servicos/loja-online
  ├ /servicos/cardapio-digital
  └ /servicos/agenda-facil
```

If the build fails, read the error — it will point at whichever line accesses something not safe at build time (there shouldn't be any here, since everything reads from the static `SERVICES`/`PLANS` arrays).

- [ ] **Step 6: Commit**

```bash
git add app/servicos/ app/not-found.tsx
git commit -m "feat(services): add service detail pages

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
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
git log --oneline ee73ca8..HEAD
git diff ee73ca8..HEAD --stat
```

`ee73ca8` is the commit right before this plan's work started (it may include a few extra fix-up commits beyond one-per-task, if a code review during execution caught something worth correcting immediately — that's expected, each should have an obviously-related message). Expected: every file in the `--stat` output is one this plan intended to touch — `components/service-icons.tsx`, `lib/services.ts`, `components/Services.tsx`, `lib/plans.ts`, `components/Pricing.tsx`, `lib/nav-links.ts`, `components/Header.tsx`, `components/MobileMenu.tsx`, `app/servicos/[slug]/page.tsx`, plus this plan's own doc file for any amendments made along the way. No unrelated file should appear.

No commit needed for this task — it's verification only.

---

## Notes for review

- **Content is a first draft.** Every string in `lib/services.ts` (title aside — those 3 titles were already decided) was written for this plan and should be treated as provisional marketing copy, per the approved design spec.
- **The WhatsApp number is still incomplete** (`wa.me/55` has no phone number after the country code) — this was already true before this feature (see `components/Pricing.tsx`'s and `components/Contact.tsx`'s existing links) and is out of scope here, but every new "Testar grátis" button inherits the same gap.
- **No automated tests were added** — see the "Tech Stack" note at the top of this plan for why, and what verification is used instead.
- **Making nav links absolute (`/#servicos` etc.) drops query strings on click** — a visitor who lands on `/?utm_source=instagram` and then clicks a nav link gets a full document navigation to bare `/`, losing the UTM params. The previous page-relative `#servicos` hrefs didn't have this problem, but couldn't work from a page other than the homepage, which is what this whole feature requires. Accepted trade-off, not fixed here; the escape hatch (resolving hrefs relative to `usePathname()`/`useSearchParams()` in the header) is more complexity than this site's size currently warrants.
- **`components/Hero.tsx`'s own "Entrar em contato" button** still uses a page-relative `href="#contato"`, not part of any task in this plan. Intentionally out of scope — `Hero` is only ever rendered from the homepage (`app/page.tsx`), so it never needs to work cross-page the way the header nav does.
- **Clicking a nav link for the section you're already scrolled away from, when you're already on that hash, doesn't re-scroll** — found during Task 7's code review. Next's router treats it as "no navigation" since the hash is unchanged, so a second click on e.g. "Contato" after manually scrolling elsewhere does nothing, where a plain `<a>` would have jumped back. Pre-existing risk of the `<Link>` conversion (Tasks 3, 5, 7), not fixed — low-traffic edge case for a one-page site, and working around it would mean hooking into router events for a marginal gain.
- **`components/MobileMenu.tsx`'s links stay in the tab order while the menu is visually closed** — found during Task 7's code review, pre-existing and not introduced by any task here (the `aria-hidden`/`opacity`/`pointer-events` closed-state styling never removed the `<a>`/`<Link>` elements from focus order). Not fixed — real accessibility gap, but predates this feature and is unrelated to service detail pages; a clean fix is `inert={!isOpen}` on the dialog container in a dedicated follow-up.
- **The plan-card "Começar agora" buttons on a service detail page still link to `/#contato`**, losing the service context and the pre-filled WhatsApp message the page's own "Testar grátis" buttons carry — found during Task 8's code review. Not fixed here: it would mean adding optional `ctaHref`/`ctaLabel` props to `PlanCard` (defaulting to today's `/#contato` / `"Começar agora"` so the homepage is untouched) and threading `whatsappHref` through from the detail page. Worth a small follow-up task.
- **No Open Graph metadata or canonical URL on the service pages** — found during Task 8's code review. `generateMetadata` only sets `title`/`description`. Given this business's links are mainly shared via WhatsApp/Instagram, a pasted link today renders as a bare URL with no preview card — a real, if modest, conversion gap. Not added here since it touches `app/layout.tsx`'s metadata defaults too (a `metadataBase` + a shared `openGraph` base, then per-page `openGraph`/`alternates.canonical` in `generateMetadata`) — a reasonable-sized follow-up task, not a one-line fix.
- **Attribution note:** `docs/CONVENTIONS.md` states commit messages should have "No `Co-Authored-By` or any signature trailer," but every commit made during this plan's execution carries one. This followed an explicit session-level instruction that said it overrides earlier attribution guidance — flagging the conflict here rather than silently picking a side, since it's the user's project convention being overridden. `develop` has no shared history with a remote yet in this environment, so squashing/amending later to match `CONVENTIONS.md` is still cheap if that's preferred.
