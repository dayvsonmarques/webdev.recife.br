import type { ReactNode } from 'react'
import { cn } from './cn'

/** Raised surface with a hairline border. `interactive` adds the hover lift used on linked cards. */
export function cardClass({ interactive = false, className }: { interactive?: boolean; className?: string } = {}) {
  return cn(
    'rounded-lg border border-line bg-surface shadow-card',
    interactive && 'transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-lift focus-visible:border-gold/50',
    className,
  )
}

export function Card({ children, interactive, className }: { children: ReactNode; interactive?: boolean; className?: string }) {
  return <div className={cardClass({ interactive, className })}>{children}</div>
}
