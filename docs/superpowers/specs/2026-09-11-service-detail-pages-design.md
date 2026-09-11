# Design: Páginas de Detalhe por Serviço

**Data:** 2026-09-11
**Status:** Aprovado pelo usuário — pronto para plano de implementação

---

## Contexto

Hoje `webdev.recife.br` é um site de página única (só `app/page.tsx`, sem outras rotas). A seção "Serviços" (`components/Services.tsx`) mostra 3 cards (Loja Online, Cardápio Digital, Agenda Fácil) sem link algum — só ícone, título e descrição curta.

O usuário quer que cada card linke para uma página própria descrevendo aquele serviço como um produto SaaS: o que é, pra quem é, recursos, preço, e um link para começar/testar.

---

## Decisões

1. **Conteúdo:** não existe copy pronta. Quem escreve o rascunho de marketing (descrição, "pra quem é", lista de recursos) é a implementação — baseado no que já existe no site — e o usuário revisa/edita depois. Não é conteúdo definitivo.
2. **Preço:** cada página reaproveita os **3 planos já existentes no site** (Básico R$30 / Avançado R$59 / Expert R$109, de `components/Pricing.tsx`) — não é uma tabela de preço própria por serviço. Cada serviço tem um plano "recomendado" que fica destacado na sua página.
3. **Link de teste:** o botão "testar grátis" de cada página aponta para o mesmo link de WhatsApp já usado na seção Contato (`https://wa.me/55`), com uma mensagem pré-preenchida específica do serviço. **Caveat já existente e não resolvido por esta spec:** esse link não tem o número de telefone completo — o mesmo problema que já existia em `components/Contact.tsx` antes desta feature. Não piora nada, mas o número real precisa ser preenchido em algum momento (fora do escopo aqui).
4. **Arquitetura de rota:** uma rota dinâmica `app/servicos/[slug]/page.tsx` com `generateStaticParams`, não 3 pastas separadas — ver "Abordagens consideradas" abaixo.
5. **Sem página-índice `/servicos`** — a seção Serviços da home já cumpre esse papel de listagem.

### Abordagens consideradas

- **A — Rota dinâmica `/servicos/[slug]` + dados compartilhados (escolhida).** Uma página só, dados em `lib/services.ts` consumidos tanto pela home quanto pela página de detalhe. Menos código duplicado, mais fácil de manter, e já deixa a modelagem de "Serviço" alinhada com a entidade equivalente da spec pausada do painel admin (`docs/superpowers/specs/2026-08-11-studio-admin-panel-design.md`).
- **B — Três pastas explícitas** (`app/servicos/loja-online/page.tsx` etc.) — descartada: triplica boilerplate de metadata/layout sem ganho, já que as 3 páginas têm a mesma estrutura.
- **C — Expandir os cards na própria home (acordeão)** — descartada: não dá URL própria por serviço, o que era justamente o pedido (bom para SEO de "SaaS").

---

## Arquivos novos / alterados

```
lib/services.ts                 (novo)   — dados dos 3 serviços
lib/plans.ts                     (novo)   — PLANS extraído de Pricing.tsx, com um `id` por plano
lib/nav-links.ts                 (editar) — hrefs de #âncora viram absolutos (/#servicos)
components/service-icons.tsx     (novo)   — ícones (hoje inline em Services.tsx) extraídos, mapeados por id
components/Services.tsx          (editar) — consome lib/services.ts; cada card vira <Link>
components/Pricing.tsx           (editar) — consome lib/plans.ts (saída visual idêntica, só refatorado)
components/Header.tsx            (editar) — logo href="#" → href="/"
app/servicos/[slug]/page.tsx     (novo)   — página de detalhe, com generateStaticParams + generateMetadata
```

## Modelo de dados

`lib/services.ts`:

```ts
export interface Service {
  slug: string
  icon: 'bag' | 'phone' | 'calendar'
  title: string
  tagline: string          // frase curta do hero da página de detalhe
  description: string      // parágrafo "o que é"
  forWhom: string          // "pra quem é"
  features: string[]       // lista de recursos
  recommendedPlan: 'basico' | 'avancado' | 'expert'
  whatsappMessage: string  // texto pré-preenchido do botão de teste
}

export const SERVICES: Service[] = [
  { slug: 'loja-online', icon: 'bag', ... },
  { slug: 'cardapio-digital', icon: 'phone', ... },
  { slug: 'agenda-facil', icon: 'calendar', ... },
]
```

`lib/plans.ts`: mesma forma do array `PLANS` que já existe em `components/Pricing.tsx` hoje (name/price/description/featured/features), acrescido de um campo `id: 'basico' | 'avancado' | 'expert'` para que `recommendedPlan` em `Service` possa referenciar um plano por id.

## Layout de cada página (`/servicos/[slug]`)

Nesta ordem:

1. **Header** do site (compartilhado)
2. **Hero da página** — ícone grande, título, tagline, link "← Serviços" (volta para `/#servicos`), botão "Testar grátis"
3. **"O que é"** — parágrafo de descrição + "pra quem é"
4. **Recursos** — grid tipo checklist com os itens de `features`
5. **Preço** — os 3 planos existentes (mesmo visual da seção Planos da home), com o `recommendedPlan` daquele serviço destacado
6. **CTA final** — reforço + botão de teste de novo
7. **Footer** do site

Reaproveita os tokens de design (`--color-*`, `--radius-*`) e o padrão visual já estabelecido nos componentes existentes (cards com borda 1px, tipografia Syne/DM Sans). Não é obrigatório repetir a animação de scroll-reveal (`useInView`) em cada seção da página de detalhe — é uma página de conteúdo, não a landing page.

## Navegação

- Os 3 cards de `Services.tsx` na home passam a ser `<Link href={\`/servicos/\${service.slug}\`}>` em vez de `<div>` estático.
- `lib/nav-links.ts`: os hrefs (`#servicos`, `#projetos`, etc.) passam a `/#servicos`, `/#projetos`, etc., para funcionarem tanto na home quanto nas páginas novas.
- `components/Header.tsx`: a logo (`<a href="#">`) passa a `href="/"`.
- Sem rota-índice `/servicos`.

## SEO / Metadata

Cada página de detalhe usa `generateMetadata` (Next.js App Router) para definir `title` e `description` próprios por serviço — essas são páginas destinadas a indexação, diferente das seções âncora da home.

## Fora do escopo

- Número de telefone real no link do WhatsApp (caveat pré-existente, ver Decisão 3).
- Conteúdo definitivo (o usuário revisa o rascunho depois).
- Qualquer coisa relacionada ao painel administrativo (spec separada, pausada).
- Fluxo de teste/cadastro real do produto (não existe ainda; o "teste" hoje é só uma conversa de WhatsApp).
