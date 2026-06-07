# Web Dev Recife — Portfolio Site Design Spec

## Overview

Single-page portfolio site for the studio **Web Dev Recife**, targeting local business owners (comércio, restaurantes, clínicas, salões). Goal: convert visitors into WhatsApp leads. No backend at this stage; PostgreSQL + GraphQL planned for a future phase.

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSG/SSR, image optimisation, metadata API |
| Styling | Tailwind CSS v3 | Estável, `tailwind.config.ts`, bem documentado com Next.js |
| Language | TypeScript (strict) | Per conventions |
| Theme | next-themes | SSR-safe dark/light toggle |
| Package manager | pnpm | Fast, disk-efficient |
| Fonts | Google Fonts (Syne + DM Sans) | `next/font/google` |
| Animation | Intersection Observer API | No extra library; CSS transitions |

No component libraries (no shadcn, MUI, etc.) — everything custom with Tailwind.

## Design System

### Typography
- **Display / headlines**: Syne (weights 700, 800)
- **Body**: DM Sans (weights 400, 500)

### Color Tokens (CSS variables in `globals.css`)
```css
/* Dark (default) */
--color-bg: #0A0A0A;
--color-surface: #141414;
--color-border: #2A2A2A;
--color-text-primary: #F0EEE8;
--color-text-muted: #888580;
--color-accent: #D4FF57;

/* Light */
--color-bg: #F5F4F0;
--color-surface: #FFFFFF;
--color-border: #E0DED8;
--color-text-primary: #0A0A0A;
--color-text-muted: #6B6965;
--color-accent: #D4FF57; /* same both themes */
```

### Spacing Base: 8px
Multiples used: 8, 16, 24, 32, 48, 64, 96.

### Border Radius
```css
--radius-sm: 6px;
--radius-md: 12px;
--radius-lg: 20px;
```

## Page Sections (top → bottom)

### 1. Header (fixed)
- Logo "WDR" left
- Nav links right: Serviços · Projetos · Sobre · Contato
- `ThemeToggle` button (sun/moon icon)
- Mobile: hamburger → fullscreen overlay (fade+slide, links centered, X to close)

### 2. Hero
- Headline: **"Seu negócio no digital — sem complicação."** (Syne, large display)
- Subheadline: "Lojas online, cardápios digitais e apps de agendamento para negócios locais. Rápido de entregar, fácil de usar."
- Proposta de valor: "Negócio local não precisa esperar meses nem pagar por algo construído do zero. As soluções são baseadas em plataformas consolidadas, adaptadas pra realidade do seu negócio — você sai do papel rápido, com um sistema que já foi testado e funciona."
- Primary CTA button → scrolls to `#contato`

### 3. Serviços (3 cards grid)
| Card | Título | Descrição curta |
|---|---|---|
| 1 | Loja Online | Para comércio físico que quer vender pela internet |
| 2 | Cardápio Digital | Para restaurantes e lanchonetes sem depender de papel |
| 3 | App de Agendamento | Para salões, clínicas e prestadores de serviço |

Card hover: leve `translateY(-4px)` + `border-color: var(--color-accent)`.

### 4. Projetos (3 placeholder cards)
Each card exposes: **Segmento · Problema · Solução · Resultado**.

| # | Segmento | Problema | Solução | Resultado |
|---|---|---|---|---|
| 1 | Restaurante | Cardápio físico desatualizado | Cardápio digital com QR code | Redução de 80% em reimpressões |
| 2 | Salão de Beleza | Agenda manual, faltas frequentes | App de agendamento com confirmação automática | -40% em no-shows |
| 3 | Loja de Roupas | Sem presença online | Loja virtual integrada ao estoque | +30% em vendas no primeiro mês |

### 5. Sobre
> "Web Dev Recife é um estúdio independente de desenvolvimento web com foco em comércio local. Cada projeto é acompanhado de perto — sem enrolação, com entrega ágil e suporte real. O objetivo é simples: uma solução que funciona de verdade pro seu negócio."

Indicadores pequenos abaixo: **Recife, PE · MEI · Desde 2024**.

### 6. Contato
- Frase CTA: "Tem um projeto em mente? Conta o que você precisa."
- Botão primário: "Falar pelo WhatsApp" → `https://wa.me/55` (placeholder)

### 7. Footer
Copyright simples: `© 2024 Web Dev Recife`

## Functionality

### Dark / Light Mode
- Provider: `next-themes` com `defaultTheme="dark"` e `attribute="class"`
- `ThemeToggle` usa ícones Sol/Lua, sem flash no SSR (suppressHydrationWarning)

### Mobile Menu
- Desktop (≥ 768px): links inline no header
- Mobile: botão hamburguer → overlay fullscreen com `background: var(--color-bg)`, links grandes centralizados, animação fade+slide (CSS transitions), botão X no canto superior direito
- Ao clicar num link do menu: fecha overlay e faz scroll para seção

### Animations
- `useInView` hook customizado usando Intersection Observer
- Cada seção tem `opacity: 0 → 1` + `translateY(24px → 0)` ao entrar no viewport
- Threshold 0.1, trigga uma vez (`once: true`)

## File Structure
```
app/
  layout.tsx         # fonts, ThemeProvider, metadata
  page.tsx           # composição das seções
  globals.css        # design tokens, reset
components/
  Header.tsx
  Hero.tsx
  Services.tsx
  Projects.tsx
  About.tsx
  Contact.tsx
  Footer.tsx
  ThemeToggle.tsx
  MobileMenu.tsx
hooks/
  useInView.ts       # Intersection Observer wrapper
```

## Conventions (from docs/CONVENTIONS.md)
- TypeScript: `camelCase` vars/funcs, `PascalCase` components
- No signature trailers in commits (`no Co-Authored-By`)
- Commit format: `feat(home): add hero section` (max 12 words, English prefix)
- No component libraries; no backend coupling at this stage

## Out of Scope (this phase)
- Backend / database
- CMS or dynamic content
- Analytics
- i18n (all copy in pt-BR, hardcoded)
