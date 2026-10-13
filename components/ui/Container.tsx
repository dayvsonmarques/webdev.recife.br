import type { ReactNode } from 'react'
import { cn } from './cn'

/** Page-width wrapper with the standard side gutter. `narrow` is for reading pages and forms. */
export function Container({ children, narrow = false, className }: { children: ReactNode; narrow?: boolean; className?: string }) {
  return <div className={cn('mx-auto w-full px-6 md:px-10', narrow ? 'max-w-3xl' : 'max-w-container', className)}>{children}</div>
}
