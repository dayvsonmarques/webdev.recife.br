// Answer options of the quote form. Keep in sync with the panel's src/lib/pedidos/options.ts:
// the panel rejects any value not listed there.

/** Shown only when the person says they already sell online; "Outro" opens a text field. */
export const VENDE_ONLINE = ['Instagram', 'WhatsApp', 'iFood ou outro app de delivery', 'Site próprio', 'Marketplace (Shopee, Mercado Livre…)', 'Outro'] as const
export const PRECISA_EXTRAS = ['Site sob medida', 'Outro'] as const
export const QTD_ITENS = ['Até 20', '21 a 100', '101 a 500', 'Mais de 500', 'Não sei'] as const
export const SIM_NAO_NAO_SEI = ['Sim', 'Não', 'Não sei'] as const
export const MODALIDADES = ['Entrega', 'Retirada no local', 'Entrega e retirada', 'Só vitrine (sem venda online)'] as const
export const MATERIAIS = ['Logo, fotos e domínio', 'Logo e fotos', 'Só a logo', 'Ainda não tenho nada'] as const
export const PRAZOS = ['Até 2 semanas', 'Até 1 mês', '1 a 3 meses', 'Sem pressa'] as const
export const INVESTIMENTOS = ['Até R$ 500', 'R$ 500 a R$ 1.500', 'R$ 1.500 a R$ 3.000', 'Acima de R$ 3.000', 'Prefiro não dizer'] as const

/** Date of the current privacy policy text (app/privacidade); stored with each consent. Bump when it changes. */
export const POLICY_VERSION = '2026-10-12'
/** Unconverted requests are deleted after this many months (the panel enforces it). */
export const RETENTION_MONTHS = 12
