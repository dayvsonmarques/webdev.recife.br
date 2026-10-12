'use client'

import Link from 'next/link'
import { type ReactNode, startTransition, useActionState, useEffect, useRef } from 'react'
import { type QuoteState, submitQuote } from '@/app/orcamento/actions'
import {
  INVESTIMENTOS,
  MATERIAIS,
  MODALIDADES,
  PRAZOS,
  QTD_ITENS,
  RETENTION_MONTHS,
  SIM_NAO_NAO_SEI,
  VENDE_ONLINE,
} from '@/lib/quote-options'

const EMPTY: QuoteState = {}

const inputClass =
  'w-full px-4 py-3 text-base border bg-[var(--color-bg)] text-[var(--color-text-primary)] border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--color-accent-text)] aria-[invalid=true]:border-[#DC2626]'

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="text-sm font-medium" style={{ color: '#DC2626' }}>
      {message}
    </p>
  )
}

function Field({ name, label, error, required, hint, children }: {
  name: string
  label: string
  error?: string
  required?: boolean
  hint?: string
  children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => ReactNode
}) {
  const describedBy = [hint && `${name}-hint`, error && `${name}-error`].filter(Boolean).join(' ') || undefined
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : <span className="font-normal" style={{ color: 'var(--color-text-muted)' }}> (opcional)</span>}
      </label>
      {hint && (
        <p id={`${name}-hint`} className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {hint}
        </p>
      )}
      {children({ id: name, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy })}
      <ErrorText id={`${name}-error`} message={error} />
    </div>
  )
}

function Choices({ name, legend, options, type, error, required }: {
  name: string
  legend: string
  options: readonly { value: string; label: string }[]
  type: 'checkbox' | 'radio'
  error?: string
  required?: boolean
}) {
  return (
    <fieldset className="flex flex-col gap-3" aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="mb-1 text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
        {legend}
        {required ? <span aria-hidden="true"> *</span> : <span className="font-normal" style={{ color: 'var(--color-text-muted)' }}> (opcional)</span>}
      </legend>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {options.map((o) => (
          <label key={o.value} className="flex min-h-11 cursor-pointer items-center gap-2.5 text-base" style={{ color: 'var(--color-text-primary)' }}>
            <input type={type} name={name} value={o.value} className="h-5 w-5 accent-[var(--color-accent-2)]" />
            {o.label}
          </label>
        ))}
      </div>
      <ErrorText id={`${name}-error`} message={error} />
    </fieldset>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-6 border-t pt-10 first:border-t-0 first:pt-0" style={{ borderColor: 'var(--color-border)' }}>
      <h2 className="font-heading text-subheading font-bold" style={{ color: 'var(--color-text-primary)' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

const asOptions = (values: readonly string[]) => values.map((v) => ({ value: v, label: v }))

/** Quote request form; answers go to the panel (Pedidos de orçamento) through a Server Action. */
export function QuoteForm({ products }: { products: string[] }) {
  const [state, dispatch, pending] = useActionState(submitQuote, EMPTY)
  // When the form appeared: very fast submits are treated as bots. Kept in a ref, outside the
  // form, because React re-syncs hidden inputs on re-render and would wipe it after an error.
  const startedAt = useRef(0)
  const summary = useRef<HTMLDivElement>(null)
  const e = state.fieldErrors ?? {}

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])
  useEffect(() => {
    if (state.error || state.ok) summary.current?.focus()
  }, [state])

  if (state.ok) {
    return (
      <div ref={summary} tabIndex={-1} role="status" className="outline-none p-10 border text-center" style={{ borderColor: 'var(--color-accent-2)', borderRadius: 'var(--radius-lg)' }}>
        <h2 className="font-heading text-subheading font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
          Pedido enviado!
        </h2>
        <p className="text-lead" style={{ color: 'var(--color-text-muted)' }}>
          Recebemos suas respostas. Vamos analisar e falar com você pelo WhatsApp em até 2 dias úteis.
        </p>
      </div>
    )
  }

  return (
    <form
      noValidate
      className="flex flex-col gap-10"
      // Submitting via onSubmit (not the action prop) keeps what was typed if validation fails.
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        data.set('startedAt', String(startedAt.current))
        startTransition(() => dispatch(data))
      }}
    >
      {state.error && (
        <div ref={summary} tabIndex={-1} role="alert" className="outline-none px-5 py-4 border text-base font-medium" style={{ borderColor: '#DC2626', color: 'var(--color-text-primary)', borderRadius: 'var(--radius-md)' }}>
          {state.error}
        </div>
      )}

      {/* Anti-spam: hidden from people, filled by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Site
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Section title="Seu contato">
        <div className="grid gap-6 md:grid-cols-2">
          <Field name="nome" label="Seu nome" required error={e.nome}>
            {(p) => <input {...p} name="nome" autoComplete="name" maxLength={120} className={inputClass} />}
          </Field>
          <Field name="whatsapp" label="WhatsApp" required error={e.whatsapp} hint="Com DDD, ex.: (81) 99999-8888">
            {(p) => <input {...p} name="whatsapp" type="tel" autoComplete="tel" inputMode="tel" maxLength={25} className={inputClass} />}
          </Field>
          <Field name="email" label="E-mail" error={e.email}>
            {(p) => <input {...p} name="email" type="email" autoComplete="email" maxLength={160} className={inputClass} />}
          </Field>
          <Field name="negocio" label="Nome do negócio" required error={e.negocio}>
            {(p) => <input {...p} name="negocio" autoComplete="organization" maxLength={120} className={inputClass} />}
          </Field>
          <Field name="localidade" label="Bairro e cidade" required error={e.localidade}>
            {(p) => <input {...p} name="localidade" placeholder="Ex.: Boa Viagem, Recife" maxLength={120} className={inputClass} />}
          </Field>
        </div>
      </Section>

      <Section title="Seu negócio">
        <Field name="segmento" label="Segmento" required error={e.segmento}>
          {(p) => <input {...p} name="segmento" placeholder="Ex.: roupas, restaurante, salão de beleza" maxLength={120} className={inputClass} />}
        </Field>
        <Choices name="lojaFisica" legend="Tem loja física?" type="radio" required error={e.lojaFisica} options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]} />
        <Choices name="vendeOnline" legend="Onde já vende online hoje?" type="checkbox" options={asOptions(VENDE_ONLINE)} />
      </Section>

      <Section title="O que você precisa">
        <Choices name="precisa" legend="O que quer contratar?" type="checkbox" required error={e.precisa} options={asOptions(products)} />
        <Field name="qtdItens" label="Quantos produtos ou serviços, mais ou menos?">
          {(p) => (
            <select {...p} name="qtdItens" defaultValue="" className={inputClass}>
              <option value="">Selecione</option>
              {QTD_ITENS.map((v) => <option key={v}>{v}</option>)}
            </select>
          )}
        </Field>
        <Choices name="pagamentoOnline" legend="Precisa de pagamento online (Pix, cartão)?" type="radio" options={asOptions(SIM_NAO_NAO_SEI)} />
        <Choices name="modalidades" legend="Como o cliente recebe?" type="checkbox" options={asOptions(MODALIDADES)} />
        <Choices name="materiais" legend="O que você já tem?" type="checkbox" options={asOptions(MATERIAIS)} />
      </Section>

      <Section title="Detalhes">
        <Field name="referencias" label="Sites ou lojas de que você gosta" hint="Cole os links ou escreva os nomes.">
          {(p) => <textarea {...p} name="referencias" rows={3} maxLength={1000} className={inputClass} />}
        </Field>
        <div className="grid gap-6 md:grid-cols-2">
          <Field name="prazo" label="Para quando precisa?">
            {(p) => (
              <select {...p} name="prazo" defaultValue="" className={inputClass}>
                <option value="">Selecione</option>
                {PRAZOS.map((v) => <option key={v}>{v}</option>)}
              </select>
            )}
          </Field>
          <Field name="investimento" label="Quanto pretende investir?">
            {(p) => (
              <select {...p} name="investimento" defaultValue="" className={inputClass}>
                <option value="">Selecione</option>
                {INVESTIMENTOS.map((v) => <option key={v}>{v}</option>)}
              </select>
            )}
          </Field>
        </div>
        <Field name="observacoes" label="Algo mais que devemos saber?">
          {(p) => <textarea {...p} name="observacoes" rows={4} maxLength={2000} className={inputClass} />}
        </Field>
      </Section>

      <Section title="Seus dados">
        <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          Usamos estas informações só para analisar seu pedido e enviar o orçamento. Elas não são vendidas nem compartilhadas
          para publicidade. Se você não virar cliente, apagamos tudo em até {RETENTION_MONTHS} meses — ou antes, se pedir.
          Detalhes na{' '}
          <Link href="/privacidade" className="underline font-semibold" style={{ color: 'var(--color-accent-text)' }}>
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex flex-col gap-2">
          <label className="flex cursor-pointer items-start gap-3 text-base" style={{ color: 'var(--color-text-primary)' }}>
            <input
              type="checkbox"
              name="consentimento"
              aria-invalid={Boolean(e.consentimento)}
              aria-describedby={e.consentimento ? 'consentimento-error' : undefined}
              className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-accent-2)]"
            />
            <span>
              Li e concordo com o uso dos meus dados para receber o orçamento, conforme a Política de Privacidade (LGPD).
              <span aria-hidden="true"> *</span>
            </span>
          </label>
          <ErrorText id="consentimento-error" message={e.consentimento} />
        </div>
      </Section>

      <div>
        <button
          type="submit"
          disabled={pending}
          className="px-8 py-4 font-heading font-bold text-base tracking-wide transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)', borderRadius: 'var(--radius-md)' }}
        >
          {pending ? 'Enviando…' : 'Enviar pedido de orçamento'}
        </button>
        <p className="mt-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <span aria-hidden="true">*</span> Campos obrigatórios
        </p>
      </div>
    </form>
  )
}
