// "Quero testar": products whose trial store is created automatically once the request is approved
// in the panel (the stores app serves them at <loja>.webdev.recife.br). Others keep the WhatsApp CTA.
export const TRIAL_PRODUCTS: ReadonlySet<string> = new Set(['loja-online', 'cardapio-digital'])

export const STORE_DOMAIN = 'webdev.recife.br'

export function trialHref(product: string, plan?: string) {
  return `/servicos/${product}/testar${plan ? `?plano=${plan}` : ''}`
}

/**
 * Pricing by monthly sales: free while the store sells up to `free`, Básico up to `basic`, Avançado above it.
 * Only products listed here show the free-until-you-sell offer.
 */
export const SALES_TIERS: Readonly<Record<string, { free: number; basic: number }>> = {
  'loja-online': { free: 350, basic: 750 },
}
