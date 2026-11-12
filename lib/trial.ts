// "Quero testar": products whose trial store is created automatically once the request is approved
// in the panel (the stores app serves them at <loja>.webdev.recife.br). Others keep the WhatsApp CTA.
export const TRIAL_PRODUCTS: ReadonlySet<string> = new Set(['loja-online', 'cardapio-digital'])

export const STORE_DOMAIN = 'webdev.recife.br'

export function trialHref(product: string, plan?: string) {
  return `/servicos/${product}/testar${plan ? `?plano=${plan}` : ''}`
}

/**
 * Pricing by monthly sales: Básico up to `basic`, Avançado up to `advanced`, Expert above it.
 * Only products listed here show the plan ladder.
 */
export const SALES_TIERS: Readonly<Record<string, { basic: number; advanced: number }>> = {
  'loja-online': { basic: 1000, advanced: 3000 },
}

/** Main call to action in the menu: the store trial is the main offer. */
export const MAIN_TRIAL_HREF = trialHref('loja-online')
