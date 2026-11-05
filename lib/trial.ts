// "Quero testar": products whose trial store is created automatically once the request is approved
// in the panel (the stores app serves them at <loja>.webdev.recife.br). Others keep the WhatsApp CTA.
export const TRIAL_PRODUCTS: ReadonlySet<string> = new Set(['loja-online', 'cardapio-digital'])

export const STORE_DOMAIN = 'webdev.recife.br'

export function trialHref(product: string, plan?: string) {
  return `/servicos/${product}/testar${plan ? `?plano=${plan}` : ''}`
}
