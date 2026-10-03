# webdev.recife.br

Site institucional do estúdio Web Dev Recife: serviços (Loja Online, Cardápio Digital, Agenda Fácil), sobre e contato.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4 + SCSS (tokens de design em `styles/_tokens.scss`)
- `next-themes` para tema claro/escuro

## Desenvolvimento

```bash
pnpm install
pnpm dev        # http://localhost:3210
```

## Conteúdo

| O quê | Onde |
| --- | --- |
| Serviços e páginas de detalhe | `lib/services.ts` |
| Planos e preços | `lib/plans.ts` |
| Links do menu | `lib/nav-links.ts` |
| Cores, raios e escala tipográfica | `styles/_tokens.scss`, `app/globals.scss` |
| Vídeo do banner | `public/video/` |

## Build e deploy

```bash
pnpm build
pnpm start      # porta 3000 por padrão; use -p para mudar
```

Roda em qualquer servidor com Node.js 20+ (ex.: uma VPS), atrás de um proxy reverso com HTTPS.

## Convenções

Padrão de commits e de código em [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md).
