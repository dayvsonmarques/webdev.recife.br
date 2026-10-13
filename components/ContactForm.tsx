'use client'

import Link from 'next/link'
import { startTransition, useActionState, useEffect, useRef } from 'react'
import { type ContactState, submitContact } from '@/app/fale-conosco/actions'

import { Button } from '@/components/ui/Button'
import { ConsentCheckbox, Field, FormAlert, FormSuccess, Honeypot, RequiredNote, inputClass } from '@/components/ui/form'

const EMPTY: ContactState = {}

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
      <FormSuccess ref={summary} title="Mensagem enviada!">
        Recebemos sua mensagem. Vamos responder em até 2 dias úteis.
      </FormSuccess>
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
      <FormAlert ref={summary} message={state.error} />

      <Honeypot />

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
      <p className="-mt-4 text-sm text-muted">
        Preencha pelo menos um dos dois acima.
      </p>

      <Field name="mensagem" label="Mensagem" required error={e.mensagem}>
        {(p) => <textarea {...p} name="mensagem" rows={5} maxLength={2000} className={inputClass} />}
      </Field>

      <ConsentCheckbox error={e.consentimento}>
        Li e concordo com o uso dos meus dados para receber uma resposta, conforme a{' '}
        <Link href="/privacidade" className="font-semibold text-gold-ink underline">
          Política de Privacidade
        </Link>{' '}
        (LGPD).
      </ConsentCheckbox>

      <div>
        <Button type="submit" disabled={pending} arrow={!pending}>
          {pending ? 'Enviando…' : 'Enviar mensagem'}
        </Button>
        <RequiredNote className="mt-4" />
      </div>
    </form>
  )
}
