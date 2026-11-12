'use client'

import Link from 'next/link'
import { startTransition, useActionState, useEffect, useRef, useState } from 'react'
import { type TrialState, submitTrial } from '@/app/servicos/[slug]/testar/actions'
import { Button } from '@/components/ui/Button'
import {
  ConsentCheckbox,
  Field,
  FormAlert,
  FormSection,
  FormSuccess,
  Honeypot,
  PhoneInput,
  RequiredNote,
  Select,
  inputClass,
} from '@/components/ui/form'
import { QTD_ITENS, RETENTION_MONTHS, VENDE_ONLINE } from '@/lib/form-options'
import { STORE_DOMAIN } from '@/lib/trial'

const EMPTY: TrialState = {}
const SIM_NAO = ['Sim', 'Não'] as const

interface PlanOption {
  slug: string
  name: string
}

/** "Quero testar" form: details of the business; the panel approves it and creates the trial store. */
export function TrialForm({ product, plans, defaultPlan }: { product: string; plans: PlanOption[]; defaultPlan?: string }) {
  const [state, dispatch, pending] = useActionState(submitTrial.bind(null, product), EMPTY)
  // When the form appeared: very fast submits are treated as bots (bot check).
  const startedAt = useRef(0)
  const summary = useRef<HTMLDivElement>(null)
  const [sellsOnline, setSellsOnline] = useState('')
  const e = state.fieldErrors ?? {}

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])
  useEffect(() => {
    if (state.error || state.ok) summary.current?.focus()
  }, [state])

  if (state.ok) {
    return (
      <FormSuccess ref={summary} title="Pedido recebido!">
        A gente confere seus dados e libera sua loja de teste em até 1 dia útil. O link pra criar sua senha chega no seu
        e-mail — fique de olho também na caixa de spam.
      </FormSuccess>
    )
  }

  return (
    <form
      noValidate
      className="flex flex-col gap-12"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        data.set('startedAt', String(startedAt.current))
        startTransition(() => dispatch(data))
      }}
    >
      <FormAlert ref={summary} message={state.error} />
      <Honeypot />

      <FormSection title="Sobre você">
        <Field name="nome" label="Seu nome" required error={e.nome}>
          {(p) => <input {...p} name="nome" autoComplete="name" maxLength={120} className={inputClass} />}
        </Field>
        <div className="grid gap-6 md:grid-cols-2">
          <Field name="email" label="E-mail" required hint="O acesso à loja chega aqui." error={e.email}>
            {(p) => <input {...p} name="email" type="email" autoComplete="email" placeholder="voce@email.com" maxLength={160} className={inputClass} />}
          </Field>
          <Field name="whatsapp" label="WhatsApp" required hint="Pra gente tirar suas dúvidas." error={e.whatsapp}>
            {(p) => <PhoneInput {...p} name="whatsapp" />}
          </Field>
        </div>
      </FormSection>

      <FormSection title="Seu negócio">
        <div className="grid gap-6 md:grid-cols-2">
          <Field name="negocio" label="Nome do negócio" required hint={`Vira o endereço da loja: seunegocio.${STORE_DOMAIN}`} error={e.negocio}>
            {(p) => <input {...p} name="negocio" autoComplete="organization" maxLength={120} className={inputClass} />}
          </Field>
          <Field name="segmento" label="O que você vende?" required hint="Ex.: roupas, joias, açaí, peças de bicicleta" error={e.segmento}>
            {(p) => <input {...p} name="segmento" maxLength={120} className={inputClass} />}
          </Field>
          <Field name="localidade" label="Bairro e cidade" required error={e.localidade}>
            {(p) => <input {...p} name="localidade" placeholder="Ex.: Boa Viagem, Recife" maxLength={120} className={inputClass} />}
          </Field>
          <Field name="qtdItens" label="Quantos produtos você tem?">
            {(p) => <Select {...p} name="qtdItens" options={QTD_ITENS} defaultValue="" />}
          </Field>
          <Field name="jaVendeOnline" label="Já vende pela internet?">
            {(p) => <Select {...p} name="jaVendeOnline" options={SIM_NAO} value={sellsOnline} onChange={(ev) => setSellsOnline(ev.target.value)} />}
          </Field>
          {sellsOnline === 'Sim' && (
            <Field name="vendeOnline" label="Onde vende hoje?">
              {(p) => <Select {...p} name="vendeOnline" options={VENDE_ONLINE} defaultValue="" />}
            </Field>
          )}
          {plans.length > 0 && (
            <Field name="plano" label="Plano que quer testar">
              {(p) => (
                <div className="relative">
                  <select {...p} name="plano" defaultValue={defaultPlan ?? ''} className={`${inputClass} cursor-pointer appearance-none pr-12`}>
                    <option value="">Ainda não sei</option>
                    {plans.map((plan) => (
                      <option key={plan.slug} value={plan.slug}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                  <svg aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              )}
            </Field>
          )}
        </div>
        <Field name="observacoes" label="Quer contar mais alguma coisa?">
          {(p) => <textarea {...p} name="observacoes" rows={3} maxLength={2000} className={inputClass} />}
        </Field>
      </FormSection>

      <FormSection title="Seus dados">
        <p className="text-base text-muted">
          Usamos estas informações só para criar sua loja de teste e falar com você. Elas não são vendidas nem compartilhadas
          para publicidade. Se o pedido não seguir, apagamos tudo em até {RETENTION_MONTHS} meses — ou antes, se pedir.
          Detalhes na{' '}
          <Link href="/privacidade" className="font-semibold text-accent-ink underline">
            Política de Privacidade
          </Link>
          .
        </p>
        <ConsentCheckbox error={e.consentimento}>
          Li e concordo com o uso dos meus dados para criar a loja de teste, conforme a Política de Privacidade (LGPD).
        </ConsentCheckbox>
      </FormSection>

      <div>
        <Button type="submit" disabled={pending} arrow={!pending}>
          {pending ? 'Enviando…' : 'Pedir minha loja de teste'}
        </Button>
        <RequiredNote className="mt-4" />
      </div>
    </form>
  )
}
