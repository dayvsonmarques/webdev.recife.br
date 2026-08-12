# Design: Painel Administrativo do Estúdio (Web Dev Recife)

**Data:** 2026-08-11
**Status:** Em andamento — pausado antes da Parte 2 (modelo de dados)
**Repositório:** este documento vive em `webdev.recife.br` por conveniência, mas o painel será um **repositório novo e separado** (ver decisão #1). Mover este arquivo para lá quando o repo for criado.

---

## Contexto

`webdev.recife.br` hoje é um site estático (Next.js App Router, sem banco, sem autenticação). Todo o conteúdo é hardcoded:
- `components/Pricing.tsx` — array `PLANS` (Básico/Avançado/Expert)
- `components/Projects.tsx` — array `PROJECTS` (3 cases: Restaurante, Salão de Beleza, Loja de Roupas)
- `components/Services.tsx` — array `SERVICES` (Loja Online, Cardápio Digital, App de Agendamento)
- `components/Contact.tsx` — apenas um link `wa.me/55` (sem número completo, sem captura de dado real)

O estúdio precisa de um painel para:
1. Gerenciar o conteúdo público do site (Planos, Cases, Leads) sem precisar redeploy
2. Gerir a operação interna do estúdio (Clientes, Projetos, Serviços prestados) "da forma correta, escalável e melhor possível" (palavras do usuário)

**Decisão de escopo:** implementar os dois de uma vez, numa única spec/implementação — sem fasear em v1/v2. O usuário foi explicitamente alertado de que isso é um projeto maior (múltiplas subsistemas) e optou por não dividir.

---

## Parte 1 — Arquitetura (✅ aprovada pelo usuário)

1. **Repositório novo e separado**, não monorepo. Motivo: este mesmo projeto já teve um incidente de deploy causado por `pnpm-workspace.yaml` (`fix(deploy): resolve pnpm 'packages field missing or empty' error`, commit `af31f50`) — juntar os dois apps num monorepo reintroduziria esse risco.
2. **Baseado no template NextAdmin** (nextadmin.co) — **Abordagem A escolhida pelo usuário**: clonar o template completo (stack: NextAuth + Prisma + Tailwind + ApexCharts + Jsvectormap + Flatpickr + Dropzone) e remover depois os dashboards não usados (e-commerce, stocks, marketing, mapas), em vez de recriar do zero ou fazer cherry-pick de componentes isolados.
3. **Banco:** PostgreSQL + Prisma (stack padrão do template). Sugestão de provedor: **Neon** (serverless, tier gratuito, boa integração com Vercel) — **não confirmado com o usuário**, é só recomendação a validar.
4. **Autenticação:** NextAuth, usuário único (o admin do estúdio), login por credenciais (email + senha com hash). Sem OAuth, sem múltiplos papéis/RBAC por enquanto — pode evoluir se o estúdio contratar alguém.
5. **Deploy:** sugerido em subdomínio próprio (ex: `admin.webdev.recife.br`), separado do deploy do site principal.
6. **Integração site ↔ admin:** o site público **não acessa o banco diretamente**. Ele consome uma API pequena exposta pelo projeto admin:
   - `GET /api/planos` → alimenta a seção Planos do site
   - `GET /api/cases` → alimenta a seção Projetos (cases de marketing) do site
   - `POST /api/leads` → recebe envios de um formulário de contato novo (a criar no site — hoje só existe o botão de WhatsApp sem captura de dado)
7. **"Projetos" são duas entidades diferentes** (confirmado com o usuário):
   - **Projeto interno** (CRM) — trabalho real de um cliente, com status/prazo/serviços. Vive só no painel, sem rota pública.
   - **Case** (marketing) — o que aparece hoje na seção pública "Projetos" do site. Pode opcionalmente se originar de um Projeto interno, mas são registros distintos.

---

## Escopo — entidades identificadas (não modeladas em detalhe ainda)

| Entidade | Natureza | Origem/equivalente atual |
|---|---|---|
| **Cliente** | CRM interno, sem rota pública | novo |
| **Projeto** (interno) | CRM interno, vinculado a Cliente | novo |
| **Serviço** | catálogo — hipótese: reaproveitar para o site público **e** para marcar o que cada Projeto incluiu (não confirmado) | `components/Services.tsx` (SERVICES) |
| **Plano** | conteúdo público, editável | `components/Pricing.tsx` (PLANS) |
| **Case** | conteúdo público, editável | `components/Projects.tsx` (PROJECTS) |
| **Lead** | capturado por formulário novo no site | novo (substitui o link `wa.me/55` solto) |

---

## Em aberto — retomar a partir daqui (Parte 2 em diante)

1. Modelo de dados completo: campos e relacionamentos de Cliente, Projeto, Serviço, Plano, Case, Lead — **nenhum schema Prisma foi definido ainda**.
2. Workflow de status do Projeto interno (ex: Orçamento → Em andamento → Concluído → Cancelado?) — não definido.
3. Confirmar se Serviço é uma entidade única compartilhada entre catálogo público e registro interno de entrega, ou duas entidades separadas.
4. Confirmar provedor de banco (Neon vs alternativa).
5. Plano de migração do conteúdo hoje hardcoded (PLANS, PROJECTS, SERVICES) para registros iniciais no banco (seed).
6. Levantar quais páginas/dependências do NextAdmin ficam vs são removidas — só dá pra decidir com o modelo de dados fechado.
7. Desenho das telas do painel (uma por entidade: Clientes, Projetos, Serviços, Planos, Cases, Leads).
8. Campos exatos do formulário de contato novo no site (nome/e-mail/mensagem/telefone?).

---

## Como continuar

Retomar com a skill `superpowers:brainstorming`, a partir da **"Parte 2 — Modelo de dados"**. Depois do desenho completo aprovado (todas as entidades + API + telas), o próximo passo do processo é a skill `superpowers:writing-plans` para gerar o plano de implementação — não pular direto para código.

## Nota — pasta de specs

`docs/superpowers/specs/` neste repositório já continha 4 specs de um projeto não relacionado ("ED Barbearia" — landing page, loja, portfólio, depoimentos), aparentemente remanescentes de um repositório/template anterior copiado para este workspace. Não fazem parte do escopo do `webdev.recife.br` atual; vale limpar ou mover para não confundir no futuro.
