import type { ReactNode } from 'react'
import { cn } from './cn'

interface SectionProps {
  id?: string
  children: ReactNode
  /** `surface` sets the section on the alternate band color. */
  tone?: 'default' | 'surface'
  className?: string
  'aria-label'?: string
}

/**
 * Vertical rhythm for every page section. Always visible at rest (no scroll-triggered fade),
 * so anchors, fast scrolling and link previews never land on an empty band.
 */
export function Section({ id, children, tone = 'default', className, ...rest }: SectionProps) {
  return (
    <section id={id} aria-label={rest['aria-label']} className={cn('py-section', tone === 'surface' && 'bg-surface', className)}>
      {children}
    </section>
  )
}
