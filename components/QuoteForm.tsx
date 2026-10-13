'use client'

import Link from 'next/link'
import { startTransition, useActionState, useEffect, useRef } from 'react'
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

import { Button } from '@/components/ui/Button'
import { Choices, ConsentCheckbox, Field, FormAlert, FormSection, FormSuccess, Honeypot, RequiredNote, inputClass } from '@/components/ui/form'

const EMPTY: QuoteState = {}

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
      <FormSuccess ref={summary} title="Pedido enviado!">
        Recebemos suas respostas. Vamos analisar e falar com você pelo WhatsApp em até 2 dias úteis.
      </FormSuccess>
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
      <FormAlert ref={summary} message={state.error} />

      <Honeypot />

      <FormSection title="Seu contato">
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
      </FormSection>

      <FormSection title="Seu negócio">
        <Field name="segmento" label="Segmento" required error={e.segmento}>
          {(p) => <input {...p} name="segmento" placeholder="Ex.: roupas, restaurante, salão de beleza" maxLength={120} className={inputClass} />}
        </Field>
        <Choices name="lojaFisica" legend="Tem loja física?" type="radio" required error={e.lojaFisica} options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]} />
        <Choices name="vendeOnline" legend="Onde já vende online hoje?" type="checkbox" options={asOptions(VENDE_ONLINE)} />
      </FormSection>

      <FormSection title="O que você precisa">
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
      </FormSection>

      <FormSection title="Detalhes">
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
      </FormSection>

      <FormSection title="Seus dados">
        <p className="text-base text-muted">
          Usamos estas informações só para analisar seu pedido e enviar o orçamento. Elas não são vendidas nem compartilhadas
          para publicidade. Se você não virar cliente, apagamos tudo em até {RETENTION_MONTHS} meses — ou antes, se pedir.
          Detalhes na{' '}
          <Link href="/privacidade" className="font-semibold text-gold-ink underline">
            Política de Privacidade
          </Link>
          .
        </p>
        <ConsentCheckbox error={e.consentimento}>
          Li e concordo com o uso dos meus dados para receber o orçamento, conforme a Política de Privacidade (LGPD).
        </ConsentCheckbox>
      </FormSection>

      <div>
        <Button type="submit" disabled={pending} arrow={!pending}>
          {pending ? 'Enviando…' : 'Enviar pedido de orçamento'}
        </Button>
        <RequiredNote className="mt-4" />
      </div>
    </form>
  )
}
