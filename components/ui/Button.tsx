import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from './cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

const base =
  'group inline-flex items-center justify-center gap-2.5 text-center rounded-pill font-heading font-bold tracking-tight transition-[background-color,border-color,color,opacity,transform] duration-200 disabled:opacity-60 disabled:pointer-events-none'
const variants: Record<Variant, string> = {
  primary: 'bg-brand text-on-brand hover:opacity-90 active:translate-y-px',
  secondary: 'border border-line text-ink hover:border-gold-ink hover:bg-surface-2',
  ghost: 'text-gold-ink underline-offset-4 hover:underline',
}
const sizes: Record<Size, string> = {
  md: 'min-h-12 px-6 py-2.5 text-base',
  lg: 'min-h-14 px-8 py-3 text-base md:text-lg',
}

/** Class string for button-looking elements (links, buttons, menu items). */
export function buttonClass({ variant = 'primary', size = 'lg', className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], variant !== 'ghost' && sizes[size], className)
}

function Arrow() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:translate-x-1">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

interface CommonProps {
  variant?: Variant
  size?: Size
  /** Trailing arrow that nudges on hover; use on calls to action. */
  arrow?: boolean
  className?: string
  children: ReactNode
}

/** Link styled as a button. External links (http…) open in a new tab and say so to screen readers. */
export function ButtonLink({ href, variant, size, arrow, className, children, ...rest }: CommonProps & { href: string } & Omit<ComponentProps<'a'>, 'href' | 'className' | 'children'>) {
  const classes = buttonClass({ variant, size, className })
  const content = (
    <>
      {children}
      {arrow && <Arrow />}
    </>
  )
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {content}
        <span className="sr-only"> (abre em nova aba)</span>
      </a>
    )
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  )
}

/** Native button with the same look. */
export function Button({ variant, size, arrow, className, children, ...rest }: CommonProps & Omit<ComponentProps<'button'>, 'className' | 'children'>) {
  return (
    <button className={buttonClass({ variant, size, className })} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  )
}
