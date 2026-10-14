'use client'

import Link from 'next/link'
import { startTransition, useActionState, useEffect, useRef, useState } from 'react'
import { type QuoteState, submitQuote } from '@/app/orcamento/actions'
import { Button } from '@/components/ui/Button'
import {
  ConsentCheckbox,
  ErrorText,
  Field,
  FormAlert,
  FormSection,
  FormSuccess,
  Honeypot,
  PhoneInput,
  RequiredNote,
  Select,
  inputClass,
  requiredMark,
} from '@/components/ui/form'
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
const SIM_NAO = ['Sim', 'Não'] as const

/** Quote request form; answers go to the panel (Pedidos de orçamento) through a Server Action. */
export function QuoteForm({ products }: { products: string[] }) {
  const [state, dispatch, pending] = useActionState(submitQuote, EMPTY)
  // When the form appeared: very fast submits are treated as bots. Kept in a ref, outside the
  // form, because React re-syncs hidden inputs on re-render and would wipe it after an error.
  const startedAt = useRef(0)
  const summary = useRef<HTMLDivElement>(null)
  const [sellsOnline, setSellsOnline] = useState('')
  const [channel, setChannel] = useState('')
  const e = state.fieldErrors ?? {}

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])
  useEffect(() => {
    if (state.error || state.ok) summary.current?.focus()
  }, [state])

  if (state.ok) {
    return (
      <FormSuccess ref={summary} title="Solicitação enviada!">
        Recebemos suas respostas. Vamos analisar e falar com você em até 2 dias úteis.
      </FormSuccess>
    )
  }

  return (
    <form
      noValidate
      className="flex flex-col gap-12"
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

      <FormSection title="Como falamos com você">
        <Field name="nome" label="Seu nome" required error={e.nome}>
          {(p) => <input {...p} name="nome" autoComplete="name" maxLength={120} className={inputClass} />}
        </Field>
        <fieldset className="flex flex-col gap-4" aria-describedby={['contato-hint', e.whatsapp && 'contato-error'].filter(Boolean).join(' ')}>
          <legend className="text-base font-semibold text-ink">
            WhatsApp ou e-mail
            {requiredMark}
          </legend>
          <p id="contato-hint" className="-mt-2 text-sm text-muted">
            Preencha pelo menos um. Respondemos por onde você preferir.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <Field name="whatsapp" label="WhatsApp" error={undefined}>
              {(p) => <PhoneInput {...p} aria-invalid={Boolean(e.whatsapp)} name="whatsapp" />}
            </Field>
            <Field name="email" label="E-mail" error={e.email}>
              {(p) => <input {...p} name="email" type="email" autoComplete="email" placeholder="voce@email.com" maxLength={160} className={inputClass} />}
            </Field>
          </div>
          <ErrorText id="contato-error" message={e.whatsapp} />
        </fieldset>
      </FormSection>

      <FormSection title="Seu negócio">
        <div className="grid gap-6 md:grid-cols-2">
          <Field name="negocio" label="Nome do negócio" required error={e.negocio}>
            {(p) => <input {...p} name="negocio" autoComplete="organization" maxLength={120} className={inputClass} />}
          </Field>
          <Field name="segmento" label="Segmento" required error={e.segmento}>
            {(p) => <input {...p} name="segmento" placeholder="Ex.: roupas, restaurante, salão" maxLength={120} className={inputClass} />}
          </Field>
          <Field name="localidade" label="Bairro e cidade" required error={e.localidade}>
            {(p) => <input {...p} name="localidade" placeholder="Ex.: Boa Viagem, Recife" maxLength={120} className={inputClass} />}
          </Field>
          <Field name="lojaFisica" label="Tem loja física?" required error={e.lojaFisica}>
            {(p) => <Select {...p} name="lojaFisica" options={SIM_NAO} defaultValue="" />}
          </Field>
          <Field name="jaVendeOnline" label="Já vende online?">
            {(p) => <Select {...p} name="jaVendeOnline" options={SIM_NAO} value={sellsOnline} onChange={(ev) => setSellsOnline(ev.target.value)} />}
          </Field>
          {sellsOnline === 'Sim' && (
            <Field name="vendeOnline" label="Onde vende hoje?">
              {(p) => <Select {...p} name="vendeOnline" options={VENDE_ONLINE} value={channel} onChange={(ev) => setChannel(ev.target.value)} />}
            </Field>
          )}
          {sellsOnline === 'Sim' && channel === 'Outro' && (
            <Field name="vendeOnlineOutro" label="Qual canal?">
              {(p) => <input {...p} name="vendeOnlineOutro" placeholder="Ex.: feira, OLX, catálogo próprio" maxLength={80} className={inputClass} />}
            </Field>
          )}
        </div>
      </FormSection>

      <FormSection title="O que você precisa">
        <div className="grid gap-6 md:grid-cols-2">
          <Field name="precisa" label="O que quer contratar?" required error={e.precisa}>
            {(p) => <Select {...p} name="precisa" options={products} defaultValue="" />}
          </Field>
          <Field name="qtdItens" label="Quantos produtos ou serviços?">
            {(p) => <Select {...p} name="qtdItens" options={QTD_ITENS} defaultValue="" />}
          </Field>
          <Field name="pagamentoOnline" label="Pagamento online (Pix, cartão)?">
            {(p) => <Select {...p} name="pagamentoOnline" options={SIM_NAO_NAO_SEI} defaultValue="" />}
          </Field>
          <Field name="modalidades" label="Como o cliente recebe?">
            {(p) => <Select {...p} name="modalidades" options={MODALIDADES} defaultValue="" />}
          </Field>
          <Field name="materiais" label="O que você já tem?">
            {(p) => <Select {...p} name="materiais" options={MATERIAIS} defaultValue="" />}
          </Field>
          <Field name="prazo" label="Para quando precisa?">
            {(p) => <Select {...p} name="prazo" options={PRAZOS} defaultValue="" />}
          </Field>
          <Field name="investimento" label="Quanto pretende investir?">
            {(p) => <Select {...p} name="investimento" options={INVESTIMENTOS} defaultValue="" />}
          </Field>
        </div>
      </FormSection>

      <FormSection title="Detalhes">
        <Field name="referencias" label="Sites ou lojas de que você gosta" hint="Cole os links ou escreva os nomes.">
          {(p) => <textarea {...p} name="referencias" rows={3} maxLength={1000} className={inputClass} />}
        </Field>
        <Field name="observacoes" label="Algo mais que devemos saber?">
          {(p) => <textarea {...p} name="observacoes" rows={4} maxLength={2000} className={inputClass} />}
        </Field>
      </FormSection>

      <FormSection title="Seus dados">
        <p className="text-base text-muted">
          Usamos estas informações só para analisar sua solicitação e enviar o orçamento. Elas não são vendidas nem
          compartilhadas para publicidade. Se você não virar cliente, apagamos tudo em até {RETENTION_MONTHS} meses — ou antes,
          se pedir. Detalhes na{' '}
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
          {pending ? 'Enviando…' : 'Solicitar orçamento'}
        </Button>
        <RequiredNote className="mt-4" />
      </div>
    </form>
  )
}
