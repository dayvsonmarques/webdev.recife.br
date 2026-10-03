# webdev.recife.br

Site institucional do estúdio Web Dev Recife: serviços (Loja Online, Cardápio Digital, Agenda Fácil), sobre e contato.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4 + SCSS (tokens de design em `styles/_tokens.scss`)
- `next-themes` para tema claro/escuro

## Conteúdo vem do admin

Textos, serviços e planos são editados no painel (`admin.webdev.recife.br`) e lidos de `GET {ADMIN_API_URL}/api/public/site`. O admin chama `/api/revalidate` ao salvar, e o site atualiza na visita seguinte.

## Desenvolvimento

Com o admin rodando localmente (porta 3310):

```bash
cp .env.example .env.local   # ADMIN_API_URL=http://localhost:3310 e o mesmo REVALIDATE_SECRET do admin
pnpm install
pnpm dev                     # http://localhost:3210
```

## Conteúdo

| O quê | Onde |
| --- | --- |
| Textos, serviços, planos, WhatsApp | Painel admin → Site |
| Formato dos dados da API | `lib/content.ts` |
| Links do menu | `lib/nav-links.ts` |
| Cores, raios e escala tipográfica | `styles/_tokens.scss`, `app/globals.scss` |
| Vídeo do banner | `public/video/` |

## Build e deploy

```bash
pnpm build
pnpm start      # porta 3000 por padrão; use -p para mudar
```

Roda em qualquer servidor com Node.js 20+ (ex.: uma VPS), atrás de um proxy reverso com HTTPS.

Variáveis: `ADMIN_API_URL` (necessária **no build** e em execução) e `REVALIDATE_SECRET`. O admin precisa estar no ar antes do build do site. Guia completo no repositório do admin: `docs/DEPLOY.md`.

## Convenções

Padrão de commits e de código em [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md).
