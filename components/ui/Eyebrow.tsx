import type { ReactNode } from 'react'
import { cn } from './cn'

/** Small uppercase label above a title, led by a short gold rule. */
export function Eyebrow({ children, className, centered = false }: { children: ReactNode; className?: string; centered?: boolean }) {
  return (
    <p className={cn('flex items-center gap-3 text-eyebrow font-semibold uppercase tracking-[0.18em] text-gold-ink', centered && 'justify-center', className)}>
      <span aria-hidden="true" className="h-px w-8 bg-gold" />
      {children}
    </p>
  )
}
