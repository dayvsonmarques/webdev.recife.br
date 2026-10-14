'use server'

import { headers } from 'next/headers'
import { allow } from '@/lib/rate-limit'
import {
  INVESTIMENTOS,
  MATERIAIS,
  MODALIDADES,
  POLICY_VERSION,
  PRAZOS,
  QTD_ITENS,
  SIM_NAO_NAO_SEI,
  VENDE_ONLINE,
} from '@/lib/quote-options'

export interface QuoteState {
  ok?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

const RATE_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 }
const MIN_FILL_MS = 3000

const REQUIRED: Record<string, string> = {
  nome: 'Informe seu nome',
  negocio: 'Informe o nome do negócio',
  localidade: 'Informe o bairro e a cidade',
  segmento: 'Informe o segmento',
}

// Messages for fields the panel rejects (it re-validates everything).
const PANEL_FIELD_MESSAGES: Record<string, string> = {
  ...REQUIRED,
  whatsapp: 'WhatsApp inválido: use DDD + número, ex.: (81) 99999-8888',
  email: 'E-mail inválido',
  precisa: 'Escolha o que quer contratar',
}

const str = (formData: FormData, key: string) => {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : ''
}
const optional = (formData: FormData, key: string) => str(formData, key) || undefined
const oneOf = (formData: FormData, key: string, options: readonly string[]) => {
  const v = str(formData, key)
  return options.includes(v) ? v : undefined
}

const listOf = (value: string | undefined) => (value ? [value] : [])

/** "Já vende online?" → the chosen channel, or the typed one when it is "Outro". */
function salesChannel(formData: FormData) {
  if (str(formData, 'jaVendeOnline') !== 'Sim') return []
  const channel = oneOf(formData, 'vendeOnline', VENDE_ONLINE)
  if (channel !== 'Outro') return listOf(channel)
  return listOf(str(formData, 'vendeOnlineOutro').slice(0, 80) || 'Outro')
}

async function clientIp() {
  const h = await headers()
  // Behind the Coolify proxy the real client is x-real-ip, or the last x-forwarded-for hop it appended.
  return h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',').pop()?.trim() ?? 'unknown'
}

export async function submitQuote(_prev: QuoteState, formData: FormData): Promise<QuoteState> {
  // Bots: a filled hidden field or an instant submit gets a fake success and is dropped.
  const startedAt = Number(str(formData, 'startedAt'))
  if (str(formData, 'website') || !startedAt || Date.now() - startedAt < MIN_FILL_MS) return { ok: true }

  const fieldErrors: Record<string, string> = {}
  for (const [key, message] of Object.entries(REQUIRED)) if (!str(formData, key)) fieldErrors[key] = message
  const precisa = str(formData, 'precisa').slice(0, 80)
  if (!precisa) fieldErrors.precisa = PANEL_FIELD_MESSAGES.precisa
  const lojaFisica = str(formData, 'lojaFisica')
  if (lojaFisica !== 'Sim' && lojaFisica !== 'Não') fieldErrors.lojaFisica = 'Responda se tem loja física'
  if (!str(formData, 'whatsapp') && !str(formData, 'email')) fieldErrors.whatsapp = 'Informe WhatsApp ou e-mail'
  if (formData.get('consentimento') !== 'on') fieldErrors.consentimento = 'É preciso concordar para enviarmos o orçamento'
  if (Object.keys(fieldErrors).length) return { error: 'Revise os campos destacados.', fieldErrors }

  // Counted only once the form is complete, so fixing typos never locks a real person out.
  if (!allow(await clientIp(), RATE_LIMIT.max, RATE_LIMIT.windowMs)) {
    return { error: 'Muitos envios em pouco tempo. Tente de novo mais tarde ou fale com a gente pelo WhatsApp.' }
  }

  const payload = {
    nome: str(formData, 'nome'),
    whatsapp: optional(formData, 'whatsapp'),
    email: optional(formData, 'email'),
    negocio: str(formData, 'negocio'),
    localidade: str(formData, 'localidade'),
    segmento: str(formData, 'segmento'),
    lojaFisica: lojaFisica === 'Sim',
    vendeOnline: salesChannel(formData),
    precisa: [precisa],
    qtdItens: oneOf(formData, 'qtdItens', QTD_ITENS),
    pagamentoOnline: oneOf(formData, 'pagamentoOnline', SIM_NAO_NAO_SEI),
    modalidades: listOf(oneOf(formData, 'modalidades', MODALIDADES)),
    materiais: listOf(oneOf(formData, 'materiais', MATERIAIS)),
    referencias: optional(formData, 'referencias'),
    prazo: oneOf(formData, 'prazo', PRAZOS),
    investimento: oneOf(formData, 'investimento', INVESTIMENTOS),
    observacoes: optional(formData, 'observacoes'),
    consentimento: true,
    politicaVersao: POLICY_VERSION,
  }

  const base = process.env.ADMIN_API_URL
  const secret = process.env.SITE_FORM_SECRET
  if (!base || !secret) {
    console.error('[submitQuote] ADMIN_API_URL or SITE_FORM_SECRET is not set')
    return { error: 'Não foi possível enviar agora. Fale com a gente pelo WhatsApp.' }
  }

  try {
    const res = await fetch(`${base.replace(/\/$/, '')}/api/public/quotes`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${secret}` },
      body: JSON.stringify(payload),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })
    if (res.status === 422) {
      const { fields = [] } = (await res.json()) as { fields?: string[] }
      const errors = Object.fromEntries(fields.map((f) => [f.split('.')[0], PANEL_FIELD_MESSAGES[f.split('.')[0]] ?? 'Valor inválido']))
      return { error: 'Revise os campos destacados.', fieldErrors: errors }
    }
    if (!res.ok) throw new Error(`panel responded ${res.status}`)
  } catch (error) {
    console.error('[submitQuote] failed:', error)
    return { error: 'Não foi possível enviar agora. Tente de novo em instantes ou fale com a gente pelo WhatsApp.' }
  }

  return { ok: true }
}
