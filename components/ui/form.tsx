import type { ReactNode, Ref } from 'react'
import { cn } from './cn'

// Shared building blocks of the public forms (orçamento, fale conosco).

export const inputClass =
  'w-full rounded-md border border-line bg-bg px-4 py-3.5 text-base text-ink placeholder:text-muted/70 transition-colors hover:border-muted/60 focus:border-gold-ink focus:outline-none aria-[invalid=true]:border-danger'

const optionalMark = <span className="font-normal text-muted"> (opcional)</span>
const requiredMark = <span aria-hidden="true" className="text-gold-ink"> *</span>

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
        {required ? requiredMark : optionalMark}
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

/** Group of checkboxes or radios rendered as selectable chips. */
export function Choices({ name, legend, options, type, error, required }: {
  name: string
  legend: string
  options: readonly { value: string; label: string }[]
  type: 'checkbox' | 'radio'
  error?: string
  required?: boolean
}) {
  return (
    <fieldset className="flex flex-col gap-3" aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="mb-1 text-base font-semibold text-ink">
        {legend}
        {required ? requiredMark : optionalMark}
      </legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-pill border border-line bg-bg px-4 text-base text-ink transition-colors hover:border-muted/60 has-[:checked]:border-gold-ink has-[:checked]:bg-surface-2 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold-ink"
          >
            <input type={type} name={name} value={o.value} className="h-4.5 w-4.5 accent-[var(--c-gold)]" />
            {o.label}
          </label>
        ))}
      </div>
      <ErrorText id={`${name}-error`} message={error} />
    </fieldset>
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
      <span aria-hidden="true" className="text-gold-ink">*</span> Campos obrigatórios
    </p>
  )
}
