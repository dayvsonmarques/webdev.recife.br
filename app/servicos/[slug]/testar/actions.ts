'use server'

import { headers } from 'next/headers'
import { allow } from '@/lib/rate-limit'
import { POLICY_VERSION, QTD_ITENS, VENDE_ONLINE } from '@/lib/form-options'
import { TRIAL_PRODUCTS } from '@/lib/trial'

export interface TrialState {
  ok?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

const RATE_LIMIT = { max: 3, windowMs: 60 * 60 * 1000 }
const MIN_FILL_MS = 3000

const REQUIRED: Record<string, string> = {
  nome: 'Informe seu nome',
  email: 'Informe seu e-mail: o acesso à loja chega por lá',
  whatsapp: 'Informe seu WhatsApp',
  negocio: 'Informe o nome do negócio',
  segmento: 'Conte o que você vende',
  localidade: 'Informe o bairro e a cidade',
}

// Messages for fields the panel rejects (it re-validates everything).
const PANEL_FIELD_MESSAGES: Record<string, string> = {
  ...REQUIRED,
  whatsapp: 'WhatsApp inválido: use DDD + número, ex.: (81) 99999-8888',
  email: 'E-mail inválido',
}

const str = (formData: FormData, key: string) => {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : ''
}
const oneOf = (formData: FormData, key: string, options: readonly string[]) => {
  const v = str(formData, key)
  return options.includes(v) ? v : undefined
}

async function clientIp() {
  const h = await headers()
  // Behind the Coolify proxy the real client is x-real-ip, or the last x-forwarded-for hop it appended.
  return h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',').pop()?.trim() ?? 'unknown'
}

export async function submitTrial(product: string, _prev: TrialState, formData: FormData): Promise<TrialState> {
  if (!TRIAL_PRODUCTS.has(product)) return { error: 'Este produto ainda não tem teste. Fale com a gente pelo WhatsApp.' }
  // Bots: a filled hidden field or an instant submit gets a fake success and is dropped.
  const startedAt = Number(str(formData, 'startedAt'))
  if (str(formData, 'website') || !startedAt || Date.now() - startedAt < MIN_FILL_MS) return { ok: true }

  const fieldErrors: Record<string, string> = {}
  for (const [key, message] of Object.entries(REQUIRED)) if (!str(formData, key)) fieldErrors[key] = message
  if (formData.get('consentimento') !== 'on') fieldErrors.consentimento = 'É preciso concordar para criarmos sua loja de teste'
  if (Object.keys(fieldErrors).length) return { error: 'Revise os campos destacados.', fieldErrors }

  // Counted only once the form is complete, so fixing typos never locks a real person out.
  if (!allow(await clientIp(), RATE_LIMIT.max, RATE_LIMIT.windowMs)) {
    return { error: 'Muitos envios em pouco tempo. Tente de novo mais tarde ou fale com a gente pelo WhatsApp.' }
  }

  const channel = str(formData, 'jaVendeOnline') === 'Sim' ? oneOf(formData, 'vendeOnline', VENDE_ONLINE) : undefined
  const plano = str(formData, 'plano')
  const payload = {
    nome: str(formData, 'nome'),
    email: str(formData, 'email'),
    whatsapp: str(formData, 'whatsapp'),
    negocio: str(formData, 'negocio'),
    segmento: str(formData, 'segmento'),
    localidade: str(formData, 'localidade'),
    produto: product,
    plano: /^[a-z0-9-]{1,40}$/.test(plano) ? plano : undefined,
    qtdItens: oneOf(formData, 'qtdItens', QTD_ITENS),
    vendeOnline: channel ? [channel] : [],
    observacoes: str(formData, 'observacoes') || undefined,
    consentimento: true,
    politicaVersao: POLICY_VERSION,
  }

  const base = process.env.ADMIN_API_URL
  const secret = process.env.SITE_FORM_SECRET
  if (!base || !secret) {
    console.error('[submitTrial] ADMIN_API_URL or SITE_FORM_SECRET is not set')
    return { error: 'Não foi possível enviar agora. Fale com a gente pelo WhatsApp.' }
  }

  try {
    const res = await fetch(`${base.replace(/\/$/, '')}/api/public/trials`, {
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
    console.error('[submitTrial] failed:', error)
    return { error: 'Não foi possível enviar agora. Tente de novo em instantes ou fale com a gente pelo WhatsApp.' }
  }

  return { ok: true }
}
