'use client'

import Link from 'next/link'
import { type ReactNode, startTransition, useActionState, useEffect, useRef } from 'react'
import { type ContactState, submitContact } from '@/app/fale-conosco/actions'

const EMPTY: ContactState = {}

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

/** Quick contact form; answers go to the panel (Mensagens) through a Server Action. */
export function ContactForm() {
  const [state, dispatch, pending] = useActionState(submitContact, EMPTY)
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
          Mensagem enviada!
        </h2>
        <p className="text-lead" style={{ color: 'var(--color-text-muted)' }}>
          Recebemos sua mensagem. Vamos responder em até 2 dias úteis.
        </p>
      </div>
    )
  }

  return (
    <form
      noValidate
      className="flex flex-col gap-8"
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

      <Field name="nome" label="Seu nome" required error={e.nome}>
        {(p) => <input {...p} name="nome" autoComplete="name" maxLength={120} className={inputClass} />}
      </Field>

      <div className="grid gap-6 md:grid-cols-2">
        <Field name="whatsapp" label="WhatsApp" error={e.whatsapp} hint="Com DDD, ex.: (81) 99999-8888">
          {(p) => <input {...p} name="whatsapp" type="tel" autoComplete="tel" inputMode="tel" maxLength={25} className={inputClass} />}
        </Field>
        <Field name="email" label="E-mail" error={e.email}>
          {(p) => <input {...p} name="email" type="email" autoComplete="email" maxLength={160} className={inputClass} />}
        </Field>
      </div>
      <p className="-mt-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
        Preencha pelo menos um dos dois acima.
      </p>

      <Field name="mensagem" label="Mensagem" required error={e.mensagem}>
        {(p) => <textarea {...p} name="mensagem" rows={5} maxLength={2000} className={inputClass} />}
      </Field>

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
            Li e concordo com o uso dos meus dados para receber uma resposta, conforme a{' '}
            <Link href="/privacidade" className="underline font-semibold" style={{ color: 'var(--color-accent-text)' }}>
              Política de Privacidade
            </Link>{' '}
            (LGPD).
            <span aria-hidden="true"> *</span>
          </span>
        </label>
        <ErrorText id="consentimento-error" message={e.consentimento} />
      </div>

      <div>
        <button
          type="submit"
          disabled={pending}
          className="px-8 py-4 font-heading font-bold text-base tracking-wide transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)', borderRadius: 'var(--radius-md)' }}
        >
          {pending ? 'Enviando…' : 'Enviar mensagem'}
        </button>
        <p className="mt-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <span aria-hidden="true">*</span> Campos obrigatórios
        </p>
      </div>
    </form>
  )
}
