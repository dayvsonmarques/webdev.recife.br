'use server'

import { headers } from 'next/headers'
import { allow } from '@/lib/rate-limit'
import { POLICY_VERSION } from '@/lib/quote-options'

export interface ContactState {
  ok?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

const RATE_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 }
const MIN_FILL_MS = 3000
const MAX_MESSAGE_LENGTH = 2000

const FIELD_MESSAGES: Record<string, string> = {
  nome: 'Informe seu nome',
  mensagem: 'Escreva sua mensagem',
  whatsapp: 'Informe WhatsApp ou e-mail para contato',
  email: 'E-mail inválido',
}

const str = (formData: FormData, key: string) => {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : ''
}
const optional = (formData: FormData, key: string) => str(formData, key) || undefined

async function clientIp() {
  const h = await headers()
  // Behind the Coolify proxy the real client is x-real-ip, or the last x-forwarded-for hop it appended.
  return h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',').pop()?.trim() ?? 'unknown'
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Bots: a filled hidden field or an instant submit gets a fake success and is dropped.
  const startedAt = Number(str(formData, 'startedAt'))
  if (str(formData, 'website') || !startedAt || Date.now() - startedAt < MIN_FILL_MS) return { ok: true }

  const fieldErrors: Record<string, string> = {}
  const nome = str(formData, 'nome')
  const mensagem = str(formData, 'mensagem')
  const whatsapp = optional(formData, 'whatsapp')
  const email = optional(formData, 'email')

  if (!nome) fieldErrors.nome = FIELD_MESSAGES.nome
  if (!mensagem) fieldErrors.mensagem = FIELD_MESSAGES.mensagem
  else if (mensagem.length > MAX_MESSAGE_LENGTH) fieldErrors.mensagem = `Mensagem muito longa (máx. ${MAX_MESSAGE_LENGTH} caracteres)`
  if (!whatsapp && !email) fieldErrors.whatsapp = FIELD_MESSAGES.whatsapp
  if (formData.get('consentimento') !== 'on') fieldErrors.consentimento = 'É preciso concordar para enviarmos sua mensagem'
  if (Object.keys(fieldErrors).length) return { error: 'Revise os campos destacados.', fieldErrors }

  // Counted only once the form is complete, so fixing typos never locks a real person out.
  if (!allow(await clientIp(), RATE_LIMIT.max, RATE_LIMIT.windowMs)) {
    return { error: 'Muitas mensagens em pouco tempo. Tente de novo mais tarde ou fale com a gente pelo WhatsApp.' }
  }

  const payload = {
    nome,
    whatsapp,
    email,
    mensagem,
    consentimento: true,
    politicaVersao: POLICY_VERSION,
  }

  const base = process.env.ADMIN_API_URL
  const secret = process.env.SITE_FORM_SECRET
  if (!base || !secret) {
    console.error('[submitContact] ADMIN_API_URL or SITE_FORM_SECRET is not set')
    return { error: 'Não foi possível enviar agora. Fale com a gente pelo WhatsApp.' }
  }

  try {
    const res = await fetch(`${base.replace(/\/$/, '')}/api/public/messages`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${secret}` },
      body: JSON.stringify(payload),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })
    if (res.status === 422) {
      const { fields = [] } = (await res.json()) as { fields?: string[] }
      const errors = Object.fromEntries(fields.map((f) => [f.split('.')[0], FIELD_MESSAGES[f.split('.')[0]] ?? 'Valor inválido']))
      return { error: 'Revise os campos destacados.', fieldErrors: errors }
    }
    if (!res.ok) throw new Error(`panel responded ${res.status}`)
  } catch (error) {
    console.error('[submitContact] failed:', error)
    return { error: 'Não foi possível enviar agora. Tente de novo em instantes ou fale com a gente pelo WhatsApp.' }
  }

  return { ok: true }
}
