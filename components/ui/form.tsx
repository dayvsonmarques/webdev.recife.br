'use client'

import { type ComponentProps, type ReactNode, type Ref, useState } from 'react'
import { maskBrPhone } from '@/lib/phone-mask'
import { cn } from './cn'

// Shared building blocks of the public forms (orçamento, fale conosco).

export const inputClass =
  'w-full rounded-md border border-line bg-bg px-4 py-3.5 text-base text-ink placeholder:text-muted/70 transition-colors hover:border-muted/60 focus:border-gold-ink focus:outline-none aria-[invalid=true]:border-danger'

// Required fields get a red asterisk; optional ones carry no mark at all.
export const requiredMark = <span aria-hidden="true" className="text-danger"> *</span>

export function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="text-sm font-medium text-danger">
      {message}
    </p>
  )
}

/** Label + optional hint + control + error, wired with ids for screen readers. */
export function Field({ name, label, error, required, hint, children }: {
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
      <label htmlFor={name} className="text-base font-semibold text-ink">
        {label}
        {required && requiredMark}
      </label>
      {hint && (
        <p id={`${name}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {children({ id: name, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy })}
      <ErrorText id={`${name}-error`} message={error} />
    </div>
  )
}

/** Native select with the form's look and a custom chevron. First option is the empty placeholder. */
export function Select({ options, placeholder = 'Selecione', className, ...props }: {
  options: readonly string[]
  placeholder?: string
} & Omit<ComponentProps<'select'>, 'children'>) {
  return (
    <div className="relative">
      <select {...props} className={cn(inputClass, 'cursor-pointer appearance-none pr-12', className)}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <svg aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  )
}

/** Phone field with the Brazilian mask applied while typing. */
export function PhoneInput({ className, ...props }: Omit<ComponentProps<'input'>, 'type' | 'value' | 'onChange'>) {
  const [value, setValue] = useState('')
  return (
    <input
      {...props}
      type="tel"
      inputMode="tel"
      autoComplete="tel-national"
      placeholder="(81) 99999-8888"
      maxLength={15}
      value={value}
      onChange={(e) => setValue(maskBrPhone(e.target.value))}
      className={cn(inputClass, className)}
    />
  )
}

/** Titled block inside a long form. */
export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-7 border-t border-line pt-12 first:border-t-0 first:pt-0">
      <h2 className="font-heading text-subheading font-bold text-ink">{title}</h2>
      {children}
    </section>
  )
}

/** Anti-spam field: hidden from people, filled by bots. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Site
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  )
}

/** Error summary at the top of the form; receives focus after a failed submit. */
export function FormAlert({ message, ref }: { message?: string; ref?: Ref<HTMLDivElement> }) {
  if (!message) return null
  return (
    <div ref={ref} tabIndex={-1} role="alert" className="rounded-md border border-danger bg-surface px-5 py-4 text-base font-medium text-ink outline-none">
      {message}
    </div>
  )
}

/** Confirmation that replaces the form after a successful submit. */
export function FormSuccess({ title, children, ref }: { title: string; children: ReactNode; ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} tabIndex={-1} role="status" className="rounded-lg border border-gold/60 bg-surface p-10 text-center outline-none md:p-14">
      <h2 className="mb-3 font-heading text-subheading font-bold text-ink">{title}</h2>
      <p className="text-lead text-muted">{children}</p>
    </div>
  )
}

/** Required LGPD consent checkbox. */
export function ConsentCheckbox({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex cursor-pointer items-start gap-3 text-base text-ink">
        <input
          type="checkbox"
          name="consentimento"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'consentimento-error' : undefined}
          className="mt-1 h-5 w-5 shrink-0 accent-[var(--c-gold)]"
        />
        <span>
          {children}
          {requiredMark}
        </span>
      </label>
      <ErrorText id="consentimento-error" message={error} />
    </div>
  )
}

export function RequiredNote({ className }: { className?: string }) {
  return (
    <p className={cn('text-sm text-muted', className)}>
      <span aria-hidden="true" className="text-danger">*</span> Campos obrigatórios
    </p>
  )
}
